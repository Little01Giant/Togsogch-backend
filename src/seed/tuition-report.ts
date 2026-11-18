/** Хэрэглэгчийн өгсөн судалгааны тайлан «Global Higher Education Economics: Comparative Analysis of International Tuition and Living Costs» (2026-11-11).
 *  Тайлангийн БҮХ дүн орно. Тайланд «(Estimated)» гэж тэмдэглэснийг `estimated: true` гэж тэмдэглэж, «тооцоолол» гэж харуулна (эх сурвалжгүй, баталгаагүй).
 *  Бүх дүн баталгаажаагүй, хоёрдогч эх сурвалж (тайлан). Сургуулийн өөрийн албан ёсны дүн (цуглуулсан) байвал дарахгүй. */
export const TUITION_REPORT_NAME = 'Судалгааны тайлан «Global Higher Education Economics» (2026-11-11, хэрэглэгчээс)';

export interface ReportTuition { level: 'bachelor' | 'master'; currency: string; min: number; max?: number; academicYear?: string; note?: string; estimated?: boolean }
const E = true;
export const TUITION_REPORT_2_NAME = 'Судалгааны тайлан №2 «Global Higher Education Financial Dynamics» (2026-11-11, хэрэглэгчээс)';
export const TUITION_REPORT_3_NAME = 'Судалгааны тайлан №3 «Дэлхийн дээд боловсролын санхүүгийн архитектур» (2026-11-11, хэрэглэгчээс)';
export interface ReportSchool { name: string; cited?: string; report?: string; tuition: ReportTuition[] }
export const TUITION_REPORT_4_NAME = 'Судалгааны тайлан №4 «Global Higher Education Financial Dynamics … 36 Institutions» (2026-11-11, хэрэглэгчээс)';
export const TUITION_REPORT_5_NAME = 'Судалгааны тайлан №5 «Дээд Боловсролын Зардлын Глобал Анализ … 38 сургууль» (2026-11-14, хэрэглэгчээс)';
const R2 = TUITION_REPORT_2_NAME;
const R3 = TUITION_REPORT_3_NAME;
const R4 = TUITION_REPORT_4_NAME;
export const TUITION_REPORT_6_NAME = 'Судалгааны тайлан №6 «Дээд Боловсролын Зардлын Глобал Индекс … 56 сургууль» (2026-11-14, хэрэглэгчээс)';
const R5 = TUITION_REPORT_5_NAME;
const R6 = TUITION_REPORT_6_NAME;
const sym = (b: [number, number?], m: [number, number?], currency: string, estimated?: boolean): ReportTuition[] => [
  { level: 'bachelor', currency, min: b[0], max: b[1], estimated }, { level: 'master', currency, min: m[0], max: m[1], estimated } ];
const free = (name: string): ReportSchool => ({ name, report: R6, cited: 'Semesterbeitrag ~300–760 EUR/жил (сургалтын төлбөр байхгүй)', tuition: sym([0], [0], 'EUR') });

export const TUITION_REPORT_7_NAME = 'Судалгааны тайлан №7 «Дээд Боловсролын Зардлын Глобал Индекс … 55 сургууль» (2026-11-14, хэрэглэгчээс)';
const R7 = TUITION_REPORT_7_NAME;
/** Тайлан №7: [бакалавр, магистр] хүрээ, дотуур байрны жилийн зардал (тайлбарт). null = тайланд тухайн түвшний дүн байхгүй. */
const s7 = (name: string, cur: string, b: [number, number?] | null, m: [number, number?] | null, dorm: string, est?: { b?: boolean; m?: boolean }, note?: string): ReportSchool => {
  const d = `Дотуур байр/орон сууц (жилд): ${dorm}${note ? `. ${note}` : ''}`;
  const tuition: ReportTuition[] = [];
  if (b) tuition.push({ level: 'bachelor', currency: cur, min: b[0], max: b[1], estimated: est?.b, note: d });
  if (m) tuition.push({ level: 'master', currency: cur, min: m[0], max: m[1], estimated: est?.m, note: d });
  return { name, report: R7, tuition };
};
const LT50 = 'Тайланд «<50,000 INR» — дээд хязгаар, яг дүн биш';
const R7_SCHOOLS: ReportSchool[] = [
  s7('University of Oregon', 'USD', [39150, 40464], [25000, 35000], '15,909–25,940 USD (дотуур байр+хоол)'),
  s7('University of South Carolina', 'USD', [37674], [20000, 30000], '12,634 USD', { m: E }),
  s7('Syracuse University', 'USD', [66720], [30000, 45000], '15,817–22,944 USD'),
  s7('Brandeis University', 'USD', [66939], null, '13,363 USD', undefined, 'Тайланд магистр/докторт бүрэн тэтгэлэг + ~36,000 USD цалин гэж дурдсан'),
  s7('Missouri University of Science and Technology', 'USD', [26900], [20000, 30000], '10,000–14,000 USD', { b: E }),
  s7('University of South Florida', 'USD', [24652], [18000, 25000], '10,649 USD'),
  s7('Georgia State University', 'USD', [30100], [22000, 30000], '13,787 USD'),
  s7('University of Maryland, Baltimore', 'USD', [25000, 35000], [15800, 17300], '12,000–16,000 USD'),
  s7('University of Nebraska - Lincoln', 'USD', [27748], [20000, 28000], '15,986 USD'),
  s7('Wake Forest University', 'USD', [39970, 67000], [30000, 45000], '4,371–14,000 USD'),
  s7('The New School', 'USD', [56244], [35000, 45000], '15,000–22,000 USD'),
  s7('De Montfort University', 'GBP', [14000, 16000], [14000, 16000], '5,000–8,000 GBP'),
  s7('Liverpool John Moores University', 'GBP', [16000, 18000], [16000, 18000], '4,040–8,820 GBP'),
  s7('University of Lincoln', 'GBP', [14000, 16000], [14000, 16000], '5,000–8,000 GBP'),
  s7('University of Westminster', 'GBP', [15000], [15000], '9,000–15,000 GBP', { b: E, m: E }, 'Тайланд «15,000 GBP ба түүнээс дээш»'),
  s7('Australian Catholic University', 'AUD', [32000, 49000], [32000, 49000], '10,000–18,000 AUD'),
  s7('Technische Universität Braunschweig', 'EUR', [0], [0], '3,600–6,000 EUR', undefined, 'Семестрийн нийгмийн хураамж ~600–800 EUR/жил'),
  s7('University of Hohenheim', 'EUR', [3000], [3000], '3,600–6,000 EUR', undefined, 'Баден-Вюртемберг мужийн EU-гүй оюутны төлбөр 1,500 EUR/семестр'),
  s7('Montanuniversität Leoben', 'EUR', [1452], [1452], '3,500–5,500 EUR', { b: E, m: E }, 'EU-гүй оюутан ~726 EUR/семестр'),
  ...(['University of Bari', 'University of Messina (UniME)', 'University of Calabria', 'University of Salerno', 'University of Palermo'] as const).map((n) => s7(n, 'EUR', [156, 3000], [156, 3000], '2,400–4,200 EUR (өмнөд Итали)')),
  ...(['Verona University', 'University of Modena and Reggio Emilia', 'Università degli studi Roma Tre', 'Università degli Studi della Tuscia (University of Tuscia)'] as const).map((n) => s7(n, 'EUR', [156, 3000], [156, 3000], '4,200–7,200 EUR (хойд/төв Итали)')),
  ...(['Universidad de Zaragoza', 'Universidad de Alcalá', 'Universidade de Vigo'] as const).map((n) => s7(n, 'EUR', [750, 3500], [750, 3500], '4,320–7,800 EUR')),
  s7('Université de Rennes', 'EUR', [2770], [3770], '3,000–5,000 EUR'),
  s7('Palacký University Olomouc', 'EUR', [2000, 5000], [2000, 5000], '2,000–3,500 EUR'),
  ...(['Soochow University', 'Lanzhou University', 'Beijing Forestry University', 'Ocean University of China', 'Xidian University'] as const).map((n) => s7(n, 'CNY', [16000, 35000], [20000, 35000], '4,000–10,000 RMB')),
  s7('Chonnam National University', 'KRW', [3400000, 4600000], [5300000], '1,500–3,000 USD', { m: E }),
  s7('Chungnam National University', 'KRW', [3400000, 4600000], [5300000], '1,500–3,000 USD', { m: E }),
  s7('Yeungnam University', 'USD', [5700, 8500], [6700, 8600], '1,500–3,000 USD'),
  s7('Tokyo University of Science', 'JPY', [800000, 1200000], [800000, 1200000], '500,000–800,000 JPY', { b: E, m: E }),
  ...(['Jadavpur University', 'Bharathiar University', 'Savitribai Phule Pune University', 'University of Hyderabad'] as const).map((n) => s7(n, 'INR', [50000], [50000], '<50,000 INR (дээд хязгаар)', { b: E, m: E }, LT50)),
  s7('Thapar Institute of Engineering & Technology', 'INR', [1096000, 2056000], [103000, 285000], '100,000–220,000 INR'),
  s7('Lovely Professional University (LPU)', 'INR', [450000, 3600000], null, '100,000–220,000 INR'),
  s7('Saveetha Institute of Medical And Technical Sciences (SIMATS), Tamil Nadu, India', 'INR', [150000, 15000000], null, '100,000–200,000 INR', undefined, 'Дээд хязгаар нь MBBS (~1.5 крор INR)'),
  s7('Manipal Academy of Higher Education', 'INR', [150000, 7078000], [1210000, 10200000], '100,000–200,000 INR', undefined, 'MBBS 7,078,000 INR; MD 1.21M–10.2M INR'),
  ...(['Plekhanov Russian University of Economics', 'National Research Tomsk Polytechnic University', 'Sechenov University'] as const).map((n) => s7(n, 'USD', [3000, 6000], [4000, 8000], '100–1,200 USD')),
];

