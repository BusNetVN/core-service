import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { ErrorMessage } from '../constants/error-message.constant.js';

type ExceptionBody = {
  statusCode: number;
  message: string | string[];
  error?: string;
  timestamp: string;
  path: string;
};

@Catch()
@Injectable()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const response = http.getResponse<Response>();
    const request = http.getRequest<Request>();
    const body = this.toBody(exception, request);

    if (body.statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `${request.method} ${request.originalUrl} ${body.statusCode}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    }

    response.status(body.statusCode).json(body);
  }

  private toBody(exception: unknown, request: Request): ExceptionBody {
    const timestamp = new Date().toISOString();
    const path = request.originalUrl ?? request.url;

    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const payload = exception.getResponse();

      if (typeof payload === 'string') {
        return {
          statusCode,
          message: payload,
          timestamp,
          path,
        };
      }

      if (payload && typeof payload === 'object') {
        const record = payload as {
          message?: string | string[];
          error?: string;
          statusCode?: number;
        };

        return {
          statusCode,
          message: record.message ?? exception.message,
          error: record.error,
          timestamp,
          path,
        };
      }
    }

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: ErrorMessage.INTERNAL_ERROR,
      error: 'Internal Server Error',
      timestamp,
      path,
    };
  }
}
