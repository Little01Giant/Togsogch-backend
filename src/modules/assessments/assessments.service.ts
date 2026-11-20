import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Assessment, AssessmentAttempt, AssessmentQuestion, AssessmentResult, AssessmentVersion, Career, Country, MasterField, Program, Skill, University } from '../../schemas';
import { getStrategy, QuestionSnapshot } from '../scoring';
import { ARCHETYPE_TEST_KEYS } from '../scoring/archetype-tests';
import { STATIC_LABELS } from '../../seed/content';
import { CAREER_CATEGORY_TO_UNI_SUBJECTS } from '../scoring/career-uni-subjects';
import { EntitlementsService } from '../payments/payments.service';
import { lockResult, premiumForResult, RoadPhase } from '../payments/premium';

/** Төлбөргүй үр дүнтэй тестүүд (хувийн/төлбөртэй мэдээлэл агуулаагүй зугаа цэнгээний тест). */
const FREE_KINDS = new Set(['persona', 'thinking', 'archetype', ...ARCHETYPE_TEST_KEYS]);

/** Тестүүдийн жагсаалтын эхний дараалал (бусад нь түлхүүрийн үсгийн дарааллаар). */
const LEAD_ORDER = ['career', 'city', 'masters'];

const bad = (code: string, message: string, details?: any) => new BadRequestException({ code, message, details });

/** Клиентэд өгөх асуулт: онооны тохиргоо, сонголтын жинг хасна. */
export function publicQuestion(q: QuestionSnapshot) {
  const { scoring, ...rest } = q as any;
  return { ...rest, options: q.options?.map((o) => ({ key: o.key, label: o.label })) };
}

/** Нөхцөлт асуулт харагдаж байгаа эсэх */
export function isVisible(q: QuestionSnapshot, answers: Record<string, any>) {
  if (!q.showIf?.questionKey) return true;
  const a = answers[q.showIf.questionKey];
  return Array.isArray(a) ? a.includes(q.showIf.equals) : a === q.showIf.equals;
}

export function validateAnswer(q: QuestionSnapshot, v: any): string | null {
  if (v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0)) return null; // хоосон — required-ийг submit дээр шалгана
  switch (q.type) {
    case 'likert':
    case 'rating': {
      const n = Number(v);
      const min = q.scale?.min ?? 1, max = q.scale?.max ?? 5;
      return Number.isInteger(n) && n >= min && n <= max ? null : `Хариулт ${min}–${max} хооронд байх ёстой`;
    }
    case 'number': return isFinite(Number(v)) ? null : 'Тоо оруулна уу';
    case 'single': return q.options?.some((o) => o.key === v) ? null : 'Буруу сонголт';
    case 'multi': return Array.isArray(v) && v.every((x) => q.options?.some((o) => o.key === x)) ? null : 'Буруу сонголт';
    case 'text': return typeof v === 'string' && v.length <= 2000 ? null : 'Хэт урт текст';
  }
  return 'Дэмжигдээгүй асуултын төрөл';
}

@Injectable()
export class AssessmentsService {
  constructor(
    @InjectModel(Assessment.name) private assessments: Model<Assessment>,
    @InjectModel(AssessmentQuestion.name) private questions: Model<AssessmentQuestion>,
    @InjectModel(AssessmentVersion.name) private versions: Model<AssessmentVersion>,
    @InjectModel(AssessmentAttempt.name) private attempts: Model<AssessmentAttempt>,
    @InjectModel(AssessmentResult.name) private results: Model<AssessmentResult>,
    @InjectModel(Career.name) private careers: Model<Career>,
    @InjectModel(Skill.name) private skills: Model<Skill>,
    @InjectModel(MasterField.name) private masterFields: Model<MasterField>,
    @InjectModel(Country.name) private countries: Model<Country>,
    @InjectModel(University.name) private unis: Model<University>,
    private ent: EntitlementsService,
  ) {}

  async list() {
    const found: any[] = await this.assessments.find().sort({ key: 1 }).lean();
    // Төлбөртэй гурван тест (мэргэжил, улс, магистр) эхэнд, бусад нь үсгийн дарааллаар
    const rank = (k: string) => { const i = LEAD_ORDER.indexOf(k); return i < 0 ? LEAD_ORDER.length : i; };
    const all = [...found].sort((a, b) => rank(a.key) - rank(b.key));
    // Нийтлэгдэж байсан (идэвхтэй хувилбартай) боловч одоо draft болсон тест = архивлагдсан (жишээ нь нэгтгэгдсэн «language») → жагсаалтад харуулахгүй
    const rows = all.filter((a) => a.status === 'published' || !a.activeVersionId);
    return Promise.all(rows.map(async (a) => {
      const v: any = a.activeVersionId ? await this.versions.findById(a.activeVersionId).select('snapshot.questions version').lean() : null;
      return { key: a.key, title: a.title, subtitle: a.subtitle, description: a.description, available: a.status === 'published' && !!v, freeResult: FREE_KINDS.has(a.key), questionCount: v?.snapshot.questions.length ?? 0, version: v?.version ?? null };
    }));
  }

