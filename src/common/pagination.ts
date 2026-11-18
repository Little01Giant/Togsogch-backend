export interface Paginated<T> { items: T[]; total: number; page: number; pageSize: number }

export function parsePaging(q: any, defaultSize = 12, max = 100) {
  const page = Math.max(1, parseInt(q.page, 10) || 1);
  const pageSize = Math.min(max, Math.max(1, parseInt(q.pageSize, 10) || defaultSize));
  return { page, pageSize, skip: (page - 1) * pageSize };
}

export const toArray = (v: any): string[] => (v == null || v === '' ? [] : Array.isArray(v) ? v : String(v).split(','));
export const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
