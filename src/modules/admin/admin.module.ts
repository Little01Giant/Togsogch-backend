import { BadRequestException, Body, Controller, Delete, Get, HttpCode, Injectable, Module, NotFoundException, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { publicCache } from '../../common/ttl-cache';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AdminAuditLog, Assessment, AssessmentAttempt, AssessmentQuestion, Career, CareerCategory, ContentSource, Country, MasterField, Payment, PaymentProduct, Program, Skill, University, User } from '../../schemas';
import { CurrentUser, Roles } from '../../common/guards/auth';
import { escapeRegex, parsePaging } from '../../common/pagination';
import { slugify } from '../../common/slug';
import { deriveUniversity } from '../catalog/catalog.service';
import { AssessmentsModule } from '../assessments/assessments.module';
import { AssessmentsService } from '../assessments/assessments.service';
import { AdminToolsController } from './tools.controller';
import { findUnsafeUrls, str } from '../../common/security';

const STRIP = ['_id', 'id', '__v', 'createdAt', 'updatedAt', 'deletedAt'];

@Injectable()
export class AuditService {
  constructor(@InjectModel(AdminAuditLog.name) private logs: Model<AdminAuditLog>) {}
  log(actor: { id: string; email: string }, action: string, resource: string, resourceId?: string, changes?: any) {
    return this.logs.create({ actorId: actor.id as any, actorEmail: actor.email, action, resource, resourceId, changes }).catch(() => undefined);
  }
}

interface ResourceDef { model: Model<any>; soft: boolean; slugFrom?: string; searchFields: string[]; hasStatus: boolean }

@ApiTags('admin')
@Roles('admin')
@Controller('admin')
export class AdminCrudController {
  private resources: Record<string, ResourceDef>;

  constructor(
    @InjectModel(Country.name) countries: Model<Country>, @InjectModel(University.name) private unis: Model<University>,
    @InjectModel(Program.name) programs: Model<Program>, @InjectModel(Career.name) careers: Model<Career>,
    @InjectModel(CareerCategory.name) cats: Model<CareerCategory>, @InjectModel(Skill.name) skills: Model<Skill>,
    @InjectModel(ContentSource.name) sources: Model<ContentSource>, @InjectModel(MasterField.name) masterFields: Model<MasterField>, @InjectModel(PaymentProduct.name) paymentProducts: Model<PaymentProduct>, private audit: AuditService,
  ) {
    this.resources = {
      countries: { model: countries, soft: true, slugFrom: 'nameEn', searchFields: ['nameMn', 'nameEn', 'code'], hasStatus: true },
      universities: { model: unis, soft: true, slugFrom: 'name', searchFields: ['name', 'nameMn', 'city'], hasStatus: true },
      programs: { model: programs, soft: true, searchFields: ['name', 'department'], hasStatus: true },
      careers: { model: careers, soft: true, slugFrom: 'nameEn', searchFields: ['nameMn', 'nameEn'], hasStatus: true },
      'career-categories': { model: cats, soft: false, slugFrom: 'nameEn', searchFields: ['nameMn', 'nameEn'], hasStatus: false },
      skills: { model: skills, soft: false, searchFields: ['nameMn', 'key'], hasStatus: false },
      'payment-products': { model: paymentProducts, soft: false, searchFields: ['key', 'title'], hasStatus: false },
      'master-fields': { model: masterFields, soft: true, slugFrom: 'nameEn', searchFields: ['nameMn', 'nameEn'], hasStatus: true },
      sources: { model: sources, soft: false, searchFields: ['name', 'url'], hasStatus: false },
    };
  }

  private def(name: string) {
    const d = this.resources[name];
    if (!d) throw new NotFoundException({ code: 'NOT_FOUND', message: 'Ийм нөөц байхгүй.' });
    return d;
  }
  private clean(body: any) {
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new BadRequestException({ code: 'VALIDATION_ERROR', message: 'Буруу өгөгдөл.' });
    const o = { ...body };
    STRIP.forEach((k) => delete o[k]);
    const bad = findUnsafeUrls(o);
    if (bad.length) throw new BadRequestException({ code: 'UNSAFE_URL', message: `URL зөвхөн http(s):// байх ёстой: ${bad.join(', ')}` });
    return o;
  }
  private finalize(name: string, doc: any, body: any) {
    if (this.resources[name].slugFrom && !doc.slug) doc.slug = slugify(String(doc[this.resources[name].slugFrom!] ?? ''));
    if (body.source && doc.source && !body.source.lastUpdatedAt) doc.source.lastUpdatedAt = new Date();
    if (name === 'universities') {
      const d = deriveUniversity(doc.toObject());
      doc.minTuitionUsd = d.minTuitionUsd; doc.maxTuitionUsd = d.maxTuitionUsd; doc.bestQsWorld = d.bestQsWorld; doc.bestQsAsia = d.bestQsAsia;
    }
  }

