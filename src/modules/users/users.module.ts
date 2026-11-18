import { Body, Controller, Delete, Get, HttpCode, Module, Param, Patch, Post, Put, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response } from 'express';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsIn, IsInt, IsNumber, IsOptional, IsString, Max, MaxLength, Min, ValidateNested } from 'class-validator';
import { ACCESS_COOKIE, CurrentUser, REFRESH_COOKIE } from '../../common/guards/auth';
import { AssessmentAttempt, AssessmentResult, SavedUniversity, Subscription, University, User } from '../../schemas';
import { BadRequestException, NotFoundException } from '@nestjs/common';

class ProfileDto {
  @IsOptional() @IsInt() @Min(5) @Max(100) age?: number;
  @IsOptional() @IsIn(['grade9', 'grade10', 'grade11', 'grade12', 'graduate', 'bachelor', 'master', 'working', 'other']) educationLevel?: string;
  @IsOptional() @IsString() @MaxLength(160) school?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) interests?: string[];
  @IsOptional() @IsString() @MaxLength(60) languageLevel?: string;
  @IsOptional() @IsNumber() @Min(0) budgetUsd?: number;
  @IsOptional() @IsString() @MaxLength(500) goal?: string;
}
class UpdateMeDto {
  @IsOptional() @IsString() @MaxLength(120) name?: string;
  @IsOptional() @ValidateNested() @Type(() => ProfileDto) profile?: ProfileDto;
}
class ConsentDto {
  @IsBoolean() privacyAccepted: boolean;
  @IsBoolean() termsAccepted: boolean;
  @IsOptional() @IsBoolean() isMinor?: boolean;
  @IsOptional() @IsBoolean() parentalConsentConfirmed?: boolean;
}
class DocDto { @IsString() @MaxLength(120) name: string; @IsBoolean() done: boolean; }
class SaveDto {
  @IsOptional() @IsIn(['dream', 'target', 'safe', 'none']) group?: string;
  @IsOptional() @IsString() @MaxLength(1000) note?: string;
  @IsOptional() @IsIn(['researching', 'preparing', 'ready', 'submitted', 'interview', 'accepted', 'rejected']) status?: string;
  @IsOptional() @IsString() deadline?: string;
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => DocDto) documents?: DocDto[];
}

@ApiTags('users')
@Controller()
export class UsersController {
  constructor(
    @InjectModel(User.name) private users: Model<User>,
    @InjectModel(SavedUniversity.name) private saved: Model<SavedUniversity>,
    @InjectModel(University.name) private unis: Model<University>,
    @InjectModel(AssessmentAttempt.name) private attempts: Model<AssessmentAttempt>,
    @InjectModel(AssessmentResult.name) private results: Model<AssessmentResult>,
    @InjectModel(Subscription.name) private subs: Model<Subscription>,
  ) {}

  @Patch('users/me')
  async update(@CurrentUser() cu: any, @Body() dto: UpdateMeDto) {
    const set: any = {};
    if (dto.name) set.name = dto.name;
    if (dto.profile) for (const [k, v] of Object.entries(dto.profile)) if (v !== undefined) set[`profile.${k}`] = v;
    const u = await this.users.findByIdAndUpdate(cu.id, { $set: set }, { returnDocument: "after" });
    return { id: String(u!._id), name: u!.name, profile: u!.profile };
  }

  /** Нууцлалын бодлого/нөхцөл зөвшөөрөх. Насанд хүрээгүй бол асран хамгаалагчийн зөвшөөрлийн баталгаа шаардана. */
  @Put('users/me/consent')
  async consent(@CurrentUser() cu: any, @Body() dto: ConsentDto) {
    if (!dto.privacyAccepted || !dto.termsAccepted) throw new BadRequestException({ code: 'CONSENT_REQUIRED', message: 'Нууцлалын бодлого болон үйлчилгээний нөхцөлийг зөвшөөрөх шаардлагатай.' });
    if (dto.isMinor && !dto.parentalConsentConfirmed) throw new BadRequestException({ code: 'PARENTAL_CONSENT_REQUIRED', message: '18 нас хүрээгүй хэрэглэгч эцэг эх/асран хамгаалагчийнхаа зөвшөөрлийг баталгаажуулах шаардлагатай.' });
    const now = new Date();
    await this.users.updateOne({ _id: cu.id }, { $set: { consent: { privacyAcceptedAt: now, termsAcceptedAt: now, isMinor: !!dto.isMinor, parentalConsentConfirmed: !!dto.parentalConsentConfirmed } } });
    return { ok: true };
  }

  /** Бүртгэл болон холбогдох бүх хувийн мэдээллийг устгана. */
  @Delete('users/me') @HttpCode(200)
  async remove(@CurrentUser() cu: any, @Res({ passthrough: true }) res: Response) {
    await Promise.all([
      this.attempts.deleteMany({ userId: cu.id }), this.results.deleteMany({ userId: cu.id }),
      this.saved.deleteMany({ userId: cu.id }), this.subs.deleteMany({ userId: cu.id }), this.users.deleteOne({ _id: cu.id }),
    ]);
    res.clearCookie(ACCESS_COOKIE, { path: '/' });
    res.clearCookie(REFRESH_COOKIE, { path: '/api/v1/auth' });
    return { ok: true };
  }

  @Get('saved/universities')
  async listSaved(@CurrentUser() cu: any) {
    const rows: any[] = await this.saved.find({ userId: cu.id }).sort({ createdAt: -1 }).populate({ path: 'universityId', select: 'slug name nameMn city logoUrl countryId', populate: { path: 'countryId', select: 'nameMn flag slug code' } }).lean();
    return rows.filter((r) => r.universityId).map((r) => ({ id: String(r._id), group: r.group, note: r.note, status: r.status ?? 'researching', deadline: r.deadline ?? null, documents: r.documents ?? [], university: { ...r.universityId, id: String(r.universityId._id), country: r.universityId.countryId } }));
  }

  @Get('saved/universities/ids')
  async savedIds(@CurrentUser() cu: any) {
    return (await this.saved.find({ userId: cu.id }).select('universityId').lean()).map((r) => String(r.universityId));
  }

  @Post('saved/universities/:id') @HttpCode(200)
  async save(@CurrentUser() cu: any, @Param('id') id: string, @Body() dto: SaveDto) {
    if (!(await this.unis.exists({ _id: id }))) throw new NotFoundException({ code: 'NOT_FOUND', message: 'Их сургууль олдсонгүй.' });
    await this.saved.updateOne({ userId: cu.id, universityId: id }, { $set: { ...(dto.group && { group: dto.group }), ...(dto.note !== undefined && { note: dto.note }), ...(dto.status && { status: dto.status }), ...(dto.documents && { documents: dto.documents }), ...(dto.deadline !== undefined && { deadline: dto.deadline ? new Date(dto.deadline) : null }) } }, { upsert: true });
    return { ok: true };
  }

  @Delete('saved/universities/:id') @HttpCode(200)
  async unsave(@CurrentUser() cu: any, @Param('id') id: string) {
    await this.saved.deleteOne({ userId: cu.id, universityId: id });
    return { ok: true };
  }
}

@Module({ controllers: [UsersController] })
export class UsersModule {}
