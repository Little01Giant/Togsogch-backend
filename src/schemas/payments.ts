import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, SchemaTypes } from 'mongoose';

const T = { timestamps: true } as const;

/** Төлбөртэй бүтээгдэхүүний каталог. Үнийг Админ тохируулна. */
@Schema(T)
export class PaymentProduct {
  @Prop({ required: true, unique: true }) key: string; // premium_report | premium_roadmap | premium_comparison
  @Prop({ required: true }) title: string;
  @Prop() description?: string;
  @Prop({ required: true, min: 1 }) priceMnt: number;
  /** attempt: тодорхой тестийн үр дүнд; user: бүх бүртгэлд; university: нэг сургуулийн төлбөртэй мэдээлэлд; country: тухайн улсын бүх сургуульд */
  @Prop({ required: true, enum: ['attempt', 'user', 'university', 'country'] }) scope: string;
  @Prop({ default: true }) active: boolean;
}
export const PaymentProductSchema = SchemaFactory.createForClass(PaymentProduct);

@Schema(T)
export class Payment {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true, index: true }) userId: Types.ObjectId;
  @Prop({ required: true, index: true }) productKey: string;
  @Prop({ type: SchemaTypes.ObjectId }) targetId?: Types.ObjectId;
  @Prop({ required: true }) amount: number;
  @Prop({ default: 'MNT' }) currency: string;
  @Prop({ enum: ['pending', 'paid', 'failed', 'expired', 'cancelled'], default: 'pending', index: true }) status: string;
  @Prop({ required: true, unique: true }) senderInvoiceNo: string; // манай дугаар (QPay-д sender_invoice_no)
  @Prop({ required: true, unique: true }) callbackToken: string; // таашгүй token; callback зөвхөн сервер талын шалгалтыг эхлүүлнэ
  @Prop({ index: true }) idempotencyKey?: string;
  @Prop() provider: string;
  @Prop() qpayInvoiceId?: string;
  @Prop() qpayPaymentId?: string;
  @Prop({ select: false }) qrText?: string;
  @Prop({ select: false }) qrImage?: string;
  @Prop() shortUrl?: string;
  @Prop({ type: [{ name: String, description: String, logo: String, link: String, _id: false }], default: [] }) urls: any[];
  @Prop({ required: true }) expiresAt: Date;
  @Prop() paidAt?: Date;
  @Prop() paidAmount?: number;
  /** QPay-аас сүүлд асуусан цаг (QPay давтан шалгахыг хориглодог тул хязгаарлахад ашиглана) */
  @Prop() lastCheckedAt?: Date;
  /** Mock provider-ийн төлөв (зөвхөн хөгжүүлэлт) */
  @Prop() mockPaidAmount?: number;
  /** Төлбөрийн лог (төрөл, цаг) — нууц мэдээлэл хадгалахгүй */
  @Prop({ type: [{ at: Date, event: String, detail: String, _id: false }], default: [] }) logs: { at: Date; event: string; detail?: string }[];
}
export const PaymentSchema = SchemaFactory.createForClass(Payment);
PaymentSchema.index({ userId: 1, idempotencyKey: 1 }, { unique: true, partialFilterExpression: { idempotencyKey: { $type: 'string' } } });
PaymentSchema.index({ createdAt: -1 });

/** Худалдан авсан эрх (subscription/entitlement). Нэг төлбөрөөс нэг л эрх. */
@Schema(T)
export class Subscription {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true }) userId: Types.ObjectId;
  @Prop({ required: true }) productKey: string;
  /** user-scope бол null; attempt-scope бол attemptId; university-scope бол universityId; country-scope бол countryId */
  @Prop({ type: SchemaTypes.ObjectId, default: null }) targetId: Types.ObjectId | null;
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Payment', required: true, unique: true }) paymentId: Types.ObjectId;
  @Prop() expiresAt?: Date;
}
export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
SubscriptionSchema.index({ userId: 1, productKey: 1, targetId: 1 }, { unique: true });

export const PAYMENT_MODELS = [
  { name: PaymentProduct.name, schema: PaymentProductSchema },
  { name: Payment.name, schema: PaymentSchema },
  { name: Subscription.name, schema: SubscriptionSchema },
];
