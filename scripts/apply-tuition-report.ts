// Хэрэглэгчийн судалгааны тайлангийн (Estimated-гүй) сургалтын төлбөрийг сургуулиудад нэмнэ. Албан ёсны цуглуулсан дүнг дарахгүй.
// Анхдагч нь DRY-RUN. Бичихийн тулд `--apply`; алсын (mongodb+srv) DB-д мөн `--yes-remote`. Идемпотент.
import { config } from 'dotenv';
import mongoose from 'mongoose';
import { UniversitySchema } from '../src/schemas';
import { TUITION_REPORT } from '../src/seed/tuition-report';
import { mergeReportTuition } from '../src/modules/phase4/tuition-report';

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
  const University = mongoose.model('University', UniversitySchema);
  let changed = 0, notFound = 0;
  for (const s of TUITION_REPORT) {
    const u: any = await University.findOne({ name: s.name, deletedAt: null });
    if (!u) { notFound++; console.log(`ОЛДСОНГҮЙ: ${s.name}`); continue; }
    const r = mergeReportTuition(u.tuition ?? [], s);
    console.log(`${s.name.padEnd(52)} нэмсэн: ${r.added.join(',') || '—'}  алгассан (өөрийн дүнтэй): ${r.skipped.join(',') || '—'}`);
    if (!r.added.length) continue;
    changed++;
    if (apply) await University.updateOne({ _id: u._id }, { $set: { tuition: r.tuition } });
  }
  console.log(JSON.stringify({ mode: apply ? 'APPLY' : 'DRY-RUN', schools: TUITION_REPORT.length, changed, notFound }));
  await mongoose.disconnect();
})().catch((e) => { console.error(e); process.exit(1); });
