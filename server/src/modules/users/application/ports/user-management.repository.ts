import type { User } from '../../domain/user';

export interface UserManagementRepository {
  findById(id: string): Promise<User | null>;
  getProfile(id: string): Promise<unknown>;
  updateProfile(
    id: string,
    data: { name?: string; phone?: string },
  ): Promise<unknown>;
  updateLocationConsent(
    id: string,
    consent: boolean,
    at: Date,
  ): Promise<unknown>;
  exportData(id: string): Promise<unknown>;
  updatePassword(id: string, passwordHash: string): Promise<void>;
  delete(id: string): Promise<void>;
  list(page: number): Promise<unknown[]>;
  changeRole(
    id: string,
    role: 'USER' | 'ADMIN',
    actorId: string,
  ): Promise<unknown>;
  listAuditLogs(): Promise<unknown[]>;
}
