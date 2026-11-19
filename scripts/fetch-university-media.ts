// Сургуулийн лого, нүүр зураг, танилцуулгыг Wikidata / Wikimedia Commons / Wikipedia-аас эх сурвалж, лицензтэй нь татаж
// scripts/data/university-media.json-д хадгална. DB-д хүрэхгүй (DB-д бичихийг apply-university-media.ts хийнэ).
// Хэрэглээ: npx ts-node scripts/fetch-university-media.ts [--limit N] [--refresh]
//  - Идемпотент/үргэлжлэх: JSON-д аль хэдийн байгаа мөрийг дахин татахгүй (--refresh бол дахин татна).
//  - Зөвхөн чөлөөт лицензтэй (CC BY, CC BY-SA, CC0, Public domain) зургийг авна; бусдыг алгасна.
import fs from 'node:fs';
import path from 'node:path';
import { parseCsv } from '../src/modules/phase4/qs-import';
import { slugify } from '../src/common/slug';
import { commonsPageUrl, creditFromExtMetadata, DescriptionCredit, filePathUrl, MediaCredit, pickCommonsFiles, trimExtract } from '../src/modules/phase4/university-media';

const UA = 'TogsogchEducationBot/1.0 (university directory; non-commercial research use)';
const dataDir = path.join(__dirname, 'data');
const outFile = path.join(dataDir, 'university-media.json');
const limit = process.argv.includes('--limit') ? Number(process.argv[process.argv.indexOf('--limit') + 1]) : Infinity;
const refresh = process.argv.includes('--refresh');
const retryMissing = process.argv.includes('--retry-missing'); // лого/зураг/танилцуулга дутуу мөрийг дахин оролдоно

export interface UniversityMedia {
  order: string; slug: string; name: string; wikidataId: string; fetchedAt: string;
  /** Wikipedia өгүүллээс нөхөх оролдлого хийгдсэн (дахин оролдохгүй) */
  articleTried?: boolean;
  logo?: MediaCredit & { url: string };
  cover?: MediaCredit & { url: string };
  description?: Omit<DescriptionCredit, 'translatedByAi'> & { en: string; mn?: string; wikipediaTitle: string };
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
/** Түр зуурын алдаа (429/5xx/сүлжээ) удаа дараа гарвал FAIL — «байхгүй» (null) гэж андуурч хоосон бичлэг хадгалахгүйн тулд. */
const FAIL = Symbol('fail');
async function getJson(url: string, tries = 6): Promise<any> {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { headers: { 'user-agent': UA, accept: 'application/json' }, signal: AbortSignal.timeout(25000) });
      if (r.status === 429 || r.status >= 500) { await sleep(2000 * (i + 1)); continue; }
      if (!r.ok) return null;
      return await r.json();
    } catch { await sleep(1500 * (i + 1)); }
  }
  return FAIL;
}
const failedIds = new Set<string>();
const failedFiles = new Set<string>();
const chunk = <T,>(a: T[], n: number) => Array.from({ length: Math.ceil(a.length / n) }, (_, i) => a.slice(i * n, i * n + n));

async function wikidataEntities(ids: string[]): Promise<Record<string, any>> {
  const out: Record<string, any> = {};
  for (const part of chunk(ids, 40)) {
    const j = await getJson(`https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${part.join('|')}&props=claims|sitelinks&sitefilter=enwiki&format=json`);
    if (j === FAIL) part.forEach((id) => failedIds.add(id));
    else Object.assign(out, j?.entities ?? {});
    await sleep(500);
  }
  return out;
}

