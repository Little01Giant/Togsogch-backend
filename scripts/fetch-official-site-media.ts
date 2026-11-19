// Лого/зураг дутуу сургуулиудын албан ёсны сайтаас (DB `website`, эс бөгөөс Wikidata P856) лого (apple-touch-icon / icon),
// нүүр зураг (og:image) олно. Эдгээр нь сургуулийн зохиогчийн эрхтэй материал — «таниулах зорилгоор» гэж тэмдэглэнэ.
// Анхдагч нь DRY-RUN (DB-д юу ч бичихгүй, үр дүн scripts/data/official-site-media.json). `--apply --yes-remote` бол DB-ийн ХООСОН талбарыг л нөхнө.
// Хэрэглээ: npx ts-node scripts/fetch-official-site-media.ts [--limit N] [--apply --yes-remote]
import { config } from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import mongoose from 'mongoose';
import { UniversitySchema } from '../src/schemas';

config();
const UA = 'TogsogchEducationBot/1.0 (university directory; non-commercial; contact via site owner)';
const out = path.join(__dirname, 'data', 'official-site-media.json');
const limit = process.argv.includes('--limit') ? Number(process.argv[process.argv.indexOf('--limit') + 1]) : Infinity;
const apply = process.argv.includes('--apply');
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const LICENSE = 'Сургуулийн өмч (албан ёсны сайт, таниулах зорилгоор)';

async function get(url: string, ms = 15000): Promise<Response | null> {
  try { return await fetch(url, { headers: { 'user-agent': UA, accept: 'text/html,image/*,*/*' }, redirect: 'follow', signal: AbortSignal.timeout(ms) }); } catch { return null; }
}

