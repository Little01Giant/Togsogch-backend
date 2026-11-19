import { parseUniversityRow, ParsedRow } from './import';

/** QS-ээс авсан жагсаалт + албан ёсны сайтаас уншсан баяжуулалтыг их сургуулийн бичлэг болгох цэвэр логик (IO-гүй). */

export const QS_SOURCE_NAME = 'QS World University Rankings 2027';

/** Хашилттай талбар, мөр доторх таслал, давхар хашилтыг дэмжих энгийн CSV задлагч. */
export function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cur = '';
  let q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) {
      if (ch === '"' && text[i + 1] === '"') { cur += '"'; i++; }
      else if (ch === '"') q = false;
      else cur += ch;
    } else if (ch === '"') q = true;
    else if (ch === ',') { row.push(cur); cur = ''; }
    else if (ch === '\n') { row.push(cur); rows.push(row); row = []; cur = ''; }
    else if (ch !== '\r') cur += ch;
  }
  if (cur || row.length) { row.push(cur); rows.push(row); }
  const [head, ...body] = rows.filter((r) => r.length > 1 || r[0]);
  if (!head) return [];
  return body.map((r) => Object.fromEntries(head.map((h, i) => [h, r[i] ?? ''])));
}

const INTAKE_TOKENS: Record<string, string> = { autumn: 'fall', fall: 'fall', spring: 'spring', summer: 'summer', winter: 'winter' };
const ESTIMATE_HINT = /(\bx\b|×|multipl|\bsum\b|estimate|assum|infer|outdated|\bdraft\b|per[- ]quarter|per[- ]semester|per[- ]session|per[- ]term|per unit|computed|derived|doubled|approximate)/i;
const TUITION_LEVELS = ['bachelor', 'master'];

export interface BuiltUniversity {
  parsed: ParsedRow;
  tuition: any[];
  admission?: Record<string, any>;
  languagesOfInstruction: string[];
  intakes: string[];
  warnings: string[];
}

const splitList = (v?: string) => (v ?? '').split(/[;,]/).map((s) => s.trim()).filter(Boolean);
const isHttps = (v?: string) => /^https:\/\/\S+$/.test(v ?? '');

/** list = universities-top600-list.csv мөр, enrich = top100-merged.csv мөр (заавал биш). */
export function buildUniversity(list: Record<string, string>, enrich?: Record<string, string>, wikidata?: Record<string, string>): { ok: true; value: BuiltUniversity } | { ok: false; name: string; errors: string[] } {
  const warnings: string[] = [];
  // Wikidata-аас: албан ёсны сайт, байгуулагдсан он, төрөл. Зөвхөн ойлгомжтой утгыг авна, бусдыг хоосон үлдээнэ.
  const wd = wikidata ?? {};
  const year = /^\d{3,4}$/.test(wd.foundedYear ?? '') && Number(wd.foundedYear) >= 700 && Number(wd.foundedYear) <= 2026 ? wd.foundedYear : '';
  const p = parseUniversityRow({
    name: list.name,
    countrySlug: list.countrySlug,
    city: list.city,
    website: /^https?:\/\/\S+$/.test(wd.website ?? '') ? wd.website : '',
    type: wd.type === 'public' || wd.type === 'private' ? wd.type : '',
    foundedYear: year,
    sourceName: QS_SOURCE_NAME,
    sourceUrl: list.rankSourceUrl,
    academicYear: String(list.rankYear ?? ''),
    rankProvider: list.rankProvider,
    rank: list.rank,
    rankText: list.rankText,
    rankYear: list.rankYear,
    rankEdition: list.rankEdition,
    rankSourceUrl: list.rankSourceUrl,
  });
  if (!p.ok) return { ok: false, name: list.name, errors: p.errors };
  // Энэ бичлэгийн эх сурвалж нь ранкингийн жагсаалт (сургуулийн албан ёсны хуудас биш) — баталгаажаагүй.
  p.value.doc.source = { ...p.value.doc.source, sourceType: 'ranking_provider', reliabilityStatus: 'secondary', verificationStatus: 'unverified' };

  const tuition: any[] = [];
  let admission: Record<string, any> | undefined;
  let languagesOfInstruction: string[] = [];
  let intakes: string[] = [];

  if (enrich) {
    const amount = enrich.tuitionAmount && /^\d+(\.\d+)?$/.test(enrich.tuitionAmount) ? Number(enrich.tuitionAmount) : undefined;
    if (amount != null) {
      if (!TUITION_LEVELS.includes(enrich.tuitionLevel)) warnings.push('tuitionLevel буруу — төлбөр алгасав');
      else if (!/^[A-Z]{3}$/.test(enrich.tuitionCurrency ?? '')) warnings.push('tuitionCurrency буруу — төлбөр алгасав');
      else if (!isHttps(enrich.tuitionSourceUrl)) warnings.push('tuitionSourceUrl (https) байхгүй — төлбөр алгасав');
      else {
        // Ханшийг зохиохгүй: annualFeeUsd-ийг ТОГТООХГҮЙ (USD-ээр шүүх/эрэмбэлэхэд ороогүй). Анхны валютаараа хадгална.
        tuition.push({
          level: enrich.tuitionLevel,
          academicYear: enrich.tuitionAcademicYear || undefined,
          currency: enrich.tuitionCurrency,
          annualFee: amount,
          feeType: 'international',
          otherFees: enrich.tuitionNote || undefined,
          isEstimate: ESTIMATE_HINT.test(`${enrich.tuitionNote ?? ''} ${enrich.notes ?? ''}`),
          sourceUrl: enrich.tuitionSourceUrl,
        });
      }
    }
    const englishTests: any[] = [];
    if (enrich.ieltsMin && /^\d+(\.\d+)?$/.test(enrich.ieltsMin)) englishTests.push({ test: 'IELTS', minScore: enrich.ieltsMin });
    if (enrich.toeflMin && /^\d+(\.\d+)?$/.test(enrich.toeflMin)) englishTests.push({ test: 'TOEFL', minScore: enrich.toeflMin });
    const links = isHttps(enrich.admissionSourceUrl) ? [{ title: 'Admissions', url: enrich.admissionSourceUrl }] : [];
    if (englishTests.length || links.length) admission = { englishTests, applicationLinks: links };
    languagesOfInstruction = splitList(enrich.languagesOfInstruction);
    intakes = [...new Set(splitList(enrich.intakes).map((s) => INTAKE_TOKENS[s.toLowerCase()]).filter(Boolean))];
  }
  return { ok: true, value: { parsed: p.value, tuition, admission, languagesOfInstruction, intakes, warnings } };
}
