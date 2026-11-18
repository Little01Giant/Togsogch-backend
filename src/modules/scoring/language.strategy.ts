import { ScoringContext, ScoringStrategy } from './types';

export const DEFAULT_LANGUAGE_CONFIG = {
  weights: { language: 0.3, budget: 0.2, lifestyle: 0.2, preference: 0.15, futureStudy: 0.15 },
  topN: 8,
};
export const LANGUAGE_DISCLAIMER =
  'Улсын тохирол нь таны хариулт болон улс бүрийн редакцийн профайлын (Админ засдаг) харьцуулалт бөгөөд албан ёсны эрэмбэ, алдартай байдлын жагсаалт биш. Виз, төлбөр, хэлний сургалтын мэдээллийг албан ёсны эх сурвалжаас заавал баталгаажуулна уу.';
const round = Math.round;
const COST = ['', 'Харьцангуй бага', 'Дунд', 'Өндөр'];
const LANG: Record<string, string> = { en: 'Англи', ko: 'Солонгос', ja: 'Япон', zh: 'Хятад', de: 'Герман', fr: 'Франц', ru: 'Орос' };
const PICK: Record<string, string> = { english: 'en', korean: 'ko', japanese: 'ja', chinese: 'zh', german: 'de', french: 'fr', russian: 'ru' };

const climateFit = (want: string, have: string) => (want === 'any' || want === have ? 100 : want === 'temperate' || have === 'temperate' ? 60 : 10);
const cityFit = (want: string, have: string) => (want === have ? 100 : want === 'balanced' || have === 'balanced' ? 60 : 20);
const near3 = (want: string, have: string) => (want === 'any' || want === have ? 100 : want === 'mid' || have === 'mid' ? 60 : 20);

