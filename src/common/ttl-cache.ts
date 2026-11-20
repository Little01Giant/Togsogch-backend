/**
 * Нийтийн (хэрэглэгчээс үл хамаарах) хариуны санах ойн кэш: TTL + хэмжээний хязгаар + нэгэн зэрэг ирсэн ижил хүсэлтийг нэгтгэнэ.
 * ЗӨВХӨН бүх хэрэглэгчид ижил байх хариунд ашиглана (жагсаалт, мета). Төлбөртэй/хувийн хариунд ХЭЗЭЭ Ч.
 */
export class TtlCache {
  private store = new Map<string, { at: number; value: unknown }>();
  private inflight = new Map<string, Promise<unknown>>();

  constructor(private ttlMs: number, private maxEntries = 300, private now: () => number = Date.now) {}

  get size() { return this.store.size; }

  clear() { this.store.clear(); this.inflight.clear(); }

  /** `enabled=false` (тест) үед шууд `fn`-г ажиллуулна. */
  async wrap<T>(key: string, fn: () => Promise<T>, enabled = true): Promise<T> {
    if (!enabled) return fn();
    const hit = this.store.get(key);
    if (hit && this.now() - hit.at < this.ttlMs) return hit.value as T;
    const running = this.inflight.get(key);
    if (running) return running as Promise<T>;
    const gen = this.inflight;
    const p = fn().then((value) => {
      // clear() дуудагдсан бол (inflight солигдсон) хуучин үр дүнг хадгалахгүй
      if (gen === this.inflight) {
        if (this.store.size >= this.maxEntries) this.store.delete(this.store.keys().next().value as string);
        this.store.set(key, { at: this.now(), value });
      }
      return value;
    }).finally(() => { if (gen === this.inflight) this.inflight.delete(key); });
    this.inflight.set(key, p);
    return p;
  }
}

/** Нийтийн каталогийн кэш (60 сек). Админ өөрчлөлт хийх бүрд цэвэрлэгдэнэ. */
export const publicCache = new TtlCache(60_000, 300);

/** Кэшийн түлхүүр: зөвхөн зөвшөөрсөн query параметрийг эрэмбэлж нэгтгэнэ (санамсаргүй түлхүүрээр санах ой дүүргэхээс сэргийлнэ). */
export function cacheKey(prefix: string, q: Record<string, unknown>, allowed: readonly string[]): string | null {
  const parts: string[] = [];
  for (const k of [...allowed].sort()) {
    const v = q[k];
    if (v === undefined || v === '') continue;
    const s = Array.isArray(v) ? v.join(',') : String(v);
    if (s.length > 200) return null;
    parts.push(`${k}=${s}`);
  }
  return `${prefix}?${parts.join('&')}`;
}
