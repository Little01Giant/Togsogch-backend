import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Strategy, Profile } from 'passport-google-oauth20';
import { AuthService } from './auth.service';

/** GOOGLE_CLIENT_ID тохируулсан үед л бүртгэгдэнэ (AuthModule дотор нөхцөлтэй provider). */
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(cfg: ConfigService, private auth: AuthService) {
    super({
      clientID: cfg.get<string>('GOOGLE_CLIENT_ID')!,
      clientSecret: cfg.get<string>('GOOGLE_CLIENT_SECRET')!,
      callbackURL: cfg.get<string>('GOOGLE_CALLBACK_URL')!,
      scope: ['profile', 'email'],
    });
  }

  async validate(_at: string, _rt: string, profile: Profile) {
    const email = profile.emails?.[0]?.value;
    if (!email) throw new Error('Google имэйл олдсонгүй');
    return this.auth.upsertGoogleUser({ googleId: profile.id, email, name: profile.displayName || email, picture: profile.photos?.[0]?.value, emailVerified: (profile.emails?.[0] as any)?.verified !== false && (profile as any)._json?.email_verified !== false });
  }
}
