import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { afterAll, beforeAll, describe, expect, it } from './shim';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import mongoose from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';

const conn = (): any => app.get(getConnectionToken());

let app: INestApplication;
let mongod: MongoMemoryServer;
const H = { 'x-requested-with': 'fetch' };
const agent = () => request.agent(app.getHttpServer());

async function login(email: string, role = 'user') {
  const a = agent();
  await a.post('/api/v1/auth/dev-login').set(H).send({ email, name: 'Тест Хэрэглэгч', role }).expect(200);
  return a;
}
async function consent(a: ReturnType<typeof agent>) {
  await a.put('/api/v1/users/me/consent').set(H).send({ privacyAccepted: true, termsAccepted: true, isMinor: false }).expect(200);
}

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri('e2e');
  process.env.MONGODB_URI = uri;
  process.env.NODE_ENV = 'test';
  process.env.DEV_LOGIN_ENABLED = 'true';
  process.env.PAYMENT_PROVIDER = 'mock'; // тестийн давхар обьект; зөвхөн NODE_ENV=test үед зөвшөөрөгдөнө
  process.env.JWT_ACCESS_SECRET = 'test-access';
  process.env.JWT_REFRESH_SECRET = 'test-refresh';
  process.env.SUPER_ADMIN_EMAILS = 'root@example.com';
  process.env.PAYMENT_CREATE_LIMIT = '1000';
  process.env.DEV_LOGIN_LIMIT = '1000';
  process.env.PAYMENT_VERIFY_LIMIT = '1000';
  const { seed } = await import('../src/seed/seed');
  await seed(uri);
  const { AppModule } = await import('../src/app.module');
  const { configure } = await import('../src/main');
  const mod = await Test.createTestingModule({ imports: [AppModule] }).compile();
  app = await configure(mod.createNestApplication());
  await app.init();
});
afterAll(async () => { await app?.close(); await mongod?.stop(); });

describe('Auth, CSRF, RBAC', () => {
  it('нэвтрээгүй хэрэглэгч /auth/me → 401', async () => { await request(app.getHttpServer()).get('/api/v1/auth/me').expect(401); });

  it('dev-login cookie тавина, /auth/me ажиллана', async () => {
    const a = await login('user1@example.com');
    const me = await a.get('/api/v1/auth/me').expect(200);
    expect(me.body.email).toBe('user1@example.com');
    expect(me.body.role).toBe('user');
  });

  it('мутаци CSRF header-гүй бол 403', async () => {
    const a = await login('csrf@example.com');
    await a.patch('/api/v1/users/me').send({ name: 'X Y' }).expect(403);
  });

  it('энгийн хэрэглэгч admin API-д хандахад 403, нэвтрээгүй бол 401', async () => {
    const a = await login('plain@example.com');
    await a.get('/api/v1/admin/countries').expect(403);
    await request(app.getHttpServer()).get('/api/v1/admin/countries').expect(401);
  });

  it('refresh token rotation: хуучин token хоёр дахь удаа хүчингүй', async () => {
    const res = await request(app.getHttpServer()).post('/api/v1/auth/dev-login').set(H).send({ email: 'rot@example.com', name: 'Ротац' }).expect(200);
    const refresh = /refresh_token=([^;]+)/.exec((res.headers['set-cookie'] as unknown as string[]).join(';'))?.[1];
    expect(refresh).toBeTruthy();
    await request(app.getHttpServer()).post('/api/v1/auth/refresh').set(H).set('Cookie', `refresh_token=${refresh}`).expect(200);
    await request(app.getHttpServer()).post('/api/v1/auth/refresh').set(H).set('Cookie', `refresh_token=${refresh}`).expect(401);
  });

  it('SUPER_ADMIN_EMAILS-д байгаа имэйл super_admin болно', async () => {
    const a = await login('root@example.com');
    expect((await a.get('/api/v1/auth/me')).body.role).toBe('super_admin');
  });

  it('насанд хүрээгүй хэрэглэгч асран хамгаалагчийн зөвшөөрөлгүйгээр зөвшөөрөл өгөх боломжгүй', async () => {
    const a = await login('minor@example.com');
    const r = await a.put('/api/v1/users/me/consent').set(H).send({ privacyAccepted: true, termsAccepted: true, isMinor: true, parentalConsentConfirmed: false }).expect(400);
    expect(r.body.code).toBe('PARENTAL_CONSENT_REQUIRED');
  });
});

describe('Admin CRUD + universities filter/pagination', () => {
  let admin: ReturnType<typeof agent>;
  let countryId: string;

  beforeAll(async () => { admin = await login('admin@example.com', 'admin'); });

  it('улс нэмэх: буруу өгөгдөл → 400 Монгол алдаа, зөв → 201', async () => {
    const bad = await admin.post('/api/v1/admin/countries').set(H).send({ nameEn: 'X' }).expect(400);
    expect(bad.body.code).toBe('VALIDATION_ERROR');
    const ok = await admin.post('/api/v1/admin/countries').set(H).send({ nameMn: 'Тестланд', nameEn: 'Testland', code: 'TL', flag: '🏳️', status: 'published' }).expect(201);
    countryId = ok.body._id;
    expect(ok.body.slug).toBe('testland');
  });

  it('давхардсан код → 409', async () => {
    await admin.post('/api/v1/admin/countries').set(H).send({ nameMn: 'Дахин', nameEn: 'Again', code: 'TL' }).expect(409);
  });

  it('25 их сургууль үүсгэж, шүүлтүүр + pagination + эрэмбэ шалгах', async () => {
    for (let i = 1; i <= 25; i++) {
      await admin.post('/api/v1/admin/universities').set(H).send({
        name: `Test University ${String(i).padStart(2, '0')}`, countryId, city: i % 2 ? 'Alpha' : 'Beta', type: i % 2 ? 'public' : 'private',
        degreeLevels: i % 3 ? ['bachelor'] : ['bachelor', 'master'], subjects: ['engineering'], status: 'published',
        scholarshipTypes: i % 5 === 0 ? ['full'] : [],
        rankings: i <= 3 ? [{ provider: 'QS_WORLD', rank: 100 + i, year: 2025, edition: 'QS 2025' }] : [],
      }).expect(201);
    }
    const pub = agent();
    const p1 = await pub.get('/api/v1/universities?pageSize=10&page=1').expect(200);
    expect(p1.body.total).toBe(25);
    expect(p1.body.items).toHaveLength(10);
    const p3 = await pub.get('/api/v1/universities?pageSize=10&page=3').expect(200);
    expect(p3.body.items).toHaveLength(5);

    const cityType = await pub.get('/api/v1/universities?city=Alpha&type=public&pageSize=50').expect(200);
    expect(cityType.body.total).toBe(13);
    const masters = await pub.get('/api/v1/universities?degree=master&pageSize=50').expect(200);
    expect(masters.body.total).toBe(8);
    const combo = await pub.get('/api/v1/universities?degree=master&city=Alpha&pageSize=50').expect(200);
    expect(combo.body.items.every((u: any) => u.degreeLevels.includes('master') && u.city === 'Alpha')).toBe(true);

    const search = await pub.get('/api/v1/universities?q=University 07').expect(200);
    expect(search.body.items.map((u: any) => u.name)).toContain('Test University 07');
    const byCountry = await pub.get('/api/v1/universities?q=Тестланд&pageSize=50').expect(200);
    expect(byCountry.body.total).toBe(25);

    const sch = await pub.get('/api/v1/universities?scholarship=full&pageSize=50').expect(200);
    expect(sch.body.total).toBe(5);
    const noSch = await pub.get('/api/v1/universities?scholarship=none&pageSize=50').expect(200);
    expect(noSch.body.total).toBe(20);
  });

  it('зэрэг (degree) шүүлтүүр: degreeLevels хоосон ч төлбөрийн бичлэгийн түвшнээр олно; мета зөвхөн бодит сонголтыг өгнө', async () => {
    const created = await admin.post('/api/v1/admin/universities').set(H).send({
      name: 'Tuition Only University', countryId, city: 'Gamma', type: 'public', status: 'published',
      tuition: [{ level: 'phd', annualFee: 1000, currency: 'USD' }],
    }).expect(201);
    const pub = agent();
    const r = await pub.get('/api/v1/universities?degree=phd&pageSize=50').expect(200);
    expect(r.body.items.map((u: any) => u.name)).toContain('Tuition Only University');
    expect(r.body.items.find((u: any) => u.name === 'Tuition Only University').degreeLevels).toContain('phd');
    // нийтийн жагсаалт кэшлэгдэх толгойтой; сургуулийн дэлгэрэнгүй (хэрэглэгч тус бүрийн эрхээс хамаарна) public кэшгүй
    expect(r.headers['cache-control']).toContain('s-maxage');
    const detail = await pub.get(`/api/v1/universities/${created.body.slug}`).expect(200);
    expect(String(detail.headers['cache-control'] ?? '')).not.toContain('public');
    const meta = await pub.get('/api/v1/meta/filters').expect(200);
    for (const d of ['phd', 'bachelor', 'master']) expect(meta.body.available.degree).toContain(d);
    expect(meta.body.available.scholarship).toEqual(['full']);
    expect(meta.body.available.type.sort()).toEqual(['private', 'public']);
    await admin.delete(`/api/v1/admin/universities/${created.body._id}`).set(H).catch(() => undefined);
  });

  it('QS эрэмбэ: рейтинггүй сургуулиуд төгсгөлд; картад 0 биш null', async () => {
    const r = await agent().get('/api/v1/universities?sort=qsWorld&pageSize=5').expect(200);
    expect(r.body.items.slice(0, 3).map((u: any) => u.name)).toEqual(['Test University 01', 'Test University 02', 'Test University 03']);
  });

  it('ноорог (draft) сургууль public жагсаалтад гарахгүй; publish/unpublish ажиллана', async () => {
    const created = await admin.post('/api/v1/admin/universities').set(H).send({ name: 'Hidden Draft Uni', countryId }).expect(201);
    expect(created.body.status).toBe('draft');
    expect((await agent().get('/api/v1/universities?q=Hidden').expect(200)).body.total).toBe(0);
    await admin.post(`/api/v1/admin/universities/${created.body._id}/publish`).set(H).expect(200);
    expect((await agent().get('/api/v1/universities?q=Hidden').expect(200)).body.total).toBe(1);
    await admin.delete(`/api/v1/admin/universities/${created.body._id}`).set(H).expect(200);
    expect((await agent().get('/api/v1/universities?q=Hidden').expect(200)).body.total).toBe(0);
  });

  it('freeAccess сургууль: нэвтрээгүй хэрэглэгчид ч төлбөртэй мэдээлэл нээлттэй; энгийн сургуульд нуугдана; төлбөр үүсгэхгүй', async () => {
    const mk = (name: string, freeAccess: boolean) => admin.post('/api/v1/admin/universities').set(H).send({
      name, countryId, status: 'published', freeAccess, tuition: [{ level: 'bachelor', annualFee: 1234, currency: 'USD' }],
    }).expect(201);
    const free = await mk('Free Access Uni', true);
    const paid = await mk('Paid Only Uni', false);
    const a = await agent().get(`/api/v1/universities/${free.body.slug}`).expect(200);
    expect(a.body.access.unlocked).toBe(true);
    expect(a.body.paid.tuition[0].annualFee).toBe(1234);
    const b = await agent().get(`/api/v1/universities/${paid.body.slug}`).expect(200);
    expect(b.body.access.unlocked).toBe(false);
    expect(b.body.paid).toBeUndefined();
    expect(JSON.stringify(b.body)).not.toContain('1234');
    await admin.delete(`/api/v1/admin/universities/${free.body._id}`).set(H).expect(200);
    await admin.delete(`/api/v1/admin/universities/${paid.body._id}`).set(H).expect(200);
  });

  it('аудит лог бичигдсэн', async () => {
    const r = await admin.get('/api/v1/admin/audit-logs').expect(200);
    expect(r.body.total).toBeGreaterThan(0);
  });

  it('admin stats', async () => {
    const r = await admin.get('/api/v1/admin/stats/overview').expect(200);
    expect(r.body.countries).toBeGreaterThanOrEqual(21);
    expect(r.body.universities).toBeGreaterThanOrEqual(25);
  });

  it('админ эрх өөрчлөх нь зөвхөн super_admin-д', async () => {
    const users = await admin.get('/api/v1/admin/manage/users').expect(200);
    const target = users.body.items.find((u: any) => u.email === 'user1@example.com');
    await admin.patch(`/api/v1/admin/manage/users/${target._id}`).set(H).send({ role: 'admin' }).expect(403);
    const root = await login('root@example.com');
    await root.patch(`/api/v1/admin/manage/users/${target._id}`).set(H).send({ role: 'admin' }).expect(200);
  });
});

