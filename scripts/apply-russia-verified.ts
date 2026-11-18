// ОХУ: studyinrussia.ru (албан ёсны) дээр шалгаж чадсан утгыг л оруулна (2026-11-06). Бусад нь «Мэдээлэл байхгүй».
// Төлбөр, амьдралын зардал = хэрэглэгчийн өгсөн гуравдагч этгээдийн тооцоо (reliabilityStatus=estimate, баталгаагүй).
// Шалгаагүй: банкны баталгаа, тэтгэлгийн дүн, 274-ФЗ, РВПО-ийн хугацаа.
// Анхдагч нь dry-run; бичихийн тулд `--apply`. Идемпотент.
import { config } from 'dotenv';
import mongoose from 'mongoose';
import { CountrySchema } from '../src/schemas';

config();
const NOW = new Date();
const SLUG = 'russia';
const EDU = 'https://studyinrussia.ru/en/education';

const SET = {
  tuitionRange:
    'Албан ёсны эх сурвалжаар баталгаажаагүй тооцоо (study-abroad.org зэрэг гуравдагч этгээдийн нэгтгэл, 2026): Төрийн их сургууль — бакалавр жилд $1,200 – $3,800, магистр $1,600 – $4,500; анагаах ухаан (орос хэл дээр) $2,200 – $5,000. Хувийн их сургууль — бакалавр $2,500 – $8,000, магистр $3,000 – $7,000; анагаах ухааны англи хэл дээрх хөтөлбөр $9,000 – $15,200+. Яг төлбөрийг сургуулийн албан ёсны сайтаас лавлана.',
  overview:
    'Сарын амьдралын зардлын тооцоо (баталгаажаагүй, гуравдагч этгээдийн нэгтгэл, 2026): Москва, Санкт-Петербург зэрэг том хотод нийт $257 – $870 (дотуур байр $30 – $80, хувийн байр $200 – $450, хоол $150 – $250, тээвэр $25 – $40, даатгал $5 – $15). Томск, Казань, Новосибирск зэрэг бусад хотод нийт $144 – $440 (дотуур байр $5 – $40, хувийн байр $100 – $200, хоол $100 – $150, тээвэр $10 – $20, даатгал $4 – $10).',
  livingCostMonthlyUsd: { min: 144, max: 870 },
  admissionGeneral:
    'Бичиг баримт (studyinrussia.ru): иргэний үнэмлэх, хууль ёсоор хүлээн зөвшөөрүүлсэн боловсролын баримт; бүх баримтыг нотариатаар баталгаажуулж орос хэл рүү орчуулна. Шалгалт: ЕГЭ эсвэл их сургуулийн дотоод шалгалт; квотоор өргөдөл гаргагчийн шалгалтын мэдээллийг education-in-russia.com дээр шалгана.\n\n' +
    'Цахим виз (evisa.kdmid.ru): нэгдсэн цахим виз нь зочлох, аялал, ажил хэргийн болон арга хэмжээний зорилготой; суралцах зорилгыг жагсаагаагүй тул оюутны визийг энгийн журмаар авна. Визийн бичиг баримтын жагсаалтыг өргөдөл өгөх консулын газар, визийн төвөөс лавлана.\n\n' +
    'Цагийн ажил (studyinrussia.ru): төрийн аккредитэй их сургуулийн өдрийн оюутан чөлөөт цагаараа зөвшөөрөлгүй ажиллаж болно, ажил олгогчид элсэлтийн тодорхойлолт өгнө; цаг, орлогын хязгаар сайтад заагаагүй. РВПО нь ажиллах боломж олгоно гэж заасан. Төгсөлтийн дараах хугацаа, банкны баталгааны дүн: Мэдээлэл байхгүй.',
  scholarshipInfo:
    'ОХУ-ын Засгийн газрын квот (studyinrussia.ru): квотоор элсэгчид дотуур байрны байр баталгаатай; квотоор өргөдөл гаргавал бэлтгэл факультетэд үнэгүй суралцах боломжтой. Өргөдлийг education-in-russia.com порталд бүртгүүлж, орон нутаг дахь шалгаруулалтад урилга авна. Өргөдөл ерөнхийдөө 9–12 сард хүлээн авна; яг хугацаа жил бүр өөр, Россотрудничествогийн төлөөлөгч болон порталаас лавлана. Сарын тэтгэмж, сургалтын төлбөрийн хамрах хэмжээ, насны болон эрүүл мэндийн шаардлага: Мэдээлэл байхгүй (албан ёсны хуудсаас уншиж чадсангүй).',
  visaLinks: [
    { title: 'Study in Russia: суралцах, элсэх журам', url: EDU },
    { title: 'Education in Russia: квотын портал', url: 'https://education-in-russia.com/' },
    { title: 'ОХУ-ын цахим виз (оюутны зорилгод хамаарахгүй)', url: 'https://evisa.kdmid.ru/' },
  ],
  source: {
    sourceName: 'Study in Russia (studyinrussia.ru); evisa.kdmid.ru; төлбөр, амьдралын зардал — study-abroad.org зэрэг гуравдагч этгээдийн тооцоо (баталгаажаагүй)',
    sourceUrl: EDU,
    sourceType: 'government',
    fetchedAt: NOW,
    lastUpdatedAt: NOW,
    academicYear: 'Мэдээлэл байхгүй',
    reliabilityStatus: 'estimate',
    verificationStatus: 'in_review',
  },
};

(async () => {
  const apply = process.argv.includes('--apply');
  await mongoose.connect(process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/togsogch');
  console.log(`DB: ${mongoose.connection.host}/${mongoose.connection.name}`);
  const Country = mongoose.model('Country', CountrySchema);
  const cur: any = await Country.findOne({ slug: SLUG }).lean();
  if (!cur) console.log(`slug=${SLUG} олдсонгүй`);
  else {
    console.log('одоо livingCost =', JSON.stringify(cur.livingCostMonthlyUsd), '| tuition =', JSON.stringify(cur.tuitionRange));
    if (apply) {
      await Country.updateOne({ slug: SLUG }, { $set: SET });
      console.log('ОХУ шинэчлэгдлээ');
    } else console.log('Dry-run. Бичихийн тулд --apply.');
  }
  await mongoose.disconnect();
})();
