import { Controller, Get, Module, NotFoundException, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Career, CareerCategory, Skill } from '../../schemas';
import { Public } from '../../common/guards/auth';
import { escapeRegex, parsePaging, toArray } from '../../common/pagination';

@ApiTags('careers')
@Public()
@Controller()
export class CareersController {
  constructor(
    @InjectModel(Career.name) private careers: Model<Career>,
    @InjectModel(CareerCategory.name) private cats: Model<CareerCategory>,
    @InjectModel(Skill.name) private skills: Model<Skill>,
  ) {}

  @Get('careers')
  async list(@Query() q: any) {
    const { page, pageSize, skip } = parsePaging(q, 12, 60);
    const filter: any = { status: 'published', deletedAt: null };
    if (q.q) { const re = new RegExp(escapeRegex(String(q.q)), 'i'); filter.$or = [{ nameMn: re }, { nameEn: re }, { description: re }]; }
    const cat = toArray(q.category);
    if (cat.length) {
      const cs = await this.cats.find({ slug: { $in: cat } }).select('_id').lean();
      filter.categoryId = { $in: cs.map((c) => c._id) };
    }
    const [items, total] = await Promise.all([
      this.careers.find(filter).sort({ nameMn: 1 }).skip(skip).limit(pageSize).populate('categoryId', 'slug nameMn').select('slug nameMn nameEn description categoryId source').lean(),
      this.careers.countDocuments(filter),
    ]);
    return { items, total, page, pageSize };
  }

  @Get('careers/categories') categories() { return this.cats.find().sort({ nameMn: 1 }).lean(); }

  @Get('careers/:slug')
  async one(@Param('slug') slug: string) {
    const c: any = await this.careers.findOne({ slug, status: 'published', deletedAt: null }).populate('categoryId', 'slug nameMn').select('-profile').lean();
    if (!c) throw new NotFoundException({ code: 'NOT_FOUND', message: 'Мэргэжил олдсонгүй.' });
    const skills = await this.skills.find({ key: { $in: c.requiredSkills } }).select('key nameMn').lean();
    // ЭЕШ-ийн төлөв: мэдээлэл бий → available; байхгүй, Job Zone ≤ 3 (мэргэжлийн сургалт/коллеж, O*NET) → not_required; бусад → unknown (мэдээлэл дутуу).
    const entranceExamStatus = c.entranceExams?.length ? 'available' : c.jobZone != null && c.jobZone <= 3 ? 'not_required' : 'unknown';
    return { ...c, requiredSkillsDetail: skills, entranceExamStatus };
  }
}

@Module({ controllers: [CareersController] })
export class CareersModule {}
