import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { createHash, randomBytes } from 'crypto';
import { Response } from 'express';
import { User, UserDoc } from '../../schemas';
import { ACCESS_COOKIE, REFRESH_COOKIE } from '../../common/guards/auth';
import { isDevEnv } from '../../common/security';

const ACCESS_TTL_S = 15 * 60;
const REFRESH_TTL_MS = 7 * 24 * 3600 * 1000;
const sha = (s: string) => createHash('sha256').update(s).digest('hex');

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private users: Model<User>, private jwt: JwtService, private cfg: ConfigService) {}

  private get isProd() { return this.cfg.get('NODE_ENV') === 'production'; }
  private get superAdmins(): string[] {
    return (this.cfg.get<string>('SUPER_ADMIN_EMAILS') ?? '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
  }

  async upsertGoogleUser(p: { googleId: string; email: string; name: string; picture?: string; emailVerified?: boolean }): Promise<UserDoc> {
    if (p.emailVerified === false) throw new ForbiddenException({ code: 'EMAIL_NOT_VERIFIED', message: 'Google имэйл баталгаажаагүй байна.' });
    const email = p.email.toLowerCase();
    let user = await this.users.findOne({ $or: [{ googleId: p.googleId }, { email }] });
    if (user?.status === 'blocked') throw new ForbiddenException({ code: 'BLOCKED', message: 'Таны эрх хаагдсан байна.' });
    if (!user) user = new this.users({ email, name: p.name, googleId: p.googleId, picture: p.picture, role: 'user' });
    else { user.googleId = p.googleId; user.picture = p.picture ?? user.picture; }
    if (this.superAdmins.includes(email)) user.role = 'super_admin';
    user.lastLoginAt = new Date();
    return user.save();
  }

  /** Зөвхөн хөгжүүлэлтийн орчинд — Google credentials байхгүй үед */
  async devLogin(email: string, name: string, role?: string): Promise<UserDoc> {
    if (!isDevEnv(this.cfg.get('NODE_ENV')) || this.cfg.get('DEV_LOGIN_ENABLED') !== 'true') throw new ForbiddenException({ code: 'DISABLED', message: 'Энэ боломж идэвхгүй байна.' });
    email = email.toLowerCase();
    let user = await this.users.findOne({ email });
    if (!user) user = new this.users({ email, name });
    if (role && ['user', 'admin', 'super_admin'].includes(role)) user.role = role;
    if (this.superAdmins.includes(email)) user.role = 'super_admin';
    user.lastLoginAt = new Date();
    return user.save();
  }

  async issue(user: UserDoc, res: Response) {
    const access = await this.jwt.signAsync({ sub: String(user._id), email: user.email, role: user.role }, { secret: this.cfg.get('JWT_ACCESS_SECRET'), expiresIn: ACCESS_TTL_S });
    const refresh = randomBytes(48).toString('hex');
    await this.users.updateOne(
      { _id: user._id },
      { $push: { refreshTokens: { $each: [{ hash: sha(refresh), expiresAt: new Date(Date.now() + REFRESH_TTL_MS) }], $slice: -5 } } },
    );
    const base = { httpOnly: true, secure: this.isProd, sameSite: 'lax' as const };
    res.cookie(ACCESS_COOKIE, access, { ...base, path: '/', maxAge: ACCESS_TTL_S * 1000 });
    res.cookie(REFRESH_COOKIE, `${user._id}.${refresh}`, { ...base, path: '/api/v1/auth', maxAge: REFRESH_TTL_MS });
  }

  /** Refresh token rotation: хуучин token нэг удаа л хүчинтэй. */
  async refresh(cookie: string | undefined, res: Response) {
    const [uid, token] = (cookie ?? '').split('.');
    if (!uid || !token) throw new UnauthorizedException({ code: 'UNAUTHORIZED', message: 'Нэвтрэх хугацаа дууссан.' });
    const user = await this.users.findById(uid).select('+refreshTokens');
    const h = sha(token);
    const found = user?.refreshTokens?.find((t) => t.hash === h && t.expiresAt > new Date());
    if (!user || !found || user.status === 'blocked') {
      if (user) await this.users.updateOne({ _id: user._id }, { $set: { refreshTokens: [] } }); // token хулгайлагдсан байж болзошгүй
      throw new UnauthorizedException({ code: 'UNAUTHORIZED', message: 'Нэвтрэх хугацаа дууссан.' });
    }
    await this.users.updateOne({ _id: user._id }, { $pull: { refreshTokens: { hash: h } } });
    await this.issue(user, res);
    return user;
  }

  async logout(cookie: string | undefined, res: Response) {
    const [uid, token] = (cookie ?? '').split('.');
    if (uid && token) await this.users.updateOne({ _id: uid }, { $pull: { refreshTokens: { hash: sha(token) } } }).catch(() => undefined);
    res.clearCookie(ACCESS_COOKIE, { path: '/' });
    res.clearCookie(REFRESH_COOKIE, { path: '/api/v1/auth' });
  }
}
