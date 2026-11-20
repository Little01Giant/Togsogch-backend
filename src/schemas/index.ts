import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, SchemaTypes } from 'mongoose';
import { SourceInfo } from '../common/sourced-field';
import { PAYMENT_MODELS } from './payments';
export * from './payments';

const T = { timestamps: true } as const;
const source = { type: SchemaFactory.createForClass(SourceInfo), default: undefined };

/* ───────────── users ───────────── */
@Schema(T)
export class User {
  @Prop({ unique: true, sparse: true }) googleId?: string;
  @Prop({ required: true, unique: true, lowercase: true, trim: true }) email: string;
  @Prop({ required: true, trim: true, maxlength: 120 }) name: string;
  @Prop() picture?: string;
  @Prop({ enum: ['user', 'admin', 'super_admin'], default: 'user', index: true }) role: string;
  @Prop({ default: 'active', enum: ['active', 'blocked'] }) status: string;
  @Prop({
    type: {
      age: { type: Number, min: 5, max: 100 },
      educationLevel: { type: String, enum: ['grade9', 'grade10', 'grade11', 'grade12', 'graduate', 'bachelor', 'master', 'working', 'other'] },
      school: { type: String, maxlength: 160 },
      interests: [String],
      languageLevel: { type: String, maxlength: 60 },
      budgetUsd: { type: Number, min: 0 },
      goal: { type: String, maxlength: 500 },
    },
    default: {},
  })
  profile: Record<string, any>;
  @Prop({ type: { privacyAcceptedAt: Date, termsAcceptedAt: Date, isMinor: Boolean, parentalConsentConfirmed: Boolean }, default: {} })
  consent: Record<string, any>;
  @Prop({ type: [{ hash: String, expiresAt: Date, _id: false }], default: [], select: false })
  refreshTokens: { hash: string; expiresAt: Date }[];
  @Prop() lastLoginAt?: Date;
  @Prop() deletedAt?: Date;
}
export type UserDoc = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);

/* ───────────── countries ───────────── */
@Schema(T)
export class Country {
  @Prop({ required: true, unique: true, trim: true }) slug: string;
  @Prop({ required: true, unique: true, uppercase: true, minlength: 2, maxlength: 3 }) code: string;
  @Prop({ required: true, trim: true }) nameMn: string;
  @Prop({ required: true, trim: true }) nameEn: string;
  @Prop() flag?: string;
  @Prop() region?: string;
  @Prop() overview?: string;
  @Prop() educationSystem?: string;
  @Prop() universityCount?: number;
  /** Тухайн улсад хамгийн өргөн хэрэглэгддэг хэл(үүд): 1 хэл ~80%+ бол ганцаар, үгүй бол хамгийн өргөн хэрэглэгддэг 2. Хэлний код (en, de…). Харуулах зориулалттай; тестийн оноолтод (`matchProfile.languages`) нөлөөлөхгүй. */
  @Prop({ type: [String], default: [] }) languages: string[];
  @Prop() bachelorDuration?: string;
  @Prop() masterDuration?: string;
  @Prop() languagePrepInfo?: string;
  @Prop() admissionGeneral?: string;
  @Prop({ type: [String], default: [] }) commonExams: string[];
  @Prop() tuitionRange?: string;
  /** Тухайн улсын олон улсын оюутанд хамаарах хууль, журам (хэлний шаардлага, виз гэх мэт). Албан ёсны эх сурвалжтай. Сургуулийн «Хэлний шаардлага» хэсгийн дор (төлбөртэй) харагдана. */
  @Prop({ type: [{ text: String, sourceName: String, sourceUrl: String, verifiedAt: String, _id: false }], default: [] }) admissionRules: { text: string; sourceName?: string; sourceUrl?: string; verifiedAt?: string }[];
  /** Тооцоолсон БАРИМЖАА (scripts/compute-country-tuition-estimates.ts): улсын сургуулиудын цуглуулсан бодит төлбөрөөс. Сургуулийн дүн биш. */
  @Prop({
    type: { level: String, items: [{ currency: String, n: Number, min: Number, median: Number, max: Number, _id: false }], basis: String, sourceName: String, sourceUrl: String, computedAt: Date, _id: false },
    default: undefined,
  }) tuitionEstimate?: { level: string; items: { currency: string; n?: number; min: number; median: number; max: number }[]; basis: string; sourceName?: string; sourceUrl?: string; computedAt: Date };
  @Prop({ type: { min: Number, max: Number, _id: false }, default: undefined }) livingCostMonthlyUsd?: { min?: number; max?: number };
  @Prop() scholarshipInfo?: string;
  @Prop({ type: [{ title: String, url: String, _id: false }], default: [] }) visaLinks: { title: string; url: string }[];
  @Prop({ type: [String], default: [] }) pros: string[];
  @Prop({ type: [String], default: [] }) cons: string[];
  /** Тестийн тохирлын редакцийн параметр (languages, climate, cityLife, costTier, safety, distance, culture, higherEd, workAbroad). Албан ёсны статистик биш; Админ засна. */
  @Prop({ type: SchemaTypes.Mixed, default: {} }) matchProfile: Record<string, any>;
  @Prop({ enum: ['draft', 'published'], default: 'draft', index: true }) status: string;
  @Prop(source) source?: SourceInfo;
  @Prop() deletedAt?: Date;
}
export const CountrySchema = SchemaFactory.createForClass(Country);

