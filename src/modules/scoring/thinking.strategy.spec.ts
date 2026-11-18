import { THINKING_STYLES, ThinkingStrategy } from './thinking.strategy';
import { buildThinkingAssessment } from '../../seed/phase2';

const labels = { skill: {}, subject: {}, value: {}, workstyle: {} };
const { questions } = buildThinkingAssessment();
const run = (answers: Record<string, string>) => new ThinkingStrategy().score({ questions: questions as any, answers, config: {}, careers: [], labels }) as any;
const fill = (pick: (i: number) => string) => Object.fromEntries(questions.map((q, i) => [q.key, pick(i)]));

describe('ThinkingStrategy', () => {
  it('seed: 15 асуулт (10 албадмал + 5 нөхцөл), асуулт бүр а/б/в/г дөрвөн сонголттой', () => {
    expect(questions).toHaveLength(15);
    expect(questions.filter((q) => q.section === 'forced')).toHaveLength(10);
    expect(questions.filter((q) => q.section === 'situational')).toHaveLength(5);
    for (const q of questions) expect(q.options.map((o) => o.key)).toEqual(['a', 'b', 'c', 'd']);
  });

  it('хамгийн олон сонгосон үсэг давамгай хэв маяг болно', () => {
    const r = run(fill((i) => (i < 8 ? 'd' : 'a')));
    expect(r.hybrid).toBe(false);
    expect(r.leaders.map((x: any) => x.key)).toEqual(['d']);
    expect(r.leaders[0].title).toBe(THINKING_STYLES.d.title);
    expect(r.types.reduce((s: number, x: any) => s + x.count, 0)).toBe(15);
  });

  it('тэнцвэл хосолмол хэв маяг', () => {
    const t = run(fill((i) => (i < 5 ? 'a' : i < 10 ? 'b' : 'c')));
    expect(t.hybrid).toBe(true);
    expect(t.leaders.map((x: any) => x.key)).toEqual(['a', 'b', 'c']);
  });
});