export class LanguageStrategy implements ScoringStrategy {
  key = 'language';
  score(ctx: ScoringContext) {
    const a = ctx.answers;
    const cfg = { ...DEFAULT_LANGUAGE_CONFIG, ...ctx.config, weights: { ...DEFAULT_LANGUAGE_CONFIG.weights, ...(ctx.config?.weights ?? {}) } };
    const countries: any[] = ctx.data ?? [];
    const lang = PICK[a.lg_language];
    const tier = ({ low: 1, mid: 2, high: 3 } as any)[a.lg_budget] ?? null;
    const safetyWant = Number(a.lg_safety ?? 3);
    const adapt = Number(a.lg_culture ?? 3);
    const further = a.lg_further;
    const work = Number(a.lg_work ?? 3);

    const ranked = countries.filter((c) => c.matchProfile && Object.keys(c.matchProfile).length).map((c) => {
      const p = c.matchProfile;
      const language = lang ? ((p.languages ?? []).includes(lang) ? 100 : 15) : null;
      const budget = tier === null ? null : p.costTier <= tier ? 100 : p.costTier === tier + 1 ? 45 : 10;
      const safetyFit = p.safety >= safetyWant ? 100 : Math.max(0, 100 - (safetyWant - p.safety) * 30);
      const lifestyle = (cityFit(a.lg_city ?? 'balanced', p.cityLife) + climateFit(a.lg_climate ?? 'any', p.climate) + safetyFit) / 3;
      const cultureFit = p.culture === 'near' ? 100 : p.culture === 'mid' ? 60 + (adapt - 1) * 10 : 20 + (adapt - 1) * 20;
      const preference = (near3(a.lg_distance ?? 'any', p.distance) + cultureFit) / 2;
      const parts: number[] = [];
      if (further === 'bachelor' || further === 'master') parts.push((p.higherEd ?? 2) * 33.3);
      if (work >= 4) parts.push((p.workAbroad ?? 2) * 33.3);
      const futureStudy = parts.length ? parts.reduce((x, y) => x + y, 0) / parts.length : null;
      const d: Record<string, number | null> = { language, budget, lifestyle, preference, futureStudy };
      let num = 0, den = 0;
      for (const k of Object.keys(d)) if (d[k] !== null) { num += (d[k] as number) * (cfg.weights as any)[k]; den += (cfg.weights as any)[k]; }
      return { c, p, d, total: den ? num / den : 0 };
    }).sort((x, y) => y.total - x.total).slice(0, cfg.topN);

    const countryMatches = ranked.map(({ c, p, d, total }) => {
      const why: string[] = [], pros: string[] = [], cons: string[] = [];
      if (d.language === 100) { why.push(`Таны сонгосон хэл (${LANG[lang]}) энэ улсад сурах боломжтой хэлний нэг.`); pros.push('Сонгосон хэлээ орчинд нь дадлагажуулна'); }
      else if (d.language === 15) { why.push(`Таны сонгосон хэл (${LANG[lang]}) энэ улсад голлох хэл биш.`); cons.push('Сонгосон хэлний орчин биш'); }
      if (d.budget === 100) { why.push('Улсын ерөнхий зардлын түвшин таны төсөвт багтаж байна.'); pros.push('Төсөвт нийцэх магадлалтай'); }
      else if (d.budget !== null) { why.push('Улсын ерөнхий зардлын түвшин таны төсвөөс өндөр байж болзошгүй.'); cons.push('Зардлын түвшин төсвөөс өндөр байж болно'); }
      if ((d.lifestyle ?? 0) >= 75) { why.push('Амьдралын хэв маяг, уур амьсгал, аюулгүй байдлын хүсэлт тань сайн нийцнэ.'); pros.push('Амьдралын орчин таны сонголттой нийцнэ'); }
      else if ((d.lifestyle ?? 100) < 50) cons.push('Уур амьсгал/хотын орчин таны сонголтоос өөр');
      if ((d.preference ?? 0) >= 75) pros.push('Монголоос зай, соёлын ойр байдал таны сонголттой нийцнэ');
      else if ((d.preference ?? 100) < 50) cons.push('Монголоос холтой эсвэл соёлын ялгаа их');
      if (d.futureStudy !== null) {
        if (d.futureStudy >= 66) { why.push('Цааш бакалавр/магистрт суралцах болон ажиллах боломж харьцангуй өргөн (редакцийн үнэлгээ).'); pros.push('Цаашдын боловсролын боломж'); }
        else cons.push('Цаашдын боловсрол/ажлын боломж харьцангуй хязгаарлагдмал (редакцийн үнэлгээ)');
      }
      if (!why.length) why.push('Нийт тохирлоор жагсаалтад орсон боловч давхцал харьцангуй сул байна.');
      const lc = c.livingCostMonthlyUsd;
      return {
        slug: c.slug, code: c.code, nameMn: c.nameMn, nameEn: c.nameEn, score: round(total),
        breakdown: Object.fromEntries(Object.entries(d).map(([k, v]) => [k, v === null ? null : round(v)])), why, pros, cons,
        costTier: COST[p.costTier] ?? null, languages: (p.languages ?? []).map((l: string) => LANG[l] ?? l),
        livingCostMonthlyUsd: lc && (lc.min != null || lc.max != null) ? { min: lc.min ?? null, max: lc.max ?? null } : null,
        tuitionRange: c.tuitionRange ?? null, languagePrepInfo: c.languagePrepInfo ?? null, visaLinks: c.visaLinks ?? [], scholarshipInfo: c.scholarshipInfo ?? null,
        languagePrepUniversities: c.languagePrepUniversities ?? 0,
      };
    });

    return {
      kind: 'language',
      summary: countryMatches[0] ? `Таны хариултаар «${countryMatches[0].nameMn}» зэрэг улсууд илүү тохирч байна.` : 'Хангалттай мэдээлэл байхгүй байна.',
      profile: { language: lang ? LANG[lang] : null, level: a.lg_level ?? null, duration: a.lg_duration ?? null, budgetTier: a.lg_budget ?? null, further: further ?? null },
      countryMatches,
      method: { weights: cfg.weights, note: 'Улсын профайл (хэл, зардлын түвшин, аюулгүй байдал, зай, соёл, цаашдын боломж) нь редакцийн тохируулга бөгөөд албан ёсны статистик биш. Тоон зардал, төлбөрийг зөвхөн Админ эх сурвалжтай оруулсан тохиолдолд харуулна.' },
      disclaimer: LANGUAGE_DISCLAIMER,
    };
  }
}
