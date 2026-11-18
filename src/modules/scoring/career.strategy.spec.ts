import { CareerStrategy, collectDimension, hybridScore, valueConflict } from './career.strategy';
import { buildCareerAssessment, buildCareers, STATIC_LABELS } from '../../seed/content';
import { CareerLike, QuestionSnapshot } from './types';

const { questions } = buildCareerAssessment();
const qs = questions as unknown as QuestionSnapshot[];
const careers: CareerLike[] = buildCareers().map((c, i) => ({ ...c, _id: String(i), categoryId: { slug: c.categorySlug, nameMn: c.categorySlug } } as any));

interface Opts { interest?: Record<string, number>; trait?: number; cog?: number; choice?: 'a' | 'b'; struct?: number; team?: number; adapt?: number; anxious?: number }

/** Хариулт үүсгэнэ: Likert-д өгсөн утга нь НОРМЧИЛСОН (урвуугийн дараах) түвшин байхаар урвуу асуултыг эргүүлнэ */
function answersFor(o: Opts = {}) {
  const a: Record<string, any> = {};
  const put = (q: QuestionSnapshot, v: number) => (a[q.key] = q.scoring?.reverse ? 6 - v : v);
  for (const q of qs) {
    const s = q.scoring;
    if (!s) continue;
    if (q.type === 'single') a[q.key] = o.choice ?? 'a';
    else if (s.dimension === 'interest') put(q, o.interest?.[s.target!] ?? 3);
    else if (s.dimension === 'personality') put(q, s.target === 'N' ? o.anxious ?? o.trait ?? 3 : s.target === 'efficacy' ? o.adapt ?? 3 : o.trait ?? 3);
    else if (q.key === 'adapt_change') put(q, o.adapt ?? 3);
    else if (s.dimension === 'skill') put(q, o.cog ?? 3);
    else if (q.key === 'env_structure') put(q, o.struct ?? 3);
    else if (q.key === 'env_team') put(q, o.team ?? 3);
    else a[q.key] = 3;
  }
  return a;
}
const run = (answers: Record<string, any>, config = {}) => new CareerStrategy().score({ questions: qs, answers, config, careers, labels: STATIC_LABELS }) as any;

describe('Асуултын сан', () => {
  it('60 асуулт: 24 сонирхол, 20 зан төлөв, 8 танин мэдэхүй, 4 албадмал сонголт, 4 бусад', () => {
    expect(qs.length).toBe(60);
    expect(qs.filter((q) => q.scoring?.dimension === 'interest').length).toBe(24);
    expect(qs.filter((q) => q.section === 'personality').length).toBe(20);
    expect(qs.filter((q) => q.section === 'cognitive' && q.type === 'likert').length).toBe(8);
    expect(qs.filter((q) => q.type === 'single').length).toBe(4);
    expect(new Set(qs.map((q) => q.key)).size).toBe(60);
  });

  it('урвуу асуулт: Q27, Q30, Q35, Q36, Q40, Q43', () => {
    const rev = qs.map((q, i) => [i + 1, q.scoring?.reverse] as const).filter(([, r]) => r).map(([n]) => n + 0);
    // seed-ийн дараалал: 24 сонирхол + 20 зан төлөв → Q25 = индекс 24
    expect(rev).toEqual([27, 30, 35, 36, 40, 43]);
  });
});

describe('Алхам 1–2: цэвэрлэгээ ба нормчилсон оноо', () => {
  it('4 асуулттай хэмжигдэхүүн: (нийлбэр − 4) / 16', () => {
    const a = answersFor({ interest: { I: 5, R: 1, A: 3, S: 4, E: 2, C: 5 } });
    const r = collectDimension(qs, a, 'interest');
    expect(r.I).toBe(100); expect(r.R).toBe(0); expect(r.A).toBe(50); expect(r.S).toBe(75);
  });

  it('урвуу асуулт 6 − x: Q30 дээр 5 өгвөл Conscientiousness-д 1 болж орно', () => {
    const q30 = qs.find((q) => q.key === 'per_C2')!;
    const base = answersFor({ trait: 3 });
    const withQ30 = { ...base, [q30.key]: 5 };
    // C: 3 асуулт 3 (50%), Q30 → 1 (0%) → (50+50+50+0)/4 = 37.5
    expect(collectDimension(qs, withQ30, 'personality').C).toBe(37.5);
  });

  it('хоосон хариулт → 3 болж, «Итгэх түвшин буурсан» тэмдэглэгдэнэ', () => {
    const a = answersFor({ interest: { I: 5 } });
    delete a.int_R1; delete a.int_R2;
    const res = run(a);
    expect(res.quality.missingAnswers).toBe(2);
    expect(res.quality.reducedConfidence).toBe(true);
    expect(run(answersFor()).quality.reducedConfidence).toBe(false);
  });
});

