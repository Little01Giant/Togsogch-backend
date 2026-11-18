// ШУТИС (2026-2027 элсэлтийн журам, А/123 тушаал) → бакалаврын хөтөлбөр бүрийн ЭЕШ-ийн хичээлийг одоо байгаа мэргэжилтэй нэгтгэж Career.entranceExams-д бичнэ.
// Оноо оруулахгүй (зөвхөн хичээл). МУИС-тай нэр давхцсан хөтөлбөрийг ОРХИНО (МУИС-ийн мэдээллээр явна).
// Анхдагч нь dry-run; бичихийн тулд `--apply`. Идемпотент: зөвхөн ШУТИС-ийн мөрийг сольно.
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { CareerSchema } from '../src/schemas';

config();

const UNIVERSITY = 'Шинжлэх Ухаан, Технологийн Их Сургууль (ШУТИС)';
const SOURCE_NAME = 'ШУТИС бакалаврын хөтөлбөрт оюутан элсүүлэх журам 2026–2027 (Ректорын 2026-04-10-ны А/123 тушаал)';
const SOURCE_URL = 'https://www.must.edu.mn/';
const YEAR = 2026;
const DATA = path.join(__dirname, 'data');

const baseName = (n: string) => n.replace(/\s*\d\+\d\s*хамтарсан\s*$/, '').replace(/\s*\([^)]*\)\s*$/, '').trim();
/** ШУТИС-ийн нэр МУИС-ийн нэртэй өөр бичигдсэн ч адил хөтөлбөр. */
const ALIAS: Record<string, string> = { 'Олон нийтийн харилцаа': 'Олон нийтийн харилцаа, мэдээлэл' };

