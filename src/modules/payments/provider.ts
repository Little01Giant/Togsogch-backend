import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import QRCode from 'qrcode';
import { isTestEnv } from '../../common/security';

export interface InvoiceInput { senderInvoiceNo: string; amount: number; description: string; callbackUrl: string }
export interface InvoiceResult { invoiceId: string; qrText?: string; qrImage?: string; shortUrl?: string; urls?: any[] }
export interface CheckResult { paid: boolean; paidAmount: number; paymentId?: string }

export interface PaymentProvider {
  name: string;
  createInvoice(i: InvoiceInput): Promise<InvoiceResult>;
  /** Сервер талаас провайдерээс төлбөрийн төлвийг асууна — клиент/callback-ийн мэдээлэлд найдахгүй */
  check(invoiceId: string, ctx: { mockPaidAmount?: number }): Promise<CheckResult>;
  /** Хугацаа дууссан/цуцалсан нэхэмжлэхийг провайдер дээр хаана (заавал биш, best-effort) */
  cancel?(invoiceId: string): Promise<boolean>;
}

const unavailable = (m: string) => new ServiceUnavailableException({ code: 'PAYMENT_UNAVAILABLE', message: m });

/** Хөгжүүлэлт/тестийн provider. Production-д ашиглагдахгүй. */
export class MockProvider implements PaymentProvider {
  name = 'mock';
  async createInvoice(i: InvoiceInput): Promise<InvoiceResult> {
    const qrText = `MOCK-QPAY:${i.senderInvoiceNo}:${i.amount}`;
    return { invoiceId: `mock_${i.senderInvoiceNo}`, qrText, qrImage: await QRCode.toDataURL(qrText, { margin: 1, width: 280 }), urls: [] };
  }
  async check(_id: string, ctx: { mockPaidAmount?: number }): Promise<CheckResult> {
    const amt = ctx.mockPaidAmount ?? 0;
    return { paid: amt > 0, paidAmount: amt, paymentId: amt > 0 ? `mockpay_${_id}` : undefined };
  }
}

/**
 * QPay merchant API v2 (GoAylal төслийн ажиллаж буй QPay холболттой ижил хэлбэр).
 * - QPAY_BASE_URL нь `https://merchant.qpay.mn/v2` эсвэл `https://merchant.qpay.mn` (/v2 нь автоматаар нэмэгдэнэ).
 * - Нэвтрэх: QPAY_CLIENT_ID / QPAY_CLIENT_SECRET (хуучин QPAY_USERNAME / QPAY_PASSWORD нэрийг мөн дэмжинэ).
 * - Credentials зөвхөн backend env-д.
 */
export class QpayProvider implements PaymentProvider {
  name = 'qpay';
  private log = new Logger('QPay');
  private token?: { value: string; exp: number };
  constructor(private cfg: ConfigService) {}

  private get base() {
    const b = (this.cfg.get<string>('QPAY_BASE_URL') ?? '').trim().replace(/\/+$/, '');
    return b && !/\/v2$/.test(b) ? `${b}/v2` : b;
  }
  private get clientId() { return this.cfg.get<string>('QPAY_CLIENT_ID') || this.cfg.get<string>('QPAY_USERNAME') || ''; }
  private get clientSecret() { return this.cfg.get<string>('QPAY_CLIENT_SECRET') || this.cfg.get<string>('QPAY_PASSWORD') || ''; }

