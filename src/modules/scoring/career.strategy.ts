import { CareerLike, QuestionSnapshot, ScoringContext, ScoringStrategy } from './types';

export const RIASEC_KEYS = ['R', 'I', 'A', 'S', 'E', 'C'] as const;
export const RIASEC_NAMES: Record<string, string> = {
  R: 'Практик, техникийн (Realistic)', I: 'Судалгаа, шинжилгээний (Investigative)', A: 'Бүтээлч, урлагийн (Artistic)',
  S: 'Хүмүүст туслах, харилцах (Social)', E: 'Бизнес, манлайллын (Enterprising)', C: 'Зохион байгуулалт, өгөгдлийн (Conventional)',
};
const RIASEC_SHORT: Record<string, string> = { R: 'Практик', I: 'Судлаач', A: 'Бүтээлч', S: 'Нийгмийн', E: 'Бизнес', C: 'Зохион байгуулагч' };

/** Зан төлөвийн (Big Five) нэр. N болон efficacy нь мэргэжлийн тохирлын вектор биш, зөвхөн профайл/зөвлөхийн тэмдэглэгээнд. */
export const PERSONALITY_NAMES: Record<string, string> = {
  O: 'Шинэ зүйлд нээлттэй байдал', C: 'Тууштай, нямбай зан чанар', E: 'Нийтэч, гадагшаа чиглэсэн байдал',
  A: 'Эв найртай, бусдыг ойлгох байдал', N: 'Сэтгэл хөдлөлийн мэдрэмтгий байдал', efficacy: 'Мэргэжил сонгох өөртөө итгэх итгэл',
};

export const DEFAULT_CAREER_CONFIG = {
  cosineWeight: 0.65,
  euclideanWeight: 0.35,
  /** Conscientiousness-ийн жин (бусад хэмжигдэхүүн 1.0) */
  conscientiousnessWeight: 1.5,
  /** Үнэт зүйл мэргэжлийн бодит байдалтай зөрчилдвөл суурь оноог үржүүлэх коэффициент */
  valuePenalty: 0.85,
  poolSize: 20,
  /** Салбарын нийцэл = салбарын хамгийн тохирох энэ тооны мэргэжлийн дундаж; салбар бүрт харуулах мэргэжлийн тоо */
  categoryTopK: 3,
  categoryCareerLimit: 8,
  topN: 10,
  /** Хамгийн тохирохгүй мэргэжлийн тоо */
  leastN: 5,
  /** RIASEC-ийн стандарт хазайлт энэ хэмжээнээс бага бол сонирхол ялгараагүй */
  flatSigma: 0.08,
  /** Q41–Q44 дундаж энэ хэмжээнээс өндөр бол түгшүүрийн тэмдэглэгээ */
  anxietyMean: 3.75,
  /** Q59–Q60 дундаж энэ хэмжээнээс бага бол шийдвэр гаргалтын гацаа */
  indecisionMean: 2.5,
  strengthThreshold: 70,
  developmentThreshold: 50,
};

export const DISCLAIMER =
  'Энэ үр дүн нь таны өөрийн үнэлгээнд суурилсан чиглүүлэх зөвлөмж болохоос сэтгэл зүйн оношилгоо, карьерын амжилтын баталгаа биш юм. Шийдвэр гаргахдаа багш, мэргэжилтэн, бодит мэдээлэлтэй хослуулан ашиглана уу.';

/* ───────── 14 хэмжээст вектор: 6 RIASEC + 4 Big Five + 4 танин мэдэхүй ───────── */
type Group = 'riasec' | 'big5' | 'cog';
interface VecDim { id: string; group: Group; key: string; label: string }
const COG_LABELS: Record<string, string> = { math: 'Математик сэтгэлгээ', verbal: 'Хэл, үг хэлний чадвар', techSpatial: 'Техник, орон зайн сэтгэлгээ', abstract: 'Хийсвэр, онолын сэтгэлгээ' };
export const DIMS: VecDim[] = [
  ...RIASEC_KEYS.map((k) => ({ id: `riasec.${k}`, group: 'riasec' as const, key: k, label: RIASEC_SHORT[k] })),
  ...(['O', 'C', 'E', 'A'] as const).map((k) => ({ id: `big5.${k}`, group: 'big5' as const, key: k, label: PERSONALITY_NAMES[k] })),
  ...Object.entries(COG_LABELS).map(([k, label]) => ({ id: `cog.${k}`, group: 'cog' as const, key: k, label })),
];

