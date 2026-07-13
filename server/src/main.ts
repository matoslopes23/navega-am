import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { AppModule } from '@app/app.module';
import { HttpExceptionFilter } from '@shared/filters/http-exception.filter';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));
  const configService = app.get(ConfigService);
  const corsOrigins = configService
    .get<string>('CORS_ORIGINS', '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  app.enableCors({ origin: corsOrigins, credentials: true });
  app.enableShutdownHooks();
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  if (configService.get<boolean>('SWAGGER_ENABLED')) {
    const config = new DocumentBuilder()
      .setTitle('Navega API')
      .setDescription(
        'API oficial do Navega AM para consulta de viagens, rastreamento colaborativo em tempo real, relatos, notificações e operação administrativa. Consulte também os guias em /docs na raiz do repositório.',
      )
      .setVersion('1.0.0')
      .addServer('http://localhost:3000', 'Desenvolvimento local')
      .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Token retornado por POST /auth/login ou /auth/register.',
      })
      .addTag('System', 'Identificação do serviço')
      .addTag('Health', 'Saúde e métricas básicas da API')
      .addTag('Home', 'Dados consolidados para a tela inicial')
      .addTag('Auth', 'Cadastro e autenticação')
      .addTag('Users', 'Perfil, consentimento e privacidade')
      .addTag('Trips', 'Busca, detalhes e viagens ativas')
      .addTag('Tracking', 'Compartilhamento e telemetria GPS')
      .addTag('Trip reports', 'Relatos colaborativos e moderação')
      .addTag('Notifications', 'Alertas e dispositivos push')
      .addTag('Operations', 'Portos, rotas e administração')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }
  await app.listen(configService.get<number>('PORT', 3000));
}
void bootstrap();
