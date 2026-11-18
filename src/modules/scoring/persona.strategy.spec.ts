import { PERSONA_TYPES, PersonaStrategy } from './persona.strategy';
import { buildPersonaAssessment } from '../../seed/phase2';

const labels = { skill: {}, subject: {}, value: {}, workstyle: {} };
const { questions } = buildPersonaAssessment();
const run = (answers: Record<string, string>) => new PersonaStrategy().score({ questions: questions as any, answers, config: {}, careers: [], labels }) as any;
const all = (k: string, n = 10) => Object.fromEntries(questions.slice(0, n).map((q) => [q.key, k]));

describe('PersonaStrategy', () => {
  it('seed: 10 асуулт, асуулт бүр а/б/в/г дөрвөн сонголттой', () => {
    expect(questions).toHaveLength(10);
    for (const q of questions) expect(q.options.map((o) => o.key)).toEqual(['a', 'b', 'v', 'g']);
  });

  it('хамгийн олон дэмжлэг авсан төрөл үр дүн болно', () => {
    const r = run({ ...all('b', 6), ...Object.fromEntries(questions.slice(6).map((q) => [q.key, 'v'])) });
    expect(r.primary.key).toBe('b');
    expect(r.primary.title).toBe(PERSONA_TYPES.b.title);
    expect(r.tied).toEqual([]);
    expect(r.types.find((x: any) => x.key === 'b').count).toBe(6);
    expect(r.types.reduce((s: number, x: any) => s + x.count, 0)).toBe(10);
  });

  it('тэнцвэл эхнийх нь үндсэн, бусад нь `tied`-д', () => {
    const r = run({ ...Object.fromEntries(questions.slice(0, 5).map((q) => [q.key, 'g'])), ...Object.fromEntries(questions.slice(5).map((q) => [q.key, 'a'])) });
    expect(r.primary.key).toBe('a');
    expect(r.tied.map((x: any) => x.key)).toEqual(['g']);
  });

  it('тодорхойгүй хариултыг тооцохгүй', () => {
    const r = run({ [questions[0].key]: 'zz', [questions[1].key]: 'v' });
    expect(r.total).toBe(1);
    expect(r.primary.key).toBe('v');
  });
});
