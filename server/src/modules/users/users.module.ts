import { forwardRef, Module } from '@nestjs/common';

import { PrismaUserRepository } from '@modules/users/infrastructure/repositories/prisma-user.repository';
import {
  USER_MANAGEMENT_REPOSITORY,
  USER_REPOSITORY,
} from '@modules/users/users.tokens';
import { AuthModule } from '@modules/auth/auth.module';
import { UserProfileController } from './presentation/user-profile.controller';
import { AdminUsersController } from './presentation/admin-users.controller';
import { ManageUserProfileUseCase } from './application/use-cases/manage-user-profile.usecase';
import { ManageUsersAdminUseCase } from './application/use-cases/manage-users-admin.usecase';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [UserProfileController, AdminUsersController],
  providers: [
    ManageUserProfileUseCase,
    ManageUsersAdminUseCase,
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
    {
      provide: USER_MANAGEMENT_REPOSITORY,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [USER_REPOSITORY, USER_MANAGEMENT_REPOSITORY],
})
export class UsersModule {}
