// Хөгжүүлэлтийн өгөгдлийн санг цэвэрлэж дахин seed хийнэ. Production-д ажиллуулахгүй!
import { config } from 'dotenv';
import mongoose from 'mongoose';
import { seed } from '../src/seed/seed';

config();
(async () => {
  const uri = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/togsogch';
  if (process.env.NODE_ENV === 'production') throw new Error('Production орчинд reset хийхгүй');
  await mongoose.connect(uri);
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  await seed(uri);
})().catch((e) => { console.error(e); process.exit(1); });
