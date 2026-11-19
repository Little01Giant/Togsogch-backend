// universities-wikidata.csv-д Wikidata ID-гүй (QS-ийн нэр нь Wikidata-гийн нэртэй таараагүй) сургуулиудын QID-г хайж,
// scripts/data/universities-wikidata-extra.csv-д ШАЛГАХ боломжтойгоор бичнэ (matchedLabel, description-тэй).
// Таамаглахгүй: (1) хайлтын үр дүн их сургууль шинжтэй, (2) улс (P17) таарсан, (3) нэрийн үгийн давхцал ≥ 0.6 үед л авна.
// Хэрэглэгч CSV-г нүдээр шалгаж болно. Хэрэглээ: npx ts-node scripts/resolve-wikidata-ids.ts
import fs from 'node:fs';
import path from 'node:path';
import { parseCsv } from '../src/modules/phase4/qs-import';

const UA = 'TogsogchEducationBot/1.0 (university directory; non-commercial research use)';
const dataDir = path.join(__dirname, 'data');
const COUNTRY_QID: Record<string, string> = { singapore: 'Q334', switzerland: 'Q39', france: 'Q142', 'south-korea': 'Q884', uk: 'Q145', germany: 'Q183', italy: 'Q38', finland: 'Q33', china: 'Q148', usa: 'Q30', spain: 'Q29', russia: 'Q159', india: 'Q668', austria: 'Q40', canada: 'Q16', hungary: 'Q28', ireland: 'Q27', belgium: 'Q31' };
const UNI_DESC = /universit|institute|polytechnic|college|hochschule|école|ecole|universität|università|universidad|school/i;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function getJson(url: string): Promise<any> {
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(url, { headers: { 'user-agent': UA }, signal: AbortSignal.timeout(25000) });
      if (r.status === 429 || r.status >= 500) { await sleep(1500 * (i + 1)); continue; }
      return r.ok ? await r.json() : null;
    } catch { await sleep(1000); }
  }
  return null;
}

const tokens = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/).filter((w) => w.length > 2 && !['the', 'and', 'der', 'von', 'universitat', 'de', 'di', 'del'].includes(w));
const overlap = (a: string, b: string) => { const A = tokens(a), B = new Set(tokens(b)); return A.length ? A.filter((w) => B.has(w)).length / A.length : 0; };

/** QS-ийн нэрийг хайлтын хувилбарууд болгоно: эвдэрсэн тэмдэгт (�) бүхий үгсийг хасна, таслал/хаалтны өмнөх нэр, хаалтан доторх товчлол. */
function queries(name: string): string[] {
  const clean = name.replace(/\S*�\S*/g, ' ').replace(/\s+/g, ' ').trim();
  const q = new Set<string>([clean, clean.split(',')[0].trim(), clean.split('|')[0].trim(), clean.replace(/\(.*?\)/g, '').trim()]);
  const acr = clean.match(/\(([A-Z0-9][A-Za-z0-9 .-]{1,15})\)/)?.[1]; if (acr) q.add(acr);
  const inv = clean.match(/^(.*?),\s*University of$/i); if (inv) q.add(`University of ${inv[1]}`);
  return [...q].filter((x) => x.length > 2);
}

(async () => {
  const outFile = path.join(dataDir, 'universities-wikidata-extra.csv');
  // Өмнө олдсон мөрүүдийг хадгалж, зөвхөн үлдсэнийг дахин оролдоно (Wikidata хурдны хязгаараас болж үр дүн тогтворгүй байж болно)
  const prevLines = fs.existsSync(outFile) ? fs.readFileSync(outFile, 'utf8').split('\n').filter(Boolean) : [];
  const have = new Set(parseCsv(prevLines.join('\n')).map((r) => r.order));
  const rows = parseCsv(fs.readFileSync(path.join(dataDir, 'universities-wikidata.csv'), 'utf8')).filter((r) => !/^Q\d+$/.test(r.wikidataId) && !have.has(r.order));
  const out: string[] = prevLines.length ? prevLines : ['order,name,countrySlug,wikidataId,matchedLabel,description,score'];
  let found = 0;
  for (const r of rows) {
    const want = COUNTRY_QID[r.countrySlug];
    const cands = new Map<string, { label: string; desc: string }>();
    for (const q of queries(r.name)) {
      const j = await getJson(`https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(q)}&language=en&type=item&limit=6&format=json`);
      for (const c of j?.search ?? []) if (UNI_DESC.test(`${c.description ?? ''} ${c.label ?? ''}`) && !cands.has(c.id)) cands.set(c.id, { label: c.label ?? '', desc: c.description ?? '' });
      await sleep(500);
    }
    if (!cands.size) continue;
    const ids = [...cands.keys()].slice(0, 20);
    const ent = (await getJson(`https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${ids.join('|')}&props=claims&format=json`))?.entities ?? {};
    let best: { id: string; score: number } | null = null;
    for (const id of ids) {
      const c = cands.get(id)!;
      const countries = (ent[id]?.claims?.P17 ?? []).map((s: any) => s?.mainsnak?.datavalue?.value?.id);
      if (want && countries.length && !countries.includes(want)) continue; // улс таараагүй
      const score = Math.max(overlap(r.name.replace(/\S*�\S*/g, ' '), c.label), overlap(c.label, r.name.replace(/\S*�\S*/g, ' ')));
      if (score >= 0.6 && (!best || score > best.score)) best = { id, score };
    }
    if (best) {
      const c = cands.get(best.id)!; found++;
      out.push([r.order, `"${r.name.replace(/"/g, '""')}"`, r.countrySlug, best.id, `"${c.label.replace(/"/g, '""')}"`, `"${c.desc.replace(/"/g, '""')}"`, best.score.toFixed(2)].join(','));
    }
  }
  fs.writeFileSync(outFile, out.join('\n') + '\n', 'utf8');
  console.log(`Шинээр олдсон: ${found}/${rows.length}; нийт ${out.length - 1}`);
})();
