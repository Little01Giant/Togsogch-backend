// Өмнөд Солонгосын улсын баримтад албан ёсны эх сурвалжаас шалгасан мэдээллийг оруулна (2026-11-04).
// Анхдагч нь dry-run; бичихийн тулд `--apply`. Идемпотент, зөвхөн slug=south-korea.
// Тайлангийн (баталгаажаагүй) өмнөх утгыг устгахгүй, MARK-ийн дараа үлдээнэ.
import { config } from 'dotenv';
import mongoose from 'mongoose';
import { CountrySchema } from '../src/schemas';

config();

const SLUG = 'south-korea';
const MARK = ' Судалгааны тайлангийн утга (баталгаажаагүй): ';
const WORK_URL = 'https://was1.studyinkorea.go.kr/ko/work/aboutForeignerEmploymentSystem.do';
const VISA_URL = 'https://www.studyinkorea.go.kr/ko/plan/visaAndStay.do';
const KU_URL = 'https://oia.korea.ac.kr/oia2026/Tuition.do';
const GKS_URL = 'https://www.studyinkorea.go.kr/cmm/fms/FileDown.do?atchFileId=FILE_000000000535168&fileSn=1';
const PNU_URL = 'https://international.pusan.ac.kr/sites/international/download/Exchange_Student_Program_Fact%20Sheet_2026Fall.pdf';
const NOW = new Date();

const VERIFIED = {
  admissionGeneral:
    'Цагийн ажил (Study in Korea): долоо хоногт бакалаврт ≤30 цаг, магистр/докторт ≤35 цаг. Хэлний бэлтгэл (D-4) 6 сарын дараа TOPIK 2 буюу түүнтэй дүйцэх түвшинтэй бол; бакалаврын 1–2-р курс TOPIK 3, 3–4-р курс ба магистр/докторт TOPIK 4 шаардана. Нөхцөлийг дутуу хангавал ердөө ~10 цаг (магистр 15), магадлан итгэмжлэл/сурлагын шалгуур хангасан үед 25–30 цаг. Хуудас өөрөө зөрчилтэй, огноогүй тул хэрэглэхээсээ өмнө албан ёсны эх сурвалжаар дахин шалгана. ' +
    'Виз: D-2 нэг удаа ≤2 жил; нийт оршин суух дээд хугацаа бакалавр 6, магистр 5, доктор 8 жил (Study in Korea). Банкны баталгааны дүн улсын түвшинд нэгдсэн албан ёсны эх сурвалжаар баталгаажаагүй: Jeonbuk National University (2026 хавар) 16,000,000 KRW (~$13,000), Солонгост зэрэг авсан/D-4-өөс шилжигчид 8,000,000 KRW, банкны тодорхойлолт 30 хоногийн дотор — сургууль бүрээр өөр.',
  tuitionRange:
    'Корё Их Сургууль 2026 (албан ёсны): улирал тутам 5,800,000 KRW (хүмүүнлэг, нийгэм) – 7,800,000 KRW (урлаг); инженер 7,700,000 KRW. Төрийн ба бусад сургуулийн улсын түвшний хүрээ баталгаажаагүй.',
  scholarshipInfo:
    'Global Korea Scholarship (GKS), магистр/докторын 2026 гарын авлага (NIIED, 2026-02): эконом ангийн нислэг; сургалтын төлбөр ≤5,000,000 KRW (элсэлтийн хураамжийг сургууль хариуцна); хэлний бэлтгэлийн хураамж 5,200,000 KRW; сарын тэтгэмж — хэлний хөтөлбөр 14,400,000 KRW/жил, зэрэг 16,560,000 KRW/жил, судалгаа 20,880,000 KRW/жил (төсвөөс хамаарна). Бакалаврын GKS-ийн гарын авлагыг шалгаагүй.',
  overview:
    'Жишээ (Pusan National University, 2026/27): гадуур байр сарын ~350,000–500,000 KRW, барьцаа ~5,000,000 KRW; дотуур байр (хоолтой) нэг семестрт ~$1,170–1,650; сурагчийн NHIS даатгал заавал. Улсын түвшний амьдралын зардал баталгаажаагүй.',
  visaLinks: [
    { title: 'Study in Korea: виз ба оршин суух', url: VISA_URL },
    { title: 'Study in Korea: оюутны цагийн ажлын журам', url: WORK_URL },
    { title: 'Global Korea Scholarship 2026 (магистр/доктор) гарын авлага', url: GKS_URL },
    { title: 'Корё Их Сургууль: 2026 сургалтын төлбөр', url: KU_URL },
    { title: 'Pusan National University: Exchange fact sheet 2026/27', url: PNU_URL },
  ],
  source: {
    sourceName:
      'Study in Korea (виз, цагийн ажил); NIIED GKS 2026; Корё Их Сургууль 2026; Jeonbuk NU 2026 хавар; Pusan NU 2026/27. Бусад талбар: судалгааны тайлан 2026-11-03, баталгаажаагүй',
    sourceUrl: VISA_URL,
    sourceType: 'government',
    fetchedAt: NOW,
    lastUpdatedAt: NOW,
    academicYear: '2026',
    reliabilityStatus: 'primary',
    verificationStatus: 'in_review',
  },
};

const baseOf = (v?: string) => (v ? (v.includes(MARK) ? v.split(MARK)[1] : v).trim() : '');
const withReport = (verified: string, cur?: string) => {
  const b = baseOf(cur);
  return b ? `${verified}${MARK}${b}` : verified;
};

(async () => {
  const apply = process.argv.includes('--apply');
  await mongoose.connect(process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/togsogch');
  const Country = mongoose.model('Country', CountrySchema);
  const cur: any = await Country.findOne({ slug: SLUG }).lean();
  if (!cur) {
    console.log(`slug=${SLUG} олдсонгүй`);
    await mongoose.disconnect();
    return;
  }
  const set = {
    admissionGeneral: withReport(VERIFIED.admissionGeneral, cur.admissionGeneral),
    tuitionRange: withReport(VERIFIED.tuitionRange, cur.tuitionRange),
    scholarshipInfo: withReport(VERIFIED.scholarshipInfo, cur.scholarshipInfo),
    overview: cur.overview && !cur.overview.startsWith('Жишээ (Pusan') ? `${VERIFIED.overview} ${cur.overview}` : VERIFIED.overview,
    visaLinks: VERIFIED.visaLinks,
    source: VERIFIED.source,
  };
  console.log(`DB: ${mongoose.connection.host}/${mongoose.connection.name}`);
  for (const k of Object.keys(set)) console.log(`\n[${k}] одоо:`, JSON.stringify(cur[k]) ?? '(хоосон)');
  if (!apply) console.log('\nDry-run. Бичихийн тулд --apply.');
  else {
    await Country.updateOne({ slug: SLUG }, { $set: set });
    console.log('\nӨмнөд Солонгос шинэчлэгдлээ.');
  }
  await mongoose.disconnect();
})();
