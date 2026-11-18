import { ScoringContext, ScoringStrategy } from './types';
import { CATEGORY_TO_INDUSTRY, CITIES, City, FINANCE } from './city.data';

export const DEFAULT_CITY_CONFIG = {
  /** `language` нь «хэлний бэлтгэл» хариулт (lg_language) байгаа үед л тооцогдоно; байхгүй бол үлдсэн жинг дахин нормчилно */
  weights: { career: 0.25, culture: 0.25, env: 0.2, goal: 0.1, language: 0.2 },
  topN: 3,
  /** PRI энэ босгоос доош бол гадаадад ганцаараа амьдрахад сэтгэл зүйн эрсдэлтэй гэж үзнэ */
  priThreshold: 0.45,
  domesticBoost: 0.2,
};
export const CITY_DISCLAIMER =
  'Хотын профайл, төсөв, банкны баталгаа, визний нөхцөл нь редакцийн тооцоо бөгөөд албан ёсны статистик биш, баталгаажуулсан огноогүй. Виз, элсэлт, тэтгэлгийн мэдээллийг заавал албан ёсны эх сурвалжаас шалгана уу.';

const LANG_PICK: Record<string, string> = { english: 'en', korean: 'ko', japanese: 'ja', chinese: 'zh', german: 'de', french: 'fr', russian: 'ru' };
const LANG_NAME: Record<string, string> = { english: 'Англи', korean: 'Солонгос', japanese: 'Япон', chinese: 'Хятад', german: 'Герман', french: 'Франц', russian: 'Орос' };
const DURATION_NAME: Record<string, string> = { '3m': '3 сар хүртэл', '6m': '6 сар', '1y': '1 жил', '2y': '2 жил орчим' };

const round = Math.round;
const r1 =(x: number) => Math.round(x * 1000) / 10;
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const SIZE: Record<string, number> = { a: 0.25, b: 0.65, c: 1 };
const STEM = new Set(['IND-TECH', 'IND-ENG']);
const SCHOLAR_ALT = ['BUD', 'MUC', 'BER'];
const WORK_ALT = ['OSA', 'TYO', 'TPE', 'PUS'];
const WORK_RANK = { yes: 0, limited: 1, no: 2 } as const;

export type PathwayCode = 'A' | 'B' | 'C' | 'D';

