// Монголын 10 сургуулийн ДОТООДЫН оюутны жилийн төлбөрийн судалгааны нэгтгэл (хэрэглэгчээс, 2024–2026 хичээлийн жил) — хоёрдогч, баталгаагүй.
// Анхдагч нь DRY-RUN. `--apply`; алсын DB-д мөн `--yes-remote`. Идемпотент: өмнөх тайлангийн мөрийг сольж бичнэ, албан ёсны (олон улсын) мөрөнд хүрэхгүй.
import { config } from 'dotenv';
import mongoose from 'mongoose';
import { UniversitySchema } from '../src/schemas';

config();
const apply = process.argv.includes('--apply');
const remoteOk = process.argv.includes('--yes-remote');
const MARK = 'Судалгааны нэгтгэл №9 (Монгол, 2026-11-14, хэрэглэгчээс)';

type Row = { slug: string; b: [number, number?]; m: [number, number?]; perCredit: string };
const ROWS: Row[] = [
  { slug: 'national-university-of-mongolia', b: [5313000, 6150000], m: [2625000, 2800000], perCredit: 'Бакалавр 177,100–205,000 ₮; магистр 175,000 ₮' },
  { slug: 'mongolian-university-of-science-and-technology', b: [5568000, 6270000], m: [4560000, 5344000], perCredit: 'Бакалавр 185,600–209,000 ₮; магистр 304,000–334,000 ₮' },
  { slug: 'mongolian-national-university-of-medical-sciences', b: [5100000, 5400000], m: [2955000, 3152000], perCredit: 'Бакалавр 170,000 ₮; магистр 197,000 ₮' },
  { slug: 'mongolian-university-of-life-sciences', b: [4050000, 5070000], m: [3000000, 4000000], perCredit: 'Бакалавр 135,000–169,000 ₮; магистр: бакалаврын суурь үнээс өндөр' },
  { slug: 'mongolian-national-university-of-education', b: [3700000, 3894000], m: [3150000], perCredit: 'Бакалавр 142,800 ₮; магистр 210,000 ₮' },
  { slug: 'university-of-finance-and-economics-ufe', b: [8460000, 9920000], m: [5000000, 6500000], perCredit: 'Бакалавр 282,000–310,000 ₮; магистр 350,000–400,000 ₮ (тайланд «тооцоолсон»)' },
  { slug: 'ikh-zasag-international-university', b: [3000000, 5000000], m: [3500000, 4500000], perCredit: 'Бакалавр 100,000–140,000 ₮; магистр: мэргэжлээс хамаарч өөр' },
  { slug: 'university-of-the-humanities', b: [8477040, 9636000], m: [4674750, 5300000], perCredit: 'Бакалавр 385,320 ₮; магистр 311,650 ₮' },
  { slug: 'otgontenger-university', b: [4500000, 5500000], m: [3000000, 4000000], perCredit: 'Бакалавр 150,000–180,000 ₮; магистр: мэргэжлээс хамаарч өөр' },
  { slug: 'mongolia-international-university-miu', b: [11460000], m: [11312000], perCredit: 'Бакалавр 382,000 ₮; магистр 707,000 ₮ (кредит тутам)' },
];

(async () => {
  const uri = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/togsogch';
  if (apply && /^mongodb\+srv:/.test(uri) && !remoteOk) { console.error('Алсын DB руу бичихийн тулд --yes-remote нэмнэ үү. Зогслоо.'); process.exit(1); }
  await mongoose.connect(uri);
  const University = mongoose.model('University', UniversitySchema);
  let changed = 0, missing = 0;
  for (const r of ROWS) {
    const u: any = await University.findOne({ slug: r.slug, deletedAt: null });
    if (!u) { console.log(`${r.slug}: олдсонгүй`); missing++; continue; }
    const kept = (u.tuition ?? []).filter((t: any) => !String(t.otherFees ?? '').includes(MARK));
    const mk = (level: string, v: [number, number?]) => ({
      level, currency: 'MNT', academicYear: '2024-2026', annualFee: v[0], ...(v[1] && v[1] > v[0] ? { annualFeeMax: v[1] } : {}),
      feeType: 'domestic', isEstimate: true,
      otherFees: `${MARK}. Баталгаагүй, хоёрдогч эх сурвалж; бакалавр ~30, магистр ~15–16 багц цагаар тооцсон. 1 багц цагийн үнэ: ${r.perCredit}`,
    });
    u.tuition = [...kept, mk('bachelor', r.b), mk('master', r.m)];
    console.log(`${r.slug.padEnd(52)} бакалавр ${r.b.join('–')}, магистр ${r.m.join('–')} (хадгалсан мөр: ${kept.length})`);
    changed++;
    if (apply) await u.save();
  }
  console.log(JSON.stringify({ mode: apply ? 'APPLY' : 'DRY-RUN', changed, missing }));
  await mongoose.disconnect();
})().catch((e) => { console.error(e); process.exit(1); });
