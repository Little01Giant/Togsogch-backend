// Улс тутмын бакалаврын төлбөрийн БАРИМЖАА хүрээг сургуулиудын цуглуулсан төлбөрөөс тооцож Country.tuitionEstimate-д хадгална.
// Анхдагч нь DRY-RUN. Бичихийн тулд `--apply`; алсын (mongodb+srv) DB-д мөн `--yes-remote`.
import { config } from 'dotenv';
import mongoose from 'mongoose';
import { CountrySchema, UniversitySchema } from '../src/schemas';
import { computeTuitionEstimate, officialEstimate } from '../src/modules/phase4/tuition-estimate';

config();
const apply = process.argv.includes('--apply');
const remoteOk = process.argv.includes('--yes-remote');

(async () => {
  const uri = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/togsogch';
  if (apply && /^mongodb\+srv:/.test(uri) && !remoteOk) {
    console.error('Алсын DB руу бичихийн тулд --yes-remote нэмнэ үү. Зогслоо.');
    process.exit(1);
  }
  await mongoose.connect(uri);
  const Country = mongoose.model('Country', CountrySchema);
  const University = mongoose.model('University', UniversitySchema);
  const countries: any[] = await Country.find({ deletedAt: null }).select('slug').lean();
  let withEstimate = 0;
  for (const c of countries) {
    const unis: any[] = await University.find({ countryId: c._id, status: 'published', deletedAt: null, 'tuition.0': { $exists: true } }).select('tuition').lean();
    // Албан ёсны улсын эх сурвалж (Study in Sweden, SDU) байвал түүнийг илүүд үзнэ: хоёрдогч эх сурвалжтай хүрээний доод хязгаараас гаргасан тооцоо биш.
    // Улсын баримжааг зөвхөн сургуулиудын албан ёсны хуудаснаас цуглуулсан дүнгээс тооцно: судалгааны тайлангийн (хоёрдогч, зарим нь «Estimated») дүнг оруулахгүй.
    const official = unis.map((u) => (u.tuition ?? []).filter((t: any) => !String(t.otherFees ?? '').includes('Судалгааны тайлан')));
    const est = officialEstimate(c.slug) ?? computeTuitionEstimate(official);
    if (est) {
      withEstimate++;
      console.log(`${c.slug.padEnd(16)} ${est.items.map((i) => `${i.currency} ${i.n != null ? `n=${i.n}` : 'албан ёсны'} ${i.min}–${i.median}–${i.max}`).join(' | ')}`);
    } else console.log(`${c.slug.padEnd(16)} — (хангалттай дүн байхгүй)`);
    if (apply) await Country.updateOne({ _id: c._id }, est ? { $set: { tuitionEstimate: est } } : { $unset: { tuitionEstimate: '' } });
  }
  console.log(JSON.stringify({ mode: apply ? 'APPLY' : 'DRY-RUN', countries: countries.length, withEstimate }));
  await mongoose.disconnect();
})().catch((e) => { console.error(e); process.exit(1); });