/* ───────────── universities ───────────── */
const RankingEntry = {
  provider: { type: String, required: true, enum: ['QS_WORLD', 'QS_ASIA', 'THE_WORLD', 'THE_ASIA', 'ARWU', 'SUBJECT', 'OTHER'] },
  subject: String,
  rank: { type: Number, min: 1 },
  rankText: String, // жишээ: "401-500"
  edition: String,
  year: { type: Number, required: true },
  sourceUrl: String,
  verifiedAt: Date,
  _id: false,
};
const TuitionEntry = {
  level: { type: String, enum: ['language_prep', 'foundation', 'bachelor', 'master', 'phd'], required: true },
  faculty: String,
  academicYear: String,
  currency: { type: String, default: 'USD' },
  annualFee: Number,
  /** Хөтөлбөрөөс хамаарч хүрээтэй үед дээд хязгаар (annualFee = доод хязгаар) */
  annualFeeMax: Number,
  semesterFee: Number,
  annualFeeUsd: Number,
  durationMonths: Number,
  feeType: { type: String, enum: ['international', 'domestic', 'general'], default: 'international' },
  otherFees: String,
  livingCostMonthlyUsd: Number,
  isEstimate: { type: Boolean, default: false },
  sourceUrl: String,
  verifiedAt: Date,
  _id: false,
};
const ScholarshipEntry = {
  name: { type: String, required: true },
  type: { type: String, enum: ['full', 'partial', 'merit', 'need'] },
  coverage: String,
  eligibility: String,
  deadline: String,
  url: String,
  _id: false,
};

