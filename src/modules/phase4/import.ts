import { slugify } from '../../common/slug';

const list = (v: any) => (v == null || v === '' ? [] : String(v).split(/[;|]/).map((s) => s.trim()).filter(Boolean));
const num = (v: any) => (v == null || v === '' || isNaN(Number(v)) ? undefined : Number(v));
const DEG = ['language_prep', 'foundation', 'bachelor', 'master', 'phd'];
const PROV = ['QS_WORLD', 'QS_ASIA', 'THE_WORLD', 'THE_ASIA', 'ARWU', 'OTHER'];

export interface ParsedRow { slug: string; doc: any; ranking?: any; tuition?: any; countrySlug: string }

/** CSV/JSON мөрийг их сургуулийн бичлэг болгож шалгана. Эх сурвалж (sourceUrl) заавал. */
export function parseUniversityRow(row: Record<string, any>): { ok: true; value: ParsedRow } | { ok: false; errors: string[] } {
  const errors: string[] = [];
  const name = String(row.name ?? '').trim();
  const countrySlug = String(row.countrySlug ?? '').trim();
  if (!name) errors.push('name шаардлагатай');
  if (!countrySlug) errors.push('countrySlug шаардлагатай');
  const sourceUrl = String(row.sourceUrl ?? '').trim();
  if (!/^https?:\/\//i.test(sourceUrl)) errors.push('sourceUrl (http/https) шаардлагатай — эх сурвалжгүй мэдээлэл оруулахгүй');
  for (const k of ['website', 'logoUrl']) if (row[k] && !/^https?:\/\//i.test(String(row[k]))) errors.push(`${k}: http(s):// байх ёстой`);
  if (row.type && !['public', 'private'].includes(row.type)) errors.push('type: public | private');
  const levels = list(row.degreeLevels);
  if (levels.some((l) => !DEG.includes(l))) errors.push(`degreeLevels: ${DEG.join(', ')}`);

  let ranking: any;
  if (row.rankProvider || row.rank || row.rankYear) {
    if (!PROV.includes(row.rankProvider)) errors.push(`rankProvider: ${PROV.join(', ')}`);
    if (num(row.rank) == null && !row.rankText) errors.push('rank (тоо) эсвэл rankText шаардлагатай');
    if (num(row.rankYear) == null) errors.push('rankYear шаардлагатай');
    if (!/^https?:\/\//i.test(String(row.rankSourceUrl ?? ''))) errors.push('rankSourceUrl шаардлагатай');
    ranking = { provider: row.rankProvider, rank: num(row.rank), rankText: row.rankText || undefined, year: num(row.rankYear), edition: row.rankEdition || undefined, sourceUrl: row.rankSourceUrl };
  }
  let tuition: any;
  if (row.tuitionLevel || row.tuitionAnnualUsd) {
    if (!DEG.includes(row.tuitionLevel)) errors.push(`tuitionLevel: ${DEG.join(', ')}`);
    if (num(row.tuitionAnnualUsd) == null) errors.push('tuitionAnnualUsd (тоо) шаардлагатай');
    if (!row.tuitionAcademicYear) errors.push('tuitionAcademicYear шаардлагатай');
    if (!/^https?:\/\//i.test(String(row.tuitionSourceUrl ?? ''))) errors.push('tuitionSourceUrl шаардлагатай');
    tuition = { level: row.tuitionLevel, currency: 'USD', annualFee: num(row.tuitionAnnualUsd), annualFeeUsd: num(row.tuitionAnnualUsd), academicYear: row.tuitionAcademicYear, feeType: 'international', sourceUrl: row.tuitionSourceUrl };
  }
  if (errors.length) return { ok: false, errors };
  const doc: any = {
    name, nameMn: row.nameMn || undefined, city: row.city || undefined, website: row.website || undefined, type: row.type || undefined, foundedYear: num(row.foundedYear),
    description: row.description || undefined, degreeLevels: levels.length ? levels : undefined, subjects: list(row.subjects).length ? list(row.subjects) : undefined,
    source: { sourceName: row.sourceName || undefined, sourceUrl, sourceType: 'official_university', academicYear: row.academicYear || undefined, fetchedAt: new Date(), lastUpdatedAt: new Date(), verificationStatus: 'unverified', reliabilityStatus: 'primary' },
  };
  Object.keys(doc).forEach((k) => doc[k] === undefined && delete doc[k]);
  return { ok: true, value: { slug: slugify(name), doc, ranking, tuition, countrySlug } };
}
