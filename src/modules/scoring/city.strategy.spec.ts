import { CityStrategy } from './city.strategy';

const labels = { skill: {}, subject: {}, value: {}, workstyle: {} };
const likert = Object.fromEntries(Array.from({ length: 14 }, (_, i) => [`L${String(i + 5).padStart(2, '0')}`, 4]));
const base = { L01: 'b', L02: 'a', L03: 'a', L04: 'c', ...likert, F01: 'c', F02: 'c', F03: 'c', F04: 'b' };
const prior = {
  payload: { personality: [{ key: 'N', score: 30 }, { key: 'C', score: 80 }], categoryMatches: [{ slug: 'technology', score: 90 }, { slug: 'engineering', score: 80 }] },
  answers: { adapt_change: 5, adapt_confidence: 4 },
};
const run = (answers: any, p: any = prior) => new CityStrategy().score({ questions: [], answers, config: {}, careers: [], labels, prior: p }) as any;

describe('CityStrategy', () => {
  it('топ 3 хот буцааж, оноо буурах дарааллаар эрэмбэлнэ', () => {
    const r = run(base);
    expect(r.dreamCities).toHaveLength(3);
    expect(r.dreamCities[0].score).toBeGreaterThanOrEqual(r.dreamCities[2].score);
    expect(r.allCities.length).toBeGreaterThan(3);
  });

  it('карьерын тест байхгүй бол priorMissing тэмдэглэнэ, алдаа гаргахгүй', () => {
    const r = run(base, null);
    expect(r.readiness.priorMissing).toBe(true);
    expect(r.dreamCities).toHaveLength(3);
  });

  it('PRI бага бол Улаанбаатар урамшуулал авч, бүх замнал Г болно', () => {
    const low = { ...base, L08: 1, L09: 1, L10: 1, L11: 1 };
    const r = run(low, { ...prior, payload: { ...prior.payload, personality: [{ key: 'N', score: 95 }, { key: 'C', score: 20 }] }, answers: { adapt_change: 1, adapt_confidence: 1 } });
    expect(r.readiness.low).toBe(true);
    expect(r.pathways.every((p: any) => p.code === 'D')).toBe(true);
  });

  it('санхүү хүрэлцэж, цагийн ажил шаардлагагүй бол А шууд замнал', () => {
    const r = run({ ...base, F01: 'd', F02: 'd', F03: 'c' });
    expect(r.pathways.some((p: any) => p.code === 'A')).toBe(true);
  });

  it('санхүү хүрэхгүй, голч дүн өндөр бол Б тэтгэлгийн замнал', () => {
    const r = run({ ...base, F01: 'a', F02: 'a', F04: 'a' });
    expect(r.pathways.filter((p: any) => p.cityId !== 'UB').every((p: any) => p.code === 'B' || p.code === 'D')).toBe(true);
    expect(r.pathways.some((p: any) => p.code === 'B')).toBe(true);
  });

  it('төсөв бага, тэтгэлэггүй бол Г дотоодын гарц', () => {
    const r = run({ ...base, F01: 'a', F02: 'a', F03: 'a', F04: 'b' });
    expect(r.pathways.every((p: any) => p.code === 'D')).toBe(true);
  });
});
