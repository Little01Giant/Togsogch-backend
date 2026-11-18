// Монголын их сургуулиудыг (албан ёсны сайтаас цуглуулсан JSON: scripts/data/mongolia/*.json) DB-д оруулна.
// Анхдагч нь DRY-RUN. Бичихийн тулд `--apply`; алсын (mongodb+srv) DB-д мөн `--yes-remote`. `--publish` нэмбэл status=published.
// Идемпотент: slug-аар upsert. Зөвхөн энэ скриптээс орсон (sourceName өмнөх тэмдэгтэй) бичлэгт хүрнэ.
import { config } from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import mongoose from 'mongoose';
import { CountrySchema, UniversitySchema } from '../src/schemas';
import { deriveUniversity } from '../src/modules/catalog/catalog.service';
import { slugify } from '../src/common/slug';

config();
const dir = path.join(__dirname, 'data', 'mongolia');
const apply = process.argv.includes('--apply');
const publish = process.argv.includes('--publish');
const remoteOk = process.argv.includes('--yes-remote');
export const MN_SOURCE_NAME = 'Сургуулийн албан ёсны сайт (Монгол)';
const https = (s: any) => typeof s === 'string' && /^https?:\/\/\S+$/.test(s);
const LEVELS = ['bachelor', 'master', 'phd'];
const PROV = ['QS_WORLD', 'QS_ASIA', 'THE_WORLD', 'THE_ASIA', 'ARWU', 'OTHER'];
const INTAKE: Record<string, string> = { fall: 'fall', autumn: 'fall', spring: 'spring', summer: 'summer', winter: 'winter' };
const num = (v: any) => (typeof v === 'number' && isFinite(v) && v >= 0 ? v : undefined);

function build(j: any) {
  const warnings: string[] = [];
  if (!j?.name || !https(j.website)) return { ok: false as const, errors: ['name/website шаардлагатай'] };
  const dormNote = j.dorm && (j.dorm.note || j.dorm.annualCost != null)
    ? `Дотуур байр: ${[j.dorm.annualCost != null ? `${j.dorm.annualCost} ${j.dorm.currency ?? ''}/жил` : '', j.dorm.note ?? ''].filter(Boolean).join(' — ')}`
    : '';
  const tuition: any[] = [];
  for (const t of j.tuition ?? []) {
    if (!LEVELS.includes(t.level) || num(t.annualFee) == null || !/^[A-Z]{3}$/.test(t.currency ?? '') || !https(t.sourceUrl)) { warnings.push(`төлбөр алгасав: ${JSON.stringify(t).slice(0, 120)}`); continue; }
    const max = num(t.annualFeeMax);
    tuition.push({
      level: t.level, academicYear: t.academicYear || undefined, currency: t.currency, annualFee: t.annualFee,
      ...(max != null && max > t.annualFee ? { annualFeeMax: max } : {}),
      feeType: t.audience === 'domestic' ? 'domestic' : 'international',
      otherFees: [t.note, dormNote].filter(Boolean).join('. ') || undefined,
      isEstimate: max != null && max > t.annualFee,
      sourceUrl: t.sourceUrl,
    });
  }
  const a = j.admission ?? {};
  const englishTests: any[] = [];
  if (a.ieltsMin != null) englishTests.push({ test: 'IELTS', minScore: String(a.ieltsMin) });
  if (a.toeflMin != null) englishTests.push({ test: 'TOEFL', minScore: String(a.toeflMin) });
  const deadlines = (a.deadlines ?? []).filter((d: any) => typeof d === 'string' && d).map((d: string) => { const i = d.indexOf(':'); return i > 0 ? { label: d.slice(0, i).trim(), date: d.slice(i + 1).trim() } : { label: 'Application', date: d }; });
  const applicationLinks = https(a.applicationUrl) ? [{ title: 'Application', url: a.applicationUrl }] : [];
  const requirements = (a.requirements ?? []).filter((x: any) => typeof x === 'string' && x);
  const admission = englishTests.length || deadlines.length || applicationLinks.length || requirements.length ? { englishTests, deadlines, applicationLinks, requirements } : undefined;
  const intakes = [...new Set((a.intakes ?? []).map((s: string) => INTAKE[String(s).toLowerCase()]).filter(Boolean))];
  const rankings = (j.rankings ?? []).filter((r: any) => PROV.includes(r.provider) && typeof r.year === 'number' && https(r.sourceUrl) && (r.rankText || typeof r.rank === 'number'))
    .map((r: any) => ({ provider: r.provider, rank: typeof r.rank === 'number' ? r.rank : undefined, rankText: r.rankText || undefined, year: r.year, sourceUrl: r.sourceUrl }));
  const scholarships = (j.scholarships ?? []).filter((s: any) => s?.name).map((s: any) => ({ name: s.name, coverage: s.coverage || undefined, url: https(s.url) ? s.url : undefined }));
  const sources: string[] = (j.sources ?? []).filter(https);
  const doc: any = {
    name: j.name, nameMn: j.nameMn || undefined, city: j.city || 'Ulaanbaatar', website: j.website,
    type: ['public', 'private'].includes(j.type) ? j.type : undefined, foundedYear: typeof j.foundedYear === 'number' && j.foundedYear > 1800 && j.foundedYear <= 2026 ? j.foundedYear : undefined,
    description: j.descriptionMn || undefined,
    degreeLevels: (j.degreeLevels ?? []).filter((l: string) => LEVELS.includes(l)),
    subjects: (j.subjects ?? []).filter((s: any) => typeof s === 'string' && s),
    languagesOfInstruction: (j.languagesOfInstruction ?? []).filter((s: any) => typeof s === 'string' && s),
    intakes, acceptsInternational: true,
    source: { sourceName: MN_SOURCE_NAME, sourceUrl: sources[0] ?? j.website, sourceType: 'official_university', academicYear: '2025-2026', fetchedAt: new Date(), lastUpdatedAt: new Date(), reliabilityStatus: 'primary', verificationStatus: 'unverified' },
  };
  Object.keys(doc).forEach((k) => (doc[k] === undefined || (Array.isArray(doc[k]) && !doc[k].length && k !== 'degreeLevels')) && delete doc[k]);
  return { ok: true as const, slug: slugify(j.name), doc, tuition, admission, rankings, scholarships, warnings };
}

