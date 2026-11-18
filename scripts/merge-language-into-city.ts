// «Хэлний бэлтгэл» (language) тестийг «Суралцах хот» (city) тесттэй нэгтгэсэн шилжилт (идемпотент).
//  1) `city` тестэд хэлний асуулт (lg_language, lg_duration) нэмж шинэ хувилбар нийтэлнэ (хуучин хувилбар, үр дүн хэвээр);
//  2) `language` тестийг нийтлэгдээгүй (draft) болгож, жагсаалтаас хасна. Хуучин үр дүн профайл дээр хэвээр харагдана.
// Анхдагч нь dry-run; бичихийн тулд `--apply`.
import 'reflect-metadata';
import { config } from 'dotenv';
import mongoose from 'mongoose';
import { AssessmentQuestionSchema, AssessmentSchema, AssessmentVersionSchema } from '../src/schemas';
import { buildCityAssessment } from '../src/seed/phase2';
import { DEFAULT_CITY_CONFIG } from '../src/modules/scoring/city.strategy';

config();
(async () => {
  const apply = process.argv.includes('--apply');
  await mongoose.connect(process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/togsogch');
  console.log(`DB: ${mongoose.connection.host}/${mongoose.connection.name}`);
  const Assessment = mongoose.model('Assessment', AssessmentSchema);
  const Question = mongoose.model('AssessmentQuestion', AssessmentQuestionSchema);
  const Version = mongoose.model('AssessmentVersion', AssessmentVersionSchema);

  const city: any = await Assessment.findOne({ key: 'city' }).lean();
  const lang: any = await Assessment.findOne({ key: 'language' }).lean();
  if (!city) { console.log('city тест олдсонгүй (seed ажиллуулна уу)'); await mongoose.disconnect(); return; }
  const active: any = city.activeVersionId ? await Version.findById(city.activeVersionId).lean() : null;
  const already = !!active?.snapshot?.questions?.some((q: any) => q.key === 'lg_language');
  console.log(`city: идэвхтэй хувилбар v${active?.version ?? '-'}, хэлний асуулттай: ${already}; language тест: ${lang ? lang.status : 'байхгүй'}`);
  if (!apply) { console.log('Dry-run. Бичихийн тулд --apply.'); await mongoose.disconnect(); return; }

  if (!already) {
    const build = buildCityAssessment();
    const last: any = await Version.findOne({ assessmentId: city._id }).sort({ version: -1 }).lean();
    await Assessment.updateOne({ _id: city._id }, { $set: { title: 'Хэлний бэлтгэл ба бакалавр', subtitle: 'Эхлээд хэлээ сурч, дараа нь бакалаврт орох хот, улс, санхүүгийн замыг тодорхойлох тест', description: 'Сурах хэл, зан чанар, орчны сонголтоор тохирох топ 3 хотыг олж, санхүү болон голч дүнтэй тулгаж бодит замналыг гаргана. Мэргэжил тодорхойлох, магистрын тестийг өгвөл холбоотой сургуулиуд гарна.', sections: build.sections, scoringConfig: DEFAULT_CITY_CONFIG } });
    await Question.deleteMany({ assessmentId: city._id });
    await Question.insertMany(build.questions.map((q: any) => ({ ...q, assessmentId: city._id })));
    const v = await Version.create({ assessmentId: city._id, version: (last?.version ?? 1) + 1, scoringConfig: DEFAULT_CITY_CONFIG, publishedAt: new Date(), publishedBy: 'merge-language', snapshot: { strategy: 'city', sections: build.sections, questions: build.questions } });
    await Assessment.updateOne({ _id: city._id }, { $set: { activeVersionId: v._id, status: 'published' } });
    console.log(`city: шинэ хувилбар v${v.version} нийтлэгдлээ (${build.questions.length} асуулт)`);
  } else console.log('city: аль хэдийн нэгтгэгдсэн');
  if (lang && lang.status !== 'draft') { await Assessment.updateOne({ _id: lang._id }, { $set: { status: 'draft' } }); console.log('language тест жагсаалтаас хасагдлаа (draft)'); }
  await mongoose.disconnect();
})();
