// МУИС «Элсэлт 2026» (PDF) → бакалаврын хөтөлбөр бүрийн ЭЕШ-ийн шаардлагыг одоо байгаа мэргэжилтэй нэгтгэж Career.entranceExams-д бичнэ.
// Шинэ мэргэжил үүсгэхгүй (тохирлын загвар бүх нийтлэгдсэн мэргэжлийг оноодог тул профайлгүй мэргэжил буруу оноо авна).
// Анхдагч нь dry-run; бичихийн тулд `--apply`. Идемпотент: зөвхөн энэ эх сурвалжийн мөрийг сольж, бусдыг хөндөхгүй.
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { CareerSchema } from '../src/schemas';

config();

const UNIVERSITY = 'Монгол Улсын Их Сургууль';
const SOURCE_NAME = 'МУИС «Элсэлт 2026» (албан ёсны танилцуулга)';
const SOURCE_URL = 'https://elselt.num.edu.mn/';
const YEAR = 2026;
const FILES = ['num-2026-admission.txt', 'num-2026-admission-2.txt', 'num-2026-admission-3.txt'];

/** Хөтөлбөрийн суурь нэр (хаалт, «Багш,» угтваргүй) → холбох мэргэжлийн slug-ууд. */
const TEACHER_SECONDARY = ['secondary-school-teachers-except-special-and-career-technical-education', 'middle-school-teachers-except-special-and-career-technical-education'];
const MAP: Record<string, string[]> = {
  'Биологи': ['biologists'],
  'Биохими': ['biochemists-and-biophysicists'],
  'Биотехнологи': ['molecular-and-cellular-biologists'],
  'Экологи': ['environmental-scientists-and-specialists-including-health'],
  'Биологийн нөөц судлал': ['conservation-scientists'],
  'Хими': ['chemists'],
  'Хэрэглээний хими': ['chemists', 'chemical-technicians'],
  'Газар зүй': ['geographers'],
  'Геологи': ['geoscientists-except-hydrologists-and-geographers'],
  'Геофизик': ['geoscientists-except-hydrologists-and-geographers'],
  'Байгаль орчны зайнаас тандан судлал': ['remote-sensing-scientists-and-technologists'],
  'Цаг үүр судлал': ['atmospheric-and-space-scientists'],
  'Ус судлал': ['hydrologists'],
  'Физик': ['physicists'],
  'Математик': ['mathematicians'],
  'Физик электроник': ['electronics-engineers-except-computer'],
  'Газар зохион байгуулалт': ['surveyors'],
  'Хот ба бүс нутгийн төлөвлөлт': ['urban-and-regional-planners'],
  'Аялал жуулчлал': ['tour-guides-and-escorts', 'travel-agents'],
  'Микробиологи': ['microbiologists'],
  'Антропологи': ['anthropologists-and-archeologists'],
  'Археологи': ['anthropologists-and-archeologists'],
  'Хүн ам зүй': ['sociologists'],
  'Нийгмийн ажил': ['child-family-and-school-social-workers', 'healthcare-social-workers', 'mental-health-and-substance-abuse-social-workers'],
  'Социологи': ['sociologists'],
  'Сэтгүүл зүй': ['news-analysts-reporters-and-journalists'],
  'Сэтгэл судлал': ['clinical-and-counseling-psychologists', 'school-psychologists', 'industrial-organizational-psychologists'],
  'Эдийн засаг': ['economists'],
  'Олон нийтийн харилцаа, мэдээлэл': ['public-relations-specialists', 'public-relations-managers'],
  'Гадаад хэлний орчуулга': ['interpreters-and-translators'],
  'Олон улс, орон судлал': ['political-scientists'],
  'Утга зохиол судлал': ['writers-and-authors', 'editors'],
  'Урлаг судлал': ['curators'],
  'Хэл, уран зохиол': ['writers-and-authors', 'editors'],
  'Хэл шинжлэл': ['interpreters-and-translators'],
  'Түүх': ['historians'],
  'Шашин судлал': ['directors-religious-activities-and-education'],
  'Компьютерын ухаан': ['computer-and-information-research-scientists', 'software-developers', 'computer-programmers', 'web-developers'],
  'Мэдээллийн технологи': ['computer-systems-analysts', 'network-and-computer-systems-administrators'],
  'Программ хангамж': ['software-developers', 'computer-programmers', 'web-developers'],
  'Мультимедиа технологи': ['web-and-digital-interface-designers', 'special-effects-artists-and-animators'],
  'Мэдээллийн систем': ['computer-systems-analysts', 'database-administrators'],
  'Статистик': ['statisticians', 'actuaries'],
  'Хэрэглээний математик': ['operations-research-analysts', 'mathematicians'],
  'Электроникийн инженерчлэл': ['electronics-engineers-except-computer'],
  'Компьютерын сүлжээ': ['computer-network-architects', 'computer-network-support-specialists', 'network-and-computer-systems-administrators'],
  'Холбооны технологи': ['telecommunications-engineering-specialists'],
  'Компьютерын инженерчлэл': ['computer-hardware-engineers'],
  'Хиймэл оюун': ['computer-and-information-research-scientists', 'data-scientists'],
  'Сэргээгдэх эрчим хүч': ['energy-engineers-except-wind-and-solar', 'wind-turbine-service-technicians'],
  'Цөмийн инженерчлэл': ['nuclear-engineers'],
  'Био-инженерчлэл': ['bioengineers-and-biomedical-engineers'],
  'Материал судлал, инженерчлэл': ['materials-engineers', 'materials-scientists'],
  'Нано шинжлэх ухаан, инженерчлэл': ['nanosystems-engineers'],
  'Химийн инженерчлэл': ['chemical-engineers'],
  'Хүрээлэн буй орчны инженерчлэл': ['environmental-engineers'],
  'Химийн боловсруулалтын технологи': ['chemical-engineers'],
  'Хүрээлэн буй орчин судлал': ['environmental-scientists-and-specialists-including-health'],
  'Ойн аж ахуй': ['foresters'],
  'Ашигт малтмалын баяжуулалтын технологи': ['mining-and-geological-engineers-including-mining-safety-engineers'],
  'Газрын тосны инженерчлэл': ['petroleum-engineers'],
  'Барилгын инженерчлэл': ['civil-engineers'],
  'Цахилгааны инженерчлэл': ['electrical-engineers'],
  'Уул уурхайн ашиглалтын технологи': ['mining-and-geological-engineers-including-mining-safety-engineers'],
  'Нягтлан бодох бүртгэл': ['accountants-and-auditors'],
  'Санхүү, банк': ['loan-officers', 'credit-analysts', 'personal-financial-advisors'],
  'Даатгал': ['insurance-underwriters', 'insurance-sales-agents', 'claims-adjusters-examiners-and-investigators', 'actuaries'],
  'Маркетинг': ['marketing-managers', 'market-research-analysts-and-marketing-specialists'],
  'Менежмент': ['general-and-operations-managers', 'management-analysts'],
  'Худалдаа': ['wholesale-and-retail-buyers-except-farm-products', 'sales-managers'],
  'Зочлох үйлчилгээ': ['lodging-managers'],
  'Бизнесийн удирдлага': ['general-and-operations-managers', 'chief-executives'],
  'Эрх зүй': ['lawyers', 'paralegals-and-legal-assistants'],
  'Олон улсын харилцаа': ['political-scientists'],
  'Нийтийн удирдлага': ['social-and-community-service-managers', 'administrative-services-managers'],
  'Улс төр судлал': ['political-scientists'],
  'Нийгмийн эрүүл мэнд': ['health-education-specialists', 'community-health-workers'],
};

