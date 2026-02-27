import { Module } from '@nestjs/common';

import { PrismaUserRepository } from '@modules/users/infrastructure/repositories/prisma-user.repository';
import { USER_REPOSITORY } from '@modules/users/users.tokens';

@Module({
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [USER_REPOSITORY],
})
export class UsersModule {}
