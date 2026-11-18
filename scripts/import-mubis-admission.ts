// МУБИС (2026-2027 элсэлтийн журам, А/103 тушаал) → бакалаврын хөтөлбөр бүрийн ЭЕШ-ийн хичээлийг одоо байгаа мэргэжилтэй нэгтгэж Career.entranceExams-д бичнэ.
// Оноо оруулахгүй. МУИС-тай хөтөлбөрийн нэр давхцвал ОРХИНО (МУИС-ийн мэдээллээр явна).
// Анхдагч нь dry-run; бичихийн тулд `--apply`. Идемпотент: зөвхөн МУБИС-ийн мөрийг сольно.
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { CareerSchema } from '../src/schemas';

config();

const UNIVERSITY = 'Монгол Улсын Боловсролын Их Сургууль (МУБИС)';
const SOURCE_NAME = 'МУБИС 2026–2027 оны хичээлийн жилийн бакалаврын элсэлтийн хөтөлбөрийн жагсаалт (Ректорын 2026-03-25-ны А/103 тушаал)';
const SOURCE_URL = 'https://www.msue.edu.mn/';
const YEAR = 2026;
const DATA = path.join(__dirname, 'data');

const baseName = (n: string) => n.replace(/\s*\d\+\d\s*хамтарсан\s*$/, '').replace(/\s*\([^)]*\)\s*$/, '').trim();
const norm = (n: string) => baseName(n).replace(/[,\s]+/g, ' ').toLowerCase();
const SEC = ['secondary-school-teachers-except-special-and-career-technical-education', 'middle-school-teachers-except-special-and-career-technical-education'];
const MAP: Record<string, string[]> = {
  'Боловсрол судлал': ['educational-guidance-and-career-counselors-and-advisors', 'instructional-coordinators'],
  'Багш, насан туршийн боловсрол': ['adult-basic-education-adult-secondary-education-and-english-as-a-second-language-instructors', 'self-enrichment-teachers'],
  'Багш, тусгай хэрэгцээт боловсрол': ['special-education-teachers-preschool', 'special-education-teachers-kindergarten', 'special-education-teachers-elementary-school', 'special-education-teachers-middle-school', 'special-education-teachers-secondary-school'],
  'Багш, эрүүл мэндийн боловсрол, арга зүй': ['health-education-specialists', ...SEC],
  'Архив судлал': ['archivists', 'document-management-specialists'],
  'Түүх, соёлын аялал жуулчлал': ['tour-guides-and-escorts', 'curators'],
  'Биеийн тамирын арга зүй': ['exercise-trainers-and-group-fitness-instructors', 'adapted-physical-education-specialists'],
  'Спортын дасгалжуулагч': ['coaches-and-scouts'],
  'Спорт аялал жуулчлал': ['tour-guides-and-escorts', 'recreation-workers'],
  'Спортын сэтгүүл зүй': ['news-analysts-reporters-and-journalists'],
  'График дизайн': ['graphic-designers'],
  'Хувцас дизайн': ['fashion-designers'],
  'Уран зураг': ['fine-artists-including-painters-sculptors-and-illustrators'],
  'Багш, техник спортын дасгалжуулагч': ['coaches-and-scouts'],
};

type Row = { school: string; program: string; profession: string; flags: string; g1: string[]; g2: string[] };
const lines = (f: string) => fs.readFileSync(path.join(DATA, f), 'utf8').split(/\r?\n/).filter((l) => l.trim() && !l.startsWith('#'));

(async () => {
  const apply = process.argv.includes('--apply');
  const num = new Set<string>();
  for (const f of ['num-2026-admission.txt', 'num-2026-admission-2.txt', 'num-2026-admission-3.txt']) for (const l of lines(f)) num.add(norm(l.split('|')[1]));
  const rows: Row[] = lines('mubis-2026-admission.txt').map((l) => {
    const p = l.split('|');
    if (p.length !== 6) throw new Error(`Буруу мөр: ${l}`);
    return { school: p[0], program: p[1], profession: p[2], flags: p[3], g1: p[4].split(','), g2: p[5].split(',') };
  });
  const skipped = rows.filter((r) => num.has(norm(r.program)));
  const use = rows.filter((r) => !num.has(norm(r.program)));
  const unmapped = Array.from(new Set(use.filter((r) => !MAP[r.program]).map((r) => r.program)));
  const count = (p: string) => use.filter((r) => r.program === p).length;
  const bySlug = new Map<string, Row[]>();
  for (const r of use) for (const s of MAP[r.program] ?? []) bySlug.set(s, [...(bySlug.get(s) ?? []), r]);
  console.log(`МУБИС мөр: ${rows.length}; МУИС-тай давхцсан (орхив): ${skipped.length}; оруулах: ${use.length}; холбогдсон мэргэжил: ${bySlug.size}`);
  console.log('Холбогдоогүй хөтөлбөр:', unmapped.length ? unmapped.join('; ') : 'байхгүй');

  await mongoose.connect(process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/togsogch');
  console.log(`DB: ${mongoose.connection.host}/${mongoose.connection.name}`);
  const Career = mongoose.model('Career', CareerSchema);
  const found = await Career.find({ slug: { $in: Array.from(bySlug.keys()) } }).select('slug').lean();
  const have = new Set(found.map((c) => c.slug));
  const missing = Array.from(bySlug.keys()).filter((s) => !have.has(s));
  console.log('DB-д олдоогүй slug:', missing.length ? missing.join(', ') : 'байхгүй');
  if (missing.length || unmapped.length) { console.log('Зогсов: mapping-ийг засна уу.'); await mongoose.disconnect(); process.exit(1); }
  if (!apply) { console.log('Dry-run. Бичихийн тулд --apply.'); await mongoose.disconnect(); return; }
  for (const [slug, rs] of bySlug) {
    const entries = rs.map((r) => ({
      university: UNIVERSITY, school: r.school, program: count(r.program) > 1 ? `${r.program} — ${r.profession}` : r.program, flags: r.flags || undefined, level: 'bachelor',
      baseExams: [], extraExams: [], examGroups: [{ exams: r.g1 }, { exams: r.g2 }], year: YEAR, sourceName: SOURCE_NAME, sourceUrl: SOURCE_URL,
    }));
    const cur: any = await Career.findOne({ slug }).select('entranceExams').lean();
    const keep = (cur?.entranceExams ?? []).filter((e: any) => e.university !== UNIVERSITY);
    await Career.updateOne({ slug }, { $set: { entranceExams: [...keep, ...entries] } });
  }
  console.log(`Бичигдлээ: ${bySlug.size} мэргэжил`);
  await mongoose.disconnect();
})();