  @Get(':resource')
  async list(@Param('resource') r: string, @Query() q: any) {
    const d = this.def(r);
    const { page, pageSize, skip } = parsePaging(q, 20, 100);
    const filter: any = d.soft ? { deletedAt: null } : {};
    if (str(q.status) && d.hasStatus) filter.status = str(q.status);
    if (str(q.universityId)) filter.universityId = str(q.universityId);
    if (q.q) { const re = new RegExp(escapeRegex(String(q.q)), 'i'); filter.$or = d.searchFields.map((f) => ({ [f]: re })); }
    const [items, total] = await Promise.all([d.model.find(filter).sort({ updatedAt: -1, _id: -1 }).skip(skip).limit(pageSize).lean(), d.model.countDocuments(filter)]);
    return { items, total, page, pageSize };
  }

  @Get(':resource/:id')
  async get(@Param('resource') r: string, @Param('id') id: string) {
    const doc = await this.def(r).model.findById(id).lean();
    if (!doc) throw new NotFoundException({ code: 'NOT_FOUND', message: 'Бичлэг олдсонгүй.' });
    return doc;
  }

  @Post(':resource')
  async create(@CurrentUser() u: any, @Param('resource') r: string, @Body() body: any) {
    const d = this.def(r);
    const data = this.clean(body);
    const doc = new d.model(data);
    this.finalize(r, doc, data);
    await doc.save();
    publicCache.clear();
    await this.audit.log(u, 'create', r, String(doc._id), { name: (doc as any).name ?? (doc as any).nameMn });
    return doc.toObject();
  }

  @Patch(':resource/:id')
  async update(@CurrentUser() u: any, @Param('resource') r: string, @Param('id') id: string, @Body() body: any) {
    const d = this.def(r);
    const data = this.clean(body);
    const doc = await d.model.findById(id);
    if (!doc || (doc as any).deletedAt) throw new NotFoundException({ code: 'NOT_FOUND', message: 'Бичлэг олдсонгүй.' });
    doc.set(data);
    this.finalize(r, doc, data);
    await doc.save();
    publicCache.clear();
    await this.audit.log(u, 'update', r, id, { fields: Object.keys(data) });
    return doc.toObject();
  }

  @Post(':resource/:id/:action') @HttpCode(200)
  async toggle(@CurrentUser() u: any, @Param('resource') r: string, @Param('id') id: string, @Param('action') action: string) {
    const d = this.def(r);
    if (action === 'verify') {
      const doc: any = await d.model.findById(id);
      if (!doc || !d.model.schema.path('source')) throw new NotFoundException({ code: 'NOT_FOUND', message: 'Бичлэг олдсонгүй.' });
      doc.source = { ...(doc.source?.toObject?.() ?? doc.source ?? {}), verifiedAt: new Date(), verifiedBy: u.email, verificationStatus: 'verified', lastUpdatedAt: new Date() };
      await doc.save();
      publicCache.clear();
      await this.audit.log(u, 'verify', r, id);
      return { id, verifiedAt: doc.source.verifiedAt };
    }
    if (!d.hasStatus || !['publish', 'unpublish'].includes(action)) throw new BadRequestException({ code: 'BAD_REQUEST', message: 'Буруу үйлдэл.' });
    const doc = await d.model.findByIdAndUpdate(id, { $set: { status: action === 'publish' ? 'published' : 'draft' } }, { returnDocument: "after" });
    if (!doc) throw new NotFoundException({ code: 'NOT_FOUND', message: 'Бичлэг олдсонгүй.' });
    publicCache.clear();
    await this.audit.log(u, action, r, id);
    return { id, status: (doc as any).status };
  }

  @Delete(':resource/:id') @HttpCode(200)
  async remove(@CurrentUser() u: any, @Param('resource') r: string, @Param('id') id: string) {
    const d = this.def(r);
    const res = d.soft ? await d.model.findByIdAndUpdate(id, { $set: { deletedAt: new Date(), status: 'draft' } }) : await d.model.findByIdAndDelete(id);
    if (!res) throw new NotFoundException({ code: 'NOT_FOUND', message: 'Бичлэг олдсонгүй.' });
    publicCache.clear();
    await this.audit.log(u, 'delete', r, id);
    return { ok: true };
  }
}

/** Тестийн удирдлага: асуулт, онооны тохиргоо, хувилбар */
@ApiTags('admin')
@Roles('admin')
@Controller('admin/assessments')
export class AdminAssessmentsController {
  constructor(
    @InjectModel(Assessment.name) private assessments: Model<Assessment>, @InjectModel(AssessmentQuestion.name) private questions: Model<AssessmentQuestion>,
    private svc: AssessmentsService, private audit: AuditService,
  ) {}

