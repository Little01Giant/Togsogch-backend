// АНУ, Өмнөд Солонгос: албан ёсны эх сурвалжаар нэмж шалгасан утгыг оруулж, баталгаажаагүй тайлангийн утгыг ЗАСВАРЛАНА (2026-11-04).
// Хэрэглэгч хуучин утгыг дарж/хасаж болно гэж зөвшөөрсөн. Анхдагч нь dry-run; бичихийн тулд `--apply`. Идемпотент.
import { config } from 'dotenv';
import mongoose from 'mongoose';
import { CountrySchema } from '../src/schemas';

config();
const NOW = new Date();

const US = {
  slug: 'usa',
  set: {
    bachelorDuration: '4 жил (зарим хөтөлбөр 5 жил)',
    masterDuration: '1–2 жил',
    tuitionRange:
      'NCES 2022–23 дундаж (дотоодын оюутан): төрийн 4 жилийн сургууль $9,800, хувийн ашгийн бус $40,700 (жилд). Олон улсын бакалавр, UIUC 2026–27: төлбөр + хураамж $42,248–$53,078 (жилд). Бусад сургуулийн хүрээ баталгаажаагүй.',
    overview:
      'IIE Open Doors 2025: 2024/2025 хичээлийн жилд АНУ-д 1,177,766 олон улсын оюутан суралцсан нь дээд боловсролын нийт оюутны 6%. Тэдний 59% нь төрийн өмчийн байгууллагад, 57% нь STEM чиглэлээр суралцдаг. Жишээ (UIUC 2026–27): хоол, байр ~$15,858/жил; нийт тооцоот зардал $62,146–$72,976.',
    admissionGeneral:
      'Төгсөлтийн дараах виз (OPT): ердийн хөтөлбөрт 12 сар, STEM зэрэгтэй бол нэмэлт 24 сар (USCIS, 2024-11-25). Суралцах хугацаанд OPT-оор ажиллавал долоо хоногт ≤20 цаг ба төгсөлтийн дараах 12 сараас хасагдана. ' +
      'Цагийн ажил: F-1 оюутан хотхон дотор (DSO-ийн зөвшөөрөлтэй) хичээлийн үед долоо хоногт ≤20 цаг (бүх ажлын нийлбэр), амралтаар бүтэн цаг (ICE SEVIS). ' +
      'Банкны баталгаа: албан ёсны тогтсон дүн байхгүй. Элсэлтийн сургуулийн I-20 дээрх тооцоот зардлыг (сургалтын төлбөр + амьжиргаа) нэг жил, эсвэл хөтөлбөрийн хугацаа богино бол түүнийг хамарсан санхүүгийн чадвараа баримтаар харуулна; баримтыг зөвхөн сургуулийн DSO шалгана (Study in the States, DHS). ' +
      'Хураамж: SEVIS I-901 $350 (F-1), J-1 $220 (ICE, 2024-12-10); визийн мэдүүлгийн хураамж $185 (travel.state.gov, 2026 оны дүнг төлөхөөсөө өмнө дахин шалгана).',
    scholarshipInfo:
      'Fulbright Foreign Student (магистр, 2027–2028): Монгол иргэн, Монголд оршин суугч; бүтэн цагийн ажлын туршлага ≥1.5 жил; бакалаврын зэрэгтэй; TOEFL iBT/IELTS/Duolingo. Сургалтын төлбөр, сарын тэтгэмж, нислэг, даатгал, визийн хураамжийг хамарна. Эцсийн хугацааг хуудсанд «2025-04-27» гэж бичсэн нь үсгийн алдаа байж болзошгүй; тухайн жилийн хугацааг албан ёсны хуудсаар шалгана.\n\n' +
      'Global UGRAD (бакалавр, 1 семестр, зэрэг олгохгүй): нас 18–24; TOEFL iBT ≥48 хүрвэл авч үзэж, 48–60 бол хэлний бэлтгэлтэй, ≥61 бол шууд солилцоонд; хөтөлбөрийн дараа ≥1 жилийн сургалт үлдсэн байх.\n\n' +
      'Hubert H. Humphrey Fellowship (2027–2028, 10 сар, зэрэг олгохгүй): бакалаврын дараа ≥5 жилийн бүтэн цагийн ажил, удирдах/бодлогын албан тушаал; TOEFL 72 / Duolingo 100 / IELTS 6.0-аас дээш; буцаж ≥2 жил ажиллана.',
    visaLinks: [
      { title: 'АНУ-ын Элчин сайдын яам (Монгол): Fulbright Student Program', url: 'https://mn.usembassy.gov/fulbright-student-program/' },
      { title: 'АНУ-ын Элчин сайдын яам (Монгол): Global UGRAD', url: 'https://mn.usembassy.gov/global-ugrad/' },
      { title: 'АНУ-ын Элчин сайдын яам (Монгол): Humphrey Fellowship', url: 'https://mn.usembassy.gov/hubert-h-humphrey-fellowship/' },
      { title: 'USCIS: F-1 оюутны OPT', url: 'https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/optional-practical-training-opt-for-f-1-students' },
      { title: 'ICE SEVP: оюутны ажил эрхлэлт', url: 'https://www.ice.gov/sevis/employment' },
      { title: 'ICE: I-901 SEVIS хураамж', url: 'https://www.ice.gov/sevis/i901' },
      { title: 'Study in the States (DHS): санхүүгийн чадвар', url: 'https://studyinthestates.dhs.gov/students/prepare/financial-ability' },
      { title: 'АНУ-ын Төрийн департамент: оюутны виз', url: 'https://travel.state.gov/content/travel/en/us-visas/study/student-visa.html' },
    ],
    source: {
      sourceName:
        'USCIS (OPT); ICE SEVP (ажил, I-901); Study in the States/DHS (санхүүгийн чадвар); IIE Open Doors 2025; NCES 2022–23; UIUC 2026–27; EducationUSA (хугацаа); АНУ-ын Элчин сайдын яам Монгол (тэтгэлэг)',
      sourceUrl: 'https://www.ice.gov/sevis/employment',
      sourceType: 'government',
      fetchedAt: NOW,
      lastUpdatedAt: NOW,
      academicYear: '2024/2025; 2026–2027; тэтгэлэг 2027–2028',
      reliabilityStatus: 'primary',
      verificationStatus: 'in_review',
    },
  },
  unset: ['livingCostMonthlyUsd'],
};