const round = (n: number) => Math.round(n);
const pct1 = (n: number) => Math.round(n * 1000) / 10;
const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

/** Хариултыг 0–100 болгож нормчилно (урвуу асуулт: 6 − x буюу 100 − pct). Min-Max: (нийлбэр − min) / (max − min) */
function normalizeValue(q: QuestionSnapshot, v: any): number | null {
  const min = q.scale?.min ?? 1;
  const max = q.scale?.max ?? 5;
  const n = Number(v);
  if (!isFinite(n) || max === min) return null;
  let pct = ((Math.max(min, Math.min(max, n)) - min) / (max - min)) * 100;
  if (q.scoring?.reverse) pct = 100 - pct;
  return pct;
}

/** dimension+target бүрээр жинлэсэн дундаж (0–100). Likert болон албадмал сонголт (single, `dimension:target` жинтэй) */
export function collectDimension(questions: QuestionSnapshot[], answers: Record<string, any>, dimension: string): Record<string, number> {
  const acc: Record<string, { sum: number; w: number }> = {};
  for (const q of questions) {
    if (q.scoring?.dimension !== dimension || !q.scoring.target) continue;
    if (q.type !== 'likert' && q.type !== 'rating' && q.type !== 'number') continue;
    const a = answers[q.key];
    if (a === undefined || a === null || a === '') continue;
    const pct = normalizeValue(q, a);
    if (pct === null) continue;
    const w = q.scoring.weight ?? 1;
    (acc[q.scoring.target] ??= { sum: 0, w: 0 });
    acc[q.scoring.target].sum += pct * w;
    acc[q.scoring.target].w += w;
  }
  for (const q of questions) {
    if (q.type !== 'single') continue;
    const picked = q.options?.find((o) => o.key === answers[q.key]);
    for (const [k, pct] of Object.entries(picked?.weights ?? {})) {
      const [dim, target] = k.split(':');
      if (dim !== dimension || !target) continue;
      (acc[target] ??= { sum: 0, w: 0 });
      acc[target].sum += pct;
      acc[target].w += 1;
    }
  }
  return Object.fromEntries(Object.entries(acc).map(([k, v]) => [k, v.sum / v.w]));
}

/** Алхам 1: хоосон Likert хариултыг дундаж (3)-аар орлуулж, тоог тэмдэглэнэ */
function prepareAnswers(questions: QuestionSnapshot[], answers: Record<string, any>) {
  const a = { ...answers };
  let missing = 0;
  for (const q of questions) {
    const v = a[q.key];
    const empty = v === undefined || v === null || v === '';
    if (!empty) continue;
    if (q.type === 'likert') { a[q.key] = 3; missing++; }
    else if (q.type === 'single') missing++;
  }
  return { a, missing };
}

/** Likert хариултын 1–5 түүхий дундаж (урвуу асуултыг эргүүлсэн) */
function rawMean(questions: QuestionSnapshot[], answers: Record<string, any>, pick: (q: QuestionSnapshot) => boolean): number | null {
  const vals = questions.filter((q) => q.type === 'likert' && pick(q) && answers[q.key] != null).map((q) => (q.scoring?.reverse ? 6 - Number(answers[q.key]) : Number(answers[q.key])));
  return vals.length ? vals.reduce((s, x) => s + x, 0) / vals.length : null;
}

export function careerVector(c: CareerLike): (number | null)[] {
  return DIMS.map((d) => {
    const raw = d.group === 'riasec' ? c.profile.riasec?.[d.key] ?? 15 : d.group === 'big5' ? c.profile.personality?.[d.key] : c.profile.cognitive?.[d.key];
    return raw === undefined ? null : clamp01(raw / 100);
  });
}

