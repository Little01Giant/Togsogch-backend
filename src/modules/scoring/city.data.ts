/**
 * «Суралцах хот ба замнал» тестийн РЕДАКЦИЙН өгөгдөл (хөгжүүлэгчийн өгсөн техникийн даалгавраас).
 * Вектор, төсөв, банкны баталгаа, визний нөхцөл нь албан ёсны статистик БИШ, эх сурвалж/баталгаажуулсан огноогүй —
 * хэрэглэгчид «албан ёсны эх сурвалжаас шалга» гэж заавал харуулна. Тоо оруулахдаа зохиохгүй: байхгүй бол null.
 */
export type WorkRights = 'yes' | 'limited' | 'no';
export interface CityVector { size: number; pdi: number; idv: number; uai: number; safe: number; cold: number; heat: number; sun: number; meat: number; trans: number }
export interface City {
  id: string; nameMn: string; countryMn: string; countryCode: string;
  vector: CityVector;
  strongIndustries: string[];
  /** Жилийн дундаж төсөв, сая ₮ [доод, дээд] */
  budgetM: [number, number];
  /** Банкны баталгаа (Proof of Funds), сая ₮ [доод, дээд] */
  pofM: [number, number];
  pofNote: string | null;
  langPrepWork: WorkRights;
  langPrepWorkNote: string;
  postGradVisa: string;
  longTermVisa: boolean;
  universities: string[];
}

const V = (size: number, pdi: number, idv: number, uai: number, safe: number, cold: number, heat: number, sun: number, meat: number, trans: number): CityVector => ({ size, pdi, idv, uai, safe, cold, heat, sun, meat, trans });
const ALL = ['IND-LAW', 'IND-FIN', 'IND-CONS', 'IND-TECH', 'IND-MED', 'IND-ENG', 'IND-GRN'];

