import { Body, Controller, Get, HttpCode, HttpException, Module, Param, Post, Put } from '@nestjs/common';
import { EntitlementsService } from '../payments/payments.service';
import { ApiTags } from '@nestjs/swagger';
import { IsObject } from 'class-validator';
import { AssessmentsService } from './assessments.service';
import { CurrentUser, Public } from '../../common/guards/auth';

class AnswersDto { @IsObject() answers: Record<string, any>; }

@ApiTags('assessments')
@Controller()
export class AssessmentsController {
  constructor(private svc: AssessmentsService, private ent: EntitlementsService) {}

  @Get('premium/roadmap')
  async roadmap(@CurrentUser() u: any) {
    if (u.role === 'user' && !(await this.ent.has(u.id, 'premium_roadmap'))) throw new HttpException({ code: 'PAYMENT_REQUIRED', message: 'Энэ боломж Premium эрхтэй хэрэглэгчдэд нээлттэй.', product: 'premium_roadmap' }, 402);
    return this.svc.roadmap(u.id);
  }

  @Public() @Get('assessments') list() { return this.svc.list(); }
  @Public() @Get('assessments/:key/active') active(@Param('key') key: string) { return this.svc.getActive(key); }

  @Post('assessments/:key/attempts') @HttpCode(200)
  start(@CurrentUser() u: any, @Param('key') key: string) { return this.svc.start(u.id, key); }

  @Put('attempts/:id/answers')
  save(@CurrentUser() u: any, @Param('id') id: string, @Body() dto: AnswersDto) { return this.svc.saveAnswers(u.id, id, dto.answers); }

  @Post('attempts/:id/submit') @HttpCode(200)
  submit(@CurrentUser() u: any, @Param('id') id: string) { return this.svc.submit(u.id, id); }

  @Get('attempts') history(@CurrentUser() u: any) { return this.svc.history(u.id); }
  @Get('attempts/:id/result') result(@CurrentUser() u: any, @Param('id') id: string) { return this.svc.getResult(u, id); }
}

@Module({ controllers: [AssessmentsController], providers: [AssessmentsService], exports: [AssessmentsService] })
export class AssessmentsModule {}
