import { AREAS, GOALS, MASTER_TYPES } from './areas';
import { ScoringContext, ScoringStrategy } from './types';

export const DEFAULT_MASTERS_CONFIG = {
  weights: { academic: 0.25, qualification: 0.2, goal: 0.2, experience: 0.1, compatibility: 0.25 },
  topN: 8,
};
export const MASTERS_DISCLAIMER =
  'Энэ зөвлөмж нь таны хариултад суурилсан чиглүүлэх хэрэгсэл бөгөөд элсэлт эсвэл карьерын амжилтын баталгаа биш. Хөтөлбөрийн элсэлтийн шаардлага, төлбөр, шалгалтыг тухайн их сургуулийн албан ёсны хуудсаас заавал баталгаажуулна уу.';
const round = Math.round;

/** Мэргэжлийн чиглэлийн хамаарал: ижил=100, зэргэлдээ=60, бусад=25 */
export const relatedness = (a: string | undefined, f: { area: string; adjacent: string[] }) =>
  !a || a === 'none' ? null : a === f.area ? 100 : f.adjacent.includes(a) ? 60 : 25;

export class MastersStrategy implements ScoringStrategy {
  key = 'masters';
  score(ctx: ScoringContext) {
    const a = ctx.answers;
    const cfg = { ...DEFAULT_MASTERS_CONFIG, ...ctx.config, weights: { ...DEFAULT_MASTERS_CONFIG.weights, ...(ctx.config?.weights ?? {}) } };
    const fields: any[] = ctx.data ?? [];
    const pref: string[] = Array.isArray(a.ms_pref_areas) ? a.ms_pref_areas : [];
    const years = Number(a.ms_experience ?? 0);
    const research = ((Number(a.ms_research ?? 3) - 1) / 4) * 100;
    const lead = ((Number(a.ms_leadership ?? 3) - 1) / 4) * 100;
    const flexible = a.ms_mode === 'parttime' || a.ms_work_while === 'yes';
    const goal: string = a.ms_goal;

    const ranked = fields.map((f) => {
      const academic = pref.length ? (pref.includes(f.area) ? 100 : pref.some((p) => f.adjacent.includes(p)) ? 50 : 0) : null;
      const qual = relatedness(a.ms_bachelor_area, f);
      const expReq = f.minExperience > 0 ? Math.min(100, (years / f.minExperience) * 100) : 100;
      const profRel = relatedness(a.ms_profession_area, f);
      const experience = profRel === null ? expReq : 0.6 * expReq + 0.4 * profRel;
      const goalFit = goal ? f.goalFit?.[goal] ?? 40 : null;
      const modeFit = flexible
        ? ({ professional: 100, executive: 100, coursework: 70, research: 40 } as any)[f.type] ?? 60
        : ({ coursework: 90, research: 85, professional: 75, executive: 60 } as any)[f.type] ?? 70;
      const compat = (100 - Math.abs(research - f.research) + (100 - Math.abs(lead - f.leadership)) + modeFit) / 3;
      const d: Record<string, number | null> = { academic, qualification: qual, goal: goalFit, experience, compatibility: compat };
      let num = 0, den = 0;
      for (const k of Object.keys(d)) if (d[k] !== null) { num += (d[k] as number) * (cfg.weights as any)[k]; den += (cfg.weights as any)[k]; }
      return { f, d, total: den ? num / den : 0, qual, expReq };
    }).sort((x, y) => y.total - x.total).slice(0, cfg.topN);

    const fieldMatches = ranked.map(({ f, d, total, qual, expReq }) => {
      const why: string[] = [];
      if (d.academic === 100) why.push(`Таны сонирхсон чиглэл (${AREAS[f.area]}) энэ хөтөлбөртэй шууд давхцаж байна.`);
      else if (d.academic === 50) why.push('Таны сонирхсон чиглэлтэй зэргэлдээ салбар.');
      if (qual === 100) why.push('Таны бакалаврын суурь мэргэжил энэ чиглэлтэй шууд холбоотой.');
      else if (qual === 60) why.push('Бакалаврын мэргэжил зэргэлдээ салбар тул зарим суурь мэдлэг нөхөх шаардлагатай байж болно.');
      else if (qual !== null) why.push('Бакалаврын мэргэжлээс өөр салбар тул суурь мэдлэгээ нөхөх шаардлагатай.');
      if (goal && (f.goalFit?.[goal] ?? 0) >= 70) why.push(`Таны зорилго («${GOALS[goal]}») энэ чиглэлтэй сайн нийцнэ.`);
      if (f.minExperience > 0) why.push(expReq >= 100 ? `Ажлын туршлага (${f.minExperience}+ жил) шаардлага хангаж байна.` : `Энэ төрлийн хөтөлбөрт ихэвчлэн ${f.minExperience}+ жилийн туршлагыг үнэлдэг (таны туршлага ${years} жил).`);
      if (!why.length) why.push('Нийт тохирлоор жагсаалтад орсон боловч давхцал харьцангуй сул байна.');
      return {
        slug: f.slug, nameMn: f.nameMn, nameEn: f.nameEn, description: f.description ?? null, score: round(total),
        breakdown: Object.fromEntries(Object.entries(d).map(([k, v]) => [k, v === null ? null : round(v)])), why,
        type: f.type, typeLabel: MASTER_TYPES[f.type], area: f.area, areaName: AREAS[f.area], uniSubject: f.uniSubject ?? null,
        prerequisites: qual !== null && qual < 100 ? f.prerequisites : [], competencies: f.competencies, commonExams: f.commonExams,
      };
    });

    const byType: Record<string, string[]> = {};
    fieldMatches.forEach((m) => (byType[m.type] ??= []).push(m.slug));
    const gapAgg = new Map<string, number>();
    fieldMatches.slice(0, 3).forEach((m) => m.prerequisites.forEach((p: string) => gapAgg.set(p, (gapAgg.get(p) ?? 0) + 1)));
    const knowledgeGaps = [...gapAgg.entries()].sort((x, y) => y[1] - x[1]).map(([name]) => name).slice(0, 8);
    const top = fieldMatches[0];

    return {
      kind: 'masters',
      summary: top ? `Таны хариултаас харахад «${top.nameMn}» зэрэг ${AREAS[top.area].toLowerCase()} чиглэлийн магистрын хөтөлбөрүүд танд илүү нийцэж байна.` : 'Хангалттай хариулт байхгүй байна.',
      profile: {
        bachelorArea: AREAS[a.ms_bachelor_area] ?? null, years, goal: GOALS[goal] ?? null, flexible, preferredAreas: pref.map((p) => AREAS[p]).filter(Boolean),
        budgetTier: a.ms_budget ?? null, duration: a.ms_duration ?? null, abroad: Number(a.ms_abroad ?? 0), workAbroad: Number(a.ms_abroad_work ?? 0),
        countries: Array.isArray(a.ms_countries) ? a.ms_countries : [], english: a.ms_english ?? null,
      },
      fieldMatches, byType, typeLabels: MASTER_TYPES, knowledgeGaps,
      method: { weights: cfg.weights, note: 'Тохирол нь таны хариулт болон магистрын чиглэл бүрийн редакцийн профайлын (Админ засдаг) харьцуулалт юм. Хөтөлбөрийн албан ёсны мэдээлэл биш.' },
      programNote: 'Магистрын хөтөлбөр нь Coursework, Research, Professional, Executive төрөлтэй. Мэргэжлийн сертификат, богино курс нь магистрын зэрэг биш.',
      disclaimer: MASTERS_DISCLAIMER,
    };
  }
}