export const CITIES: City[] = [
  { id: 'UB', nameMn: 'Улаанбаатар', countryMn: 'Монгол', countryCode: 'MN', vector: V(0.6, 0.65, 0.45, 0.4, 0.6, 0.1, 0.85, 0.9, 1, 0.4), strongIndustries: ALL, budgetM: [6, 12], pofM: [0, 0], pofNote: null, langPrepWork: 'yes', langPrepWorkNote: 'Хязгааргүй (Монгол Улсын иргэн)', postGradVisa: 'Монгол Улсын иргэн', longTermVisa: false, universities: ['МУИС', 'ШУТИС', 'СЭЗИС', 'АШУҮИС'] },
  { id: 'SEL', nameMn: 'Сөүл', countryMn: 'БНСУ', countryCode: 'KR', vector: V(1, 0.75, 0.25, 0.85, 0.9, 0.45, 0.4, 0.7, 0.75, 1), strongIndustries: ['IND-TECH', 'IND-FIN', 'IND-MED'], budgetM: [40, 65], pofM: [35, 60], pofNote: 'D-2 (бакалавр+) $15,000; D-4 (хэл) $10,000', langPrepWork: 'no', langPrepWorkNote: 'D-4 виз: эхний 6 сар ажиллах эрхгүй; D-2: 20–30 цаг (хэлний түвшнээс хамаарна)', postGradVisa: 'D-10 виз (ажил хайх)', longTermVisa: false, universities: ['Сөүлийн Үндэсний Их Сургууль (SNU)', 'Ёнсэй Их Сургууль', 'Корё Их Сургууль', 'KAIST'] },
  { id: 'PUS', nameMn: 'Бусан', countryMn: 'БНСУ', countryCode: 'KR', vector: V(0.75, 0.75, 0.25, 0.8, 0.92, 0.65, 0.35, 0.75, 0.65, 0.9), strongIndustries: ['IND-ENG', 'IND-CONS'], budgetM: [28, 45], pofM: [30, 50], pofNote: '$10k–$15k', langPrepWork: 'no', langPrepWorkNote: 'D-4 виз: эхний 6 сар ажиллах эрхгүй', postGradVisa: 'D-10 виз (1–2 жил)', longTermVisa: false, universities: [] },
  { id: 'TYO', nameMn: 'Токио', countryMn: 'Япон', countryCode: 'JP', vector: V(1, 0.65, 0.45, 0.95, 0.98, 0.6, 0.3, 0.65, 0.5, 1), strongIndustries: ['IND-TECH', 'IND-ENG', 'IND-FIN'], budgetM: [45, 70], pofM: [45, 55], pofNote: '¥1,500,000–2,000,000', langPrepWork: 'yes', langPrepWorkNote: '7 хоногт 28 цаг (амралтын үеэр 40 цаг); пачинко, шөнийн цэнгээний газар хориотой', postGradVisa: 'Ажлын виз рүү шилжих боломжтой', longTermVisa: true, universities: ['Токиогийн Их Сургууль', 'Васеда Их Сургууль', 'Токиогийн Технологийн Институт'] },
  { id: 'OSA', nameMn: 'Осака', countryMn: 'Япон', countryCode: 'JP', vector: V(0.8, 0.6, 0.45, 0.9, 0.95, 0.6, 0.3, 0.65, 0.55, 0.95), strongIndustries: ['IND-ENG', 'IND-TECH', 'IND-MED'], budgetM: [32, 50], pofM: [40, 50], pofNote: '¥1,800,000', langPrepWork: 'yes', langPrepWorkNote: '7 хоногт 28 цаг', postGradVisa: 'Ажлын виз (1–5 жил)', longTermVisa: false, universities: ['Осакагийн Их Сургууль', 'Кансай Их Сургууль'] },
  { id: 'MUC', nameMn: 'Мюнхен', countryMn: 'Герман', countryCode: 'DE', vector: V(0.75, 0.35, 0.75, 0.75, 0.92, 0.5, 0.75, 0.45, 0.8, 0.95), strongIndustries: ['IND-ENG', 'IND-TECH', 'IND-GRN'], budgetM: [40, 55], pofM: [45, 45], pofNote: '€11,904 хаалттай данс (Sperrkonto)', langPrepWork: 'limited', langPrepWorkNote: '7 хоногт 20 цаг (хэлний визэд хязгаартай)', postGradVisa: '18 сар ажил хайх виз', longTermVisa: true, universities: ['Мюнхений Техникийн Их Сургууль (TUM)', 'Людвиг-Максимилианы Их Сургууль (LMU)'] },
  { id: 'BER', nameMn: 'Берлин', countryMn: 'Герман', countryCode: 'DE', vector: V(0.9, 0.3, 0.85, 0.65, 0.8, 0.5, 0.75, 0.4, 0.85, 0.95), strongIndustries: ['IND-TECH', 'IND-GRN'], budgetM: [35, 50], pofM: [45, 45], pofNote: '€11,904 хаалттай данс (Sperrkonto)', langPrepWork: 'limited', langPrepWorkNote: '7 хоногт 20 цаг', postGradVisa: '18 сар ажил хайх виз', longTermVisa: false, universities: [] },
  { id: 'BUD', nameMn: 'Будапешт', countryMn: 'Унгар', countryCode: 'HU', vector: V(0.7, 0.45, 0.7, 0.7, 0.85, 0.55, 0.7, 0.6, 0.85, 0.85), strongIndustries: ['IND-MED', 'IND-ENG', 'IND-FIN', 'IND-GRN'], budgetM: [22, 35], pofM: [15, 25], pofNote: 'Тэтгэлэгт шаардахгүй', langPrepWork: 'limited', langPrepWorkNote: '7 хоногт 30 цаг (семестрийн үеэр)', postGradVisa: '9 сар ажил хайх виз', longTermVisa: false, universities: ['Этвош Лорандын Их Сургууль (ELTE)', 'Будапештийн Технологи, Эдийн Засгийн Их Сургууль (BME)'] },
  { id: 'TPE', nameMn: 'Тайбэй', countryMn: 'Тайвань', countryCode: 'TW', vector: V(0.8, 0.6, 0.35, 0.7, 0.95, 0.85, 0.2, 0.55, 0.6, 0.95), strongIndustries: ['IND-TECH', 'IND-ENG', 'IND-GRN'], budgetM: [20, 35], pofM: [18, 25], pofNote: '$5k–$7k', langPrepWork: 'limited', langPrepWorkNote: '7 хоногт 20 цаг (эхний семестрийн дараа / тусгай зөвшөөрлөөр)', postGradVisa: 'Төгсөгчийн онооны системээр', longTermVisa: false, universities: [] },
  { id: 'SYD', nameMn: 'Сидней', countryMn: 'Австрали', countryCode: 'AU', vector: V(0.9, 0.35, 0.9, 0.5, 0.88, 0.9, 0.6, 0.85, 0.85, 0.85), strongIndustries: ['IND-FIN', 'IND-TECH', 'IND-MED', 'IND-CONS'], budgetM: [85, 130], pofM: [75, 100], pofNote: 'AUD 29,710', langPrepWork: 'yes', langPrepWorkNote: '7 хоногт 24 цаг', postGradVisa: 'Subclass 485 (2–4 жил)', longTermVisa: true, universities: ['Сиднейн Их Сургууль', 'Шинэ Өмнөд Уэльсийн Их Сургууль (UNSW)'] },
  { id: 'TOR', nameMn: 'Торонто', countryMn: 'Канад', countryCode: 'CA', vector: V(0.9, 0.35, 0.85, 0.5, 0.85, 0.2, 0.7, 0.6, 0.85, 0.8), strongIndustries: ['IND-TECH', 'IND-FIN', 'IND-MED', 'IND-ENG'], budgetM: [80, 125], pofM: [80, 100], pofNote: 'CAD 23,448', langPrepWork: 'limited', langPrepWorkNote: 'Зөвхөн улсын их сургуулийн бакалавр 7 хоногт 20 цаг; хэлний бэлтгэлийн (ESL/FSL) оюутанд эрхгүй', postGradVisa: 'PGWP (1–3 жил, коллежид CIP код заасан)', longTermVisa: true, universities: [] },
  { id: 'BOS', nameMn: 'Бостон', countryMn: 'АНУ', countryCode: 'US', vector: V(0.8, 0.4, 0.92, 0.45, 0.82, 0.3, 0.65, 0.65, 0.85, 0.8), strongIndustries: ['IND-TECH', 'IND-MED', 'IND-FIN', 'IND-ENG'], budgetM: [110, 180], pofM: [100, 100], pofNote: '$30,000+', langPrepWork: 'limited', langPrepWorkNote: 'Зөвхөн кампус дотор 20 цаг', postGradVisa: 'OPT (1 жил, STEM бол 3 жил)', longTermVisa: true, universities: [] },
];

/** Мэргэжлийн ангилал (CareerCategory.slug) → хотын салбарын код. Холбогдох код байхгүй ангилал оноонд оролцохгүй. */
export const CATEGORY_TO_INDUSTRY: Record<string, string> = {
  technology: 'IND-TECH', engineering: 'IND-ENG', health: 'IND-MED', business: 'IND-FIN',
  'law-public': 'IND-LAW', 'agri-env': 'IND-GRN', science: 'IND-TECH',
};

export const FINANCE = {
  /** F01: жилийн зарцуулах боломж, сая ₮ — [доод, дээд] */
  budget: { a: [5, 12], b: [15, 30], c: [35, 65], d: [70, 120] } as Record<string, [number, number]>,
  /** F02: банкны баталгаа байршуулах боломж, сая ₮ — дээд хязгаар */
  pof: { a: 0, b: 38, c: 60, d: 100 } as Record<string, number>,
};
