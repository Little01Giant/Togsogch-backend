// Сургуулийн лого/нүүр зургийг татаж, УТАСНД тохируулан жижигрүүлээд (WebP) Cloudflare R2 руу хадгалж, DB-ийн хаягийг R2-ийнхээр солино.
// Лого: хамгийн ихдээ 256px (тунгалаг дэвсгэр хэвээр), нүүр зураг: 800px өргөн, чанар 78. Эх хаягийг media.*.originalUrl-д хадгална.
// Анхдагч нь DRY-RUN. `--apply --yes-remote` бол R2 руу байршуулж DB-г шинэчилнэ. Идемпотент (`.webp` R2 хаягтайг алгасна).
// Хэрэглээ: npx ts-node scripts/mirror-media-to-r2.ts [--limit N] [--apply --yes-remote]
import { config } from 'dotenv';
import mongoose from 'mongoose';
import sharp from 'sharp';
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { UniversitySchema } from '../src/schemas';

config();
const apply = process.argv.includes('--apply');
const limit = process.argv.includes('--limit') ? Number(process.argv[process.argv.indexOf('--limit') + 1]) : Infinity;
const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_PUBLIC_URL } = process.env;
const UA = 'TogsogchEducationBot/1.0 (university directory; non-commercial research use)';
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function download(url: string): Promise<Buffer | null> {
  for (let i = 0; i < 4; i++) {
    try {
      const r = await fetch(url, { headers: { 'user-agent': UA }, redirect: 'follow', signal: AbortSignal.timeout(30000) });
      if (r.status === 429 || r.status >= 500) { await sleep(2500 * (i + 1)); continue; }
      if (!r.ok || !/^image\//i.test(r.headers.get('content-type') ?? '')) return null;
      const body = Buffer.from(await r.arrayBuffer());
      return body.length > 0 && body.length <= 15 * 1024 * 1024 ? body : null;
    } catch { await sleep(1500 * (i + 1)); }
  }
  return null;
}

/** Лого → 256px дотор (тунгалаг хэвээр), нүүр зураг → 800px өргөн. WebP. Уншигдахгүй (ж: .ico) бол null. */
async function shrink(input: Buffer, kind: 'logo' | 'cover'): Promise<Buffer | null> {
  try {
    const img = sharp(input, { density: 192 }).rotate();
    return kind === 'logo'
      ? await img.resize({ width: 256, height: 256, fit: 'inside', withoutEnlargement: false, background: { r: 0, g: 0, b: 0, alpha: 0 } }).webp({ quality: 85, alphaQuality: 90 }).toBuffer()
      : await img.resize({ width: 800, withoutEnlargement: true }).webp({ quality: 78 }).toBuffer();
  } catch { return null; }
}

(async () => {
  for (const [k, v] of Object.entries({ R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_PUBLIC_URL })) if (!v) { console.error(`${k} тохируулаагүй байна (backend/.env).`); process.exit(1); }
  const uri = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/togsogch';
  if (apply && /^mongodb\+srv:/.test(uri) && !process.argv.includes('--yes-remote')) { console.error('Алсын DB-д бичихийн тулд --yes-remote нэмнэ үү.'); process.exit(1); }
  const base = R2_PUBLIC_URL!.replace(/\/+$/, '');
  const s3 = new S3Client({ region: 'auto', endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`, credentials: { accessKeyId: R2_ACCESS_KEY_ID!, secretAccessKey: R2_SECRET_ACCESS_KEY! } });
  await mongoose.connect(uri);
  const U = mongoose.model('University', UniversitySchema);
  const all: any[] = await U.find({ deletedAt: null }).select('slug logoUrl images media').lean();

  const jobs: { u: any; kind: 'logo' | 'cover'; current: string; source: string }[] = [];
  let done = 0;
  for (const u of all) for (const kind of ['logo', 'cover'] as const) {
    const current: string | undefined = kind === 'logo' ? u.logoUrl : u.images?.[0];
    if (!current) continue;
    if (current.startsWith(base) && current.endsWith('.webp')) { done++; continue; }
    jobs.push({ u, kind, current, source: u.media?.[kind]?.originalUrl ?? current });
  }
  console.log(`Дууссан: ${done}, хийх: ${jobs.length}`);
  const stat = { uploaded: 0, failedDownload: 0, failedConvert: 0, bytesBefore: 0, bytesAfter: 0 };
  if (apply) {
    for (const { u, kind, current, source } of jobs.slice(0, limit)) {
      const raw = await download(source);
      if (!raw) { stat.failedDownload++; console.warn(`Татаж чадсангүй: ${u.slug} ${kind}`); await sleep(300); continue; }
      const small = await shrink(raw, kind);
      if (!small) { stat.failedConvert++; console.warn(`Хөрвүүлж чадсангүй: ${u.slug} ${kind}`); continue; }
      const key = `universities/${u.slug}/${kind}.webp`;
      await s3.send(new PutObjectCommand({ Bucket: R2_BUCKET!, Key: key, Body: small, ContentType: 'image/webp', CacheControl: 'public, max-age=31536000, immutable' }));
      const publicUrl = `${base}/${key}`;
      const set: Record<string, any> = { [`media.${kind}.originalUrl`]: source };
      if (kind === 'logo') set.logoUrl = publicUrl; else set['images.0'] = publicUrl;
      await U.updateOne({ _id: u._id }, { $set: set });
      // өмнө нь (хэмжээ багасгаагүй) хуулагдсан R2 объект байвал устгана
      if (current.startsWith(base) && !current.endsWith('.webp')) { try { await s3.send(new DeleteObjectCommand({ Bucket: R2_BUCKET!, Key: current.slice(base.length + 1) })); } catch { /* орхино */ } }
      stat.uploaded++; stat.bytesBefore += raw.length; stat.bytesAfter += small.length;
      await sleep(300);
    }
  }
  console.log(JSON.stringify({ mode: apply ? 'APPLY' : 'DRY-RUN', ...stat, avgKB: stat.uploaded ? Math.round(stat.bytesAfter / stat.uploaded / 1024) : 0 }, null, 1));
  await mongoose.disconnect();
})().catch((e) => { console.error(e); process.exit(1); });
