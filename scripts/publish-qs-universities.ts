// QS-ийн жагсаалтаас импортолсон (source.sourceName = QS World University Rankings…) draft сургуулиудыг нийтэлнэ.
// Анхдагч нь DRY-RUN. Бичихийн тулд `--apply`; алсын (mongodb+srv) DB-д мөн `--yes-remote`.
// Нийтэлсэн ч баталгаажуулалтын төлөв `unverified` хэвээр — UI дээр «Баталгаажаагүй» гэж харагдана.
import { config } from 'dotenv';
import mongoose from 'mongoose';
import { UniversitySchema } from '../src/schemas';
import { QS_SOURCE_NAME } from '../src/modules/phase4/qs-import';

config();
const apply = process.argv.includes('--apply');
const remoteOk = process.argv.includes('--yes-remote');

(async () => {
  const uri = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/togsogch';
  if (apply && /^mongodb\+srv:/.test(uri) && !remoteOk) {
    console.error('Алсын DB (mongodb+srv) руу бичихийн тулд --yes-remote нэмнэ үү. Зогслоо.');
    process.exit(1);
  }
  await mongoose.connect(uri);
  const University = mongoose.model('University', UniversitySchema);
  const filter = { deletedAt: null, status: 'draft', 'source.sourceName': { $regex: `^${QS_SOURCE_NAME}` } };
  const n = await University.countDocuments(filter);
  console.log(JSON.stringify({ mode: apply ? 'APPLY' : 'DRY-RUN', toPublish: n }));
  if (apply && n) {
    const r = await University.updateMany(filter, { $set: { status: 'published' } });
    console.log(JSON.stringify({ published: r.modifiedCount }));
  }
  console.log('Нийтлэгдсэн нийт:', await University.countDocuments({ deletedAt: null, status: 'published' }));
  await mongoose.disconnect();
})().catch((e) => { console.error(e); process.exit(1); });
