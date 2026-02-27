export type LoginResult = {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    cpf: string;
  };
};
