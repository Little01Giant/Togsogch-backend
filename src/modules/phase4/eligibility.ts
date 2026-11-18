/** Элсэлтийн шаардлагын шалгагч (цэвэр функц). Элсэлтийн баталгаа БИШ. */
export interface Requirement { kind: string; minScore?: number | null; note?: string; required?: boolean }
export interface ApplicantProfile { educationLevel?: string; gpa?: number; ielts?: number; toefl?: number; sat?: number; act?: number; gre?: number; gmat?: number; documents?: string[] }
export type ItemStatus = 'satisfied' | 'not_met' | 'uncertain';
export type Overall = 'satisfied' | 'additional' | 'not_satisfied' | 'insufficient';

const NUMERIC = ['ielts', 'toefl', 'sat', 'act', 'gre', 'gmat', 'gpa'] as const;
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9а-яөү]+/g, '');

export function checkEligibility(reqs: Requirement[], p: ApplicantProfile) {
  const items = reqs.map((r) => {
    const key = norm(r.kind);
    const optional = r.required === false;
    const numKey = NUMERIC.find((n) => key === n || key.startsWith(n));
    let status: ItemStatus; let detail: string;
    if (numKey) {
      const have = (p as any)[numKey] as number | undefined;
      if (r.minScore == null) { status = 'uncertain'; detail = 'Доод оноог эх сурвалжид заагаагүй тул үнэлэх боломжгүй.'; }
      else if (have == null || Number.isNaN(have)) { status = 'uncertain'; detail = `Таны ${numKey.toUpperCase()} оноо оруулаагүй (шаардлага: ${r.minScore}).`; }
      else if (have >= r.minScore) { status = 'satisfied'; detail = `Таны оноо ${have} ≥ ${r.minScore}.`; }
      else { status = 'not_met'; detail = `Таны оноо ${have} < шаардлагатай ${r.minScore}.`; }
    } else {
      const have = (p.documents ?? []).some((d) => { const n = norm(d); return n && (n.includes(key) || key.includes(n)); });
      if (have) { status = 'satisfied'; detail = 'Та бэлэн гэж тэмдэглэсэн.'; }
      else { status = 'uncertain'; detail = 'Бэлтгэсэн эсэхийг оруулаагүй — хөтөлбөрийн албан ёсны хуудсаар нягтална уу.'; }
    }
    return { kind: r.kind, minScore: r.minScore ?? null, note: r.note ?? null, optional, status, detail };
  });
  const blocking = items.filter((i) => !i.optional);
  let overall: Overall;
  if (!reqs.length) overall = 'insufficient';
  else if (blocking.some((i) => i.status === 'not_met')) overall = 'not_satisfied';
  else if (blocking.some((i) => i.status === 'uncertain')) overall = 'additional';
  else overall = blocking.length ? 'satisfied' : 'insufficient';
  return { overall, items };
}
