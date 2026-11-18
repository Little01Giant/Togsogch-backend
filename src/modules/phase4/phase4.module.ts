import { Body, Controller, Get, HttpCode, Module, NotFoundException, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectModel } from '@nestjs/mongoose';
import { Throttle } from '@nestjs/throttler';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { Model, Types } from 'mongoose';
import { HttpException } from '@nestjs/common';
import { Career, Program, Setting, University } from '../../schemas';
import { EntitlementsService } from '../payments/payments.service';
import { Authenticated, CurrentUser, Public } from '../../common/guards/auth';
import { escapeRegex } from '../../common/pagination';
import { AssessmentsModule } from '../assessments/assessments.module';
import { CatalogModule } from '../catalog/catalog.module';
import { AiService } from './ai.service';
import { ApplicantProfile, checkEligibility } from './eligibility';

export { CRITERIA, DEFAULT_METHODOLOGY, rankFuture } from './future';
import { CRITERIA, DEFAULT_METHODOLOGY, rankFuture } from './future';

class EligibilityDto {
  @IsString() programId: string;
  @IsOptional() profile?: ApplicantProfile;
}
class AiDto { @IsIn(['university', 'result']) kind: 'university' | 'result'; @IsString() id: string; }

@ApiTags('phase4')
@Controller()
export class Phase4Controller {
  constructor(
    @InjectModel(Setting.name) private settings: Model<Setting>, @InjectModel(Career.name) private careers: Model<Career>,
    @InjectModel(Program.name) private programs: Model<Program>, @InjectModel(University.name) private unis: Model<University>, private ent: EntitlementsService, private ai: AiService,
  ) {}

  @Public() @Get('future-careers')
  async future() {
    const s: any = await this.settings.findOne({ key: 'future-methodology' }).lean();
    const meth = { ...DEFAULT_METHODOLOGY, ...(s?.value ?? {}) };
    const showRank = meth.published && meth.year && meth.sources.length > 0;
    const careers = showRank ? await this.careers.find({ status: 'published', deletedAt: null, 'future.scores': { $exists: true } }).populate('categoryId', 'nameMn slug').lean() : [];
    // Эрэмбэ нийтлэгдээгүй үед: эрэмбэгүй, редакцийн сонголтын 25 нэр дэвшигч мэргэжил (оноо/хувь харуулахгүй)
    const candidates: any[] = showRank ? [] : await this.careers.find({ status: 'published', deletedAt: null, 'future.candidate': true }).populate('categoryId', 'nameMn slug').sort({ nameMn: 1 }).limit(25).lean();
    return {
      candidates: candidates.map((c) => ({ slug: c.slug, nameMn: c.nameMn, nameEn: c.nameEn, category: c.categoryId?.nameMn ?? null, categorySlug: c.categoryId?.slug ?? null, description: c.description ?? null })),
      methodology: { year: meth.year, weights: meth.weights, sources: meth.sources, notes: meth.notes, criteria: CRITERIA },
      ranked: showRank ? rankFuture(meth, careers) : [], published: !!showRank,
      disclaimer: 'Энэ жагсаалт нь ирээдүйн таамаг бөгөөд ажил эсвэл орлогын баталгаа биш. Эрэмбэ нь заасан эх сурвалж, судалгааны он, аргачлалд суурилсан.',
    };
  }

  @Public() @Get('meta/exchange-rate')
  async rate() {
    const s: any = await this.settings.findOne({ key: 'exchange-rate' }).lean();
    const v = s?.value;
    return v?.usdToMnt ? { usdToMnt: v.usdToMnt, date: v.date ?? null, source: v.source ?? null, sourceUrl: v.sourceUrl ?? null } : { usdToMnt: null, date: null, source: null, sourceUrl: null };
  }

  /** Элсэлтийн шалгагчид хөтөлбөр сонгох */
  @Public() @Get('programs/search')
  async searchPrograms(@Query('q') q?: string) {
    const filter: any = { status: 'published', deletedAt: null };
    if (q) filter.name = new RegExp(escapeRegex(q), 'i');
    const items: any[] = await this.programs.find(filter).sort({ name: 1 }).limit(30).populate('universityId', 'name slug').lean();
    return items.map((p) => ({ id: String(p._id), name: p.name, level: p.level, university: p.universityId ? { name: p.universityId.name, slug: p.universityId.slug } : null }));
  }

  /** Хэрэглэгчийн оноо хадгалагдахгүй. Элсэлтийн баталгаа биш. */
  /** Хөтөлбөрийн шаардлага = төлбөртэй мэдээлэл → зөвхөн тухайн сургуулийг нээсэн (эсвэл админ) хэрэглэгчид */
  @Authenticated() @Post('eligibility/check') @HttpCode(200) @Throttle({ default: { limit: 60, ttl: 60000 } })
  async eligibility(@Body() dto: EligibilityDto, @CurrentUser() user: any) {
    if (!Types.ObjectId.isValid(dto.programId)) throw new NotFoundException({ code: 'NOT_FOUND', message: 'Хөтөлбөр олдсонгүй.' });
    const p: any = await this.programs.findOne({ _id: dto.programId, status: 'published', deletedAt: null }).populate('universityId', 'name slug countryId').lean();
    if (!p) throw new NotFoundException({ code: 'NOT_FOUND', message: 'Хөтөлбөр олдсонгүй.' });
    if (user.role === 'user' && !(await this.ent.hasUniversityAccess(user.id, p.universityId?._id, p.universityId?.countryId))) throw new HttpException({ code: 'UNIVERSITY_LOCKED', message: 'Энэ сургуулийн шаардлагыг нээхийн тулд эхлээд сургуулийн мэдээллийг нээнэ үү.' }, 402);
    const r = checkEligibility(p.requirements ?? [], dto.profile ?? {});
    return { program: { id: String(p._id), name: p.name, level: p.level, university: p.universityId ? { name: p.universityId.name, slug: p.universityId.slug } : null, source: p.source ?? null }, ...r, disclaimer: 'Энэ нь урьдчилсан шалгалт бөгөөд элсэлтийн баталгаа биш. Албан ёсны шаардлагыг тухайн их сургуулийн хуудсаас шалгана уу.' };
  }

  @Post('ai/explain') @HttpCode(200) @Throttle({ default: { limit: 10, ttl: 60000 } })
  explain(@CurrentUser() u: any, @Body() dto: AiDto) { return this.ai.explain(u, dto.kind, dto.id); }
}

@Module({ imports: [AssessmentsModule, CatalogModule], controllers: [Phase4Controller], providers: [AiService], exports: [AiService] })
export class Phase4Module {}
