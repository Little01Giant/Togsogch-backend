export const CRITERIA = ['employmentGrowth', 'demand', 'salaryPotential', 'skillScarcity', 'automationResilience', 'mongoliaRelevance', 'globalOpportunities'] as const;
export const DEFAULT_METHODOLOGY = {
  published: false, year: null as number | null,
  weights: { employmentGrowth: 0.2, demand: 0.2, salaryPotential: 0.15, skillScarcity: 0.1, automationResilience: 0.15, mongoliaRelevance: 0.1, globalOpportunities: 0.1 },
  sources: [] as { name: string; url: string }[], notes: '',
};

/** Ирээдүйтэй мэргэжлийн эрэмбэ: жин (методологи) × шалгуур тус бүрийн оноо. Зөвхөн БҮХ шалгуурын оноотой мэргэжил оролцоно. */
export function rankFuture(meth: typeof DEFAULT_METHODOLOGY, careers: any[]) {
  const wsum = CRITERIA.reduce((s, k) => s + (meth.weights[k] ?? 0), 0) || 1;
  return careers
    .filter((c) => CRITERIA.every((k) => typeof c.future?.scores?.[k] === 'number'))
    .map((c) => ({ c, score: CRITERIA.reduce((s, k) => s + c.future.scores[k] * (meth.weights[k] ?? 0), 0) / wsum }))
    .sort((a, b) => b.score - a.score).slice(0, 25)
    .map(({ c, score }, i) => ({
      rank: i + 1, score: Math.round(score * 10) / 10, slug: c.slug, nameMn: c.nameMn, nameEn: c.nameEn, category: c.categoryId?.nameMn ?? null, categorySlug: c.categoryId?.slug ?? null, description: c.description ?? null,
      scores: c.future.scores, year: c.future.year ?? null, note: c.future.note ?? null, source: { name: c.future.sourceName ?? null, url: c.future.sourceUrl ?? null, verifiedAt: c.future.verifiedAt ?? null },
      automationImpact: c.automationImpact ?? null, recommendedCountries: c.recommendedCountries ?? [],
    }));
}