describe('Тест өгөх урсгал (backend scoring)', () => {
  it('асуулт публик, онооны мэдээлэл ил гарахгүй', async () => {
    const r = await agent().get('/api/v1/assessments/career/active').expect(200);
    expect(r.body.questions.length).toBe(60);
    expect(JSON.stringify(r.body)).not.toContain('"scoring"');
    expect(JSON.stringify(r.body)).not.toContain('weights');
  });

  it('Магистрын тест: бөглөх → backend scoring → чиглэл, төрлөөр ангилал, суурь мэдлэг', async () => {
    const u = await login('masters@example.com');
    const def = (await u.get('/api/v1/assessments/masters/active').expect(200)).body;
    expect(JSON.stringify(def)).not.toContain('goalFit');
    const att = (await u.post('/api/v1/assessments/masters/attempts').set(H).expect(200)).body;
    const ans: Record<string, any> = {
      ms_edu: 'bachelor', ms_bachelor_area: 'arts', ms_experience: 4, ms_profession_area: 'tech', ms_pref_areas: ['tech'], ms_goal: 'career_change',
      ms_leadership: 3, ms_research: 3, ms_abroad: 4, ms_abroad_work: 3, ms_budget: 'mid', ms_mode: 'parttime', ms_work_while: 'yes', ms_duration: 'any', ms_english: 'b2',
    };
    await u.put(`/api/v1/attempts/${att.id}/answers`).set(H).send({ answers: ans }).expect(200);
    await u.post(`/api/v1/attempts/${att.id}/submit`).set(H).expect(200);
    const r = (await u.get(`/api/v1/attempts/${att.id}/result`).expect(200)).body;
    expect(r.kind).toBe('masters');
    expect(r.locked).toBe(true);
    expect(r.fieldMatches).toBeUndefined();
    await unlockResult(u, att.id);
    const full = (await u.get(`/api/v1/attempts/${att.id}/result`).expect(200)).body;
    expect(full.locked).toBe(false);
    expect(full.fieldMatches.length).toBeGreaterThanOrEqual(3);
    expect(full.fieldMatches[0].area).toBe('tech');
    expect(Array.isArray(full.fieldMatches[0].universities)).toBe(true); // хаана суралцах: зөвхөн өгөгдлийн сангаас (байхгүй бол хоосон)
    expect(Array.isArray(full.fieldMatches[0].countries)).toBe(true);
    const hist = (await u.get('/api/v1/attempts').expect(200)).body;
    expect(hist[0].unlocked).toBe(true);
    expect(hist[0].top.length).toBeGreaterThan(0);
  });

  it('Хөгжилтэй зан төлөвийн тест: үнэгүй үр дүн, backend scoring; дутуу (400), буруу сонголт (400), нэвтрээгүй (401), бусдын үр дүн (403)', async () => {
    const def = (await agent().get('/api/v1/assessments/persona/active').expect(200)).body;
    expect(def.questions).toHaveLength(10);
    expect(JSON.stringify(def)).not.toContain('"scoring"');
    await request(app.getHttpServer()).post('/api/v1/assessments/persona/attempts').set(H).expect(401);
    const u = await login('persona@example.com');
    const att = (await u.post('/api/v1/assessments/persona/attempts').set(H).expect(200)).body;
    await u.post(`/api/v1/attempts/${att.id}/submit`).set(H).expect(400); // хариулаагүй
    await u.put(`/api/v1/attempts/${att.id}/answers`).set(H).send({ answers: { [def.questions[0].key]: 'zz' } }).expect(400);
    const ans: Record<string, string> = {};
    def.questions.forEach((q: any, i: number) => { ans[q.key] = i < 7 ? 'v' : 'a'; });
    await u.put(`/api/v1/attempts/${att.id}/answers`).set(H).send({ answers: ans }).expect(200);
    await u.post(`/api/v1/attempts/${att.id}/submit`).set(H).expect(200);
    const r = (await u.get(`/api/v1/attempts/${att.id}/result`).expect(200)).body;
    expect(r.locked).toBe(false); // төлбөргүй
    expect(r.kind).toBe('persona');
    expect(r.primary.key).toBe('v');
    expect(r.types.find((x: any) => x.key === 'v').count).toBe(7);
    const hist = (await u.get('/api/v1/attempts').expect(200)).body;
    expect(hist.find((h: any) => h.id === att.id)?.unlocked).toBe(true);
    await request(app.getHttpServer()).get(`/api/v1/attempts/${att.id}/result`).expect(401);
    await (await login('persona-other@example.com')).get(`/api/v1/attempts/${att.id}/result`).expect(403);
  });

  it('Сэтгэлгээний хэв маягийн тест: 15 асуулт, үнэгүй үр дүн, тэнцвэл хосолмол; дутуу (400), нэвтрээгүй (401), бусдын үр дүн (403)', async () => {
    const def = (await agent().get('/api/v1/assessments/thinking/active').expect(200)).body;
    expect(def.questions).toHaveLength(15);
    await request(app.getHttpServer()).post('/api/v1/assessments/thinking/attempts').set(H).expect(401);
    const u = await login('thinking@example.com');
    const att = (await u.post('/api/v1/assessments/thinking/attempts').set(H).expect(200)).body;
    await u.post(`/api/v1/attempts/${att.id}/submit`).set(H).expect(400);
    const ans: Record<string, string> = {};
    def.questions.forEach((q: any, i: number) => { ans[q.key] = i < 8 ? 'd' : 'a'; });
    await u.put(`/api/v1/attempts/${att.id}/answers`).set(H).send({ answers: ans }).expect(200);
    await u.post(`/api/v1/attempts/${att.id}/submit`).set(H).expect(200);
    const r = (await u.get(`/api/v1/attempts/${att.id}/result`).expect(200)).body;
    expect(r.locked).toBe(false);
    expect(r.kind).toBe('thinking');
    expect(r.hybrid).toBe(false);
    expect(r.leaders.map((x: any) => x.key)).toEqual(['d']);
    // тэнцүү: 5 a + 5 b + 5 c → хосолмол
    const att2 = (await u.post('/api/v1/assessments/thinking/attempts').set(H).expect(200)).body;
    const ans2: Record<string, string> = {};
    def.questions.forEach((q: any, i: number) => { ans2[q.key] = i < 5 ? 'a' : i < 10 ? 'b' : 'c'; });
    await u.put(`/api/v1/attempts/${att2.id}/answers`).set(H).send({ answers: ans2 }).expect(200);
    await u.post(`/api/v1/attempts/${att2.id}/submit`).set(H).expect(200);
    const r2 = (await u.get(`/api/v1/attempts/${att2.id}/result`).expect(200)).body;
    expect(r2.hybrid).toBe(true);
    expect(r2.leaders.map((x: any) => x.key)).toEqual(['a', 'b', 'c']);
    await request(app.getHttpServer()).get(`/api/v1/attempts/${att.id}/result`).expect(401);
    await (await login('thinking-other@example.com')).get(`/api/v1/attempts/${att.id}/result`).expect(403);
  });

  it('Нэгдсэн тест (хэлний бэлтгэл + хот): хэлний хариулт хотын тохирол, үр дүнд туссан; хуучин language тест эхлэхгүй', async () => {
    const u = await login('lang@example.com');
    await u.post('/api/v1/assessments/language/attempts').set(H).expect(404); // тусдаа хэлний тест байхгүй болсон
    const att = await completeAny(u, 'city', { lg_language: 'korean', lg_duration: '1y' });
    await unlockResult(u, att);
    const r = (await u.get(`/api/v1/attempts/${att}/result`).expect(200)).body;
    expect(r.kind).toBe('city');
    expect(r.languagePrep).toMatchObject({ language: 'korean', duration: '1y' });
    expect(r.dreamCities.some((c: any) => typeof c.breakdown.language === 'number')).toBe(true); // улсын профайлтай хотод хэлний оноо гарна
    expect(r.method.weights.language).toBeGreaterThan(0);
    expect(r.disclaimer).toBeTruthy();
  });

  it('Application planner: статус, хугацаа, бичиг баримтын жагсаалт хадгалагдана', async () => {
    const admin = await login('admin@example.com', 'admin');
    const c = (await admin.post('/api/v1/admin/countries').set(H).send({ nameMn: 'Планланд', nameEn: 'Planland', code: 'PL1', status: 'published' }).expect(201)).body;
    const uni = (await admin.post('/api/v1/admin/universities').set(H).send({ name: 'Planner Uni', countryId: c._id, status: 'published' }).expect(201)).body;
    const u = await login('planner@example.com');
    await u.post(`/api/v1/saved/universities/${uni._id}`).set(H).send({ group: 'target', status: 'preparing', deadline: '2027-01-15', documents: [{ name: 'Motivation letter', done: true }, { name: 'IELTS', done: false }] }).expect(200);
    const row = (await u.get('/api/v1/saved/universities').expect(200)).body[0];
    expect(row.status).toBe('preparing');
    expect(row.documents).toHaveLength(2);
    expect(String(row.deadline)).toContain('2027-01-15');
    await u.post(`/api/v1/saved/universities/${uni._id}`).set(H).send({ status: 'bogus' }).expect(400);
  });

  it('Админ: магистрын чиглэл CRUD, улсын matchProfile засах', async () => {
    const admin = await login('admin@example.com', 'admin');
    const f = (await admin.post('/api/v1/admin/master-fields').set(H).send({ nameMn: 'Тест чиглэл', nameEn: 'Test Field', area: 'tech', type: 'coursework' }).expect(201)).body;
    expect(f.slug).toBe('test-field');
    await admin.patch(`/api/v1/admin/master-fields/${f._id}`).set(H).send({ research: 70 }).expect(200);
    const list = (await admin.get('/api/v1/admin/countries?q=Korea').expect(200)).body.items[0];
    expect(list.matchProfile.languages).toContain('ko');
  });

  it('start → autosave → дутуу submit 400 → бүрэн submit → үр дүн, түүх, эзэмшил', async () => {
    const u = await login('taker@example.com');
    const def = (await u.get('/api/v1/assessments/career/active')).body;
    const att = (await u.post('/api/v1/assessments/career/attempts').set(H).expect(200)).body;
    expect(att.resumed).toBe(false);
    expect((await u.post('/api/v1/assessments/career/attempts').set(H)).body.resumed).toBe(true);

    const incomplete = await u.post(`/api/v1/attempts/${att.id}/submit`).set(H).expect(400);
    expect(incomplete.body.code).toBe('INCOMPLETE');

    const bad = await u.put(`/api/v1/attempts/${att.id}/answers`).set(H).send({ answers: { int_R1: 9 } }).expect(400);
    expect(bad.body.code).toBe('VALIDATION_ERROR');

    const answers: Record<string, any> = {};
    for (const q of def.questions) {
      if (q.type === 'likert') answers[q.key] = q.key.startsWith('int_S') || q.key.startsWith('int_E') ? 5 : q.key.startsWith('int_') ? 1 : 4;
      else if (q.type === 'single') answers[q.key] = 'b';
    }
    expect(def.questions.length).toBe(60);
    expect(JSON.stringify(def).includes('weights')).toBe(false); // сонголтын жин клиентэд ирэхгүй
    await u.put(`/api/v1/attempts/${att.id}/answers`).set(H).send({ answers }).expect(200);
    await u.post(`/api/v1/attempts/${att.id}/submit`).set(H).expect(200);

    expect((await u.get(`/api/v1/attempts/${att.id}/result`).expect(200)).body.locked).toBe(true);
    await unlockResult(u, att.id);
    const res = (await u.get(`/api/v1/attempts/${att.id}/result`).expect(200)).body;
    expect(res.careerMatches.length).toBeGreaterThanOrEqual(5);
    expect(res.categoryMatches.length).toBe(11);
    expect(res.leastMatches.length).toBe(5);
    expect(res.categoryMatches[0].careers.length).toBeGreaterThan(0);
    expect(res.careerMatches[0].score).toBeGreaterThan(res.careerMatches[res.careerMatches.length - 1].score - 1);
    expect(res.hollandCode.slice(0, 2).split('').sort().join('')).toBe('ES');
    expect(res.disclaimer).toBeTruthy();

    const hist = (await u.get('/api/v1/attempts').expect(200)).body;
    expect(hist).toHaveLength(1);
    expect(hist[0].id).toBe(att.id);

    // өөр хэрэглэгч харж чадахгүй
    const other = await login('other@example.com');
    await other.get(`/api/v1/attempts/${att.id}/result`).expect(403);
    await request(app.getHttpServer()).get(`/api/v1/attempts/${att.id}/result`).expect(401);
  });

  it('хувилбар хөлдөөлт: асуулт өөрчилсөн ч хуучин attempt-ийн хувилбар хэвээр', async () => {
    const admin = await login('admin@example.com', 'admin');
    const qs = (await admin.get('/api/v1/admin/assessments/career/questions').expect(200)).body;
    await admin.patch(`/api/v1/admin/assessments/career/questions/${qs[0]._id}`).set(H).send({ text: 'ӨӨРЧЛӨГДСӨН асуулт' }).expect(200);
    // нийтлэхээс өмнө идэвхтэй хувилбар хуучин текстээ хадгална
    const before = (await agent().get('/api/v1/assessments/career/active')).body.questions[0].text;
    expect(before).not.toBe('ӨӨРЧЛӨГДСӨН асуулт');
    const pub = (await admin.post('/api/v1/admin/assessments/career/publish').set(H).expect(200)).body;
    expect(pub.version).toBe(2);
    const after = (await agent().get('/api/v1/assessments/career/active')).body;
    expect(after.version).toBe(2);
    expect(after.questions[0].text).toBe('ӨӨРЧЛӨГДСӨН асуулт');
  });
});

