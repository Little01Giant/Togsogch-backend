// Испани: албан ёсны эх сурвалжаар шалгасан утгыг оруулж, баталгаажаагүй тайлангийн утгыг сольно (2026-11-05).
// Хэрэглэгч хуучин утгыг дарж/хасаж болно гэж зөвшөөрсөн. Анхдагч нь dry-run; бичихийн тулд `--apply`. Идемпотент.
import { config } from 'dotenv';
import mongoose from 'mongoose';
import { CountrySchema } from '../src/schemas';

config();
const NOW = new Date();
const SLUG = 'spain';

const SET = {
  tuitionRange:
    'Улсын их сургуулийн төлбөрийг автономит муж тогтооно, мужаар эрс ялгаатай. Каталони (2025–26): магистр ихэнхдээ 19.37 EUR/кредит, зарим магистр 32.28 EUR/кредит; жишээ UB магистр (60 кредит) оршин суугч/ЕХ-ны оюутанд 1,660.20 EUR/жил, оршин суугч бус ЕХ-ны бус оюутанд 4,920 EUR/жил. Мадрид: оршин суух эрхгүй, хоёр талт гэрээгүй орны оюутан 4 дэх бүртгэлийн (хамгийн өндөр) тарифаар төлнө, жишээ UCM магистр 45.02 EUR/ECTS (эхний бүртгэл). Андалуси (Севилья): оюутны иргэншлээр ялгахгүй, мужийн тогтоолоор нэг тариф. Хувийн сургуулийн төлбөр албан ёсны эх сурвалжаар баталгаажаагүй.',
  admissionGeneral:
    'Санхүүгийн баталгаа (Испанийн Гадаад хэргийн яам, консулын хуудас, 2026): сард IPREM-ийн 100% = 600 EUR; дагалдах гэр бүлийн эхний гишүүнд +75%, нэмэлт гишүүн бүрд +50%. Банкны хуулга: зарим консул сүүлийн 3 сарын 3 хуулга шаарддаг (Gemini «6 сар» гэсэн нь консулаар ялгаатай); сургууль өрөө, хоолны хариуцлага хүлээсэн захидалтай бол нэмэлт баталгаа шаардахгүй. Монголын өргөдлийг хүлээн авах консулын (Бээжин/BLS) дүрмийг албан ёсны хуудсаар шалгана. ' +
    'Цагийн ажил (Хамруулалт, нийгмийн даатгал, цагаачлалын яам): дээд боловсролын оюутан сурлагатайгаа нийцсэн ажлыг долоо хоногт ≤30 цаг хийж болно; хэтэрвэл оршин суух зөвшөөрөл дуусна. ' +
    'Төгсөлтийн дараах ажил хайх зөвшөөрөл: 2022 оны Гадаадынхны журмын шинэчлэлийн мэдээлэлд 3 сараас 1 жил болсон гэсэн боловч оюутанд зориулсан албан ёсны хуудсаар баталгаажаагүй (BOE хуудсаар шалгана); оюутны зөвшөөрлөөс ажлын зөвшөөрөл рүү шилжихийг хугацаа дуусахаас 2 сарын өмнөөс 3 сарын дараа хүртэл мэдүүлнэ, тэтгэлэг, татаас авахгүй байх шаардлагатай. ' +
    'Дунд боловсролын дүйцүүлэлт: ЕХ-ны бус оюутан дунд боловсролын гэрчилгээгээ Испанийн Bachillerato-той дүйцүүлэх «homologación»-ыг Боловсролын яамаар хийлгэнэ; UNEDasiss дүйцүүлдэггүй, зөвхөн элсэлтийн «accreditation» олгоно (2 жил хүчинтэй); элсэхэд ≥4 PCE шалгалт өгөхийг зөвлөдөг (6 хүртэл). Монгол гэрчилгээний баримтын жагсаалтыг UNEDasiss-ийн «улс бүрээр» хэсгээр шалгана. PCE-ийн оноо ба хэлний (DELE/SIELE) босго албан ёсны эх сурвалжаар баталгаажаагүй.',
  scholarshipInfo:
    'MAEC-AECID (Испанийн засгийн газар): олдсон дуудлагуудын жагсаалтад Монгол байхгүй — 2025/26 магистр: Латин Америк ба Филиппин; 2026/27 Africa-Med магистр: Африк, Ойрхи Дорнодын иргэд; Латин Америк, Африк, Азийн дуудлага 2026-05-21–06-03 (хаагдсан, зөвхөн улсын албан хаагчид). Монгол оюутан хамрагдах эсэх баталгаажаагүй (aecid.es-д лавлана).\n\n' +
    'Universidad de Jaén — Talent Attraction (магистр, 2026/27): А төрөл — сургалтын төлбөрийн 100% + жилд 3,190 EUR + захиргааны хураамж, даатгал, испани хэлний үнэгүй курс (20 байр); Б төрөл — төлбөрийн хөнгөлөлт, тэтгэмжгүй (10 байр). 2026/27-ын мэдүүлэг 2026-02-15-нд хаагдсан; дараагийн дуудлага хараахан гараагүй.',
  visaLinks: [
    { title: 'Испанийн Гадаад хэргийн яам: оюутны виз (консул)', url: 'https://www.exteriores.gob.es/Consulados/washington/en/ServiciosConsulares/Paginas/Consular/Visado-de-estudios.aspx' },
    { title: 'Испани: оюутны ажил эрхлэх эрх (хуудас 4 bis)', url: 'https://www.inclusion.gob.es/en/web/migraciones/w/hoja-4-bis-acceso-al-empleo-de-las-personas-titulares-de-una-autorizacion-de-estancia-de-larga-duracion-por-estudios-movilidad-de-alumnos-servicios-de-voluntariado-o-actividades-formativas' },
    { title: 'UNEDasiss: гадаад оюутны элсэлт (FAQ)', url: 'https://unedasiss.uned.es/faqs&idioma=en' },
    { title: 'AECID: тэтгэлэг', url: 'https://www.aecid.es/en/scholarships-and-lectureships' },
    { title: 'Universidad de Jaén: Talent Attraction (магистр 2026/27)', url: 'https://www.ujaen.es/internacional/en/international-calls/talent-attraction-scholarships-masters-degrees-202627' },
    { title: 'Каталони: сургалтын төлбөр', url: 'https://studyincatalonia.gencat.cat/en/plan-your-studies/fees' },
    { title: 'UCM: төлбөр (precios públicos)', url: 'https://www.ucm.es/informacion/tuition-fees-precios-publicos' },
  ],
  source: {
    sourceName: 'Испанийн Гадаад хэргийн яам (консул); Хамруулалт, нийгмийн даатгал, цагаачлалын яам; UNEDasiss; AECID; Universidad de Jaén; Studyincatalonia; UCM',
    sourceUrl: 'https://www.exteriores.gob.es/Consulados/washington/en/ServiciosConsulares/Paginas/Consular/Visado-de-estudios.aspx',
    sourceType: 'government',
    fetchedAt: NOW,
    lastUpdatedAt: NOW,
    academicYear: '2025–2027',
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
      console.log('Испани шинэчлэгдлээ');
    } else console.log('Dry-run. Бичихийн тулд --apply.');
  }
  await mongoose.disconnect();
})();
