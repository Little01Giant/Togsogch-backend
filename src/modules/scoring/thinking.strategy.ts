import { ScoringContext, ScoringStrategy } from './types';

/**
 * «Сэтгэлгээний хэв маягийн тест»: 15 асуултаар (10 албадмал сонголт + 5 нөхцөл байдал) а/б/в/г үсэг сонгоно.
 * Хамгийн олон сонгосон үсэг = давамгай хэв маяг; тэнцвэл хосолмол. Тайлбар нь тестийн асуултын агуулгаас товчилсон.
 */
export const THINKING_STYLES = {
  a: { title: 'Аналитик сэтгэлгээ', description: 'Нарийн төвөгтэй асуудлыг хэсгүүдэд хувааж, бодит өгөгдөл, статистик, нарийн ширийн зүйлд тулгуурлан дүгнэдэг.' },
  b: { title: 'Бүтээлч сэтгэлгээ', description: 'Уламжлалт бус шийдэл хайж, санааны өвөрмөц байдал, далд холбоо, асуудлыг өөр өнцгөөс харахыг эрхэмлэдэг.' },
  c: { title: 'Практик сэтгэлгээ', description: 'Гарт байгаа нөөц, амьдралын туршлагад тулгуурлан бодит байдал дээр хурдан туршиж, үр дүнд хүрэхийг эрхэмлэдэг.' },
  d: { title: 'Логик сэтгэлгээ', description: 'Дэс дараалал, дүрэм, дедукци, зөрчилдөөнгүй байдалд тулгуурлан алхам алхмаар үндэслэж дүгнэдэг.' },
} as const;
export type ThinkingKey = keyof typeof THINKING_STYLES;
const KEYS = Object.keys(THINKING_STYLES) as ThinkingKey[];

export const THINKING_DISCLAIMER = 'Энэ тест нь өөрийн үнэлгээнд суурилсан бөгөөд шинжлэх ухаанаар баталгаажуулсан (validated) сэтгэл зүйн хэмжүүр биш. Тестийн эх бичвэрт Р.Стернберг, А.Ньюэлл, Х.Саймон нарын онолд тулгуурласан гэж дурдсан боловч баталгаажуулалтын мэдээлэл өгөөгүй. Мэргэжил, улс, сургууль сонгоход ашиглахгүй.';

export class ThinkingStrategy implements ScoringStrategy {
  key = 'thinking';
  score(ctx: ScoringContext) {
    const counts: Record<ThinkingKey, number> = { a: 0, b: 0, c: 0, d: 0 };
    const keys = ctx.questions.length ? ctx.questions.filter((q) => q.type === 'single').map((q) => q.key) : Object.keys(ctx.answers);
    for (const k of keys) {
      const v = ctx.answers[k];
      if (typeof v === 'string' && v in counts) counts[v as ThinkingKey]++;
    }
    const total = KEYS.reduce((s, k) => s + counts[k], 0);
    const best = Math.max(...KEYS.map((k) => counts[k]));
    const leaders = KEYS.filter((k) => counts[k] === best);
    const hybrid = leaders.length > 1;
    return {
      kind: 'thinking',
      summary: hybrid ? `Хосолмол: ${leaders.map((k) => THINKING_STYLES[k].title).join(' + ')}` : THINKING_STYLES[leaders[0]].title,
      hybrid,
      leaders: leaders.map((k) => ({ key: k, ...THINKING_STYLES[k] })),
      types: KEYS.map((k) => ({ key: k, title: THINKING_STYLES[k].title, count: counts[k], percent: total ? Math.round((counts[k] / total) * 100) : 0 })),
      total,
      disclaimer: THINKING_DISCLAIMER,
    };
  }
}
