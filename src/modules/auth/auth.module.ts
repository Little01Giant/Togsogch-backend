import { Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './google.strategy';

const googleProvider: Provider = {
  provide: GoogleStrategy,
  inject: [ConfigService, AuthService],
  useFactory: (cfg: ConfigService, auth: AuthService) => (cfg.get('GOOGLE_CLIENT_ID') ? new GoogleStrategy(cfg, auth) : null),
};

@Module({ controllers: [AuthController], providers: [AuthService, googleProvider], exports: [AuthService] })
export class AuthModule {}