const MAP: Record<string, string[]> = {
  'Архитектур': ['architects-except-landscape-and-naval'],
  'Барилгын материалын үйлдвэрлэлийн технологи': ['materials-engineers', 'civil-engineers'],
  'Гүүрийн инженерчлэл': ['civil-engineers'],
  'Усны барилга, байгууламж': ['civil-engineers'],
  'Авто замын инженерчлэл': ['civil-engineers', 'transportation-engineers'],
  'Усан хангамж, ариутгах татуургын инженерчлэл': ['environmental-engineers', 'civil-engineers'],
  'Сантехникийн инженерчлэл': ['mechanical-engineers'],
  'Халаалт, агаар сэлгэлт, кондиционер': ['mechanical-engineers', 'heating-air-conditioning-and-refrigeration-mechanics-and-installers'],
  'Усны нөөц, усжуулалт': ['agricultural-engineers', 'hydrologists'],
  'Хаягдал боловсруулах технологи': ['environmental-engineers'],
  'Өрөмдлөгийн инженерчлэл': ['petroleum-engineers', 'mining-and-geological-engineers-including-mining-safety-engineers'],
  'Газрын тос боловсруулах үйлдвэрийн инженерчлэл': ['petroleum-engineers', 'chemical-engineers'],
  'Хийн инженерчлэл': ['petroleum-engineers'],
  'Геодези': ['surveyors', 'geodetic-surveyors', 'cartographers-and-photogrammetrists'],
  'Гидрогеологи': ['hydrologists', 'geoscientists-except-hydrologists-and-geographers'],
  'Ашигт малтмал эрэл, хайгуул': ['geoscientists-except-hydrologists-and-geographers', 'mining-and-geological-engineers-including-mining-safety-engineers'],
  'Инженер геологи, геотехник': ['geoscientists-except-hydrologists-and-geographers', 'civil-engineers'],
  'Уул уурхайн геотехник': ['mining-and-geological-engineers-including-mining-safety-engineers'],
  'Уул уурхайн маркшейдер': ['surveyors', 'mining-and-geological-engineers-including-mining-safety-engineers'],
  'Уурхайн машин тоног төхөөрөмж': ['mining-and-geological-engineers-including-mining-safety-engineers', 'mechanical-engineers'],
  'Уурхайн цахилгаан тоног төхөөрөмж': ['mining-and-geological-engineers-including-mining-safety-engineers', 'electrical-engineers'],
  'Хөдөлмөрийн аюулгүй байдал, эрүүл ахуй': ['occupational-health-and-safety-specialists', 'health-and-safety-engineers-except-mining-safety-engineers-and-inspectors'],
  'Эрдэс баялаг, инженерчлэл эдийн засаг': ['mining-and-geological-engineers-including-mining-safety-engineers', 'cost-estimators'],
  'Нийлүүлэлтийн сүлжээ, логистик': ['supply-chain-managers', 'logisticians'],
  'Үйлдвэрлэлийн автоматжуулалт': ['industrial-engineers', 'mechatronics-engineers'],
  'Механик инженерчлэл': ['mechanical-engineers'],
  'Металлурги, металлын технологи': ['materials-engineers'],
  'Мехатроник': ['mechatronics-engineers'],
  'Барилгын материал үйлдвэрлэлийн механик инженерчлэл': ['mechanical-engineers'],
  'Механик инженерийн технологи': ['mechanical-engineers', 'manufacturing-engineers'],
  'Гагнуурын технологи': ['manufacturing-engineers'],
  'Авто инженерчлэл': ['automotive-engineers'],
  'Машины электрон систем': ['automotive-engineers', 'electronics-engineers-except-computer'],
  'Авто хөдөлгүүрийн механик инженерчлэл': ['automotive-engineers', 'mechanical-engineers'],
  'Нисэх техникийн механик': ['aircraft-mechanics-and-service-technicians', 'aerospace-engineers'],
  'Авионик': ['avionics-technicians'],
  'Зөтгүүр, зөтгүүрийн аж ахуй': ['mechanical-engineers'],
  'Барилга замын машины механик инженерчлэл': ['mechanical-engineers', 'mobile-heavy-equipment-mechanics-except-engines'],
  'Соёлын биет өвийн хадгалалт, хамгаалалтын технологи': ['museum-technicians-and-conservators', 'archivists'],
  'Төмөр замын тээвэр, удирдлага, зохион байгуулалт': ['transportation-storage-and-distribution-managers', 'transportation-engineers'],
  'Тээврийн үйлчилгээ': ['transportation-storage-and-distribution-managers'],
  'Хүний нөөцийн менежмент': ['human-resources-managers', 'human-resources-specialists'],
  'Үйлдвэрлэлийн менежмент': ['industrial-production-managers'],
  'Бизнес шинжлэх, загварчлал': ['management-analysts', 'business-intelligence-analysts'],
  'Олон улсын бизнес': ['general-and-operations-managers'],
  'Кибер аюулгүй байдал': ['information-security-analysts', 'information-security-engineers'],
  'Өгөгдлийн ухаан': ['data-scientists'],
  'IoT /Юмсын интернэт/ технологи': ['computer-systems-engineers-architects'],
  'Программ хангамжийн инженерчлэл': ['software-developers', 'web-developers'],
  'Мэдээлэл холбооны сүлжээний инженерчлэл': ['computer-network-architects', 'telecommunications-engineering-specialists'],
  'Утасгүй холбооны инженерчлэл': ['telecommunications-engineering-specialists'],
  'Робот ба хиймэл оюун ухаан': ['robotics-engineers'],
  'Хоол зүй, шим судлал': ['dietitians-and-nutritionists', 'food-scientists-and-technologists'],
  'Хүнсний чанар, аюулгүй байдал': ['food-scientists-and-technologists', 'food-science-technicians'],
  'График дизайн': ['graphic-designers'],
  'Анимейшн, мультимедиа дизайн': ['special-effects-artists-and-animators'],
  'Хувцасны дизайн': ['fashion-designers'],
  'Үйлдвэрлэлийн дизайн': ['commercial-and-industrial-designers'],
  'Интерьер дизайн': ['interior-designers'],
  'Хувцас үйлдвэрлэлийн технологи, загвар зохион бүтээлт': ['fashion-designers', 'fabric-and-apparel-patternmakers'],
  'Арьс боловсруулалт, үйлдвэрлэлийн технологи': ['materials-engineers'],
  'Текстилийн инженерчлэл': ['materials-engineers'],
  'Ойн инженерчлэл': ['foresters'],
  'Хүнсний үйлдвэрлэлийн машин тоног төхөөрөмж': ['industrial-machinery-mechanics', 'mechanical-engineers'],
  'Хөнгөн үйлдвэрлэлийн машин тоног төхөөрөмж': ['industrial-machinery-mechanics', 'mechanical-engineers'],
  'Хүнс үйлдвэрлэлийн технологи': ['food-scientists-and-technologists'],
  'Хоол үйлдвэрлэл, үйлчилгээний технологи': ['chefs-and-head-cooks', 'food-scientists-and-technologists'],
  'Хэвлэл, медиа үйлдвэрлэлийн технологи': ['prepress-technicians-and-workers', 'desktop-publishers'],
  'Мод боловсруулах үйлдвэрлэлийн технологи': ['manufacturing-engineers'],
  'Хэрэглээний Физик': ['physicists'],
  'Нүүрсний боловсруулалтын технологи': ['chemical-engineers'],
  'Газрын тосны боловсруулалтын технологи': ['petroleum-engineers', 'chemical-engineers'],
  'Дулааны цахилгаан станцын инженерчлэл': ['energy-engineers-except-wind-and-solar', 'electrical-engineers'],
  'Дулааны процессын автоматжуулалт': ['energy-engineers-except-wind-and-solar'],
  'Дулаан хангамжийн инженерчлэл': ['energy-engineers-except-wind-and-solar'],
  'Хөргөлтийн технологи ба кондиционерийн систем': ['heating-air-conditioning-and-refrigeration-mechanics-and-installers', 'mechanical-engineers'],
  'Цахилгаан системийн автоматжуулалт': ['electrical-engineers', 'power-distributors-and-dispatchers'],
  'Эмнэлгийн тоног төхөөрөмжийн ашиглалт': ['medical-equipment-repairers', 'bioengineers-and-biomedical-engineers'],
  'Цахилгаан хангамж': ['electrical-engineers', 'power-distributors-and-dispatchers'],
  'Цахилгаан электроник': ['electronics-engineers-except-computer'],
  'Эрчим хүчний ухаалаг сүлжээ ба систем': ['electrical-engineers'],
  'Инженерлэл, эдийн засаг': ['industrial-engineers', 'cost-estimators'],
  'Метроны удирдлага, хяналтын инженерчлэл': ['electrical-engineers', 'mechatronics-engineers'],
  'Метроны механик ба хөдлөх бүрэлдэхүүний инженерчлэл': ['mechanical-engineers'],
  'Метроны барилгын инженерчлэл': ['civil-engineers'],
  'Метроны дохиолол ба цахилгааны инженерчлэл': ['electrical-engineers', 'signal-and-track-switch-repairers'],
  'Нисгэгчгүй нисэх системийн инженерчлэл': ['aerospace-engineers', 'robotics-engineers'],
};