  private async activeVersion(key: string) {
    const a = await this.assessments.findOne({ key, status: 'published' }).lean();
    const v = a?.activeVersionId ? await this.versions.findById(a.activeVersionId).lean() : null;
    if (!a || !v) throw new NotFoundException({ code: 'NOT_AVAILABLE', message: 'Энэ тест одоогоор нээгдээгүй байна.' });
    return { a, v };
  }

  async getActive(key: string) {
    const { a, v } = await this.activeVersion(key);
    return {
      key: a.key, title: a.title, subtitle: a.subtitle, description: a.description, version: v.version,
      sections: [...v.snapshot.sections].sort((x, y) => x.order - y.order),
      questions: v.snapshot.questions.sort((x: any, y: any) => x.order - y.order).map(publicQuestion),
    };
  }

  async start(userId: string, key: string) {
    const { a, v } = await this.activeVersion(key);
    const existing = await this.attempts.findOne({ userId, assessmentKey: key, versionId: v._id, status: 'in_progress' });
    if (existing) return { id: String(existing._id), answers: existing.answers, resumed: true };
    const at = await this.attempts.create({ userId, assessmentId: a._id, assessmentKey: key, versionId: v._id, answers: {} });
    return { id: String(at._id), answers: {}, resumed: false };
  }

  private async ownAttempt(userId: string, id: string) {
    const at = await this.attempts.findById(id);
    if (!at) throw new NotFoundException({ code: 'NOT_FOUND', message: 'Оролдлого олдсонгүй.' });
    if (String(at.userId) !== userId) throw new ForbiddenException({ code: 'FORBIDDEN', message: 'Танд энэ үйлдлийг хийх эрх байхгүй.' });
    return at;
  }

  async saveAnswers(userId: string, id: string, answers: Record<string, any>) {
    const at = await this.ownAttempt(userId, id);
    if (at.status !== 'in_progress') throw bad('ALREADY_COMPLETED', 'Энэ тест аль хэдийн дууссан байна.');
    const v: any = await this.versions.findById(at.versionId).lean();
    const byKey = new Map<string, QuestionSnapshot>(v.snapshot.questions.map((q: any) => [q.key, q]));
    const errors: string[] = [];
    const set: Record<string, any> = {};
    for (const [k, val] of Object.entries(answers ?? {})) {
      const q = byKey.get(k);
      if (!q) { errors.push(`${k}: ийм асуулт байхгүй`); continue; }
      const err = validateAnswer(q, val);
      if (err) errors.push(`${k}: ${err}`);
      else set[`answers.${k}`] = val;
    }
    if (errors.length) throw bad('VALIDATION_ERROR', 'Хариулт буруу байна.', errors);
    if (Object.keys(set).length) await this.attempts.updateOne({ _id: id }, { $set: set });
    return { saved: Object.keys(set).length };
  }

  /** Сервер талд оноо бодож, үр дүнг хадгална. */
  async submit(userId: string, id: string) {
    const at = await this.ownAttempt(userId, id);
    if (at.status === 'completed') return { attemptId: id };
    const v: any = await this.versions.findById(at.versionId).lean();
    const qs: QuestionSnapshot[] = v.snapshot.questions;
    const answers = at.answers ?? {};
    const missing = qs.filter((q) => q.required && isVisible(q, answers) && (answers[q.key] === undefined || answers[q.key] === null || answers[q.key] === '' || (Array.isArray(answers[q.key]) && !answers[q.key].length))).map((q) => q.key);
    if (missing.length) throw bad('INCOMPLETE', `Дараах ${missing.length} асуулт хариулагдаагүй байна.`, missing);

    const key = v.snapshot.strategy ?? at.assessmentKey;
    const careers = key === 'career' ? await this.careers.find({ status: 'published', deletedAt: null }).populate('categoryId', 'slug nameMn').lean() : [];
    const data = await this.loadData(key);
    const skillDocs = await this.skills.find().lean();
    const labels = { ...STATIC_LABELS, skill: { ...STATIC_LABELS.skill, ...Object.fromEntries(skillDocs.map((s) => [s.key, s.nameMn])) } };
    const prior = key === 'city' ? await this.latestCareer(String(at.userId)) : null;
    const payload: any = getStrategy(key).score({ questions: qs, answers, config: v.scoringConfig ?? {}, careers: careers as any, labels, data, prior });
    if (key === 'masters') await this.enrichMasters(payload, answers);

    await this.results.create({ attemptId: at._id, userId: at.userId, assessmentKey: at.assessmentKey, versionId: at.versionId, payload: { ...payload, assessmentVersion: v.version } });
    await this.attempts.updateOne({ _id: id }, { $set: { status: 'completed', completedAt: new Date() } });
    return { attemptId: id };
  }

