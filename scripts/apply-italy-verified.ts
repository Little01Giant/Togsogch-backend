// Итали: албан ёсны эх сурвалжаар шалгасан утгыг оруулж, баталгаажаагүй тайлангийн утгыг сольно (2026-11-05).
// Хэрэглэгч хуучин утгыг дарж/хасаж болно гэж зөвшөөрсөн. Анхдагч нь dry-run; бичихийн тулд `--apply`. Идемпотент.
import { config } from 'dotenv';
import mongoose from 'mongoose';
import { CountrySchema } from '../src/schemas';

config();
const NOW = new Date();
const SLUG = 'italy';

const SET = {
  tuitionRange:
    'Улсын их сургуулийн төлбөрийг сургууль бүр өөрөө тогтооно, орлого/ISEE-ээс хамаарна. Жишээ: Падуа — 0-ээс ойролцоогоор 3,000 EUR/жил; Итали дахь орлогогүй, оршин суугч бус ЕХ-ны бус оюутанд тогтмол төлбөр (А1 орны 2,790 EUR, ядуу орны А2 930 EUR; жилийн хүснэгтийг unipd.it-д лавлана). Сапиенца (Ром) — гадаадад орлоготой оюутанд бүсээр тогтмол дүн (А бүс 300, Б бүс 700, нэмэлт түвшин 1,500 EUR). Хувийн сургуулийн төлбөр албан ёсны эх сурвалжаар баталгаажаагүй.',
  admissionGeneral:
    'Санхүүгийн баталгаа (Итали Гадаад хэргийн яам, esteri.it): 2026–27, 2027–28 оны элсэлтийн визэнд жилд 10,179.85 EUR; олон жилийн хөтөлбөрт зөвхөн эхний жилийнхийг нотолно. Өөрийн болон гэр бүлийн орлого (банкны хуулга, татварын баримт) хүлээн зөвшөөрөгдөнө; зөвхөн хадгаламжийн дэвтэр, банкны баталгаа, даатгалын бодлого, бэлэн мөнгө, гуравдагч этгээдийн баталгаа хүлээн авахгүй. Тэтгэлэг 10,179.85 EUR-аас бага бол зөрүүг нотолно. Зарим консул буцах нислэгийн зардал (~500 EUR) нэмж шаардана; Баку-гийн ЭСЯ сард 783.06 EUR гэж заасан тул өргөдөл хүлээн авах консулын дүрмийг шалгана. ' +
    'Цагийн ажил (esteri.it): оюутны зөвшөөрлөөр долоо хоногт ≤20 цаг, жилд ≤1,040 цаг. Төгсөхдөө ажлын гэрээтэй бол оюутны зөвшөөрөл хүчинтэй байх үедээ Sportello Unico Immigrazione-д ажлын зөвшөөрөл рүү шилжүүлж болно; Италид диплом авсан бол жилийн квотын тогтоолоор шилжих боломжтой. ' +
    'Дипломын дүйцүүлэлт: Улаанбаатар дахь Итали ЭСЯ Монголын боловсролын тогтолцооны дипломд «Declaration of Value» олгоно (апостиль, Итали орчуулгатай; сургалтын зорилгоор консулын хураамжгүй), эсвэл CIMEA-гийн гэрчилгээгээр орлуулна; виз мэдүүлэхээс өмнө авна. ' +
    'Эрүүл мэндийн даатгал: SSN-д сайн дураар бүртгүүлэх бол жилд хамгийн багадаа 700 EUR (хуанлийн жилээр, жил бүр шинэчилнэ); гэр бүлийн гишүүнд хамгийн багадаа 2,000 EUR. ' +
    'Төгсөлтийн дараах ажил хайх (attesa occupazione) зөвшөөрлийн 12 сарын хугацаа албан ёсны эх сурвалжаар баталгаажаагүй. Сарын амьжиргааны зардал баталгаажаагүй.',
  scholarshipInfo:
    'Итали Засгийн газрын тэтгэлэг (MAECI, Study in Italy портал): 2026–27 — 9 сар (2026-11-01–2027-07-31), магистр/AFAM/докторант, сард 1,200 EUR (нийт 10,800 EUR, 3 хуваан), эрүүл мэндийн даатгалтай. 2026–27 өргөдөл 2026-03-26-нд хаагдсан; Монгол иргэн хамрагдах эсэх портал дахь улсын жагсаалтаар баталгаажаагүй. 3 сарын хэл, соёлын курсийн тэтгэлэг мөн байдаг.\n\n' +
    'Бүс нутгийн DSU тэтгэлэг (орлого/ISEE-ээр): жишээ Лацио (DiSCo 2026/27) — хотод оршин суугч ~2,290 EUR + хоол, ойролцоох хотоос ирэгч ~3,591 EUR; гэр бүл нь гадаад улсад байгаа оюутан «хотоос гадуурх» ангилалд ордог (дүн хуудсанд бүрэн харагдаагүй). Падуа: ISEE дээд хязгаар ~26,306 EUR, ISPE ~43,126 EUR; 2026/27 мэдүүлэг 2026-09-30. Гадаадад гэр бүлтэй оюутан тусгай (дүйцүүлсэн) орлогын баримт ашигладаг; ER.GO болон EDISU-н дүнг шалгаагүй.',
  visaLinks: [
    { title: 'Итали ГХЯ: Итали дахь сургалт (виз, санхүүгийн баталгаа, ажил)', url: 'https://www.esteri.it/en/ministero/sportello_info/domandefrequenti/studiare-in-italia/' },
    { title: 'Итали ЭСЯ (Улаанбаатар): сургалтын виз', url: 'https://ambulaanbaatar.esteri.it/en/servizi-consolari-e-visti/servizi-per-il-cittadino-straniero/study-visa/' },
    { title: 'Итали ЭСЯ (Улаанбаатар): Declaration of Value', url: 'https://ambulaanbaatar.esteri.it/it/servizi-consolari-e-visti/servizi-per-il-cittadino-straniero/declaration-of-value/' },
    { title: 'Study in Italy: тэтгэлэг, элсэлт', url: 'https://studyinitaly.esteri.it/' },
    { title: 'Цагаачлалын портал: сургалтын оршин суух зөвшөөрөл (код 24)', url: 'https://www.portaleimmigrazione.it/ITA/soggMotiviStudio39.html' },
    { title: 'Падуагийн их сургууль: төлбөр', url: 'https://www.unipd.it/en/tuition-fees' },
    { title: 'Падуагийн их сургууль: бүс нутгийн тэтгэлэг', url: 'https://www.unipd.it/en/borse-studio-regionali' },
    { title: 'Сапиенца: эрүүл мэндийн үйлчилгээ (SSN)', url: 'https://www.uniroma1.it/en/pagina/healthcare-italy' },
  ],
  source: {
    sourceName: 'Итали Гадаад хэргийн яам (esteri.it); ЭСЯ Улаанбаатар; Цагаачлалын портал; Study in Italy; Падуа; Сапиенца; Lazio DiSCo',
    sourceUrl: 'https://www.esteri.it/en/ministero/sportello_info/domandefrequenti/studiare-in-italia/',
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
      console.log('Итали шинэчлэгдлээ');
    } else console.log('Dry-run. Бичихийн тулд --apply.');
  }
  await mongoose.disconnect();
})();