export const TUITION_REPORT_8_NAME = 'Судалгааны тайлан №8 «Глобальный индекс стоимости высшего образования … 7 сургууль» (2026-11-14, хэрэглэгчээс)';
const s8 = (name: string, cur: string, b: [number, number?] | null, m: [number, number?] | null, dorm: string, est?: { b?: boolean; m?: boolean }, note?: string): ReportSchool => {
  const r = s7(name, cur, b, m, dorm, est, note);
  return { ...r, report: TUITION_REPORT_8_NAME };
};
const R8_SCHOOLS: ReportSchool[] = [
  s8('Johannes Gutenberg Universität Mainz', 'EUR', [0], [0], '4,236–5,700 EUR (Studierendenwerk)', undefined, 'Семестрийн нийгмийн хураамж ~716–734 EUR/жил; блоклосон данс 11,904 EUR'),
  s8('Universität Potsdam', 'EUR', [0], [0], '3,600–4,800 EUR (Studierendenwerk)', undefined, 'Семестрийн нийгмийн хураамж ~745–800 EUR/жил; блоклосон данс 11,904 EUR'),
  s8('University of Houston', 'USD', [27482, 28593], [19231], '11,286–16,614 USD (хоолтой)', undefined, 'Магистр: 18,199 USD + 1,032 USD хураамж'),
  s8('China University of Petroleum, Beijing', 'CNY', [25000], [29000, 31000], '14,400–18,000 RMB', undefined, 'Магистр: хятад хэлээр 29,000, англиар 31,000 RMB'),
  s8('Manchester Metropolitan University', 'GBP', [20000, 21500], [21000, 22500], '7,037–10,472 GBP (44 долоо хоног)', undefined, '2027/28 хичээлийн жил; IHS 776 GBP/жил'),
  s8('Temple University', 'USD', [39000], [39000], '~18,000 USD (дотуур байр+хоол)', { b: E, m: E }, 'Тайланд «~39,000 USD» (tuition & fees, АНУ-ын бус оршин суугч)'),
  s8('Williams College', 'USD', [76300], [62100], '19,320 USD (байр 9,830 + хоол 9,490)', undefined, 'Магистр = CDE 10 сарын хөтөлбөр (байр+хоол 17,180 USD). Бакалаврын нийт зардал 95,960 USD; тусламжтай «цэвэр үнэ» дунджаар 17,716 USD'),
];

