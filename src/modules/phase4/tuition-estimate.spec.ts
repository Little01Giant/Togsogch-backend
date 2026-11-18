import { computeTuitionEstimate, MIN_SAMPLES, officialEstimate } from './tuition-estimate';

const s = (fee: number, currency = 'GBP', level = 'bachelor') => [{ level, currency, annualFee: fee }];

describe('computeTuitionEstimate', () => {
  it('валют тус бүрээр min/median/max, сургуулийн тоотой', () => {
    const e = computeTuitionEstimate([s(20000), s(30000), s(25000), s(40000)])!;
    expect(e.items).toEqual([{ currency: 'GBP', n: 4, min: 20000, median: 27500, max: 40000 }]);
    expect(e.level).toBe('bachelor');
  });

  it(`${MIN_SAMPLES}-аас цөөн сургуулийн дүнгээс хүрээ гаргахгүй`, () => {
    expect(computeTuitionEstimate([s(20000), s(30000)])).toBeNull();
  });

  it('магистр, валютгүй, сөрөг, тоо биш утгыг оруулахгүй', () => {
    const e = computeTuitionEstimate([s(1, 'GBP', 'master'), [{ level: 'bachelor', annualFee: 5 }], [{ level: 'bachelor', currency: 'GBP', annualFee: -3 }], s(10), s(20), s(30)])!;
    expect(e.items[0]).toMatchObject({ n: 3, min: 10, max: 30 });
  });

  it('нэг сургуульд хэд хэдэн бичлэг байвал хамгийн багыг нэг удаа тоолж, дээд хязгаарт хамгийн өндрийг авна', () => {
    const e = computeTuitionEstimate([[...s(50), ...s(10)], s(20), s(30)])!;
    expect(e.items[0]).toMatchObject({ n: 3, min: 10, max: 50 });
  });

  it('хүрээтэй (annualFeeMax) дүнгийн дээд хязгаарыг max-д тооцно', () => {
    const e = computeTuitionEstimate([[{ level: 'bachelor', currency: 'GBP', annualFee: 20000, annualFeeMax: 50000 }], s(25000), s(30000)])!;
    expect(e.items[0]).toMatchObject({ n: 3, min: 20000, max: 50000 });
  });

  it('Швед, Дани-д албан ёсны эх сурвалжтай хүрээ буцаана, бусад улсад null', () => {
    const se: any = officialEstimate('sweden');
    expect(se.items[0]).toMatchObject({ currency: 'SEK', min: 80000, max: 320000 });
    expect(se.sourceUrl).toMatch(/^https:\/\//);
    expect(officialEstimate('denmark')!.items[0]).toMatchObject({ currency: 'EUR', min: 10800, max: 17300 });
    expect(officialEstimate('usa')).toBeNull();
  });

  it('төлбөргүй (0) утгыг хүлээн авна, олон валют тусдаа', () => {
    const e = computeTuitionEstimate([s(0, 'EUR'), s(1500, 'EUR'), s(3000, 'EUR'), s(5, 'USD'), s(6, 'USD')])!;
    expect(e.items).toHaveLength(1);
    expect(e.items[0]).toMatchObject({ currency: 'EUR', min: 0, median: 1500, max: 3000 });
  });
});