async function commonsMeta(files: string[]): Promise<Record<string, any>> {
  const out: Record<string, any> = {};
  for (const part of chunk([...new Set(files)], 40)) {
    const titles = part.map((f) => `File:${f.replace(/^File:/i, '')}`).join('|');
    const j = await getJson(`https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(titles)}&prop=imageinfo&iiprop=extmetadata&format=json`);
    if (j === FAIL) { part.forEach((f) => failedFiles.add(f.replace(/^File:/i, ''))); await sleep(500); continue; }
    const norm: Record<string, string> = {};
    for (const n of j?.query?.normalized ?? []) norm[n.to] = n.from;
    for (const p of Object.values<any>(j?.query?.pages ?? {})) {
      const from = norm[p.title] ?? p.title;
      out[String(from).replace(/^File:/i, '')] = p.imageinfo?.[0]?.extmetadata;
      out[String(p.title).replace(/^File:/i, '')] = p.imageinfo?.[0]?.extmetadata;
    }
    await sleep(500);
  }
  return out;
}

async function firstFree(files: string[], meta: Record<string, any>, width: number) {
  for (const f of files.slice(0, 10)) {
    const key = f.replace(/^File:/i, '');
    const credit = creditFromExtMetadata(key, meta[key] ?? meta[key.replace(/_/g, ' ')]);
    if (credit) return { ...credit, url: filePathUrl(key, width), sourceUrl: commonsPageUrl(key) };
  }
  return undefined;
}

const LOGO_NAME = /logo|seal|emblem|crest|wordmark|coat[ _]of[ _]arms|shield/i;
const NOT_PHOTO = /logo|seal|emblem|crest|wordmark|coat|flag|map|icon|signature|diagram|chart|portrait|symbol|banner|poster|plan|graph/i;

/** Wikipedia өгүүлэл доторх зургуудын нэр (Commons файл). Түр зуурын алдаа бол FAIL. */
async function articleFiles(title: string): Promise<string[] | typeof FAIL> {
  const j = await getJson(`https://en.wikipedia.org/api/rest_v1/page/media-list/${encodeURIComponent(title.replace(/ /g, '_'))}`);
  if (j === FAIL) return FAIL;
  return (j?.items ?? []).filter((i: any) => i.type === 'image' && typeof i.title === 'string').map((i: any) => String(i.title).replace(/^File:/i, ''));
}

/** Wikidata-д зураггүй сургуулийн лого/зургийг Wikipedia өгүүллээс хайна (лицензийг Commons-оор шалгана; чөлөөт биш бол авахгүй). */
async function articleFallback(all: UniversityMedia[]) {
  const lacking = all.filter((m) => (!m.logo || !m.cover) && !m.articleTried);
  if (!lacking.length) return 0;
  console.log(`Өгүүллээс нөхөх: ${lacking.length}`);
  const ents = await wikidataEntities(lacking.map((m) => m.wikidataId));
  let filled = 0, i = 0;
  for (const m of lacking) {
    const title = ents[m.wikidataId]?.sitelinks?.enwiki?.title as string | undefined;
    if (failedIds.has(m.wikidataId)) continue;
    if (!title) { m.articleTried = true; continue; }
    const files = await articleFiles(title);
    if (files === FAIL) continue;
    const logos = m.logo ? [] : files.filter((f) => LOGO_NAME.test(f) && /\.(svg|png)$/i.test(f)).slice(0, 6);
    const photos = m.cover ? [] : files.filter((f) => /\.jpe?g$/i.test(f) && !NOT_PHOTO.test(f)).slice(0, 8);
    failedFiles.clear();
    const meta = await commonsMeta([...logos, ...photos]);
    if ([...logos, ...photos].some((f) => failedFiles.has(f))) continue;
    const logo = await firstFree(logos, meta, 256), cover = await firstFree(photos, meta, 800);
    if (logo) { m.logo = logo; filled++; }
    if (cover) { m.cover = cover; filled++; }
    m.articleTried = true;
    await sleep(300);
    if (++i % 25 === 0) fs.writeFileSync(outFile, JSON.stringify(all, null, 1));
  }
  return filled;
}

