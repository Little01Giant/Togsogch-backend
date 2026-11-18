// Дани: албан ёсны эх сурвалжаар шалгасан утгыг оруулж, баталгаажаагүй тайлангийн утгыг сольно (2026-11-04).
// Хэрэглэгч хуучин утгыг дарж/хасаж болно гэж зөвшөөрсөн. Анхдагч нь dry-run; бичихийн тулд `--apply`. Идемпотент.
import { config } from 'dotenv';
import mongoose from 'mongoose';
import { CountrySchema } from '../src/schemas';

config();
const NOW = new Date();
const SLUG = 'denmark';

const SET = {
  tuitionRange:
    'ЕХ/ЕЭЗ-ийн бус оюутанд сургалтын төлбөртэй, сургууль ба хөтөлбөрөөр ялгаатай. Жишээ: Copenhagen Business School бүтэн цагийн магистр 8,000 EUR/семестр (16,000 EUR/жил; хуудас ~13 сарын өмнөх). Улсын түвшний хүрээ албан ёсны эх сурвалжаар баталгаажаагүй.',
  admissionGeneral:
    'Санхүүгийн баталгаа (SIRI, nyidanmark.dk): 2026 онд сард 7,426 DKK, дээд тал нь 12 сараар (жилд 89,112 DKK = 7,426 × 12). Дансны хуулга 30 хоногоос хуучирсан байж болохгүй; тэтгэлэг, оюутны зээл мөн хүлээн зөвшөөрөгдөнө; крипто хүлээн авахгүй. Эхний семестрийн төлбөрийг төлсөн бол тусдаа санхүүгийн баталгаа ерөнхийдөө шаардахгүй (сургуулийн хуудас). ' +
    'Шинэ дүрэм (2026-10-01-ээс хойш мэдүүлсэн оюутанд, SIRI): төгсөөд ажил хайх оршин суух зөвшөөрөл 3 жилээс 1 жил болсон; бакалавр, магистрын оюутан эхнэр/нөхөр, хүүхдээ дагуулж оршин суух зөвшөөрөл авах эрхгүй (PhD оюутан хамаарахгүй). ' +
    'Цагийн ажлын цагийн хязгаар, ST1-ийн хураамж (3,060 DKK), биометрик хугацаа (14 хоног), өргөдлийн хураамж (150 EUR), Позитив жагсаалтын ажлын байрны тоо албан ёсны эх сурвалжаар баталгаажаагүй.',
  scholarshipInfo:
    'Danish Government Scholarships (ЕХ/ЕЭЗ-ийн бус оюутанд): нэг төвөөс биш, их сургууль өөрөө олгоно; төлбөрөөс бүрэн/хэсэгчлэн чөлөөлөх ба/эсвэл амьжиргааны тэтгэмж, сурлагын амжилтаар. Жишээ: Copenhagen Business School — төлбөрөөс чөлөөлөх + сард 8,000 DKK (дээд тал нь 22 сар, Данид татвартай); Копенгагены Их Сургууль — элссэн бол тусдаа өргөдөлгүй автоматаар авч үзнэ. Тэтгэлэг нь төлбөрөөс л чөлөөлдөг бол амьжиргаагаа даах чадвараа виз мэдүүлэхэд нотолно (Aarhus). Erasmus Mundus сарын 1,400 EUR гэсэн дүн баталгаажаагүй.',
  visaLinks: [
    { title: 'SIRI: оюутны шинэ дүрэм (2026-10-01)', url: 'https://www.nyidanmark.dk/en-GB/News-Front-Page/2026/09/SIRI---Nye-regler-for-studerende' },
    { title: 'SIRI: санхүүгийн баталгаа', url: 'https://nyidanmark.dk/en-GB/Words-and-concepts/SIRI/Self-support---SIRI' },
    { title: 'SIRI: төгсөөд ажил хайх зөвшөөрөл (1 эсвэл 3 жил)', url: 'https://www.nyidanmark.dk/de-DE/You-want-to-apply/Study/Study---job-seeking/Study---3-years-job-seeking' },
    { title: 'SIRI: оюутны оршин суух зөвшөөрөл (дээд боловсрол)', url: 'https://www.nyidanmark.dk/en-GB/You-want-to-apply/Study/Higher-Education' },
    { title: 'Study in Denmark: оршин суух зөвшөөрөл', url: 'https://studyindenmark.dk/live-in-denmark/permits-visas-red-tape/residence-permits-non-eu-eea-citizens' },
    { title: 'Копенгагены Их Сургууль: төлбөр, тэтгэлэг', url: 'https://www.ku.dk/studies/masters/application-and-admission/tuition-fees-and-scholarships' },
    { title: 'Copenhagen Business School: ЕХ-ны бус оюутан', url: 'https://www.cbs.dk/en/study/graduate/admission/non-eueea-citizens' },
  ],
  source: {
    sourceName: 'SIRI / nyidanmark.dk; Study in Denmark; Копенгагены Их Сургууль; Copenhagen Business School; Aarhus University',
    sourceUrl: 'https://nyidanmark.dk/en-GB/Words-and-concepts/SIRI/Self-support---SIRI',
    sourceType: 'government',
    fetchedAt: NOW,
    lastUpdatedAt: NOW,
    academicYear: '2026',
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
    console.log('одоо livingCost =', JSON.stringify(cur.livingCostMonthlyUsd), '| tuition =', JSON.stringify(cur.tuitionRange));
    if (apply) {
      await Country.updateOne({ slug: SLUG }, { $set: SET, $unset: { livingCostMonthlyUsd: '' } });
      console.log('Дани шинэчлэгдлээ');
    } else console.log('Dry-run. Бичихийн тулд --apply.');
  }
  await mongoose.disconnect();
})();