  @Get() async list() {
    const rows: any[] = await this.assessments.find().sort({ key: 1 }).lean();
    return Promise.all(rows.map(async (a) => ({ ...a, questionCount: await this.questions.countDocuments({ assessmentId: a._id, deletedAt: null }) })));
  }

  @Get(':key') async one(@Param('key') key: string) {
    const a = await this.assessments.findOne({ key }).lean();
    if (!a) throw new NotFoundException({ code: 'NOT_FOUND', message: 'Тест олдсонгүй.' });
    return a;
  }

  @Patch(':key') async update(@CurrentUser() u: any, @Param('key') key: string, @Body() body: any) {
    const { title, subtitle, description, scoringConfig, sections } = body ?? {};
    const a = await this.assessments.findOneAndUpdate({ key }, { $set: JSON.parse(JSON.stringify({ title, subtitle, description, scoringConfig, sections })) }, { returnDocument: "after" });
    if (!a) throw new NotFoundException({ code: 'NOT_FOUND', message: 'Тест олдсонгүй.' });
    await this.audit.log(u, 'update', 'assessments', key);
    return a;
  }

  @Get(':key/questions') async listQ(@Param('key') key: string) {
    const a = await this.assessments.findOne({ key }).lean();
    if (!a) throw new NotFoundException({ code: 'NOT_FOUND', message: 'Тест олдсонгүй.' });
    return this.questions.find({ assessmentId: a._id, deletedAt: null }).sort({ order: 1 }).lean();
  }

  @Post(':key/questions') async createQ(@CurrentUser() u: any, @Param('key') key: string, @Body() body: any) {
    const a = await this.assessments.findOne({ key }).lean();
    if (!a) throw new NotFoundException({ code: 'NOT_FOUND', message: 'Тест олдсонгүй.' });
    const last = await this.questions.findOne({ assessmentId: a._id }).sort({ order: -1 }).lean();
    const q = await this.questions.create({ ...body, _id: undefined, assessmentId: a._id, order: body?.order ?? (last?.order ?? -1) + 1 });
    await this.audit.log(u, 'create', 'assessmentQuestions', String(q._id), { key: q.key });
    return q;
  }

  @Patch(':key/questions/:id') async updateQ(@CurrentUser() u: any, @Param('id') id: string, @Body() body: any) {
    const data = { ...body }; ['_id', 'assessmentId', 'createdAt', 'updatedAt', 'deletedAt'].forEach((k) => delete data[k]);
    const q = await this.questions.findById(id);
    if (!q || q.deletedAt) throw new NotFoundException({ code: 'NOT_FOUND', message: 'Асуулт олдсонгүй.' });
    q.set(data); await q.save();
    await this.audit.log(u, 'update', 'assessmentQuestions', id);
    return q;
  }

  @Delete(':key/questions/:id') @HttpCode(200) async deleteQ(@CurrentUser() u: any, @Param('id') id: string) {
    await this.questions.findByIdAndUpdate(id, { $set: { deletedAt: new Date() } });
    await this.audit.log(u, 'delete', 'assessmentQuestions', id);
    return { ok: true };
  }

  @Post(':key/publish') @HttpCode(200) async publish(@CurrentUser() u: any, @Param('key') key: string) {
    const r = await this.svc.publish(key, u.email);
    await this.audit.log(u, 'publish', 'assessments', key, r);
    return r;
  }
}

@ApiTags('admin')
@Controller('admin')
export class AdminOverviewController {
  constructor(
    @InjectModel(User.name) private users: Model<User>, @InjectModel(Country.name) private countries: Model<Country>,
    @InjectModel(University.name) private unis: Model<University>, @InjectModel(Program.name) private programs: Model<Program>,
    @InjectModel(Career.name) private careers: Model<Career>, @InjectModel(AssessmentAttempt.name) private attempts: Model<AssessmentAttempt>,
    @InjectModel(AdminAuditLog.name) private logs: Model<AdminAuditLog>, @InjectModel(Payment.name) private payments: Model<Payment>,
  ) {}

  @Roles('admin') @Get('billing/payments')
  async listPayments(@Query() q: any) {
    const { page, pageSize, skip } = parsePaging(q, 20, 100);
    const filter: any = {};
    if (str(q.status)) filter.status = str(q.status);
    if (str(q.productKey)) filter.productKey = str(q.productKey);
    if (q.q) { const re = new RegExp(escapeRegex(String(q.q)), 'i'); filter.$or = [{ senderInvoiceNo: re }, { qpayInvoiceId: re }, { qpayPaymentId: re }]; }
    const [rows, total] = await Promise.all([this.payments.find(filter).sort({ createdAt: -1 }).skip(skip).limit(pageSize).populate('userId', 'email name').lean(), this.payments.countDocuments(filter)]);
    return { items: rows.map((p: any) => ({ id: String(p._id), user: p.userId ? { email: p.userId.email, name: p.userId.name } : null, productKey: p.productKey, amount: p.amount, currency: p.currency, status: p.status, provider: p.provider, senderInvoiceNo: p.senderInvoiceNo, qpayInvoiceId: p.qpayInvoiceId ?? null, qpayPaymentId: p.qpayPaymentId ?? null, createdAt: p.createdAt, paidAt: p.paidAt ?? null, logs: p.logs })), total, page, pageSize };
  }