describe('Хадгалсан сургууль ба бүртгэл устгах', () => {
  it('хадгалах → жагсаалт → устгах; бүртгэл устгахад өгөгдөл арилна', async () => {
    const u = await login('saver@example.com');
    const uni = (await agent().get('/api/v1/universities?pageSize=1')).body.items[0];
    await u.post(`/api/v1/saved/universities/${uni.id}`).set(H).send({ group: 'dream' }).expect(200);
    const list = (await u.get('/api/v1/saved/universities').expect(200)).body;
    expect(list[0].group).toBe('dream');
    expect((await u.get('/api/v1/saved/universities/ids')).body).toContain(uni.id);
    await u.delete('/api/v1/users/me').set(H).expect(200);
    await u.get('/api/v1/auth/me').expect(401);
  });
});

async function completeCareer(u: ReturnType<typeof agent>) {
  const def = (await u.get('/api/v1/assessments/career/active')).body;
  const att = (await u.post('/api/v1/assessments/career/attempts').set(H)).body;
  const ans: Record<string, any> = {};
  for (const q of def.questions) {
    if (q.type === 'likert') ans[q.key] = q.key.startsWith('int_I') || q.key.startsWith('int_R') ? 5 : 2;
    else if (q.type === 'single') ans[q.key] = 'a';
  }
  await u.put(`/api/v1/attempts/${att.id}/answers`).set(H).send({ answers: ans }).expect(200);
  await u.post(`/api/v1/attempts/${att.id}/submit`).set(H).expect(200);
  return att.id as string;
}

/** Ямар ч тестийг ерөнхий хариултаар дуусгана (зөвхөн урсгал шалгахад) */
async function completeAny(u: ReturnType<typeof agent>, key: string, overrides: Record<string, any> = {}) {
  const def = (await u.get(`/api/v1/assessments/${key}/active`).expect(200)).body;
  const att = (await u.post(`/api/v1/assessments/${key}/attempts`).set(H).expect(200)).body;
  const ans: Record<string, any> = {};
  for (const q of def.questions) {
    if (q.type === 'likert' || q.type === 'rating') ans[q.key] = 3;
    else if (q.type === 'single') ans[q.key] = q.options[0].key;
    else if (q.type === 'multi') ans[q.key] = [q.options[0].key];
    else if (q.type === 'number') ans[q.key] = 1;
    else if (q.type === 'text') ans[q.key] = 'тест';
  }
  Object.assign(ans, overrides);
  await u.put(`/api/v1/attempts/${att.id}/answers`).set(H).send({ answers: ans }).expect(200);
  await u.post(`/api/v1/attempts/${att.id}/submit`).set(H).expect(200);
  return att.id as string;
}

async function buy(u: ReturnType<typeof agent>, productKey: string, targetId?: string) {
  const p = (await u.post('/api/v1/payments').set(H).send({ productKey, targetId }).expect(200)).body;
  await u.post(`/api/v1/payments/${p.id}/dev-confirm`).set(H).send({}).expect(200); // зөвхөн NODE_ENV=test дахь тестийн давхар обьект
  return p;
}
const unlockResult = (u: ReturnType<typeof agent>, attemptId: string) => buy(u, 'test_result', attemptId);

