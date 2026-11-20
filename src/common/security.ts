/** Аюулгүй байдлын цэвэр туслахууд (unit test-тэй). */

/** Хөгжүүлэлтийн шинжтэй боломжууд (dev-login, mock төлбөр) зөвхөн NODE_ENV нь ТОДОРХОЙ development/test үед. NODE_ENV тохируулаагүй бол хаалттай. */
export const isDevEnv = (nodeEnv?: string) => nodeEnv === 'development' || nodeEnv === 'test';

/** Автомат тестийн орчин л (NODE_ENV=test). Mock төлбөрийн провайдер зөвхөн энд зөвшөөрөгдөнө. */
export const isTestEnv = (nodeEnv?: string) => nodeEnv === 'test';

const WEAK = /change-?me|secret|password|example|test/i;

/**
 * GoAylal төслийн орчны хувьсагчийн нэрийг дэмжинэ (нэг тохиргоог хоёр төсөлд хуулахад амар):
 * `CORS_ORIGIN` → `FRONTEND_URL` (манай нэр заасан бол тэр давуу). `QPAY_CALLBACK_URL` нь payments.service-д шууд уншигдана.
 */
export function applyEnvAliases(env: Record<string, string | undefined>) {
  if (!env.FRONTEND_URL && env.CORS_ORIGIN) env.FRONTEND_URL = env.CORS_ORIGIN;
  return env;
}

/** QPay-д өгөх callback-ийн суурь хаяг (токен/нэхэмжлэхийн дугаар хойноос нь нэмэгдэнэ). `QPAY_CALLBACK_URL` (GoAylal-тай ижил, замтай нь) давуу; үгүй бол `PUBLIC_API_URL` + стандарт зам. */
export function qpayCallbackBase(env: Record<string, string | undefined>, port: string | number = 4100): string {
  const full = env.QPAY_CALLBACK_URL?.trim();
  if (full) return full.replace(/\/+$/, '');
  return `${(env.PUBLIC_API_URL ?? `http://localhost:${port}`).replace(/\/+$/, '')}/api/v1/payments/qpay/callback`;
}

/** Production-д эхлэхээс өмнө тохиргооны шаардлага шалгана; зөрчилтэй бол жагсаалт буцаана. */
export function productionConfigProblems(env: Record<string, string | undefined>): string[] {
  const p: string[] = [];
  for (const k of ['JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET']) {
    const v = env[k];
    if (!v || v.length < 32 || WEAK.test(v)) p.push(`${k}: дор хаяж 32 тэмдэгт, санамсаргүй утга байх ёстой`);
  }
  if (env.JWT_ACCESS_SECRET && env.JWT_ACCESS_SECRET === env.JWT_REFRESH_SECRET) p.push('JWT_ACCESS_SECRET ба JWT_REFRESH_SECRET өөр байх ёстой');
  if (!env.MONGODB_URI) p.push('MONGODB_URI шаардлагатай');
  if (!env.FRONTEND_URL || !/^https:\/\//.test(env.FRONTEND_URL.split(',')[0])) p.push('FRONTEND_URL нь https:// байх ёстой (CORS, cookie)');
  if (env.DEV_LOGIN_ENABLED === 'true') p.push('DEV_LOGIN_ENABLED production-д false байх ёстой');
  if (env.PAYMENT_PROVIDER === 'mock') p.push('PAYMENT_PROVIDER=mock production-д хориотой');
  if ((env.PAYMENT_PROVIDER ?? 'qpay') === 'qpay') {
    const id = env.QPAY_CLIENT_ID || env.QPAY_USERNAME, secret = env.QPAY_CLIENT_SECRET || env.QPAY_PASSWORD;
    if (!(env.QPAY_BASE_URL && id && secret && env.QPAY_INVOICE_CODE)) p.push('QPAY_* тохиргоо дутуу (QPAY_BASE_URL, QPAY_CLIENT_ID, QPAY_CLIENT_SECRET, QPAY_INVOICE_CODE)');
    const cb = env.QPAY_CALLBACK_URL || env.PUBLIC_API_URL;
    if (!cb || !/^https:\/\//.test(cb)) p.push('QPAY_CALLBACK_URL (эсвэл PUBLIC_API_URL) нь https:// байх ёстой (QPay callback)');
    const every = env.QPAY_STATUS_CHECK_INTERVAL_S;
    if (every !== undefined && every !== '' && !/^\d+$/.test(every)) p.push('QPAY_STATUS_CHECK_INTERVAL_S нь бүхэл тоо (секунд) байх ёстой');
  }
  return p;
}

const URL_KEY = /(^|[a-z])(url|link|website)$/i;
const SAFE = /^https?:\/\//i;

/** Бичлэгийн URL шинжтэй талбарт `javascript:` зэрэг аюултай схем орохоос сэргийлнэ. Буруу замуудыг буцаана. */
export function findUnsafeUrls(v: any, path = ''): string[] {
  const bad: string[] = [];
  if (Array.isArray(v)) {
    v.forEach((x, i) => bad.push(...findUnsafeUrls(x, `${path}[${i}]`)));
    if (/images$/i.test(path)) v.forEach((x, i) => { if (typeof x === 'string' && x && !SAFE.test(x)) bad.push(`${path}[${i}]`); });
  } else if (v && typeof v === 'object') {
    for (const [k, x] of Object.entries(v)) {
      const p = path ? `${path}.${k}` : k;
      if (typeof x === 'string' && URL_KEY.test(k) && x.trim() !== '' && !SAFE.test(x.trim())) bad.push(p);
      else if (x && typeof x === 'object') bad.push(...findUnsafeUrls(x, p));
    }
  }
  return bad;
}

/** Query-ийн утгыг зөвхөн string болгоно (NoSQL оператор `a[$ne]=x`-ээс хамгаална). */
export const str = (v: any): string | undefined => (typeof v === 'string' ? v : undefined);