@Schema(T)
export class University {
  @Prop({ required: true, unique: true, trim: true }) slug: string;
  @Prop({ required: true, trim: true, index: true }) name: string; // албан ёсны нэр (эх хэлээр)
  @Prop({ trim: true }) nameMn?: string;
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Country', required: true, index: true }) countryId: Types.ObjectId;
  @Prop({ trim: true, index: true }) city?: string;
  @Prop() website?: string;
  @Prop() foundedYear?: number;
  @Prop({ enum: ['public', 'private'] }) type?: string;
  @Prop() description?: string;
  @Prop() logoUrl?: string;
  @Prop({ type: [String], default: [] }) images: string[];
  /** Лого/зураг/танилцуулгын эх сурвалж, лиценз, зохиогч (Wikimedia Commons / Wikipedia). Харуулахдаа заавал заана. */
  @Prop({ type: SchemaTypes.Mixed, default: {} }) media: { logo?: any; cover?: any; description?: any };
  @Prop({ type: [String], default: [] }) degreeLevels: string[]; // language_prep|foundation|bachelor|master|phd
  @Prop({ type: [String], default: [] }) subjects: string[]; // subject category keys
  @Prop({ type: [String], default: [] }) languagesOfInstruction: string[];
  @Prop({ type: [String], default: [] }) intakes: string[]; // spring|summer|fall|winter
  @Prop({ type: [String], default: [] }) studyModes: string[]; // campus|online
  @Prop({ default: true }) acceptsInternational: boolean;
  @Prop({ type: [String], default: [] }) admissionTests: string[]; // ielts|toefl|sat|act|gre|gmat|local_language|none|other
  @Prop({ type: [String], default: [] }) scholarshipTypes: string[]; // full|partial|merit|need
  @Prop({ type: [RankingEntry], default: [] }) rankings: any[];
  @Prop({ type: [TuitionEntry], default: [] }) tuition: any[];
  @Prop({ type: [ScholarshipEntry], default: [] }) scholarships: any[];
  @Prop({ type: { dormitory: String, internationalSupport: String, facilities: String, contactEmail: String, contactPhone: String, mapUrl: String }, default: {} })
  other: Record<string, any>;
  /** Хайлт/эрэмбэлэлтийн denormalized талбарууд (service дээр шинэчилнэ) */
  @Prop({ index: true }) minTuitionUsd?: number;
  @Prop({ index: true }) maxTuitionUsd?: number;
  @Prop({ index: true }) bestQsWorld?: number;
  @Prop({ index: true }) bestQsAsia?: number;
  @Prop({ default: false, index: true }) featured: boolean;
  /** Төлбөртэй мэдээллийг (төлбөр, шалгалтын шаардлага, элсэлтийн явц) БҮХ хэрэглэгчид нээлттэй болгоно (нэвтрээгүйд ч). Мэдээлэл дутуу сургуульд ашиглана; админ тохируулна. */
  @Prop({ default: false }) freeAccess: boolean;
  /** ТӨЛБӨРТЭЙ мэдээлэл (сургууль эсвэл улсаар төлж нээгдэнэ). Нийтийн API-д хэзээ ч шууд буцаахгүй. */
  @Prop({
    type: {
      englishTests: [{ test: String, minScore: String, note: String, _id: false }],
      languagePageUrl: String,
      procedure: [String],
      applicationLinks: [{ title: String, url: String, _id: false }],
      _id: false,
    },
    default: {},
  })
  admission: Record<string, any>;
  @Prop({ enum: ['draft', 'published'], default: 'draft', index: true }) status: string;
  @Prop(source) source?: SourceInfo;
  @Prop() deletedAt?: Date;
}
export const UniversitySchema = SchemaFactory.createForClass(University);
UniversitySchema.index({ name: 'text', nameMn: 'text', city: 'text' }, { default_language: 'none', name: 'uni_text' });
UniversitySchema.index({ countryId: 1, type: 1, status: 1 });
/** Нийтийн жагсаалт: нийтлэгдсэн + нэрээр / шинэ эрэмбээр (хуудаслалт индексээр, бүх баримтыг уншихгүй) */
UniversitySchema.index({ status: 1, deletedAt: 1, name: 1 });
UniversitySchema.index({ status: 1, deletedAt: 1, createdAt: -1 });
UniversitySchema.index({ 'rankings.provider': 1, 'rankings.rank': 1 });

