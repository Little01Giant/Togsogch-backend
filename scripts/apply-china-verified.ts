// Хятад: албан ёсны эх сурвалжаар шалгасан утгыг оруулж, баталгаажаагүй тайлангийн утгыг сольно (2026-11-04).
// Хэрэглэгч хуучин утгыг дарж/хасаж болно гэж зөвшөөрсөн. Анхдагч нь dry-run; бичихийн тулд `--apply`. Идемпотент.
import { config } from 'dotenv';
import mongoose from 'mongoose';
import { CountrySchema } from '../src/schemas';

config();
const NOW = new Date();
const SLUG = 'china';

const SET = {
  tuitionRange:
    'Бээжингийн Их Сургууль (PKU, албан ёсны жагсаалт, жилд): бакалавр 26,000 RMB (хүмүүнлэг, нийгэм) – 30,000 RMB (шинжлэх ухаан, инженер); хятад хэлээр магистр 29,000–33,000 RMB, доктор 32,000–40,000 RMB (хуучин жагсаалт). Англи хэлний зарим хөтөлбөр (жишээ нь компьютерийн ухааны магистр/доктор) жилд 50,000 RMB. 2025–2026 оны жагсаалт хөтөлбөрийн нийт дүнгээр өгсөн тул эх сурвалжууд зөрүүтэй. Улсын түвшний хүрээ баталгаажаагүй.',
  overview:
    'Жишээ (Цинхуа Их Сургуулийн дотуур байр, Бээжин): хоёр хүний өрөө 40 RMB, гурван хүний өрөө 30 RMB (нэг ор, өдөрт); нэг хүний өрөө/AB өрөө 80 RMB (өөр хуудас). Улсын түвшний амьдралын зардал албан ёсны эх сурвалжаар баталгаажаагүй.',
  admissionGeneral:
    'Виз X1 (180 хоногоос урт суралцах, CVASC 2026-08-26): элсэлтийн захидал, JW201 эсвэл JW202 маягт, «санхүүгийн баталгаа жилд $2,500 (суралцах хугацаанаас хамаарна) эсвэл тэтгэлгийн гэрчилгээ». Орсноос хойш 30 хоногийн дотор оршин суух зөвшөөрөл мэдүүлнэ. ' +
    'Цагийн ажил: сургууль болон цагаачлалын байгууллагын зөвшөөрөл, оршин суух зөвшөөрөл дээрх тэмдэглэгээ шаардлагатай. Албан ёсны хэд хэдэн хуудсанд цагийн хязгаар (8 цаг/7 хоног, 20 цаг, 24 цаг) зөрүүтэй тул тоог баталгаажуулж чадсангүй: Мэдээлэл байхгүй. ' +
    'Төгсөлтийн дараа: Хятадад магистр буюу түүнээс дээш зэрэг авсан, төгссөнөөс хойш 1 жилийн дотор байгаа гадаад төгсөгч ажлын туршлагын гэрчилгээнээс чөлөөлөгдөж болно (Бээжингийн албан ёсны мэдэгдэл, 2020–21; орон нутгийн квот, голч оноо ~80 шаардлага байдаг), ажлын виз Z. ' +
    'Хугацаа хэтрүүлэх: Гадаадынхны орох, гарах хуулийн 78-р зүйл — өдрийн 500 RMB, нийт ≤10,000 RMB торгууль эсвэл 5–15 хоног саатуулалт (ноцтой тохиолдолд).',
  scholarshipInfo:
    'Хятадын Засгийн газрын тэтгэлэг (CSC, Study in China / Campus China): сургалтын төлбөрийг чөлөөлнө; сарын тэтгэмж бакалавр 2,500, магистр 3,000, доктор 3,500 CNY; байр — дотуур байр эсвэл сард 700 CNY (бакалавр/магистр), 1,000 CNY (доктор) тэтгэмж; эрүүл мэндийн даатгал жилд ~800 CNY. Хөтөлбөр, сургуулиас хамаарч бүрэн/хэсэгчилсэн ялгаатай. Өвөр Монголын Засгийн газрын тэтгэлэг: албан ёсны эх сурвалжаар баталгаажаагүй.',
  visaLinks: [
    { title: 'Хятадын визийн мэдүүлгийн төв (CVASC): X1 урт хугацаат суралцах виз', url: 'https://www.visaforchina.cn/TAS4_EN/qianzhengyewu/jichuzhishi/banliliucheng/552382625898172433.html' },
    { title: 'БНХАУ-ын Элчин сайдын яам (Монгол): энгийн виз мэдүүлэх', url: 'https://mn.china-embassy.gov.cn/eng/lsfw2025/lszj_142617/202506/t20250612_11647384.htm' },
    { title: 'Campus China: Хятадын Засгийн газрын тэтгэлэг', url: 'https://campuschina.org/content/details3_74776.html' },
    { title: 'Study in China: тэтгэлэг', url: 'http://www.studyinchina.org.cn/scholarship/' },
    { title: 'Бээжингийн Их Сургууль: гадаад оюутны төлбөр (2026)', url: 'https://isd.pku.edu.cn/userfiles/editor/202511100934175958.pdf' },
    { title: 'Цинхуа: дотуур байр ба даатгал', url: 'https://yz.tsinghua.edu.cn/en/info/1024/1102.htm' },
    { title: 'Гадаадынхны орох, гарах хууль', url: 'https://en.nia.gov.cn/n147418/n147458/c155978/content.html' },
    { title: 'Бээжин: гадаад төгсөгчийн ажил эрхлэлтийн мэдэгдэл', url: 'https://english.beijing.gov.cn/studyinginbeijing/upongraduation/202005/t20200514_1897759.html' },
  ],
  source: {
    sourceName: 'CVASC X1 (2026-08-26); Campus China / Study in China (CSC); PKU ISD; Цинхуа; Гадаадынхны орох, гарах хууль; Бээжингийн албан ёсны мэдэгдэл',
    sourceUrl: 'https://www.visaforchina.cn/TAS4_EN/qianzhengyewu/jichuzhishi/banliliucheng/552382625898172433.html',
    sourceType: 'government',
    fetchedAt: NOW,
    lastUpdatedAt: NOW,
    academicYear: '2025–2026',
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
      console.log('Хятад шинэчлэгдлээ');
    } else console.log('Dry-run. Бичихийн тулд --apply.');
  }
  await mongoose.disconnect();
})();