async function main() {
  const mainRows = parseCsv(fs.readFileSync(path.join(dataDir, 'universities-wikidata.csv'), 'utf8'));
  const extraFile = path.join(dataDir, 'universities-wikidata-extra.csv'); // resolve-wikidata-ids.ts-ийн шалгагдсан үр дүн
  const extra = new Map((fs.existsSync(extraFile) ? parseCsv(fs.readFileSync(extraFile, 'utf8')) : []).map((r) => [r.order, r.wikidataId]));
  const list = mainRows.map((r) => (/^Q\d+$/.test(r.wikidataId) ? r : { ...r, wikidataId: extra.get(r.order) ?? '' })).filter((r) => /^Q\d+$/.test(r.wikidataId)).slice(0, limit);
  const prev: UniversityMedia[] = !refresh && fs.existsSync(outFile) ? JSON.parse(fs.readFileSync(outFile, 'utf8')) : [];
  const done = new Map(prev.map((m) => [m.order, m]));
  if (retryMissing) for (const m of prev) if (!m.logo || !m.cover || !m.description) done.delete(m.order);
  const todo = list.filter((r) => !done.has(r.order));
  console.log(`Нийт ${list.length}, татах ${todo.length}`);

  const entities = await wikidataEntities(todo.map((r) => r.wikidataId));
  const wanted: string[] = [];
  const plan = todo.map((r) => {
    const e = entities[r.wikidataId];
    // лого: P154, дараа нь жижиг лого/дүрс (P8972, P2910), тамга (P158), сүлд (P94) — бүгд Commons-ын лицензээр шалгагдана
    const logos = [...pickCommonsFiles(e?.claims?.P154), ...pickCommonsFiles(e?.claims?.P8972), ...pickCommonsFiles(e?.claims?.P2910), ...pickCommonsFiles(e?.claims?.P158), ...pickCommonsFiles(e?.claims?.P94)];
    const photos = pickCommonsFiles(e?.claims?.P18);
    wanted.push(...logos.slice(0, 10), ...photos.slice(0, 6));
    return { r, logos, photos, title: e?.sitelinks?.enwiki?.title as string | undefined };
  });
  const meta = await commonsMeta(wanted);

  let n = 0, skipped = 0;
  for (const { r, logos, photos, title } of plan) {
    // Түр зуурын алдаатай (Wikidata/Commons хариу ирээгүй) мөрийг хадгалахгүй — дараагийн ажиллуулалтад дахин оролдоно
    const e = entities[r.wikidataId];
    const files = [...logos.slice(0, 10), ...photos.slice(0, 6)].map((f) => f.replace(/^File:/i, ''));
    if (failedIds.has(r.wikidataId) || !e || files.some((f) => failedFiles.has(f))) { skipped++; continue; }
    const item: UniversityMedia = { order: r.order, slug: slugify(r.name), name: r.name, wikidataId: r.wikidataId, fetchedAt: new Date().toISOString() };
    item.logo = await firstFree(logos, meta, 256);
    item.cover = await firstFree(photos, meta, 800);
    if (title) {
      const s = await getJson(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, '_'))}`);
      if (s === FAIL) { skipped++; continue; }
      if (s?.type === 'standard' && s.extract) {
        item.description = { sourceName: 'Wikipedia', sourceUrl: s.content_urls?.desktop?.page ?? `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`, license: 'CC BY-SA 4.0', en: trimExtract(s.extract), wikipediaTitle: title };
      }
      await sleep(120);
    }
    done.set(r.order, item);
    if (++n % 50 === 0) { fs.writeFileSync(outFile, JSON.stringify([...done.values()], null, 1)); console.log(`${n}/${plan.length}`); }
  }
  const all = [...done.values()].sort((a, b) => Number(a.order) - Number(b.order));
  const filled = await articleFallback(all);
  console.log(`Өгүүллээс нөхсөн: ${filled}`);
  fs.writeFileSync(outFile, JSON.stringify(all, null, 1));
  console.log(JSON.stringify({ skippedTransient: skipped, total: all.length, withLogo: all.filter((x) => x.logo).length, withCover: all.filter((x) => x.cover).length, withDescription: all.filter((x) => x.description).length }, null, 1));
}
main().catch((e) => { console.error(e); process.exit(1); });
