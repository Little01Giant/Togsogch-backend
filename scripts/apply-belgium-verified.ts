// Бельги: албан ёсны эх сурвалжаар шалгасан утгыг оруулж, баталгаажаагүй тайлангийн утгыг сольно (2026-11-04).
// Хэрэглэгч хуучин утгыг дарж/хасаж болно гэж зөвшөөрсөн. Анхдагч нь dry-run; бичихийн тулд `--apply`. Идемпотент.
import { config } from 'dotenv';
import mongoose from 'mongoose';
import { CountrySchema } from '../src/schemas';

config();
const NOW = new Date();
const SLUG = 'belgium';

const SET = {
  tuitionRange:
    'Фламандын бүс 2026–2027 (Study in Flanders): ЕХ-ны оюутан 1,181.40 EUR, ЕХ-ны бус оюутан бүтэн цагийн хөтөлбөрт 5,300–12,000 EUR/жил, урлагийн сургуульд 8,800–25,000 EUR (сургууль бүр өөрөө тогтооно). ' +
    'Франц хэлт бүс 2026–2027 (ULB): 1,194 EUR, ЕХ-ны бус орны иргэнд нэмэлт 4,175 EUR = 5,369 EUR; нэмэлт хураамжаас чөлөөлөгдөх улсын жагсаалт (ARES циркуляр, хавсралт 1–3) албан ёсны хуудсанд бүрэн байхгүй тул Монгол багтах эсэх баталгаажаагүй.',
  admissionGeneral:
    'Санхүүгийн баталгаа (Антверпений Их Сургууль, 2026–2027): сард 1,062 EUR; 12 сараар хаалттай данс 12,744 EUR (Studely эсвэл Ready Study Go зэрэг Бельгийн засгийн газраас хүлээн зөвшөөрсөн байгууллагад, оюутны нэр дээр); Бельгид очсоны дараа хэсэгчлэн шилжүүлнэ. Өөр хувилбар: тэтгэлгийн гэрчилгээ эсвэл батлан даагчийн хуудас (Annex 32, батлан даагч санхүүгийн чадвартай байх); батлан даагчийн орлогын босгыг албан ёсны хуудсанд заагаагүй тул баталгаажаагүй. ' +
    'Цагийн ажил: Student@work системд жилд 650 цагийн багц (2025-оос; өмнө 600), энэ дотор цалингаас 2.71% нийгмийн шимтгэл; Фландрт нэмэлт 80 цаг/сар, Валлонид 240 цаг/улирал (энгийн шимтгэлтэй). Гуравдагч орны оюутны ажиллах эрхийн нөхцөл (долоо хоногийн цаг) албан ёсны хуудсанд заагаагүй: Мэдээлэл байхгүй. ' +
    'Төгсөлтийн дараа: «Orientation year / Search year» — ЕХ-ны бус төгсөгчид ажил хайх, бизнес эхлүүлэхэд 12 сарын оршин суух зөвшөөрөл (сунгах боломжгүй; 3 сарын дараа ажил хайж буйгаа нотлох шаардлага гарч болно; 12 сарын санхүүгийн чадварыг дахин нотлоно; KU Leuven, UAntwerp). ' +
    'Бичиг баримт: Бельгийн Элчин сайдын яамны Монголын баримтын хуудсанд Монголын ГХЯ-аар баталгаажуулсан, апостиль хүлээн авахгүй гэсэн (хуучин, ~3 жилийн өмнөх) заалт байна. HCCH Монголыг Апостилийн конвенцийн гишүүн гэж бүртгэсэн тул зөрүүтэй: аль журам хамаарахыг виз хүлээн авах Бельгийн төлөөлөгчийн газраас лавлана.',
  scholarshipInfo:
    'Master Mind (Фламандын засгийн газар): жилд 10,225 EUR, 2 жил хүртэл; Орос бусад бүх иргэн; өргөдлийг Фламандын нэг сургуулиар нэр дэвшүүлнэ; өмнөх зэргийн голч 3.5/4.0, Фламандын бус сургуулийн зэрэгтэй, англи хэлний гэрчилгээ ≤3 жилийн настай; бусад Фламандын засгийн газар, Erasmus+/Erasmus Mundus, Fulbright тэтгэлэгтэй давхардахгүй; 2027–2028 оны нөхцөл хянагдаж байгаа. KU Leuven-д 2026-10-15-аас 2027-01-15 хүртэл. ' +
    'VLIR-UOS ICP Connect: хайлтаар олдсон зорилтот улсын жагсаалтуудад (25–29 улс) Монгол орсонгүй. ARES-ийн зорилтот улсыг баталгаажуулж чадаагүй. Erasmus Mundus сарын 1,400 EUR гэсэн дүн баталгаажаагүй.',
  visaLinks: [
    { title: 'Бельгийн Цагаачлалын алба (DOFI): оюутнууд', url: 'https://dofi.ibz.be/en/themes/ressortissants-dun-pays-tiers/etudes/favoris/sufficient-means-subsistence' },
    { title: 'Антверпений Их Сургууль: санхүүгийн баталгаа 2026–2027', url: 'https://www.uantwerpen.be/en/life-in-antwerp/visa-and-permits/students/non-eea-nationals/sufficient-means-of-subsistence/' },
    { title: 'Study in Flanders: сургалтын төлбөр', url: 'https://www.studyinflanders.be/practical-information/tuition-fees' },
    { title: 'ULB: сургалтын төлбөр', url: 'https://www.ulb.be/en/enrolment/tuitions-fees' },
    { title: 'Student@work: цагийн багц', url: 'https://www.studentatwork.be/en/hours-package-and-impact.html' },
    { title: 'Master Mind тэтгэлэг (Study in Flanders)', url: 'https://www.studyinflanders.be/scholarships/master-mind-scholarships' },
    { title: 'Orientation year (KU Leuven)', url: 'https://www.kuleuven.be/english/life-at-ku-leuven/immigration-residence/search-year' },
    { title: 'Бельгийн ЭСЯ: Монголын баримтын баталгаажуулалт', url: 'https://china.diplomatie.belgium.be/en/consular-services/legalisation-documents/legalization-mongolian-document' },
  ],
  source: {
    sourceName: 'Study in Flanders; ULB; UAntwerp; Student@work; KU Leuven; HCCH; VLIR-UOS; Бельгийн ГХЯ',
    sourceUrl: 'https://www.uantwerpen.be/en/life-in-antwerp/visa-and-permits/students/non-eea-nationals/sufficient-means-of-subsistence/',
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
    console.log('одоо livingCost =', JSON.stringify(cur.livingCostMonthlyUsd), '| tuition =', JSON.stringify(cur.tuitionRange));
    if (apply) {
      await Country.updateOne({ slug: SLUG }, { $set: SET, $unset: { livingCostMonthlyUsd: '' } });
      console.log('Бельги шинэчлэгдлээ');
    } else console.log('Dry-run. Бичихийн тулд --apply.');
  }
  await mongoose.disconnect();
})();