  /** Хэрэглэгчийн хамгийн сүүлд дууссан карьерын тестийн үр дүн ба хариулт (city тестийн оролт). Байхгүй бол null. */
  private async latestCareer(userId: string) {
    const at: any = await this.attempts.findOne({ userId, assessmentKey: 'career', status: 'completed' }).sort({ completedAt: -1 }).select('_id answers').lean();
    if (!at) return null;
    const r: any = await this.results.findOne({ attemptId: at._id }).select('payload.personality payload.categoryMatches').lean();
    return r ? { payload: r.payload, answers: at.answers ?? {} } : null;
  }

  /**
   * Магистрын зөвлөмж бүрт «хаана, аль сургуульд суралцах вэ»: тухайн чиглэлийн (uniSubject) магистрын түвшинтэй нийтлэгдсэн
   * сургуулиуд. Хэрэглэгчийн сонирхсон улс эхэнд, дараа нь QS (байвал), нэр. Мэдээлэл байхгүй бол хоосон жагсаалт (зохиохгүй).
   * Зөвхөн үнэгүй мэдээлэл (нэр, улс, хот, лого) — төлбөр/шаардлага огт ороогүй.
   */
  private async enrichMasters(payload: any, answers: Record<string, any>) {
    const prefSlugs: string[] = Array.isArray(answers.ms_countries) ? answers.ms_countries : [];
    const prefIds = new Set((prefSlugs.length ? await this.countries.find({ slug: { $in: prefSlugs } }).select('_id').lean() : []).map((c: any) => String(c._id)));
    for (const m of payload.fieldMatches ?? []) {
      if (!m.uniSubject) { m.universities = []; m.countries = []; continue; }
      const items: any[] = await this.unis.find({ status: 'published', deletedAt: null, degreeLevels: 'master', subjects: m.uniSubject }).populate('countryId', 'slug nameMn code').limit(60).lean();
      items.sort((a, b) => Number(prefIds.has(String(b.countryId?._id))) - Number(prefIds.has(String(a.countryId?._id))) || (a.bestQsWorld ?? 1e9) - (b.bestQsWorld ?? 1e9) || String(a.name).localeCompare(String(b.name)));
      m.universities = items.slice(0, 4).map((u) => ({ slug: u.slug, name: u.name, city: u.city ?? null, logoUrl: u.logoUrl ?? null, preferred: prefIds.has(String(u.countryId?._id)), country: u.countryId ? { slug: u.countryId.slug, nameMn: u.countryId.nameMn, code: u.countryId.code } : null }));
      const byCountry = new Map<string, { slug: string; nameMn: string; code: string; count: number; preferred: boolean }>();
      for (const u of items) if (u.countryId) { const k = String(u.countryId._id); const cur = byCountry.get(k) ?? { slug: u.countryId.slug, nameMn: u.countryId.nameMn, code: u.countryId.code, count: 0, preferred: prefIds.has(k) }; cur.count++; byCountry.set(k, cur); }
      m.countries = [...byCountry.values()].sort((a, b) => Number(b.preferred) - Number(a.preferred) || b.count - a.count).slice(0, 5);
    }
  }

  /** Strategy-д шаардлагатай өгөгдлийг (магистрын чиглэл / улсын профайл) ачаална. */
  private async loadData(key: string): Promise<any[] | undefined> {
    if (key === 'masters') return this.masterFields.find({ status: 'published', deletedAt: null }).lean();
    if (key === 'city') return this.countries.find({ status: 'published', deletedAt: null }).select('code matchProfile').lean(); // хотын улсын хэл (хэлний бэлтгэл)
    if (key === 'language') {
      const cs: any[] = await this.countries.find({ status: 'published', deletedAt: null }).lean();
      const counts = await this.unis.aggregate([{ $match: { status: 'published', deletedAt: null, degreeLevels: 'language_prep' } }, { $group: { _id: '$countryId', n: { $sum: 1 } } }]);
      const m = new Map(counts.map((c: any) => [String(c._id), c.n]));
      return cs.map((c) => ({ ...c, languagePrepUniversities: m.get(String(c._id)) ?? 0 }));
    }
    return undefined;
  }

