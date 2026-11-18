export interface QuestionSnapshot {
  key: string;
  section: string;
  order: number;
  type: 'single' | 'multi' | 'likert' | 'rating' | 'text' | 'number';
  text: string;
  required: boolean;
  options?: { key: string; label: string; weights?: Record<string, number> }[];
  scale?: { min: number; max: number; minLabel?: string; maxLabel?: string };
  scoring?: { dimension: string; target?: string; reverse?: boolean; weight?: number };
  showIf?: { questionKey: string; equals: any };
}

export interface CareerLike {
  _id: any;
  slug: string;
  nameMn: string;
  nameEn: string;
  jobZone?: number;
  /** populate-оор ирнэ */
  categoryId?: { slug: string; nameMn: string } | null;
  schoolSubjects?: string[];
  universityMajors?: string[];
  recommendedCountries?: string[];
  profile: {
    riasec?: Record<string, number>;
    skills?: Record<string, number>;
    workStyle?: Record<string, number>;
    values?: Record<string, number>;
    /** Big Five (O, C, E, A) — мэргэжлийн ажлын орчинд шаардагдах зан төлөвийн түвшин, 0–100 */
    personality?: Record<string, number>;
    /** Танин мэдэхүйн чадвар (math, verbal, techSpatial, abstract), 0–100 */
    cognitive?: Record<string, number>;
    subjects?: string[];
  };
}

export interface ScoringContext {
  questions: QuestionSnapshot[];
  answers: Record<string, any>;
  config: Record<string, any>;
  careers: CareerLike[];
  /** Strategy-ийн нэмэлт өгөгдөл (masters: fields, language: countries) */
  data?: any[];
  /** Өмнөх тестийн үр дүн (city: хамгийн сүүлийн карьерын тестийн payload ба хариулт) */
  prior?: { payload: any; answers: Record<string, any> } | null;
  /** Ангилал тус бүрийн key → Монгол нэр */
  labels: Record<'skill' | 'subject' | 'value' | 'workstyle', Record<string, string>>;
}

export interface ScoringStrategy {
  key: string;
  score(ctx: ScoringContext): Record<string, any>;
}