/** Алхам 4: жинлэсэн косинус + евклидийн зайн ижилслийн хосолмол оноо. Мэргэжилд байхгүй хэмжигдэхүүнийг хоёр талаас нь хасна. */
export function hybridScore(u: number[], c: (number | null)[], w: number[], cfg: { cosineWeight: number; euclideanWeight: number }) {
  let dot = 0, nu = 0, nc = 0, d2 = 0, wsum = 0;
  for (let i = 0; i < u.length; i++) {
    const ci = c[i];
    if (ci === null) continue;
    dot += w[i] * u[i] * ci; nu += w[i] * u[i] * u[i]; nc += w[i] * ci * ci;
    d2 += w[i] * (u[i] - ci) ** 2; wsum += w[i];
  }
  const cosine = nu > 0 && nc > 0 ? dot / (Math.sqrt(nu) * Math.sqrt(nc)) : 0;
  const euclid = wsum > 0 ? 1 - Math.sqrt(d2) / Math.sqrt(wsum) : 0;
  return { cosine, euclid, base: cfg.cosineWeight * cosine + cfg.euclideanWeight * euclid };
}

const stdev = (xs: number[]) => { const m = xs.reduce((s, x) => s + x, 0) / xs.length; return Math.sqrt(xs.reduce((s, x) => s + (x - m) ** 2, 0) / xs.length); };

/** Алхам 5: Q53/Q54/Q56 сонголт мэргэжлийн бодит байдалтай эрс зөрчилдөж байгаа эсэх (мэргэжлийн values параметрээр) */
export function valueConflict(answers: Record<string, any>, c: CareerLike): string | null {
  const v = c.profile.values ?? {};
  const poles: Record<string, { a: [string, string]; b: [string, string]; ab: [string, string] }> = {
    choice_security: { a: ['stability', 'independence'], b: ['independence', 'stability'], ab: ['Тогтвортой ажил', 'бие даасан, эрсдэлтэй ажил'] },
    choice_motivation: { a: ['income', 'impact'], b: ['impact', 'income'], ab: ['Өндөр орлого', 'нийгэмд үзүүлэх нөлөө'] },
    choice_lifestyle: { a: ['balance', 'leadership_role'], b: ['leadership_role', 'balance'], ab: ['Ажил амьдралын тэнцвэр', 'албан тушаалын өсөлт, урт цагийн ажил'] },
  };
  for (const [key, p] of Object.entries(poles)) {
    const pick = answers[key];
    if (pick !== 'a' && pick !== 'b') continue;
    const [want, other] = pick === 'a' ? p.a : p.b;
    if (v[want] === undefined || v[other] === undefined) continue; // мэргэжилд үнэт зүйлийн өгөгдөл байхгүй бол шүүхгүй
    if (v[other] >= 70 && v[want] < 50) {
      const [wl, ol] = pick === 'a' ? p.ab : [p.ab[1], p.ab[0]];
      return `Та «${wl}»-ийг илүүд үздэг бол энэ мэргэжил голдуу «${ol}»-д чиглэсэн байдаг.`;
    }
  }
  return null;
}

function environmentLabel(structure: number | null, team: number | null): string | null {
  if (structure === null || team === null) return null;
  const s = structure >= 0.5, t = team >= 0.5;
  if (s && t) return 'Томоохон, тодорхой бүтэцтэй байгууллагын баг';
  if (s && !t) return 'Тодорхой бүтэцтэй орчинд бие даасан мэргэшсэн үүрэг';
  if (!s && t) return 'Уян хатан, хамтын багаар ажилладаг орчин (жижиг баг, стартап)';
  return 'Бие даан, уян хатан ажиллах орчин (чөлөөт ажил, жижиг компани)';
}

export class CareerStrategy implements ScoringStrategy {
  key = 'career';

