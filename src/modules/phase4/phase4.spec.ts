import { checkEligibility } from './eligibility';
import { parseUniversityRow } from './import';
import { numbersGrounded, resultFacts, universityFacts } from './ai.facts';
import { CRITERIA, DEFAULT_METHODOLOGY, rankFuture } from './future';

describe('checkEligibility', () => {
  const reqs = [{ kind: 'IELTS', minScore: 6.5 }, { kind: 'GPA', minScore: 3.0 }, { kind: 'Motivation Letter' }];

  it('бүгд хангавал (бичиг баримт тэмдэглэсэн) → satisfied', () => {
    const r = checkEligibility(reqs, { ielts: 7, gpa: 3.4, documents: ['motivation letter'] });
    expect(r.overall).toBe('satisfied');
  });
  it('оноо хүрэхгүй бол not_satisfied, аль нь болохыг заана', () => {
    const r = checkEligibility(reqs, { ielts: 6, gpa: 3.4, documents: ['Motivation Letter'] });
    expect(r.overall).toBe('not_satisfied');
    expect(r.items.find((i) => i.kind === 'IELTS')!.status).toBe('not_met');
  });
  it('оноо оруулаагүй эсвэл бичиг баримт тэмдэглээгүй бол additional (uncertain)', () => {
    const r = checkEligibility(reqs, { ielts: 7 });
    expect(r.overall).toBe('additional');
    expect(r.items.filter((i) => i.status === 'uncertain')).toHaveLength(2);
  });
  it('доод оноо эх сурвалжид заагаагүй бол үнэлэхгүй (uncertain), таамаглахгүй', () => {
    expect(checkEligibility([{ kind: 'TOEFL' }], { toefl: 100 }).items[0].status).toBe('uncertain');
  });
  it('шаардлагын мэдээлэл байхгүй бол insufficient (зохиомол шаардлага тулгахгүй)', () => {
    expect(checkEligibility([], { ielts: 9 }).overall).toBe('insufficient');
  });
  it('заавал биш (required:false) шаардлага нийт дүнг бэлхэн болгохгүй', () => {
    const r = checkEligibility([{ kind: 'IELTS', minScore: 6 }, { kind: 'GRE', minScore: 320, required: false }], { ielts: 7, gre: 300 });
    expect(r.overall).toBe('satisfied');
  });
  it('kind-ийн хэлбэр (IELTS Academic, Ielts) таарна', () => {
    expect(checkEligibility([{ kind: 'IELTS Academic', minScore: 6 }], { ielts: 6.5 }).items[0].status).toBe('satisfied');
  });
});

describe('parseUniversityRow', () => {
  const ok = { name: 'Test University', countrySlug: 'japan', sourceUrl: 'https://example.edu/about', degreeLevels: 'bachelor;master', subjects: 'engineering; business' };
  it('эх сурвалжгүй мөрийг няцаана', () => {
    const r = parseUniversityRow({ ...ok, sourceUrl: '' });
    expect(r.ok).toBe(false);
  });
  it('зөв мөр: slug, жагсаалт задална, баталгаажаагүй төлөвтэй', () => {
    const r: any = parseUniversityRow(ok);
    expect(r.ok).toBe(true);
    expect(r.value.slug).toBe('test-university');
    expect(r.value.doc.degreeLevels).toEqual(['bachelor', 'master']);
    expect(r.value.doc.subjects).toEqual(['engineering', 'business']);
    expect(r.value.doc.source.verificationStatus).toBe('unverified');
  });
  it('рейтинг/төлбөр өгвөл өөрийн эх сурвалж, он шаардана', () => {
    expect(parseUniversityRow({ ...ok, rankProvider: 'QS_WORLD', rank: 100 }).ok).toBe(false);
    const r: any = parseUniversityRow({ ...ok, rankProvider: 'QS_WORLD', rank: 100, rankYear: 2025, rankEdition: 'QS 2025', rankSourceUrl: 'https://www.topuniversities.com/' });
    expect(r.ok).toBe(true);
    expect(r.value.ranking.rank).toBe(100);
    expect(parseUniversityRow({ ...ok, tuitionLevel: 'master', tuitionAnnualUsd: 5000 }).ok).toBe(false);
  });
  it('буруу enum-г мэдэгдэнэ', () => {
    const r: any = parseUniversityRow({ ...ok, type: 'weird', degreeLevels: 'bachelor;xyz' });
    expect(r.ok).toBe(false);
    expect(r.errors.length).toBe(2);
  });
});

