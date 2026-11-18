// Польш: gov.pl (Poland in Mongolia) дээр шалгасан утгыг оруулна (2026-11-06). Төлбөр, амьдралын зардал = гуравдагч этгээдийн тооцоо (estimate).
// Шалгаагүй: банкны баталгааны дүн, цагийн ажлын журам, төгсөлтийн дараах 9 сар, Banach-ийн тэтгэмжийн дүн/шаардлага.
// Анхдагч нь dry-run; бичихийн тулд `--apply`. Идемпотент.
import { config } from 'dotenv';
import mongoose from 'mongoose';
import { CountrySchema } from '../src/schemas';

config();
const NOW = new Date();
const SLUG = 'poland';
const VISA = 'https://www.gov.pl/web/mongolia-en/d-type-national-visa';

const SET = {
  tuitionRange:
    'Албан ёсны эх сурвалжаар баталгаажаагүй тооцоо (studyinpoland.pl зэрэг гуравдагч этгээдийн нэгтгэл, 2026): Төрийн их сургууль — польш хэлээр жилд €1,500 – €2,500, англи хэлээр €2,000 – €4,000. Хувийн их сургууль жилд €1,800 – €5,000. Анагаах ухааны хөтөлбөр жилд €10,000 – €16,000 орчим. Польш хэлний бэлтгэл курс ~€2,000. Яг төлбөрийг сургуулийн албан ёсны сайтаас лавлана.',
  overview:
    'Сарын амьдралын зардлын тооцоо (баталгаажаагүй, гуравдагч этгээдийн нэгтгэл, 2026): Варшава (хувийн байр) нийт $700 – $1,100 (түрээс $350 – $550, хоол $220 – $300, тээвэр $14 – $20, хувийн даатгал $25 – $60). Люблин, Лодзь зэрэг бусад хот (оюутны байр) нийт $350 – $620 (түрээс $120 – $275, хоол $175 – $225, тээвэр $10 – $15).',
  livingCostMonthlyUsd: { min: 350, max: 1100 },
  admissionGeneral:
    'Оюутны виз (D төрөл, gov.pl — Польш Улсын Элчин сайдын яам, Улаанбаатар): өргөдлийг Улаанбаатар дахь Элчин сайдын яаманд биечлэн өгнө (факс, шуудан, имэйлээр хүлээн авахгүй); цагийг e-Konsulat (secure.e-konsulat.gov.pl)-оор товлоно. Өргөдлийг зорьсон аялалаас 6 сараас эрт биш, дүрмээр 15 хоногоос хоцроохгүй өгнө. Шаардлагатай бичиг баримт: e-Konsulat-аар бөглөж хэвлэсэн, гарын үсэг зурсан анкет; 3.5 × 4.5 см зураг; сүүлийн 10 жилд олгосон, буцах өдрөөс хойш 3 сар хүчинтэй, 2 хоосон хуудастай паспорт ба паспортын хуулбар; ЕХ-д хүчинтэй, €30,000-аас доошгүй эрүүл мэндийн даатгал; иргэний үнэмлэхний хуулбар; амьжиргааны хөрөнгийн баталгаа (хэлбэрийг төлөөлөгчийн газар тогтооно, дүн заагаагүй); байрны баталгаа; суралцах зорилгын баримт. Хураамж €135 бэлнээр; шийдвэр 15 хоногт (30 хүртэл сунаж болно); D виз дээд тал нь 1 жил хүчинтэй.\n\n' +
    'Банкны баталгааны дүн, цагийн ажлын журам, төгсөлтийн дараах оршин суух зөвшөөрөл: Мэдээлэл байхгүй (албан ёсны хуудсаас уншиж чадсангүй; элчин сайдын яам, UDSC-ээс лавлана).',
  scholarshipInfo:
    'Banach NAWA (nawa.gov.pl): NAWA нь 2026 оны Banach хөтөлбөрийн өргөдлийн урилгыг (№16/2026, 2026-04-13) зарласан, 2026/27 намрын семестрээс суралцах эсвэл бэлтгэл курс. Монгол улс хамрагдах эсэх, түвшин, сарын тэтгэмж, нислэгийн зардал, шаардлага, хугацаа: Мэдээлэл байхгүй (урилгын PDF-ийг уншиж чадсангүй; nawa.gov.pl дээрээс шалгана).',
  visaLinks: [
    { title: 'Польш Улс Монголд: D төрлийн виз (оюутны виз)', url: VISA },
    { title: 'e-Konsulat: цаг товлох, анкет', url: 'https://secure.e-konsulat.gov.pl/' },
    { title: 'NAWA: Banach хөтөлбөр', url: 'https://nawa.gov.pl/en/students/foreign-students/the-banach-scholarship-programme' },
  ],
  source: {
    sourceName: 'gov.pl (Poland in Mongolia); NAWA; төлбөр, амьдралын зардал — studyinpoland.pl зэрэг гуравдагч этгээдийн тооцоо (баталгаажаагүй)',
    sourceUrl: VISA,
    sourceType: 'government',
    fetchedAt: NOW,
    lastUpdatedAt: NOW,
    academicYear: '2026',
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
      console.log('Польш шинэчлэгдлээ');
    } else console.log('Dry-run. Бичихийн тулд --apply.');
  }
  await mongoose.disconnect();
})();
