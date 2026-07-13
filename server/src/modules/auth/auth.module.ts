import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { AuthController } from '@modules/auth/presentation/auth.controller';
import { LoginUserUseCase } from '@modules/auth/application/use-cases/login-user.usecase';
import { RegisterUserUseCase } from '@modules/auth/application/use-cases/register-user.usecase';
import { UsersModule } from '@modules/users/users.module';
import { JwtAuthGuard } from './presentation/guards/jwt-auth.guard';
import { RolesGuard } from './presentation/guards/roles.guard';
import { RateLimitGuard } from '@shared/guards/rate-limit.guard';
import { RequestPasswordResetUseCase } from './application/use-cases/request-password-reset.usecase';
import { ResetPasswordUseCase } from './application/use-cases/reset-password.usecase';
import { PASSWORD_RESET_DELIVERY } from './auth.tokens';
import { PasswordResetDeliveryAdapter } from './infrastructure/password-reset-delivery.adapter';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    RegisterUserUseCase,
    LoginUserUseCase,
    RequestPasswordResetUseCase,
    ResetPasswordUseCase,
    JwtAuthGuard,
    RolesGuard,
    RateLimitGuard,
    {
      provide: PASSWORD_RESET_DELIVERY,
      useClass: PasswordResetDeliveryAdapter,
    },
  ],
  exports: [JwtModule, JwtAuthGuard, RolesGuard],
})
export class AuthModule {}
