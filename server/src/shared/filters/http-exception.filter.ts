import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const prismaStatus =
      exception instanceof Prisma.PrismaClientKnownRequestError
        ? exception.code === 'P2002'
          ? HttpStatus.CONFLICT
          : exception.code === 'P2025'
            ? HttpStatus.NOT_FOUND
            : undefined
        : undefined;
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : (prismaStatus ?? HttpStatus.INTERNAL_SERVER_ERROR);

    const httpResponse =
      exception instanceof HttpException ? exception.getResponse() : undefined;
    const message =
      prismaStatus === HttpStatus.CONFLICT
        ? 'Registro já cadastrado.'
        : prismaStatus === HttpStatus.NOT_FOUND
          ? 'Registro não encontrado.'
          : typeof httpResponse === 'string'
            ? httpResponse
            : httpResponse &&
                typeof httpResponse === 'object' &&
                'message' in httpResponse
              ? httpResponse.message
              : 'Erro interno do servidor.';

    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