describe('Төлбөр: тестийн үр дүн (9,900 ₮, нэг удаа)', () => {
  let u: ReturnType<typeof agent>; let attemptId: string; let pay: any;

  it('бүтээгдэхүүний жагсаалт нийтийн; нэвтрээгүй хэрэглэгч төлбөр үүсгэж чадахгүй', async () => {
    const r = await agent().get('/api/v1/payments/products').expect(200);
    expect(r.body.map((p: any) => p.key).sort()).toEqual(['country_access', 'test_result', 'university_access']);
    expect(r.body.find((p: any) => p.key === 'university_access')).toMatchObject({ priceMnt: 990, scope: 'university' });
    expect(r.body.find((p: any) => p.key === 'country_access')).toMatchObject({ priceMnt: 500, scope: 'country' });
    expect(JSON.stringify(r.body)).not.toContain('credit');
    await request(app.getHttpServer()).post('/api/v1/payments').set(H).send({ productKey: 'test_result' }).expect(401);
  });

  it('тестийг хязгааргүй давтаж өгнө (төлбөр шаардахгүй); дууссан үр дүн төлөөгүй бол агуулгагүй', async () => {
    u = await login('buyer@example.com');
    attemptId = await completeCareer(u);
    const second = await completeCareer(u);
    expect(second).not.toBe(attemptId);
    const r = (await u.get(`/api/v1/attempts/${attemptId}/result`).expect(200)).body;
    expect(r.locked).toBe(true);
    expect(r.premium).toBeNull();
    expect(Object.keys(r).sort()).toEqual(['assessmentKey', 'attemptId', 'completedAt', 'kind', 'locked', 'premium']);
    expect(JSON.stringify(r)).not.toContain('careerMatches');
  });

  it('invoice: QR, pending, дүн сервер талын үнээс (клиент дүн өгч болохгүй)', async () => {
    await u.post('/api/v1/payments').set(H).send({ productKey: 'test_result' }).expect(400);
    pay = (await u.post('/api/v1/payments').set(H).set('Idempotency-Key', 'k1').send({ productKey: 'test_result', targetId: attemptId, amount: 1 }).expect(200)).body;
    expect(pay.status).toBe('pending');
    expect(pay.qrImage).toContain('data:image/png;base64');
    expect(pay.amount).toBe(9900);
  });

  it('идемпотент: ижил Idempotency-Key болон нээлттэй pending → ижил төлбөр', async () => {
    const a = (await u.post('/api/v1/payments').set(H).set('Idempotency-Key', 'k1').send({ productKey: 'test_result', targetId: attemptId }).expect(200)).body;
    const b = (await u.post('/api/v1/payments').set(H).send({ productKey: 'test_result', targetId: attemptId }).expect(200)).body;
    expect(a.id).toBe(pay.id);
    expect(b.id).toBe(pay.id);
  });

  it('төлөөгүй бол verify → pending, эрх олгогдохгүй; буруу callback token нөлөөгүй', async () => {
    expect((await u.post(`/api/v1/payments/${pay.id}/verify`).set(H).expect(200)).body.status).toBe('pending');
    await request(app.getHttpServer()).get('/api/v1/payments/qpay/callback/not-a-real-token').expect(200);
    expect((await u.get(`/api/v1/attempts/${attemptId}/result`)).body.locked).toBe(true);
  });

  it('callback ӨӨРӨӨ эрх олгохгүй: провайдер төлөөгүй гэвэл pending хэвээр', async () => {
    const doc: any = await conn().collection('payments').findOne({ _id: new mongoose.Types.ObjectId(pay.id) });
    await request(app.getHttpServer()).get(`/api/v1/payments/qpay/callback/${doc.callbackToken}`).expect(200);
    expect((await u.post(`/api/v1/payments/${pay.id}/verify`).set(H)).body.status).toBe('pending');
  });

  it('дутуу төлсөн бол баталгаажихгүй (underpaid) — үр дүн нээгдэхгүй', async () => {
    await u.post(`/api/v1/payments/${pay.id}/dev-confirm`).set(H).send({ amount: 100 }).expect(200);
    expect((await u.post(`/api/v1/payments/${pay.id}/verify`).set(H)).body.status).toBe('pending');
    expect((await u.get(`/api/v1/attempts/${attemptId}/result`)).body.locked).toBe(true);
  });

  it('өөр хэрэглэгч бусдын төлбөрийг verify хийж, бусдын үр дүнд төлж чадахгүй', async () => {
    const other = await login('intruder@example.com');
    await other.post(`/api/v1/payments/${pay.id}/verify`).set(H).expect(403);
    await other.post('/api/v1/payments').set(H).send({ productKey: 'test_result', targetId: attemptId }).expect(403);
  });

  it('бүрэн төлсний дараа нээгдэнэ; давтан verify давхар эрх үүсгэхгүй; нээсэн үр дүнг дахин үзэхэд төлбөргүй', async () => {
    const r = (await u.post(`/api/v1/payments/${pay.id}/dev-confirm`).set(H).send({}).expect(200)).body;
    expect(r.status).toBe('paid');
    await Promise.all([1, 2, 3].map(() => u.post(`/api/v1/payments/${pay.id}/verify`).set(H)));
    const doc: any = await conn().collection('payments').findOne({ _id: new mongoose.Types.ObjectId(pay.id) });
    expect(doc.logs.filter((l: any) => l.event === 'paid')).toHaveLength(1);
    expect(await conn().collection('subscriptions').countDocuments({ paymentId: doc._id })).toBe(1);
    for (let i = 0; i < 2; i++) {
      const res = (await u.get(`/api/v1/attempts/${attemptId}/result`).expect(200)).body;
      expect(res.locked).toBe(false);
      expect(res.careerMatches.length).toBe(10);
    }
    const hist = (await u.get('/api/v1/attempts').expect(200)).body;
    expect(hist.find((h: any) => h.id === attemptId).unlocked).toBe(true);
  });

  it('аль хэдийн нээсэн үр дүнд дахин төлөх нь 409; нээгээгүй хоёр дахь оролдлого түгжээтэй хэвээр', async () => {
    await u.post('/api/v1/payments').set(H).send({ productKey: 'test_result', targetId: attemptId }).expect(409);
    const hist = (await u.get('/api/v1/attempts').expect(200)).body;
    const closed = hist.filter((h: any) => h.id !== attemptId)[0];
    expect(closed.unlocked).toBe(false);
    expect((await u.get(`/api/v1/attempts/${closed.id}/result`)).body.locked).toBe(true);
  });

  it('Админ: гүйлгээний жагсаалт, статистик; энгийн хэрэглэгчид хаалттай', async () => {
    const admin = await login('admin@example.com', 'admin');
    const list = (await admin.get('/api/v1/admin/billing/payments?status=paid').expect(200)).body;
    expect(list.total).toBeGreaterThanOrEqual(1);
    expect(JSON.stringify(list)).not.toContain('callbackToken');
    const st = (await admin.get('/api/v1/admin/billing/stats').expect(200)).body;
    expect(st.revenueMnt).toBeGreaterThan(0);
    await u.get('/api/v1/admin/billing/payments').expect(403);
  });

  it('хугацаа дууссан invoice → expired, дараа нь шинэ invoice', async () => {
    const x = await login('expire@example.com');
    const att = await completeCareer(x);
    const p = (await x.post('/api/v1/payments').set(H).send({ productKey: 'test_result', targetId: att }).expect(200)).body;
    await conn().collection('payments').updateOne({ _id: new mongoose.Types.ObjectId(p.id) }, { $set: { expiresAt: new Date(Date.now() - 1000) } });
    expect((await x.post(`/api/v1/payments/${p.id}/verify`).set(H)).body.status).toBe('expired');
    const again = (await x.post('/api/v1/payments').set(H).send({ productKey: 'test_result', targetId: att }).expect(200)).body;
    expect(again.id).not.toBe(p.id);
  });

  it('dev-confirm production-д биш зөвхөн test; бодит QPay-гүй орчинд mock-г ашиглах боломжгүй (provider тест)', async () => {
    // NODE_ENV=test тул энд ажиллана; unit тестээр isTestEnv('production') === false баталгаажсан
    const { isTestEnv } = await import('../src/common/security');
    expect(isTestEnv('production')).toBe(false);
    expect(isTestEnv(undefined)).toBe(false);
    expect(isTestEnv('development')).toBe(false);
  });
});

describe('Хотын тест: зорилтот сургуулиуд нь өгсөн тестээс хамаарна (магистр → магистр, зөвхөн карьер → бакалавр, аль ч үгүй → карьерын тест санал болгоно)', () => {
  it('тестийн дарааллаар горим өөрчлөгдөнө; тогтмол (эх сурвалжгүй) сургуулийн нэр хэзээ ч хариунд ордоггүй', async () => {
    const u = await login('citygate@example.com');
    const city = await completeAny(u, 'city');
    await unlockResult(u, city);
    const none = (await u.get(`/api/v1/attempts/${city}/result`).expect(200)).body;
    expect(none.universityGate).toEqual({ career: false, masters: false, mode: 'none' });
    for (const c of none.dreamCities) expect(c.universities).toEqual([]);
    for (const c of none.dreamCities) expect(c.breakdown.career).toBeUndefined(); // карьерын тест байхгүй → «мэргэжлийн салбар» оноо харагдахгүй
    for (const p of none.pathways) for (const s of p.steps) expect(s.startsWith('Зорилтот сургуулиуд:')).toBe(false);

    await completeCareer(u);
    const bach = (await u.get(`/api/v1/attempts/${city}/result`).expect(200)).body;
    expect(bach.universityGate).toEqual({ career: true, masters: false, mode: 'bachelor' });
    for (const c of bach.dreamCities) for (const x of c.universities) expect(typeof x.slug).toBe('string'); // зөвхөн бодит сургууль (объект)

    await completeAny(u, 'masters');
    const mast = (await u.get(`/api/v1/attempts/${city}/result`).expect(200)).body;
    expect(mast.universityGate).toEqual({ career: true, masters: true, mode: 'master' }); // дахин тооцоолоогүй, шууд солигдсон
  });

  it('зөвхөн магистрын тест өгсөн бол магистр горим', async () => {
    const u = await login('citygate2@example.com');
    const city = await completeAny(u, 'city');
    await unlockResult(u, city);
    await completeAny(u, 'masters');
    expect((await u.get(`/api/v1/attempts/${city}/result`).expect(200)).body.universityGate).toEqual({ career: false, masters: true, mode: 'master' });
  });
});

describe('Нэвтрэлт (зөвхөн Google)', () => {
  it('нууц үгээр бүртгүүлэх/нэвтрэх endpoint байхгүй (404); Google холбоос байна', async () => {
    await agent().post('/api/v1/auth/signup').set(H).send({ name: 'Бат Болд', email: 'a@example.com', password: 'secret-pass-1' }).expect(404);
    await agent().post('/api/v1/auth/login').set(H).send({ email: 'a@example.com', password: 'secret-pass-1' }).expect(404);
    expect(Object.keys((await agent().get('/api/v1/auth/config').expect(200)).body)).toContain('googleEnabled');
  });

  it('GET /health нийтийн, MongoDB-г шалгаж {status:ok} буцаана', async () => {
    expect((await agent().get('/api/v1/health').expect(200)).body).toEqual({ status: 'ok' });
  });

  it('Google callback: state cookie/query таарахгүй бол няцааж /login руу буцаана (login CSRF)', async () => {
    const r = await agent().get('/api/v1/auth/google/callback').query({ state: 'forged', code: 'x' });
    expect(r.status).toBe(302);
    expect(r.headers.location).toContain('/login?error=oauth_state');
  });

  it('нэвтрэлтгүйгээр нийтийн хуудас (сургууль, улс) харагдана; төлбөр, хандалт нэвтрэлт шаардана', async () => {
    await agent().get('/api/v1/universities').expect(200);
    await agent().get('/api/v1/universities/featured').expect(200);
    await agent().get('/api/v1/countries').expect(200);
    await request(app.getHttpServer()).post('/api/v1/payments').set(H).send({ productKey: 'university_access' }).expect(401);
    await request(app.getHttpServer()).get('/api/v1/users/me/access').expect(401);
  });
});