/* ───────────── programs ───────────── */
@Schema(T)
export class Program {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'University', required: true, index: true }) universityId: Types.ObjectId;
  @Prop({ required: true, trim: true }) name: string;
  @Prop({ required: true, enum: ['language_prep', 'foundation', 'bachelor', 'master', 'phd'] }) level: string;
  @Prop({ enum: ['coursework', 'research', 'professional', 'executive', 'other'] }) masterType?: string;
  @Prop() department?: string;
  @Prop() subject?: string;
  @Prop() language?: string;
  @Prop() durationMonths?: number;
  @Prop() annualTuition?: number;
  @Prop({ default: 'USD' }) currency: string;
  @Prop() applicationPeriod?: string;
  @Prop({ type: [String], default: [] }) intakes: string[];
  /** Элсэлтийн шаардлага програм бүрээр тусдаа. Мэдээлэл байхгүй бол хоосон үлдээнэ. */
  @Prop({
    type: [{ kind: { type: String, required: true }, minScore: Number, note: String, required: { type: Boolean, default: true }, _id: false }],
    default: [],
  })
  requirements: { kind: string; minScore?: number; note?: string; required?: boolean }[];
  @Prop({ enum: ['draft', 'published'], default: 'draft' }) status: string;
  @Prop(source) source?: SourceInfo;
  @Prop() deletedAt?: Date;
}
export const ProgramSchema = SchemaFactory.createForClass(Program);
ProgramSchema.index({ name: 'text' }, { default_language: 'none' });

/* ───────────── careers ───────────── */
@Schema(T)
export class CareerCategory {
  @Prop({ required: true, unique: true }) slug: string;
  @Prop({ required: true }) nameMn: string;
  @Prop() nameEn?: string;
  @Prop() description?: string;
}
export const CareerCategorySchema = SchemaFactory.createForClass(CareerCategory);

@Schema(T)
export class Skill {
  @Prop({ required: true, unique: true }) key: string;
  @Prop({ required: true }) nameMn: string;
  @Prop() nameEn?: string;
  @Prop() description?: string;
}
export const SkillSchema = SchemaFactory.createForClass(Skill);

@Schema(T)
export class Career {
  @Prop({ required: true, unique: true }) slug: string;
  @Prop({ required: true, trim: true }) nameMn: string;
  @Prop({ required: true, trim: true }) nameEn: string;
  @Prop({ type: SchemaTypes.ObjectId, ref: 'CareerCategory', index: true }) categoryId?: Types.ObjectId;
  @Prop() description?: string;
  /** O*NET-SOC код (эх сурвалжтай мэргэжил) ба Job Zone (1–5: шаардагдах бэлтгэлийн түвшин) */
  @Prop({ index: true }) onetCode?: string;
  @Prop() jobZone?: number;
  @Prop() whyPromising?: string;
  @Prop({ type: [String], default: [] }) requiredSkills: string[]; // skill keys (харуулах)
  @Prop({ type: [String], default: [] }) schoolSubjects: string[];
  @Prop({ type: [String], default: [] }) universityMajors: string[];
  @Prop({ type: [String], default: [] }) recommendedCountries: string[]; // country slug
  @Prop({ type: [String], default: [] }) pathways: string[];
  @Prop() mongoliaOpportunity?: string;
  @Prop() globalOpportunity?: string;
  @Prop() automationImpact?: string;
  /** Зөвхөн эх сурвалжтай бол бөглөнө. Хоосон бол UI "Мэдээлэл байхгүй" гэж харуулна. */
  @Prop({ type: { demand: String, growth: String, salary: String }, default: {} }) market: Record<string, any>;
  /** Тохирлын загварын параметр (редакцийн тохируулга; admin засна). */
  @Prop({
    type: {
      riasec: { R: Number, I: Number, A: Number, S: Number, E: Number, C: Number },
      skills: { type: Map, of: Number },
      workStyle: { type: Map, of: Number },
      values: { type: Map, of: Number },
      personality: { O: Number, C: Number, E: Number, A: Number },
      cognitive: { math: Number, verbal: Number, techSpatial: Number, abstract: Number },
      subjects: [String],
    },
    default: {},
  })
  profile: Record<string, any>;
  /** Ирээдүйтэй 25 мэргэжлийн эрэмбэнд оруулах шалгуурын оноо (0–100) — ЗӨВХӨН эх сурвалжтай бол Админ оруулна */
  @Prop({ type: SchemaTypes.Mixed }) future?: { scores?: Record<string, number>; year?: number; note?: string; sourceName?: string; sourceUrl?: string; verifiedAt?: Date };
  /** Монголын их сургуулийн бакалаврын хөтөлбөр бүрийн элсэлтийн ЭЕШ-ийн шаардлага (эх сурвалжтай). Нийтийн мэдээлэл. */
  @Prop({
    type: [{
      university: { type: String, required: true }, school: String, program: { type: String, required: true }, flags: String,
      level: String, baseExams: [String], extraExams: [String], cutoffScore: Number,
      /** «Бүлэг бүрээс нэг хичээл» загвар (АШУҮИС): ЭЕШ-1, ЭЕШ-2 бүлэг тус бүр өөрийн босготой */
      examGroups: [{ exams: [String], cutoffScore: Number, _id: false }],
      year: Number, sourceName: String, sourceUrl: String, _id: false,
    }],
    default: [],
  })
  entranceExams: { university: string; school?: string; program: string; flags?: string; level?: string; baseExams: string[]; extraExams: string[]; cutoffScore?: number; examGroups?: { exams: string[]; cutoffScore?: number }[]; year?: number; sourceName?: string; sourceUrl?: string }[];
  @Prop({ enum: ['draft', 'published'], default: 'published', index: true }) status: string;
  @Prop(source) source?: SourceInfo;
  @Prop() deletedAt?: Date;
}
export const CareerSchema = SchemaFactory.createForClass(Career);
CareerSchema.index({ nameMn: 'text', nameEn: 'text', description: 'text' }, { default_language: 'none' });

