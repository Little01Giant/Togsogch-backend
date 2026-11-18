/** Улс тутмын сургалтын төлбөрийн БАРИМЖАА хүрээ: тухайн улсын сургуулиудын бодит (албан ёсны хуудаснаас цуглуулсан) жилийн төлбөрөөс тооцно.
 *  Ханш хөрвүүлэхгүй — валют тус бүрээр тусдаа. Дор хаяж MIN_SAMPLES сургуулийн дүнгүй бол хүрээ гаргахгүй (зохиохгүй). */
export const MIN_SAMPLES = 3;

export interface TuitionPoint { level: string; currency?: string; annualFee?: number | null; annualFeeMax?: number | null }
export interface TuitionEstimateItem { currency: string; n?: number; min: number; median: number; max: number }
export interface TuitionEstimate { level: 'bachelor'; items: TuitionEstimateItem[]; basis: string; computedAt: Date; sourceName?: string; sourceUrl?: string }

/** Цуглуулсан сургуулийн дүн хүрэлцэхгүй (≥MIN_SAMPLES-аас бага) улсад албан ёсны эх сурвалжаас авсан улсын хүрээ. Эх сурвалж, уншсан огноотой. */
export const OFFICIAL_RANGES: Record<string, { currency: string; min: number; median: number; max: number; basis: string; sourceName: string; sourceUrl: string }> = {
  sweden: {
    currency: 'SEK', min: 80000, median: 160000, max: 320000,
    basis: 'Study in Sweden (Шведийн Институт): сургалтын төлбөр сургууль, хөтөлбөрөөс хамаарч жилд ойролцоогоор 80,000–320,000 SEK, дундажаар ~160,000 SEK (2026-11-11 уншсан). Дундаж нь албан ёсны дундаж.',
    sourceName: 'Study in Sweden (Swedish Institute)', sourceUrl: 'https://studyinsweden.se/plan-your-studies/fees-costs/',
  },
  denmark: {
    currency: 'EUR', min: 10800, median: 15000, max: 17300,
    basis: 'SDU-ийн албан ёсны хуудас (2026 оны 9-р сараас, ЕХ/ЕЭЗ-ээс гадна): Хүмүүнлэг 10,800; Бизнес, Нийгмийн ухаан, Эрүүл мэнд 15,000; Шинжлэх ухаан, Инженер 17,300 EUR/жил; DTU-ийн бакалавр 15,000 EUR/жил. Түвшин нь бүгдэд тусгайлан заагаагүй (2026-11-10 уншсан).',
    sourceName: 'University of Southern Denmark (SDU); Technical University of Denmark (DTU)', sourceUrl: 'https://www.sdu.dk/en/uddannelse/fees_and_funding/tuition',
  },
};

export function officialEstimate(slug: string, now = new Date()): TuitionEstimate | null {
  const o = OFFICIAL_RANGES[slug];
  if (!o) return null;
  return { level: 'bachelor', items: [{ currency: o.currency, min: o.min, median: o.median, max: o.max }], basis: o.basis, sourceName: o.sourceName, sourceUrl: o.sourceUrl, computedAt: now };
}

const median = (sorted: number[]) => {
  const m = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[m] : (sorted[m - 1] + sorted[m]) / 2;
};
const round = (n: number) => Math.round(n * 100) / 100;

/** points: тухайн улсын БҮХ сургуулийн төлбөрийн бичлэгүүд (нэг сургуульд хэд ч байж болно — сургуулийн хамгийн бага бакалаврын дүнг авна). */
export function computeTuitionEstimate(perSchool: TuitionPoint[][], now = new Date()): TuitionEstimate | null {
  const byCurrency = new Map<string, number[]>();
  const highByCurrency = new Map<string, number>();
  for (const school of perSchool) {
    const lowest = new Map<string, number>();
    for (const p of school) {
      if (p.level !== 'bachelor' || !p.currency || typeof p.annualFee !== 'number' || !isFinite(p.annualFee) || p.annualFee < 0) continue;
      const cur = lowest.get(p.currency);
      if (cur === undefined || p.annualFee < cur) lowest.set(p.currency, p.annualFee);
      const hi = typeof p.annualFeeMax === 'number' && isFinite(p.annualFeeMax) ? Math.max(p.annualFeeMax, p.annualFee) : p.annualFee;
      if (hi > (highByCurrency.get(p.currency) ?? -1)) highByCurrency.set(p.currency, hi);
    }
    for (const [c, v] of lowest) (byCurrency.get(c) ?? byCurrency.set(c, []).get(c)!).push(v);
  }
  const items: TuitionEstimateItem[] = [];
  for (const [currency, values] of byCurrency) {
    if (values.length < MIN_SAMPLES) continue;
    const s = [...values].sort((a, b) => a - b);
    items.push({ currency, n: s.length, min: round(s[0]), median: round(median(s)), max: round(Math.max(s[s.length - 1], highByCurrency.get(currency) ?? 0)) });
  }
  if (!items.length) return null;
  items.sort((a, b) => (b.n ?? 0) - (a.n ?? 0));
  return { level: 'bachelor', items, basis: 'Тухайн улсын сургуулиудын албан ёсны хуудаснаас цуглуулсан бакалаврын жилийн төлбөрийн (олон улсын оюутан) хүрээ. Баталгаажаагүй, баримжаа.', computedAt: now };
}
