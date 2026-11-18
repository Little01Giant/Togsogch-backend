import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';

/** Бүх алдааг {statusCode, code, message(Монгол), details} хэлбэрт оруулна. */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly log = new Logger('Exception');

  catch(e: any, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Серверийн алдаа гарлаа. Дахин оролдоно уу.';
    let code = 'INTERNAL_ERROR';
    let details: any;

    if (e instanceof HttpException) {
      status = e.getStatus();
      const r: any = e.getResponse();
      code = r?.code ?? (status === 401 ? 'UNAUTHORIZED' : status === 403 ? 'FORBIDDEN' : status === 404 ? 'NOT_FOUND' : status === 429 ? 'RATE_LIMITED' : 'BAD_REQUEST');
      if (Array.isArray(r?.message)) {
        message = 'Оруулсан мэдээлэл буруу байна.';
        details = r.message;
        code = 'VALIDATION_ERROR';
      } else if (status === 429) message = 'Хэт олон хүсэлт илгээлээ. Түр хүлээгээд дахин оролдоно уу.';
      else message = typeof r === 'string' ? r : r?.message ?? e.message;
    } else if (e?.name === 'ValidationError' && e.errors) {
      status = 400;
      code = 'VALIDATION_ERROR';
      message = 'Оруулсан мэдээлэл буруу байна.';
      details = Object.values(e.errors).map((x: any) => `${x.path}: ${x.message}`);
    } else if (e?.code === 11000) {
      status = 409;
      code = 'DUPLICATE';
      message = 'Ийм утгатай бичлэг аль хэдийн байна.';
      details = Object.keys(e.keyValue ?? {});
    } else if (e?.name === 'CastError') {
      status = 400;
      code = 'INVALID_ID';
      message = 'Буруу танигч (ID) өгсөн байна.';
    } else {
      this.log.error(e?.stack ?? String(e));
    }
    res.status(status).json({ statusCode: status, code, message, details });
  }
}
