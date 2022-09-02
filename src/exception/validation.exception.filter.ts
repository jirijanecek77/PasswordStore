import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(BadRequestException)
export class HttpExceptionFilter implements ExceptionFilter {
  public catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      errorCode: 'validation.failed',
      message:
        'Request validation failed. Please see data for additional information.',
      data: exception.getResponse(),
    });
  }
}
