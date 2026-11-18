// Сингапур: ICA (ica.gov.sg) дээр шалгасан утгыг оруулна (2026-11-06). Төлбөр, амьдралын зардал = гуравдагч этгээдийн тооцоо (estimate).
// Шалгаагүй: банкны баталгаа, цагийн ажлын журам, LTVP хугацаа, MOE Tuition Grant, SINGA, NUS/NTU шаардлага.
// Анхдагч нь dry-run; бичихийн тулд `--apply`. Идемпотент.
import { config } from 'dotenv';
import mongoose from 'mongoose';
import { CountrySchema } from '../src/schemas';

config();
const NOW = new Date();
const SLUG = 'singapore';
const STP = 'https://www.ica.gov.sg/reside/STP/apply';

const SET = {
  tuitionRange:
    'Албан ёсны эх сурвалжаар баталгаажаагүй тооцоо (princetonreview.sg, study-abroad.org зэрэг гуравдагч этгээдийн нэгтгэл, 2026; 1 SGD ≈ 0.74 USD): Төрийн (автономит) их сургууль — MOE Tuition Grant-тай жилд $12,500 – $28,000, grant-гүй $26,000 – $55,500. Хувийн сургууль (PEI) жилд дунджаар $11,000 – $18,000. Яг төлбөрийг сургуулийн албан ёсны сайтаас лавлана.',
  overview:
    'Сарын амьдралын зардлын тооцоо (баталгаажаагүй, гуравдагч этгээдийн нэгтгэл, 2026): нийт $710 – $2,450. Түрээс: сургуулийн дотуур байр $300 – $600, HDB хуваалцсан $520 – $900, хувийн кондо $900 – $1,500+. Хоол $180 – $370, тээвэр $60 – $110, даатгал семестрт ~$120.',
  livingCostMonthlyUsd: { min: 710, max: 2450 },
  admissionGeneral:
    'Оюутны виз (Student\'s Pass, ICA — ica.gov.sg, шинэчилсэн 2026-10-29): ICA-ийн батлагдсан өдрийн (бүтэн цагийн) хөтөлбөрт элсэн орсон байх ёстой; хагас цаг, оройн, амралтын өдрийн хөтөлбөрт Student\'s Pass өгөхгүй.\n\n' +
    'Төгсөлтийн дараах (ICA): дээд боловсролын байгууллага (IHL) төгсөгч Сингапурт ажил хайхад зориулсан Long-Term Visit Pass-ийн ангилал бий; ивээн тэтгэгч шаардахгүй, өөрөө мэдүүлнэ. Хугацаа ICA-ийн хуудсанд заагаагүй.\n\n' +
    'Банкны баталгааны дүн, цагийн ажлын журам, NUS/NTU-ийн оноо, хэлний шаардлага: Мэдээлэл байхгүй (албан ёсны хуудсаас баталгаажуулж чадсангүй; сургууль, ICA-аас лавлана).',
  scholarshipInfo:
    'MOE Tuition Grant болон A*STAR SINGA: Мэдээлэл байхгүй (албан ёсны хуудас олдсонгүй/уншигдсангүй; тэтгэлгийн хувь, ажиллах гэрээ, торгууль, хугацааг moe.gov.sg болон a-star.edu.sg дээрээс шалгана).',
  visaLinks: [
    { title: 'ICA: Student\'s Pass өргөдөл', url: STP },
    { title: 'ICA: IHL төгсөгчийн Long-Term Visit Pass', url: 'https://www.ica.gov.sg/information-and-e-services/long-term-visit-and-study/long-term-visit-pass/long-term-visit-pass-application-renewal' },
  ],
  source: {
    sourceName: 'ICA (ica.gov.sg); төлбөр, амьдралын зардал — гуравдагч этгээдийн тооцоо (баталгаажаагүй)',
    sourceUrl: STP,
    sourceType: 'government',
    fetchedAt: NOW,
    lastUpdatedAt: NOW,
    academicYear: '2026',
    reliabilityStatus: 'estimate',
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
    console.log('одоо livingCost =', JSON.stringify(cur.livingCostMonthlyUsd), '| tuition =', JSON.stringify(cur.tuitionRange));
    if (apply) {
      await Country.updateOne({ slug: SLUG }, { $set: SET });
      console.log('Сингапур шинэчлэгдлээ');
    } else console.log('Dry-run. Бичихийн тулд --apply.');
  }
  await mongoose.disconnect();
})();
