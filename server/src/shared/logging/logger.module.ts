import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { randomUUID } from 'crypto';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            levelFirst: true,
            translateTime: 'SYS:standard',
            singleLine: true,
            ignore: 'pid,hostname',
          },
        },
        genReqId: (request, response) => {
          const existingId = request.headers['x-request-id'];
          if (typeof existingId === 'string') return existingId;
          const id = randomUUID();
          response.setHeader('x-request-id', id);
          return id;
        },
      },
    }),
  ],
  exports: [LoggerModule],
})
export class AppLoggerModule {}