/* ───────────── assessments ───────────── */
@Schema(T)
export class Assessment {
  @Prop({ required: true, unique: true, enum: ['career', 'masters', 'language', 'city', 'persona', 'thinking', 'money', 'stress', 'strength', 'hunter', 'halloween'] }) key: string;
  @Prop({ required: true }) title: string;
  @Prop() subtitle?: string;
  @Prop() description?: string;
  @Prop({ required: true }) strategy: string;
  @Prop({ enum: ['draft', 'published'], default: 'draft' }) status: string;
  @Prop({ type: SchemaTypes.ObjectId, ref: 'AssessmentVersion' }) activeVersionId?: Types.ObjectId;
  @Prop({ default: 1 }) draftVersion: number;
  /** Draft дахь онооны тохиргоо (publish хийхэд version-д хөлдөөнө) */
  @Prop({ type: SchemaTypes.Mixed, default: {} }) scoringConfig: Record<string, any>;
  @Prop({ type: [{ key: String, title: String, description: String, order: Number, _id: false }], default: [] }) sections: any[];
}
export const AssessmentSchema = SchemaFactory.createForClass(Assessment);

@Schema(T)
export class AssessmentQuestion {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Assessment', required: true, index: true }) assessmentId: Types.ObjectId;
  @Prop({ required: true }) key: string;
  @Prop({ required: true }) section: string;
  @Prop({ default: 0 }) order: number;
  @Prop({ required: true, enum: ['single', 'multi', 'likert', 'rating', 'text', 'number'] }) type: string;
  @Prop({ required: true, maxlength: 600 }) text: string;
  @Prop({ default: true }) required: boolean;
  @Prop({ type: [{ key: String, label: String, weights: { type: SchemaTypes.Mixed }, _id: false }], default: [] }) options: any[];
  @Prop({ type: { min: Number, max: Number, minLabel: String, maxLabel: String, _id: false } }) scale?: any;
  /** Онооны тохиргоо — клиентэд ХЭЗЭЭ Ч илгээхгүй */
  @Prop({ type: { dimension: String, target: String, reverse: Boolean, weight: { type: Number, default: 1 }, _id: false } }) scoring?: any;
  /** Нөхцөлт асуулт: тодорхой асуултын хариулт тодорхой утгатай үед л харуулна */
  @Prop({ type: { questionKey: String, equals: SchemaTypes.Mixed, _id: false } }) showIf?: any;
  @Prop() deletedAt?: Date;
}
export const AssessmentQuestionSchema = SchemaFactory.createForClass(AssessmentQuestion);
AssessmentQuestionSchema.index({ assessmentId: 1, key: 1 }, { unique: true });

