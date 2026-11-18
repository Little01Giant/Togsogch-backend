import { Body, Controller, Get, Headers, HttpCode, Module, Param, Post, Query, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { Response } from 'express';
import { str } from '../../common/security';
import { CsrfExempt, CurrentUser, Public } from '../../common/guards/auth';
import { EntitlementsService, PaymentsCoreModule, PaymentsService } from './payments.service';

class CreatePaymentDto {
  @IsString() productKey: string;
  @IsOptional() @IsString() targetId?: string;
  @IsOptional() @IsString() @MaxLength(80) idempotencyKey?: string;
}
class DevConfirmDto { @IsOptional() @IsNumber() amount?: number; }

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private svc: PaymentsService, private ent: EntitlementsService) {}

  @Public() @Get('products') products() { return this.svc.listProducts(); }

  @Get('me') mine(@CurrentUser() u: any) { return this.svc.mine(u.id); }
  @Get('entitlements') async entitlements(@CurrentUser() u: any) {
    return (await this.ent.list(u.id)).map((s) => ({ productKey: s.productKey, targetId: s.targetId ? String(s.targetId) : null }));
  }

  /** Idempotency-Key header (эсвэл body) өгвөл давтан дуудлага ижил invoice буцаана */
  @Post() @HttpCode(200) @Throttle({ default: { limit: Number(process.env.PAYMENT_CREATE_LIMIT ?? 10), ttl: 60000 } })
  create(@CurrentUser() u: any, @Body() dto: CreatePaymentDto, @Headers('idempotency-key') key?: string) {
    return this.svc.create(u.id, dto.productKey, dto.targetId, key ?? dto.idempotencyKey);
  }

  @Post(':id/verify') @HttpCode(200) @Throttle({ default: { limit: Number(process.env.PAYMENT_VERIFY_LIMIT ?? 40), ttl: 60000 } })
  verify(@CurrentUser() u: any, @Param('id') id: string, @Query('manual') manual?: string) { return this.svc.verify(id, u, str(manual) === '1'); }

  @Post(':id/cancel') @HttpCode(200) cancel(@CurrentUser() u: any, @Param('id') id: string) { return this.svc.cancel(u.id, id); }

  @Post(':id/dev-confirm') @HttpCode(200)
  devConfirm(@CurrentUser() u: any, @Param('id') id: string, @Body() dto: DevConfirmDto) { return this.svc.devConfirm(u.id, id, dto.amount); }

  /**
   * QPay callback. Аюулгүй байдал: энэ дуудлага ӨӨРӨӨ эрх олгохгүй — зөвхөн сервер талын
   * провайдерийн шалгалтыг эхлүүлнэ. Таашгүй token нь invoice бүрт өвөрмөц. Хариу үргэлж ижил (мэдээлэл задруулахгүй).
   */
  @Public() @CsrfExempt() @Get('qpay/callback/:token') @Throttle({ default: { limit: 60, ttl: 60000 } })
  async cbGet(@Param('token') token: string, @Query() _q: any, @Res() res: Response) { await this.svc.verifyByToken(token).catch(() => false); res.status(200).send('SUCCESS'); }
  @Public() @CsrfExempt() @Post('qpay/callback/:token') @Throttle({ default: { limit: 60, ttl: 60000 } })
  async cbPost(@Param('token') token: string, @Res() res: Response) { await this.svc.verifyByToken(token).catch(() => false); res.status(200).send('SUCCESS'); }
}

@Module({ imports: [PaymentsCoreModule], controllers: [PaymentsController] })
export class PaymentsModule {}
