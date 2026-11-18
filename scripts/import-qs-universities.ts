// QS-ийн жагсаалт (620) + топ 100-ийн албан ёсны сайтаас уншсан баяжуулалтыг их сургуулийн коллекцид оруулна.
// Анхдагч нь DRY-RUN (юу ч бичихгүй). Бичихийн тулд `--apply`. Алсын (mongodb+srv) DB-д `--yes-remote` нэмэлт баталгаа шаардана.
// Шинэ бичлэг draft + unverified төлөвтэй орно. Идемпотент: QS-ээс орсон бичлэгийг л шинэчилнэ, гараар засварласан бичлэгт хүрэхгүй.
import { config } from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import mongoose from 'mongoose';
import { CountrySchema, UniversitySchema } from '../src/schemas';
import { deriveUniversity } from '../src/modules/catalog/catalog.service';
import { buildUniversity, parseCsv, QS_SOURCE_NAME } from '../src/modules/phase4/qs-import';

config();
const dataDir = path.join(__dirname, 'data');
const apply = process.argv.includes('--apply');
const remoteOk = process.argv.includes('--yes-remote');

(async () => {
  const uri = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/togsogch';
  if (apply && /^mongodb\+srv:/.test(uri) && !remoteOk) {
    console.error('Алсын DB (mongodb+srv) руу бичихийн тулд --yes-remote нэмнэ үү. Зогслоо.');
    process.exit(1);
  }
  const list = parseCsv(fs.readFileSync(path.join(dataDir, 'universities-top600-list.csv'), 'utf8'));
  const enrichFile = ['enriched-merged.csv', 'top100-merged.csv'].map((f) => path.join(dataDir, 'enrich', f)).find((f) => fs.existsSync(f));
  if (!enrichFile) throw new Error('enrich/enriched-merged.csv олдсонгүй');
  const enrichRows = parseCsv(fs.readFileSync(enrichFile, 'utf8'));
  const enrichByOrder = new Map(enrichRows.map((r) => [r.order, r]));
  const wdFile = path.join(dataDir, 'universities-wikidata.csv');
  const wdByOrder = new Map((fs.existsSync(wdFile) ? parseCsv(fs.readFileSync(wdFile, 'utf8')) : []).map((r) => [r.order, r]));

  await mongoose.connect(uri);
  const University = mongoose.model('University', UniversitySchema);
  const Country = mongoose.model('Country', CountrySchema);
  const cmap = new Map((await Country.find({ deletedAt: null }).select('slug').lean()).map((c: any) => [c.slug, c._id]));

  let created = 0, updated = 0, skippedManual = 0, failed = 0, withTuition = 0, withAdmission = 0;
  const problems: string[] = [];
  const missingCountries = new Set<string>();

  for (const row of list) {
    const built = buildUniversity(row, enrichByOrder.get(row.order), wdByOrder.get(row.order));
    if (!built.ok) { failed++; problems.push(`#${row.order} ${built.name}: ${built.errors.join('; ')}`); continue; }
    const { parsed, tuition, admission, languagesOfInstruction, intakes, warnings } = built.value;
    warnings.forEach((w) => problems.push(`#${row.order} ${row.name}: ${w}`));
    const countryId = cmap.get(parsed.countrySlug);
    if (!countryId) { failed++; missingCountries.add(parsed.countrySlug); continue; }

    const existing: any = await University.findOne({ slug: parsed.slug, deletedAt: null });
    if (existing && !String(existing.source?.sourceName ?? '').startsWith(QS_SOURCE_NAME)) { skippedManual++; continue; }
    if (tuition.length) withTuition++;
    if (admission) withAdmission++;
    existing ? updated++ : created++;
    if (!apply) continue;

    const target: any = existing ?? new University({ slug: parsed.slug, countryId, status: 'draft' });
    target.set({ ...parsed.doc, countryId, languagesOfInstruction, intakes });
    const r = parsed.ranking;
    target.rankings = (target.rankings ?? []).filter((x: any) => !(x.provider === r.provider && x.year === r.year && !x.subject));
    target.rankings.push(r);
    if (tuition.length) target.tuition = tuition;
    if (admission) target.admission = admission;
    Object.assign(target, deriveUniversity(target.toObject()));
    await target.save();
  }

  console.log(JSON.stringify({ mode: apply ? 'APPLY' : 'DRY-RUN', rows: list.length, created, updated, skippedManual, failed, withTuition, withAdmission, missingCountries: [...missingCountries] }, null, 1));
  if (problems.length) console.log(`Анхааруулга/алдаа (${problems.length}):\n` + problems.slice(0, 40).join('\n'));
  if (!apply) console.log('\nЮу ч бичигдээгүй. Бичихийн тулд: npm run import:qs -- --apply');
  await mongoose.disconnect();
})().catch((e) => { console.error(e); process.exit(1); });
