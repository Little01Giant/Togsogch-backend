import { BadRequestException, ConflictException, ForbiddenException, Global, Injectable, Logger, Module, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { randomBytes } from 'crypto';
import { AssessmentAttempt, Country, Payment, PaymentProduct, Subscription, University } from '../../schemas';
import { ProviderFactory } from './provider';
import { isTestEnv } from '../../common/security';

const INVOICE_TTL_MS = 30 * 60 * 1000;
const err = (C: any, code: string, message: string) => new C({ code, message });

/** Эрхийн шалгалт (premium нээлттэй эсэх). Бусад модуль ашиглана. */
@Injectable()
export class EntitlementsService {
  constructor(
    @InjectModel(Subscription.name) private subs: Model<Subscription>,
    @InjectModel(PaymentProduct.name) private products: Model<PaymentProduct>,
    @InjectModel(University.name) private universities: Model<University>,
  ) {}

  /**
   * Улс нээх үнэ = (нээгдэх, ө.х. үнэгүй биш нийтлэгдсэн сургуулийн тоо) × нэг сургуулийн нэгж үнэ (`country_access` бүтээгдэхүүний priceMnt).
   * Үнийг ЗӨВХӨН сервер тооцно (клиент дүн өгч болохгүй).
   */
  async countryQuote(countryId: Types.ObjectId | string) {
    const [schools, product] = await Promise.all([
      this.universities.countDocuments({ countryId, status: 'published', deletedAt: null, freeAccess: { $ne: true } }),
      this.products.findOne({ key: 'country_access', active: true }).select('priceMnt').lean(),
    ]);
    const unitMnt = product?.priceMnt ?? 500;
    return { schools, unitMnt, priceMnt: unitMnt * Math.max(schools, 1) };
  }

  async has(userId: string, productKey: string, targetId?: string | null) {
    return !!(await this.subs.exists({ userId, productKey, targetId: targetId ? new Types.ObjectId(targetId) : null }));
  }
  async list(userId: string) {
    return this.subs.find({ userId }).lean();
  }
  /** Сургуулийн төлбөртэй мэдээлэл нээлттэй эсэх: тэр сургуулийг, эсвэл тэр сургуулийн улсыг бүхэлд нь худалдан авсан. */
  async hasUniversityAccess(userId: string, universityId: unknown, countryId: unknown) {
    if (!universityId) return false;
    const or: any[] = [{ productKey: 'university_access', targetId: new Types.ObjectId(String(universityId)) }];
    if (countryId) or.push({ productKey: 'country_access', targetId: new Types.ObjectId(String(countryId)) });
    return !!(await this.subs.exists({ userId, $or: or }));
  }
  /** Нэг төлбөрөөс нэг эрх (paymentId unique) — давхар дуудагдсан ч давхардахгүй */
  async grant(p: { userId: any; productKey: string; targetId?: any; paymentId: any }) {
    try {
      await this.subs.updateOne({ paymentId: p.paymentId }, { $setOnInsert: { userId: p.userId, productKey: p.productKey, targetId: p.targetId ?? null, paymentId: p.paymentId } }, { upsert: true });
    } catch (e: any) {
      if (e?.code !== 11000) throw e; // эрх аль хэдийн байна
    }
  }
}

@Injectable()
export class PaymentsService {
  private log = new Logger('Payments');
  constructor(
    @InjectModel(Payment.name) private payments: Model<Payment>,
    @InjectModel(PaymentProduct.name) private products: Model<PaymentProduct>,
    @InjectModel(AssessmentAttempt.name) private attempts: Model<AssessmentAttempt>,
    @InjectModel(University.name) private universities: Model<University>,
    @InjectModel(Country.name) private countries: Model<Country>,
    private providers: ProviderFactory, private ent: EntitlementsService, private cfg: ConfigService,
  ) {}

  listProducts() { return this.products.find({ active: true }).sort({ priceMnt: 1 }).select('key title description priceMnt scope').lean(); }

  private shape(p: any) {
    return { id: String(p._id), productKey: p.productKey, targetId: p.targetId ? String(p.targetId) : null, amount: p.amount, currency: p.currency, status: p.status, qrImage: p.qrImage ?? null, qrText: p.qrText ?? null, shortUrl: p.shortUrl ?? null, urls: p.urls ?? [], expiresAt: p.expiresAt, paidAt: p.paidAt ?? null, provider: p.provider };
  }
  private note(p: any, event: string, detail?: string) { p.logs.push({ at: new Date(), event, detail }); }

  async create(userId: string, productKey: string, targetId: string | undefined, idempotencyKey?: string) {
    if (idempotencyKey) {
      const prev = await this.payments.findOne({ userId, idempotencyKey }).select('+qrImage +qrText').lean();
      if (prev) return this.shape(prev);
    }
    const product = await this.products.findOne({ key: productKey, active: true }).lean();
    if (!product) throw err(NotFoundException, 'NOT_FOUND', 'Ийм бүтээгдэхүүн олдсонгүй.');
    let target: Types.ObjectId | undefined;
    let amount = product.priceMnt;
    if (product.scope === 'attempt') {
      if (!targetId || !Types.ObjectId.isValid(targetId)) throw err(BadRequestException, 'TARGET_REQUIRED', 'Аль тестийн үр дүн болохыг заана уу.');
      const at = await this.attempts.findById(targetId).lean();
      if (!at || String(at.userId) !== userId) throw err(ForbiddenException, 'FORBIDDEN', 'Танд энэ үр дүнд хандах эрх байхгүй.');
      if (at.status !== 'completed') throw err(BadRequestException, 'NOT_COMPLETED', 'Тест дуусаагүй байна.');
      target = at._id as any;
    } else if (product.scope === 'university' || product.scope === 'country') {
      if (!targetId || !Types.ObjectId.isValid(targetId)) throw err(BadRequestException, 'TARGET_REQUIRED', product.scope === 'university' ? 'Аль сургуулийг нээхийг заана уу.' : 'Аль улсыг нээхийг заана уу.');
      if (product.scope === 'university') {
        const u: any = await this.universities.findOne({ _id: targetId, status: 'published', deletedAt: null }).select('_id countryId freeAccess').lean();
        if (!u) throw err(NotFoundException, 'NOT_FOUND', 'Их сургууль олдсонгүй.');
        if (u.freeAccess) throw err(ConflictException, 'FREE_ACCESS', 'Энэ сургуулийн мэдээлэл үнэгүй нээлттэй тул төлбөр шаардахгүй.');
        target = u._id;
        // улсыг бүхэлд нь аль хэдийн авсан бол сургуулийг тусад нь төлөх шаардлагагүй
        if (await this.ent.hasUniversityAccess(userId, u._id, u.countryId)) throw err(ConflictException, 'ALREADY_OWNED', 'Та энэ сургуулийн мэдээллийг аль хэдийн нээсэн байна.');
      } else {
        const c: any = await this.countries.findOne({ _id: targetId, status: 'published', deletedAt: null }).select('_id').lean();
        if (!c) throw err(NotFoundException, 'NOT_FOUND', 'Улс олдсонгүй.');
        target = c._id;
        amount = (await this.ent.countryQuote(c._id)).priceMnt; // сургуулийн тоо × нэгж үнэ
      }
    }
    // Бүх бүтээгдэхүүн нэг л удаа авна
    if (await this.ent.has(userId, productKey, target ? String(target) : null)) throw err(ConflictException, 'ALREADY_OWNED', 'Та энэ боломжийг аль хэдийн худалдан авсан байна.');

    // Давхар төлбөрөөс сэргийлэх: ижил бүтээгдэхүүн/зорилтод хүчинтэй pending invoice байвал түүнийг дахин ашиглана
    const open = await this.payments.findOne({ userId, productKey, targetId: target ?? null, status: 'pending', expiresAt: { $gt: new Date() } }).select('+qrImage +qrText').lean();
    if (open) return this.shape(open);

    const provider = this.providers.get();
    const senderInvoiceNo = `CH${Date.now().toString(36).toUpperCase()}${randomBytes(3).toString('hex').toUpperCase()}`;
    const callbackToken = randomBytes(24).toString('hex');
    const base = (this.cfg.get<string>('PUBLIC_API_URL') ?? `http://localhost:${this.cfg.get('PORT') ?? 4100}`).replace(/\/$/, '');
    const inv = await provider.createInvoice({ senderInvoiceNo, amount, description: `Chiglel: ${product.key}`, callbackUrl: `${base}/api/v1/payments/qpay/callback/${callbackToken}` });

    const doc = await this.payments.create({
      userId, productKey, targetId: target, amount, currency: 'MNT', status: 'pending', senderInvoiceNo, callbackToken, idempotencyKey, provider: provider.name,
      qpayInvoiceId: inv.invoiceId, qrText: inv.qrText, qrImage: inv.qrImage, shortUrl: inv.shortUrl, urls: inv.urls ?? [], expiresAt: new Date(Date.now() + INVOICE_TTL_MS),
      logs: [{ at: new Date(), event: 'invoice_created' }],
    });
    return this.shape({ ...doc.toObject(), qrImage: inv.qrImage, qrText: inv.qrText });
  }

  /**
   * Төлбөрийг ЗӨВХӨН провайдерээс сервер талаас асууж баталгаажуулна.
   * Төлөв pending → paid шилжилт atomic тул callback/poll зэрэг ирсэн ч эрх нэг л удаа олгогдоно.
   */
  async verify(paymentId: string, requester?: { id: string; role: string }, manual = false) {
    if (!Types.ObjectId.isValid(paymentId)) throw err(NotFoundException, 'NOT_FOUND', 'Төлбөр олдсонгүй.');
    const p = await this.payments.findById(paymentId).select('+qrImage +qrText');
    if (!p) throw err(NotFoundException, 'NOT_FOUND', 'Төлбөр олдсонгүй.');
    if (requester && String(p.userId) !== requester.id && requester.role === 'user') throw err(ForbiddenException, 'FORBIDDEN', 'Танд энэ төлбөрт хандах эрх байхгүй.');
    return this.shape(await this.reconcile(p, manual ? 'manual' : 'poll'));
  }

  async verifyByToken(token: string) {
    const p = await this.payments.findOne({ callbackToken: token });
    if (!p) return false;
    await this.reconcile(p, 'callback');
    return true;
  }

  /** QPAY_STATUS_CHECK_INTERVAL_S: 0 (анхдагч) = poll QPay-аас асуухгүй; >0 = тэр хугацаанд нэг л удаа (callback ирээгүй үед аюулгүйн тор). */
  private get statusCheckIntervalMs() { const n = Number(this.cfg.get('QPAY_STATUS_CHECK_INTERVAL_S') ?? 0); return Number.isFinite(n) && n > 0 ? n * 1000 : 0; }

  /**
   * QPay нь payment/check-г давтан дуудахыг хориглодог (GoAylal-тай ижил бодлого): QPay-аас асуух нь
   * callback, төлөгчийн гараар «Төлбөр шалгах», хугацаа дуусах үе, эсвэл тохируулсан интервалд л.
   * 3 секундийн poll зөвхөн манай бүртгэлийг уншина. Mock provider (автомат тест) үргэлж асууна.
   */
  private mayAskProvider(p: any, source: string, provider: { name: string }) {
    if (provider.name !== 'qpay' || source !== 'poll' || p.expiresAt < new Date()) return true;
    const every = this.statusCheckIntervalMs;
    return every > 0 && Date.now() - new Date(p.lastCheckedAt ?? p.createdAt ?? 0).getTime() >= every;
  }

  private async reconcile(p: any, source = 'poll') {
    if (p.status !== 'pending') return p;
    const provider = this.providers.get();
    if (this.mayAskProvider(p, source, provider)) {
      try {
        if (provider.name === 'qpay') await this.payments.updateOne({ _id: p._id }, { $set: { lastCheckedAt: new Date() } });
        const r = await provider.check(p.qpayInvoiceId, { mockPaidAmount: p.mockPaidAmount });
        if (r.paid && r.paidAmount >= p.amount) {
          const won = await this.payments.findOneAndUpdate({ _id: p._id, status: 'pending' }, { $set: { status: 'paid', paidAt: new Date(), paidAmount: r.paidAmount, qpayPaymentId: r.paymentId }, $push: { logs: { at: new Date(), event: 'paid', detail: source } } }, { returnDocument: 'after' }).select('+qrImage +qrText');
          await this.ent.grant({ userId: p.userId, productKey: p.productKey, targetId: p.targetId, paymentId: p._id }); // paid болсон бол (өөр процесс нь шилжүүлсэн ч) эрхийг баталгаажуулна
          return won ?? (await this.payments.findById(p._id).select('+qrImage +qrText'));
        }
        if (r.paid) { this.note(p, 'underpaid', `${r.paidAmount}/${p.amount}`); await p.save(); }
      } catch (e: any) {
        this.log.warn(`reconcile ${p._id}: ${e?.message}`);
        this.note(p, 'check_error', String(e?.message ?? e).slice(0, 120)); await p.save().catch(() => undefined);
      }
    }
    if (p.expiresAt < new Date()) {
      const upd = await this.payments.findOneAndUpdate({ _id: p._id, status: 'pending' }, { $set: { status: 'expired' }, $push: { logs: { at: new Date(), event: 'expired' } } }, { returnDocument: 'after' }).select('+qrImage +qrText');
      if (upd) await provider.cancel?.(p.qpayInvoiceId).catch(() => false); // хугацаа дууссан нэхэмжлэхийг QPay дээр хаана
      return upd ?? (await this.payments.findById(p._id).select('+qrImage +qrText'));
    }
    return p;
  }

  async cancel(userId: string, id: string) {
    const r = await this.payments.findOneAndUpdate({ _id: id, userId, status: 'pending' }, { $set: { status: 'cancelled' }, $push: { logs: { at: new Date(), event: 'cancelled' } } }, { returnDocument: 'after' });
    if (!r) throw err(NotFoundException, 'NOT_FOUND', 'Хүлээгдэж буй төлбөр олдсонгүй.');
    if (r.qpayInvoiceId) await this.providers.get().cancel?.(r.qpayInvoiceId).catch(() => false);
    return { ok: true };
  }

  /** ЗӨВХӨН автомат тест (NODE_ENV=test + mock provider). Бүтээгдэхүүний UI-д ашиглагдахгүй. */
  async devConfirm(userId: string, id: string, amount?: number) {
    if (!isTestEnv(this.cfg.get('NODE_ENV')) || this.providers.get().name !== 'mock') throw err(ForbiddenException, 'DISABLED', 'Энэ боломж идэвхгүй байна.');
    const p = await this.payments.findOne({ _id: id, userId });
    if (!p) throw err(NotFoundException, 'NOT_FOUND', 'Төлбөр олдсонгүй.');
    p.mockPaidAmount = amount ?? p.amount;
    await p.save();
    return this.verify(id, { id: userId, role: 'user' });
  }

  async mine(userId: string) {
    const items = await this.payments.find({ userId }).sort({ createdAt: -1 }).limit(50).lean();
    return items.map((p) => ({ id: String(p._id), productKey: p.productKey, targetId: p.targetId ? String(p.targetId) : null, amount: p.amount, currency: p.currency, status: p.status, createdAt: (p as any).createdAt, paidAt: p.paidAt ?? null }));
  }
}

@Global()
@Module({ providers: [EntitlementsService, PaymentsService, ProviderFactory], exports: [EntitlementsService, PaymentsService] })
export class PaymentsCoreModule {}