/** «Багш, …» хөтөлбөрүүд: ерөнхий боловсролын багшийн мэргэжилтэй холбоно. */
function teacherCareers(name: string): string[] {
  if (name.startsWith('Багш, сургуулийн өмнөх')) return ['preschool-teachers-except-special-education', 'kindergarten-teachers-except-special-education'];
  if (name.startsWith('Багш, бага боловсрол')) return ['elementary-school-teachers-except-special-education'];
  if (name.startsWith('Багш, гадаад хэлний боловсрол (Англи)')) return [...TEACHER_SECONDARY, 'adult-basic-education-adult-secondary-education-and-english-as-a-second-language-instructors'];
  if (name.startsWith('Багш, дизайн') || name.startsWith('Багш, дүрслэх')) return [...TEACHER_SECONDARY, 'career-technical-education-teachers-secondary-school'];
  return TEACHER_SECONDARY;
}

const baseName = (n: string) => n.replace(/\s*\d\+\d\s*хамтарсан\s*$/, '').replace(/\s*\([^)]*\)\s*$/, '').trim();
const careersFor = (program: string): string[] | undefined => (program.startsWith('Багш,') ? teacherCareers(program) : MAP[baseName(program)]);

type Row = { school: string; program: string; flags: string; baseExams: string[]; extraExams: string[]; cutoffScore: number };
function load(): Row[] {
  const rows: Row[] = [];
  for (const f of FILES) {
    for (const line of fs.readFileSync(path.join(__dirname, 'data', f), 'utf8').split(/\r?\n/)) {
      if (!line.trim() || line.startsWith('#')) continue;
      const p = line.split('|');
      if (p.length < 5) throw new Error(`Буруу мөр (${f}): ${line}`);
      rows.push({ school: p[0].replace(/^Бүрэлдэхүүн:\s*/, ''), program: p[1], flags: p[2], baseExams: p[3].split(','), extraExams: p[4].split(','), cutoffScore: p[5] ? Number(p[5]) : 490 });
    }
  }
  return rows;
}

