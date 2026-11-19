// Чөлөөт лицензтэй лого олдоогүй сургуулиудын логог англи Wikipedia-ийн өгүүллээс (fair use файл ч байж болно) авч
// scripts/data/university-media.json-д `logo`-оор нөхнө. Лого нь ЗӨВХӨН сургуулийг таниулах зорилготой — лицензийг
// «Чөлөөт биш» гэж ил тэмдэглэнэ (чөлөөт гэж андуурахгүй). DB-д хүрэхгүй; DB-д бичихийг apply-university-media.ts хийнэ.
// Хэрэглээ: npx ts-node scripts/fetch-nonfree-logos.ts [--limit N]
import fs from 'node:fs';
import path from 'node:path';
import type { UniversityMedia } from './fetch-university-media';

const UA = 'TogsogchEducationBot/1.0 (university directory; non-commercial research use)';
const file = path.join(__dirname, 'data', 'university-media.json');
const limit = process.argv.includes('--limit') ? Number(process.argv[process.argv.indexOf('--limit') + 1]) : Infinity;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const LOGO = /logo|seal|emblem|crest|wordmark|coat[ _]of[ _]arms|shield|signature/i;
const BAD = /flag|map|icon_|commons-logo|wikimedia|edit-clear|question_book/i;

async function getJson(url: string): Promise<any | null> {
  for (let i = 0; i < 5; i++) {
    try {
      const r = await fetch(url, { headers: { 'user-agent': UA, accept: 'application/json' }, signal: AbortSignal.timeout(25000) });
      if (r.status === 429 || r.status >= 500) { await sleep(2000 * (i + 1)); continue; }
      return r.ok ? await r.json() : null;
    } catch { await sleep(1500 * (i + 1)); }
  }
  return null;
}

(async () => {
  const items: UniversityMedia[] = JSON.parse(fs.readFileSync(file, 'utf8'));
  const todo = items.filter((m) => !m.logo).slice(0, limit);
  console.log(`Лого дутуу: ${todo.length}`);
  let found = 0, i = 0;
  for (const m of todo) {
    const ent = await getJson(`https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${m.wikidataId}&props=sitelinks&sitefilter=enwiki&format=json`);
    const title: string | undefined = ent?.entities?.[m.wikidataId]?.sitelinks?.enwiki?.title;
    if (!title) { await sleep(300); continue; }
    const list = await getJson(`https://en.wikipedia.org/api/rest_v1/page/media-list/${encodeURIComponent(title.replace(/ /g, '_'))}`);
    const files: string[] = (list?.items ?? []).filter((x: any) => x.type === 'image' && typeof x.title === 'string').map((x: any) => String(x.title).replace(/^File:/i, ''))
      .filter((f: string) => LOGO.test(f) && !BAD.test(f) && /\.(svg|png|jpe?g)$/i.test(f));
    if (!files.length) { await sleep(300); continue; }
    const info = await getJson(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(files.slice(0, 5).map((f) => `File:${f}`).join('|'))}&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=256&format=json`);
    const pages = Object.values<any>(info?.query?.pages ?? {}).filter((p) => p.imageinfo?.[0]?.thumburl);
    pages.sort((a, b) => files.indexOf(String(a.title).replace(/^File:/i, '').replace(/ /g, '_')) - files.indexOf(String(b.title).replace(/^File:/i, '').replace(/ /g, '_')));
    // чөлөөт лицензтэй эсэхийг extmetadata-аар ялгана
    const p = pages[0];
    if (p) {
      const ii = p.imageinfo[0];
      const lic = String(ii.extmetadata?.LicenseShortName?.value ?? '').replace(/<[^>]*>/g, '').trim();
      const free = /^(cc[ -]by|cc0|public domain|pd)/i.test(lic) && String(ii.extmetadata?.NonFree?.value).toLowerCase() !== 'true';
      m.logo = {
        url: ii.thumburl,
        sourceUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(String(p.title).replace(/ /g, '_'))}`,
        license: free ? lic : 'Чөлөөт биш лого (Wikipedia, сургуулийг таниулах зорилгоор)',
        ...(free ? {} : { nonFree: true }),
      } as any;
      found++;
    }
    await sleep(300);
    if (++i % 25 === 0) fs.writeFileSync(file, JSON.stringify(items, null, 1));
  }
  fs.writeFileSync(file, JSON.stringify(items, null, 1));
  console.log(JSON.stringify({ found, withLogo: items.filter((x) => x.logo).length, total: items.length }, null, 1));
})().catch((e) => { console.error(e); process.exit(1); });
