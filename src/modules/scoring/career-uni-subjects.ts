/**
 * Карьерын ангилал → их сургуулийн чиглэл (University.subjects) РЕДАКЦИЙН харгалзаа.
 * Зөвхөн «Суралцах хот» тестийн зорилтот сургуулийг (бакалавр) мэргэжлийн ангилалтай холбоход ашиглана.
 * Албан ёсны ангилал биш; Админаас чиглэл нэмэх үед энд шинэчилнэ.
 */
export const CAREER_CATEGORY_TO_UNI_SUBJECTS: Record<string, string[]> = {
  technology: ['computer_science', 'engineering'],
  engineering: ['engineering'],
  health: ['medicine', 'natural_science'],
  business: ['business', 'economics'],
  creative: ['art_design'],
  'education-social': ['education', 'social_science'],
  science: ['natural_science'],
  'law-public': ['law', 'social_science'],
  'agri-env': ['natural_science'],
  service: ['business'],
  transport: ['engineering'],
};
