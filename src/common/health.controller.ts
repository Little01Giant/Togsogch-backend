import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectConnection } from '@nestjs/mongoose';
import { SkipThrottle } from '@nestjs/throttler';
import { Connection } from 'mongoose';
import { Public } from './guards/auth';

/** Uptime monitor / load balancer-д: сервер ба MongoDB амьд эсэх. Нууц, тохиргоо гаргахгүй. */
@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(@InjectConnection() private conn: Connection) {}

  @Public() @SkipThrottle() @Get()
  async health() {
    try {
      if (this.conn.readyState !== 1) throw new Error('db not connected');
      await this.conn.db!.admin().ping();
    } catch {
      throw new ServiceUnavailableException({ code: 'UNHEALTHY', message: 'Үйлчилгээ бэлэн биш байна.' });
    }
    return { status: 'ok' };
  }
}
