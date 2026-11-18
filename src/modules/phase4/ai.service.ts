import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CatalogService } from '../catalog/catalog.service';
import { AssessmentsService } from '../assessments/assessments.service';

export * from './ai.facts';
import { AI_NOTE, resultFacts, universityFacts, numbersGrounded } from './ai.facts';

@Injectable()
export class AiService {
  private log = new Logger('AI');
  constructor(private cfg: ConfigService, private catalog: CatalogService, private assessments: AssessmentsService) {}

  async explain(user: { id: string; role: string }, kind: 'university' | 'result', id: string) {
    let facts: { lines: string[]; sources: any[] }; let subject: string;
    if (kind === 'university') { const u = await this.catalog.getUniversity(id, user); facts = universityFacts(u); subject = `«${(u as any).name}» их сургууль`; }
    else { const r = await this.assessments.getResult(user, id); facts = resultFacts(r); subject = 'тестийн үр дүн'; }
    const factsText = facts.lines.join('\n');
    const base = { facts: facts.lines, sources: facts.sources, note: AI_NOTE };

    const key = this.cfg.get<string>('ANTHROPIC_API_KEY');
    if (key) {
      try {
        const text = await this.callLlm(key, subject, factsText);
        if (text && numbersGrounded(text, factsText)) return { ...base, text, generatedBy: 'ai', model: this.cfg.get('AI_MODEL') ?? 'claude-sonnet-5-5' };
        this.log.warn('AI гаралт facts-д байхгүй тоо агуулсан тул шаблон руу буцлаа');
      } catch (e: any) { this.log.warn(`LLM алдаа: ${e?.message}`); }
    }
    return { ...base, text: this.template(kind, facts.lines), generatedBy: 'template' };
  }

  /** LLM-гүй үед: зөвхөн баталгаатай мөрүүдээс бүрдсэн тайлбар */
  private template(kind: string, lines: string[]) {
    return kind === 'university'
      ? `Дараах нь системд бүртгэлтэй мэдээллийн товч дүгнэлт:\n${lines.map((l) => `• ${l}`).join('\n')}\n«Мэдээлэл байхгүй» гэсэн хэсгийг албан ёсны сайтаас нөхөж шалгана уу.`
      : `Таны үр дүнгийн товч тайлбар:\n${lines.map((l) => `• ${l}`).join('\n')}`;
  }

  private async callLlm(key: string, subject: string, facts: string): Promise<string> {
    const system = 'Чи Монгол сурагч, оюутанд зориулсан боловсролын зөвлөх платформын туслах. ЗӨВХӨН доорх FACTS-д байгаа мэдээллийг ашигла. FACTS-д байхгүй рейтинг, төлбөр, элсэлтийн шаардлага, тэтгэлэг, визийн мэдээллийг ХЭЗЭЭ Ч зохиохгүй; байхгүй бол «Мэдээлэл байхгүй» гэж хэл. Тоо зөвхөн FACTS-д байгаагаар. Баталгаажаагүй/хуучирсан гэж тэмдэглэсэн мэдээллийг тэр чигээр нь дурд. Албан ёсны сайтаас баталгаажуулахыг сануул. Монгол хэлээр, 120–220 үгтэй, ойлгомжтой бич.';
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST', signal: AbortSignal.timeout(25000),
      headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({ model: this.cfg.get('AI_MODEL') ?? 'claude-sonnet-5-5', max_tokens: 700, system, messages: [{ role: 'user', content: `${subject}-ийн талаар тайлбар бич.\n\nFACTS:\n${facts}` }] }),
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const j: any = await r.json();
    return (j.content ?? []).filter((c: any) => c.type === 'text').map((c: any) => c.text).join('\n').trim();
  }
}
