import { Body, Controller, Get, Post, Req, Res, UseGuards, NotFoundException, HttpCode } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { GoogleOAuthGuard } from './google-oauth.guard';
import { Throttle } from '@nestjs/throttler';
import { IsEmail, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { Model } from 'mongoose';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { CsrfExempt, CurrentUser, Public, REFRESH_COOKIE } from '../../common/guards/auth';
import { User } from '../../schemas';
import { isDevEnv } from '../../common/security';

class DevLoginDto {
  @IsEmail({}, { message: 'Имэйл буруу байна' }) email: string;
  @IsString() @MaxLength(120) name: string;
  @IsOptional() @IsIn(['user', 'admin', 'super_admin']) role?: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService, private cfg: ConfigService, @InjectModel(User.name) private users: Model<User>) {}

  @Public() @Get('config')
  config() {
    return { googleEnabled: !!this.cfg.get('GOOGLE_CLIENT_ID'), devLoginEnabled: isDevEnv(this.cfg.get('NODE_ENV')) && this.cfg.get('DEV_LOGIN_ENABLED') === 'true' };
  }

  @Public() @Get('google') @UseGuards(GoogleOAuthGuard)
  google() { /* Passport Google руу дамжуулна (state cookie-тэй) */ }

  @Public() @CsrfExempt() @Get('google/callback') @UseGuards(GoogleOAuthGuard)
  async googleCallback(@Req() req: any, @Res() res: Response) {
    await this.auth.issue(req.user, res);
    // FRONTEND_URL таслалтай (олон origin) байж болно (CORS) → буцах хаяг нь эхнийх
    res.redirect(`${(this.cfg.get<string>('FRONTEND_URL') ?? '').split(',')[0].trim()}/auth/callback`);
  }

  @Public() @Post('dev-login') @HttpCode(200) @Throttle({ default: { limit: Number(process.env.DEV_LOGIN_LIMIT ?? 20), ttl: 60000 } })
  async devLogin(@Body() dto: DevLoginDto, @Res({ passthrough: true }) res: Response) {
    const user = await this.auth.devLogin(dto.email, dto.name, dto.role);
    await this.auth.issue(user, res);
    return this.shape(user);
  }

  @Public() @Post('refresh') @HttpCode(200)
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.shape(await this.auth.refresh(req.cookies?.[REFRESH_COOKIE], res));
  }

  @Public() @Post('logout') @HttpCode(200)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    await this.auth.logout(req.cookies?.[REFRESH_COOKIE], res);
    return { ok: true };
  }

  @Get('me')
  async me(@CurrentUser() cu: { id: string }) {
    const user = await this.users.findById(cu.id);
    if (!user || user.status === 'blocked' || user.deletedAt) throw new NotFoundException({ code: 'NOT_FOUND', message: 'Хэрэглэгч олдсонгүй.' });
    return this.shape(user);
  }

  private shape(u: any) {
    return { id: String(u._id), email: u.email, name: u.name, picture: u.picture, role: u.role, profile: u.profile, consent: u.consent };
  }
}
