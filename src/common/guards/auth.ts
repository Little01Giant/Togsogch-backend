import { CanActivate, createParamDecorator, ExecutionContext, ForbiddenException, Injectable, SetMetadata, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export type Role = 'user' | 'admin' | 'super_admin';
export const ROLE_RANK: Record<Role, number> = { user: 1, admin: 2, super_admin: 3 };

export const ACCESS_COOKIE = 'access_token';
export const REFRESH_COOKIE = 'refresh_token';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
export const Public = () => SetMetadata('public', true);
export const OptionalAuth = () => SetMetadata('optionalAuth', true);
/** Класс @Public() байсан ч энэ endpoint нэвтрэлт ШААРДАНА */
export const Authenticated = () => SetMetadata('public', false);
export const CsrfExempt = () => SetMetadata('csrfExempt', true);

export const CurrentUser = createParamDecorator((_: unknown, ctx: ExecutionContext) => ctx.switchToHttp().getRequest().user);

/**
 * Глобал guard: access JWT-г HttpOnly cookie (эсвэл Bearer)-с уншина.
 * @Public() — нэвтрэлт шаардахгүй; @OptionalAuth() — байвал хэрэглэгчийг холбоно.
 * @Roles() — доод тал нь заасан түвшний эрх шаардана.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwt: JwtService, private cfg: ConfigService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const targets = [ctx.getHandler(), ctx.getClass()];
    const isPublic = this.reflector.getAllAndOverride<boolean>('public', targets);
    const optional = this.reflector.getAllAndOverride<boolean>('optionalAuth', targets);
    const roles = this.reflector.getAllAndOverride<Role[]>('roles', targets);

    const token = req.cookies?.[ACCESS_COOKIE] ?? (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : undefined);
    if (token) {
      try {
        const p = await this.jwt.verifyAsync(token, { secret: this.cfg.get('JWT_ACCESS_SECRET') });
        req.user = { id: p.sub, email: p.email, role: p.role as Role };
      } catch {
        /* хүчингүй token — доорх шалгалт шийднэ */
      }
    }
    if ((isPublic || optional) && !roles) return true;
    if (!req.user) throw new UnauthorizedException({ code: 'UNAUTHORIZED', message: 'Нэвтэрч орно уу.' });
    if (roles?.length) {
      const min = Math.min(...roles.map((r) => ROLE_RANK[r]));
      if (ROLE_RANK[req.user.role as Role] < min) throw new ForbiddenException({ code: 'FORBIDDEN', message: 'Танд энэ үйлдлийг хийх эрх байхгүй.' });
    }
    return true;
  }
}

/** CSRF хамгаалалт: мутаци бүр custom header шаардана (cross-site form үүнийг илгээж чадахгүй). */
@Injectable()
export class CsrfGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return true;
    if (this.reflector.getAllAndOverride<boolean>('csrfExempt', [ctx.getHandler(), ctx.getClass()])) return true;
    if (req.headers['x-requested-with'] !== 'fetch') throw new ForbiddenException({ code: 'CSRF', message: 'Хүсэлтийн баталгаажуулалт амжилтгүй.' });
    return true;
  }
}
