import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, Types } from 'mongoose';
import { AssessmentAttempt, AssessmentResult, Career, CareerCategory, Country, Program, University, User } from '../../schemas';
import { EntitlementsService } from '../payments/payments.service';
import { escapeRegex, parsePaging, toArray } from '../../common/pagination';

const RANKING_PROVIDERS = ['QS_WORLD', 'QS_ASIA', 'THE_WORLD', 'THE_ASIA', 'ARWU'];

/** Хайлт/эрэмбэлэлтэд ашиглах denormalized талбаруудыг тооцно. */
export function deriveUniversity(u: any) {
  const usd = (u.tuition ?? []).map((t: any) => t.annualFeeUsd).filter((n: any) => typeof n === 'number');
  u.minTuitionUsd = usd.length ? Math.min(...usd) : undefined;
  u.maxTuitionUsd = usd.length ? Math.max(...usd) : undefined;
  const best = (prov: string) => {
    const r = (u.rankings ?? []).filter((x: any) => x.provider === prov && typeof x.rank === 'number').sort((a: any, b: any) => b.year - a.year);
    return r.length ? r[0].rank : undefined;
  };
  u.bestQsWorld = best('QS_WORLD');
  u.bestQsAsia = best('QS_ASIA');
  return u;
}

function latestRanking(rankings: any[], provider: string) {
  const r = (rankings ?? []).filter((x) => x.provider === provider && !x.subject).sort((a, b) => b.year - a.year)[0];
  return r ? { rank: r.rank ?? null, rankText: r.rankText ?? null, edition: r.edition ?? null, year: r.year, sourceUrl: r.sourceUrl ?? null } : null;
}