type Row = { school: string; program: string; flags: string; baseExams: string[]; extraExams: string[] };
const lines = (f: string) => fs.readFileSync(path.join(DATA, f), 'utf8').split(/\r?\n/).filter((l) => l.trim() && !l.startsWith('#'));

(async () => {
  const apply = process.argv.includes('--apply');
  const num = new Set<string>();
  for (const f of ['num-2026-admission.txt', 'num-2026-admission-2.txt', 'num-2026-admission-3.txt']) for (const l of lines(f)) num.add(baseName(l.split('|')[1]));
  const rows: Row[] = lines('shutis-2026-admission.txt').map((l) => {
    const p = l.split('|');
    if (p.length !== 5) throw new Error(`Буруу мөр: ${l}`);
    return { school: p[0], program: p[1], flags: p[2], baseExams: p[3].split(','), extraExams: p[4].split(',') };
  });
  const isNum = (r: Row) => num.has(baseName(r.program)) || num.has(ALIAS[baseName(r.program)] ?? '\0');
  const skipped = rows.filter(isNum);
  const use = rows.filter((r) => !isNum(r));
  const unmapped = Array.from(new Set(use.filter((r) => !MAP[baseName(r.program)]).map((r) => r.program)));
  const bySlug = new Map<string, Row[]>();
  for (const r of use) for (const s of MAP[baseName(r.program)] ?? []) bySlug.set(s, [...(bySlug.get(s) ?? []), r]);
  console.log(`ШУТИС мөр: ${rows.length}; МУИС-тай давхцсан (орхив): ${skipped.length}; оруулах: ${use.length}; холбогдсон мэргэжил: ${bySlug.size}`);
  console.log('Орхисон:', Array.from(new Set(skipped.map((r) => r.program))).join('; '));
  console.log('Холбогдоогүй хөтөлбөр:', unmapped.length ? unmapped.join('; ') : 'байхгүй');

  await mongoose.connect(process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/togsogch');
  console.log(`DB: ${mongoose.connection.host}/${mongoose.connection.name}`);
  const Career = mongoose.model('Career', CareerSchema);
  const found = await Career.find({ slug: { $in: Array.from(bySlug.keys()) } }).select('slug').lean();
  const have = new Set(found.map((c) => c.slug));
  const missing = Array.from(bySlug.keys()).filter((s) => !have.has(s));
  console.log('DB-д олдоогүй slug:', missing.length ? missing.join(', ') : 'байхгүй');
  if (missing.length || unmapped.length) { console.log('Зогсов: mapping-ийг засна уу.'); await mongoose.disconnect(); process.exit(1); }
  if (!apply) { console.log('Dry-run. Бичихийн тулд --apply.'); await mongoose.disconnect(); return; }
  for (const [slug, rs] of bySlug) {
    const entries = rs.map((r) => ({ university: UNIVERSITY, school: r.school, program: r.program, flags: r.flags || undefined, level: 'bachelor', baseExams: r.baseExams, extraExams: r.extraExams, year: YEAR, sourceName: SOURCE_NAME, sourceUrl: SOURCE_URL }));
    const cur: any = await Career.findOne({ slug }).select('entranceExams').lean();
    const keep = (cur?.entranceExams ?? []).filter((e: any) => e.university !== UNIVERSITY);
    await Career.updateOne({ slug }, { $set: { entranceExams: [...keep, ...entries] } });
  }
  console.log(`Бичигдлээ: ${bySlug.size} мэргэжил`);
  await mongoose.disconnect();
})();
