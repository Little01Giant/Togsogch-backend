import { ARCHETYPE_KEYS, ArchetypeKey, ArchetypeTest, getArchetypeTest } from './archetype-tests';
import { ScoringContext, ScoringStrategy } from './types';

/** Зугаа цэнгээний «дүр/төрөл» тестүүдийн нэг оноолт: хамгийн олон дэмжлэг авсан төрөл (а/б/в/г) нь үр дүн. Үр дүн нь `archetype` төрөлтэй, `testKey`-ээр ялгагдана. */
export class ArchetypeStrategy implements ScoringStrategy {
  private test: ArchetypeTest;
  constructor(public key: string) {
    const t = getArchetypeTest(key);
    if (!t) throw new Error(`Archetype тест олдсонгүй: ${key}`);
    this.test = t;
  }

  score(ctx: ScoringContext) {
    const { types } = this.test;
    const counts: Record<ArchetypeKey, number> = { a: 0, b: 0, v: 0, g: 0 };
    const answered = ctx.questions.length ? ctx.questions.filter((q) => q.type === 'single').map((q) => q.key) : Object.keys(ctx.answers);
    for (const k of answered) {
      const v = ctx.answers[k];
      if (typeof v === 'string' && v in counts) counts[v as ArchetypeKey]++;
    }
    const total = ARCHETYPE_KEYS.reduce((s, k) => s + counts[k], 0);
    const best = Math.max(...ARCHETYPE_KEYS.map((k) => counts[k]));
    const leaders = ARCHETYPE_KEYS.filter((k) => counts[k] === best);
    const primary = leaders[0]; // тэнцвэл а→б→в→г дарааллаар эхнийх; тэнцсэнийг `tied`-д харуулна
    const p = types[primary];
    return {
      kind: 'archetype',
      testKey: this.key,
      testTitle: this.test.title,
      summary: leaders.length > 1 ? `${p.title} (тэнцсэн: ${leaders.slice(1).map((k) => types[k].title).join(', ')})` : p.title,
      primary: { key: primary, ...p },
      tied: leaders.slice(1).map((k) => ({ key: k, ...types[k] })),
      types: ARCHETYPE_KEYS.map((k) => ({ key: k, title: types[k].title, count: counts[k], percent: total ? Math.round((counts[k] / total) * 100) : 0 })),
      total,
      tipsTitle: this.test.tipsTitle,
      disclaimer: this.test.disclaimer,
    };
  }
}