export class CityStrategy implements ScoringStrategy {
  key = 'city';
  score(ctx: ScoringContext) {
    const a = ctx.answers;
    const cfg = { ...DEFAULT_CITY_CONFIG, ...ctx.config, weights: { ...DEFAULT_CITY_CONFIG.weights, ...(ctx.config?.weights ?? {}) } };
    const norm = (k: string) => clamp01((Number(a[k] ?? 3) - 1) / 4);

    // ── Өмнөх карьерын тестийн өгөгдөл. Байхгүй бол төвийг сахисан утга авч, үр дүнд тэмдэглэнэ (зохиомол оноо биш).
    const lang = LANG_PICK[a.lg_language];
    const countries: any[] = ctx.data ?? [];
    const prior = ctx.prior ?? null;
    const pers: any[] = prior?.payload?.personality ?? [];
    const persOf = (k: string) => { const x = pers.find((p) => p.key === k); return x ? clamp01(Number(x.score) / 100) : null; };
    const adaptRaw = ['adapt_change', 'adapt_confidence'].map((k) => Number(prior?.answers?.[k])).filter((n) => Number.isFinite(n) && n >= 1);
    const neuro = persOf('N'), consc = persOf('C');
    const caas = adaptRaw.length ? clamp01((adaptRaw.reduce((s, x) => s + x, 0) / adaptRaw.length - 1) / 4) : null;
    const priorMissing = !prior || neuro === null || consc === null || caas === null;

    // ── Сэтгэл зүйн бэлэн байдлын индекс (PRI)
    const selfReliance = (norm('L08') + norm('L09') + norm('L10') + norm('L11')) / 4;
    const pri = 0.25 * (1 - (neuro ?? 0.5)) + 0.15 * (consc ?? 0.5) + 0.15 * (caas ?? 0.5) + 0.45 * selfReliance;
    const lowReadiness = pri < cfg.priThreshold;

    // ── Топ салбарууд (карьерын тестийн салбарын нийцлээс)
    const cats: any[] = [...(prior?.payload?.categoryMatches ?? [])].sort((x, y) => y.score - x.score);
    const topInd: string[] = [];
    for (const c of cats) { const i = CATEGORY_TO_INDUSTRY[c.slug]; if (i && !topInd.includes(i)) topInd.push(i); if (topInd.length >= 3) break; }

    // ── Хот бүрийн «идеал нийцлийн оноо»
    const scored = CITIES.map((city) => {
      const v = city.vector;
      const rank = city.strongIndustries.length ? topInd.findIndex((i) => city.strongIndustries.includes(i)) : -1;
      const career = topInd.length ? (rank === 0 ? 1 : rank === 1 ? 0.85 : rank === 2 ? 0.75 : 0.65) : 0.65;
      const uSize = SIZE[a.L04] ?? 0.65;
      const culture = 1 - Math.sqrt(((uSize - v.size) ** 2 + (norm('L05') - v.pdi) ** 2 + (norm('L06') - v.idv) ** 2 + (norm('L07') - v.uai) ** 2 + Math.max(0, norm('L12') - v.safe) ** 2) / 5);
      // «(1 - vector)» нь хотын хүнд байдал; хэрэглэгчийн тэсвэр түүнээс бага бол торгууль
      const penCold = Math.max(0, (1 - v.cold) - norm('L13')) ** 2;
      const penHeat = Math.max(0, (1 - v.heat) - norm('L14')) ** 2;
      const penSun = Math.max(0, (1 - v.sun) - norm('L15')) ** 2;
      const penMeat = Math.max(0, (1 - norm('L16')) - v.meat) ** 2;
      const diffTrans = (norm('L18') - v.trans) ** 2;
      const env = 1 - Math.sqrt((penCold + penHeat + penSun + penMeat + diffTrans) / 5);
      let goal = 0.85;
      if (a.L01 === 'd' && (SCHOLAR_ALT.includes(city.id) || city.id === 'UB')) goal = 1;
      if (a.L03 === 'a' && topInd.some((i) => STEM.has(i)) && city.longTermVisa) goal = 1;
      if (a.L03 === 'b' && city.id === 'UB') goal = 1;
      // Хэл: хотын улсын (Country.matchProfile) хэлний жагсаалтад сонгосон хэл байвал 1, үгүй бол 0.15. Хариулт/улсын профайл байхгүй бол оролцуулахгүй.
      const langs: string[] | undefined = city.countryCode === 'MN' ? ['mn'] : countries.find((c: any) => c.code === city.countryCode)?.matchProfile?.languages;
      const language = lang && langs ? (langs.includes(lang) ? 1 : 0.15) : null;
      // Карьерын тест өгөөгүй бол «мэргэжлийн салбар»-ыг оролцуулахгүй (төвийг сахисан зохиомол оноо харуулахгүй), үлдсэн жинг нормчилно.
      const d: Record<string, number> = { ...(topInd.length ? { career } : {}), culture, env, goal, ...(language === null ? {} : { language }) };
      let num = 0, den = 0;
      for (const k of Object.keys(d)) { const w = (cfg.weights as Record<string, number>)[k] ?? 0; num += d[k] * w; den += w; }
      let total = den ? num / den : 0;
      if (lowReadiness && city.id === 'UB') total = Math.min(0.98, total + cfg.domesticBoost);
      return { city, d, total: clamp01(total) };
    }).sort((x, y) => y.total - x.total);

    const dream = scored.slice(0, cfg.topN).map(({ city, d, total }) => ({
      id: city.id, nameMn: city.nameMn, countryMn: city.countryMn, countryCode: city.countryCode, score: r1(total),
      breakdown: Object.fromEntries(Object.entries(d).map(([k, v]) => [k, r1(v)])),
      why: this.why(city, d, a, topInd),
      universities: city.universities,
      strongIndustries: city.strongIndustries,
      meta: { budgetM: city.budgetM, pofM: city.pofM, pofNote: city.pofNote, langPrepWork: city.langPrepWork, langPrepWorkNote: city.langPrepWorkNote, postGradVisa: city.postGradVisa },
    }));

    const fin = {
      budgetUpper: FINANCE.budget[a.F01]?.[1] ?? null, pofUpper: FINANCE.pof[a.F02] ?? null,
      highGpa: a.F04 === 'a', workNeed: a.F03 as string | undefined,
    };
    const pathways = fin.budgetUpper === null ? [] : scored.slice(0, cfg.topN).map(({ city }) => this.pathway(city, scored, a, fin, lowReadiness));

    return {
      kind: 'city',
      languagePrep: lang ? { language: a.lg_language, languageMn: LANG_NAME[a.lg_language], duration: a.lg_duration ?? null, durationMn: DURATION_NAME[a.lg_duration] ?? null } : null,
      summary: dream[0] ? `Таны зан чанар, орчны сонголтод «${dream[0].nameMn}» (${dream[0].countryMn}) хамгийн их нийцэж байна.` : 'Хангалттай мэдээлэл байхгүй байна.',
      readiness: { pri: round(pri * 100) / 100, low: lowReadiness, priorMissing, threshold: cfg.priThreshold },
      topIndustries: topInd,
      dreamCities: dream,
      allCities: scored.map(({ city, total }) => ({ id: city.id, nameMn: city.nameMn, countryMn: city.countryMn, score: r1(total) })),
      pathways,
      method: {
        weights: cfg.weights,
        note: 'Үе шат 1: нийцэл = 25% мэргэжлийн салбар + 25% соёл (Евклидийн зай) + 20% уур амьсгал, хоол, тээвэр + 10% зорилго + 20% хэл (сонгосон хэл тухайн улсад сурах боломжтой эсэх). Хэлний хариулт байхгүй бол үлдсэн жинг дахин нормчилно. Үе шат 2: санхүү, банкны баталгаа, голч дүн, цагийн ажлын хэрэгцээг мөрөөдлийн хот бүрийн босготой тулгаж 4 замналын нэгийг сонгоно. Хотын профайл нь редакцийн тооцоо.',
      },
      disclaimer: CITY_DISCLAIMER,
    };
  }

