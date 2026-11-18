import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MODELS } from './index';

/** Бүх модельд глобал хандах боломж (бүх модуль @InjectModel ашиглана). */
@Global()
@Module({ imports: [MongooseModule.forFeature(MODELS)], exports: [MongooseModule] })
export class DbModule {}
