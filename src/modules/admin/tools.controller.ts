import { BadRequestException, Body, Controller, Get, Put, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { publicCache } from '../../common/ttl-cache';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AdminAuditLog, AssessmentAttempt, AssessmentResult, Career, Country, Payment, Program, Setting, University } from '../../schemas';
import { CurrentUser, Roles } from '../../common/guards/auth';
import { parsePaging } from '../../common/pagination';
import { deriveUniversity } from '../catalog/catalog.service';
import { CRITERIA, DEFAULT_METHODOLOGY } from '../phase4/future';
import { parseUniversityRow } from '../phase4/import';

const SETTING_KEYS = ['future-methodology', 'exchange-rate'];
const STALE_MODELS = ['universities', 'countries', 'programs', 'careers'];

/** Админы багажууд: тохиргоо, импорт, мэдээллийн чанар, аналитик. ЗАЙЛШГҮЙ: AdminCrudController-оос ӨМНӨ бүртгэнэ. */
@ApiTags('admin')
@Roles('admin')
@Controller('admin/tools')
export class AdminToolsController {
  constructor(
    @InjectModel(Setting.name) private settings: Model<Setting>, @InjectModel(University.name) private unis: Model<University>, @InjectModel(Country.name) private countries: Model<Country>,
    @InjectModel(Program.name) private programs: Model<Program>, @InjectModel(Career.name) private careers: Model<Career>, @InjectModel(AdminAuditLog.name) private logs: Model<AdminAuditLog>,
    @InjectModel(AssessmentAttempt.name) private attempts: Model<AssessmentAttempt>, @InjectModel(AssessmentResult.name) private results: Model<AssessmentResult>, @InjectModel(Payment.name) private payments: Model<Payment>,
  ) {}

  @Get('settings/:key')
  async getSetting(@Param('key') key: string) {
    if (!SETTING_KEYS.includes(key)) throw new BadRequestException({ code: 'BAD_REQUEST', message: 'Буруу тохиргооны түлхүүр.' });
    const s: any = await this.settings.findOne({ key }).lean();
    return key === 'future-methodology' ? { ...DEFAULT_METHODOLOGY, ...(s?.value ?? {}) } : s?.value ?? {};
  }

