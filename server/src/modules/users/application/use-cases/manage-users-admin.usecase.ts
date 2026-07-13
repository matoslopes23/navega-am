import { Inject, Injectable } from '@nestjs/common';
import type { UserManagementRepository } from '../ports/user-management.repository';
import { USER_MANAGEMENT_REPOSITORY } from '../../users.tokens';

@Injectable()
export class ManageUsersAdminUseCase {
  constructor(
    @Inject(USER_MANAGEMENT_REPOSITORY)
    private readonly users: UserManagementRepository,
  ) {}

  list(page: number) {
    return this.users.list(page);
  }

  changeRole(id: string, role: 'USER' | 'ADMIN', actorId: string) {
    return this.users.changeRole(id, role, actorId);
  }

  audits() {
    return this.users.listAuditLogs();
  }
}