describe('Алхам 3: ялгарал ба даруу зан', () => {
  it('RIASEC ялгарахгүй (σ < 0.08) бол салбар дундын зөвлөмж гарна', () => {
    const res = run(answersFor({ interest: { R: 3, I: 3, A: 3, S: 3, E: 3, C: 3 } }));
    expect(res.quality.flatProfile).toBe(true);
    expect(res.notes.some((n: string) => n.includes('салбар дундын'))).toBe(true);
    const spread = run(answersFor({ interest: { R: 5, I: 1, A: 3, S: 1, E: 5, C: 2 } }));
    expect(spread.quality.flatProfile).toBe(false);
  });

  it('бүх хариулт 2–3 бол ipsatization: өөрийн дунджаас өндөр хэмжигдэхүүн тодорно', () => {
    const modest: Record<string, any> = {}; // түүхий хариулт бүгд 2–3 (урвуу асуултыг оролцуулан)
    for (const q of qs) if (q.type === 'likert') modest[q.key] = q.key.startsWith('int_I') ? 3 : 2;
    const res = run(modest);
    expect(res.quality.modestyBias).toBe(true);
    expect(res.hollandCode[0]).toBe('I');
    expect(res.riasec.I).toBeGreaterThan(res.riasec.R);
  });
});

describe('Алхам 4: хосолмол геометр тооцоолол', () => {
  // spec-ийн «Болд» ба «Өгөгдлийн шинжээч» вектор (RIASEC 6, Big Five 4, танин мэдэхүй 4)
  const U = [0.75, 0.94, 0.25, 0.31, 0.5, 0.81, 0.8, 0.88, 0.35, 0.6, 0.88, 0.5, 0.88, 0.75];
  const C = [0.6, 0.95, 0.3, 0.2, 0.4, 0.85, 0.8, 0.85, 0.3, 0.5, 0.95, 0.5, 0.9, 0.85];
  const w = U.map((_, i) => (i === 7 ? 1.5 : 1));

  it('косинус, евклидийн ижилсэл, суурь оноо томьёоны дагуу гарна', () => {
    const h = hybridScore(U, C, w, { cosineWeight: 0.65, euclideanWeight: 0.35 });
    expect(h.cosine).toBeCloseTo(0.9945, 3);
    expect(h.euclid).toBeCloseTo(0.9267, 3);
    expect(h.base).toBeCloseTo(0.65 * h.cosine + 0.35 * h.euclid, 6);
    expect(h.base).toBeGreaterThan(0.96);
  });

  it('ижил вектор → косинус 1, евклид 1; мэргэжилд байхгүй хэмжигдэхүүнийг хасна', () => {
    const same = hybridScore(U, U, w, { cosineWeight: 0.65, euclideanWeight: 0.35 });
    expect(same.cosine).toBeCloseTo(1, 9); expect(same.euclid).toBeCloseTo(1, 9);
    const partial = hybridScore(U, U.map((x, i) => (i > 9 ? null : x)), w, { cosineWeight: 0.65, euclideanWeight: 0.35 });
    expect(partial.euclid).toBeCloseTo(1, 9);
  });

  it('аналитик/техникийн сонирхолтой хэрэглэгчид технологи, инженерийн мэргэжил тэргүүлнэ', () => {
    const res = run(answersFor({ interest: { I: 5, R: 4, C: 4, A: 2, S: 1, E: 2 }, trait: 4, cog: 5 }));
    const top5 = res.careerMatches.map((m: any) => m.slug);
    expect(top5.length).toBe(10);
    expect(top5.some((s: string) => /software|data-|computer|information|network|engineer|scientist|statistic|mathematic/.test(s))).toBe(true);
    expect(res.hollandCode.startsWith('I')).toBe(true);
  });

  it('нийгэм/туслах сонирхолтой хэрэглэгчид багш, сэтгэл зүйч зэрэг тэргүүлнэ', () => {
    const res = run(answersFor({ interest: { S: 5, A: 3, E: 3, I: 2, R: 1, C: 2 }, trait: 4, cog: 3, struct: 4, team: 5 }));
    const top5 = res.careerMatches.map((m: any) => m.slug);
    expect(top5.some((s: string) => /teacher|psycholog|social-work|counselor|nurse|therapist|health|educat/.test(s))).toBe(true);
  });

  it('жагсаалт буурах дарааллаар, оноо 0–100, topN-ээр хязгаарлагдана; үр дүн тогтмол', () => {
    const a = answersFor({ interest: { R: 3, I: 4, A: 2, S: 3, E: 5, C: 1 } });
    const res = run(a, { topN: 3 });
    const scores = res.careerMatches.map((m: any) => m.score);
    expect(scores.length).toBe(3);
    expect([...scores].sort((x: number, y: number) => y - x)).toEqual(scores);
    scores.forEach((s: number) => { expect(s).toBeGreaterThanOrEqual(0); expect(s).toBeLessThanOrEqual(100); });
    expect(run(a)).toEqual(run(a));
  });

  it('Conscientiousness-ийн жин (1.5) үр дүнд нөлөөлнө', () => {
    const a = answersFor({ interest: { I: 5, R: 4, C: 4 }, trait: 4 });
    const heavy = run(a, { conscientiousnessWeight: 3 });
    const base = run(a);
    expect(heavy.careerMatches[0].score).not.toBe(base.careerMatches[0].score);
  });
});

