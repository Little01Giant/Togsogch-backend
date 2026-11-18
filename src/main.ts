import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { productionConfigProblems } from './common/security';

export async function configure(app: any) {
  app.setGlobalPrefix('api/v1');
  app.use(helmet());
  app.useBodyParser('json', { limit: '2mb' }); // CSV импортын мөрүүдэд хангалттай, гэхдээ хязгаартай
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: false }));
  return app;
}

async function bootstrap() {
  if (process.env.NODE_ENV === 'production') {
    const problems = productionConfigProblems(process.env);
    if (problems.length) { console.error('Production тохиргооны алдаа:\n - ' + problems.join('\n - ')); process.exit(1); }
  }
  const app = await NestFactory.create(AppModule);
  const cfg = app.get(ConfigService);
  // Cloudflare/reverse proxy-ийн ард жинхэнэ IP-г rate limit-д ашиглахын тулд (TRUST_PROXY=1)
  if (cfg.get('TRUST_PROXY')) (app as any).set('trust proxy', Number(cfg.get('TRUST_PROXY')) || cfg.get('TRUST_PROXY'));
  await configure(app);
  app.enableCors({ origin: (cfg.get('FRONTEND_URL') ?? 'http://localhost:3000').split(','), credentials: true });

  if (process.env.NODE_ENV !== 'production' || cfg.get('SWAGGER_ENABLED') === 'true') {
    const doc = SwaggerModule.createDocument(app, new DocumentBuilder().setTitle('Togsogch API').setDescription('Боловсрол & карьерын чиглүүлэх платформ').setVersion('0.1').addCookieAuth('access_token').build());
    SwaggerModule.setup('api/docs', app, doc);
  }

  const port = Number(cfg.get('PORT') ?? 4000);
  await app.listen(port);
  Logger.log(`API: http://localhost:${port}/api/v1  ·  Swagger: http://localhost:${port}/api/docs`, 'Bootstrap');
}
if (require.main === module) bootstrap();