  private async auth(): Promise<string> {
    if (this.token && this.token.exp > Date.now()) return this.token.value;
    if (!this.base || !this.clientId || !this.clientSecret) throw unavailable('Төлбөрийн үйлчилгээ тохируулагдаагүй байна.');
    let r: Response;
    try {
      r = await fetch(`${this.base}/auth/token`, { method: 'POST', headers: { Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`, 'content-type': 'application/json' } });
    } catch (e: any) { this.log.error(`token network: ${e?.message}`); throw unavailable('Төлбөрийн системтэй холбогдож чадсангүй.'); }
    if (!r.ok) { this.log.error(`token ${r.status}`); throw unavailable('Төлбөрийн системтэй холбогдож чадсангүй.'); }
    const j: any = await r.json();
    if (!j.access_token) throw unavailable('Төлбөрийн системтэй холбогдож чадсангүй.');
    // expires_in нь epoch секунд эсвэл үргэлжлэх хугацаа байж болно; 60 сек урьдчилж шинэчилнэ
    const expMs = j.expires_in > 1e9 ? j.expires_in * 1000 : Date.now() + (j.expires_in ?? 3600) * 1000;
    this.token = { value: j.access_token, exp: expMs - 60_000 };
    return j.access_token;
  }

  private async send(method: string, path: string, body?: any, retry = true): Promise<Response> {
    const t = await this.auth();
    let r: Response;
    try {
      r = await fetch(`${this.base}${path}`, { method, headers: { Authorization: `Bearer ${t}`, 'content-type': 'application/json' }, body: body === undefined ? undefined : JSON.stringify(body) });
    } catch (e: any) { this.log.error(`${path} network: ${e?.message}`); throw unavailable('Төлбөрийн системтэй холбогдож чадсангүй.'); }
    // Cache-д байгаа token хүчингүй болсон байж болно (QPay шинэ token олгоход хуучныг хүчингүй болгох, өөр сервис ижил данс ашиглах, restart-ийн хоорондох зөрүү):
    // 401/403 ирвэл token-ыг хаяж шинийг авч нэг удаа дахин оролдоно. Хүсэлт бүтэлгүйтсэн бол QPay сервер нэхэмжлэх үүсгээгүй тул давхар нэхэмжлэх үүсэхгүй.
    if ((r.status === 401 || r.status === 403) && retry) { this.token = undefined; return this.send(method, path, body, false); }
    return r;
  }

  private async call(path: string, body: any): Promise<any> {
    const r = await this.send('POST', path, body);
    if (!r.ok) { const detail = await r.text().catch(() => ''); this.log.error(`${path} → ${r.status} ${detail.slice(0, 300)}`); throw unavailable('Төлбөрийн системээс алдаа ирлээ. Дахин оролдоно уу.'); }
    return r.json();
  }

  async createInvoice(i: InvoiceInput): Promise<InvoiceResult> {
    const code = this.cfg.get<string>('QPAY_INVOICE_CODE');
    if (!code) throw unavailable('Төлбөрийн үйлчилгээ тохируулагдаагүй байна.');
    const j = await this.call('/invoice', {
      invoice_code: code, sender_invoice_no: i.senderInvoiceNo, invoice_receiver_code: 'terminal', invoice_description: i.description, amount: i.amount, callback_url: i.callbackUrl,
    });
    if (!j.invoice_id) { this.log.error('invoice response: invoice_id байхгүй'); throw unavailable('QPay нэхэмжлэх үүсгэж чадсангүй. Түр хүлээгээд дахин оролдоно уу.'); }
    return { invoiceId: j.invoice_id, qrText: j.qr_text, qrImage: j.qr_image ? `data:image/png;base64,${j.qr_image}` : j.qr_text ? await QRCode.toDataURL(j.qr_text, { margin: 1, width: 280 }) : undefined, shortUrl: j.qPay_shortUrl, urls: Array.isArray(j.urls) ? j.urls : [] };
  }

  async check(invoiceId: string): Promise<CheckResult> {
    const j = await this.call('/payment/check', { object_type: 'INVOICE', object_id: invoiceId, offset: { page_number: 1, page_limit: 100 } });
    if (typeof j.count !== 'number' || j.count <= 0 || !Array.isArray(j.rows)) return { paid: false, paidAmount: 0 };
    const rows: any[] = j.rows.filter((r: any) => r.payment_status === 'PAID');
    const paidAmount = rows.reduce((s, r) => s + Number(r.payment_amount ?? 0), 0);
    return { paid: rows.length > 0, paidAmount, paymentId: rows[0]?.payment_id ? String(rows[0].payment_id) : undefined };
  }

  /** Төлөгдөөгүй нэхэмжлэхийг QPay дээр цуцлана (`DELETE /invoice/{id}`). Best-effort: алдаа гарвал шиддэггүй. */
  async cancel(invoiceId: string): Promise<boolean> {
    try {
      const r = await this.send('DELETE', `/invoice/${encodeURIComponent(invoiceId)}`);
      if (!r.ok) this.log.warn(`invoice cancel ${r.status}`);
      return r.ok;
    } catch (e: any) { this.log.warn(`invoice cancel: ${e?.message}`); return false; }
  }
}

@Injectable()
export class ProviderFactory {
  private instance?: PaymentProvider;
  constructor(private cfg: ConfigService) {}
  get(): PaymentProvider {
    if (this.instance) return this.instance;
    // Mock нь зөвхөн автомат тестийн (NODE_ENV=test) тестийн давхар обьект. Бусад бүх орчинд бодит QPay.
    const test = isTestEnv(this.cfg.get('NODE_ENV'));
    const want = this.cfg.get<string>('PAYMENT_PROVIDER') ?? (test ? 'mock' : 'qpay');
    if (want === 'mock' && !test) throw unavailable('Mock төлбөр зөвхөн автомат тестэд ашиглагдана.');
    return (this.instance = want === 'qpay' ? new QpayProvider(this.cfg) : new MockProvider());
  }
}
