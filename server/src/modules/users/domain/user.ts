export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  cpf: string;
  passwordHash: string;
  role: 'USER' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
};
