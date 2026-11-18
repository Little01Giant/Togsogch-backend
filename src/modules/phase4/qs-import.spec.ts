import { buildUniversity, parseCsv, QS_SOURCE_NAME } from './qs-import';

const list = {
  order: '1', name: 'Example University', countrySlug: 'usa', city: 'Cambridge', rankProvider: 'QS_WORLD', rank: '1', rankText: '',
  rankEdition: 'QS World University Rankings 2027', rankYear: '2026', rankSourceUrl: 'https://www.topuniversities.com/world-university-rankings',
};

describe('parseCsv', () => {
  it('quoted comma, doubled quote, CRLF', () => {
    const rows = parseCsv('a,b\r\n"x, y","say ""hi"""\r\n');
    expect(rows).toEqual([{ a: 'x, y', b: 'say "hi"' }]);
  });
});

describe('buildUniversity', () => {
  it('QS жагсаалтаас ранкинг + баталгаажаагүй эх сурвалжтай бичлэг гаргана', () => {
    const r: any = buildUniversity(list);
    expect(r.ok).toBe(true);
    expect(r.value.parsed.ranking).toMatchObject({ provider: 'QS_WORLD', rank: 1, year: 2026 });
    expect(r.value.parsed.doc.source).toMatchObject({ sourceName: QS_SOURCE_NAME, sourceType: 'ranking_provider', verificationStatus: 'unverified', reliabilityStatus: 'secondary' });
    expect(r.value.tuition).toEqual([]);
  });

  it('ranking URL-гүй мөрийг няцаана', () => {
    expect(buildUniversity({ ...list, rankSourceUrl: '' }).ok).toBe(false);
  });

  it('төлбөрийг анхны валютаар хадгалж USD болон ханшийг зохиохгүй', () => {
    const r: any = buildUniversity(list, { tuitionLevel: 'bachelor', tuitionAmount: '45500', tuitionCurrency: 'GBP', tuitionAcademicYear: '2026/2027', tuitionNote: 'varies by department', tuitionSourceUrl: 'https://example.edu/fees' });
    expect(r.value.tuition).toHaveLength(1);
    expect(r.value.tuition[0]).toMatchObject({ level: 'bachelor', currency: 'GBP', annualFee: 45500, feeType: 'international', isEstimate: false });
    expect(r.value.tuition[0].annualFeeUsd).toBeUndefined();
  });

  it('үржүүлж гаргасан дүнг estimate гэж тэмдэглэнэ', () => {
    const r: any = buildUniversity(list, { tuitionLevel: 'bachelor', tuitionAmount: '67731', tuitionCurrency: 'USD', tuitionNote: '3 quarters x $22577 (my sum)', tuitionSourceUrl: 'https://example.edu/fees' });
    expect(r.value.tuition[0].isEstimate).toBe(true);
  });

  it('эх сурвалж/валют/түвшин буруу төлбөрийг алгасаж анхааруулна, бичлэгийг унагахгүй', () => {
    const r: any = buildUniversity(list, { tuitionLevel: 'bachelor', tuitionAmount: '1000', tuitionCurrency: 'GBP', tuitionSourceUrl: 'http://example.edu' });
    expect(r.ok).toBe(true);
    expect(r.value.tuition).toEqual([]);
    expect(r.value.warnings.join(' ')).toMatch(/tuitionSourceUrl/);
    expect(buildUniversity(list, { tuitionLevel: 'phd', tuitionAmount: '1000', tuitionCurrency: 'GBP', tuitionSourceUrl: 'https://x.edu' }).ok).toBe(true);
  });

  it('Wikidata-ийн сайт, он, төрлийг зөвхөн зөв утгатай үед авна', () => {
    const ok: any = buildUniversity(list, undefined, { website: 'https://www.example.edu/', foundedYear: '1861', type: 'public' });
    expect(ok.value.parsed.doc).toMatchObject({ website: 'https://www.example.edu/', foundedYear: 1861, type: 'public' });
    const bad: any = buildUniversity(list, undefined, { website: 'javascript:alert(1)', foundedYear: '12', type: 'weird' });
    expect(bad.ok).toBe(true);
    expect(bad.value.parsed.doc.website).toBeUndefined();
    expect(bad.value.parsed.doc.foundedYear).toBeUndefined();
    expect(bad.value.parsed.doc.type).toBeUndefined();
  });

  it('төлбөргүй хоосон мөр дээр tuition=[] , тоогүй дүн алгасагдана', () => {
    const r: any = buildUniversity(list, { tuitionLevel: 'bachelor', tuitionAmount: '2,000', tuitionCurrency: 'EUR', tuitionSourceUrl: 'https://x.edu' });
    expect(r.value.tuition).toEqual([]);
  });

  it('англи хэл, хугацаа, холбоосыг admission (төлбөртэй хэсэг)-д, улирлыг enum-д буулгана', () => {
    const r: any = buildUniversity(list, { ieltsMin: '6.5', toeflMin: '', applicationDeadlines: 'Jan 15', admissionSourceUrl: 'https://x.edu/apply', intakes: 'autumn;Spring;september', languagesOfInstruction: 'English;French' });
    expect(r.value.admission.englishTests).toEqual([{ test: 'IELTS', minScore: '6.5' }]);
    expect(r.value.admission.deadlines).toEqual([{ label: 'Application', date: 'Jan 15' }]);
    expect(r.value.admission.applicationLinks).toEqual([{ title: 'Admissions', url: 'https://x.edu/apply' }]);
    expect(r.value.intakes).toEqual(['fall', 'spring']);
    expect(r.value.languagesOfInstruction).toEqual(['English', 'French']);
    expect(r.value.parsed.doc.degreeLevels).toBeUndefined();
  });
});