export const TUITION_REPORT: ReportSchool[] = [
  { name: 'University of Illinois Urbana-Champaign', cited: 'registrar.illinois.edu, admissions.illinois.edu', tuition: [
    { level: 'bachelor', currency: 'USD', min: 42248, max: 53078 }, { level: 'master', currency: 'USD', min: 30356, max: 51188 } ] },
  { name: 'Pennsylvania State University', cited: 'psu.edu, sia.psu.edu', tuition: [
    { level: 'bachelor', currency: 'USD', min: 44574, note: 'University Park; нэмэх нь олон улсын оюутны хураамж 1,500 USD' }, { level: 'master', currency: 'USD', min: 46796, max: 49308 } ] },
  { name: 'University of California, Berkeley (UCB)', cited: 'internationaloffice.berkeley.edu, registrar.berkeley.edu', tuition: [
    { level: 'bachelor', currency: 'USD', min: 48000, max: 55680, note: 'гадаад (non-resident) оюутан; Non-Resident Supplemental Tuition 37,602 USD багтсан' }, { level: 'master', currency: 'USD', min: 40064, max: 50599 } ] },
  { name: 'Yale University', cited: 'student-accounts.yale.edu, finaid.yale.edu', tuition: [
    { level: 'bachelor', currency: 'USD', min: 72500, academicYear: '2026/2027', note: 'Yale College; MBA 90,900 USD' }, { level: 'master', currency: 'USD', min: 50198, max: 90900 } ] },
  { name: 'University of Alberta', cited: 'ualberta.ca, educanada.ca', tuition: [
    { level: 'bachelor', currency: 'CAD', min: 36369, max: 49952, note: 'Инженер зэрэг салбар дээд хүрээнд' }, { level: 'master', currency: 'CAD', min: 18302, max: 24028 } ] },
  { name: 'The University of Sheffield', cited: 'usic.sheffield.ac.uk', tuition: [
    { level: 'bachelor', currency: 'GBP', min: 25000, max: 32100, note: 'Анагаах 47,575+; Шүд 50,925 GBP' }, { level: 'master', currency: 'GBP', min: 21000, max: 45000 } ] },
  { name: 'Durham University', tuition: [
    { level: 'bachelor', currency: 'GBP', min: 18000, max: 25000 }, { level: 'master', currency: 'GBP', min: 20000, max: 30000 } ] },
  { name: 'The University of Technology Sydney (UTS)', cited: 'uts.edu.au', tuition: [
    { level: 'bachelor', currency: 'AUD', min: 42000, max: 60000 }, { level: 'master', currency: 'AUD', min: 40000, max: 65000 } ] },
  { name: 'The University of New South Wales (UNSW Sydney)', cited: 'unswcollege.edu.au', tuition: [
    { level: 'bachelor', currency: 'AUD', min: 42000, max: 87000 }, { level: 'master', currency: 'AUD', min: 42000, max: 87000 } ] },
  { name: 'The University of Melbourne', tuition: [
    { level: 'bachelor', currency: 'AUD', min: 35000, max: 71000 }, { level: 'master', currency: 'AUD', min: 35000, max: 71000 } ] },
  { name: 'Monash University', cited: 'monash.edu', tuition: [
    { level: 'bachelor', currency: 'AUD', min: 37000, max: 55900, note: 'Худалдаа (commerce) ~55,900 AUD' }, { level: 'master', currency: 'AUD', min: 37000, max: 55900 } ] },
  { name: 'KTH Royal Institute of Technology', tuition: [
    { level: 'bachelor', currency: 'SEK', min: 122000, max: 150000 }, { level: 'master', currency: 'SEK', min: 155000, max: 310000 } ] },
  { name: 'Uppsala University', cited: 'uu.se', tuition: [
    { level: 'bachelor', currency: 'SEK', min: 80000, max: 155000 }, { level: 'master', currency: 'SEK', min: 90000, max: 180000 } ] },
  { name: 'Lund University', tuition: [
    { level: 'bachelor', currency: 'SEK', min: 100000, max: 160000 }, { level: 'master', currency: 'SEK', min: 120000, max: 180000 } ] },
  { name: 'Université Paris-Saclay', cited: 'campusfrance.org', tuition: [
    { level: 'bachelor', currency: 'EUR', min: 2902 }, { level: 'master', currency: 'EUR', min: 3950 } ] },
  { name: 'Ludwig-Maximilians-Universität München', cited: 'lmu.de', tuition: [
    { level: 'bachelor', currency: 'EUR', min: 0, note: 'Төлбөргүй; улирлын хураамж ~97 EUR' }, { level: 'master', currency: 'EUR', min: 0, note: 'Төлбөргүй; улирлын хураамж ~97 EUR' } ] },
  { name: 'Freie Universitaet Berlin', tuition: [
    { level: 'bachelor', currency: 'EUR', min: 0, note: 'Төлбөргүй; зөвхөн захиргааны хураамж' }, { level: 'master', currency: 'EUR', min: 0, note: 'Төлбөргүй; зөвхөн захиргааны хураамж' } ] },
  { name: 'Institute of Science Tokyo', cited: 'oga.site.nthu.edu.tw (Science Tokyo tuition info sheet)', tuition: [
    { level: 'bachelor', currency: 'JPY', min: 535800, note: 'нэмэх нь элсэлтийн хураамж 84,600 JPY' }, { level: 'master', currency: 'JPY', min: 535800, note: 'нэмэх нь элсэлтийн хураамж 84,600 JPY' } ] },

  // ── Тайланд «(Estimated)» / «(Est.)» гэж тэмдэглэсэн дүн: эх сурвалжгүй тооцоолол ──
  { name: 'University of Texas at Austin', tuition: [
    { level: 'bachelor', currency: 'USD', min: 40000, max: 48000, estimated: E }, { level: 'master', currency: 'USD', min: 30000, max: 45000, estimated: E } ] },
  { name: 'California Institute of Technology (Caltech)', tuition: [
    { level: 'bachelor', currency: 'USD', min: 60000, max: 65000, estimated: E }, { level: 'master', currency: 'USD', min: 60000, max: 65000, estimated: E } ] },
  { name: 'Cornell University', tuition: [
    { level: 'bachelor', currency: 'USD', min: 65000, max: 70000, estimated: E }, { level: 'master', currency: 'USD', min: 60000, max: 80000, estimated: E } ] },
  { name: 'University of Oxford', tuition: [
    { level: 'bachelor', currency: 'GBP', min: 33000, max: 45000, estimated: E }, { level: 'master', currency: 'GBP', min: 35000, max: 50000, estimated: E } ] },
  { name: 'UCL', tuition: [
    { level: 'bachelor', currency: 'GBP', min: 26000, max: 40000, estimated: E }, { level: 'master', currency: 'GBP', min: 28000, max: 45000, estimated: E } ] },
  { name: "King's College London", tuition: [
    { level: 'bachelor', currency: 'GBP', min: 25000, max: 38000, estimated: E }, { level: 'master', currency: 'GBP', min: 27000, max: 42000, estimated: E } ] },
  { name: 'The London School of Economics and Political Science (LSE)', tuition: [
    { level: 'bachelor', currency: 'GBP', min: 27000, max: 35000, estimated: E }, { level: 'master', currency: 'GBP', min: 29000, max: 45000, estimated: E } ] },
  { name: 'The University of Edinburgh', tuition: [
    { level: 'bachelor', currency: 'GBP', min: 24000, max: 34000, estimated: E }, { level: 'master', currency: 'GBP', min: 26000, max: 40000, estimated: E } ] },
  { name: 'The University of Manchester', tuition: [
    { level: 'bachelor', currency: 'GBP', min: 23000, max: 33000, estimated: E }, { level: 'master', currency: 'GBP', min: 25000, max: 38000, estimated: E } ] },
  { name: 'University of Birmingham', tuition: [
    { level: 'bachelor', currency: 'GBP', min: 21000, max: 28000, estimated: E }, { level: 'master', currency: 'GBP', min: 22000, max: 32000, estimated: E } ] },
  { name: 'University of Copenhagen', tuition: [
    { level: 'bachelor', currency: 'EUR', min: 10000, max: 17000, estimated: E }, { level: 'master', currency: 'EUR', min: 12000, max: 20000, estimated: E } ] },
  { name: 'Sorbonne University', tuition: [
    { level: 'bachelor', currency: 'EUR', min: 2770, max: 2902, estimated: E }, { level: 'master', currency: 'EUR', min: 3770, max: 3950, estimated: E } ] },
  { name: 'Technical University of Munich', tuition: [
    { level: 'bachelor', currency: 'EUR', min: 2000, max: 4000, estimated: E }, { level: 'master', currency: 'EUR', min: 4000, max: 6000, estimated: E } ] },
  { name: 'University of Zurich', tuition: [
    { level: 'bachelor', currency: 'CHF', min: 1500, estimated: E }, { level: 'master', currency: 'CHF', min: 1500, estimated: E } ] },
  { name: 'University College Dublin', tuition: [
    { level: 'bachelor', currency: 'EUR', min: 20000, max: 26000, estimated: E }, { level: 'master', currency: 'EUR', min: 18000, max: 25000, estimated: E } ] },
  { name: 'Peking University', cited: 'isd.pku.edu.cn', tuition: [
    { level: 'bachelor', currency: 'CNY', min: 25000, max: 30000, estimated: E, note: 'RMB' }, { level: 'master', currency: 'CNY', min: 30000, max: 40000, estimated: E, note: 'RMB' } ] },
  { name: 'Tsinghua University', tuition: [
    { level: 'bachelor', currency: 'CNY', min: 25000, max: 30000, estimated: E, note: 'RMB' }, { level: 'master', currency: 'CNY', min: 30000, max: 40000, estimated: E, note: 'RMB' } ] },
  { name: 'Fudan University', tuition: [
    { level: 'bachelor', currency: 'CNY', min: 23000, max: 30000, estimated: E, note: 'RMB' }, { level: 'master', currency: 'CNY', min: 30000, max: 40000, estimated: E, note: 'RMB' } ] },
  { name: 'Seoul National University', tuition: [
    { level: 'bachelor', currency: 'USD', min: 4000, max: 6000, estimated: E }, { level: 'master', currency: 'USD', min: 5000, max: 8000, estimated: E } ] },

  // ── Тайлан №2 (24 сургууль) ──
  { name: 'University of Liverpool', report: R2, tuition: [
    { level: 'bachelor', currency: 'GBP', min: 20000, max: 32000, note: 'Шүдний эмчилгээ зэрэг клиник 51,000+ GBP' }, { level: 'master', currency: 'GBP', min: 25000, max: 35500 } ] },
  { name: 'Newcastle University', report: R2, tuition: [
    { level: 'bachelor', currency: 'GBP', min: 16500, max: 24500 }, { level: 'master', currency: 'GBP', min: 16500, max: 25000 } ] },
  { name: 'Cardiff University', report: R2, tuition: [
    { level: 'bachelor', currency: 'GBP', min: 23450, max: 34000 }, { level: 'master', currency: 'GBP', min: 30000, max: 37000 } ] },
  { name: 'Macquarie University', report: R2, tuition: [
    { level: 'bachelor', currency: 'AUD', min: 47533 }, { level: 'master', currency: 'AUD', min: 46500 } ] },
  { name: 'Curtin University', report: R2, tuition: [
    { level: 'bachelor', currency: 'AUD', min: 45814 }, { level: 'master', currency: 'AUD', min: 44980 } ] },
  { name: 'University of Otago', report: R2, tuition: [
    { level: 'bachelor', currency: 'NZD', min: 34300, max: 37800 }, { level: 'master', currency: 'NZD', min: 17900, max: 39800 } ] },
  { name: 'Texas A&M University', report: R2, tuition: [
    { level: 'bachelor', currency: 'USD', min: 23810, note: 'Олон улсын оюутны шууд сургалтын төлбөр; нийт зардал (cost of attendance, амьдрал багтсан) ~39,399 USD' }, { level: 'master', currency: 'USD', min: 10469, max: 15660, note: 'Бизнес зэрэг мэргэжлийн хөтөлбөр 15,000+ USD' } ] },
  { name: 'McMaster University', report: R2, tuition: [
    { level: 'bachelor', currency: 'CAD', min: 45158, max: 56233, note: 'Хүмүүнлэг ~45,158; Инженер ~56,233' }, { level: 'master', currency: 'CAD', min: 11397, max: 51112, note: 'Судалгааны ~11,397; курсын ~27,499; MBA ~51,112' } ] },
  { name: 'Sapienza University of Rome', report: R2, tuition: [
    { level: 'bachelor', currency: 'EUR', min: 1000, max: 1500, note: 'Гарсан орноос хамаарч 300–700 EUR хүртэл буурна; нэмэх нь бүсийн татвар' }, { level: 'master', currency: 'EUR', min: 1500 } ] },
  { name: 'Alma Mater Studiorum - Università di Bologna', report: R2, cited: 'unibo.it', tuition: [
    { level: 'bachelor', currency: 'EUR', min: 157, max: 3500, note: 'ISEE-ээс хамаарна; тогтмол хураамж 157.04 EUR' }, { level: 'master', currency: 'EUR', min: 157, max: 4000, note: 'ISEE-ээс хамаарна' } ] },
  { name: 'Humboldt-Universität zu Berlin', report: R2, tuition: [
    { level: 'bachelor', currency: 'EUR', min: 0, note: 'Төлбөргүй; улирлын хураамж ~711 EUR (тайлангийн хүснэгт)' }, { level: 'master', currency: 'EUR', min: 0, note: 'Төлбөргүй; улирлын хураамж ~711 EUR' } ] },
  { name: 'Technische Universität Berlin (TU Berlin)', report: R2, tuition: [
    { level: 'bachelor', currency: 'EUR', min: 0, note: 'Төлбөргүй; улирлын хураамж ~720 EUR (тайлангийн хүснэгт)' }, { level: 'master', currency: 'EUR', min: 0, note: 'Төлбөргүй; улирлын хураамж ~720 EUR' } ] },
  { name: 'Technische Universität Dresden', report: R2, tuition: [
    { level: 'bachelor', currency: 'EUR', min: 0, note: 'Төлбөргүй; улирлын хураамж ~600 EUR (тайлангийн хүснэгт)' }, { level: 'master', currency: 'EUR', min: 0, note: 'Төлбөргүй; улирлын хураамж ~600 EUR' } ] },
  { name: 'University of Vienna', report: R2, tuition: [
    { level: 'bachelor', currency: 'EUR', min: 1453, note: '726.72 EUR/улирал + ÖH хураамж' }, { level: 'master', currency: 'EUR', min: 1453, note: '726.72 EUR/улирал + ÖH хураамж' } ] },
  { name: 'University of Basel', report: R2, tuition: [
    { level: 'bachelor', currency: 'CHF', min: 1700, estimated: E }, { level: 'master', currency: 'CHF', min: 1700, estimated: E } ] },
  { name: 'University of Geneva', report: R2, tuition: [
    { level: 'bachelor', currency: 'CHF', min: 1000, estimated: E }, { level: 'master', currency: 'CHF', min: 1000, estimated: E } ] },
  { name: 'Aarhus University', report: R2, tuition: [
    { level: 'bachelor', currency: 'EUR', min: 10000, max: 15000, estimated: E }, { level: 'master', currency: 'EUR', min: 12000, max: 18000, estimated: E } ] },
  { name: 'Universitat de Barcelona', report: R2, tuition: [
    { level: 'bachelor', currency: 'EUR', min: 3000, max: 6000, estimated: E }, { level: 'master', currency: 'EUR', min: 4000, max: 8000, estimated: E } ] },
  { name: 'Complutense University of Madrid', report: R2, tuition: [
    { level: 'bachelor', currency: 'EUR', min: 3000, max: 6000, estimated: E }, { level: 'master', currency: 'EUR', min: 4000, max: 8000, estimated: E } ] },
  { name: 'Indian Institute of Technology Delhi (IITD)', report: R2, tuition: [
    { level: 'bachelor', currency: 'INR', min: 200000, note: 'B.Tech 4 жилийн нийт ~8 лак INR' }, { level: 'master', currency: 'INR', min: 30000, max: 300000 } ] },
  { name: 'Indian Institute of Technology Bombay (IITB)', report: R2, tuition: [
    { level: 'bachelor', currency: 'INR', min: 200000 }, { level: 'master', currency: 'INR', min: 72000, max: 100000 } ] },
  { name: 'Indian Institute of Technology Madras (IITM)', report: R2, tuition: [
    { level: 'bachelor', currency: 'INR', min: 200000 }, { level: 'master', currency: 'INR', min: 50000, max: 100000 } ] },
  { name: 'University of Science and Technology of China', report: R2, cited: 'ustc.cucas.cn', tuition: [
    { level: 'bachelor', currency: 'CNY', min: 26000, note: 'RMB' }, { level: 'master', currency: 'CNY', min: 30000, max: 50000, note: 'RMB' } ] },
  { name: 'Hanyang University', report: R2, tuition: [
    { level: 'bachelor', currency: 'USD', min: 4000, max: 8000, estimated: E }, { level: 'master', currency: 'USD', min: 5000, max: 10000, estimated: E } ] },

  // ── Тайлан №3 (26 сургууль) ──
  { name: 'University of Virginia', report: R3, cited: 'uvafinance.virginia.edu', tuition: [
    { level: 'bachelor', currency: 'USD', min: 55436, max: 59512, academicYear: '2025/2026' }, { level: 'master', currency: 'USD', min: 33304, max: 37628 } ] },
  { name: 'University of Minnesota (System)', report: R3, cited: 'admissions.tc.umn.edu', tuition: [
    { level: 'bachelor', currency: 'USD', min: 43348, note: 'Twin Cities' }, { level: 'master', currency: 'USD', min: 30000, max: 40000, estimated: E } ] },
  { name: 'University of Massachusetts Amherst', report: R3, cited: 'umass.edu', tuition: [
    { level: 'bachelor', currency: 'USD', min: 30568, note: '21,493 USD үндсэн + 9,075 USD хөтөлбөрийн хураамж' }, { level: 'master', currency: 'USD', min: 35000, max: 40000, estimated: E } ] },
  { name: 'University of Ottawa', report: R3, cited: 'uottawa.ca', tuition: [
    { level: 'bachelor', currency: 'CAD', min: 31582, max: 43334, note: 'Компьютерийн ухаан/инженер 31,582; эрүүл мэнд 43,334. Төлбөрийн өсөлт жилд ≤7%' }, { level: 'master', currency: 'CAD', min: 20000, max: 47154, note: 'MBA 47,154' } ] },
  { name: 'University of Calgary', report: R3, tuition: [
    { level: 'bachelor', currency: 'CAD', min: 30782 }, { level: 'master', currency: 'CAD', min: 29960, max: 98079, note: 'MBA 98,079' } ] },
  { name: 'Universität Hamburg', report: R3, tuition: [
    { level: 'bachelor', currency: 'EUR', min: 0, note: 'Төлбөргүй; улирлын хураамж ~384 EUR' }, { level: 'master', currency: 'EUR', min: 0, note: 'Төлбөргүй; улирлын хураамж ~384 EUR' } ] },
  { name: 'Technical University of Darmstadt', report: R3, tuition: [
    { level: 'bachelor', currency: 'EUR', min: 0, note: 'Төлбөргүй; зөвхөн улирлын хураамж' }, { level: 'master', currency: 'EUR', min: 0, note: 'Төлбөргүй; зөвхөн улирлын хураамж' } ] },
  { name: 'University of Göttingen', report: R3, tuition: [
    { level: 'bachelor', currency: 'EUR', min: 0, note: 'Төлбөргүй; зөвхөн улирлын хураамж' }, { level: 'master', currency: 'EUR', min: 0, note: 'Төлбөргүй; зөвхөн улирлын хураамж' } ] },
  { name: 'Politecnico di Torino', report: R3, tuition: [
    { level: 'bachelor', currency: 'EUR', min: 2800, max: 3500, note: 'ISEE-ээс хамаарна' }, { level: 'master', currency: 'EUR', min: 3000, max: 3800, note: 'ISEE-ээс хамаарна' } ] },
  { name: 'University of Milan', report: R3, tuition: [
    { level: 'bachelor', currency: 'EUR', min: 900, max: 3000 }, { level: 'master', currency: 'EUR', min: 1000, max: 3500 } ] },
  { name: 'Universitat Autònoma de Barcelona', report: R3, tuition: [
    { level: 'bachelor', currency: 'EUR', min: 3000, max: 8000, estimated: E, note: 'Тайлан: нарийвчилсан мэдээлэл өгөгдөөгүй, Испанийн нийтлэг жишиг' }, { level: 'master', currency: 'EUR', min: 4000, max: 10000, estimated: E } ] },
  { name: 'Universitat Pompeu Fabra', report: R3, tuition: [
    { level: 'bachelor', currency: 'EUR', min: 3000, max: 8000, estimated: E, note: 'Тайлан: нарийвчилсан мэдээлэл өгөгдөөгүй, Испанийн нийтлэг жишиг' }, { level: 'master', currency: 'EUR', min: 4000, max: 10000, estimated: E } ] },
  { name: 'Université Paris 1 Panthéon-Sorbonne', report: R3, tuition: [
    { level: 'bachelor', currency: 'EUR', min: 2770, estimated: E, note: '~' }, { level: 'master', currency: 'EUR', min: 3770, estimated: E, note: '~' } ] },
  { name: 'University of Gothenburg', report: R3, tuition: [
    { level: 'bachelor', currency: 'SEK', min: 100000, max: 200000, estimated: E, note: '~; амьжиргаа ~120,000 SEK/жил' }, { level: 'master', currency: 'SEK', min: 100000, max: 200000, estimated: E, note: '~' } ] },
  { name: 'University of Southern Denmark (SDU)', report: R3, tuition: [
    { level: 'bachelor', currency: 'USD', min: 12000, max: 30000 }, { level: 'master', currency: 'USD', min: 12000, max: 30000 } ] },
  { name: 'Charles University', report: R3, cited: 'cuni.cz', tuition: [
    { level: 'bachelor', currency: 'EUR', min: 3400, max: 7000, note: 'Англи хэлний хөтөлбөр' }, { level: 'master', currency: 'EUR', min: 3400, max: 7600, note: 'Англи хэлний хөтөлбөр' } ] },
  { name: 'Griffith University', report: R3, tuition: [
    { level: 'bachelor', currency: 'AUD', min: 39500 }, { level: 'master', currency: 'AUD', min: 41000 } ] },
  { name: 'Queensland University of Technology (QUT)', report: R3, tuition: [
    { level: 'bachelor', currency: 'AUD', min: 43998 }, { level: 'master', currency: 'AUD', min: 45300 } ] },
  { name: 'La Trobe University', report: R3, tuition: [
    { level: 'bachelor', currency: 'AUD', min: 43000 }, { level: 'master', currency: 'AUD', min: 44200 } ] },
  { name: 'The University of Newcastle, Australia (UON)', report: R3, tuition: [
    { level: 'bachelor', currency: 'AUD', min: 46348 }, { level: 'master', currency: 'AUD', min: 47520 } ] },
  { name: 'University of Canterbury', report: R3, tuition: [
    { level: 'bachelor', currency: 'NZD', min: 35000, max: 45000 }, { level: 'master', currency: 'NZD', min: 40000, max: 55000 } ] },
  { name: 'Waseda University', report: R3, cited: 'waseda.jp', tuition: [
    { level: 'bachelor', currency: 'JPY', min: 900000, max: 1500000 }, { level: 'master', currency: 'JPY', min: 549000, max: 2784000 } ] },
  { name: 'Keio University', report: R3, cited: 'students.keio.ac.jp', tuition: [
    { level: 'bachelor', currency: 'JPY', min: 800000, max: 1500000 }, { level: 'master', currency: 'JPY', min: 600000, max: 1800000 } ] },
  { name: 'Tianjin University', report: R3, tuition: [
    { level: 'bachelor', currency: 'CNY', min: 16000, note: 'RMB' }, { level: 'master', currency: 'CNY', min: 24000, note: 'RMB' } ] },
  { name: 'Ulsan National Institute of Science and Technology (UNIST)', report: R3, cited: 'admu-intl.unist.ac.kr', tuition: [
    { level: 'bachelor', currency: 'KRW', min: 0, estimated: E, note: 'Олон улсын оюутанд эхний семестр чөлөөлөгдөж, GPA 2.0–2.7 хангавал 100% тэтгэлэг; нэрлэсэн төлбөр жилд хэдэн сая вон. Сард 130,000–630,000 KRW тэтгэлэг' },
    { level: 'master', currency: 'KRW', min: 0, estimated: E, note: 'Төлбөрөөс 100% чөлөөлөгдөх боломжтой (тэтгэлэг)' } ] },
  { name: 'Indian Institute of Technology Kanpur (IITK)', report: R3, tuition: [
    { level: 'bachelor', currency: 'INR', min: 200000, note: '~' }, { level: 'master', currency: 'INR', min: 20000, max: 100000 } ] },

  // ── Тайлан №4 (36 сургууль) ──
  { name: 'University of Notre Dame', report: R4, cited: 'studentaccounts.nd.edu', tuition: [
    { level: 'bachelor', currency: 'USD', min: 69280, note: 'Хураамж нэмж ~69,794 USD' }, { level: 'master', currency: 'USD', min: 64826, max: 69110 } ] },
  { name: 'George Washington University', report: R4, cited: 'gwtoday.gwu.edu, financialaid.gwu.edu', tuition: [
    { level: 'bachelor', currency: 'USD', min: 69780, max: 72000 }, { level: 'master', currency: 'USD', min: 38772, max: 41000, note: 'Бизнесийн сургууль ~41,000' } ] },
  { name: 'Virginia Polytechnic Institute and State University', report: R4, cited: 'bursar.vt.edu', tuition: [
    { level: 'bachelor', currency: 'USD', min: 38865, max: 40180, note: 'Нэмэх нь Immigration Services Fee' }, { level: 'master', currency: 'USD', min: 36212, max: 37334 } ] },
  { name: 'University of Illinois Chicago (UIC)', report: R4, cited: 'housing.uic.edu', tuition: [
    { level: 'bachelor', currency: 'USD', min: 30000, estimated: E, note: '30,000+ (тайлан: Estimated)' }, { level: 'master', currency: 'USD', min: 28000, estimated: E, note: '28,000+ (тайлан: Estimated)' } ] },
  { name: 'University of Victoria (UVic)', report: R4, tuition: [
    { level: 'bachelor', currency: 'CAD', min: 30000, max: 40000, estimated: E, note: 'Тайлан: нарийвчилсан мэдээлэл байхгүй, Канадын нийтлэг жишиг' }, { level: 'master', currency: 'CAD', min: 10000, max: 25000, estimated: E, note: 'Судалгааны ~10,000–15,000; курсын 25,000+' } ] },
  { name: 'Queen Mary University of London', report: R4, cited: 'qmul.ac.uk', tuition: [
    { level: 'bachelor', currency: 'GBP', min: 18500, max: 23500, note: '23,500+' }, { level: 'master', currency: 'GBP', min: 12000, max: 34000, note: '34,000+' } ] },
  { name: 'City St George’s University of London', report: R4, cited: 'citystgeorges.ac.uk', tuition: [
    { level: 'bachelor', currency: 'GBP', min: 18950, max: 26450, note: 'Pathways (International Foundation / Year One) хөтөлбөр' }, { level: 'master', currency: 'GBP', min: 20950, max: 26250, note: 'Pre-Master хөтөлбөр' } ] },
  { name: 'University of Leicester', report: R4, cited: 'le.ac.uk', tuition: [
    { level: 'bachelor', currency: 'GBP', min: 21500, max: 30150, note: 'Анагаах (MBChB) 30,150; клиник жилүүд 48,900+' }, { level: 'master', currency: 'GBP', min: 20000, max: 28000, estimated: E } ] },
  { name: 'Swansea University', report: R4, tuition: [
    { level: 'bachelor', currency: 'GBP', min: 19000, max: 28000, estimated: E }, { level: 'master', currency: 'GBP', min: 21500, max: 28000, estimated: E } ] },
  { name: 'Heriot-Watt University', report: R4, cited: 'hw.ac.uk', tuition: [
    { level: 'bachelor', currency: 'GBP', min: 19000 }, { level: 'master', currency: 'GBP', min: 12000, max: 12500 } ] },
  { name: 'University of East Anglia (UEA)', report: R4, cited: 'assets.uea.ac.uk', tuition: [
    { level: 'bachelor', currency: 'GBP', min: 18000, max: 24000, estimated: E }, { level: 'master', currency: 'GBP', min: 19000, max: 25000, estimated: E } ] },
  { name: 'Western Sydney University', report: R4, tuition: [
    { level: 'bachelor', currency: 'AUD', min: 37759 }, { level: 'master', currency: 'AUD', min: 39336 } ] },
  { name: 'Flinders University', report: R4, tuition: [
    { level: 'bachelor', currency: 'AUD', min: 38167 }, { level: 'master', currency: 'AUD', min: 37500 } ] },
  { name: 'RWTH Aachen University', report: R4, cited: 'rwth-aachen.de', tuition: [
    { level: 'bachelor', currency: 'EUR', min: 0, note: 'Төлбөргүй; улирлын хураамж ~304–329 EUR' }, { level: 'master', currency: 'EUR', min: 0, note: 'Төлбөргүй; улирлын хураамж ~329 EUR' } ] },
  { name: 'University of Münster', report: R4, tuition: [
    { level: 'bachelor', currency: 'EUR', min: 0, note: 'Төлбөргүй; улирлын хураамж ~320 EUR (тайлан: Est.)' }, { level: 'master', currency: 'EUR', min: 0, note: 'Төлбөргүй; улирлын хураамж ~320 EUR (тайлан: Est.)' } ] },
  { name: 'Universität Stuttgart', report: R4, tuition: [
    { level: 'bachelor', currency: 'EUR', min: 3000, note: 'Баден-Вюртемберг: ЕХ-ны бус оюутан 1,500 EUR/улирал' }, { level: 'master', currency: 'EUR', min: 3000, note: 'Баден-Вюртемберг: 1,500 EUR/улирал' } ] },
  { name: 'University of Turin', report: R4, tuition: [
    { level: 'bachelor', currency: 'EUR', min: 900, max: 2500, note: 'ISEE-ээс хамаарна' }, { level: 'master', currency: 'EUR', min: 1000, max: 3000, note: 'ISEE-ээс хамаарна' } ] },
  { name: 'Università degli Studi di Pavia', report: R4, tuition: [
    { level: 'bachelor', currency: 'EUR', min: 1000, max: 3000, estimated: E }, { level: 'master', currency: 'EUR', min: 1000, max: 3000, estimated: E } ] },
  { name: 'Universidad Politécnica de Madrid (UPM)', report: R4, cited: 'study.eu', tuition: [
    { level: 'bachelor', currency: 'EUR', min: 8000, max: 13000, estimated: E }, { level: 'master', currency: 'EUR', min: 8000, max: 13000, estimated: E } ] },
  { name: 'University of Turku', report: R4, cited: 'utu.fi', tuition: [
    { level: 'bachelor', currency: 'EUR', min: 10000 }, { level: 'master', currency: 'EUR', min: 10000, max: 12000 } ] },
  { name: 'Linköping University', report: R4, tuition: [
    { level: 'bachelor', currency: 'SEK', min: 100000, max: 150000, estimated: E }, { level: 'master', currency: 'SEK', min: 100000, max: 150000, estimated: E } ] },
  { name: 'Université de Liège', report: R4, cited: 'enseignement.uliege.be', tuition: [
    { level: 'bachelor', currency: 'EUR', min: 835, note: 'ЕХ-ны стандарт хураамж; ЕХ-ны бус оюутанд нэмэгдэл (premium) нэмэгдэнэ' }, { level: 'master', currency: 'EUR', min: 835, note: 'ЕХ-ны стандарт хураамж; ЕХ-ны бус оюутанд нэмэгдэл нэмэгдэнэ' } ] },
  { name: 'Jagiellonian University', report: R4, tuition: [
    { level: 'bachelor', currency: 'EUR', min: 2800, max: 14000, note: 'Олон улсын харилцаа ~4,000; Анагаах ~17,000' }, { level: 'master', currency: 'EUR', min: 1800, max: 5750 } ] },
  { name: 'Sichuan University', report: R4, cited: 'global.scu.edu.cn', tuition: [
    { level: 'bachelor', currency: 'CNY', min: 17500, max: 45000, note: 'RMB; Хүмүүнлэг 17,500 – Анагаах (MBBS) 45,000' }, { level: 'master', currency: 'CNY', min: 22000, max: 45000, estimated: E, note: 'RMB' } ] },
  { name: 'Southern University of Science and Technology (SUSTech)', report: R4, cited: 'skmed.sustech.edu.cn', tuition: [
    { level: 'bachelor', currency: 'CNY', min: 135000, note: 'RMB; нэрлэсэн үндсэн төлбөр. President Scholarship 68,000 RMB/жил' }, { level: 'master', currency: 'CNY', min: 135000, note: 'RMB; нэрлэсэн үндсэн төлбөр' } ] },
  { name: 'South China University of Technology', report: R4, cited: 'scut.cucas.cn', tuition: [
    { level: 'bachelor', currency: 'CNY', min: 18200, max: 95000, note: 'RMB' }, { level: 'master', currency: 'CNY', min: 23000, max: 44500, note: 'RMB' } ] },
  { name: 'University of Chinese Academy of Sciences (UCAS)', report: R4, tuition: [
    { level: 'bachelor', currency: 'CNY', min: 30000, estimated: E, note: 'RMB' }, { level: 'master', currency: 'CNY', min: 35000, estimated: E, note: 'RMB' } ] },
  { name: 'Sungkyunkwan University (SKKU)', report: R4, cited: 'skku.edu', tuition: [
    { level: 'bachelor', currency: 'KRW', min: 7000000, max: 14000000 }, { level: 'master', currency: 'KRW', min: 7000000, max: 14000000 } ] },
  { name: 'Kyung Hee University', report: R4, tuition: [
    { level: 'bachelor', currency: 'KRW', min: 7000000, max: 13000000 }, { level: 'master', currency: 'KRW', min: 7000000, max: 13000000 } ] },
  { name: 'Sejong University', report: R4, tuition: [
    { level: 'bachelor', currency: 'KRW', min: 7000000, max: 13000000, estimated: E }, { level: 'master', currency: 'KRW', min: 7000000, max: 13000000, estimated: E } ] },
  { name: 'Gwangju Institute of Science and Technology (GIST)', report: R4, tuition: [
    { level: 'bachelor', currency: 'KRW', min: 0, estimated: E, note: 'Тайлан: бүрэн татаастай/чөлөөлөгдсөн (Est.)' }, { level: 'master', currency: 'KRW', min: 0, estimated: E, note: 'Тайлан: бүрэн татаастай/чөлөөлөгдсөн (Est.)' } ] },
  { name: 'Daegu Gyeongbuk Institute of Science and Technology (DGIST)', report: R4, tuition: [
    { level: 'bachelor', currency: 'KRW', min: 0, estimated: E, note: 'Тайлан: бүрэн татаастай/чөлөөлөгдсөн (Est.)' }, { level: 'master', currency: 'KRW', min: 0, estimated: E, note: 'Тайлан: бүрэн татаастай/чөлөөлөгдсөн (Est.)' } ] },
  { name: 'Indian Institute of Technology Roorkee (IITR)', report: R4, tuition: [
    { level: 'bachelor', currency: 'INR', min: 200000, note: 'B.Tech 4 жилийн нийт ~8 лак INR (IIT Madras/Bombay-ийн жишгээр)' }, { level: 'master', currency: 'INR', min: 50000, max: 100000 } ] },
  { name: 'University of Delhi', report: R4, tuition: [
    { level: 'bachelor', currency: 'USD', min: 500, max: 1500, estimated: E, note: 'Тайлан: нарийвчилсан мэдээлэлгүй, USD-ийн дүйцэх тооцоо' }, { level: 'master', currency: 'USD', min: 500, max: 1500, estimated: E } ] },
  { name: 'Bauman Moscow State Technical University', report: R4, cited: 'gotouniversity.com', tuition: [
    { level: 'bachelor', currency: 'RUB', min: 252050, max: 300000 }, { level: 'master', currency: 'RUB', min: 350000 } ] },
  { name: 'RUDN University', report: R4, cited: 'international.rudn.ru', tuition: [
    { level: 'bachelor', currency: 'RUB', min: 300000, max: 500000, note: '~3,500–5,500 USD; Анагаах ~9,000 USD' }, { level: 'master', currency: 'RUB', min: 300000, max: 500000, note: '~3,500–5,500 USD' } ] },

  // ── Тайлан №5 (38 сургууль). «~» тэмдэгтэй = тайланд «албан ёсны эх сурвалж болон улсын дундаж жишигт үндэслэн тооцоолсон» ──
  { name: 'University of Naples - Federico II', report: R5, tuition: [
    { level: 'bachelor', currency: 'EUR', min: 156, estimated: E, note: 'Бүсийн татвар 140 + тэмдэгтийн хураамж 16 EUR; ADISU дотуур байр сард 170–280 EUR' }, { level: 'master', currency: 'EUR', min: 156, estimated: E } ] },
  { name: 'University of Trento', report: R5, cited: 'unitn.it', tuition: [
    { level: 'bachelor', currency: 'EUR', min: 1000, max: 4500, note: '1-р жил элсэлтийн оноогоор; дараа нь ECTS-ээр (6,000 хүртэл эсвэл чөлөөлөлт)' }, { level: 'master', currency: 'EUR', min: 1000, max: 4500 } ] },
  { name: 'University of Florence', report: R5, cited: 'unifi.it', tuition: [
    { level: 'bachelor', currency: 'EUR', min: 1000, max: 2500, estimated: E }, { level: 'master', currency: 'EUR', min: 1000, max: 2500, estimated: E } ] },
  { name: 'Ruhr-Universität Bochum', report: R5, cited: 'international.ruhr-uni-bochum.de', tuition: [
    { level: 'bachelor', currency: 'EUR', min: 0, note: 'Төлбөргүй; улирлын хураамж 350–380 EUR (жилд ~760)' }, { level: 'master', currency: 'EUR', min: 0, note: 'Төлбөргүй; улирлын хураамж 350–380 EUR (жилд ~760)' } ] },
  { name: 'Julius-Maximilians-Universität Würzburg', report: R5, tuition: [
    { level: 'bachelor', currency: 'EUR', min: 0, note: 'Төлбөргүй; улирлын хураамж 124–180 EUR (жилд ~360)' }, { level: 'master', currency: 'EUR', min: 0, note: 'Төлбөргүй; улирлын хураамж 124–180 EUR' } ] },
  { name: 'Leibniz University Hannover', report: R5, tuition: [
    { level: 'bachelor', currency: 'EUR', min: 0, note: 'Төлбөргүй; хураамж жилд ~600–800 EUR' }, { level: 'master', currency: 'EUR', min: 0, note: 'Төлбөргүй; хураамж жилд ~600–800 EUR' } ] },
  { name: 'University of Bayreuth', report: R5, tuition: [
    { level: 'bachelor', currency: 'EUR', min: 0, note: 'Төлбөргүй; хураамж жилд ~600 EUR' }, { level: 'master', currency: 'EUR', min: 0, note: 'Төлбөргүй; хураамж жилд ~600 EUR' } ] },
  { name: 'Universitat Politecnica de Valencia', report: R5, cited: 'collabinternational.com', tuition: [
    { level: 'bachelor', currency: 'EUR', min: 3000, max: 6000, note: 'ЕХ-ны иргэд 1,500–2,500; ЕХ-ны бус 2 дахин' }, { level: 'master', currency: 'EUR', min: 3000, max: 6000 } ] },
  { name: 'Universitat de Valencia', report: R5, tuition: [
    { level: 'bachelor', currency: 'EUR', min: 2000, max: 5000, estimated: E }, { level: 'master', currency: 'EUR', min: 2000, max: 5000, estimated: E } ] },
  { name: 'University of Granada', report: R5, tuition: [
    { level: 'bachelor', currency: 'EUR', min: 2000, max: 4000, estimated: E }, { level: 'master', currency: 'EUR', min: 2000, max: 4000, estimated: E } ] },
  { name: 'Universidad de Sevilla', report: R5, tuition: [
    { level: 'bachelor', currency: 'EUR', min: 2000, max: 4000, estimated: E }, { level: 'master', currency: 'EUR', min: 2000, max: 4000, estimated: E } ] },
  { name: 'Universitat Ramon Llull', report: R5, tuition: [
    { level: 'bachelor', currency: 'EUR', min: 15000, max: 20000, estimated: E, note: 'Хувийн их сургууль' }, { level: 'master', currency: 'EUR', min: 15000, max: 20000, estimated: E } ] },
  { name: 'Aix-Marseille University', report: R5, cited: 'ieicbd.com', tuition: [
    { level: 'bachelor', currency: 'EUR', min: 2895 }, { level: 'master', currency: 'EUR', min: 3941 } ] },
  { name: 'Université de Montpellier', report: R5, tuition: [
    { level: 'bachelor', currency: 'EUR', min: 2770, estimated: E }, { level: 'master', currency: 'EUR', min: 3770, estimated: E } ] },
  { name: 'Umea University', report: R5, cited: 'umu.se', tuition: [
    { level: 'bachelor', currency: 'SEK', min: 93000, max: 236800 }, { level: 'master', currency: 'SEK', min: 90000, max: 395700 } ] },
  { name: 'Dublin City University', report: R5, cited: 'english.dcu.ie', tuition: [
    { level: 'bachelor', currency: 'EUR', min: 15000, max: 20000, estimated: E }, { level: 'master', currency: 'EUR', min: 15000, max: 20000, estimated: E } ] },
  { name: 'Royal Holloway, University of London', report: R5, tuition: [
    { level: 'bachelor', currency: 'GBP', min: 18000, max: 25000, estimated: E }, { level: 'master', currency: 'GBP', min: 18000, max: 25000, estimated: E } ] },
  { name: 'USI - Università della Svizzera italiana', report: R5, cited: 'swissuniversities.ch', tuition: [
    { level: 'bachelor', currency: 'CHF', min: 8000, note: 'Семестр тутамд 4,000 CHF' }, { level: 'master', currency: 'CHF', min: 8000, note: 'Семестр тутамд 4,000 CHF' } ] },
  { name: 'University of California, Santa Cruz', report: R5, cited: 'financialaid.ucsc.edu', tuition: [
    { level: 'bachelor', currency: 'USD', min: 56709, max: 57300, note: 'Мужийн бус нэмэгдэл 39,270 багтсан' }, { level: 'master', currency: 'USD', min: 31767 } ] },
  { name: 'University of Connecticut', report: R5, cited: 'financialaid.uconn.edu', tuition: [
    { level: 'bachelor', currency: 'USD', min: 44242, note: '39,678 үндсэн + 4,564 хураамж' }, { level: 'master', currency: 'USD', min: 45310 } ] },
  { name: 'Stony Brook University, State University of New York', report: R5, cited: 'stonybrook.edu', tuition: [
    { level: 'bachelor', currency: 'USD', min: 25000, max: 30000, estimated: E }, { level: 'master', currency: 'USD', min: 17000, max: 25000, estimated: E } ] },
  { name: 'Concordia University', report: R5, tuition: [
    { level: 'bachelor', currency: 'CAD', min: 25000, max: 35000, estimated: E }, { level: 'master', currency: 'CAD', min: 20000, max: 30000, estimated: E } ] },
  { name: 'Central Queensland University (CQUniversity Australia)', report: R5, cited: 'cqu.edu.au', tuition: [
    { level: 'bachelor', currency: 'AUD', min: 30000, max: 35000, estimated: E }, { level: 'master', currency: 'AUD', min: 30000, max: 35000, estimated: E } ] },
  { name: 'James Cook University', report: R5, cited: 'jcu.edu.au', tuition: [
    { level: 'bachelor', currency: 'AUD', min: 30000, max: 40000, estimated: E }, { level: 'master', currency: 'AUD', min: 30000, max: 40000, estimated: E } ] },
  { name: 'University of Canberra', report: R5, tuition: [
    { level: 'bachelor', currency: 'AUD', min: 30000, max: 40000, estimated: E }, { level: 'master', currency: 'AUD', min: 30000, max: 40000, estimated: E } ] },
  { name: 'Auckland University of Technology (AUT)', report: R5, tuition: [
    { level: 'bachelor', currency: 'NZD', min: 30000, max: 40000, estimated: E }, { level: 'master', currency: 'NZD', min: 30000, max: 40000, estimated: E } ] },
  { name: 'Chung-Ang University (CAU)', report: R5, cited: 'inter-korea.com', tuition: [
    { level: 'bachelor', currency: 'KRW', min: 9300000, estimated: E }, { level: 'master', currency: 'KRW', min: 10000000, estimated: E } ] },
  { name: 'Pusan National University', report: R5, tuition: [
    { level: 'bachelor', currency: 'USD', min: 4000, max: 6000, estimated: E }, { level: 'master', currency: 'USD', min: 4000, max: 6000, estimated: E } ] },
  { name: 'Kyungpook National University', report: R5, tuition: [
    { level: 'bachelor', currency: 'USD', min: 4000, max: 6000, estimated: E }, { level: 'master', currency: 'USD', min: 4000, max: 6000, estimated: E } ] },
  { name: 'Ewha Womans University', report: R5, tuition: [
    { level: 'bachelor', currency: 'USD', min: 8000, max: 12000, estimated: E }, { level: 'master', currency: 'USD', min: 8000, max: 12000, estimated: E } ] },
  { name: 'Sogang University', report: R5, tuition: [
    { level: 'bachelor', currency: 'USD', min: 8000, max: 12000, estimated: E }, { level: 'master', currency: 'USD', min: 8000, max: 12000, estimated: E } ] },
  { name: 'Dalian University of Technology', report: R5, cited: 'dut.cucas.cn', tuition: [
    { level: 'bachelor', currency: 'CNY', min: 19500, max: 25500, note: 'RMB' }, { level: 'master', currency: 'CNY', min: 23000, max: 29500, note: 'RMB' } ] },
  { name: 'Jinan University (China)', report: R5, cited: 'english.jnu.edu.cn', tuition: [
    { level: 'bachelor', currency: 'CNY', min: 19000, max: 32000, note: 'RMB' }, { level: 'master', currency: 'CNY', min: 20000, max: 35000, note: 'RMB' } ] },
  { name: 'Hunan University', report: R5, tuition: [
    { level: 'bachelor', currency: 'CNY', min: 15000, max: 17000 }, { level: 'master', currency: 'CNY', min: 20000, max: 22000 } ] },
  { name: 'Shanghai University', report: R5, tuition: [
    { level: 'bachelor', currency: 'CNY', min: 20000, max: 30000, estimated: E, note: 'RMB' }, { level: 'master', currency: 'CNY', min: 25000, max: 35000, estimated: E, note: 'RMB' } ] },
  { name: 'Kazan (Volga region) Federal University', report: R5, tuition: [
    { level: 'bachelor', currency: 'USD', min: 2500, max: 4000, estimated: E }, { level: 'master', currency: 'USD', min: 3000, max: 4500, estimated: E } ] },
  { name: 'Shoolini University of Biotechnology and Management Sciences', report: R5, tuition: [
    { level: 'bachelor', currency: 'USD', min: 3000, max: 5000, estimated: E }, { level: 'master', currency: 'USD', min: 3000, max: 5000, estimated: E } ] },
  { name: 'Anna University', report: R5, tuition: [
    { level: 'bachelor', currency: 'USD', min: 2000, max: 4000, estimated: E }, { level: 'master', currency: 'USD', min: 2500, max: 4500, estimated: E } ] },
  // Тайлан №6 (56 сургууль)
  free('Universität Leipzig'), free('Universität Jena'), free('Universität Bremen'), free('Technische Universität Bergakademie Freiberg'),
  free('Christian-Albrechts-University zu Kiel'), free('Otto-von-Guericke-Universität Magdeburg'), free('TU Dortmund University'), free('Universität Regensburg'),
  { name: 'Ulm University', report: R6, cited: 'Баден-Вюртемберг мужийн EU-гүй оюутны төлбөр 1,500 EUR/семестр', tuition: sym([3000], [3000], 'EUR') },
  { name: 'University of Genoa', report: R6, tuition: sym([136, 3000], [136, 3000], 'EUR') },
  { name: 'University of Milano-Bicocca', report: R6, tuition: sym([156, 3800], [156, 4000], 'EUR') },
  { name: 'University of Siena', report: R6, tuition: sym([500, 2600], [500, 2600], 'EUR') },
  { name: 'University of Brescia', report: R6, tuition: sym([156, 3000], [156, 3000], 'EUR') },
  { name: 'Università Politecnica delle Marche', report: R6, tuition: sym([156, 3000], [156, 3000], 'EUR') },
  { name: 'University of Salamanca', report: R6, tuition: sym([750, 3500], [1000, 3500], 'EUR') },
  { name: 'Universidade de Santiago de Compostela', report: R6, tuition: sym([750, 3500], [1000, 3500], 'EUR') },
  { name: 'University of the Basque Country', report: R6, tuition: sym([750, 3500], [1000, 3500], 'EUR') },
  { name: 'Université Paul Sabatier Toulouse III', report: R6, tuition: sym([2770], [3770], 'EUR') },
  { name: 'University of Eastern Finland', report: R6, tuition: sym([8000, 10000], [8000, 10000], 'EUR') },
  { name: 'Eötvös Loránd University', report: R6, tuition: sym([3980, 9400], [3980, 9400], 'EUR') },
  { name: 'Colorado State University', report: R6, tuition: sym([39270], [25000, 35000], 'USD', E) },
  { name: 'Colorado School of Mines', report: R6, tuition: sym([45178, 46170], [38000, 45000], 'USD', E) },
  { name: 'Florida State University', report: R6, tuition: sym([26083], [20000, 30000], 'USD', E) },
  { name: 'University of Iowa', report: R6, tuition: sym([28596], [25000, 35000], 'USD', E) },
  { name: 'City University of New York', report: R6, tuition: sym([18000, 20000], [15000, 25000], 'USD', E) },
  { name: 'Université Laval', report: R6, tuition: sym([36879], [24694], 'CAD') },
  { name: 'University of Windsor', report: R6, tuition: sym([28886, 44738], [14983, 16622], 'CAD') },
  { name: 'University of New Brunswick', report: R6, tuition: sym([20029], [16691], 'CAD') },
  { name: 'University of Stirling', report: R6, tuition: sym([12200, 24300], [12200, 24300], 'GBP') },
  { name: 'University of Hull', report: R6, tuition: sym([8000, 17000], [8000, 17000], 'GBP') },
  { name: 'Coventry University', report: R6, tuition: sym([16000, 18000], [16000, 18000], 'GBP') },
  { name: 'Kingston University, London', report: R6, tuition: sym([16000, 18000], [16000, 18000], 'GBP') },
  { name: 'Bond University', report: R6, tuition: sym([20000, 45000], [20000, 45000], 'AUD') },
  { name: 'Edith Cowan University', report: R6, tuition: sym([20000, 45000], [20000, 45000], 'AUD') },
  { name: 'Charles Darwin University', report: R6, tuition: sym([20000, 45000], [20000, 45000], 'AUD') },
  { name: 'Victoria University', report: R6, tuition: sym([20000, 45000], [20000, 45000], 'AUD') },
  { name: "Renmin (People's) University of China", report: R6, tuition: [
    { level: 'bachelor', currency: 'CNY', min: 36000, estimated: E, note: 'RMB, Global BBA' }, { level: 'master', currency: 'CNY', min: 29000, max: 33000, note: 'RMB' } ] },
  { name: 'Zhengzhou University', report: R6, tuition: sym([16000, 30000], [22000, 35000], 'CNY') },
  { name: 'Beijing University of Chemical Technology', report: R6, tuition: sym([16000, 30000], [22000, 35000], 'CNY') },
  { name: 'East China University of Science and Technology', report: R6, tuition: sym([16000, 30000], [22000, 35000], 'CNY') },
  { name: 'Nanjing University of Science and Technology', report: R6, tuition: sym([16000, 30000], [22000, 35000], 'CNY') },
  { name: 'Dongguk University', report: R6, tuition: sym([4000, 8000], [5000, 9000], 'USD', E) },
  { name: 'The Catholic University of Korea (CUK)', report: R6, tuition: sym([4000, 8000], [5000, 9000], 'USD', E) },
  { name: 'Jeonbuk National University', report: R6, tuition: sym([4000, 8000], [5000, 9000], 'USD', E) },
  { name: 'Konkuk University', report: R6, tuition: sym([4000, 8000], [5000, 9000], 'USD', E) },
  { name: 'Indian Institute of Technology BHU Varanasi (IIT BHU Varanasi)', report: R6, tuition: sym([241400], [150000, 200000], 'INR') },
  { name: 'Indian Institute of Technology Indore', report: R6, tuition: sym([257300], [150000, 200000], 'INR') },
  { name: 'Indian Institute of Technology Hyderabad (IITH)', report: R6, tuition: sym([238000], [150000, 200000], 'INR') },
  { name: 'Birla Institute of Technology and Science, Pilani', report: R6, tuition: sym([582000], [600000, 700000], 'INR', E) },
  { name: 'Chandigarh University (Punjab)', report: R6, tuition: sym([116000, 126000], [100000, 150000], 'INR') },
  { name: 'Jawaharlal Nehru University', report: R6, tuition: [
    { level: 'bachelor', currency: 'INR', min: 10000, estimated: E, note: 'Тайланд «<10,000 INR» — дээд хязгаар, яг дүн биш' }, { level: 'master', currency: 'INR', min: 10000, estimated: E, note: 'Тайланд «<10,000 INR» — дээд хязгаар, яг дүн биш' } ] },
  { name: 'Jamia Millia Islamia', report: R6, tuition: [
    { level: 'bachelor', currency: 'INR', min: 10000, estimated: E, note: 'Тайланд «<10,000 INR» — дээд хязгаар, яг дүн биш' }, { level: 'master', currency: 'INR', min: 10000, estimated: E, note: 'Тайланд «<10,000 INR» — дээд хязгаар, яг дүн биш' } ] },
  { name: 'Symbiosis International (Deemed University)', report: R6, tuition: sym([250000, 450000], [300000, 600000], 'INR') },
  { name: 'Tomsk State University', report: R6, tuition: sym([4000, 6000], [5000, 8000], 'USD') },
  { name: 'National Research Nuclear University MEPhI (Moscow Engineering Physics Institute)', report: R6, tuition: sym([3000, 7000], [4000, 8000], 'USD') },
  { name: 'MGIMO University', report: R6, tuition: sym([3000, 7000], [4000, 8000], 'USD') },
  // Тайлан №7 (55 сургууль; дотуур байрны жилийн зардлыг тайлбарт хадгална)
  ...R7_SCHOOLS,
  // Тайлан №8 (үлдсэн 7 сургууль)
  ...R8_SCHOOLS,
];