  async history(userId: string) {
    const rows: any[] = await this.attempts.find({ userId, status: 'completed' }).sort({ completedAt: -1 }).limit(100).lean();
    const opened = new Set((await this.ent.list(userId)).filter((s) => s.productKey === 'test_result' && s.targetId).map((s) => String(s.targetId)));
    for (const r of rows) if (FREE_KINDS.has(r.assessmentKey)) opened.add(String(r._id));
    const results: any[] = await this.results.find({ attemptId: { $in: rows.filter((r) => opened.has(String(r._id))).map((r) => r._id) } }).select('attemptId payload.summary payload.hollandCode payload.careerMatches payload.fieldMatches payload.countryMatches payload.dreamCities').lean();
    const map = new Map(results.map((r) => [String(r.attemptId), r.payload]));
    return rows.map((r) => {
      const p: any = map.get(String(r._id));
      return { id: String(r._id), assessmentKey: r.assessmentKey, completedAt: r.completedAt, unlocked: opened.has(String(r._id)), summary: p?.summary ?? null, hollandCode: p?.hollandCode ?? null, top: (p?.careerMatches ?? p?.fieldMatches ?? p?.countryMatches ?? p?.dreamCities ?? []).slice(0, 3).map((m: any) => ({ nameMn: m.nameMn, score: m.score })) };
    });
  }

  async getResult(user: { id: string; role: string }, attemptId: string) {
    if (!Types.ObjectId.isValid(attemptId)) throw new NotFoundException({ code: 'NOT_FOUND', message: 'Үр дүн олдсонгүй.' });
    const r: any = await this.results.findOne({ attemptId }).lean();
    if (!r) throw new NotFoundException({ code: 'NOT_FOUND', message: 'Үр дүн олдсонгүй.' });
    if (String(r.userId) !== user.id && user.role === 'user') throw new ForbiddenException({ code: 'FORBIDDEN', message: 'Танд энэ үр дүнг харах эрх байхгүй.' });
    const at: any = await this.attempts.findById(attemptId).select('completedAt').lean();
    const full: any = { attemptId, assessmentKey: r.assessmentKey, completedAt: at?.completedAt, ...r.payload };
    if ((r.payload?.kind ?? r.assessmentKey) === 'city') await this.gateCityUniversities(String(r.userId), full);
    if (FREE_KINDS.has(r.payload?.kind ?? r.assessmentKey)) return { ...full, locked: false, premium: null }; // зугаа цэнгээний тест: нууц мэдээлэлгүй тул үнэгүй
    const unlocked = user.role !== 'user' || (await this.ent.has(String(r.userId), 'test_result', attemptId));
    if (!unlocked) return { ...lockResult(r.payload?.kind ?? r.assessmentKey, full), premium: null };
    return { ...full, locked: false, premium: premiumForResult(r.payload?.kind ?? r.assessmentKey, full) };
  }

