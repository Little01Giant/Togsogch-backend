// Канад: IRCC (canada.ca) болон тэтгэлгийн албан ёсны хуудсаар шалгасан утгыг оруулж, баталгаажаагүй тайлангийн утгыг сольно (2026-11-05).
// Анхдагч нь dry-run; бичихийн тулд `--apply`. Идемпотент.
import { config } from 'dotenv';
import mongoose from 'mongoose';
import { CountrySchema } from '../src/schemas';

config();
const NOW = new Date();
const SLUG = 'canada';

const SET = {
  tuitionRange: 'Мэдээлэл байхгүй: гадаадын оюутны төлбөрийг их сургууль, муж, хөтөлбөрөөр тогтооно. Албан ёсны дундаж (Statistics Canada) хүснэгтийн тоог авч баталгаажуулаагүй.',
  admissionGeneral:
    'Санхүүгийн баталгаа (IRCC, canada.ca): 2026-09-01 ба түүнээс хойш мэдүүлсэн оюутны визэнд 1 хүнд 23,448 CAD (өмнө нь 22,895 CAD). Энэ дүн сургалтын төлбөр болон Канад руу очих, буцах тээврийн зардлыг оруулаагүй; тэдгээрийг нэмж нотолно. Квебек мужид Квебекийн (MIFI) хэмжээ тусдаа.\n\n' +
    'Муж/нутгийн зөвшөөрлийн бичиг (PAL/TAL): ихэнх оюутны визэнд заавал шаардана; мэдүүлэхдээ визийн өргөдөлтэй хамт өгнө. 2026-01-01-ээс төрийн өмчит сургуулийн магистр, докторын зэрэгтэй хөтөлбөрт элсэгчид PAL-аас чөлөөлөгдсөн. Квебект PAL-ын оронд CAQ шаардана.\n\n' +
    'Цагийн ажил (IRCC): хичээлийн улиралд кампусаас гадуур долоо хоногт 24 цаг хүртэл; хуваарьт амралтын үеэр (зун, өвөл, унших долоо хоног) цагийн хязгааргүй.\n\n' +
    'Төгсөлтийн дараах ажлын зөвшөөрөл (PGWP, IRCC): хөтөлбөр 2 жил ба түүнээс дээш бол 3 хүртэл жилийн; 8 сараас 2 жилээс богино бол хөтөлбөрийн хугацаатай тэнцэх; магистр дор хаяж 8 сар бол 2 жилээс богино байсан ч 3 хүртэл жил (сертификат, дипломд үйлчлэхгүй). Хөтөлбөр дор хаяж 8 сар, бүтэн цагаар суралцсан байх, төгссөнөөс хойш 180 хоногт мэдүүлнэ. Хэлний шаардлага: бакалавр, магистр, докторт CLB 7, коллеж болон бусад их сургуулийн бус хөтөлбөрт CLB 5 (дөрвөн чадвар бүрт). Бакалавр, магистр, докторын зэрэгт мэргэжлийн чиглэлийн шаардлага байхгүй; коллежийн хөтөлбөр CIP кодоор батлагдсан эрэлттэй чиглэлд байх ёстой.',
  scholarshipInfo:
    'Vanier Canada Graduate Scholarships (vanier.gc.ca): докторын хугацаанд жилд 50,000 CAD, 3 жил; гадаадын иргэн эрхтэй, Канадын сургуулиас нэр дэвшинэ. Сайт «өргөдөл хүлээн авахаа больсон», залгамжлагч нь NSERC Canada Graduate Research Scholarship – Doctoral гэж заасан.\n\n' +
    'Lester B. Pearson International Scholarship (future.utoronto.ca/pearson): Торонтогийн их сургуулийн бакалавр; сургалтын төлбөр, ном, нэмэлт хураамж, дотуур байрыг 4 жилд хамруулна; дунд сургуулиас нэр дэвшинэ (сургууль жилд 1 оюутан). 2027 оны намрын элсэлтийн хугацаа: сургуулийн нэр дэвшүүлэлт 2026-10-09, нийт материал 2026-11-06.\n\n' +
    'Banting Postdoctoral Fellowships: жилд 70,000 CAD, 2 жил; гадаадын иргэн эрхтэй. Сайт «өргөдөл хүлээн авахаа больсон», залгамжлагч нь NSERC Canada Postdoctoral Research Award.',
  pros: [
    'Бакалавр, магистр, докторын төгсөгч мэргэжлийн чиглэлийн шаардлагагүйгээр PGWP авч болно (CLB 7 хэлний шаардлагатай); хөтөлбөр 2 жил ба түүнээс дээш бол 3 хүртэл жил.',
    'Хичээлийн улиралд кампусаас гадуур долоо хоногт 24 цаг, амралтаар хязгааргүй ажиллана.',
  ],
  cons: [
    'Санхүүгийн баталгаа 2026-09-01-ээс 23,448 CAD болж өссөн бөгөөд сургалтын төлбөр, тээврийн зардлыг нэмж нотолно.',
    'Коллеж, дипломын хөтөлбөрийн PGWP эрэлттэй чиглэлийн CIP кодоор хязгаарлагдана; хөтөлбөр сонгохдоо жагсаалтыг шалгана.',
  ],
  visaLinks: [
    { title: 'IRCC: Санхүүгийн баталгаа (оюутны виз)', url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/get-documents/financial-support.html' },
    { title: 'IRCC: Муж/нутгийн зөвшөөрлийн бичиг (PAL/TAL)', url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/get-documents/provincial-attestation-letter.html' },
    { title: 'IRCC: Кампусаас гадуур ажиллах', url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/work-off-campus.html' },
    { title: 'IRCC: PGWP — шаардлага', url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/after-graduation/eligibility.html' },
    { title: 'IRCC: PGWP — хугацаа', url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/after-graduation/about.html' },
    { title: 'IRCC: PGWP — чиглэлийн шаардлага (коллеж)', url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/after-graduation/eligibility/field-of-study.html' },
    { title: 'Pearson Scholarship (Торонто)', url: 'https://future.utoronto.ca/pearson' },
  ],
  source: {
    sourceName: 'IRCC (canada.ca); Vanier CGS; Banting; Торонтогийн их сургууль',
    sourceUrl: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit.html',
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
  if (!cur) console.log(`slug=${SLUG} олдсонгүй`);
  else {
    console.log('одоо livingCost =', JSON.stringify(cur.livingCostMonthlyUsd), '| admission =', JSON.stringify(cur.admissionGeneral));
    if (apply) {
      await Country.updateOne({ slug: SLUG }, { $set: SET, $unset: { livingCostMonthlyUsd: '' } });
      console.log('Канад шинэчлэгдлээ');
    } else console.log('Dry-run. Бичихийн тулд --apply.');
  }
  await mongoose.disconnect();
})();