(async () => {
  const apply = process.argv.includes('--apply');
  const rows = load();
  const unmapped = Array.from(new Set(rows.filter((r) => !careersFor(r.program)).map((r) => r.program)));
  const bySlug = new Map<string, Row[]>();
  for (const r of rows) for (const s of careersFor(r.program) ?? []) bySlug.set(s, [...(bySlug.get(s) ?? []), r]);
  console.log(`Хөтөлбөрийн мөр: ${rows.length}, өвөрмөц нэр: ${new Set(rows.map((r) => r.program)).size}, холбогдсон мэргэжил: ${bySlug.size}`);
  console.log('Холбогдоогүй хөтөлбөр:', unmapped.length ? unmapped.join('; ') : 'байхгүй');

  await mongoose.connect(process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/togsogch');
  console.log(`DB: ${mongoose.connection.host}/${mongoose.connection.name}`);
  const Career = mongoose.model('Career', CareerSchema);
  const found = await Career.find({ slug: { $in: Array.from(bySlug.keys()) } }).select('slug').lean();
  const have = new Set(found.map((c) => c.slug));
  const missing = Array.from(bySlug.keys()).filter((s) => !have.has(s));
  console.log('DB-д олдоогүй slug:', missing.length ? missing.join(', ') : 'байхгүй');
  if (missing.length) { console.log('Зогсов: mapping-ийг засна уу.'); await mongoose.disconnect(); process.exit(1); }

  if (!apply) { console.log('Dry-run. Бичихийн тулд --apply.'); await mongoose.disconnect(); return; }
  for (const [slug, rs] of bySlug) {
    const entries = rs.map((r) => ({ university: UNIVERSITY, school: r.school, program: r.program, flags: r.flags || undefined, baseExams: r.baseExams, extraExams: r.extraExams, cutoffScore: r.cutoffScore, year: YEAR, sourceName: SOURCE_NAME, sourceUrl: SOURCE_URL }));
    const cur: any = await Career.findOne({ slug }).select('entranceExams').lean();
    const keep = (cur?.entranceExams ?? []).filter((e: any) => e.university !== UNIVERSITY || e.year !== YEAR);
    await Career.updateOne({ slug }, { $set: { entranceExams: [...keep, ...entries] } });
  }
  console.log(`Бичигдлээ: ${bySlug.size} мэргэжил`);
  await mongoose.disconnect();
})();
