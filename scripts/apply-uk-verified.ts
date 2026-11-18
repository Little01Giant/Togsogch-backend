// Их Британи: gov.uk, UCAS, Chevening-ийн албан ёсны хуудсаар шалгасан утгыг оруулж, баталгаажаагүй тайлангийн утгыг сольно (2026-11-05).
// Анхдагч нь dry-run; бичихийн тулд `--apply`. Идемпотент.
import { config } from 'dotenv';
import mongoose from 'mongoose';
import { CountrySchema } from '../src/schemas';

config();
const NOW = new Date();
const SLUG = 'uk';

const SET = {
  educationSystem:
    'Бакалаврын элсэлт UCAS-ийн нэгдсэн системээр явна (ucas.com). 2027 оны элсэлт: Оксфорд, Кембриж, анагаах ухаан, шүдний болон мал эмнэлгийн ихэнх курсийн «тэгш үнэлгээний» огноо 2026-10-15 (UK 18:00). Бусад ихэнх бакалаврын курсийн огноо 2027-01-13 (UK 18:00). 2027 оны элсэлтийн өргөдлийн эцсийн хугацаа 2027-09-23.',
  tuitionRange:
    'Мэдээлэл байхгүй: гадаадын оюутны жилийн төлбөрийг их сургууль бүр өөрөө тогтоодог бөгөөд албан ёсны нэгдсэн хэмжээ байхгүй. Сургуулийн хуудсаар лавлана.',
  admissionGeneral:
    'Санхүүгийн шаардлага (gov.uk): Лондонд сард £1,529, Лондоноос гадуур сард £1,171, хамгийн ихдээ 9 сараар (одоогийн хэмжээ; 9 сар = £13,761 / £10,539), сургалтын төлбөрийн үлдэгдэл дээр нэмж. Мөнгийг дор хаяж 28 хоног дараалан дансандаа байлгах ёстой; 28 хоногийн эцсийн өдөр виз мэдүүлэхээс 31 хоногоос хэтрэхгүй байх ёстой. 2026-11-30-аас энэ хэмжээ нэмэгдэнэ гэх мэдээлэл gov.uk-д баталгаажаагүй.\n\n' +
    'Визийн хураамж (гаднаас мэдүүлэхэд): £558. Эрүүл мэндийн нэмэлт хураамж (IHS): оюутанд жилд £776.\n\n' +
    'Цагийн ажил: gov.uk-д «курс болон улирлын үеэс хамаарна» гэж заасан; долоо хоногийн цагийн хязгаарыг албан ёсны хуудсаар баталгаажуулаагүй, визний нөхцөлөөс шалгана.\n\n' +
    'Төгсөлтийн дараах Graduate visa (gov.uk): 2026-12-31 ба түүнээс өмнө өргөдөл өгвөл 2 жил, 2027-01-01-ээс хойш өгвөл 18 сар; докторын зэрэгтэй бол 3 жил. Хураамж £937 + IHS ихэвчлэн жилд £1,035.',
  languagePrepInfo:
    'ATAS (gov.uk): Монгол улс ATAS-аас чөлөөлөгдөх орны жагсаалтад ороогүй. Магистр, докторын түвшинд тухайн хөтөлбөрийн CAH3 кодоор шаардлагатай бол виз мэдүүлэхээс өмнө ATAS гэрчилгээ авна (үнэгүй, боловсруулалт хамгийн багадаа 30 ажлын өдөр). Бакалаврын энгийн курсэд ерөнхийдөө шаардахгүй; нэгдсэн магистрын жилтэй бакалаврын зарим курсэд шаардаж болно. Сургуулийн санал (offer) дээрх кодоор лавлана.',
  scholarshipInfo:
    'Chevening (chevening.org): Монгол улс эрхтэй жагсаалтад бий. Шаардлага: бакалаврын дараах 2 жилийн (2,800 цаг) ажлын туршлага; тэтгэлэг дууссанаас хойш эх орондоо дор хаяж 2 жил буцаж ажиллах амлалт. Хамрах зүйл: сургалтын төлбөр, нисэх тийз, визийн хураамж, сарын тэтгэмж. 2027–28 оны өргөдөл хаагдсан; Нэг ч болов болзолгүй санал (unconditional offer)-ийн эцсийн хугацаа 2027-07-08. GREAT Scholarships-ийн мэдээллийг албан ёсны хуудсаар баталгаажуулаагүй.',
  pros: [
    'Бакалавр 3 жил, магистр 1 жил',
    'Graduate visa: төгсөөд ажил хайх эрхтэй (2026-12-31 хүртэл өргөдөл өгвөл 2 жил, 2027-01-01-ээс 18 сар, докторт 3 жил).',
  ],
  cons: [
    'Визний санхүүгийн шаардлагын мөнгийг дор хаяж 28 хоног дараалан дансанд байлгах ёстой.',
    'Эрүүл мэндийн нэмэлт хураамж (IHS) оюутанд жилд £776, визийн хураамж £558.',
  ],
  visaLinks: [
    { title: 'gov.uk: Student visa (ерөнхий)', url: 'https://www.gov.uk/student-visa' },
    { title: 'gov.uk: Student visa — шаардагдах мөнгө', url: 'https://www.gov.uk/student-visa/money' },
    { title: 'gov.uk: Санхүүгийн нотолгоо (Student route)', url: 'https://www.gov.uk/guidance/financial-evidence-for-student-and-child-student-route-applicants' },
    { title: 'gov.uk: Эрүүл мэндийн нэмэлт хураамж (IHS)', url: 'https://www.gov.uk/healthcare-immigration-application/how-much-pay' },
    { title: 'gov.uk: Graduate visa', url: 'https://www.gov.uk/graduate-visa' },
    { title: 'gov.uk: ATAS', url: 'https://www.gov.uk/guidance/academic-technology-approval-scheme' },
    { title: 'UCAS: элсэлтийн огноо', url: 'https://www.ucas.com/applying/applying-to-university/dates-and-deadlines-for-uni-applications' },
    { title: 'Chevening: шаардлага', url: 'https://www.chevening.org/eligibility' },
  ],
  source: {
    sourceName: 'GOV.UK (Student visa, Financial evidence, IHS, Graduate visa, ATAS); UCAS; Chevening',
    sourceUrl: 'https://www.gov.uk/student-visa',
    sourceType: 'government',
    fetchedAt: NOW,
    lastUpdatedAt: NOW,
    academicYear: '2026–2027',
    reliabilityStatus: 'primary',
    verificationStatus: 'in_review',
  },
};

(async () => {
  const apply = process.argv.includes('--apply');
  await mongoose.connect(process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/togsogch');
  console.log(`DB: ${mongoose.connection.host}/${mongoose.connection.name}`);
  const Country = mongoose.model('Country', CountrySchema);
  const cur: any = await Country.findOne({ slug: SLUG }).lean();
  if (!cur) {
    console.log(`slug=${SLUG} олдсонгүй`);
  } else {
    console.log('одоо livingCost =', JSON.stringify(cur.livingCostMonthlyUsd), '| admission =', JSON.stringify(cur.admissionGeneral));
    if (apply) {
      await Country.updateOne({ slug: SLUG }, { $set: SET, $unset: { livingCostMonthlyUsd: '' } });
      console.log('Их Британи шинэчлэгдлээ');
    } else console.log('Dry-run. Бичихийн тулд --apply.');
  }
  await mongoose.disconnect();
})();
