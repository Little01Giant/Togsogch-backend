require('dotenv').config();
const mongoose = require('mongoose');
(async () => {
  for (let i = 0; i < 5; i++) { try { await mongoose.connect(process.env.MONGODB_URI); break; } catch (e) { if (i === 4) throw e; await new Promise((r) => setTimeout(r, 2000)); } }
  const db = mongoose.connection.db;
  const a = await db.collection('assessments').findOne({ key: 'hunter' });
  if (!a) { console.log('no hunter'); process.exit(0); }
  const attempts = await db.collection('assessmentattempts').countDocuments({ assessmentKey: 'hunter' });
  console.log('attempts for hunter:', attempts);
  if (attempts > 0) { console.log('attempts exist: not deleting'); process.exit(1); }
  console.log('q', (await db.collection('assessmentquestions').deleteMany({ assessmentId: a._id })).deletedCount);
  console.log('v', (await db.collection('assessmentversions').deleteMany({ assessmentId: a._id })).deletedCount);
  console.log('a', (await db.collection('assessments').deleteOne({ _id: a._id })).deletedCount);
  await mongoose.disconnect();
})().catch((e) => { console.error(e.message); process.exit(1); });
