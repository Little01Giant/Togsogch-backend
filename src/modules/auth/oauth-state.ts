import { randomBytes, timingSafeEqual } from 'crypto';

/** Google OAuth `state`: нэвтрэлт эхлүүлсэн хөтөч дээр cookie-д хадгалж, callback дээр тулгана (login CSRF-ээс хамгаална). Цэвэр логик (Nest-гүй). */
export const OAUTH_STATE_COOKIE = 'oauth_state';
export const OAUTH_STATE_TTL_MS = 10 * 60 * 1000;

export const newOAuthState = () => randomBytes(24).toString('hex');

/** cookie ба query-ийн state таарч байвал true (тогтмол хугацаат харьцуулалт). */
export function oauthStateMatches(cookie: unknown, query: unknown): boolean {
  if (typeof cookie !== 'string' || typeof query !== 'string' || !cookie || cookie.length !== query.length) return false;
  return timingSafeEqual(Buffer.from(cookie), Buffer.from(query));
}
