// DB-д лого/зураг/танилцуулга дутуу сургуулиудыг тоолж, жагсаана (УНШИХ ЗӨВХӨН — DB-д юу ч бичихгүй).
// Хэрэглээ: npx ts-node scripts/report-university-media-gaps.ts [--list]
import { config } from 'dotenv';
import mongoose from 'mongoose';
import { CountrySchema, UniversitySchema } from '../src/schemas';

config();
(async () => {
  await mongoose.connect(process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/togsogch');
  const University = mongoose.model('University', UniversitySchema);
  mongoose.model('Country', CountrySchema);
  const all: any[] = await University.find({ deletedAt: null }).select('slug name logoUrl images description status countryId').populate('countryId', 'slug').lean();
  const gap = (f: (u: any) => boolean) => all.filter(f);
  const noLogo = gap((u) => !u.logoUrl), noImg = gap((u) => !(u.images ?? []).length), noDesc = gap((u) => !u.description);
  const byCountry: Record<string, number> = {};
  for (const u of all.filter((x) => !x.logoUrl || !(x.images ?? []).length || !x.description)) { const c = u.countryId?.slug ?? '?'; byCountry[c] = (byCountry[c] ?? 0) + 1; }
  console.log(JSON.stringify({ total: all.length, published: all.filter((u) => u.status === 'published').length, noLogo: noLogo.length, noImage: noImg.length, noDescription: noDesc.length, gapByCountry: byCountry }, null, 1));
  if (process.argv.includes('--list')) for (const u of all.filter((x) => !x.logoUrl && !(x.images ?? []).length)) console.log(`${u.countryId?.slug ?? '?'} | ${u.slug} | ${u.name}`);
  await mongoose.disconnect();
})().catch((e) => { console.error(e); process.exit(1); });
