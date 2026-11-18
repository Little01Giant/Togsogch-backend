import { ReportSchool, ReportTuition, TUITION_REPORT_NAME } from '../../seed/tuition-report';

/** Тайлангийн нэг дүнг сургуулийн tuition бичлэг болгоно. Хүрээтэй (min–max) дүн = тооцоолол (isEstimate). Ханш хөрвүүлэхгүй, баталгаажаагүй. */
export function reportEntry(school: ReportSchool, t: ReportTuition) {
  const range = t.max != null && t.max > t.min;
  const parts = [`${school.report ?? TUITION_REPORT_NAME}. Баталгаажаагүй, хоёрдогч эх сурвалж`];
  if (school.cited) parts.push(`Тайланд дурдсан: ${school.cited}`);
  if (t.estimated) parts.push('Тайланд «Estimated» (тооцоолол) гэж тэмдэглэсэн — эх сурвалжгүй, албан ёсны хуудсаар заавал шалгана');
  if (range) parts.push(`Хөтөлбөрөөс хамаарсан хүрээ: ${t.min}–${t.max} ${t.currency}`);
  if (t.note) parts.push(t.note);
  return {
    level: t.level,
    academicYear: t.academicYear,
    currency: t.currency,
    annualFee: t.min,
    ...(range ? { annualFeeMax: t.max } : {}),
    feeType: 'international',
    otherFees: parts.join('. '),
    isEstimate: range || !!t.estimated,
  };
}

/** existing-д тухайн түвшний тоон дүн (албан ёсны цуглуулсан) байвал дарахгүй, зөвхөн дутууг нэмнэ. */
export function mergeReportTuition(existing: any[], school: ReportSchool): { tuition: any[]; added: string[]; skipped: string[] } {
  const tuition = [...(existing ?? [])];
  const added: string[] = [];
  const skipped: string[] = [];
  for (const t of school.tuition) {
    const has = tuition.some((e) => e.level === t.level && typeof e.annualFee === 'number');
    if (has) { skipped.push(t.level); continue; }
    tuition.push(reportEntry(school, t));
    added.push(t.level);
  }
  return { tuition, added, skipped };
}
