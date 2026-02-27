import { User } from '@modules/users/domain/user';

type CreateUserInput = {
  name: string;
  email: string;
  phone?: string | null;
  cpf: string;
  passwordHash: string;
};

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  findByCpf(cpf: string): Promise<User | null>;
  findByEmailOrPhone(identifier: string): Promise<User | null>;
  create(data: CreateUserInput): Promise<User>;
}
