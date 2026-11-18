import { MastersStrategy, relatedness } from './masters.strategy';
import { LanguageStrategy } from './language.strategy';
import { COUNTRY_PROFILES, MASTER_FIELDS } from '../../seed/phase2';

const labels = { skill: {}, subject: {}, value: {}, workstyle: {} };
const fields = MASTER_FIELDS.map((f) => ({ ...f }));
const countries = Object.entries(COUNTRY_PROFILES).map(([slug, matchProfile]) => ({ slug, code: slug.slice(0, 2), nameMn: slug, nameEn: slug, matchProfile }));
const masters = (answers: any, config = {}) => new MastersStrategy().score({ questions: [], answers, config, careers: [], labels, data: fields }) as any;
const language = (answers: any, config = {}) => new LanguageStrategy().score({ questions: [], answers, config, careers: [], labels, data: countries }) as any;

describe('MastersStrategy', () => {
  const base = { ms_bachelor_area: 'tech', ms_experience: 1, ms_profession_area: 'tech', ms_pref_areas: ['tech'], ms_goal: 'specialist', ms_leadership: 2, ms_research: 3, ms_mode: 'fulltime', ms_work_while: 'no' };

  it('технологийн суурьтай, мэргэжлээрээ гүнзгийрэх хүсэлтэй хүнд tech чиглэл тэргүүлнэ', () => {
    const r = masters(base);
    expect(r.fieldMatches[0].area).toBe('tech');
    expect(r.fieldMatches.length).toBeLessThanOrEqual(8);
  });

  it('туршлага, удирдлагын хүсэлт өндөртэй хүнд MBA/executive төрөл дээгүүрт орно', () => {
    const r = masters({ ms_bachelor_area: 'engineering', ms_experience: 8, ms_profession_area: 'business', ms_pref_areas: ['business'], ms_goal: 'leadership', ms_leadership: 5, ms_research: 1, ms_mode: 'parttime', ms_work_while: 'yes' });
    expect(r.fieldMatches.slice(0, 2).map((m: any) => m.slug)).toContain('mba');
  });

  it('туршлага дутуу бол MBA-ийн тохирол буурна', () => {
    const mk = (y: number) => masters({ ...base, ms_pref_areas: ['business'], ms_goal: 'leadership', ms_experience: y }).fieldMatches.find((m: any) => m.slug === 'mba')?.score ?? 0;
    expect(mk(0)).toBeLessThan(mk(6));
  });

  it('өөр салбарын бакалавр бол суурь мэдлэг (prerequisites) нөхөх жагсаалт гарна, ижил салбарт гарахгүй', () => {
    const other = masters({ ...base, ms_bachelor_area: 'arts' }).fieldMatches.find((m: any) => m.slug === 'ms-computer-science');
    const same = masters(base).fieldMatches.find((m: any) => m.slug === 'ms-computer-science');
    expect(other.prerequisites.length).toBeGreaterThan(0);
    expect(same.prerequisites).toEqual([]);
  });

  it('төрлөөр ангилсан (coursework/research/professional/executive) ба disclaimer байна', () => {
    const r = masters(base);
    expect(Object.keys(r.byType).length).toBeGreaterThan(0);
    expect(r.disclaimer).toMatch(/баталгаа биш/);
  });

  it('deterministic ба жин нөлөөлнө', () => {
    expect(masters(base)).toEqual(masters(base));
    const w = masters(base, { weights: { academic: 1, qualification: 0, goal: 0, experience: 0, compatibility: 0 } });
    expect(w.fieldMatches[0].score).not.toBe(masters(base).fieldMatches[0].score);
  });

  it('relatedness', () => {
    const f = { area: 'tech', adjacent: ['science'] };
    expect([relatedness('tech', f), relatedness('science', f), relatedness('law', f), relatedness('none', f)]).toEqual([100, 60, 25, null]);
  });
});

describe('LanguageStrategy', () => {
  const base = { lg_language: 'korean', lg_budget: 'mid', lg_city: 'big_city', lg_climate: 'any', lg_safety: 4, lg_distance: 'near', lg_culture: 4, lg_further: 'bachelor', lg_work: 3 };

  it('солонгос хэл сонгосон хүнд БНСУ тэргүүлнэ', () => {
    expect(language(base).countryMatches[0].slug).toBe('south-korea');
  });

  it('япон хэл сонгосон бол Япон тэргүүлнэ; орос → Орос', () => {
    expect(language({ ...base, lg_language: 'japanese' }).countryMatches[0].slug).toBe('japan');
    expect(language({ ...base, lg_language: 'russian' }).countryMatches[0].slug).toBe('russia');
  });

  it('бага төсөвтэй хүнд өндөр зардалтай улс (жнь АНУ) англи хэлний жагсаалтад доошилно', () => {
    const rank = (b: string, slug: string) => language({ ...base, lg_language: 'english', lg_distance: 'any', lg_budget: b }).countryMatches.findIndex((m: any) => m.slug === slug);
    const low = rank('low', 'usa'), high = rank('high', 'usa');
    expect(low === -1 || low > high).toBe(true);
  });

  it('оноо 0–100, буурах дараалал, үндэслэл бүрт байна', () => {
    const r = language(base);
    const s = r.countryMatches.map((m: any) => m.score);
    expect([...s].sort((a: number, b: number) => b - a)).toEqual(s);
    s.forEach((x: number) => { expect(x).toBeGreaterThanOrEqual(0); expect(x).toBeLessThanOrEqual(100); });
    r.countryMatches.forEach((m: any) => expect(m.why.length).toBeGreaterThan(0));
  });

  it('төлбөр/амьдрах зардлыг зохиохгүй: Админ оруулаагүй бол null', () => {
    const m = language(base).countryMatches[0];
    expect(m.livingCostMonthlyUsd).toBeNull();
    expect(m.tuitionRange).toBeNull();
  });

  it('цаашид сурахгүй бол futureStudy хэмжигдэхүүнийг хасна (null)', () => {
    expect(language({ ...base, lg_further: 'none', lg_work: 1 }).countryMatches[0].breakdown.futureStudy).toBeNull();
  });
});