  private why(city: City, d: Record<string, number>, a: Record<string, any>, topInd: string[]) {
    const out: string[] = [];
    const hit = topInd.filter((i) => city.strongIndustries.includes(i));
    if (hit.length) out.push('Таны карьерын тестээр гарсан салбар энэ хотын тэргүүлэх салбартай давхцаж байна.');
    else if (!topInd.length) out.push('Карьерын тест өгөөгүй тул салбарын нийцлийг төвийг сахисан утгаар тооцсон.');
    if (d.language === 1 && LANG_NAME[a.lg_language]) out.push(`Таны сонгосон хэл (${LANG_NAME[a.lg_language]}) энэ улсад сурах боломжтой хэлний нэг.`);
    if (d.culture >= 0.8) out.push('Хотын хэмжээ, дүрэм журам, бие даасан байдал, аюулгүй байдал таны сонголттой сайн нийцнэ.');
    if (d.env >= 0.8) out.push('Уур амьсгал, хоол хүнс, нийтийн тээвэр таны тэсвэр, дадалтай нийцнэ.');
    if (a.L12 && Number(a.L12) >= 4 && city.vector.safe >= 0.9) out.push('Аюулгүй байдал өндөр (редакцийн үнэлгээ).');
    if (!out.length) out.push('Нийт тохирлоор жагсаалтад орсон боловч давхцал харьцангуй сул байна.');
    return out;
  }

