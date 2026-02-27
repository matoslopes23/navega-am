import { PrismaUserRepository } from '@modules/users/infrastructure/repositories/prisma-user.repository';
import type { PrismaService } from '@shared/prisma/prisma.service';

describe('PrismaUserRepository', () => {
  let prisma: {
    user: {
      findUnique: jest.Mock;
      findFirst: jest.Mock;
      create: jest.Mock;
    };
  };
  let repository: PrismaUserRepository;

  beforeEach(() => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
      },
    };

    repository = new PrismaUserRepository(prisma as unknown as PrismaService);
  });

  it('findByEmail calls prisma', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await repository.findByEmail('joao@email.com');

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'joao@email.com' },
    });
  });

  it('findByCpf calls prisma', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await repository.findByCpf('000.000.000-00');

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { cpf: '000.000.000-00' },
    });
  });

  it('findByEmailOrPhone calls prisma', async () => {
    prisma.user.findFirst.mockResolvedValue(null);

    await repository.findByEmailOrPhone('joao@email.com');

    expect(prisma.user.findFirst).toHaveBeenCalledWith({
      where: {
        OR: [{ email: 'joao@email.com' }, { phone: 'joao@email.com' }],
      },
    });
  });

  it('create calls prisma', async () => {
    prisma.user.create.mockResolvedValue({} as never);

    await repository.create({
      name: 'João',
      email: 'joao@email.com',
      phone: '(92) 99999-9999',
      cpf: '000.000.000-00',
      passwordHash: 'hashed',
    });

    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        name: 'João',
        email: 'joao@email.com',
        phone: '(92) 99999-9999',
        cpf: '000.000.000-00',
        passwordHash: 'hashed',
      },
    });
  });
});
