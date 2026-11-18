import { Prop, Schema } from '@nestjs/mongoose';

export const SOURCE_TYPES = ['official_university', 'official_admission', 'ranking_provider', 'government', 'scholarship_org', 'exam_provider', 'labor_research', 'other'] as const;
export const VERIFICATION_STATUSES = ['unverified', 'in_review', 'verified', 'outdated'] as const;
export const RELIABILITY = ['primary', 'secondary', 'estimate', 'unknown'] as const;

/** Баталгаажуулах шаардлагатай бүх баримтад ашиглах эх сурвалжийн мэдээлэл. */
@Schema({ _id: false })
export class SourceInfo {
  @Prop() sourceName?: string;
  @Prop() sourceUrl?: string;
  @Prop({ enum: SOURCE_TYPES }) sourceType?: string;
  @Prop() fetchedAt?: Date;
  @Prop() verifiedAt?: Date;
  @Prop() lastUpdatedAt?: Date;
  @Prop() academicYear?: string;
  @Prop({ enum: RELIABILITY, default: 'unknown' }) reliabilityStatus?: string;
  @Prop({ enum: VERIFICATION_STATUSES, default: 'unverified' }) verificationStatus?: string;
  @Prop() verifiedBy?: string;
}
