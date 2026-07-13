import { Module } from '@nestjs/common';
import { AuthModule } from '@modules/auth/auth.module';
import { NotificationService } from './application/notification.service';
import { NotificationController } from './presentation/notification.controller';

@Module({
  imports: [AuthModule],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationsModule {}