  score(ctx: ScoringContext) {
    const cfg = { ...DEFAULT_CAREER_CONFIG, ...ctx.config };
    const { a: answers, missing } = prepareAnswers(ctx.questions, ctx.answers);

    // Алхам 2: 0–1 хооронд нормчилсон хэмжигдэхүүнүүд
    const interest = collectDimension(ctx.questions, answers, 'interest');
    const personality = collectDimension(ctx.questions, answers, 'personality');
    const skills = collectDimension(ctx.questions, answers, 'skill');
    const workStyle = collectDimension(ctx.questions, answers, 'workstyle');
    const userRaw = DIMS.map((d) => ((d.group === 'riasec' ? interest[d.key] : d.group === 'big5' ? personality[d.key] : skills[d.key]) ?? 0) / 100);
    const hasData = DIMS.some((d) => (d.group === 'riasec' ? interest[d.key] : d.group === 'big5' ? personality[d.key] : skills[d.key]) !== undefined);

    // Алхам 3: ялгарал ба даруу зангийн хазайлт
    const riasecU = userRaw.slice(0, 6);
    const sigma = stdev(riasecU);
    const flatProfile = hasData && sigma < cfg.flatSigma;
    const given = ctx.questions.filter((q) => q.type === 'likert' && ctx.answers[q.key] != null && ctx.answers[q.key] !== '').map((q) => Number(ctx.answers[q.key]));
    const modestyBias = given.length >= 50 && given.every((x) => x >= 2 && x <= 3);
    let U = userRaw;
    if (modestyBias) { // Ipsatization: өөрийнх нь дунджаас харьцангуй өндөр хэмжигдэхүүнийг тодруулж, хэлбэрийг хадгална
      const mean = U.reduce((s, x) => s + x, 0) / U.length;
      U = U.map((x) => clamp01(0.5 + 2 * (x - mean)));
    }
    const w = DIMS.map((d) => (d.id === 'big5.C' ? cfg.conscientiousnessWeight : 1));

    // Бүх мэргэжлийн суурь оноо; Алхам 5-ын шүүлтүүрийг бүх мэргэжилд хэрэглэнэ (салбарын нийцэлд ашиглана)
    const all = ctx.careers.map((c) => {
      const h = hybridScore(U, careerVector(c), w, cfg);
      const conflict = valueConflict(answers, c);
      return { c, h, conflict, final: conflict ? h.base * cfg.valuePenalty : h.base };
    });
    // Топ мэргэжил: суурь оноогоор эхний poolSize → үнэт зүйлийн шүүлтүүр → topN
    const scored = [...all].sort((x, y) => y.h.base - x.h.base).slice(0, cfg.poolSize).sort((x, y) => y.final - x.final).slice(0, cfg.topN);

    // Салбарын нийцэл. Үнэмлэхүй оноо (косинус + евклид) бүх мэргэжилд 78–92% орчим шахагддаг тул салбар, салбар доторх
    // мэргэжлийг харуулахдаа энэ хэрэглэгчийн бүх мэргэжлийн хамгийн бага/их оноонд харьцуулсан харьцангуй (0–100) хувиар үзүүлнэ.
    const finals = all.map((x) => x.final);
    const lo = Math.min(...finals), hi = Math.max(...finals);
    const rel = (f: number) => (hi > lo ? ((f - lo) / (hi - lo)) * 100 : 50);
    const byCategory = new Map<string, { slug: string; nameMn: string; items: typeof all }>();
    for (const x of all) {
      const cat = x.c.categoryId;
      if (!cat?.slug) continue;
      if (!byCategory.has(cat.slug)) byCategory.set(cat.slug, { slug: cat.slug, nameMn: cat.nameMn, items: [] });
      byCategory.get(cat.slug)!.items.push(x);
    }
    const mean = (xs: number[]) => xs.reduce((sum, v) => sum + v, 0) / xs.length;
    const categoryMatches = [...byCategory.values()].map((g) => {
      const items = g.items.sort((x, y) => y.final - x.final);
      const top = items.slice(0, cfg.categoryTopK);
      return {
        slug: g.slug, nameMn: g.nameMn, careerCount: items.length,
        score: pct1(mean(top.map((x) => rel(x.final))) / 100), absoluteScore: pct1(mean(top.map((x) => x.final))),
        careers: items.slice(0, cfg.categoryCareerLimit).map((x) => ({ slug: x.c.slug, nameMn: x.c.nameMn, nameEn: x.c.nameEn, score: pct1(rel(x.final) / 100), absoluteScore: pct1(x.final) })),
      };
    }).sort((x, y) => y.score - x.score);

    const sortedInterest = RIASEC_KEYS.filter((k) => interest[k] !== undefined).sort((x, y) => U[RIASEC_KEYS.indexOf(y)] - U[RIASEC_KEYS.indexOf(x)]);
    const hollandCode = sortedInterest.slice(0, 3).join('');
    const top2 = sortedInterest.slice(0, 2);

    const structure = workStyle.structure === undefined ? null : workStyle.structure / 100;
    const team = workStyle.teamwork === undefined ? null : workStyle.teamwork / 100;
    const envLabel = environmentLabel(structure, team);

    const careerMatches = scored.map(({ c, h, conflict, final }) => {
      const cv = careerVector(c);
      // Тайлбар: хэрэглэгч ба мэргэжил хоёулаа өндөр (≥0.6) хэмжигдэхүүнүүд
      const both = DIMS.map((d, i) => ({ d, u: U[i], c: cv[i] })).filter((x) => x.c !== null && x.c >= 0.6 && x.u >= 0.6).sort((x, y) => y.u - x.u);
      const parts = [
        ...both.filter((x) => x.d.group === 'riasec').slice(0, 2),
        ...both.filter((x) => x.d.group !== 'riasec').slice(0, 2),
      ].map((x) => `${x.d.label} (${round(x.u * 100)}%)`);
      const why = [parts.length
        ? `Таны ${parts.join(', ')} нь «${c.nameMn}» мэргэжлийн шаардлагатай ${pct1(final)}% нийцэж байна.`
        : `Хариултуудын нийт хэлбэрээр «${c.nameMn}» ${pct1(final)}% нийцсэн боловч давхцал харьцангуй сул байна.`];
      if (conflict) why.push(conflict + ' Тиймээс нийцлийн оноог бага зэрэг бууруулсан.');
      return {
        careerId: String(c._id), slug: c.slug, nameMn: c.nameMn, nameEn: c.nameEn, score: pct1(final),
        breakdown: { cosine: pct1(h.cosine), euclidean: pct1(h.euclid), valuePenalty: Boolean(conflict) },
        why,
        environment: envLabel, jobZone: c.jobZone ?? null,
        subjects: (c.profile.subjects ?? c.schoolSubjects ?? []).map((k) => ({ key: k, name: ctx.labels.subject?.[k] ?? k })),
        universityMajors: c.universityMajors ?? [], recommendedCountries: c.recommendedCountries ?? [],
      };
    });

    // Хамгийн тохирохгүй мэргэжлүүд: нийцлийн хамгийн бага topN, юугаараа зөрж байгааг тайлбарлана
    const leastMatches = [...all].sort((x, y) => x.final - y.final).slice(0, cfg.leastN).map(({ c, h, conflict, final }) => {
      const cv = careerVector(c);
      const gaps = DIMS.map((d, i) => ({ d, u: U[i], c: cv[i] })).filter((x) => x.c !== null)
        .map((x) => ({ ...x, diff: x.u - (x.c as number) })).filter((x) => Math.abs(x.diff) >= 0.25)
        .sort((x, y) => Math.abs(y.diff) - Math.abs(x.diff)).slice(0, 3);
      const why = gaps.map((g) => `Таны ${g.d.label} (${round(g.u * 100)}%) нь «${c.nameMn}» мэргэжлийн шаардлагаас (${round((g.c as number) * 100)}%) ${g.diff > 0 ? 'өндөр' : 'доогуур'} байна.`);
      if (!why.length) why.push(`Хариултуудын нийт хэлбэрээр «${c.nameMn}» бусад мэргэжлээс бага нийцэж байна.`);
      if (conflict) why.push(conflict);
      return {
        careerId: String(c._id), slug: c.slug, nameMn: c.nameMn, nameEn: c.nameEn, score: pct1(final),
        breakdown: { cosine: pct1(h.cosine), euclidean: pct1(h.euclid), valuePenalty: Boolean(conflict) },
        why, jobZone: c.jobZone ?? null,
      };
    });

    const traitList = DIMS.filter((d) => d.group !== 'riasec').map((d, i) => ({ key: d.id, name: d.label, score: round(U[6 + i] * 100) }));
    const strengths = traitList.filter((t) => t.score >= cfg.strengthThreshold).sort((x, y) => y.score - x.score).slice(0, 6);
    const improvements = traitList.filter((t) => (t.key === 'big5.C' || t.key.startsWith('cog.')) && t.score < cfg.developmentThreshold).sort((x, y) => x.score - y.score).slice(0, 5);

    // Алхам 6: зөвлөхийн тэмдэглэгээ (мэргэжлийн тохирол руу ордоггүй)
    const nMean = rawMean(ctx.questions, answers, (q) => q.scoring?.dimension === 'personality' && q.scoring.target === 'N');
    const readyMean = rawMean(ctx.questions, answers, (q) => q.key === 'adapt_change' || q.key === 'adapt_confidence');
    const counselorFlags: { key: string; text: string }[] = [];
    if (nMean !== null && nMean >= cfg.anxietyMean) counselorFlags.push({ key: 'anxiety', text: 'Шалгалтын болон мэргэжил сонголтын түгшүүр өндөр байгаа тул стресс менежментийн дэмжлэг шаардлагатай.' });
    if (readyMean !== null && readyMean <= cfg.indecisionMean) counselorFlags.push({ key: 'indecision', text: 'Шийдвэр гаргалтын гацаанд орсон байж болзошгүй тул сургуулийн сэтгэл зүйч, чиглүүлэгчтэй ганцаарчилсан зөвлөгөө авахыг санал болгоно.' });

    const notes: string[] = [];
    if (flatProfile) notes.push('Таны сонирхол маш өргөн хүрээтэй байгаа тул салбар дундын (interdisciplinary) мэргэжлүүдийг сонирхож үзээрэй.');
    if (modestyBias) notes.push('Таны хариулт бүгд 2–3 хооронд байсан тул өөрийн дунджаас харьцангуй өндөр хэмжигдэхүүнийг тодруулж тооцсон.');
    const reducedConfidence = missing > 0;

    const summary = top2.length
      ? `Таны хариултаас харахад та ${top2.map((k) => RIASEC_SHORT[k]).join(' болон ')} чиглэлд илүү сонирхолтой байна.${strengths.length ? ` Давуу тал: ${strengths.slice(0, 3).map((s) => s.name).join(', ')}.` : ''}`
      : 'Хариултууд хангалтгүй тул сонирхлын профайл гаргах боломжгүй байна.';

    return {
      kind: 'career',
      summary,
      hollandCode,
      riasec: Object.fromEntries(RIASEC_KEYS.map((k) => [k, interest[k] === undefined ? null : round(U[RIASEC_KEYS.indexOf(k)] * 100)])),
      riasecNames: RIASEC_NAMES,
      personality: [...(['O', 'C', 'E', 'A'] as const).map((k) => ({ key: k, name: PERSONALITY_NAMES[k], score: round(U[6 + ['O', 'C', 'E', 'A'].indexOf(k)] * 100) })),
        ...(['N', 'efficacy'] as const).filter((k) => personality[k] !== undefined).map((k) => ({ key: k, name: PERSONALITY_NAMES[k], score: round(personality[k]) }))],
      cognitive: traitList.filter((t) => t.key.startsWith('cog.')),
      strengths, improvements,
      environment: envLabel ? { label: envLabel, structure: structure === null ? null : round(structure * 100), team: team === null ? null : round(team * 100) } : null,
      counselorFlags,
      notes,
      quality: { missingAnswers: missing, reducedConfidence, flatProfile, modestyBias, riasecSigma: Math.round(sigma * 1000) / 1000 },
      categoryMatches,
      careerMatches,
      leastMatches,
      method: {
        weights: { cosine: cfg.cosineWeight, euclidean: cfg.euclideanWeight, conscientiousness: cfg.conscientiousnessWeight, valuePenalty: cfg.valuePenalty },
        note: 'Нийцлийн хувь = 65% профайлын хэлбэр (косинус) + 35% чадварын далайц (евклидийн зай). Үнэт зүйл мэргэжлийн бодит байдалтай эрс зөрчилдвөл 15% бууруулна. Салбарын нийцэл = салбарын хамгийн тохирох 3 мэргэжлийн харьцангуй оноон дундаж (бүх мэргэжлийн хамгийн бага = 0%, хамгийн их = 100%); үнэмлэхүй хувийг хажууд нь харуулна. Мэргэжлийн вектор нь редакцийн параметр бөгөөд мэргэжилтнээр баталгаажуулах шаардлагатай.',
      },
      selfReportNote: 'Бүх оноо нь таны өөрийн үнэлгээ бөгөөд бодитоор хэмжсэн чадвар биш.',
      disclaimer: DISCLAIMER,
    };
  }
}