const KR = {
  slug: 'south-korea',
  set: {
    bachelorDuration: '4 жил (эмч, шүд, эм зүй, мал эмнэлгийн чиглэлд 6 жил)',
    masterDuration: '2 жил буюу түүнээс дээш',
    educationSystem: 'Хаврын (3-р сар) ба намрын (9-р сар) семестр. Зарим магистр, докторын сургууль 6, 12-р сард ч элсүүлнэ. Докторын хугацаа 3 жил буюу түүнээс дээш (Study in Korea).',
    tuitionRange:
      'Корё Их Сургууль 2026 (албан ёсны): улирал тутам 5,800,000 KRW (хүмүүнлэг, нийгэм) – 7,800,000 KRW (урлаг); инженер 7,700,000 KRW. Улсын түвшний хүрээ баталгаажаагүй.',
    admissionGeneral:
      'Цагийн ажил (Study in Korea): долоо хоногт бакалаврт ≤30 цаг, магистр/докторт ≤35 цаг. Хэлний бэлтгэл (D-4) 6 сарын дараа TOPIK 2 буюу түүнтэй дүйцэх түвшинтэй бол; бакалаврын 1–2-р курс TOPIK 3, 3–4-р курс ба магистр/докторт TOPIK 4 шаардана. Нөхцөлийг дутуу хангавал ~10 цаг (магистр 15), магадлан итгэмжлэл/сурлагын шалгуур хангасан үед 25–30 цаг. Хуудас өөрөө зөрчилтэй, огноогүй тул албан ёсны эх сурвалжаар дахин шалгана. ' +
      'Виз: D-2 нэг удаа ≤2 жил; нийт оршин суух дээд хугацаа бакалавр 6, магистр 5, доктор 8 жил. D-2/D-4-д «санхүүгийн чадварын баримт» шаардана, гэхдээ албан ёсны хуудсанд KRW дүн заагаагүй. ' +
      'Сургуулийн жишээ: Jeonbuk NU (2026 хавар) банкны баталгаа 16,000,000 KRW (~$13,000), Солонгост зэрэгтэй/D-4-өөс шилжигчид 8,000,000 KRW, тодорхойлолт 30 хоногийн дотор — сургууль бүрээр өөр. ' +
      'Хэлний шаардлага сургууль/тэнхим бүрээр ялгаатай; улсын нэгдсэн TOPIK/TOEFL босго баталгаажаагүй.',
    scholarshipInfo:
      'Global Korea Scholarship (GKS), магистр/докторын 2026 гарын авлага (NIIED, 2026-02): эконом ангийн нислэг; сургалтын төлбөр ≤5,000,000 KRW (элсэлтийн хураамжийг сургууль хариуцна); хэлний бэлтгэлийн хураамж 5,200,000 KRW; сарын тэтгэмж — хэлний хөтөлбөр 14,400,000 KRW/жил, зэрэг 16,560,000 KRW/жил, судалгаа 20,880,000 KRW/жил (төсвөөс хамаарна). Бакалаврын GKS-ийн гарын авлагыг шалгаагүй.',
    commonExams: ['TOPIK'],
    overview:
      'Жишээ (Pusan National University, 2026/27): гадуур байр сарын ~350,000–500,000 KRW, барьцаа ~5,000,000 KRW; дотуур байр (хоолтой) нэг семестрт ~$1,170–1,650; NHIS даатгал заавал. Улсын түвшний амьдралын зардал баталгаажаагүй.',
    visaLinks: [
      { title: 'Study in Korea: виз ба оршин суух', url: 'https://www.studyinkorea.go.kr/ko/plan/visaAndStay.do' },
      { title: 'Study in Korea: оюутны цагийн ажлын журам', url: 'https://was1.studyinkorea.go.kr/ko/work/aboutForeignerEmploymentSystem.do' },
      { title: 'Study in Korea: суралцах сургуулийн төрөл, хугацаа', url: 'https://www.studyinkorea.go.kr/swb/plan/schoolType.do?tab=undergraduate-college' },
      { title: 'Study in Korea: хэлний шаардлага ба TOPIK', url: 'https://www.studyinkorea.go.kr/ko/plan/examAndKoreanStudy.do' },
      { title: 'Global Korea Scholarship 2026 (магистр/доктор) гарын авлага', url: 'https://www.studyinkorea.go.kr/cmm/fms/FileDown.do?atchFileId=FILE_000000000535168&fileSn=1' },
      { title: 'Корё Их Сургууль: 2026 сургалтын төлбөр', url: 'https://oia.korea.ac.kr/oia2026/Tuition.do' },
    ],
    source: {
      sourceName: 'Study in Korea (виз, ажил, хугацаа, хэл); NIIED GKS 2026; Корё Их Сургууль 2026; Jeonbuk NU 2026; Pusan NU 2026/27',
      sourceUrl: 'https://www.studyinkorea.go.kr/ko/plan/visaAndStay.do',
      sourceType: 'government',
      fetchedAt: NOW,
      lastUpdatedAt: NOW,
      academicYear: '2026',
      reliabilityStatus: 'primary',
      verificationStatus: 'in_review',
    },
  },
  unset: ['livingCostMonthlyUsd'],
};

(async () => {
  const apply = process.argv.includes('--apply');
  await mongoose.connect(process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/togsogch');
  console.log(`DB: ${mongoose.connection.host}/${mongoose.connection.name}`);
  const Country = mongoose.model('Country', CountrySchema);
  for (const t of [US, KR]) {
    const cur: any = await Country.findOne({ slug: t.slug }).lean();
    if (!cur) { console.log(`slug=${t.slug} олдсонгүй`); continue; }
    console.log(`\n${t.slug}: өөрчлөх талбар = ${Object.keys(t.set).concat(t.unset).join(', ')}; одоогийн livingCost =`, JSON.stringify(cur.livingCostMonthlyUsd));
    if (apply) {
      await Country.updateOne({ slug: t.slug }, { $set: t.set, $unset: Object.fromEntries(t.unset.map((k) => [k, ''])) });
      console.log(`${t.slug} шинэчлэгдлээ`);
    }
  }
  if (!apply) console.log('\nDry-run. Бичихийн тулд --apply.');
  await mongoose.disconnect();
})();