describe('Алхам 5: үнэт зүйл ба ажлын орчин', () => {
  const mk = (values: Record<string, number>): CareerLike => ({ _id: 'x', slug: 'x', nameMn: 'x', nameEn: 'x', profile: { riasec: { R: 15, I: 15, A: 15, S: 15, E: 100, C: 15 }, personality: { O: 50, C: 50, E: 50, A: 50 }, cognitive: { math: 50, verbal: 50, techSpatial: 50, abstract: 50 }, values } });
  const leader = mk({ balance: 35, leadership_role: 85, income: 85, impact: 35 });
  const calm = mk({ balance: 85, leadership_role: 35 });

  it('ажил-амьдралын тэнцвэр сонгосон хэрэглэгчид «өсөлтөд чиглэсэн» мэргэжил зөрчилтэй гэж тэмдэглэгдэнэ', () => {
    expect(valueConflict({ choice_lifestyle: 'a' }, leader)).toBeTruthy();
    expect(valueConflict({ choice_lifestyle: 'b' }, leader)).toBeNull();
    expect(valueConflict({ choice_lifestyle: 'a' }, calm)).toBeNull();
    expect(valueConflict({}, leader)).toBeNull();
  });

  it('мэргэжилд үнэт зүйлийн өгөгдөл байхгүй бол (O*NET) шүүлтүүр ажиллахгүй', () => {
    const noValues = mk({});
    expect(valueConflict({ choice_lifestyle: 'a', choice_security: 'a', choice_motivation: 'a' }, noValues)).toBeNull();
  });

  it('зөрчилтэй мэргэжлийн оноо 15%-иар буурна', () => {
    const answers = { ...answersFor({ interest: { E: 5, C: 1, S: 1, R: 1, I: 1, A: 1 } }), choice_security: 'b', choice_motivation: 'a', choice_lifestyle: 'b' };
    const run1 = (a: Record<string, any>, cs: CareerLike[]) => new CareerStrategy().score({ questions: qs, answers: a, config: { topN: 5 }, careers: cs, labels: STATIC_LABELS }) as any;
    const m1 = run1(answers, [leader]).careerMatches[0];
    const m2 = run1({ ...answers, choice_lifestyle: 'a' }, [leader]).careerMatches[0];
    expect(m1.breakdown.valuePenalty).toBe(false);
    expect(m2.breakdown.valuePenalty).toBe(true);
    expect(m2.score).toBeCloseTo(m1.score * 0.85, 0);
  });

  it('Q57 + Q58 → ажлын орчны чиглэл', () => {
    expect(run(answersFor({ struct: 5, team: 5 })).environment.label).toContain('Томоохон');
    expect(run(answersFor({ struct: 1, team: 1 })).environment.label).toContain('Бие даан');
    expect(run(answersFor({ struct: 5, team: 1 })).environment.label).toContain('бие даасан мэргэшсэн');
    expect(run(answersFor({ struct: 1, team: 5 })).environment.label).toContain('стартап');
  });
});

