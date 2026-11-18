// Япон: албан ёсны эх сурвалжаар шалгасан утгыг оруулж, баталгаажаагүй тайлангийн утгыг сольно (2026-11-04).
// Хэрэглэгч хуучин утгыг дарж/хасаж болно гэж зөвшөөрсөн. Анхдагч нь dry-run; бичихийн тулд `--apply`. Идемпотент.
import { config } from 'dotenv';
import mongoose from 'mongoose';
import { CountrySchema } from '../src/schemas';

config();
const NOW = new Date();
const SLUG = 'japan';

const SET = {
  tuitionRange:
    'Study in Japan (албан ёсны, ханш 1 USD = 114 JPY дээр тооцсон хуучин хүснэгт): бакалаврын эхний жилийн элсэлт + төлбөр — улсын их сургууль ~820,000 JPY, орон нутгийн улсын ~930,000 JPY, хувийн 1,100,000–1,640,000 JPY (анагаах, шүд, эм зүйгээс бусад). Улсын их сургуулийн магистр/доктор: сургалтын төлбөр 535,800 JPY/жил, элсэлтийн хураамж 282,000 JPY (зөвхөн эхний жил).',
  overview:
    'JASSO 2023 судалгаа (хувийн зардлаар суралцагч олон улсын оюутан, суралцах зардлаас бусад): сарын нийт дундаж зарлага 105,000 JPY. Байрны түрээс улсын дундаж 41,000 JPY, Токио 57,000 JPY, Канто 51,000 JPY, Сикоку 27,000 JPY. Хоол, даатгал, дотуур байрны тоо албан ёсны эх сурвалжаар баталгаажаагүй.',
  admissionGeneral:
    'Цагийн ажил: оюутан Цагаачлалын албанаас «үндсэн статусаас гадуурх үйл ажиллагааны зөвшөөрөл» авсны дараа долоо хоногт ≤28 цаг ажиллана; урт амралтаар өдөрт ≤8 цаг. Зөвшөөрөлгүй цалинтай ажил хийвэл албадан гаргах үндэслэл болно (Study in Japan, ISA). ' +
    'Төгсөлтийн дараах виз: ажил хайхад «Designated Activities» 6 сар, нэг удаа сунгаж нийт ≤1 жил; сургуулийн зөвлөмжийн захидал, зардлаа даах чадварын баримт шаардлагатай; зөвхөн их сургуулийн төгсөгчид (Study in Japan, ISA). ' +
    'Визийн банкны баталгааны тогтсон дүн албан ёсны эх сурвалжаар олдсонгүй: Мэдээлэл байхгүй (элчин сайдын яам, элсэх сургуулиас лавлана).',
  scholarshipInfo:
    'MEXT (Засгийн газрын тэтгэлэг, Study in Japan): сарын тэтгэмж — бакалавр 117,000 JPY; судалгааны оюутан бэлтгэл/зэрэггүй 143,000, магистр 144,000, доктор 145,000 JPY (бүс нутгийн нэмэгдэл 2,000–3,000 JPY); элсэлтийн шалгалт, элсэлт, сургалтын төлбөрийг чөлөөлнө. Дүн жил бүр өөрчлөгдөж болно.\n\n' +
    'JASSO Honors Scholarship (хувийн зардлаар суралцагч): сард 48,000 JPY (бакалавр, магистр/доктор г.м), япон хэлний сургуульд 30,000 JPY; гэрээс ирэх сарын мөнгө 90,000 JPY-ээс бага байх шаардлагатай.',
  visaLinks: [
    { title: 'Study in Japan: амьдралын зардал', url: 'https://www.studyinjapan.go.jp/en/life/cost-of-living/' },
    { title: 'Study in Japan: цагийн ажил', url: 'https://www.studyinjapan.go.jp/en/work-in-japan/part-time-jobs/' },
    { title: 'Study in Japan: Япон дахь ажил эрхлэлт ба статус', url: 'https://www.studyinjapan.go.jp/en/work-in-japan/employment/' },
    { title: 'Study in Japan: сургалтын төлбөр', url: 'https://www.studyinjapan.go.jp/en/assets/pdf/life/academic_fees.pdf' },
    { title: 'Study in Japan: MEXT тэтгэлэг', url: 'https://www.studyinjapan.go.jp/en/planning/scholarships/mext-scholarships/' },
    { title: 'JASSO: Honors Scholarship', url: 'https://www.jasso.go.jp/en/ryugaku/scholarship_j/shoreihi/about.html' },
    { title: 'Цагаачлалын алба (ISA): Designated Activities', url: 'https://www.moj.go.jp/isa/applications/procedures/nyuukokukanri07_00208.html' },
  ],
  source: {
    sourceName: 'Study in Japan / JASSO (амьдрал 2023, төлбөр, тэтгэлэг), MEXT 2027 гарын авлага, Цагаачлалын алба (ISA)',
    sourceUrl: 'https://www.studyinjapan.go.jp/en/life/cost-of-living/',
    sourceType: 'government',
    fetchedAt: NOW,
    lastUpdatedAt: NOW,
    academicYear: '2023 (амьдрал); 2027 (MEXT)',
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
    console.log('одоо livingCost =', JSON.stringify(cur.livingCostMonthlyUsd), '| admissionGeneral =', JSON.stringify(cur.admissionGeneral));
    if (apply) {
      await Country.updateOne({ slug: SLUG }, { $set: SET, $unset: { livingCostMonthlyUsd: '' } });
      console.log('Япон шинэчлэгдлээ');
    } else console.log('Dry-run. Бичихийн тулд --apply.');
  }
  await mongoose.disconnect();
})();