  @Roles('admin') @Get('billing/stats')
  async paymentStats() {
    const agg = await this.payments.aggregate([{ $group: { _id: { status: '$status', productKey: '$productKey' }, n: { $sum: 1 }, amount: { $sum: { $cond: [{ $eq: ['$status', 'paid'] }, '$amount', 0] } } } }]);
    const byStatus: Record<string, number> = {}; const byProduct: Record<string, { paid: number; revenue: number }> = {}; let revenue = 0;
    for (const a of agg) { byStatus[a._id.status] = (byStatus[a._id.status] ?? 0) + a.n; byProduct[a._id.productKey] ??= { paid: 0, revenue: 0 }; if (a._id.status === 'paid') { byProduct[a._id.productKey].paid += a.n; byProduct[a._id.productKey].revenue += a.amount; revenue += a.amount; } }
    return { revenueMnt: revenue, byStatus, byProduct };
  }

  @Roles('admin') @Get('stats/overview')
  async stats() {
    const since = new Date(Date.now() - 24 * 3600 * 1000);
    const [totalUsers, dau, completed, started, countries, universities, programs, careers] = await Promise.all([
      this.users.countDocuments({ deletedAt: null }), this.users.countDocuments({ lastLoginAt: { $gte: since } }),
      this.attempts.countDocuments({ status: 'completed' }), this.attempts.countDocuments(),
      this.countries.countDocuments({ deletedAt: null }), this.unis.countDocuments({ deletedAt: null }),
      this.programs.countDocuments({ deletedAt: null }), this.careers.countDocuments({ deletedAt: null }),
    ]);
    return { totalUsers, dailyActiveUsers: dau, assessmentsCompleted: completed, assessmentsStarted: started, countries, universities, programs, careers, payments: await this.paymentStats() };
  }

  @Roles('admin') @Get('audit-logs')
  async audits(@Query() q: any) {
    const { page, pageSize, skip } = parsePaging(q, 30, 100);
    const [items, total] = await Promise.all([this.logs.find().sort({ createdAt: -1 }).skip(skip).limit(pageSize).lean(), this.logs.countDocuments()]);
    return { items, total, page, pageSize };
  }

  @Roles('admin') @Get('manage/users')
  async listUsers(@Query() q: any) {
    const { page, pageSize, skip } = parsePaging(q, 20, 100);
    const filter: any = { deletedAt: null };
    if (q.q) { const re = new RegExp(escapeRegex(String(q.q)), 'i'); filter.$or = [{ email: re }, { name: re }]; }
    const [items, total] = await Promise.all([this.users.find(filter).sort({ createdAt: -1 }).skip(skip).limit(pageSize).select('email name role status lastLoginAt createdAt').lean(), this.users.countDocuments(filter)]);
    return { items, total, page, pageSize };
  }

  /** Эрх өөрчлөх — зөвхөн Super Admin */
  @Roles('super_admin') @Patch('manage/users/:id')
  async updateUser(@CurrentUser() actor: any, @Param('id') id: string, @Body() body: { role?: string; status?: string }) {
    if (id === actor.id) throw new BadRequestException({ code: 'SELF_CHANGE', message: 'Өөрийн эрхийг өөрчлөх боломжгүй.' });
    const set: any = {};
    if (body.role) { if (!['user', 'admin', 'super_admin'].includes(body.role)) throw new BadRequestException({ code: 'VALIDATION_ERROR', message: 'Буруу эрх.' }); set.role = body.role; }
    if (body.status) { if (!['active', 'blocked'].includes(body.status)) throw new BadRequestException({ code: 'VALIDATION_ERROR', message: 'Буруу төлөв.' }); set.status = body.status; set.refreshTokens = []; }
    const u = await this.users.findByIdAndUpdate(id, { $set: set }, { returnDocument: "after" }).select('email name role status');
    if (!u) throw new NotFoundException({ code: 'NOT_FOUND', message: 'Хэрэглэгч олдсонгүй.' });
    await this.logs.create({ actorId: actor.id, actorEmail: actor.email, action: 'role_change', resource: 'users', resourceId: id, changes: set });
    return u;
  }
}

@Module({
  imports: [AssessmentsModule],
  controllers: [AdminOverviewController, AdminToolsController, AdminAssessmentsController, AdminCrudController],
  providers: [AuditService],
})
export class AdminModule {}
