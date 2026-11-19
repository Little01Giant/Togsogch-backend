// DB-ийн ЗӨВ нэрээр (CSV-ийн нэр эвдэрсэн байсан) Wikipedia-д хайж, лого/танилцуулга дутуу сургуулийн Wikidata ID-г олно.
// Таамаглахгүй: улс (P17) таарах + өгүүллийн гарчигтай нэрийн үгийн давхцал ≥ 0.6 үед л авна. Үр дүнг universities-wikidata-extra.csv-д нэмнэ.
// Хэрэглээ: npx ts-node scripts/resolve-by-db-name.ts
import { config } from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import mongoose from 'mongoose';
import { CountrySchema, UniversitySchema } from '../src/schemas';
import { parseCsv } from '../src/modules/phase4/qs-import';
import { slugify } from '../src/common/slug';

config();
const UA = 'TogsogchEducationBot/1.0 (university directory; non-commercial research use)';
const dataDir = path.join(__dirname, 'data');
const COUNTRY_QID: Record<string, string> = { singapore: 'Q334', switzerland: 'Q39', france: 'Q142', 'south-korea': 'Q884', uk: 'Q145', germany: 'Q183', italy: 'Q38', finland: 'Q33', china: 'Q148', usa: 'Q30', spain: 'Q29', russia: 'Q159', india: 'Q668', austria: 'Q40', canada: 'Q16', hungary: 'Q28', ireland: 'Q27', belgium: 'Q31', australia: 'Q408', japan: 'Q17', 'new-zealand': 'Q664', sweden: 'Q34', denmark: 'Q35', poland: 'Q36', 'czech-republic': 'Q213', mongolia: 'Q711' };
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const tokens = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/).filter((w) => w.length > 2 && !['the', 'and', 'der', 'von', 'universitat', 'de', 'di', 'del', 'university', 'universite'].includes(w));
const overlap = (a: string, b: string) => { const A = tokens(a), B = new Set(tokens(b)); return A.length ? A.filter((w) => B.has(w)).length / A.length : 0; };

async function getJson(url: string): Promise<any> {
  for (let i = 0; i < 4; i++) {
    try {
      const r = await fetch(url, { headers: { 'user-agent': UA }, signal: AbortSignal.timeout(25000) });
      if (r.status === 429 || r.status >= 500) { await sleep(2000 * (i + 1)); continue; }
      return r.ok ? await r.json() : null;
    } catch { await sleep(1500); }
  }
  return null;
}

(async () => {
  await mongoose.connect(process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/togsogch');
  const University = mongoose.model('University', UniversitySchema);
  mongoose.model('Country', CountrySchema);
  const dbAll: any[] = await University.find({ deletedAt: null }).select('slug name logoUrl description images').populate('countryId', 'slug').lean();
  await mongoose.disconnect();
  const gaps = dbAll.filter((u) => !u.logoUrl || !u.description || !(u.images ?? []).length);

  const mainRows = parseCsv(fs.readFileSync(path.join(dataDir, 'universities-wikidata.csv'), 'utf8'));
  const orderBySlug = new Map(mainRows.map((r) => [slugify(r.name), r]));
  const extraFile = path.join(dataDir, 'universities-wikidata-extra.csv');
  const lines = fs.existsSync(extraFile) ? fs.readFileSync(extraFile, 'utf8').split('\n').filter(Boolean) : ['order,name,countrySlug,wikidataId,matchedLabel,description,score'];
  const haveOrder = new Set(parseCsv(lines.join('\n')).map((r) => r.order));
  const media = fs.existsSync(path.join(dataDir, 'university-media.json')) ? JSON.parse(fs.readFileSync(path.join(dataDir, 'university-media.json'), 'utf8')) : [];
  const haveSlug = new Set(media.map((m: any) => m.slug));

  const todo = gaps.filter((u) => !haveSlug.has(u.slug) && orderBySlug.has(u.slug) && !haveOrder.has(orderBySlug.get(u.slug)!.order));
  console.log(`Дутуу: ${gaps.length}, ID хайх: ${todo.length}`);
  let found = 0;
  for (const u of todo) {
    const row = orderBySlug.get(u.slug)!;
    const cs: string = u.countryId?.slug ?? row.countrySlug;
    const j = await getJson(`https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(u.name)}&gsrlimit=5&prop=pageprops&ppprop=wikibase_item&format=json`);
    const cands = Object.values<any>(j?.query?.pages ?? {}).filter((p) => p.pageprops?.wikibase_item).sort((a, b) => a.index - b.index);
    await sleep(500);
    if (!cands.length) continue;
    const ids = cands.map((p) => p.pageprops.wikibase_item);
    const ent = (await getJson(`https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${ids.join('|')}&props=claims&format=json`))?.entities ?? {};
    await sleep(500);
    let best: { id: string; title: string; score: number } | null = null;
    for (const p of cands) {
      const id = p.pageprops.wikibase_item;
      const countries = (ent[id]?.claims?.P17 ?? []).map((s: any) => s?.mainsnak?.datavalue?.value?.id);
      const isEdu = (ent[id]?.claims?.P31 ?? []).length > 0 && !!ent[id]?.claims?.P571 || !!ent[id]?.claims?.P856;
      const want = COUNTRY_QID[cs];
      if (want && countries.length && !countries.includes(want)) continue;
      if (!isEdu) continue; // тогтоосон огноо эсвэл албан ёсны сайттай байгууллага
      const score = Math.max(overlap(u.name, p.title), overlap(p.title, u.name));
      if (score >= 0.6 && (!best || score > best.score)) best = { id, title: p.title, score };
    }
    if (best) { found++; lines.push([row.order, `"${row.name.replace(/"/g, '""')}"`, row.countrySlug, best.id, `"${best.title.replace(/"/g, '""')}"`, '"via DB name search"', best.score.toFixed(2)].join(',')); console.log(`  + ${u.name} -> ${best.title} (${best.id})`); }
  }
  fs.writeFileSync(extraFile, lines.join('\n') + '\n', 'utf8');
  console.log(`Шинээр олдсон: ${found}/${todo.length}`);
})().catch((e) => { console.error(e); process.exit(1); });
