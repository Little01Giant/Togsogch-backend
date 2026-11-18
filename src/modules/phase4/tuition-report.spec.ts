import { TUITION_REPORT } from '../../seed/tuition-report';
import { mergeReportTuition, reportEntry } from './tuition-report';

const yale = TUITION_REPORT.find((s) => s.name === 'Yale University')!;
const uiuc = TUITION_REPORT.find((s) => s.name.startsWith('University of Illinois'))!;

describe('tuition report data', () => {
  it('нэр давхцаагүй, min ≤ max, валют ISO', () => {
    const names = TUITION_REPORT.map((s) => s.name);
    expect(new Set(names).size).toBe(names.length);
    for (const s of TUITION_REPORT) for (const t of s.tuition) {
      expect(/^[A-Z]{3}$/.test(t.currency)).toBe(true);
      expect(t.min).toBeGreaterThanOrEqual(0);
      if (t.max != null) expect(t.max).toBeGreaterThan(t.min);
    }
  });

  it('«Estimated» дүн isEstimate=true, ганц дүн (Zurich) хүртэл; тайлбарт сануулгатай', () => {
    const oxford = TUITION_REPORT.find((s) => s.name === 'University of Oxford')!;
    const zurich = TUITION_REPORT.find((s) => s.name === 'University of Zurich')!;
    expect(reportEntry(oxford, oxford.tuition[0])).toMatchObject({ annualFee: 33000, annualFeeMax: 45000, isEstimate: true });
    expect(reportEntry(zurich, zurich.tuition[0])).toMatchObject({ annualFee: 1500, isEstimate: true });
    expect(reportEntry(oxford, oxford.tuition[0]).otherFees).toMatch(/Estimated/);
  });
});

describe('reportEntry / mergeReportTuition', () => {
  it('хүрээтэй дүн isEstimate, annualFeeMax-тай; ганц дүн isEstimate=false', () => {
    expect(reportEntry(uiuc, uiuc.tuition[0])).toMatchObject({ level: 'bachelor', currency: 'USD', annualFee: 42248, annualFeeMax: 53078, isEstimate: true, feeType: 'international' });
    expect(reportEntry(yale, yale.tuition[0])).toMatchObject({ annualFee: 72500, academicYear: '2026/2027', isEstimate: false });
    expect(reportEntry(yale, yale.tuition[0]).otherFees).toMatch(/Баталгаажаагүй/);
  });

  it('албан ёсны цуглуулсан дүн байвал дарахгүй, дутуу түвшнийг л нэмнэ', () => {
    const official = [{ level: 'bachelor', annualFee: 99999, currency: 'USD', sourceUrl: 'https://x.edu' }];
    const r = mergeReportTuition(official, yale);
    expect(r.skipped).toEqual(['bachelor']);
    expect(r.added).toEqual(['master']);
    expect(r.tuition[0].annualFee).toBe(99999);
    expect(r.tuition).toHaveLength(2);
  });

  it('идемпотент: дахин ажиллуулахад давхар нэмэхгүй', () => {
    const once = mergeReportTuition([], yale).tuition;
    const twice = mergeReportTuition(once, yale);
    expect(twice.added).toEqual([]);
    expect(twice.tuition).toHaveLength(2);
  });
});
