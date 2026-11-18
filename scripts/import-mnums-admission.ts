// АШУҮИС (mnums.edu.mn/admission/requirements) → бакалавр, дэд бакалаврын хөтөлбөр бүрийн ЭЕШ-ийн шаардлагыг одоо байгаа мэргэжилтэй нэгтгэж Career.entranceExams-д бичнэ.
// Шинэ мэргэжил үүсгэхгүй. Анхдагч нь dry-run; бичихийн тулд `--apply`. Идемпотент: зөвхөн АШУҮИС-ийн мөрийг сольж, бусдыг хөндөхгүй.
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { CareerSchema } from '../src/schemas';

config();

const UNIVERSITY = 'Анагаах Ухааны Шинжлэх Ухааны Үндэсний Их Сургууль (АШУҮИС)';
const SCHOOL = 'Улаанбаатар ба салбар сургуулиуд (Дархан-Уул, Говь-Алтай, Дорноговь, Архангай)';
const SOURCE_NAME = 'АШУҮИС «Тавигдах шаардлага», 2026–2027 оны хичээлийн жил';
const SOURCE_URL = 'https://mnums.edu.mn/admission/requirements';
const YEAR = 2026;

/** Түвшин + хөтөлбөр → холбох мэргэжлийн slug-ууд. */
const MAP: Record<string, string[]> = {
  'bachelor|Хүний их эмч': ['general-internal-medicine-physicians', 'family-medicine-physicians', 'neurologists'],
  'bachelor|Уламжлалт анагаахын их эмч': ['naturopathic-physicians'],
  'bachelor|Шүдний их эмч': ['dentists-general'],
  'bachelor|Био-Анагаах судлаач': ['medical-scientists-except-epidemiologists'],
  'bachelor|Нийгмийн эрүүл мэнд судлалч': ['health-education-specialists', 'community-health-workers', 'medical-and-health-services-managers'],
  'bachelor|Эм зүйч': ['pharmacists'],
  'bachelor|Хүүхдийн их эмч': ['pediatricians-general'],
  'bachelor|Зүү төөнийн их эмч': ['acupuncturists'],
  'bachelor|Эрүүл ахуй, тархвар судлаач': ['epidemiologists'],
  'bachelor|Эрүүл мэндийн мэдээлэл зүйч': ['health-informatics-specialists', 'medical-records-specialists'],
  'bachelor|Эрүүл мэндийн нийгмийн ажилтан': ['healthcare-social-workers'],
  'bachelor|Уламжлалт анагаахын засалч': ['massage-therapists'],
  'bachelor|Хөдөлмөрийн аюулгүй байдал, эрүүл ахуй': ['occupational-health-and-safety-specialists'],
  'bachelor|Эрүүл мэндийн хоол зүйч': ['dietitians-and-nutritionists'],
  'bachelor|Эдийн засагч (эрүүл мэндийн)': ['economists'],
  'bachelor|Сувилагч': ['registered-nurses'],
  'bachelor|Эх баригч': ['midwives', 'nurse-midwives'],
  'bachelor|Хөдөлгөөн засалч': ['physical-therapists'],
  'bachelor|Хөдөлмөр засалч': ['occupational-therapists'],
  'bachelor|Хэл засалч': ['speech-language-pathologists'],
  'associate|Дүрс оношилгооны техникч': ['radiologic-technologists-and-technicians'],
  'associate|Эмнэлгийн тоног төхөөрөмж ашиглалтын техникч': ['medical-equipment-repairers'],
  'associate|Нүүр амны эрүүл ахуйч': ['dental-hygienists'],
  'associate|Лабораторийн техникч': ['medical-and-clinical-laboratory-technicians'],
  'associate|Эм найруулагч': ['pharmacy-technicians'],
  'associate|Сувилагч': ['licensed-practical-and-licensed-vocational-nurses'],
  'associate|Нүүр амны техникч': ['dental-assistants'],
  'associate|Уламжлалт анагаахын сувилагч': ['licensed-practical-and-licensed-vocational-nurses'],
};

type Row = { level: string; program: string; flags: string; groups: { exams: string[]; cutoffScore: number }[] };
function load(): Row[] {
  const rows: Row[] = [];
  for (const line of fs.readFileSync(path.join(__dirname, 'data', 'mnums-2026-admission.txt'), 'utf8').split(/\r?\n/)) {
    if (!line.trim() || line.startsWith('#')) continue;
    const p = line.split('|');
    if (p.length !== 7) throw new Error(`Буруу мөр: ${line}`);
    rows.push({ level: p[0], program: p[1], flags: p[2], groups: [{ exams: p[3].split(','), cutoffScore: Number(p[4]) }, { exams: p[5].split(','), cutoffScore: Number(p[6]) }] });
  }
  return rows;
}

(async () => {
  const apply = process.argv.includes('--apply');
  const rows = load();
  const key = (r: Row) => `${r.level}|${r.program}`;
  const unmapped = rows.filter((r) => !MAP[key(r)]).map(key);
  const bySlug = new Map<string, Row[]>();
  for (const r of rows) for (const s of MAP[key(r)] ?? []) bySlug.set(s, [...(bySlug.get(s) ?? []), r]);
  console.log(`Хөтөлбөр: ${rows.length}, холбогдсон мэргэжил: ${bySlug.size}`);
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
    const entries = rs.map((r) => ({ university: UNIVERSITY, school: SCHOOL, program: r.program, flags: r.flags || undefined, level: r.level, baseExams: [], extraExams: [], examGroups: r.groups, year: YEAR, sourceName: SOURCE_NAME, sourceUrl: SOURCE_URL }));
    const cur: any = await Career.findOne({ slug }).select('entranceExams').lean();
    const keep = (cur?.entranceExams ?? []).filter((e: any) => e.university !== UNIVERSITY);
    await Career.updateOne({ slug }, { $set: { entranceExams: [...keep, ...entries] } });
  }
  console.log(`Бичигдлээ: ${bySlug.size} мэргэжил`);
  await mongoose.disconnect();
})();
