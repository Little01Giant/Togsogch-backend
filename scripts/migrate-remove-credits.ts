// Кредитийн ойлголтыг хасах нэг удаагийн шилжилт (идемпотент):
//  1) `university_access` (1,000 ₮), `country_access` (5,000 ₮) бүтээгдэхүүнийг нэмнэ (байвал үнэд хүрэхгүй);
//  2) `credits_*` бүтээгдэхүүнийг идэвхгүй болгоно;
//  3) хэрэглэгчээс `credits`, `welcomeCreditAt` талбарыг хасна; төлбөрөөс `credits`, `creditsGrantedAt`-ыг хасахгүй (түүх хадгална).
// Анхдагч нь dry-run; бичихийн тулд `--apply`.
import { config } from 'dotenv';
import mongoose from 'mongoose';

config();
(async () => {
  const apply = process.argv.includes('--apply');
  await mongoose.connect(process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/togsogch');
  const db = mongoose.connection.db!;
  console.log(`DB: ${mongoose.connection.host}/${mongoose.connection.name}`);
  const products = db.collection('paymentproducts');
  const now = new Date();
  const add = [
    { key: 'university_access', title: 'Сургуулийн мэдээлэл нээх', description: 'Энэ сургуулийн төлбөртэй мэдээллийг (төлбөр, шаардлага, хугацаа) үүрд нээнэ.', priceMnt: 1000, scope: 'university' },
    { key: 'country_access', title: 'Улсын бүх сургууль нээх', description: 'Энэ улсад байгаа бүх сургуулийн төлбөртэй мэдээллийг үүрд нээнэ.', priceMnt: 5000, scope: 'country' },
  ];
  const usersWithCredits = await db.collection('users').countDocuments({ $or: [{ credits: { $exists: true } }, { welcomeCreditAt: { $exists: true } }] });
  const unlocks = await db.collection('universityunlocks').countDocuments().catch(() => 0);
  console.log(`credits талбартай хэрэглэгч: ${usersWithCredits}; хуучин universityunlocks бичлэг: ${unlocks}`);
  if (unlocks > 0) console.log('Анхаар: universityunlocks-д бичлэг байна — эрх рүү шилжүүлээгүй тул --apply үед устгахгүй.');
  if (!apply) { console.log('Dry-run. Бичихийн тулд --apply.'); await mongoose.disconnect(); return; }

  for (const p of add) {
    const r = await products.updateOne({ key: p.key }, { $setOnInsert: { ...p, active: true, createdAt: now, updatedAt: now } }, { upsert: true });
    console.log(`${p.key}: ${r.upsertedCount ? 'нэмэгдлээ' : 'өмнө нь байсан'}`);
  }
  const off = await products.updateMany({ key: { $in: ['credits_1', 'credits_5', 'credits_10'] } }, { $set: { active: false } });
  console.log(`credits_* идэвхгүй болгосон: ${off.modifiedCount}`);
  const u = await db.collection('users').updateMany({}, { $unset: { credits: '', welcomeCreditAt: '' } });
  console.log(`хэрэглэгчээс credits хассан: ${u.modifiedCount}`);
  if (unlocks === 0) { await db.collection('universityunlocks').drop().catch(() => undefined); console.log('хоосон universityunlocks collection устгасан'); }
  await mongoose.disconnect();
})();
