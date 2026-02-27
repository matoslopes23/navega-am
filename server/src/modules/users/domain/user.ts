export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  cpf: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
};