  private pathway(city: City, scored: { city: City; total: number }[], a: Record<string, any>, fin: { budgetUpper: number | null; pofUpper: number | null; highGpa: boolean; workNeed?: string }, lowReadiness: boolean) {
    const base = { cityId: city.id, cityName: `${city.nameMn}, ${city.countryMn}` };
    const domestic = (reason: string) => ({
      ...base, code: 'D' as PathwayCode, reason,
      steps: [
        'Монголын шилдэг их сургууль (МУИС, ШУТИС, СЭЗИС)-д суралцаж, Боловсролын зээлийн сангийн «Оюутны хөгжлийн зээл» болон буцалтгүй тусламжийн нөхцөлийг албан ёсны эх сурвалжаас шалгах.',
        'Эхний 2 жилдээ гадаад хэлний албан ёсны оноо (IELTS / TOPIK / JLPT) авч, бие даан амьдрах дадлаа хөгжүүлэх.',
        `3-р курсээс «${city.nameMn}» зэрэг мөрөөдлийн хот руу 2+2 хамтарсан хөтөлбөрөөр шилжих боломжийг сургуулиас лавлах.`,
      ],
    });
    if (city.id === 'UB') return { ...base, code: 'D' as PathwayCode, reason: 'Мөрөөдлийн хот Монголд байгаа тул дотоодод суралцана.', steps: ['Монголын шилдэг их сургуулиудын элсэлтийн нөхцөлийг албан ёсны хуудсаас шалгах.', 'Хэл болон ур чадвараа хөгжүүлж, 2+2 хөтөлбөрөөр гадагшаа явах боломжийг судлах.'] };
    if (lowReadiness) return domestic('Бие даан амьдрах сэтгэл зүйн бэлэн байдал (PRI) босгоос доогуур байгаа тул эхлээд дотоодод бэлтгэх нь эрсдэл багатай.');

    const afford = fin.budgetUpper! >= city.budgetM[0] && (fin.pofUpper ?? 0) >= city.pofM[0];
    const needWorkNow = a.L01 === 'a' && fin.workNeed === 'a';
    const alt = (list: string[], needAfford: boolean) => scored.filter((s) => list.includes(s.city.id) && s.city.id !== city.id && (!needAfford || (fin.budgetUpper! >= s.city.budgetM[0] && (fin.pofUpper ?? 0) >= s.city.pofM[0])))
      .sort((x, y) => WORK_RANK[x.city.langPrepWork] - WORK_RANK[y.city.langPrepWork] || y.total - x.total)[0]?.city;

    if (afford) {
      if (needWorkNow && city.langPrepWork === 'no') {
        const o = alt(WORK_ALT, true);
        return { ...base, code: 'C' as PathwayCode, reason: 'Санхүү хүрэлцэх боловч хэлний бэлтгэлийн виз эхний саруудад ажиллах эрх олгохгүй.', warning: `${city.nameMn}: ${city.langPrepWorkNote}.`, alternative: o ? { cityId: o.id, name: `${o.nameMn}, ${o.countryMn}`, note: o.langPrepWorkNote } : null, steps: ['Хэрэв заавал энэ хотод очвол эхний 6 сарын амьжиргааны зардлаа Монголоос бүрэн бэлдэж явах.', o ? `Эсвэл цагийн ажил хийх эрхтэй «${o.nameMn}» руу шилжих (${o.langPrepWorkNote}).` : 'Цагийн ажил хийх эрхтэй өөр хотыг албан ёсны эх сурвалжаас судлах.'] };
      }
      return { ...base, code: 'A' as PathwayCode, reason: 'Таны жилийн төсөв болон банкны баталгаа энэ хотын босгод хүрч байна.', steps: [city.universities.length ? `Зорилтот сургуулиуд: ${city.universities.join(', ')}.` : 'Зорилтот сургуулиудаа албан ёсны эх сурвалжаас судлах.', `Виз болон банкны баталгаа${city.pofNote ? ` (${city.pofNote})` : ''}-ын материалаа элсэлтийн хугацаанаас хамгийн багадаа 4 сарын өмнө бэлтгэж эхлэх.`] };
    }
    if (fin.highGpa || a.L01 === 'd') {
      const o = alt(SCHOLAR_ALT, false);
      return { ...base, code: 'B' as PathwayCode, reason: 'Санхүү шууд хүрэхгүй ч голч дүн/тэтгэлгийн зорилго өндөр байгаа тул тэтгэлгээр өрсөлдөх нь тохиромжтой.', alternative: o ? { cityId: o.id, name: `${o.nameMn}, ${o.countryMn}`, note: 'Тэтгэлэг эсвэл төлбөргүй их сургуультай орлуулалт' } : null, steps: [`«${city.nameMn}» руу Засгийн газрын тэтгэлгээр (Илгээлт-2100, GKS, MEXT, DAAD гэх мэт) өрсөлдөх. Хугацаа, нөхцөлийг албан ёсны хуудсаас шалгах.`, o ? `Орлуулалт: «${o.nameMn}» (Stipendium Hungaricum эсвэл төлбөргүй их сургууль) — нөхцөлийг албан ёсны эх сурвалжаас баталгаажуулах.` : 'Өөр тэтгэлэгт хөтөлбөрүүдийг судлах.'] };
    }
    if (a.F01 !== 'a' && (fin.workNeed === 'a' || fin.workNeed === 'b')) {
      const o = alt(WORK_ALT, true);
      if (o) return { ...base, code: 'C' as PathwayCode, reason: 'Төсөв дунд зэрэг, цагийн ажлаар зардлаа нөхөх шаардлагатай тул зардал хямд, ажиллах эрхтэй хотоор орлуулав.', alternative: { cityId: o.id, name: `${o.nameMn}, ${o.countryMn}`, note: o.langPrepWorkNote }, steps: [`«${o.nameMn}»: ${o.langPrepWorkNote}. Амьжиргааны зардлаа цагийн ажлаар хэр нөхөх боломжийг албан ёсны эх сурвалжаас тооцох.`, 'Сурлагын амжилтаар төлбөрийн хөнгөлөлт авах боломжийг сургуулиас лавлах.'] };
    }
    return domestic('Төсөв, банкны баталгаа энэ хотын босгод хүрэхгүй байна.');
  }
}