@Schema(T)
export class AssessmentVersion {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Assessment', required: true, index: true }) assessmentId: Types.ObjectId;
  @Prop({ required: true }) version: number;
  /** Асуултын бүрэн snapshot — дараа нь асуулт өөрчлөгдсөн ч хуучин үр дүн дахин тооцогдоно */
  @Prop({ type: SchemaTypes.Mixed, required: true }) snapshot: { sections: any[]; questions: any[] };
  @Prop({ type: SchemaTypes.Mixed, default: {} }) scoringConfig: Record<string, any>;
  @Prop() publishedAt: Date;
  @Prop() publishedBy?: string;
}
export const AssessmentVersionSchema = SchemaFactory.createForClass(AssessmentVersion);
AssessmentVersionSchema.index({ assessmentId: 1, version: 1 }, { unique: true });

@Schema(T)
export class AssessmentAttempt {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true }) userId: Types.ObjectId;
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Assessment', required: true }) assessmentId: Types.ObjectId;
  @Prop({ required: true }) assessmentKey: string;
  @Prop({ type: SchemaTypes.ObjectId, ref: 'AssessmentVersion', required: true }) versionId: Types.ObjectId;
  @Prop({ enum: ['in_progress', 'completed'], default: 'in_progress' }) status: string;
  /** assessmentAnswers: attempt дотор нэгтгэсэн (нэг attempt = нэг баримт, atomic autosave) */
  @Prop({ type: SchemaTypes.Mixed, default: {} }) answers: Record<string, any>;
  @Prop() completedAt?: Date;
}
export const AssessmentAttemptSchema = SchemaFactory.createForClass(AssessmentAttempt);
AssessmentAttemptSchema.index({ userId: 1, createdAt: -1 });

@Schema(T)
export class AssessmentResult {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'AssessmentAttempt', required: true, unique: true }) attemptId: Types.ObjectId;
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true, index: true }) userId: Types.ObjectId;
  @Prop({ required: true }) assessmentKey: string;
  @Prop({ type: SchemaTypes.ObjectId, ref: 'AssessmentVersion', required: true }) versionId: Types.ObjectId;
  @Prop({ type: SchemaTypes.Mixed, required: true }) payload: Record<string, any>;
}
export const AssessmentResultSchema = SchemaFactory.createForClass(AssessmentResult);

/* ───────────── master's fields (Phase 2) ───────────── */
@Schema(T)
export class MasterField {
  @Prop({ required: true, unique: true }) slug: string;
  @Prop({ required: true }) nameMn: string;
  @Prop({ required: true }) nameEn: string;
  @Prop({ required: true }) area: string;
  @Prop({ required: true, enum: ['coursework', 'research', 'professional', 'executive'] }) type: string;
  @Prop() uniSubject?: string;
  @Prop() description?: string;
  @Prop({ default: 50 }) research: number;
  @Prop({ default: 50 }) leadership: number;
  @Prop({ default: 0 }) minExperience: number;
  @Prop({ type: SchemaTypes.Mixed, default: {} }) goalFit: Record<string, number>;
  @Prop({ type: [String], default: [] }) adjacent: string[];
  @Prop({ type: [String], default: [] }) prerequisites: string[];
  @Prop({ type: [String], default: [] }) competencies: string[];
  @Prop({ type: [String], default: [] }) commonExams: string[];
  @Prop({ enum: ['draft', 'published'], default: 'published' }) status: string;
  @Prop() deletedAt?: Date;
}
export const MasterFieldSchema = SchemaFactory.createForClass(MasterField);