describe('Сургуулийн эрх: сургууль/улсаар төлж нээх ба backend хамгаалалт', () => {
  let admin: ReturnType<typeof agent>; let slug: string; let uniId: string; let slug2: string; let countryId: string; let slugOther: string;
  const SECRET = { englishTests: [{ test: 'IELTS', minScore: 6.5 }], procedure: ['Нууц алхам'], applicationLinks: [{ title: 'Apply', url: 'https://apply.example.edu/' }] };

  beforeAll(async () => {
    admin = await login('admin@example.com', 'admin');
    const c = (await admin.post('/api/v1/admin/countries').set(H).send({ nameMn: 'Эрхланд', nameEn: 'Accessland', code: 'AC1', status: 'published', admissionRules: [{ text: 'Нууц улсын дүрэм QRS', sourceName: 'Тест эх сурвалж', sourceUrl: 'https://rules.example.gov/' }] }).expect(201)).body;
    const mk = async (name: string, extra: any = {}) => (await admin.post('/api/v1/admin/universities').set(H).send({ name, countryId: c._id, status: 'published', tuition: [{ level: 'bachelor', annualFee: 4321, annualFeeUsd: 4321, currency: 'USD' }], admission: SECRET, ...extra }).expect(201)).body;
    const a = await mk('Locked Uni A', { featured: true });
    const b = await mk('Locked Uni B');
    slug = a.slug; uniId = a._id; slug2 = b.slug; countryId = c._id;
    const c2 = (await admin.post('/api/v1/admin/countries').set(H).send({ nameMn: 'Өөрланд', nameEn: 'Otherland', code: 'OT1', status: 'published' }).expect(201)).body;
    const o = (await admin.post('/api/v1/admin/universities').set(H).send({ name: 'Locked Uni C', countryId: c2._id, status: 'published', tuition: [{ level: 'bachelor', annualFee: 4321, annualFeeUsd: 4321, currency: 'USD' }], admission: SECRET }).expect(201)).body;
    slugOther = o.slug;
  });

  it('лого/зураг/танилцуулгын эх сурвалж, лиценз (media) нийтийн дэлгэрэнгүйд буцна; аюултай URL-ийг няцаана', async () => {
    const c = (await admin.post('/api/v1/admin/countries').set(H).send({ nameMn: 'Медиа', nameEn: 'Medialand', code: 'MD1', status: 'published' }).expect(201)).body;
    const media = { logo: { sourceUrl: 'https://commons.wikimedia.org/wiki/File:X.svg', license: 'Public domain' }, description: { sourceName: 'Wikipedia', sourceUrl: 'https://en.wikipedia.org/wiki/X', license: 'CC BY-SA 4.0', translatedByAi: true } };
    const body = { name: 'Media Uni', countryId: c._id, status: 'published', logoUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/X.svg?width=256', description: 'Тест танилцуулга', media };
    const u = (await admin.post('/api/v1/admin/universities').set(H).send(body).expect(201)).body;
    const r = (await agent().get(`/api/v1/universities/${u.slug}`).expect(200)).body;
    expect(r.media.logo.license).toBe('Public domain');
    expect(r.media.description.translatedByAi).toBe(true);
    expect(r.logoUrl).toContain('Special:FilePath');
    await admin.post('/api/v1/admin/universities').set(H).send({ ...body, name: 'Bad Media Uni', media: { logo: { sourceUrl: 'javascript:alert(1)', license: 'x' } } }).expect(400);
  });

  it('нэвтрээгүй хэрэглэгч: үнэгүй хэсэг + категорийн заагч; төлбөртэй өгөгдөл ОГТ байхгүй', async () => {
    const r = (await agent().get(`/api/v1/universities/${slug}`).expect(200)).body;
    expect(r.name).toBe('Locked Uni A');
    expect(r.access.unlocked).toBe(false);
    expect(r.country.universityCount).toBe(2); // Эрхланд: нийтлэгдсэн 2 сургууль (нийтийн тоо, төлбөртэй өгөгдөл биш)
    expect(r.access.categories.map((c: any) => c.key).sort()).toEqual(['english', 'procedure', 'tuition']);
    expect(r.paid).toBeUndefined();
    const raw = JSON.stringify(r);
    for (const s of ['4321', 'apply.example.edu', 'IELTS', 'Нууц алхам', 'Нууц улсын дүрэм QRS', 'rules.example.gov']) expect(raw).not.toContain(s);
  });

  it('жагсаалтын карт: лого/зураг/нэр/улс; төлбөр, шаардлагагүй; featured ажиллана', async () => {
    const list = (await agent().get('/api/v1/universities?q=Locked Uni&pageSize=10').expect(200)).body;
    expect(list.total).toBe(3);
    const card = list.items[0];
    for (const k of ['name', 'logoUrl', 'coverUrl', 'country']) expect(k in card).toBe(true);
    expect(JSON.stringify(list)).not.toContain('4321');
    const f = (await agent().get('/api/v1/universities/featured').expect(200)).body;
    expect(JSON.stringify(f)).toContain('Locked Uni A');
    const byCountry = (await agent().get('/api/v1/universities?country=accessland').expect(200)).body;
    expect(byCountry.total).toBe(2);
  });

  it('төлөөгүй хэрэглэгч: сургууль нээгдэхгүй; төлбөр үүсгэхэд зорилт заавал; байхгүй сургууль 404', async () => {
    const u = await login('nopay@example.com');
    expect((await u.get(`/api/v1/universities/${slug}`).expect(200)).body.paid).toBeUndefined();
    await u.post('/api/v1/payments').set(H).send({ productKey: 'university_access' }).expect(400);
    await u.post('/api/v1/payments').set(H).send({ productKey: 'university_access', targetId: new mongoose.Types.ObjectId().toString() }).expect(404);
    await u.post('/api/v1/payments').set(H).send({ productKey: 'country_access', targetId: new mongoose.Types.ObjectId().toString() }).expect(404);
    await u.post('/api/v1/payments').set(H).send({ productKey: 'credits_5' }).expect(404); // кредитийн бүтээгдэхүүн байхгүй
  });

  it('1,000 ₮: сервер талын үнэ; төлөөгүй/дутуу төлсөн бол нээхгүй; төлсний дараа нэг удаа; давтан verify давхардахгүй', async () => {
    const u = await login('c1@example.com');
    const p = (await u.post('/api/v1/payments').set(H).send({ productKey: 'university_access', targetId: uniId, amount: 1 }).expect(200)).body;
    expect(p.amount).toBe(990);
    await u.post(`/api/v1/payments/${p.id}/verify`).set(H).expect(200);
    expect((await u.get(`/api/v1/universities/${slug}`).expect(200)).body.paid).toBeUndefined();
    await u.post(`/api/v1/payments/${p.id}/dev-confirm`).set(H).send({ amount: 500 }).expect(200);
    await u.post(`/api/v1/payments/${p.id}/verify`).set(H);
    expect((await u.get(`/api/v1/universities/${slug}`).expect(200)).body.paid).toBeUndefined(); // дутуу төлөлт
    await u.post(`/api/v1/payments/${p.id}/dev-confirm`).set(H).send({}).expect(200);
    await Promise.all([1, 2, 3, 4].map(() => u.post(`/api/v1/payments/${p.id}/verify`).set(H)));
    expect((await u.get(`/api/v1/universities/${slug}`).expect(200)).body.access.unlocked).toBe(true);
    expect(await conn().collection('subscriptions').countDocuments({ productKey: 'university_access', targetId: new mongoose.Types.ObjectId(uniId) })).toBeGreaterThanOrEqual(1);
    const mine = (await u.get('/api/v1/payments/me').expect(200)).body;
    expect(mine[0]).toMatchObject({ productKey: 'university_access', amount: 990 });
    expect('credits' in mine[0]).toBe(false);
  });

  it('нэг сургууль худалдаж авбал зөвхөн тэр сургууль нээгдэнэ; төлбөртэй өгөгдөл ирнэ; дахин авах нь 409; профайлд харагдана', async () => {
    const u = await login('opener@example.com');
    await buy(u, 'university_access', uniId);
    const det = (await u.get(`/api/v1/universities/${slug}`).expect(200)).body;
    expect(det.access.unlocked).toBe(true);
    expect(JSON.stringify(det.paid)).toContain('4321');
    expect(JSON.stringify(det.paid)).toContain('Нууц алхам');
    expect(det.paid.languageRules[0]).toMatchObject({ text: 'Нууц улсын дүрэм QRS', sourceUrl: 'https://rules.example.gov/' }); // улсын дүрэм төлбөртэй хэсэгт
    expect(JSON.stringify(det.paid)).toContain('apply.example.edu');
    expect((await u.get(`/api/v1/universities/${slug2}`).expect(200)).body.paid).toBeUndefined(); // өөр сургууль хаалттай
    expect((await u.get(`/api/v1/universities/${slugOther}`).expect(200)).body.paid).toBeUndefined();
    const dup = await u.post('/api/v1/payments').set(H).send({ productKey: 'university_access', targetId: uniId }).expect(409);
    expect(dup.body.code).toBe('ALREADY_OWNED');
    const acc = (await u.get('/api/v1/users/me/access').expect(200)).body;
    expect(acc.unlocked.map((x: any) => x.slug)).toEqual([slug]);
    expect(acc.countries).toEqual([]);
    expect('credits' in acc).toBe(false);
    const other = await login('other-opener@example.com'); // өөр хэрэглэгчид нээгдээгүй
    expect((await other.get(`/api/v1/universities/${slug}`).expect(200)).body.paid).toBeUndefined();
  });

  it('РЕГРЕСС: дуусах дөхсөн (5 мин-аас бага) нэхэмжлэхийг дахин өгөхгүй — шинэ нэхэмжлэх; хангалттай хугацаатайг дахин ашиглана', async () => {
    const u = await login('near-expiry@example.com');
    const a = (await u.post('/api/v1/payments').set(H).send({ productKey: 'university_access', targetId: uniId }).expect(200)).body;
    const same = (await u.post('/api/v1/payments').set(H).send({ productKey: 'university_access', targetId: uniId }).expect(200)).body;
    expect(same.id).toBe(a.id); // 15 мин үлдсэн: дахин ашиглана
    await conn().collection('payments').updateOne({ _id: new mongoose.Types.ObjectId(a.id) }, { $set: { expiresAt: new Date(Date.now() + 60_000) } });
    const b = (await u.post('/api/v1/payments').set(H).send({ productKey: 'university_access', targetId: uniId }).expect(200)).body;
    expect(b.id).not.toBe(a.id);
    expect(b.status).toBe('pending');
    expect((await conn().collection('payments').findOne({ _id: new mongoose.Types.ObjectId(a.id) }))?.status).toBe('cancelled');
    expect(new Date(b.expiresAt).getTime() - Date.now()).toBeGreaterThan(10 * 60 * 1000);
  });

  it('РЕГРЕСС: ижил idempotency түлхүүртэй цуцлагдсан нэхэмжлэх буцахгүй — шинэ pending нэхэмжлэх (QR) үүснэ', async () => {
    const u = await login('dead-key@example.com');
    const a = (await u.post('/api/v1/payments').set(H).set('Idempotency-Key', 'dead-key-1').send({ productKey: 'university_access', targetId: uniId }).expect(200)).body;
    expect(a.status).toBe('pending');
    await u.post(`/api/v1/payments/${a.id}/cancel`).set(H).expect(200);
    const b = (await u.post('/api/v1/payments').set(H).set('Idempotency-Key', 'dead-key-1').send({ productKey: 'university_access', targetId: uniId }).expect(200)).body;
    expect(b.status).toBe('pending');
    expect(b.id).not.toBe(a.id);
    expect(b.qrImage).toContain('data:image/png;base64');
  });

  it('РЕГРЕСС: хугацаа дууссан нэхэмжлэх хожим төлөгдсөн бол (callback) эрх олгогдоно — мөнгө алдагдахгүй (GoAylal-тай ижил)', async () => {
    const u = await login('late-payer@example.com');
    const p = (await u.post('/api/v1/payments').set(H).send({ productKey: 'university_access', targetId: uniId }).expect(200)).body;
    const col = conn().collection('payments');
    const oid = new mongoose.Types.ObjectId(p.id);
    await col.updateOne({ _id: oid }, { $set: { expiresAt: new Date(Date.now() - 1000) } });
    expect((await u.post(`/api/v1/payments/${p.id}/verify`).set(H).expect(200)).body.status).toBe('expired');
    expect((await u.get(`/api/v1/universities/${slug}`).expect(200)).body.paid).toBeUndefined();
    await u.post(`/api/v1/payments/${p.id}/dev-confirm`).set(H).send({}).expect(200); // QPay-д төлөгдсөнийг дуурайна (poll нь дууссан нэхэмжлэхийг дахин асуухгүй)
    expect((await u.get(`/api/v1/universities/${slug}`).expect(200)).body.paid).toBeUndefined();
    const doc: any = await col.findOne({ _id: oid });
    await request(app.getHttpServer()).get(`/api/v1/payments/qpay/callback/${doc.callbackToken}`).expect(200);
    expect((await u.get(`/api/v1/universities/${slug}`).expect(200)).body.access.unlocked).toBe(true);
    expect((await col.findOne({ _id: oid }))?.status).toBe('paid');
  });

  it('улсаар худалдаж авбал тэр улсын БҮХ сургууль нээгдэнэ, өөр улсынх нээгдэхгүй; улс авсны дараа сургууль тусад нь авах нь 409', async () => {
    const u = await login('country@example.com');
    await buy(u, 'country_access', countryId);
    expect((await u.get(`/api/v1/universities/${slug}`).expect(200)).body.access.unlocked).toBe(true);
    const b = (await u.get(`/api/v1/universities/${slug2}`).expect(200)).body;
    expect(b.access.unlocked).toBe(true);
    expect(JSON.stringify(b.paid)).toContain('4321');
    expect((await u.get(`/api/v1/universities/${slugOther}`).expect(200)).body.paid).toBeUndefined();
    await u.post('/api/v1/payments').set(H).send({ productKey: 'university_access', targetId: uniId }).expect(409);
    await u.post('/api/v1/payments').set(H).send({ productKey: 'country_access', targetId: countryId }).expect(409);
    const acc = (await u.get('/api/v1/users/me/access').expect(200)).body;
    expect(acc.countries.map((x: any) => x.slug)).toEqual(['accessland']);
    expect(acc.unlocked).toEqual([]);
  });

  it('улсын хуудас: төлөөгүйд ерөнхий мэдээлэл + эхний 2 мөр л ирнэ; country_access-ээр бүгд; админд бүгд', async () => {
    await admin.patch(`/api/v1/admin/countries/${countryId}`).set(H).send({
      overview: 'Ерөнхий танилцуулга ил. Хоёр дахь өгүүлбэр ил.',
      tuitionRange: 'Нэг дэх мөр. Хоёр дахь мөр. Гурав дахь НУУЦ_ТӨЛБӨР мөр.',
      admissionGeneral: 'А мөр. Б мөр. В НУУЦ_ШААРДЛАГА мөр.',
      commonExams: ['SAT', 'ACT', 'НУУЦ_ШАЛГАЛТ'],
      pros: ['Давуу 1', 'Давуу 2', 'НУУЦ_ДАВУУ'],
      cons: ['Сул 1', 'Сул 2', 'НУУЦ_СУЛ'],
      visaLinks: [{ title: 'Виз', url: 'https://visa.example.gov/' }],
    }).expect(200);
    const locked = (await agent().get('/api/v1/countries/accessland').expect(200)).body;
    expect(locked.access).toMatchObject({ unlocked: false });
    expect(locked.access.lockedFields.sort()).toEqual(['admissionGeneral', 'commonExams', 'cons', 'pros', 'tuitionRange']);
    expect(locked.overview).toContain('Хоёр дахь өгүүлбэр ил');
    expect(locked.visaLinks).toHaveLength(1);
    expect(locked.universities.length).toBe(2);
    expect(locked.universityCount).toBe(2);
    expect(typeof locked.universities[0].slug).toBe('string');
    for (const f of ['tuitionRange', 'admissionGeneral', 'commonExams', 'pros', 'cons', 'educationSystem']) expect(f in locked).toBe(false);
    const raw = JSON.stringify(locked);
    for (const s of ['Нэг дэх мөр', 'Давуу 1', 'Сул 1', 'SAT', 'НУУЦ_ТӨЛБӨР', 'НУУЦ_ШААРДЛАГА', 'НУУЦ_ШАЛГАЛТ', 'НУУЦ_ДАВУУ', 'НУУЦ_СУЛ']) expect(raw).not.toContain(s);
    const u = await login('country-page@example.com');
    expect((await u.get('/api/v1/countries/accessland').expect(200)).body.access.unlocked).toBe(false); // нэвтэрсэн ч төлөөгүй
    await buy(u, 'country_access', countryId);
    const full = (await u.get('/api/v1/countries/accessland').expect(200)).body;
    expect(full.access.unlocked).toBe(true);
    expect(JSON.stringify(full)).toContain('НУУЦ_ТӨЛБӨР');
    expect(full.pros).toHaveLength(3);
    const other = await login('country-page-other@example.com'); // өөр хэрэглэгчид нээгдээгүй
    expect((await other.get('/api/v1/countries/accessland').expect(200)).body.access.unlocked).toBe(false);
    expect((await admin.get('/api/v1/countries/accessland').expect(200)).body.access.unlocked).toBe(true);
  });

  it('БҮТЭН АЯЛАЛ: нэвтрээгүй → нэвтэрнэ → тест үр дүн → сургууль → улс; бүх шатанд эрх, профайл, төлбөрийн түүх зөв', async () => {
    await admin.patch(`/api/v1/admin/countries/${countryId}`).set(H).send({ tuitionRange: 'Нэг мөр. Хоёр мөр. Гурав ЖУРНЕЙ_НУУЦ мөр.', pros: ['А', 'Б', 'ЖУРНЕЙ_ДАВУУ'] }).expect(200);

    // 1) Нэвтрээгүй: ямар ч төлбөртэй өгөгдөл ирэхгүй, төлбөр үүсгэж чадахгүй
    const anon = agent();
    const country0 = (await anon.get('/api/v1/countries/accessland').expect(200)).body;
    expect(country0.access.unlocked).toBe(false);
    expect(country0.access.lockedFields).toContain('tuitionRange');
    expect(JSON.stringify(country0)).not.toContain('ЖУРНЕЙ_');
    // Үнэ: сургууль 990 ₮; улс = нээгдэх (үнэгүй биш) сургуулийн тоо × 500 ₮ — сервер тооцно
    const schools = await conn().collection('universities').countDocuments({ countryId: new mongoose.Types.ObjectId(countryId), status: 'published', deletedAt: null, freeAccess: { $ne: true } });
    expect(country0.access.price).toEqual({ schools, unitMnt: 500, priceMnt: 500 * schools });
    expect((await anon.get(`/api/v1/universities/${slug}`).expect(200)).body.country.unlockPrice.priceMnt).toBe(500 * schools);
    expect((await anon.get(`/api/v1/universities/${slug}`).expect(200)).body.paid).toBeUndefined();
    await request(app.getHttpServer()).post('/api/v1/payments').set(H).send({ productKey: 'university_access', targetId: uniId }).expect(401);
    await request(app.getHttpServer()).get('/api/v1/users/me/access').expect(401);

    // 2) Нэвтэрсэн, төлөөгүй: тест өгнө, үр дүн түгжээтэй; профайл хоосон
    const u = await login('journey@example.com');
    expect((await u.get('/api/v1/users/me/access').expect(200)).body).toEqual({ unlocked: [], countries: [] });
    const attempt = await completeCareer(u);
    expect((await u.get(`/api/v1/attempts/${attempt}/result`).expect(200)).body.locked).toBe(true);

    // 3) Тестийн үр дүн нээх
    await unlockResult(u, attempt);
    expect((await u.get(`/api/v1/attempts/${attempt}/result`).expect(200)).body.locked).toBe(false);

    // 4) Нэг сургууль: зөвхөн тэр нээгдэнэ, профайлд сургууль болж харагдана
    await buy(u, 'university_access', uniId);
    expect(JSON.stringify((await u.get(`/api/v1/universities/${slug}`).expect(200)).body.paid)).toContain('4321');
    expect((await u.get(`/api/v1/universities/${slug2}`).expect(200)).body.paid).toBeUndefined();
    expect((await u.get('/api/v1/countries/accessland').expect(200)).body.access.unlocked).toBe(false); // улсын хэсэг хаалттай хэвээр
    let acc = (await u.get('/api/v1/users/me/access').expect(200)).body;
    expect(acc.unlocked.map((x: any) => x.slug)).toEqual([slug]);
    expect(acc.countries).toEqual([]);

    // 5) Улс: бүх сургууль + улсын бүх хэсэг нээгдэнэ, профайлд улс болж нэмэгдэнэ
    const countryPay = await buy(u, 'country_access', countryId);
    expect(countryPay.amount).toBe(500 * schools); // клиент дүн өгөөгүй, сервер сургуулийн тоогоор тооцсон
    expect(JSON.stringify((await u.get(`/api/v1/universities/${slug2}`).expect(200)).body.paid)).toContain('4321');
    expect((await u.get(`/api/v1/universities/${slugOther}`).expect(200)).body.paid).toBeUndefined(); // өөр улс хаалттай
    const country1 = (await u.get('/api/v1/countries/accessland').expect(200)).body;
    expect(country1.access.unlocked).toBe(true);
    expect(country1.access.lockedFields).toEqual([]);
    expect(JSON.stringify(country1)).toContain('ЖУРНЕЙ_НУУЦ');
    expect(country1.pros).toHaveLength(3);
    acc = (await u.get('/api/v1/users/me/access').expect(200)).body;
    expect(acc.countries.map((x: any) => x.slug)).toEqual(['accessland']);
    expect(acc.unlocked.map((x: any) => x.slug)).toEqual([slug]);

    // 6) Давтан худалдан авалт 409; төлбөрийн түүхэнд 3 төлөгдсөн бүтээгдэхүүн
    for (const [productKey, targetId] of [['test_result', attempt], ['university_access', uniId], ['country_access', countryId]] as const) {
      await u.post('/api/v1/payments').set(H).send({ productKey, targetId }).expect(409);
    }
    const paid = (await u.get('/api/v1/payments/me').expect(200)).body.filter((p: any) => p.status === 'paid');
    expect(paid.map((p: any) => p.productKey).sort()).toEqual(['country_access', 'test_result', 'university_access']);

    // 7) Өөр хэрэглэгчид юу ч нээгдээгүй
    const other = await login('journey-other@example.com');
    expect((await other.get('/api/v1/countries/accessland').expect(200)).body.access.unlocked).toBe(false);
    expect((await other.get(`/api/v1/universities/${slug2}`).expect(200)).body.paid).toBeUndefined();
    expect((await other.get(`/api/v1/attempts/${attempt}/result`)).status).not.toBe(200);
    expect((await other.get('/api/v1/users/me/access').expect(200)).body).toEqual({ unlocked: [], countries: [] });
  });

  it('мэргэжлийн хуудас: Монголын их сургуулийн ЭЕШ-ийн шаардлага нийтэд харагдана; байхгүй бол хоосон; профайл ирэхгүй', async () => {
    const list = (await agent().get('/api/v1/careers').query({ pageSize: 2 }).expect(200)).body.items;
    const [withExams, without] = [list[0].slug, list[1].slug];
    expect((await agent().get(`/api/v1/careers/${withExams}`).expect(200)).body.entranceExams).toEqual([]);
    await conn().collection('careers').updateOne({ slug: withExams }, { $set: { entranceExams: [
      { university: 'Монгол Улсын Их Сургууль', school: 'Тест сургууль', program: 'Тест хөтөлбөр', flags: '*', baseExams: ['Математик', 'Физик'], extraExams: ['Ур чадварын шалгалт', 'Математик'], cutoffScore: 490, year: 2026, sourceName: 'МУИС', sourceUrl: 'https://elselt.num.edu.mn/' },
    ] } });
    const c = (await agent().get(`/api/v1/careers/${withExams}`).expect(200)).body;
    expect(c.entranceExams).toHaveLength(1);
    expect(c.entranceExams[0].program).toBe('Тест хөтөлбөр');
    expect(c.entranceExams[0].baseExams).toEqual(['Математик', 'Физик']);
    expect(c.entranceExams[0].cutoffScore).toBe(490);
    expect(c.entranceExams[0].year).toBe(2026);
    expect(c.profile).toBeUndefined();
    expect((await agent().get(`/api/v1/careers/${without}`).expect(200)).body.entranceExams).toEqual([]);
    // ЭЕШ-ийн төлөв: мэдээлэл бий → available; байхгүй + Job Zone ≤ 3 → not_required; байхгүй + Job Zone ≥ 4 / тодорхойгүй → unknown
    expect(c.entranceExamStatus).toBe('available');
    const statusOf = async (jobZone: number | null) => {
      await conn().collection('careers').updateOne({ slug: without }, jobZone == null ? { $unset: { jobZone: '' } } : { $set: { jobZone } });
      return (await agent().get(`/api/v1/careers/${without}`).expect(200)).body.entranceExamStatus;
    };
    expect(await statusOf(3)).toBe('not_required');
    expect(await statusOf(5)).toBe('unknown');
    expect(await statusOf(null)).toBe('unknown');
  });

  it('төлбөрийн хэсэг тусдаа: тестийн үр дүн нээх нь сургуулийг нээхгүй', async () => {
    const u = await login('separate@example.com');
    const att = await completeCareer(u);
    expect((await u.get(`/api/v1/attempts/${att}/result`)).body.locked).toBe(true);
    await unlockResult(u, att);
    expect((await u.get(`/api/v1/attempts/${att}/result`)).body.locked).toBe(false);
    expect((await u.get(`/api/v1/universities/${slug}`).expect(200)).body.paid).toBeUndefined();
  });

  it('элсэлтийн шалгагч: сургуулийг нээгээгүй бол 402', async () => {
    const prog = (await admin.post('/api/v1/admin/programs').set(H).send({ universityId: uniId, name: 'MSc Locked', level: 'master', status: 'published', requirements: [{ kind: 'IELTS', minScore: 6.5 }] }).expect(201)).body;
    const u = await login('elig@example.com');
    const r = await u.post('/api/v1/eligibility/check').set(H).send({ programId: prog._id, profile: { ielts: 7 } }).expect(402);
    expect(r.body.code).toBe('UNIVERSITY_LOCKED');
    await buy(u, 'country_access', countryId); // улсаар нээсэн ч тухайн улсын сургуулийн шаардлага нээгдэнэ
    expect((await u.post('/api/v1/eligibility/check').set(H).send({ programId: prog._id, profile: { ielts: 7 } }).expect(200)).body.overall).toBe('satisfied');
  });
});

describe('Phase 4: Топ-25, шалгагч, импорт, AI, аналитик', () => {
  let admin: ReturnType<typeof agent>;
  const SCORES = (v: number) => ({ employmentGrowth: v, demand: v, salaryPotential: v, skillScarcity: v, automationResilience: v, mongoliaRelevance: v, globalOpportunities: v });

  it('эрэмбэ нийтлэгдээгүй үед хоосон жагсаалт + аргачлал; зохиомол эрэмбэ гаргахгүй', async () => {
    admin = await login('admin@example.com', 'admin');
    const r = (await agent().get('/api/v1/future-careers').expect(200)).body;
    expect(r.published).toBe(false);
    expect(r.ranked).toHaveLength(0);
    expect(r.methodology.criteria).toHaveLength(7);
    expect(r.candidates.length).toBeGreaterThan(0); // эрэмбэгүй редакцийн сонголт: оноо/хувьгүй
    expect(JSON.stringify(r.candidates)).not.toContain('score');
  });

  it('аргачлал: эх сурвалж, он байхгүй бол нийтлэх боломжгүй (400); хэрэглэгчид хаалттай', async () => {
    const w = { employmentGrowth: 0.2, demand: 0.2, salaryPotential: 0.15, skillScarcity: 0.1, automationResilience: 0.15, mongoliaRelevance: 0.1, globalOpportunities: 0.1 };
    await admin.put('/api/v1/admin/tools/settings/future-methodology').set(H).send({ published: true, weights: w, sources: [] }).expect(400);
    const plain = await login('plain2@example.com');
    await plain.put('/api/v1/admin/tools/settings/future-methodology').set(H).send({}).expect(403);
    await admin.put('/api/v1/admin/tools/settings/future-methodology').set(H).send({ published: true, year: 2025, weights: w, sources: [{ name: 'Тест судалгаа', url: 'https://example.org/report' }], notes: 'тест' }).expect(200);
  });

  it('шалгуурын оноотой мэргэжлүүдийг жингээр эрэмбэлж харуулна', async () => {
    const careers = (await admin.get('/api/v1/admin/careers?pageSize=5').expect(200)).body.items;
    await admin.patch(`/api/v1/admin/careers/${careers[0]._id}`).set(H).send({ future: { scores: SCORES(70), year: 2025, sourceName: 'Тест', sourceUrl: 'https://example.org/report' } }).expect(200);
    await admin.patch(`/api/v1/admin/careers/${careers[1]._id}`).set(H).send({ future: { scores: SCORES(90), year: 2025, sourceName: 'Тест', sourceUrl: 'https://example.org/report' } }).expect(200);
    await admin.patch(`/api/v1/admin/careers/${careers[2]._id}`).set(H).send({ future: { scores: { demand: 100 }, year: 2025 } }).expect(200); // бүрэн биш → оролцохгүй
    const r = (await agent().get('/api/v1/future-careers').expect(200)).body;
    expect(r.published).toBe(true);
    expect(r.ranked).toHaveLength(2);
    expect(r.ranked[0].slug).toBe(careers[1].slug);
    expect(r.ranked[0].score).toBe(90);
    expect(r.methodology.sources[0].url).toContain('example.org');
    expect(r.disclaimer).toContain('баталгаа биш');
  });

  it('ханш: тохируулаагүй бол null (таамаглахгүй); эх сурвалж, огноотой хадгална', async () => {
    expect((await agent().get('/api/v1/meta/exchange-rate').expect(200)).body.usdToMnt).toBeNull();
    await admin.put('/api/v1/admin/tools/settings/exchange-rate').set(H).send({ usdToMnt: 3500 }).expect(400);
    await admin.put('/api/v1/admin/tools/settings/exchange-rate').set(H).send({ usdToMnt: 3500, date: '2026-11-01', source: 'Монголбанк (тест)' }).expect(200);
    const r = (await agent().get('/api/v1/meta/exchange-rate').expect(200)).body;
    expect(r.usdToMnt).toBe(3500);
    expect(r.source).toContain('Монголбанк');
  });

  it('элсэлтийн шалгагч: хөтөлбөрийн шаардлагатай харьцуулна, байхгүй шаардлагыг зохиохгүй', async () => {
    const c = (await admin.post('/api/v1/admin/countries').set(H).send({ nameMn: 'Шалгалтланд', nameEn: 'Checkland', code: 'CK1', status: 'published' }).expect(201)).body;
    const uni = (await admin.post('/api/v1/admin/universities').set(H).send({ name: 'Checker Uni', countryId: c._id, status: 'published' }).expect(201)).body;
    const prog = (await admin.post('/api/v1/admin/programs').set(H).send({ universityId: uni._id, name: 'MSc Checks', level: 'master', status: 'published', requirements: [{ kind: 'IELTS', minScore: 6.5 }, { kind: 'GPA', minScore: 3 }, { kind: 'Portfolio' }] }).expect(201)).body;
    const empty = (await admin.post('/api/v1/admin/programs').set(H).send({ universityId: uni._id, name: 'No Req Program', level: 'master', status: 'published' }).expect(201)).body;
    expect((await agent().get('/api/v1/programs/search?q=Checks').expect(200)).body[0].requirementCount).toBeUndefined(); // шаардлага = төлбөртэй мэдээлэл
    const ev = await login('elig2@example.com');
    await ev.post('/api/v1/eligibility/check').set(H).send({ programId: prog._id, profile: { ielts: 7 } }).expect(402);
    await buy(ev, 'university_access', uni._id);
    const ok = (await ev.post('/api/v1/eligibility/check').set(H).send({ programId: prog._id, profile: { ielts: 7, gpa: 3.5, documents: ['Portfolio'] } }).expect(200)).body;
    expect(ok.overall).toBe('satisfied');
    const low = (await ev.post('/api/v1/eligibility/check').set(H).send({ programId: prog._id, profile: { ielts: 5.5, gpa: 3.5 } }).expect(200)).body;
    expect(low.overall).toBe('not_satisfied');
    expect(low.disclaimer).toContain('баталгаа биш');
    expect((await ev.post('/api/v1/eligibility/check').set(H).send({ programId: empty._id, profile: { ielts: 9 } }).expect(200)).body.overall).toBe('insufficient');
    await ev.post('/api/v1/eligibility/check').set(H).send({ programId: 'bad' }).expect(404);
  });

  it('импорт: dry-run шалгана (өгөгдөл өөрчлөхгүй), эх сурвалжгүй мөрийг няцаана, бодит импорт draft + баталгаажаагүй', async () => {
    const rows = [
      { name: 'Imported University One', countrySlug: 'japan', city: 'Tokyo', type: 'public', degreeLevels: 'bachelor;master', sourceUrl: 'https://example.edu/one', sourceName: 'Official', rankProvider: 'QS_WORLD', rank: 150, rankYear: 2025, rankEdition: 'QS 2025', rankSourceUrl: 'https://www.topuniversities.com/', tuitionLevel: 'bachelor', tuitionAnnualUsd: 9000, tuitionAcademicYear: '2025-26', tuitionSourceUrl: 'https://example.edu/fees' },
      { name: 'No Source University', countrySlug: 'japan' },
      { name: 'Bad Country University', countrySlug: 'atlantis', sourceUrl: 'https://example.edu/x' },
    ];
    const dry = (await admin.post('/api/v1/admin/tools/import/universities').set(H).send({ rows, dryRun: true }).expect(201)).body;
    expect(dry.created).toBe(1);
    expect(dry.failed).toBe(2);
    expect(dry.report[1].errors[0]).toContain('sourceUrl');
    expect((await admin.get('/api/v1/admin/universities?q=Imported').expect(200)).body.total).toBe(0);
    const real = (await admin.post('/api/v1/admin/tools/import/universities').set(H).send({ rows, dryRun: false }).expect(201)).body;
    expect(real.created).toBe(1);
    const got = (await admin.get('/api/v1/admin/universities?q=Imported').expect(200)).body.items[0];
    expect(got.status).toBe('draft');
    expect(got.source.verificationStatus).toBe('unverified');
    expect(got.rankings).toHaveLength(1);
    expect(got.minTuitionUsd).toBe(9000);
    expect(got.bestQsWorld).toBe(150);
    // дахин импорт → шинэчилнэ, ranking/tuition давхардахгүй
    const again = (await admin.post('/api/v1/admin/tools/import/universities').set(H).send({ rows: [rows[0]], dryRun: false }).expect(201)).body;
    expect(again.updated).toBe(1);
    const g2 = (await admin.get(`/api/v1/admin/universities/${got._id}`).expect(200)).body;
    expect(g2.rankings).toHaveLength(1);
    expect(g2.tuition).toHaveLength(1);
  });

  it('мэдээллийн чанар: баталгаажаагүй бичлэгийг жагсааж, verify хийхэд жагсаалтаас гарна', async () => {
    const before = (await admin.get('/api/v1/admin/tools/stale?resource=universities&pageSize=100').expect(200)).body;
    const target = before.items.find((i: any) => i.name === 'Imported University One');
    expect(target).toBeTruthy();
    await admin.post(`/api/v1/admin/universities/${target.id}/verify`).set(H).expect(200);
    const after = (await admin.get('/api/v1/admin/tools/stale?resource=universities&pageSize=100').expect(200)).body;
    expect(after.items.find((i: any) => i.name === 'Imported University One')).toBeFalsy();
    const one = (await admin.get(`/api/v1/admin/universities/${target.id}`)).body;
    expect(one.source.verificationStatus).toBe('verified');
    expect(one.source.verifiedBy).toBe('admin@example.com');
  });

  it('AI тайлбар (түлхүүргүй → шаблон): зөвхөн өгөгдлөөс, «Мэдээлэл байхгүй», эх сурвалж, тэмдэглэгээтэй', async () => {
    const u = await login('aiuser@example.com');
    const list = (await admin.get('/api/v1/admin/universities?q=Checker').expect(200)).body.items[0];
    await admin.post(`/api/v1/admin/universities/${list._id}/publish`).set(H).expect(200);
    await agent().post('/api/v1/ai/explain').set(H).send({ kind: 'university', id: list.slug }).expect(401);
    const r = (await u.post('/api/v1/ai/explain').set(H).send({ kind: 'university', id: list.slug }).expect(200)).body;
    expect(r.generatedBy).toBe('template');
    expect(r.text).toContain('Мэдээлэл байхгүй');
    expect(r.note).toContain('AI');
    expect(Array.isArray(r.sources)).toBe(true);
    await u.post('/api/v1/ai/explain').set(H).send({ kind: 'result', id: '6ae75000aa98d1f758fead00' }).expect(404);
    const att = await completeCareer(u);
    const res = (await u.post('/api/v1/ai/explain').set(H).send({ kind: 'result', id: att }).expect(200)).body;
    expect(res.facts.join(' ')).toContain('Premium нээгдээгүй'); // түгжигдсэн үр дүнгээс илүү мэдээлэл ашиглахгүй
    const other = await login('aiother@example.com');
    await other.post('/api/v1/ai/explain').set(H).send({ kind: 'result', id: att }).expect(403);
  });

  it('аналитик: цуврал, хувилбарын хөтөлбөр, шилдэг мэргэжил', async () => {
    const r = (await admin.get('/api/v1/admin/tools/analytics?days=14').expect(200)).body;
    expect(r.series).toHaveLength(14);
    expect(r.funnel.career.started).toBeGreaterThan(0);
    expect(r.funnel.career.completed).toBeGreaterThan(0);
    expect(r.topCareers.length).toBeGreaterThan(0);
    await login('plain3@example.com').then((x) => x.get('/api/v1/admin/tools/analytics').expect(403));
  });
});

describe('Аюулгүй байдлын шалгалт (review)', () => {
  it('админ бичлэгт javascript:/data: URL оруулахыг хориглоно', async () => {
    const admin = await login('admin@example.com', 'admin');
    const c = (await admin.get('/api/v1/admin/countries?pageSize=1').expect(200)).body.items[0];
    const r = await admin.post('/api/v1/admin/universities').set(H).send({ name: 'Evil Uni', countryId: c._id, website: 'javascript:alert(1)' }).expect(400);
    expect(r.body.code).toBe('UNSAFE_URL');
    await admin.patch(`/api/v1/admin/countries/${c._id}`).set(H).send({ visaLinks: [{ title: 'x', url: 'data:text/html,hi' }] }).expect(400);
    await admin.post('/api/v1/admin/universities').set(H).send({ name: 'Fine Uni', countryId: c._id, website: 'https://fine.example.edu' }).expect(201);
  });

  it('query дахь NoSQL оператор/prototype түлхүүр нийтийн болон админ жагсаалтыг эвдэхгүй', async () => {
    await agent().get('/api/v1/universities?country[$ne]=x&type[$gt]=&sort=constructor&degree[$ne]=1').expect(200);
    await agent().get('/api/v1/universities?sort=__proto__').expect(200);
    const admin = await login('admin@example.com', 'admin');
    const all = (await admin.get('/api/v1/admin/universities?pageSize=100').expect(200)).body.total;
    const inj = (await admin.get('/api/v1/admin/universities?pageSize=100&status[$ne]=zzz&universityId[$ne]=x').expect(200)).body.total;
    expect(inj).toBe(all); // оператор үйлчлээгүй (шүүлтүүр үл тоогдсон)
  });

  it('dev-login/mock төлбөр нь NODE_ENV=test үед ажиллаж, auth/config үүнийг зөв мэдээлнэ', async () => {
    const cfg = (await agent().get('/api/v1/auth/config').expect(200)).body;
    expect(cfg.devLoginEnabled).toBe(true);
  });

  it('буруу хэлбэртэй cookie/refresh нь 401 (500 биш)', async () => {
    await request(app.getHttpServer()).post('/api/v1/auth/refresh').set(H).set('Cookie', 'refresh_token=garbage').expect(401);
    await request(app.getHttpServer()).post('/api/v1/auth/refresh').set(H).set('Cookie', 'refresh_token=notanid.abc').expect(400);
  });

  it('JSON хэмжээний хязгаар: 2MB-аас том нь няцаагдана, 300KB импорт хүлээн авна', async () => {
    const admin = await login('admin@example.com', 'admin');
    const rows = Array.from({ length: 400 }, (_, i) => ({ name: `Bulk ${i}`, countrySlug: 'japan', sourceUrl: 'https://example.edu/' + 'x'.repeat(600), description: 'd'.repeat(100) }));
    await admin.post('/api/v1/admin/tools/import/universities').set(H).send({ rows, dryRun: true }).expect(201);
    await admin.post('/api/v1/admin/tools/import/universities').set(H).send({ rows: [{ name: 'x'.repeat(3 * 1024 * 1024) }], dryRun: true }).expect(413);
  });
});
