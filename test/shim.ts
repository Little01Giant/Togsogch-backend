/**
 * Jest 30 нь ESM-only @nestjs пакетуудыг ачаалж чадахгүй тул e2e тестийг Node-ийн built-in test runner дээр ажиллуулна.
 * Энэ shim нь тестэд хэрэглэгдэх jest-тэй төстэй expect/describe/it-ийг өгнө.
 */
import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';

function matchers(actual: any, negate: boolean) {
  const check = (ok: boolean, msg: string) => assert.ok(negate ? !ok : ok, `${negate ? 'NOT ' : ''}${msg}`);
  return {
    toBe: (e: any) => check(Object.is(actual, e), `expected ${JSON.stringify(actual)} toBe ${JSON.stringify(e)}`),
    toEqual: (e: any) => { if (negate) assert.notDeepEqual(actual, e); else assert.deepEqual(actual, e); },
    toHaveLength: (n: number) => check(actual?.length === n, `expected length ${actual?.length} toBe ${n}`),
    toContain: (e: any) => check(typeof actual === 'string' ? actual.includes(e) : actual.includes(e), `expected ${JSON.stringify(actual)?.slice(0, 120)} toContain ${JSON.stringify(e)}`),
    toBeGreaterThan: (n: number) => check(actual > n, `expected ${actual} > ${n}`),
    toBeGreaterThanOrEqual: (n: number) => check(actual >= n, `expected ${actual} >= ${n}`),
    toBeTruthy: () => check(!!actual, `expected truthy, got ${actual}`),
    toBeNull: () => check(actual === null, `expected null, got ${JSON.stringify(actual)}`),
    toBeFalsy: () => check(!actual, `expected falsy, got ${JSON.stringify(actual)}`),
    toBeUndefined: () => check(actual === undefined, `expected undefined, got ${JSON.stringify(actual)?.slice(0, 120)}`),
    toMatchObject: (e: Record<string, any>) => check(Object.entries(e).every(([k, v]) => Object.is(actual?.[k], v)), `expected ${JSON.stringify(actual)} toMatchObject ${JSON.stringify(e)}`),
  };
}
export const expect = (actual: any) => ({ ...matchers(actual, false), not: matchers(actual, true) });
export { describe, it, before as beforeAll, after as afterAll };