  @Put('settings/:key')
  async putSetting(@CurrentUser() u: any, @Param('key') key: string, @Body() body: any) {
    if (!SETTING_KEYS.includes(key)) throw new BadRequestException({ code: 'BAD_REQUEST', message: 'Буруу тохиргооны түлхүүр.' });
    let value = body;
    if (key === 'future-methodology') {
      const w = body?.weights ?? {};
      if (CRITERIA.some((k) => typeof w[k] !== 'number' || w[k] < 0)) throw new BadRequestException({ code: 'VALIDATION_ERROR', message: 'Бүх шалгуурын жин (≥0 тоо) шаардлагатай.' });
      value = { published: !!body.published, year: body.year ? Number(body.year) : null, weights: Object.fromEntries(CRITERIA.map((k) => [k, w[k]])), sources: (body.sources ?? []).filter((s: any) => s?.name && /^https?:\/\//.test(s?.url ?? '')), notes: String(body.notes ?? '') };
      if (value.published && (!value.year || !value.sources.length)) throw new BadRequestException({ code: 'VALIDATION_ERROR', message: 'Нийтлэхэд судалгааны он болон дор хаяж нэг эх сурвалж (URL-тай) шаардлагатай.' });
    } else {
      const r = Number(body?.usdToMnt);
      if (!(r > 0)) throw new BadRequestException({ code: 'VALIDATION_ERROR', message: 'usdToMnt (>0) шаардлагатай.' });
      if (!body?.date || !body?.source) throw new BadRequestException({ code: 'VALIDATION_ERROR', message: 'Ханшийн огноо болон эх сурвалж шаардлагатай.' });
      value = { usdToMnt: r, date: String(body.date), source: String(body.source), sourceUrl: body.sourceUrl ? String(body.sourceUrl) : undefined };
    }
    await this.settings.updateOne({ key }, { $set: { value, updatedBy: u.email } }, { upsert: true });
    await this.logs.create({ actorId: u.id, actorEmail: u.email, action: 'update', resource: 'settings', resourceId: key });
    return value;
  }

  /** Их сургуулийн CSV/JSON импорт. dryRun=true үед зөвхөн шалгана. Шинэ бичлэг draft + баталгаажаагүй төлөвтэй орно. */
  @Post('import/universities')
  async importUniversities(@CurrentUser() u: any, @Body() body: { rows: Record<string, any>[]; dryRun?: boolean }) {
    const rows = Array.isArray(body?.rows) ? body.rows.slice(0, 500) : [];
    if (!rows.length) throw new BadRequestException({ code: 'VALIDATION_ERROR', message: 'Мөр байхгүй байна.' });
    const dry = body.dryRun !== false;
    const cmap = new Map((await this.countries.find({ deletedAt: null }).select('slug').lean()).map((c: any) => [c.slug, c._id]));
    const report: any[] = []; let created = 0, updated = 0, failed = 0;
    for (let i = 0; i < rows.length; i++) {
      const p = parseUniversityRow(rows[i]);
      if (!p.ok) { failed++; report.push({ row: i + 1, name: rows[i]?.name ?? null, status: 'error', errors: p.errors }); continue; }
      const { slug, doc, ranking, tuition, countrySlug } = p.value;
      const countryId = cmap.get(countrySlug);
      if (!countryId) { failed++; report.push({ row: i + 1, name: doc.name, status: 'error', errors: [`countrySlug «${countrySlug}» олдсонгүй`] }); continue; }
      const existing: any = await this.unis.findOne({ slug, deletedAt: null });
      if (dry) { existing ? updated++ : created++; report.push({ row: i + 1, name: doc.name, status: existing ? 'update' : 'create' }); continue; }
      const target: any = existing ?? new this.unis({ slug, countryId, status: 'draft' });
      target.set({ ...doc, countryId });
      if (ranking && !target.rankings.some((r: any) => r.provider === ranking.provider && r.year === ranking.year && (r.subject ?? null) === null)) target.rankings.push(ranking);
      if (tuition && !target.tuition.some((t: any) => t.level === tuition.level && t.academicYear === tuition.academicYear)) target.tuition.push(tuition);
      Object.assign(target, pick(deriveUniversity(target.toObject())));
      await target.save();
      existing ? updated++ : created++;
      report.push({ row: i + 1, name: doc.name, status: existing ? 'updated' : 'created' });
    }
    if (!dry) publicCache.clear();
    if (!dry) await this.logs.create({ actorId: u.id, actorEmail: u.email, action: 'import', resource: 'universities', changes: { created, updated, failed } });
    return { dryRun: dry, created, updated, failed, report };
  }

  /** Баталгаажуулалт хэрэгтэй (verifiedAt байхгүй эсвэл N сараас хуучин) бичлэгүүд */
  @Get('stale')
  async stale(@Query() q: any) {
    const resource = STALE_MODELS.includes(q.resource) ? q.resource : 'universities';
    const months = Math.max(1, Number(q.months) || 12);
    const { page, pageSize, skip } = parsePaging(q, 20, 100);
    const model: Model<any> = ({ universities: this.unis, countries: this.countries, programs: this.programs, careers: this.careers } as any)[resource];
    const cutoff = new Date(Date.now() - months * 30 * 24 * 3600 * 1000);
    const filter = { deletedAt: null, $or: [{ 'source.verifiedAt': null }, { 'source.verifiedAt': { $exists: false } }, { 'source.verifiedAt': { $lt: cutoff } }] };
    const [items, total] = await Promise.all([model.find(filter).sort({ 'source.verifiedAt': 1 }).skip(skip).limit(pageSize).select('name nameMn nameEn slug status source').lean(), model.countDocuments(filter)]);
    return { resource, months, items: items.map((x: any) => ({ id: String(x._id), name: x.name ?? x.nameMn ?? x.nameEn, status: x.status, verifiedAt: x.source?.verifiedAt ?? null, sourceUrl: x.source?.sourceUrl ?? null, verificationStatus: x.source?.verificationStatus ?? 'unverified' })), total, page, pageSize };
  }

  @Get('analytics')
  async analytics(@Query('days') d?: string) {
    const days = Math.min(180, Math.max(7, Number(d) || 30));
    const since = new Date(Date.now() - days * 24 * 3600 * 1000);
    const day = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: 'Asia/Ulaanbaatar' } };
    const [started, completed, topCareers, byTest, revenue] = await Promise.all([
      this.attempts.aggregate([{ $match: { createdAt: { $gte: since } } }, { $group: { _id: day, n: { $sum: 1 } } }]),
      this.attempts.aggregate([{ $match: { status: 'completed', completedAt: { $gte: since } } }, { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$completedAt', timezone: 'Asia/Ulaanbaatar' } }, n: { $sum: 1 } } }]),
      this.results.aggregate([{ $match: { assessmentKey: 'career', createdAt: { $gte: since } } }, { $project: { top: { $arrayElemAt: ['$payload.careerMatches', 0] } } }, { $group: { _id: '$top.nameMn', n: { $sum: 1 } } }, { $sort: { n: -1 } }, { $limit: 10 }]),
      this.attempts.aggregate([{ $match: { createdAt: { $gte: since } } }, { $group: { _id: { key: '$assessmentKey', status: '$status' }, n: { $sum: 1 } } }]),
      this.payments.aggregate([{ $match: { status: 'paid', paidAt: { $gte: since } } }, { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$paidAt', timezone: 'Asia/Ulaanbaatar' } }, amount: { $sum: '$amount' }, n: { $sum: 1 } } }]),
    ]);
    const series: Record<string, any> = {};
    for (let i = days - 1; i >= 0; i--) { const k = new Date(Date.now() - i * 86400000 + 8 * 3600000).toISOString().slice(0, 10); series[k] = { date: k, started: 0, completed: 0, revenue: 0 }; }
    started.forEach((x) => series[x._id] && (series[x._id].started = x.n));
    completed.forEach((x) => series[x._id] && (series[x._id].completed = x.n));
    revenue.forEach((x) => series[x._id] && (series[x._id].revenue = x.amount));
    const funnel: Record<string, { started: number; completed: number }> = {};
    byTest.forEach((x) => { const f = (funnel[x._id.key] ??= { started: 0, completed: 0 }); f.started += x.n; if (x._id.status === 'completed') f.completed += x.n; });
    return { days, series: Object.values(series), funnel, topCareers: topCareers.map((t) => ({ name: t._id, count: t.n })) };
  }
}

function pick(d: any) { return { minTuitionUsd: d.minTuitionUsd, maxTuitionUsd: d.maxTuitionUsd, bestQsWorld: d.bestQsWorld, bestQsAsia: d.bestQsAsia }; }
