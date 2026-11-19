// scripts/data/university-media.json (fetch-university-media.ts-ийн үр дүн)-г их сургуулийн коллекцид бичнэ.
// Анхдагч нь DRY-RUN. Бичихийн тулд `--apply`. Алсын (mongodb+srv) DB-д `--yes-remote` нэмэлт баталгаа шаардана.
// Дүрэм: гараар оруулсан (манай `media`-гүй) лого/зураг/танилцуулгыг ХЭЗЭЭ Ч дарж бичихгүй — зөвхөн хоосон эсвэл өмнө нь энэ скриптээр
// орсон талбарыг шинэчилнэ. Танилцуулга нь Монгол орчуулгатай (translate-university-descriptions.ts) үед л орно.
import { config } from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import mongoose from 'mongoose';
import { UniversitySchema } from '../src/schemas';
import type { UniversityMedia } from './fetch-university-media';

config();
const apply = process.argv.includes('--apply');
const remoteOk = process.argv.includes('--yes-remote');

(async () => {
  const uri = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/togsogch';
  if (apply && /^mongodb\+srv:/.test(uri) && !remoteOk) { console.error('Алсын DB (mongodb+srv) руу бичихийн тулд --yes-remote нэмнэ үү. Зогслоо.'); process.exit(1); }
  const file = path.join(__dirname, 'data', 'university-media.json');
  if (!fs.existsSync(file)) throw new Error('university-media.json олдсонгүй — эхлээд fetch-university-media.ts ажиллуулна уу');
  const items: UniversityMedia[] = JSON.parse(fs.readFileSync(file, 'utf8'));

  await mongoose.connect(uri);
  const University = mongoose.model('University', UniversitySchema);
  const stat = { items: items.length, notInDb: 0, logo: 0, cover: 0, description: 0, skippedManual: 0 };

  for (const it of items) {
    const u: any = await University.findOne({ slug: it.slug, deletedAt: null }).select('logoUrl images description media').lean();
    if (!u) { stat.notInDb++; continue; }
    const media = u.media ?? {};
    const set: Record<string, any> = {};
    // logoUrl: хоосон, эсвэл өмнө нь манай скриптээр орсон (media.logo байгаа) үед
    if (it.logo) {
      if (!u.logoUrl || media.logo) { set.logoUrl = it.logo.url; set['media.logo'] = { sourceUrl: it.logo.sourceUrl, license: it.logo.license, licenseUrl: it.logo.licenseUrl, author: it.logo.author }; stat.logo++; }
      else stat.skippedManual++;
    }
    if (it.cover) {
      if (!(u.images ?? []).length || media.cover) {
        set.images = [it.cover.url, ...(media.cover ? (u.images ?? []).slice(1) : [])];
        set['media.cover'] = { sourceUrl: it.cover.sourceUrl, license: it.cover.license, licenseUrl: it.cover.licenseUrl, author: it.cover.author };
        stat.cover++;
      } else stat.skippedManual++;
    }
    if (it.description?.mn) {
      if (!u.description || media.description) {
        set.description = it.description.mn;
        set['media.description'] = { sourceName: it.description.sourceName, sourceUrl: it.description.sourceUrl, license: it.description.license, translatedByAi: true };
        stat.description++;
      } else stat.skippedManual++;
    }
    if (apply && Object.keys(set).length) await University.updateOne({ _id: u._id }, { $set: set });
  }
  console.log(JSON.stringify({ mode: apply ? 'APPLY' : 'DRY-RUN', ...stat }, null, 1));
  await mongoose.disconnect();
})().catch((e) => { console.error(e); process.exit(1); });