  /**
   * «Суралцах хот» үр дүн дэх «Зорилтот сургуулиуд»: хэрэглэгчийн өгсөн тестээс хамаарна (уншихад тооцно → тест өгсний дараа шууд өөрчлөгдөнө).
   *  - Магистрын тест өгсөн (карьер өгсөн ч, өгөөгүй ч): магистрын түвшний сургуулиуд, магистрын топ чиглэлүүдээр (`uniSubject`).
   *  - Зөвхөн карьерын тест: бакалаврын түвшний сургуулиуд, мэргэжлийн топ ангиллаар.
   *  - Аль ч тест байхгүй: сургууль харуулахгүй, мэргэжил тодорхойлох тест өгөхийг санал болгоно (`mode: 'none'`).
   * Сургууль нь тухайн хотын улсад (мөн хот таарвал эхэнд) бүртгэлтэй, нийтлэгдсэн БОДИТ сургуулиас; байхгүй бол хоосон (зохиохгүй).
   * Кодод бичигдсэн тогтмол (эх сурвалжгүй) жагсаалтыг хэзээ ч хариунд оруулахгүй.
   */
  private async gateCityUniversities(userId: string, full: any) {
    const latest = async (assessmentKey: string) => {
      const at: any = await this.attempts.findOne({ userId, assessmentKey, status: 'completed' }).sort({ completedAt: -1 }).select('_id').lean();
      return at ? ((await this.results.findOne({ attemptId: at._id }).select('payload').lean()) as any)?.payload ?? {} : null;
    };
    const [career, masters] = await Promise.all([latest('career'), latest('masters')]);
    const mode: 'master' | 'bachelor' | 'none' = masters ? 'master' : career ? 'bachelor' : 'none';
    full.universityGate = { career: !!career, masters: !!masters, mode };
    for (const c of full.dreamCities ?? []) {
      c.universities = [];
      if (!career && c.breakdown) delete c.breakdown.career; // карьерын тест (одоо) байхгүй бол «мэргэжлийн салбар» оноог харуулахгүй
    }
    for (const p of full.pathways ?? []) p.steps = (p.steps ?? []).filter((s: string) => !s.startsWith('Зорилтот сургуулиуд:'));
    if (mode === 'none') return;

    const subjects = new Set<string>(mode === 'master'
      ? [...(masters.fieldMatches ?? [])].sort((a: any, b: any) => b.score - a.score).slice(0, 3).map((m: any) => m.uniSubject).filter(Boolean)
      : [...(career.categoryMatches ?? [])].sort((a: any, b: any) => b.score - a.score).slice(0, 3).flatMap((m: any) => CAREER_CATEGORY_TO_UNI_SUBJECTS[m.slug] ?? []));
    if (!subjects.size) return;
    const items: any[] = await this.unis.find({ status: 'published', deletedAt: null, degreeLevels: mode === 'master' ? 'master' : 'bachelor', subjects: { $in: [...subjects] } }).populate('countryId', 'code').limit(300).lean();
    for (const c of full.dreamCities ?? []) {
      c.universities = items
        .filter((u) => u.countryId?.code === c.countryCode)
        .sort((a, b) => Number(b.city === c.nameMn) - Number(a.city === c.nameMn) || (a.bestQsWorld ?? 1e9) - (b.bestQsWorld ?? 1e9) || String(a.name).localeCompare(String(b.name)))
        .slice(0, 4)
        .map((u) => ({ slug: u.slug, name: u.name, city: u.city ?? null, logoUrl: u.logoUrl ?? null }));
    }
  }

  /** Premium: бүх тестийн хамгийн сүүлийн үр дүнгээс нэгдсэн замын зураг */
  async roadmap(userId: string): Promise<{ phases: RoadPhase[]; sources: string[] }> {
    const latest = async (key: string) => {
      const at: any = await this.attempts.findOne({ userId, assessmentKey: key, status: 'completed' }).sort({ completedAt: -1 }).select('_id completedAt').lean();
      if (!at) return null;
      const r: any = await this.results.findOne({ attemptId: at._id }).lean();
      return r ? { kind: key, payload: r.payload } : null;
    };
    const got = (await Promise.all(['career', 'masters', 'language', 'city'].map(latest))).filter(Boolean) as { kind: string; payload: any }[];
    const order = ['now', 'mid', 'later'];
    const titles: Record<string, string> = { now: 'Одоо — эхний саруудад', mid: 'Дунд хугацаанд', later: 'Дараагийн шат' };
    const merged: Record<string, any[]> = { now: [], mid: [], later: [] };
    got.forEach((g) => premiumForResult(g.kind, g.payload).roadmap.forEach((ph) => merged[ph.phase].push(...ph.steps.map((s) => ({ ...s, from: g.kind })))));
    return { phases: order.filter((k) => merged[k].length).map((k) => ({ phase: k, title: titles[k], steps: merged[k] })), sources: got.map((g) => g.kind) };
  }

  /* ── Admin: publish ── */
  async publish(key: string, adminEmail: string) {
    const a = await this.assessments.findOne({ key });
    if (!a) throw new NotFoundException({ code: 'NOT_FOUND', message: 'Тест олдсонгүй.' });
    const qs = await this.questions.find({ assessmentId: a._id, deletedAt: null }).sort({ order: 1 }).lean();
    if (!qs.length) throw bad('EMPTY', 'Асуултгүй тестийг нийтлэх боломжгүй.');
    const snapshot = {
      strategy: a.strategy,
      sections: a.sections,
      questions: qs.map((q: any) => ({ key: q.key, section: q.section, order: q.order, type: q.type, text: q.text, required: q.required, options: q.options, scale: q.scale, scoring: q.scoring, showIf: q.showIf })),
    };
    const version = a.draftVersion;
    const v = await this.versions.create({ assessmentId: a._id, version, snapshot, scoringConfig: a.scoringConfig, publishedAt: new Date(), publishedBy: adminEmail });
    a.activeVersionId = v._id as any;
    a.status = 'published';
    a.draftVersion = version + 1;
    await a.save();
    return { version, versionId: String(v._id), questionCount: qs.length };
  }
}
