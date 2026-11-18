// Хөгжүүлэлтийн ТУРШИЛТЫН картууд: «Онцлох сургуулиуд»-ыг дүрслэхэд зориулсан зохиомол сургууль.
// Зөвхөн NODE_ENV=development|test. Рейтинг/төлбөр/шаардлагагүй. Устгах: npm run mock:featured -- remove
import { config } from 'dotenv';
import mongoose from 'mongoose';
import { CountrySchema, UniversitySchema } from '../src/schemas';
import { isDevEnv } from '../src/common/security';

config();
const MOCKS = [
  { slug: 'mock-example-university', name: '[ЖИШЭЭ] Example University', nameMn: 'Жишээ их сургууль', country: 'uk', city: 'Лондон', type: 'public' },
  { slug: 'mock-sample-institute', name: '[ЖИШЭЭ] Sample Institute of Technology', nameMn: 'Жишээ технологийн дээд сургууль', country: 'germany', city: 'Берлин', type: 'public' },
  { slug: 'mock-demo-college', name: '[ЖИШЭЭ] Demo College', nameMn: null, country: 'south-korea', city: 'Сөүл', type: 'private' },
];

(async () => {
  if (!isDevEnv(process.env.NODE_ENV)) throw new Error('Зөвхөн dev орчинд ажиллана');
  await mongoose.connect(process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/togsogch');
  const Country = mongoose.model('Country', CountrySchema);
  const Uni = mongoose.model('University', UniversitySchema);
  if (process.argv[2] === 'remove') {
    const r = await Uni.deleteMany({ slug: /^mock-/ });
    console.log(`Устгасан: ${r.deletedCount}`);
  } else {
    for (const { country, ...m } of MOCKS) {
      const c = await Country.findOne({ slug: country }).lean();
      if (!c) throw new Error(`Улс олдсонгүй: ${country}. Эхлээд npm run seed ажиллуулна`);
      await Uni.updateOne({ slug: m.slug }, { $setOnInsert: { ...m, countryId: c._id, featured: true, status: 'published', degreeLevels: ['bachelor'] } }, { upsert: true });
    }
    console.log(`Нэмсэн/байгаа: ${MOCKS.length}`);
  }
  await mongoose.disconnect();
})().catch((e) => { console.error(e); process.exit(1); });
