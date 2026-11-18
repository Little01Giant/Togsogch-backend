/** npm run seed — идемпотент: дахин ажиллуулахад давхардахгүй. */
import 'reflect-metadata';
import { config } from 'dotenv';
import mongoose from 'mongoose';
import { PaymentProductSchema, PaymentSchema, SubscriptionSchema, MasterFieldSchema, CountrySchema, CareerSchema, CareerCategorySchema, SkillSchema, AssessmentSchema, AssessmentQuestionSchema, AssessmentVersionSchema } from '../schemas';
import { buildCareerAssessment, buildCareers, CAREER_BANK_REV, LEGACY_CAREER_SLUGS, CAREER_CATEGORIES, COUNTRIES, SKILLS } from './content';
import { DEFAULT_CAREER_CONFIG } from '../modules/scoring/career.strategy';
import { DEFAULT_MASTERS_CONFIG } from '../modules/scoring/masters.strategy';
import { DEFAULT_CITY_CONFIG } from '../modules/scoring/city.strategy';
import { buildCityAssessment, buildMastersAssessment, buildPersonaAssessment, buildThinkingAssessment, COUNTRY_PROFILES, MASTER_FIELDS } from './phase2';

config();

export async function seed(uri: string) {
  await mongoose.connect(uri);
  const Country = mongoose.model('Country', CountrySchema);
  const Career = mongoose.model('Career', CareerSchema);
  const Cat = mongoose.model('CareerCategory', CareerCategorySchema);
  const Skill = mongoose.model('Skill', SkillSchema);
  const Assessment = mongoose.model('Assessment', AssessmentSchema);
  const Question = mongoose.model('AssessmentQuestion', AssessmentQuestionSchema);
  const Version = mongoose.model('AssessmentVersion', AssessmentVersionSchema);
  const MasterField = mongoose.model('MasterField', MasterFieldSchema);

  for (const [slug, code, nameMn, nameEn, flag, region] of COUNTRIES) {
    await Country.updateOne({ slug }, { $setOnInsert: { slug, code, nameMn, nameEn, flag, region, status: 'published', source: { verificationStatus: 'unverified', reliabilityStatus: 'unknown' } } }, { upsert: true });
  }
  for (const [slug, nameMn, nameEn] of CAREER_CATEGORIES) await Cat.updateOne({ slug }, { $setOnInsert: { slug, nameMn, nameEn } }, { upsert: true });
  for (const [key, nameMn, nameEn] of SKILLS) await Skill.updateOne({ key }, { $setOnInsert: { key, nameMn, nameEn } }, { upsert: true });

  // Өмнөх редакцийн 33 мэргэжлийг O*NET-ээр сольсон тул устгана (хуучин үр дүн өөрийн snapshot-оор хадгалагдсан)
  await Career.deleteMany({ slug: { $in: LEGACY_CAREER_SLUGS } });
  const cats = new Map((await Cat.find().lean()).map((c: any) => [c.slug, c._id]));
  for (const { categorySlug, ...c } of buildCareers()) {
    await Career.updateOne({ slug: c.slug }, { $setOnInsert: { ...c, categoryId: cats.get(categorySlug) } }, { upsert: true });
  }

  const { sections, questions } = buildCareerAssessment();
  let career: any = await Assessment.findOne({ key: 'career' });
  if (!career) {
    career = await Assessment.create({
      key: 'career', strategy: 'career', title: 'Мэргэжил сонгох тест', subtitle: 'Сонирхол, чадвар, үнэт зүйлд тохирсон мэргэжлээ ол.',
      description: 'ЕБС-ийн 9–12 дугаар ангийн сурагч, мэргэжлээ сонгоогүй төгсөгчдөд зориулсан. Holland (RIASEC) загварыг үндэс болгосон.',
      sections, scoringConfig: DEFAULT_CAREER_CONFIG, status: 'draft',
    });
    await Question.insertMany(questions.map((q) => ({ ...q, assessmentId: career._id })));
    const v = await Version.create({
      assessmentId: career._id, version: 1, scoringConfig: DEFAULT_CAREER_CONFIG, publishedAt: new Date(), publishedBy: 'seed',
      snapshot: { strategy: 'career', rev: CAREER_BANK_REV, sections, questions },
    });
    career.activeVersionId = v._id; career.status = 'published'; career.draftVersion = 2;
    await career.save();
  } else {
    // Асуултын сан шинэчлэгдсэн бол шинэ хувилбар нийтэлнэ (хуучин хувилбар, түүнд холбогдсон үр дүн өөрчлөгдөхгүй)
    const active: any = await Version.findById(career.activeVersionId).lean();
    if (active?.snapshot?.rev !== CAREER_BANK_REV) {
      const last: any = await Version.findOne({ assessmentId: career._id }).sort({ version: -1 }).lean();
      const next = (last?.version ?? 1) + 1;
      await Question.deleteMany({ assessmentId: career._id });
      await Question.insertMany(questions.map((q) => ({ ...q, assessmentId: career._id })));
      const v = await Version.create({
        assessmentId: career._id, version: next, scoringConfig: DEFAULT_CAREER_CONFIG, publishedAt: new Date(), publishedBy: 'seed',
        snapshot: { strategy: 'career', rev: CAREER_BANK_REV, sections, questions },
      });
      career.activeVersionId = v._id; career.sections = sections; career.draftVersion = next + 1; career.status = 'published';
      await career.save();
    }
  }
  // Төлбөрийн бүтээгдэхүүн. Үнэ: тестийн үр дүн 9,900 ₮ (Админ тохируулна); нэг сургуулийг нээх 1,000 ₮, улсын бүх сургуулийг нээх 5,000 ₮ (Админ тохируулна).
  const Product = mongoose.model('PaymentProduct', PaymentProductSchema);
  const Pay = mongoose.model('Payment', PaymentSchema);
  const Sub = mongoose.model('Subscription', SubscriptionSchema);
  // Хуучин түлхүүрийг шилжүүлэх (premium_report → test_result)
  await Product.updateOne({ key: 'premium_report' }, { $set: { key: 'test_result' } });
  await Pay.updateMany({ productKey: 'premium_report' }, { $set: { productKey: 'test_result' } });
  await Sub.updateMany({ productKey: 'premium_report' }, { $set: { productKey: 'test_result' } });
  const products = [
    { key: 'test_result', title: 'Тестийн үр дүн нээх', description: 'Энэ тестийн үр дүнг нэг удаа төлж нээнэ. Нээсэн үр дүнг дахин төлбөргүй үзнэ.', priceMnt: 9900, scope: 'attempt' },
    { key: 'university_access', title: 'Сургуулийн мэдээлэл нээх', description: 'Энэ сургуулийн төлбөртэй мэдээллийг (төлбөр, шаардлага, хугацаа) үүрд нээнэ.', priceMnt: 1000, scope: 'university' },
    { key: 'country_access', title: 'Улсын бүх сургууль нээх', description: 'Энэ улсад байгаа бүх сургуулийн төлбөртэй мэдээллийг үүрд нээнэ.', priceMnt: 5000, scope: 'country' },
  ];
  for (const p of products) await Product.updateOne({ key: p.key }, { $setOnInsert: { ...p, active: true } }, { upsert: true });
  await Product.updateMany({ key: { $in: ['premium_roadmap', 'premium_comparison', 'credits_1', 'credits_5', 'credits_10'] } }, { $set: { active: false } }); // шинэ шаардлагад байхгүй; хуучин багцуудыг (credits_*) идэвхгүй болгоно

  // «Ирээдүйтэй 25 мэргэжил»: эрэмбэ нийтлэгдэх хүртэл харуулах РЕДАКЦИЙН сонголт (оноо/хувьгүй)
  const CANDIDATES = ['software-developers', 'data-scientists', 'information-security-analysts', 'robotics-engineers', 'computer-and-information-research-scientists', 'registered-nurses', 'family-medicine-physicians', 'biochemists-and-biophysicists', 'environmental-engineers', 'financial-quantitative-analysts', 'market-research-analysts-and-marketing-specialists', 'web-and-digital-interface-designers', 'mechanical-engineers', 'civil-engineers', 'electrical-engineers', 'logisticians', 'medical-and-clinical-laboratory-technologists', 'computer-network-architects', 'architects-except-landscape-and-naval', 'clinical-and-counseling-psychologists', 'nurse-practitioners', 'agricultural-engineers', 'pharmacists', 'project-management-specialists', 'mechatronics-engineers'];
  await Career.updateMany({ slug: { $in: CANDIDATES } }, { $set: { 'future.candidate': true } });

  // Phase 2
  for (const [slug, profile] of Object.entries(COUNTRY_PROFILES)) {
    await Country.updateOne({ slug, $or: [{ matchProfile: { $exists: false } }, { matchProfile: {} }] }, { $set: { matchProfile: profile } });
  }
  for (const f of MASTER_FIELDS) await MasterField.updateOne({ slug: f.slug }, { $setOnInsert: { ...f, status: 'published' } }, { upsert: true });
  const p2 = [
    { key: 'masters', title: 'Карьерын дараагийн алхам', subtitle: 'Магистр, мэргэжил дээшлүүлэх чиглэл тодорхойлох тест', description: 'Бакалаврын зэрэгтэй, ажиллаж буй болон магистрт суралцах хүсэлтэй хүмүүст зориулсан.', build: buildMastersAssessment(), cfg: DEFAULT_MASTERS_CONFIG },
    // «Хэлний бэлтгэл» ба «Суралцах хот»-ыг нэг тест болгон нэгтгэсэн (түлхүүр нь `city`). Хуучин `language` тестийг шинээр үүсгэхгүй.
    { key: 'city', title: 'Ямар улс надад тохирох вэ?', subtitle: 'Хэл, сонирхол, зорилгодоо тулгуурлан аль улсад суралцах нь чамд хамгийн тохиромжтойг мэд.', description: 'Сурах хэл, зан чанар, орчны сонголтоор тохирох топ 3 хотыг олж, санхүү болон голч дүнтэй тулгаж бодит замналыг гаргана. Мэргэжил тодорхойлох, магистрын тестийг өгвөл холбоотой сургуулиуд гарна.', build: buildCityAssessment(), cfg: DEFAULT_CITY_CONFIG },
    { key: 'persona', title: 'Хөгжилтэй зан төлөвийн тест', subtitle: 'Та яг ямар хүн бэ? 10 асуултаар зугаацаарай.', description: 'Зугаа цэнгээний тест. Мэргэжил, улс сонгоход нөлөөлөхгүй.', build: buildPersonaAssessment(), cfg: {} },
    { key: 'thinking', title: 'Сэтгэлгээний хэв маягийн тест', subtitle: 'Аналитик, бүтээлч, практик, логик — аль сэтгэлгээ чамд давамгай вэ?', description: '15 асуулт (албадмал сонголт ба нөхцөл байдал). Өөрийн үнэлгээнд суурилсан; мэргэжил, улс сонгоход нөлөөлөхгүй.', build: buildThinkingAssessment(), cfg: {} },
  ];
  // Хуучин тусдаа `language` тест `city`-д нэгтгэгдсэн: хуучин DB-д үлдсэн бол архивлана (жагсаалт, эхлүүлэхээс нуугдана; өмнөх үр дүн хэвээр).
  await Assessment.updateMany({ key: 'language', status: 'published' }, { $set: { status: 'draft' } });
  for (const d of p2) {
    let doc: any = await Assessment.findOne({ key: d.key });
    if (doc?.activeVersionId) continue;
    doc ??= await Assessment.create({ key: d.key, strategy: d.key, title: d.title, subtitle: d.subtitle, description: d.description, sections: d.build.sections, scoringConfig: d.cfg, status: 'draft' });
    await Assessment.updateOne({ _id: doc._id }, { $set: { title: d.title, subtitle: d.subtitle, description: d.description, sections: d.build.sections, scoringConfig: d.cfg } });
    await Question.deleteMany({ assessmentId: doc._id });
    await Question.insertMany(d.build.questions.map((q: any) => ({ ...q, assessmentId: doc._id })));
    const v = await Version.create({ assessmentId: doc._id, version: 1, scoringConfig: d.cfg, publishedAt: new Date(), publishedBy: 'seed', snapshot: { strategy: d.key, sections: d.build.sections, questions: d.build.questions } });
    await Assessment.updateOne({ _id: doc._id }, { $set: { activeVersionId: v._id, status: 'published', draftVersion: 2 } });
  }

  console.log(`Seed дууслаа: ${COUNTRIES.length} улс, ${buildCareers().length} мэргэжил, ${questions.length} асуулт.`);
  await mongoose.disconnect();
}

if (require.main === module) seed(process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/togsogch').catch((e) => { console.error(e); process.exit(1); });