describe('Алхам 6: зөвлөхийн тэмдэглэгээ', () => {
  it('Q41–Q44 дундаж ≥ 3.75 → түгшүүрийн тэмдэглэгээ; мэргэжил хасагдахгүй', () => {
    const calm = run(answersFor({ anxious: 2 }));
    const anxious = run(answersFor({ anxious: 4 }));
    expect(calm.counselorFlags.some((f: any) => f.key === 'anxiety')).toBe(false);
    expect(anxious.counselorFlags.some((f: any) => f.key === 'anxiety')).toBe(true);
    expect(anxious.careerMatches.map((m: any) => m.slug)).toEqual(run(answersFor({ anxious: 2 })).careerMatches.map((m: any) => m.slug));
  });

  it('Q59–Q60 дундаж ≤ 2.5 → шийдвэр гаргалтын гацаа', () => {
    expect(run(answersFor({ adapt: 2 })).counselorFlags.some((f: any) => f.key === 'indecision')).toBe(true);
    expect(run(answersFor({ adapt: 3 })).counselorFlags.some((f: any) => f.key === 'indecision')).toBe(false);
  });

  it('зан төлөвийн тэмдэглэгээ мэргэжлийн тохирлын N, efficacy-г өөрчлөхгүй', () => {
    const a = run(answersFor({ interest: { I: 5 }, anxious: 1, adapt: 5 }));
    const b = run(answersFor({ interest: { I: 5 }, anxious: 5, adapt: 1 }));
    expect(a.careerMatches.map((m: any) => m.score)).toEqual(b.careerMatches.map((m: any) => m.score));
  });
});

describe('Салбарын нийцэл', () => {
  const res = run(answersFor({ interest: { I: 5, R: 4, C: 4, A: 2, S: 1, E: 2 }, trait: 4, cog: 5 }));

  it('11 салбар, нийцлийн буурах дарааллаар, хувь 0–100', () => {
    const cm = res.categoryMatches;
    expect(cm.length).toBe(11);
    expect(new Set(cm.map((c: any) => c.slug)).size).toBe(11);
    expect([...cm.map((c: any) => c.score)].sort((a: number, b: number) => b - a)).toEqual(cm.map((c: any) => c.score));
    cm.forEach((c: any) => { expect(c.score).toBeGreaterThanOrEqual(0); expect(c.score).toBeLessThanOrEqual(100); expect(c.careerCount).toBeGreaterThan(0); });
    expect(cm.reduce((s: number, c: any) => s + c.careerCount, 0)).toBe(500);
  });

  it('харьцангуй хувь: бүх мэргэжлийн хамгийн их нь 100%, салбарын үнэмлэхүй хувь нэг дор хадгалагдана', () => {
    const allCareers = res.categoryMatches.flatMap((c: any) => c.careers);
    expect(Math.max(...allCareers.map((x: any) => x.score))).toBe(100);
    for (const c of res.categoryMatches) {
      expect(c.absoluteScore).toBeGreaterThanOrEqual(0);
      expect(c.absoluteScore).toBeLessThanOrEqual(100);
      c.careers.forEach((x: any) => expect(x.absoluteScore).toBeGreaterThanOrEqual(0));
    }
    // харьцангуй хувь үнэмлэхүйгээс илүү тархалттай (шахагдаагүй)
    const spread = (xs: number[]) => Math.max(...xs) - Math.min(...xs);
    expect(spread(res.categoryMatches.map((c: any) => c.score))).toBeGreaterThan(spread(res.categoryMatches.map((c: any) => c.absoluteScore)));
  });

  it('салбар доторх мэргэжлүүд буурах дарааллаар; салбарын оноо = хамгийн тохирох 3 мэргэжлийн дундаж', () => {
    for (const c of res.categoryMatches) {
      const sc = c.careers.map((x: any) => x.score);
      expect([...sc].sort((a: number, b: number) => b - a)).toEqual(sc);
      const k = Math.min(3, c.careers.length);
      const mean = sc.slice(0, k).reduce((a: number, b: number) => a + b, 0) / k;
      expect(Math.abs(c.score - mean)).toBeLessThan(0.2);
    }
  });

  it('техникийн профилд технологи/инженерчлэл/шинжлэх ухаан дээд салбарт, Топ мэргэжил нь тэр салбарт багтана', () => {
    const topCats = res.categoryMatches.slice(0, 3).map((c: any) => c.slug);
    expect(topCats.some((s: string) => ['technology', 'engineering', 'science'].includes(s))).toBe(true);
    const top1 = res.careerMatches[0];
    const cat = res.categoryMatches.find((c: any) => c.careers.some((x: any) => x.slug === top1.slug));
    expect(cat).toBeTruthy();
  });
});

