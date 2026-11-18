// АНУ-ын улсын баримтад албан ёсны эх сурвалжаас шалгасан мэдээллийг оруулна (2026-11-04).
// Анхдагч нь dry-run (зөвхөн харуулна); бичихийн тулд `--apply`. Идемпотент, зөвхөн slug=usa.
import { config } from 'dotenv';
import mongoose from 'mongoose';
import { CountrySchema } from '../src/schemas';

config();

const OPT_URL = 'https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/optional-practical-training-opt-for-f-1-students';
const IIE_URL = 'https://www.iie.org/news/open-doors-2025-press-release/';
const FULBRIGHT_URL = 'https://mn.usembassy.gov/fulbright-student-program/';
const UGRAD_URL = 'https://mn.usembassy.gov/global-ugrad/';
const HUMPHREY_URL = 'https://mn.usembassy.gov/hubert-h-humphrey-fellowship/';
const STUDENT_VISA_URL = 'https://travel.state.gov/content/travel/en/us-visas/study/student-visa.html';

const NOW = new Date();

const SET = {
  overview:
    'IIE Open Doors 2025: 2024/2025 хичээлийн жилд АНУ-д 1,177,766 олон улсын оюутан суралцсан нь дээд боловсролын нийт оюутны 6%. Тэдний 59% нь төрийн өмчийн байгууллагад, 57% нь STEM чиглэлээр суралцдаг.',
  admissionGeneral:
    'Төгсөлтийн дараах виз (OPT): ердийн хөтөлбөрт 12 сар, STEM зэрэгтэй бол нэмэлт 24 сар (USCIS, 2024-11-25). Суралцах хугацаанд OPT-оор ажиллавал долоо хоногт 20 цагаас ихгүй ба энэ нь төгсөлтийн дараах 12 сараас хасагдана. ' +
    'Банкны баталгаа, визийн хураамж, кампусын ажлын цаг албан ёсны эх сурвалжаар БАТАЛГААЖААГҮЙ. Судалгааны тайлангийн утга (баталгаажаагүй): банкны баталгаа I-20 маягт дээрх дүн (~$40k – $80k); кампус доторх ажил 20 цаг.',
  scholarshipInfo: [
    'Fulbright Foreign Student (магистр, 2027–2028): Монгол иргэн, Монголд оршин суугч; бүтэн цагийн ажлын туршлага ≥1.5 жил; бакалаврын зэрэгтэй; TOEFL iBT/IELTS/Duolingo. Сургалтын төлбөр, сарын тэтгэмж, нислэг, даатгал, визийн хураамжийг хамарна. Эцсийн хугацааг хуудсанд «2025-04-27» гэж бичсэн нь үсгийн алдаа байж болзошгүй; тухайн жилийн хугацааг албан ёсны хуудсаар шалгана уу.',
    'Global UGRAD (бакалавр, 1 семестр, зэрэг олгохгүй): нас 18–24; TOEFL iBT ≥48 хүрвэл авч үзэж, 48–60 бол хэлний бэлтгэлтэй, ≥61 бол шууд солилцоонд; хөтөлбөрийн дараа ≥1 жилийн сургалт үлдсэн байх.',
    'Hubert H. Humphrey Fellowship (2027–2028, 10 сар, зэрэг олгохгүй): бакалаврын дараа ≥5 жилийн бүтэн цагийн ажил, удирдах/бодлогын албан тушаал; TOEFL 72 / Duolingo 100 / IELTS 6.0-аас дээш; буцаж ≥2 жил ажиллана.',
  ].join('\n\n'),
  visaLinks: [
    { title: 'АНУ-ын Элчин сайдын яам (Монгол): Fulbright Student Program', url: FULBRIGHT_URL },
    { title: 'АНУ-ын Элчин сайдын яам (Монгол): Global UGRAD', url: UGRAD_URL },
    { title: 'АНУ-ын Элчин сайдын яам (Монгол): Humphrey Fellowship', url: HUMPHREY_URL },
    { title: 'USCIS: F-1 оюутны OPT', url: OPT_URL },
    { title: 'АНУ-ын Төрийн департмент: оюутны виз (албан ёсны, хуудсыг нээж шалгаагүй)', url: STUDENT_VISA_URL },
  ],
  source: {
    sourceName:
      'USCIS (OPT, 2024-11-25); IIE Open Doors 2025 (2024/25); АНУ-ын Элчин сайдын яам Монгол (Fulbright, Global UGRAD, Humphrey). Бусад талбар (төлбөр, амьдрал, хугацаа, баталгаа): судалгааны тайлан 2026-11-03, баталгаажаагүй',
    sourceUrl: OPT_URL,
    sourceType: 'government',
    fetchedAt: NOW,
    lastUpdatedAt: NOW,
    academicYear: '2024/2025 (IIE); 2027–2028 (тэтгэлэг)',
    reliabilityStatus: 'primary',
    verificationStatus: 'in_review',
  },
};

(async () => {
  const apply = process.argv.includes('--apply');
  await mongoose.connect(process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/togsogch');
  const Country = mongoose.model('Country', CountrySchema);
  const cur: any = await Country.findOne({ slug: 'usa' }).lean();
  if (!cur) {
    console.log('slug=usa олдсонгүй');
    await mongoose.disconnect();
    return;
  }
  console.log(`DB: ${mongoose.connection.host}/${mongoose.connection.name}`);
  for (const k of Object.keys(SET)) console.log(`\n[${k}] одоо:`, JSON.stringify(cur[k]) ?? '(хоосон)');
  if (!apply) {
    console.log('\nDry-run. Бичихийн тулд --apply.');
  } else {
    await Country.updateOne({ slug: 'usa' }, { $set: SET });
    console.log('\nАНУ шинэчлэгдлээ.');
  }
  await mongoose.disconnect();
})();
