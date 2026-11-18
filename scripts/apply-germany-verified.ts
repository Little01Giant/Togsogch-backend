// Герман: албан ёсны эх сурвалжаар шалгасан утгыг оруулж, баталгаажаагүй тайлангийн утгыг сольно (2026-11-04).
// Хэрэглэгч хуучин утгыг дарж/хасаж болно гэж зөвшөөрсөн. Анхдагч нь dry-run; бичихийн тулд `--apply`. Идемпотент.
import { config } from 'dotenv';
import mongoose from 'mongoose';
import { CountrySchema } from '../src/schemas';

config();
const NOW = new Date();
const SLUG = 'germany';

const SET = {
  tuitionRange:
    'Улсын их сургууль: ихэнх мужид сургалтын төлбөргүй. Баден-Вюртемберг: ЕХ-ны бус оюутанд 1,500 EUR/семестр (докторантад үйлчлэхгүй, зарим чөлөөлөлттэй) — Мужийн Шинжлэх ухааны яам (MWK), DAAD. Семестрийн хураамж (оюутны холбоо, захиргаа) нэг сургуульд ~180 EUR/семестр (Штутгарт); улсын хүрээ (100–350 EUR) албан ёсны эх сурвалжаар баталгаажаагүй.',
  admissionGeneral:
    'Санхүүгийн баталгаа (Study in Germany): ихэнх тохиолдолд жилд 11,904 EUR (992 EUR/сар); Германы банк эсвэл онлайн хаалттай дансаар (Sperrkonto), зөвхөн эх баримт, бичиг баримт ~1 долоо хоног. Нэг гэрлэл хуудас 10,332 EUR гэж хуучин дүн бичсэн тул зөрүүтэй — виз мэдүүлэхээсээ өмнө албан ёсны хуудсаар шалгана. ' +
    'uni-assist хураамж (албан ёсны): эхний хөтөлбөр 75 EUR, нэмэлт хөтөлбөр бүр 30 EUR (VPD-ийн хувьд ижил). ' +
    'Цагийн ажил: гадаадын оюутан жилд 140 бүтэн өдөр эсвэл 280 хагас өдөр (DAAD); оюутны туслах ажил хязгааргүй. ' +
    'Төгсөлтийн дараа: оршин суух зөвшөөрлийг 18 сараар нэмж ажил хайна, амьжиргаагаа даах чадвараа нотолно, мэргэжилтэй ажлыг хязгааргүй хийнэ (DAAD). ' +
    'Боловсролын дүйцүүлэлт: anabin (хуучин, ~2018 оны мэдээнд) Монголын бүрэн дунд боловсролоор ихэвчлэн Studienkolleg (Feststellungsprüfung) шаардлагатай, элсэлтийн шалгалт заавал, ахисан герман хэлний баталгаа (DSD I/II) шаардана; баримт бүрийг anabin-д шалгана. ' +
    'APS гэрчилгээ Монголын оюутанд шаардлагатай эсэх баталгаажаагүй: Кёльний их сургуулийн 2016 оны заавар шаарддаг гэсэн, Gemini «2019-өөс шаарддаггүй» гэсэн; албан ёсны ЭСЯ/сургуулийн хуудсанд лавлана.',
  scholarshipInfo:
    'DAAD EPOS (хөгжлийн чиглэлийн магистр): сарын тэтгэмж магистрт 992 EUR, докторантад 1,300 EUR (2026-02-оос 1,400 EUR; докторыг зөвхөн онцгой тохиолдолд санхүүжүүлнэ). Шаардлага: өргөдлийн үед ≥2 жилийн мэргэжлийн туршлага, холбоотой чиглэлийн бакалавр (ангийнхаа дээд гуравны нэгд, төгссөнөөс ≤6 жил), OECD-DAC жагсаалтын улсын иргэн. «Бүх чиглэлийн магистр» DAAD тэтгэлгийн хугацаа, GMIT-ийн DAAD тэтгэлгийн нөхцөл албан ёсны эх сурвалжаар баталгаажаагүй.',
  visaLinks: [
    { title: 'Study in Germany: санхүүгийн баталгаа', url: 'https://www.study-in-germany.com/en/plan-your-studies/requirements/proof-of-financing/' },
    { title: 'uni-assist: хураамж, илгээх', url: 'https://www.uni-assist.de/en/how-to-apply/apply-online/pay-submit/' },
    { title: 'DAAD: оюутны цагийн ажил', url: 'https://www.daad.de/en/studying-in-germany/work-career/side-jobs/' },
    { title: 'DAAD: EPOS тэтгэлэг', url: 'https://www2.daad.de/deutschland/stipendium/datenbank/en/21148-scholarship-database/?detail=50076777' },
    { title: 'Баден-Вюртемберг: олон улсын оюутны төлбөр', url: 'https://mwk.baden-wuerttemberg.de/de/hochschulen-studium/studieren-in-bw/studienfinanzierung/gebuehren-fuer-internationale-studierende-und-zweitstudium/tuition-fees-for-international-students' },
    { title: 'anabin: Монгол', url: 'https://anabin.kmk.org/filter/news/newsdetails/artikel//mongolei.html' },
    { title: 'VFS Global Монгол: Герман (виз, нээж шалгаагүй)', url: 'https://visa.vfsglobal.com/mng/en/deu' },
  ],
  source: {
    sourceName: 'Study in Germany; uni-assist; DAAD (цагийн ажил, EPOS); Баден-Вюртембергийн MWK; anabin (KMK)',
    sourceUrl: 'https://www.study-in-germany.com/en/plan-your-studies/requirements/proof-of-financing/',
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
      console.log('Герман шинэчлэгдлээ');
    } else console.log('Dry-run. Бичихийн тулд --apply.');
  }
  await mongoose.disconnect();
})();
