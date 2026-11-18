import { findUnsafeUrls, isDevEnv, productionConfigProblems, str } from './security';

describe('isDevEnv', () => {
  it('NODE_ENV тохируулаагүй/production үед хаалттай', () => {
    expect(isDevEnv(undefined)).toBe(false);
    expect(isDevEnv('production')).toBe(false);
    expect(isDevEnv('staging')).toBe(false);
    expect(isDevEnv('development')).toBe(true);
    expect(isDevEnv('test')).toBe(true);
  });
});

describe('productionConfigProblems', () => {
  const good = { JWT_ACCESS_SECRET: 'q8Zr1vXk0Lm9Tn4Bw7Yc3Hd6Fa2Jp5Gs8Uo1Ie4', JWT_REFRESH_SECRET: 'Rt5Ky2Nb8Vc1Xz4Mq7Lw0Hp3Gd6Fs9Ja2Uo5Ei8', MONGODB_URI: 'mongodb+srv://x', FRONTEND_URL: 'https://app.example.mn', DEV_LOGIN_ENABLED: 'false', PAYMENT_PROVIDER: 'qpay', QPAY_BASE_URL: 'https://q', QPAY_CLIENT_ID: 'u', QPAY_CLIENT_SECRET: 'p', QPAY_INVOICE_CODE: 'c', PUBLIC_API_URL: 'https://api.example.mn' };
  it('зөв тохиргоонд алдаа байхгүй', () => { expect(productionConfigProblems(good)).toEqual([]); });
  it('сул/анхдагч JWT secret-ийг няцаана', () => {
    expect(productionConfigProblems({ ...good, JWT_ACCESS_SECRET: 'change-me-access' }).length).toBeGreaterThan(0);
    expect(productionConfigProblems({ ...good, JWT_REFRESH_SECRET: 'short' }).length).toBeGreaterThan(0);
    expect(productionConfigProblems({ ...good, JWT_REFRESH_SECRET: good.JWT_ACCESS_SECRET }).length).toBeGreaterThan(0);
  });
  it('dev-login, mock төлбөр, http frontend, QPay дутуу тохиргоог няцаана', () => {
    expect(productionConfigProblems({ ...good, DEV_LOGIN_ENABLED: 'true' })).toHaveLength(1);
    expect(productionConfigProblems({ ...good, PAYMENT_PROVIDER: 'mock' })).toHaveLength(1);
    expect(productionConfigProblems({ ...good, FRONTEND_URL: 'http://x' })).toHaveLength(1);
    expect(productionConfigProblems({ ...good, QPAY_CLIENT_SECRET: undefined })).toHaveLength(1);
    expect(productionConfigProblems({ ...good, PUBLIC_API_URL: 'http://api.example.mn' })).toHaveLength(1);
    expect(productionConfigProblems({ ...good, QPAY_STATUS_CHECK_INTERVAL_S: 'abc' })).toHaveLength(1);
    // хуучин нэршил (USERNAME/PASSWORD) мөн хүчинтэй
    expect(productionConfigProblems({ ...good, QPAY_CLIENT_ID: undefined, QPAY_CLIENT_SECRET: undefined, QPAY_USERNAME: 'u', QPAY_PASSWORD: 'p' })).toEqual([]);
  });
});

describe('findUnsafeUrls', () => {
  it('javascript:/data: URL-ийг олно, http(s) болон хоосныг зөвшөөрнө', () => {
    expect(findUnsafeUrls({ website: 'javascript:alert(1)', logoUrl: 'https://a/b.png', mapUrl: '' })).toEqual(['website']);
    expect(findUnsafeUrls({ visaLinks: [{ title: 'x', url: 'data:text/html,hi' }, { title: 'y', url: 'https://ok' }] })).toEqual(['visaLinks[0].url']);
    expect(findUnsafeUrls({ source: { sourceUrl: 'ftp://x' }, other: { mapUrl: 'JAVASCRIPT:1' } })).toEqual(['source.sourceUrl', 'other.mapUrl']);
  });
  it('зургийн жагсаалт', () => { expect(findUnsafeUrls({ images: ['https://a', 'javascript:x'] })).toEqual(['images[1]']); });
  it('URL биш талбарыг үл хөндөнө', () => { expect(findUnsafeUrls({ description: 'javascript:foo', name: 'x' })).toEqual([]); });
});

describe('str', () => {
  it('объект/массивыг undefined болгоно', () => {
    expect(str('a')).toBe('a');
    expect(str({ $ne: 'x' })).toBeUndefined();
    expect(str(['a'])).toBeUndefined();
  });
});
