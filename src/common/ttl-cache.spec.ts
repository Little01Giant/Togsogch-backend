import { TtlCache, cacheKey } from './ttl-cache';

describe('TtlCache', () => {
  it('TTL дотор давтан дуудахад нэг л удаа тооцоолно, дууссаны дараа дахин', async () => {
    let t = 0;
    const c = new TtlCache(1000, 10, () => t);
    let calls = 0;
    const fn = async () => ++calls;
    expect(await c.wrap('a', fn)).toBe(1);
    expect(await c.wrap('a', fn)).toBe(1);
    t = 1001;
    expect(await c.wrap('a', fn)).toBe(2);
  });

  it('нэгэн зэрэг ирсэн ижил түлхүүрийг нэгтгэнэ', async () => {
    const c = new TtlCache(1000);
    let calls = 0;
    const slow = async () => { calls++; await new Promise((r) => setTimeout(r, 10)); return 'x'; };
    const [a, b] = await Promise.all([c.wrap('k', slow), c.wrap('k', slow)]);
    expect([a, b, calls]).toEqual(['x', 'x', 1]);
  });

  it('clear() кэшийг цэвэрлэж, clear-ийн өмнө эхэлсэн хуучин үр дүнг хадгалахгүй', async () => {
    const c = new TtlCache(1000);
    let v = 1;
    expect(await c.wrap('k', async () => v)).toBe(1);
    v = 2; c.clear();
    expect(await c.wrap('k', async () => v)).toBe(2);
    let release!: () => void;
    const gate = new Promise<void>((r) => { release = r; });
    const pending = c.wrap('m', async () => { await gate; return 'old'; });
    c.clear(); release();
    await pending;
    expect(c.size).toBe(1); // зөвхөн 'k'
  });

  it('enabled=false бол кэшлэхгүй; хэмжээ хэтэрвэл хамгийн хуучныг хасна', async () => {
    const c = new TtlCache(1000, 2);
    let calls = 0;
    await c.wrap('x', async () => ++calls, false);
    await c.wrap('x', async () => ++calls, false);
    expect(calls).toBe(2);
    await c.wrap('1', async () => 1); await c.wrap('2', async () => 2); await c.wrap('3', async () => 3);
    expect(c.size).toBe(2);
  });

  it('cacheKey: зөвхөн зөвшөөрсөн параметр, эрэмбэтэй; хэт урт утга → null', () => {
    const allowed = ['page', 'q', 'country'];
    expect(cacheKey('u', { q: 'a', page: 2, evil: 'x' }, allowed)).toBe('u?page=2&q=a');
    expect(cacheKey('u', { country: ['jp', 'kr'] }, allowed)).toBe('u?country=jp,kr');
    expect(cacheKey('u', { q: 'x'.repeat(300) }, allowed)).toBeNull();
  });
});