describe('AI guardrail', () => {
  const facts = 'Рейтинг: QS_WORLD 123 (QS 2025, баталгаажсан)\nТөлбөр: bachelor 12000 USD/жил';
  it('facts-д байгаа тоо зөвшөөрөгдөнө', () => {
    expect(numbersGrounded('QS-ийн 123-р байр, жилийн 12000 USD.', facts)).toBe(true);
  });
  it('facts-д байхгүй зохиомол рейтинг/төлбөрийг татгалзана', () => {
    expect(numbersGrounded('Энэ сургууль 45-р байранд.', facts)).toBe(false);
    expect(numbersGrounded('Төлбөр 9500 USD.', facts)).toBe(false);
  });
  it('universityFacts: нээгдсэн бол «Мэдээлэл байхгүй», хуучирсан тэмдэглэнэ; нээгдээгүй бол төлбөртэй мэдээллийг тайлбарлахгүй', () => {
    const open = universityFacts({ name: 'X', rankings: [], paid: { tuition: [{ level: 'bachelor', annualFee: 5, currency: 'USD', verifiedAt: new Date('2020-01-01') }], programs: [] }, scholarships: [] });
    expect(open.lines.join(' | ')).toContain('Рейтинг: Мэдээлэл байхгүй');
    expect(open.lines.join(' | ')).toContain('хуучирсан');
    expect(open.lines.join(' | ')).toContain('Элсэлтийн шаардлага: Мэдээлэл байхгүй');
    const locked = universityFacts({ name: 'X', rankings: [], scholarships: [] });
    expect(locked.lines.join(' | ')).toContain('нээгээгүй');
    expect(locked.lines.join(' | ')).not.toContain('Төлбөр:');
  });
  it('resultFacts: түгжигдсэн үр дүнг тэмдэглэнэ', () => {
    expect(resultFacts({ summary: 's', careerMatches: [], locked: true }).lines.join(' | ')).toContain('Premium нээгдээгүй');
  });
});

describe('rankFuture', () => {
  const sc = (v: number) => Object.fromEntries(CRITERIA.map((k) => [k, v]));
  const mk = (slug: string, scores: any) => ({ slug, nameMn: slug, nameEn: slug, future: { scores, year: 2025 } });
  it('жингээр эрэмбэлж, БҮХ шалгуургүй мэргэжлийг оруулахгүй', () => {
    const r = rankFuture(DEFAULT_METHODOLOGY, [mk('a', sc(60)), mk('b', sc(90)), mk('partial', { demand: 100 })]);
    expect(r.map((x) => x.slug)).toEqual(['b', 'a']);
    expect(r[0].rank).toBe(1);
  });
  it('жин өөрчлөгдөхөд эрэмбэ өөрчлөгдөнө', () => {
    const a = mk('a', { ...sc(50), demand: 100 }), b = mk('b', { ...sc(50), salaryPotential: 100 });
    const w1 = { ...DEFAULT_METHODOLOGY, weights: { ...DEFAULT_METHODOLOGY.weights, demand: 1, salaryPotential: 0 } };
    const w2 = { ...DEFAULT_METHODOLOGY, weights: { ...DEFAULT_METHODOLOGY.weights, demand: 0, salaryPotential: 1 } };
    expect(rankFuture(w1, [a, b])[0].slug).toBe('a');
    expect(rankFuture(w2, [a, b])[0].slug).toBe('b');
  });
  it('дээд тал нь 25', () => {
    expect(rankFuture(DEFAULT_METHODOLOGY, Array.from({ length: 40 }, (_, i) => mk(`c${i}`, sc(i)))).length).toBe(25);
  });
});