const COUNTRY_TEXT_LOCKED = ['educationSystem', 'tuitionRange', 'admissionGeneral', 'languagePrepInfo', 'scholarshipInfo'] as const;
const COUNTRY_LIST_LOCKED = ['commonExams', 'pros', 'cons'] as const;
const TEASER_LINES = 2;
/** Эхний 2 мөр, гэхдээ ядаж нэг мөр үргэлж хаалттай (1–2 мөртэй хэсэг бүтнээрээ задрахгүй). */
const teaserCount = (n: number) => Math.min(TEASER_LINES, n - 1);
/** Текстийг мөр (өгүүлбэр) болгон салгана — frontend-ийн жагсаалттай ижил дүрэм. */
const splitLines = (text?: string | null): string[] => (text ? text.split(/\n{2,}/).flatMap((p) => p.split(/(?<=\.)\s+(?=[А-ЯӨҮA-Z«(])/)).map((s) => s.trim()).filter(Boolean) : []);

@Injectable()
export class CatalogService {
  constructor(
    @InjectModel(University.name) private unis: Model<University>,
    @InjectModel(Country.name) private countries: Model<Country>,
    @InjectModel(Program.name) private programs: Model<Program>,
    @InjectModel(User.name) private users: Model<User>,
    @InjectModel(AssessmentAttempt.name) private attempts: Model<AssessmentAttempt>,
    @InjectModel(AssessmentResult.name) private results: Model<AssessmentResult>,
    @InjectModel(Career.name) private careers: Model<Career>,
    @InjectModel(CareerCategory.name) private cats: Model<CareerCategory>,
    private ent: EntitlementsService,
  ) {}

  /**
   * Premium: хувийн тохирлын дүгнэлт. Нийт рейтингээс ТУСАД, зөвхөн хэрэглэгчийн бүртгэсэн төсөв ба
   * сүүлийн Career тестийн дээд мэргэжлийн чиглэлтэй харьцуулна. Мэдээлэл дутвал "unknown".
   */
  async compareInsights(user: { id: string; role: string } | undefined, items: any[]) {
    if (!user) return { locked: true, insights: null };
    if (user.role === 'user' && !(await this.ent.has(user.id, 'premium_comparison'))) return { locked: true, insights: null };
    const me: any = await this.users.findById(user.id).select('profile').lean();
    const budget = me?.profile?.budgetUsd;
    const at: any = await this.attempts.findOne({ userId: user.id, assessmentKey: 'career', status: 'completed' }).sort({ completedAt: -1 }).select('_id').lean();
    const res: any = at ? await this.results.findOne({ attemptId: at._id }).select('payload.careerMatches').lean() : null;
    const slugs: string[] = (res?.payload?.careerMatches ?? []).slice(0, 5).map((m: any) => m.slug);
    const cs: any[] = slugs.length ? await this.careers.find({ slug: { $in: slugs } }).populate('categoryId', 'slug').lean() : [];
    const MAP: Record<string, string[]> = { technology: ['computer_science', 'engineering'], engineering: ['engineering'], health: ['medicine', 'natural_science'], business: ['business', 'economics'], creative: ['art_design'], 'education-social': ['education', 'social_science'], science: ['natural_science'], 'law-public': ['law', 'social_science'], 'agri-env': ['natural_science'] };
    const wanted = new Set<string>(cs.flatMap((c) => MAP[c.categoryId?.slug] ?? []));
    const insights: Record<string, any> = {};
    for (const u of items) {
      const tu = undefined; // төлбөр нь төлбөртэй мэдээлэл — харьцуулалтад ашиглахгүй
      const budgetFit = budget == null || tu == null ? 'unknown' : tu <= budget ? 'within' : 'above';
      const matched = wanted.size ? (u.subjects ?? []).filter((s: string) => wanted.has(s)) : null;
      insights[u.id] = { budgetFit, budgetUsd: budget ?? null, tuitionMinUsd: tu ?? null, subjectFit: matched === null ? 'unknown' : matched.length ? 'match' : 'none', matchedSubjects: matched ?? [] };
    }
    return { locked: false, insights, basis: { hasBudget: budget != null, hasCareerTest: !!slugs.length } };
  }

  /* ── countries ── */
  async listCountries(q: any) {
    const { page, pageSize, skip } = parsePaging(q, 50, 100);
    const filter: any = { status: 'published', deletedAt: null };
    if (q.q) { const re = new RegExp(escapeRegex(String(q.q)), 'i'); filter.$or = [{ nameMn: re }, { nameEn: re }]; }
    // Гурван асуулга хоорондоо хамааралгүй тул зэрэг ажиллуулна (алсын DB-д дараалсан дуудлага бүр ~100мс нэмдэг).
    const [items, total, counts] = await Promise.all([
      this.countries.find(filter).sort({ nameMn: 1 }).skip(skip).limit(pageSize).select('slug code nameMn nameEn flag region overview universityCount livingCostMonthlyUsd matchProfile.languages bachelorDuration masterDuration source').lean(),
      this.countries.countDocuments(filter),
      this.unis.aggregate([{ $match: { status: 'published', deletedAt: null } }, { $group: { _id: '$countryId', n: { $sum: 1 } } }]),
    ]);
    const map = new Map(counts.map((c) => [String(c._id), c.n]));
    return { items: items.map((c: any) => ({ ...c, publishedUniversities: map.get(String(c._id)) ?? 0 })), total, page, pageSize };
  }

  /**
   * Улс: ерөнхий мэдээлэл, визийн холбоос, сургуулиуд нээлттэй. Бусад мэдээлэл (төлбөр, шаардлага, шалгалт, давуу/сул тал…)
   * нь `country_access` авсан хэрэглэгчид (эсвэл админд) бүтнээрээ; бусдад зөвхөн эхний 2 мөр серверээс л ирнэ.
   */
  async getCountry(slug: string, user?: { id: string; role: string }) {
    const c: any = await this.countries.findOne({ slug, status: 'published', deletedAt: null }).lean();
    if (!c) throw new NotFoundException({ code: 'NOT_FOUND', message: 'Улс олдсонгүй.' });
    const [universities, unlocked] = await Promise.all([
      this.unis.find({ countryId: c._id, status: 'published', deletedAt: null }).sort({ name: 1 }).limit(100).select('slug name nameMn city logoUrl type').lean(),
      !!user && (user.role !== 'user' || this.ent.has(user.id, 'country_access', String(c._id))),
    ]);
    if (unlocked) return { ...c, universities, access: { unlocked: true, truncated: [] as string[] } };
    const truncated: string[] = [];
    for (const f of COUNTRY_TEXT_LOCKED) {
      const parts = splitLines(c[f]);
      if (!parts.length) continue;
      truncated.push(f);
      c[f] = parts.slice(0, teaserCount(parts.length)).join(' ');
    }
    for (const f of COUNTRY_LIST_LOCKED) {
      const arr: string[] = c[f] ?? [];
      if (!arr.length) continue;
      truncated.push(f);
      c[f] = arr.slice(0, teaserCount(arr.length));
    }
    return { ...c, universities, access: { unlocked: false, truncated } };
  }

  /* ── universities ── */
  async listUniversities(q: any) {
    const { page, pageSize, skip } = parsePaging(q, 12, 48);
    const and: any[] = [{ status: 'published' }, { deletedAt: null }];

    if (q.q) {
      const s = String(q.q).trim();
      const re = new RegExp(escapeRegex(s), 'i');
      const [cs, ps] = await Promise.all([
        this.countries.find({ $or: [{ nameMn: re }, { nameEn: re }], status: 'published' }).select('_id').lean(),
        this.programs.find({ $or: [{ name: re }, { subject: re }], status: 'published', deletedAt: null }).select('universityId').limit(500).lean(),
      ]);
      const or: any[] = [{ name: re }, { nameMn: re }, { city: re }, { subjects: re }, { countryId: { $in: cs.map((c) => c._id) } }, { _id: { $in: ps.map((p) => p.universityId) } }];
      const n = parseInt(s, 10);
      if (!isNaN(n)) or.push({ bestQsWorld: n }, { bestQsAsia: n });
      and.push({ $or: or });
    }
    if (q.featured === 'true') and.push({ featured: true });
    const country = toArray(q.country);
    if (country.length) {
      const cs = await this.countries.find({ slug: { $in: country } }).select('_id').lean();
      and.push({ countryId: { $in: cs.map((c) => c._id) } });
    }
    const degree = toArray(q.degree); if (degree.length) and.push({ degreeLevels: { $in: degree } });
    const type = toArray(q.type); if (type.length) and.push({ type: { $in: type } });
    const subject = toArray(q.subject); if (subject.length) and.push({ subjects: { $in: subject } });
    const intake = toArray(q.intake); if (intake.length) and.push({ intakes: { $in: intake } });
    const lang = toArray(q.language); if (lang.length) and.push({ languagesOfInstruction: { $in: lang } });
    const mode = toArray(q.mode); if (mode.length) and.push({ studyModes: { $in: mode } });
    const city = toArray(q.city); if (city.length) and.push({ city: { $in: city } });
    const ranking = toArray(q.ranking).filter((r) => RANKING_PROVIDERS.includes(r));
    if (ranking.length) and.push({ 'rankings.provider': { $in: ranking } });
    if (q.international === 'true') and.push({ acceptsInternational: true });

    const sch = toArray(q.scholarship);
    if (sch.length) {
      const or: any[] = sch.filter((s) => s !== 'none').length ? [{ scholarshipTypes: { $in: sch.filter((s) => s !== 'none') } }] : [];
      if (sch.includes('none')) or.push({ scholarshipTypes: { $size: 0 } });
      and.push({ $or: or });
    }
    const sorts: Record<string, any> = {
      name: { name: 1 }, newest: { createdAt: -1 },
      qsWorld: { _k: 1, name: 1 }, qsAsia: { _k2: 1, name: 1 },
    };
    const sort = typeof q.sort === 'string' && Object.prototype.hasOwnProperty.call(sorts, q.sort) ? sorts[q.sort] : sorts.name;
    const pipeline: PipelineStage[] = [
      { $match: { $and: and } },
      { $addFields: { _k: { $ifNull: ['$bestQsWorld', 1e9] }, _k2: { $ifNull: ['$bestQsAsia', 1e9] } } },
      { $sort: sort },
      { $facet: {
        items: [{ $skip: skip }, { $limit: pageSize }, { $lookup: { from: 'countries', localField: 'countryId', foreignField: '_id', as: 'country' } }, { $unwind: { path: '$country', preserveNullAndEmptyArrays: true } }],
        total: [{ $count: 'n' }],
      } },
    ];
    const [r] = await this.unis.aggregate(pipeline);
    return { items: (r.items as any[]).map((u) => this.toCard(u)), total: r.total[0]?.n ?? 0, page, pageSize };
  }

  /** Жагсаалтын карт: ЗӨВХӨН үнэгүй мэдээлэл (лого, зураг, нэр, улс). Төлбөр/шаардлага хэзээ ч орохгүй. */
  toCard(u: any) {
    return {
      id: String(u._id), slug: u.slug, name: u.name, nameMn: u.nameMn ?? null, logoUrl: u.logoUrl ?? null, coverUrl: (u.images ?? [])[0] ?? null,
      city: u.city ?? null, type: u.type ?? null,
      country: u.country ? { slug: u.country.slug, code: u.country.code, nameMn: u.country.nameMn, nameEn: u.country.nameEn, flag: u.country.flag ?? null } : null,
      degreeLevels: u.degreeLevels ?? [], subjects: u.subjects ?? [],
    };
  }

  /** Нүүрний «Онцлох сургуулиуд»: featured тэмдэглэснээс; байхгүй бол QS-ийн эрэмбээр шилдэг; тэгэхгүй бол хамгийн сүүлд нэмэгдсэн */
  async featured(limit = 6) {
    const base = { status: 'published', deletedAt: null };
    let items: any[] = await this.unis.find({ ...base, featured: true }).sort({ name: 1 }).limit(limit).populate('countryId').lean();
    if (!items.length) items = await this.unis.find({ ...base, bestQsWorld: { $gt: 0 } }).sort({ bestQsWorld: 1, name: 1 }).limit(limit).populate('countryId').lean();
    if (!items.length) items = await this.unis.find(base).sort({ createdAt: -1 }).limit(limit).populate('countryId').lean();
    return items.map((u) => this.toCard({ ...u, country: u.countryId }));
  }

  /** Төлбөртэй мэдээллийн ангилал бүр: мэдээлэл байгаа эсэх (агуулгыг задруулахгүй) */
  static categories(u: any, programs: any[], country?: any) {
    const a = u.admission ?? {};
    return [
      { key: 'tuition', available: (u.tuition ?? []).length > 0 },
      { key: 'english', available: (a.englishTests ?? []).length > 0 || (country?.admissionRules ?? []).length > 0 },
      { key: 'exams', available: (a.standardizedTests ?? []).length > 0 },
      { key: 'procedure', available: (a.procedure ?? []).length > 0 || (a.applicationLinks ?? []).length > 0 },
    ];
  }

  private paidPayload(u: any, programs: any[], country?: any) {
    const a = u.admission ?? {};
    return {
      tuition: u.tuition ?? [],
      english: a.englishTests ?? [],
      languageRules: (country?.admissionRules ?? []).map((r: any) => ({ text: r.text, sourceName: r.sourceName ?? null, sourceUrl: r.sourceUrl ?? null, verifiedAt: r.verifiedAt ?? null })),
      exams: a.standardizedTests ?? [],
      procedure: { steps: a.procedure ?? [], links: a.applicationLinks ?? [] },
      programs: programs.map((p) => ({ id: String(p._id), name: p.name, level: p.level, department: p.department ?? null, language: p.language ?? null, durationMonths: p.durationMonths ?? null, annualTuition: p.annualTuition ?? null, currency: p.currency ?? 'USD', applicationPeriod: p.applicationPeriod ?? null, requirements: p.requirements ?? [] })),
    };
  }

  /**
   * Сургуулийн дэлгэрэнгүй. Нээгдээгүй бол ЗӨВХӨН үнэгүй талбарыг (whitelist) + ангиллын заалт буцаана —
   * төлбөртэй агуулга хариунд огт орохгүй (frontend-д найдахгүй). Нээсэн/админ бол `paid` нэмэгдэнэ.
   */
  async getUniversity(slug: string, user?: { id: string; role: string }) {
    const u: any = await this.unis.findOne({ slug, status: 'published', deletedAt: null }).populate('countryId').lean();
    if (!u) throw new NotFoundException({ code: 'NOT_FOUND', message: 'Их сургууль олдсонгүй.' });
    const c = u.countryId;
    const [programs, universityCount, unlocked] = await Promise.all([
      this.programs.find({ universityId: u._id, status: 'published', deletedAt: null }).sort({ level: 1, name: 1 }).lean(),
      this.unis.countDocuments({ countryId: c._id, status: 'published', deletedAt: null }),
      !!user && (user.role !== 'user' || this.ent.hasUniversityAccess(user.id, u._id, c._id)),
    ]);
    const free = {
      id: String(u._id), slug: u.slug, name: u.name, nameMn: u.nameMn ?? null, description: u.description ?? null, logoUrl: u.logoUrl ?? null, images: u.images ?? [], media: u.media ?? {},
      city: u.city ?? null, website: u.website ?? null, foundedYear: u.foundedYear ?? null, type: u.type ?? null, degreeLevels: u.degreeLevels ?? [], subjects: u.subjects ?? [],
      languagesOfInstruction: u.languagesOfInstruction ?? [], intakes: u.intakes ?? [], studyModes: u.studyModes ?? [], acceptsInternational: u.acceptsInternational ?? true,
      rankings: u.rankings ?? [], scholarships: u.scholarships ?? [], other: u.other ?? {},
      country: { id: String(c._id), slug: c.slug, code: c.code, nameMn: c.nameMn, nameEn: c.nameEn, flag: c.flag ?? null, universityCount, livingCostMonthlyUsd: c.livingCostMonthlyUsd ?? null, tuitionEstimate: c.tuitionEstimate ?? null, source: c.source ? { sourceName: c.source.sourceName ?? null, sourceUrl: c.source.sourceUrl ?? null, verifiedAt: c.source.verifiedAt ?? null, lastUpdatedAt: c.source.lastUpdatedAt ?? null, verificationStatus: c.source.verificationStatus ?? null } : null },
      source: u.source ? { verifiedAt: u.source.verifiedAt ?? null, lastUpdatedAt: u.source.lastUpdatedAt ?? null, verificationStatus: u.source.verificationStatus ?? null } : null,
    };
    return { ...free, access: { unlocked, categories: CatalogService.categories(u, programs, c) }, ...(unlocked ? { paid: this.paidPayload(u, programs, c) } : {}) };
  }

  /**
   * Профайл: төлж нээсэн сургуулиуд ба улсууд. Нээлт нь худалдан авсан эрх (Subscription) — сургууль эсвэл улс бүхэлдээ.
   * Улсыг бүхэлд нь нээсэн бол `countries` жагсаалтад гарна (тэр улсын бүх сургууль нээлттэй).
   */
  async accessSummary(userId: string) {
    const subs: any[] = await this.ent.list(userId);
    const uniIds = subs.filter((s) => s.productKey === 'university_access' && s.targetId).map((s) => s.targetId);
    const countryIds = subs.filter((s) => s.productKey === 'country_access' && s.targetId).map((s) => s.targetId);
    const [unis, countries] = await Promise.all([
      this.unis.find({ _id: { $in: uniIds }, status: 'published', deletedAt: null }).select('slug name logoUrl city countryId').populate('countryId', 'nameMn code').lean() as Promise<any[]>,
      this.countries.find({ _id: { $in: countryIds }, status: 'published', deletedAt: null }).select('slug nameMn code').lean() as Promise<any[]>,
    ]);
    const at = new Map<string, Date>(subs.filter((s) => s.targetId).map((s) => [String(s.targetId), s.createdAt]));
    const byDate = (a: any, b: any) => +new Date(b.unlockedAt ?? 0) - +new Date(a.unlockedAt ?? 0);
    return {
      unlocked: unis.map((u) => ({ slug: u.slug, name: u.name, logoUrl: u.logoUrl ?? null, city: u.city ?? null, country: u.countryId ? { nameMn: u.countryId.nameMn, code: u.countryId.code } : null, unlockedAt: at.get(String(u._id)) ?? null })).sort(byDate),
      countries: countries.map((c) => ({ slug: c.slug, nameMn: c.nameMn, code: c.code, unlockedAt: at.get(String(c._id)) ?? null })).sort(byDate),
    };
  }

  async getUniversitiesByIds(ids: string[]) {
    const objIds = ids.filter(Types.ObjectId.isValid).slice(0, 4).map((i) => new Types.ObjectId(i));
    const items: any[] = await this.unis.find({ _id: { $in: objIds }, status: 'published', deletedAt: null }).populate('countryId').lean();
    return items.map((u) => ({ ...this.toCard({ ...u, country: u.countryId }), scholarshipTypes: u.scholarshipTypes ?? [], qsWorld: latestRanking(u.rankings, 'QS_WORLD'), qsAsia: latestRanking(u.rankings, 'QS_ASIA') }));
  }

  /** Filter-ийн сонголтууд (улс, хот) */
  async filterMeta() {
    const [countries, cities] = await Promise.all([
      this.countries.find({ status: 'published', deletedAt: null }).sort({ nameMn: 1 }).select('slug nameMn nameEn flag').lean(),
      this.unis.distinct('city', { status: 'published', deletedAt: null, city: { $ne: null } }),
    ]);
    return { countries, cities: (cities as string[]).sort() };
  }
}
