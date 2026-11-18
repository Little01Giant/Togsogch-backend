// Австрали: албан ёсны эх сурвалжаар шалгасан утгыг оруулж, баталгаажаагүй тайлангийн утгыг сольно (2026-11-04).
// Хэрэглэгч хуучин утгыг дарж/хасаж болно гэж зөвшөөрсөн. Анхдагч нь dry-run; бичихийн тулд `--apply`. Идемпотент.
import { config } from 'dotenv';
import mongoose from 'mongoose';
import { CountrySchema } from '../src/schemas';

config();
const NOW = new Date();
const SLUG = 'australia';

const SET = {
  tuitionRange:
    'Мэдээлэл байхгүй: Study Australia-ийн албан ёсны хуудсанд хэмжээ заагаагүй, сургууль, хөтөлбөр, хотоор ялгаатай. Тооцоолуур: costofliving.studyaustralia.gov.au (2023-11 шинэчлэлт).',
  admissionGeneral:
    'Оюутны виз (subclass 500, Home Affairs): нэг удаа 6 жил хүртэл, элсэлттэй уялдана. Цагийн ажил: хичээлийн үед 2 долоо хоногт ≤48 цаг; хичээлийн амралтаар хязгааргүй; судалгааны магистр, докторын оюутан хичээл эхэлснээс хойш хязгааргүй. OSHC эрүүл мэндийн даатгал заавал. ' +
    'Банкны баталгааны дүн албан ёсны хуудсаар баталгаажаагүй: Мэдээлэл байхгүй (2026-10-02-нд виз мэдүүлэх журам өөрчлөгдсөн, Home Affairs санхүүгийн шаардлагыг шинэчлэх хэлэлцүүлэг хийж байна). ' +
    'Төгсөлтийн дараах виз (subclass 485, Post-Higher Education Work): суух хугацаа ихэвчлэн 2–3 жил (зэрэгээс хамаарна); мэдүүлэгч 35 ба түүнээс доош настай (онцгой тохиолдол байж болно); Австралид байхдаа мэдүүлнэ; сүүлийн 6 сарын дотор оюутны визтэй байсан, CRICOS бүртгэлтэй хөтөлбөрийн зэрэгтэй, англи хэл, эрүүл мэндийн даатгал, цагдаагийн шалгалт; визийн хураамж AUD 5,750-аас.',
  scholarshipInfo:
    'Australia Awards Scholarships (Монгол): зөвхөн магистр (2027 оны элсэлтэнд coursework ба research). Бакалаврын зэрэг (голч ≥3.0), Монголд ≥2 жил тасралтгүй ажилласан туршлага (нийгмийн даатгалаар батална); хэлний шаардлага эх сурвалжаар зөрүүтэй: IELTS 6.0 (үе тус бүр ≥5.5) гэсэн хуудас ба 6.5 (≥6.0) гэсэн DFAT баримт байна — шалгана. Мэдүүлэг OASIS-ээр, ихэвчлэн 2-р сарын 1-нд нээгдэж 4-р сарын сүүлээр хаагдана (2027 оны элсэлтэнд 2026-04-30); дараагийн элсэлт 2027 оны эхээр. Тэтгэлгийн хамрах зардлыг албан ёсны «Award Entitlements» хуудсаар шалгана.',
  visaLinks: [
    { title: 'Home Affairs: оюутны виз (subclass 500)', url: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500' },
    { title: 'Home Affairs: Temporary Graduate (485) Post-Higher Education Work', url: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/temporary-graduate-485/post-higher-education-work' },
    { title: 'Study Australia: оюутны виз', url: 'https://www.studyaustralia.gov.au/en/plan-your-move/your-guide-to-visas/student-visa-subclass-500' },
    { title: 'Australia Awards Mongolia: хэн өргөдөл өгөх вэ', url: 'https://www.australiaawardsmongolia.org/scholarships/who-can-apply/' },
    { title: 'DFAT: Australia Awards нээх, хаах огноо', url: 'https://www.dfat.gov.au/people-to-people/australia-awards/australia-awards-scholarships-opening-and-closing-dates' },
  ],
  source: {
    sourceName: 'Home Affairs (500, 485); Study Australia; Australia Awards Mongolia / DFAT',
    sourceUrl: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500',
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
      console.log('Австрали шинэчлэгдлээ');
    } else console.log('Dry-run. Бичихийн тулд --apply.');
  }
  await mongoose.disconnect();
})();