@Schema(T)
export class Setting {
  @Prop({ required: true, unique: true }) key: string;
  @Prop({ type: SchemaTypes.Mixed, default: {} }) value: any;
  @Prop() updatedBy?: string;
}
export const SettingSchema = SchemaFactory.createForClass(Setting);

/* ───────────── saved / sources / audit ───────────── */
@Schema(T)
export class SavedUniversity {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true }) userId: Types.ObjectId;
  @Prop({ type: SchemaTypes.ObjectId, ref: 'University', required: true }) universityId: Types.ObjectId;
  @Prop({ enum: ['dream', 'target', 'safe', 'none'], default: 'none' }) group: string;
  @Prop({ maxlength: 1000 }) note?: string;
  @Prop({ enum: ['researching', 'preparing', 'ready', 'submitted', 'interview', 'accepted', 'rejected'], default: 'researching' }) status: string;
  @Prop() deadline?: Date;
  @Prop({ type: [{ name: { type: String, maxlength: 120 }, done: { type: Boolean, default: false }, _id: false }], default: [] }) documents: { name: string; done: boolean }[];
}
export const SavedUniversitySchema = SchemaFactory.createForClass(SavedUniversity);
SavedUniversitySchema.index({ userId: 1, universityId: 1 }, { unique: true });

@Schema(T)
export class ContentSource {
  @Prop({ required: true }) name: string;
  @Prop({ required: true }) url: string;
  @Prop({ enum: ['official_university', 'official_admission', 'ranking_provider', 'government', 'scholarship_org', 'exam_provider', 'labor_research', 'other'], default: 'other' }) type: string;
  @Prop({ enum: ['primary', 'secondary', 'estimate', 'unknown'], default: 'unknown' }) reliabilityStatus: string;
  @Prop() notes?: string;
  @Prop() lastCheckedAt?: Date;
}
export const ContentSourceSchema = SchemaFactory.createForClass(ContentSource);

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class AdminAuditLog {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', index: true }) actorId: Types.ObjectId;
  @Prop() actorEmail: string;
  @Prop({ required: true }) action: string; // create|update|delete|publish|role_change
  @Prop({ required: true }) resource: string;
  @Prop() resourceId?: string;
  @Prop({ type: SchemaTypes.Mixed }) changes?: any;
}
export const AdminAuditLogSchema = SchemaFactory.createForClass(AdminAuditLog);
AdminAuditLogSchema.index({ createdAt: -1 });

export const MODELS = [
  ...PAYMENT_MODELS,
  { name: Setting.name, schema: SettingSchema },
  { name: User.name, schema: UserSchema },
  { name: Country.name, schema: CountrySchema },
  { name: University.name, schema: UniversitySchema },
  { name: Program.name, schema: ProgramSchema },
  { name: CareerCategory.name, schema: CareerCategorySchema },
  { name: Skill.name, schema: SkillSchema },
  { name: Career.name, schema: CareerSchema },
  { name: MasterField.name, schema: MasterFieldSchema },
  { name: Assessment.name, schema: AssessmentSchema },
  { name: AssessmentQuestion.name, schema: AssessmentQuestionSchema },
  { name: AssessmentVersion.name, schema: AssessmentVersionSchema },
  { name: AssessmentAttempt.name, schema: AssessmentAttemptSchema },
  { name: AssessmentResult.name, schema: AssessmentResultSchema },
  { name: SavedUniversity.name, schema: SavedUniversitySchema },
  { name: ContentSource.name, schema: ContentSourceSchema },
  { name: AdminAuditLog.name, schema: AdminAuditLogSchema },
];
