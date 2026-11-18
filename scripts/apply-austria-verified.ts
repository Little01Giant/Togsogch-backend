// Австри: албан ёсны эх сурвалжаар шалгасан утгыг оруулж, баталгаажаагүй тайлангийн утгыг сольно (2026-11-04).
// Хэрэглэгч хуучин утгыг дарж/хасаж болно гэж зөвшөөрсөн. Анхдагч нь dry-run; бичихийн тулд `--apply`. Идемпотент.
import { config } from 'dotenv';
import mongoose from 'mongoose';
import { CountrySchema } from '../src/schemas';

config();
const NOW = new Date();
const SLUG = 'austria';

const SET = {
  tuitionRange:
    'Улсын их сургууль, ЕХ-ны бус оюутан (Венийн Их Сургууль, албан ёсны): семестр тутам 726.72 EUR + оюутны холбооны хураамж (ÖH) 26.20 EUR = 752.92 EUR. Study in Austria-ийн хуудсанд 751.92 EUR гэж бичсэн нь зөрүүтэй. Зарим оюутан ЕХ-ны хэмжээгээр төлж болно. Хэрэглээний шинжлэх ухааны (FH) болон хувийн сургуулийн төлбөр албан ёсны эх сурвалжаар баталгаажаагүй.',
  admissionGeneral:
    'Оюутны оршин суух зөвшөөрлийн санхүүгийн баталгаа (OeAD, 2026): 24 нас хүрээгүй сард ~722.58 EUR, 24+ сард ~1,308.39 EUR; хос 2,064.12 EUR, хүүхэд тус бүр +201.88 EUR. Байрны зардал сард 386.43 EUR-оос давбал зөрүүг нэмж батална; өөрөө даатгуулах эрүүл мэндийн даатгал ~78.84 EUR/сар. Мөнгө өргөдөл гаргагчийн нэр дээрх, Австрээс хандах боломжтой данс эсвэл ЕХ-д оршин суугчийн батлан даалтын бичиг, тэтгэлгийн баталгаа; мөнгөний гарал үүслийн (сүүлийн 6 сарын хуулга) асуулт гарч болно. 12 сараар ба 2 жилээр гэсэн хоёр OeAD хуудас зөрүүтэй тул цагаачлалын байгууллагаас лавлана. ' +
    'Цагийн ажил: гуравдагч орны оюутан долоо хоногт ≤20 цаг, ажил олгогч AMS-д ажил эрхлэх зөвшөөрөл (Beschäftigungsbewilligung) мэдүүлнэ; 20 цагаас дээш бол хөдөлмөрийн зах зээлийн шалгалт хийгдэнэ. ' +
    'Төгсөлтийн дараа: оршин суух зөвшөөрлийг нэг удаа 12 сараар сунгаж ажил хайна; Австрийн их сургуулийн төгсөгч Red-White-Red картыг (оноо, AMS шалгалтгүй, ажил долоо хоногт ≥30 цаг, цалин Австрийн ижил түвшний төгсөгчийнхтэй тэнцүү, 2 жил, ажил олгогчтой холбоотой) мэдүүлж болно. ' +
    'Бичиг баримт: Монголын баримт бүрэн дипломат баталгаажуулалт (Монголын дотоодын журам, ГХЯ, дараа нь Австрийн төлөөлөгчийн газар) шаардана, Гаагийн апостиль хүрэлцэхгүй (Венийн Их Сургуулийн жагсаалт); герман орчуулга. Визийн хураамж, VFS-ийн үйлчилгээний төлбөр баталгаажаагүй.',
  scholarshipInfo:
    'Ernst Mach Grant Worldwide (OeAD): 1–9 сар, нас ≤35, докторант ба зэрэг горилогч, post-doc судалгааны оршихуй; 2027/28 жилд 2026-12-01 23:59 CET хүртэл мэдүүлнэ; тэтгэмжийн хэмжээ OeAD хуудсанд заагаагүй.\n\nErnst Mach Grant Fachhochschule: 4–10 сар, нас ≤35, мэдүүлэг 2-р сарын 1 хүртэл; тэтгэмжийн хэмжээ заагаагүй. Австрийн бүрэн зэргийн тэтгэлэг ховор; бүрэн жагсаалт grants.at.',
  visaLinks: [
    { title: 'OeAD: оюутны оршин суух зөвшөөрөл', url: 'https://oead.at/en/to-austria/entry-and-residence/residence-permit-student-no-mobility-programme' },
    { title: 'Австрийн цагаачлалын портал: Австрид суралцах', url: 'https://www.migration.gv.at/en/living-and-working-in-austria/study-in-austria/' },
    { title: 'Австрийн цагаачлалын портал: төгсөгчид', url: 'https://www.migration.gv.at/en/types-of-immigration/permanent-immigration/graduates/' },
    { title: 'Венийн Их Сургууль: бичиг баримтын баталгаажуулалт', url: 'https://studieren.univie.ac.at/en/applying-for-a-programme/international-students/legalisation' },
    { title: 'Венийн Их Сургууль: сургалтын төлбөр', url: 'https://studieren.univie.ac.at/en/studying-and-learning/financial-matters/amount-of-the-tuition-fee/students-union-fee' },
    { title: 'OeAD: Ernst Mach Grant', url: 'https://oead.at/en/study-research-teaching/overview-grants-and-scholarships/ernst-mach-grant' },
    { title: 'Study in Austria: сургалтын төлбөр', url: 'https://studyinaustria.at/en/plan-your-studies/tuition-fee' },
  ],
  source: {
    sourceName: 'OeAD; Австрийн цагаачлалын портал (migration.gv.at); Венийн Их Сургууль; Study in Austria',
    sourceUrl: 'https://oead.at/en/to-austria/entry-and-residence/residence-permit-student-no-mobility-programme',
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
      console.log('Австри шинэчлэгдлээ');
    } else console.log('Dry-run. Бичихийн тулд --apply.');
  }
  await mongoose.disconnect();
})();