(async () => {
  const uri = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/togsogch';
  if (apply && /^mongodb\+srv:/.test(uri) && !remoteOk) { console.error('Алсын DB руу бичихийн тулд --yes-remote нэмнэ үү. Зогслоо.'); process.exit(1); }
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));
  await mongoose.connect(uri);
  const Country = mongoose.model('Country', CountrySchema);
  const University = mongoose.model('University', UniversitySchema);
  let country: any = await Country.findOne({ slug: 'mongolia', deletedAt: null });
  console.log(country ? 'Монгол улс: байна' : 'Монгол улс: шинээр үүсгэнэ');
  if (!country && apply) {
    country = await Country.create({ slug: 'mongolia', code: 'MN', nameMn: 'Монгол', nameEn: 'Mongolia', region: 'Ази', status: publish ? 'published' : 'draft', flag: '🇲🇳' });
  }
  let created = 0, updated = 0, skipped = 0;
  for (const f of files) {
    const j = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    const b = build(j);
    if (!b.ok) { console.log(`${f}: алгасав — ${b.errors.join('; ')}`); skipped++; continue; }
    b.warnings.forEach((w) => console.log(`${f}: ${w}`));
    const existing: any = await University.findOne({ slug: b.slug, deletedAt: null });
    if (existing && existing.source?.sourceName !== MN_SOURCE_NAME) { console.log(`${f}: гараар/өөр эх сурвалжтай бичлэг байна — алгасав`); skipped++; continue; }
    console.log(`${b.slug.padEnd(55)} төлбөр=${b.tuition.length} элсэлт=${b.admission ? 'тийм' : 'үгүй'} ранк=${b.rankings.length} тэтгэлэг=${b.scholarships.length}`);
    existing ? updated++ : created++;
    if (!apply) continue;
    const target: any = existing ?? new University({ slug: b.slug, countryId: country._id, status: publish ? 'published' : 'draft' });
    target.set({ ...b.doc, countryId: country._id });
    target.tuition = b.tuition;
    if (b.admission) target.admission = b.admission;
    if (b.rankings.length) target.rankings = b.rankings;
    if (b.scholarships.length) target.scholarships = b.scholarships;
    if (publish) target.status = 'published';
    Object.assign(target, deriveUniversity(target.toObject()));
    await target.save();
  }
  if (apply && country) await Country.updateOne({ _id: country._id }, { $set: { universityCount: await University.countDocuments({ countryId: country._id, deletedAt: null }) } });
  console.log(JSON.stringify({ mode: apply ? 'APPLY' : 'DRY-RUN', files: files.length, created, updated, skipped }));
  await mongoose.disconnect();
})().catch((e) => { console.error(e); process.exit(1); });
