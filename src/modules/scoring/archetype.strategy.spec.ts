import { ARCHETYPE_KEYS, ARCHETYPE_TESTS } from './archetype-tests';
import { ArchetypeStrategy } from './archetype.strategy';
import { buildArchetypeAssessment } from '../../seed/phase2';

const labels = { skill: {}, subject: {}, value: {}, workstyle: {} };

describe.each(ARCHETYPE_TESTS.map((t) => [t.key]))('ArchetypeStrategy: %s', (key) => {
  const { questions } = buildArchetypeAssessment(key);
  const run = (answers: Record<string, string>) => new ArchetypeStrategy(key).score({ questions: questions as any, answers, config: {}, careers: [], labels }) as any;
  const fill = (k: string, from = 0, to = questions.length) => Object.fromEntries(questions.slice(from, to).map((q) => [q.key, k]));

  it('seed: 8 асуулт, асуулт бүр а/б/в/г дөрвөн сонголттой, асуултын түлхүүр давхцахгүй', () => {
    expect(questions).toHaveLength(8);
    for (const q of questions) {
      expect(q.options.map((o) => o.key)).toEqual(['a', 'b', 'v', 'g']);
      expect(q.options.every((o) => o.label.trim().length > 0)).toBe(true);
    }
    expect(new Set(questions.map((q) => q.key)).size).toBe(questions.length);
  });

  it('төрөл бүр гарчиг, тайлбар, 3 зөвлөмжтэй (хоосон биш)', () => {
    const t = ARCHETYPE_TESTS.find((x) => x.key === key)!;
    for (const k of ARCHETYPE_KEYS) {
      expect(t.types[k].title.length).toBeGreaterThan(2);
      expect(t.types[k].description.length).toBeGreaterThan(20);
      expect(t.types[k].tips).toHaveLength(3);
    }
  });

  it.each(ARCHETYPE_KEYS)('бүх хариулт «%s» бол тэр төрөл үр дүн болно', (k) => {
    const r = run(fill(k));
    expect(r.kind).toBe('archetype');
    expect(r.testKey).toBe(key);
    expect(r.primary.key).toBe(k);
    expect(r.tied).toEqual([]);
    expect(r.total).toBe(8);
    expect(r.types.find((x: any) => x.key === k).percent).toBe(100);
  });

  it('тэнцвэл эхнийх нь үндсэн, бусад нь `tied`-д; тодорхойгүй хариултыг тооцохгүй', () => {
    const r = run({ ...fill('g', 1, 4), ...fill('a', 4, 7), ...fill('b', 7, 8), [questions[0].key]: 'x' });
    expect(r.primary.key).toBe('a');
    expect(r.tied.map((x: any) => x.key)).toEqual(['g']);
    expect(r.total).toBe(7);
  });
});