describe('Тохирохгүй мэргэжлүүд', () => {
  const res = run(answersFor({ interest: { I: 5, R: 4, C: 4, A: 2, S: 1, E: 2 }, trait: 4, cog: 5 }));

  it('хамгийн бага нийцэлтэй topN мэргэжил, өсөх дарааллаар, Топ-оос тусдаа, шалтгаантай', () => {
    const lm = res.leastMatches;
    expect(lm.length).toBe(5);
    expect([...lm.map((m: any) => m.score)].sort((a: number, b: number) => a - b)).toEqual(lm.map((m: any) => m.score));
    const topSlugs = new Set(res.careerMatches.map((m: any) => m.slug));
    lm.forEach((m: any) => { expect(topSlugs.has(m.slug)).toBe(false); expect(m.why.length).toBeGreaterThan(0); });
    expect(lm[0].score).toBeLessThan(res.careerMatches[res.careerMatches.length - 1].score);
  });

  it('техникийн профилд нийгмийн/урлагийн мэргэжил тохирохгүй жагсаалтад багтана (шалтгаан: сонирхлын зөрүү)', () => {
    const text = res.leastMatches.map((m: any) => m.why.join(' ')).join(' ');
    expect(text).toMatch(/өндөр|доогуур/);
  });
});

describe('Алхам 7: тайлан', () => {
  it('Топ 10, тайлбар, Holland код, давуу тал, disclaimer гарна', () => {
    const res = run(answersFor({ interest: { I: 5, R: 4, C: 4, A: 2, S: 1, E: 2 }, trait: 5, cog: 5 }));
    expect(res.careerMatches.length).toBe(10);
    expect(res.careerMatches[0].why[0]).toContain('нийцэж байна');
    expect(res.hollandCode.length).toBe(3);
    expect(res.strengths.length).toBeGreaterThan(0);
    expect(res.cognitive.length).toBe(4);
    expect(res.personality.map((p: any) => p.key)).toEqual(['O', 'C', 'E', 'A', 'N', 'efficacy']);
    expect(res.disclaimer).toMatch(/баталгаа биш/);
    expect(res.selfReportNote).toBeTruthy();
  });

  it('албадмал сонголт эсрэг чиглэлд оноо өгнө', () => {
    const a = collectDimension(qs, answersFor({ choice: 'a' }), 'value');
    const b = collectDimension(qs, answersFor({ choice: 'b' }), 'value');
    expect(a.stability).toBe(100); expect(b.stability).toBe(0);
    expect(a.income).toBe(100); expect(b.impact).toBe(100);
    expect(collectDimension(qs, answersFor({ choice: 'b' }), 'workstyle').risk).toBe(100);
  });

  it('500 мэргэжил, O*NET код, 14 хэмжигдэхүүн бүгд 0–100 хооронд, Монгол нэр/тайлбартай', () => {
    expect(careers.length).toBe(500);
    expect(new Set(careers.map((c) => c.slug)).size).toBe(500);
    for (const c of careers as any[]) {
      expect(c.onetCode).toMatch(/^\d\d-\d{4}\.\d\d$/);
      expect(c.nameMn.length).toBeGreaterThan(2); expect(c.description.length).toBeGreaterThan(10);
      expect(c.jobZone).toBeGreaterThanOrEqual(3);
      for (const v of [...Object.values(c.profile.riasec), ...Object.values(c.profile.personality), ...Object.values(c.profile.cognitive)] as number[]) {
        expect(v).toBeGreaterThanOrEqual(0); expect(v).toBeLessThanOrEqual(100);
      }
      expect(Object.keys(c.profile.riasec).length).toBe(6);
      expect(Object.keys(c.profile.personality).length).toBe(4);
      expect(Object.keys(c.profile.cognitive).length).toBe(4);
    }
  });

  it('эх сурвалжийн мэдээлэл (O*NET, CC BY 4.0) мэргэжил бүрт байна', () => {
    for (const c of careers as any[]) {
      expect(c.source.sourceName).toContain('O*NET');
      expect(c.source.sourceUrl).toBe('https://www.onetcenter.org/database.html');
    }
  });
});