/** robots.txt: User-agent: * дор Disallow: / эсвэл Disallow: (нүүр) байвал хандахгүй. */
async function allowed(origin: string): Promise<boolean> {
  const r = await get(`${origin}/robots.txt`, 8000);
  if (!r || !r.ok) return true;
  let all = false;
  for (const line of (await r.text()).split(/\r?\n/)) {
    const l = line.replace(/#.*/, '').trim();
    if (/^user-agent:\s*\*/i.test(l)) all = true;
    else if (/^user-agent:/i.test(l)) all = false;
    else if (all && /^disallow:\s*\/\s*$/i.test(l)) return false;
  }
  return true;
}

const attr = (tag: string, name: string) => tag.match(new RegExp(`${name}\\s*=\\s*["']([^"']+)["']`, 'i'))?.[1];

function parse(html: string, base: string) {
  const abs = (u?: string) => { try { return u ? new URL(u.replace(/&amp;/g, '&'), base).toString() : undefined; } catch { return undefined; } };
  const metas = html.match(/<meta\b[^>]*>/gi) ?? [], links = html.match(/<link\b[^>]*>/gi) ?? [];
  const og = abs(metas.map((t) => ((attr(t, 'property') ?? attr(t, 'name')) === 'og:image' ? attr(t, 'content') : undefined)).find(Boolean));
  const icons = links.filter((t) => /icon/i.test(attr(t, 'rel') ?? '')).map((t) => ({ href: abs(attr(t, 'href')), size: parseInt((attr(t, 'sizes') ?? '0').split('x')[0], 10) || 0, apple: /apple/i.test(attr(t, 'rel') ?? ''), svg: /svg/i.test(attr(t, 'type') ?? '') || /\.svg(\?|$)/i.test(attr(t, 'href') ?? '') })).filter((i) => i.href);
  icons.sort((a, b) => Number(b.apple) - Number(a.apple) || Number(b.svg) - Number(a.svg) || b.size - a.size);
  return { og, icon: icons[0]?.href };
}

async function isImage(url?: string) {
  if (!url) return false;
  const r = await get(url, 12000);
  return !!r && r.ok && /^image\//i.test(r.headers.get('content-type') ?? '');
}

(async () => {
  const uri = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/togsogch';
  if (apply && /^mongodb\+srv:/.test(uri) && !process.argv.includes('--yes-remote')) { console.error('Алсын DB-д бичихийн тулд --yes-remote нэмнэ үү.'); process.exit(1); }
  await mongoose.connect(uri);
  const University = mongoose.model('University', UniversitySchema);
  const all: any[] = await University.find({ deletedAt: null, $or: [{ logoUrl: { $in: [null, ''] } }, { images: { $size: 0 } }] }).select('slug name logoUrl images website media').lean();
  const prev: any[] = fs.existsSync(out) ? JSON.parse(fs.readFileSync(out, 'utf8')) : [];
  const done = new Map(prev.filter((p) => p.note !== 'website байхгүй').map((p) => [p.slug, p]));
  // DB-д website байхгүй бол Wikidata-ийн албан ёсны сайт (P856)-ийг ашиглана
  const mediaFile = path.join(__dirname, 'data', 'university-media.json');
  const qids = new Map<string, string>((fs.existsSync(mediaFile) ? JSON.parse(fs.readFileSync(mediaFile, 'utf8')) : []).map((m: any) => [m.slug, m.wikidataId]));
  const need = all.filter((u) => !u.website && qids.has(u.slug));
  for (let i = 0; i < need.length; i += 40) {
    const part = need.slice(i, i + 40);
    try {
      const r = await get(`https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${part.map((u) => qids.get(u.slug)).join('|')}&props=claims&format=json`, 25000);
      const ents = r?.ok ? (await r.json()).entities ?? {} : {};
      for (const u of part) {
        const claims: any[] = ents[qids.get(u.slug)!]?.claims?.P856 ?? [];
        const best = claims.find((c) => c.rank === 'preferred') ?? claims[0];
        const url = best?.mainsnak?.datavalue?.value;
        if (typeof url === 'string' && /^https?:\/\//.test(url)) u.website = url;
      }
    } catch { /* дараагийн ажиллуулалтад дахин оролдоно */ }
    await sleep(600);
  }
  const todo = all.filter((u) => !done.has(u.slug)).slice(0, limit);
  console.log(`Дутуу: ${all.length}, шинээр шалгах: ${todo.length}`);

  for (const u of todo) {
    const rec: any = { slug: u.slug, name: u.name, checkedAt: new Date().toISOString() };
    if (!u.website) rec.note = 'website байхгүй';
    else {
      try {
        const origin = new URL(u.website).origin;
        rec.website = u.website;
        if (!(await allowed(origin))) rec.note = 'robots.txt хориглосон';
        else {
          const r = await get(u.website);
          if (!r || !r.ok) rec.note = `нээгдсэнгүй${r ? ` (${r.status})` : ''}`;
          else {
            const { og, icon } = parse((await r.text()).slice(0, 400000), r.url || u.website);
            if (!u.logoUrl && (await isImage(icon))) rec.logo = icon;
            if (!(u.images ?? []).length && (await isImage(og))) rec.cover = og;
            if (!rec.logo && !rec.cover) rec.note = 'зураг олдсонгүй';
          }
        }
      } catch { rec.note = 'website хаяг буруу'; }
    }
    done.set(u.slug, rec);
    fs.writeFileSync(out, JSON.stringify([...done.values()], null, 1));
    await sleep(1500);
  }

  const items = [...done.values()];
  const stat = { checked: items.length, withLogo: items.filter((i) => i.logo).length, withCover: items.filter((i) => i.cover).length, noWebsite: items.filter((i) => i.note === 'website байхгүй').length, written: 0 };
  if (apply) {
    for (const it of items) {
      const u: any = await University.findOne({ slug: it.slug, deletedAt: null }).select('logoUrl images').lean();
      if (!u) continue;
      const set: Record<string, any> = {};
      if (it.logo && !u.logoUrl) { set.logoUrl = it.logo; set['media.logo'] = { sourceUrl: it.website, license: LICENSE }; }
      if (it.cover && !(u.images ?? []).length) { set.images = [it.cover]; set['media.cover'] = { sourceUrl: it.website, license: LICENSE }; }
      if (Object.keys(set).length) { await University.updateOne({ _id: u._id }, { $set: set }); stat.written++; }
    }
  }
  console.log(JSON.stringify({ mode: apply ? 'APPLY' : 'DRY-RUN', ...stat }, null, 1));
  await mongoose.disconnect();
})().catch((e) => { console.error(e); process.exit(1); });
