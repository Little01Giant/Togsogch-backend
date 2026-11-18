// Жагсаалтад үлдэх 25 улсаас бусад улсыг (хуучин soft-delete хийгдсэн) бүрэн устгана. Анхдагч нь dry-run; `--apply` үед устгана.
import { config } from 'dotenv';
import mongoose from 'mongoose';

config();
const KEEP = [
  'usa', 'australia', 'austria', 'belgium', 'germany', 'denmark', 'ireland', 'spain', 'italy', 'uk', 'canada', 'russia', 'poland',
  'singapore', 'hungary', 'finland', 'france', 'china', 'czech-republic', 'sweden', 'switzerland', 'new-zealand', 'india', 'japan', 'south-korea',
];

(async () => {
  const apply = process.argv.includes('--apply');
  await mongoose.connect(process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/togsogch');
  const db = mongoose.connection.db!;
  console.log(`DB: ${mongoose.connection.host}/${mongoose.connection.name}`);
  const countries = db.collection('countries');
  const all = await countries.find({}, { projection: { slug: 1, status: 1, deletedAt: 1 } }).toArray();
  console.log('нийт:', all.length, '| үлдэх жагсаалтад байхгүй slug:', KEEP.filter((k) => !all.some((c) => c.slug === k)));
  const drop = all.filter((c) => !KEEP.includes(c.slug as string));
  console.log('устгах:', drop.map((c) => `${c.slug}(${c.status})`).join(', ') || '—');
  const ids = drop.map((c) => c._id);
  const slugs = drop.map((c) => c.slug);
  for (const col of await db.listCollections().toArray()) {
    if (col.name === 'countries') continue;
    const c = db.collection(col.name);
    const n = await c.countDocuments({ $or: [{ countryId: { $in: ids } }, { country: { $in: [...ids, ...slugs] } }, { countrySlug: { $in: slugs } }, { targetId: { $in: ids.map(String) } }] });
    if (n) console.log(`  холбоотой: ${col.name} = ${n}`);
  }
  if (apply) {
    const r = await countries.deleteMany({ _id: { $in: ids } });
    console.log('устгасан улс:', r.deletedCount);
  } else console.log('Dry-run. Устгахын тулд --apply.');
  await mongoose.disconnect();
})();
