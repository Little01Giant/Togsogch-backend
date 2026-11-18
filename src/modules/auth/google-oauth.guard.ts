import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { newOAuthState, OAUTH_STATE_COOKIE, OAUTH_STATE_TTL_MS, oauthStateMatches } from './oauth-state';

const COOKIE_PATH = '/api/v1/auth/google';

/** Google руу чиглүүлэхдээ санамсаргүй `state`-ийг cookie-д тавьж, callback дээр тулгана. */
@Injectable()
export class GoogleOAuthGuard extends AuthGuard('google') {
  private isCallback(ctx: ExecutionContext) { return /\/callback$/.test(ctx.switchToHttp().getRequest().path ?? ''); }

  getAuthenticateOptions(ctx: ExecutionContext) {
    if (this.isCallback(ctx)) return {};
    const state = newOAuthState();
    ctx.switchToHttp().getResponse().cookie(OAUTH_STATE_COOKIE, state, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: OAUTH_STATE_TTL_MS, path: COOKIE_PATH });
    return { state };
  }

  async canActivate(ctx: ExecutionContext) {
    if (this.isCallback(ctx)) {
      const req = ctx.switchToHttp().getRequest(), res = ctx.switchToHttp().getResponse();
      const ok = oauthStateMatches(req.cookies?.[OAUTH_STATE_COOKIE], req.query?.state);
      res.clearCookie(OAUTH_STATE_COOKIE, { path: COOKIE_PATH });
      if (!ok) { res.redirect(`${process.env.FRONTEND_URL?.split(',')[0] ?? ''}/login?error=oauth_state`); return false; }
    }
    return (await super.canActivate(ctx)) as boolean;
  }
}
