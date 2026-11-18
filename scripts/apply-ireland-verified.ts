// Ирланд: албан ёсны эх сурвалжаар шалгасан утгыг оруулж, баталгаажаагүй тайлангийн утгыг сольно (2026-11-05).
// Хэрэглэгч хуучин утгыг дарж/хасаж болно гэж зөвшөөрсөн. Анхдагч нь dry-run; бичихийн тулд `--apply`. Идемпотент.
import { config } from 'dotenv';
import mongoose from 'mongoose';
import { CountrySchema } from '../src/schemas';

config();
const NOW = new Date();
const SLUG = 'ireland';

const SET = {
  tuitionRange:
    'ЕХ/ЕЭЗ-ийн бус оюутан, бүтэн цагийн (сургууль бүрийн албан ёсны жагсаалтаас; жил бүр өөрчлөгдөнө): бакалавр DCU 2027–28 — 17,750 EUR (боловсрол) – 23,850 EUR (инженер, шинжлэх ухаан), UCC 2026/27 — 27,000 EUR; магистр UCC 9,000–30,000 EUR, DCU 2027–28 — ~16,200–25,000 EUR (Executive MBA 27,600 EUR). Улсын түвшний нэгдсэн хүрээ албан ёсны эх сурвалжаар баталгаажаагүй.',
  admissionGeneral:
    'Санхүүгийн баталгаа (Irish Immigration Service, 2025-06-30-аас): 1 жилийн хөтөлбөрт 10,000 EUR (дараагийн жил бүрд ижил); сүүлийн 6 сарын банкны хуулга (албан бланктай, гараар бичсэн нэгтгэл, кредит карт хүлээн авахгүй; том эсвэл жигд бус орлогыг тайлбарлана); зарим тохиолдолд банкны хуулгын оронд 10,000 EUR-аас доошгүй education bond ашиглаж болно. Сургалтын төлбөрийг төлсөн баримт мөн шаардана — 6,000 EUR-ийн босго хуучирсан байж болзошгүй тул албан ёсны хуудсаар шалгана. ' +
    'Цагийн ажил (Citizens Information): Stamp 2 оюутан хичээлийн үеэр долоо хоногт ≤20 цаг, амралтаар (6–9 сар, 12-р сарын 15–1-р сарын 15) ≤40 цаг; Stamp 2A оюутан ажиллахгүй. Хамгийн бага цалин 2026-01-01-ээс цагт 14.15 EUR. ' +
    'Төгсөлтийн дараа (Third Level Graduate Scheme, Stamp 1G): 8-р түвшний (бакалавр) төгсөгчид 12 сар, 9+ түвшний (магистр, доктор) 24 сар (12 сарын 2 блок); бүтэн цагаар ажиллана, гэхдээ бие даан бизнес эрхэлж болохгүй; хугацаа дуусахаас өмнө хөдөлмөрийн зөвшөөрөлтэй ажил олох эсвэл өөр зөвшөөрөл авах ёстой. ' +
    'Foundation (IFP) шаардлага, элсэлтийн IELTS/TOEFL босго, Бээжин дэх ЭСЯ, VFS, AVATS-ийн дэлгэрэнгүй албан ёсны эх сурвалжаар баталгаажаагүй.',
  scholarshipInfo:
    'Government of Ireland International Education Scholarship (GOI-IES, HEA): 9–10-р түвшний (магистр, доктор) 1 жилийн бүтэн цагийн хөтөлбөрт 10,000 EUR тэтгэмж + сургууль сургалтын төлбөрийг бүрэн чөлөөлнө; өргөдлийн үед Ирландын сургуулийн (нөхцөлтэй эсвэл эцсийн) элсэлтийн урилгатай байх; ЕХ/ЕЭЗ, Швейцар, Их Британиас гадна иргэн (Орос, Беларусь хамаарахгүй). 2026-ийн хугацаа 2026-03-12-нд хаагдсан, 2027-ийн нээх/хаах огноо албан ёсны хуудсанд хараахан гараагүй. Trinity College зэрэг зарим сургууль World Bank-ийн бага, дунд-бага орлоготой орны иргэнд хязгаарласан тул Монгол хамаарах эсэхийг сургууль бүрийн жагсаалтаар шалгана.\n\n' +
    'UCD Global Excellence Scholarship (UCD): сургалтын төлбөрийн 50% эсвэл 100%; элссэн (урилгатай) ЕХ-ны бус оюутанд; 2027/28 элсэлтэнд мэдүүлэг 11-р сард нээгдэж, бүс нутгаар 2027-02-01, 2027-02-28, 2027-03-31 (огноо түр, UCD эцэслэнэ).',
  visaLinks: [
    { title: 'Irish Immigration: оюутны санхүүгийн шаардлага', url: 'https://www.irishimmigration.ie/coming-to-study-in-ireland/what-are-my-study-options/a-fee-paying-private-primary-or-secondary-school/information-on-student-finances/' },
    { title: 'Irish Immigration: 2025-06-30-ны санхүүгийн сануулга', url: 'https://www.irishimmigration.ie/reminder-on-student-finance-requirements-from-30-june-2025/' },
    { title: 'Citizens Information: ЕЭЗ-ээс гадна оюутны дүрэм', url: 'https://www.citizensinformation.ie/en/moving-country/moving-to-ireland/studying-in-ireland/immigration-nonEEA-students/' },
    { title: 'HEA: GOI-IES тэтгэлэг', url: 'https://hea.ie/policy/internationalisation/goi-ies/' },
    { title: 'UCD: Global Excellence тэтгэлэг', url: 'https://www.ucd.ie/global/study-at-ucd/scholarshipsfinances/scholarships/globalexcellencescholarships/' },
    { title: 'Citizens Information: хамгийн бага цалин', url: 'https://www.citizensinformation.ie/en/employment/employment-rights-and-conditions/pay-and-employment/minimum-wage/' },
    { title: 'Ирландын ЭСЯ (Бээжин): виз (Монголын өргөдөл, нээж шалгаагүй)', url: 'https://www.ireland.ie/en/china/beijing/services/visas/visa-types-documentation/' },
  ],
  source: {
    sourceName: 'Irish Immigration Service Delivery; Citizens Information; HEA (GOI-IES); UCD; DCU; UCC',
    sourceUrl: 'https://www.irishimmigration.ie/coming-to-study-in-ireland/what-are-my-study-options/a-fee-paying-private-primary-or-secondary-school/information-on-student-finances/',
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
      console.log('Ирланд шинэчлэгдлээ');
    } else console.log('Dry-run. Бичихийн тулд --apply.');
  }
  await mongoose.disconnect();
})();
