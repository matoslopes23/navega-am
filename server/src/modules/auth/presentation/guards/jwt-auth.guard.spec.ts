import { UnauthorizedException } from '@nestjs/common';
import type { ExecutionContext } from '@nestjs/common';
import type { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  const request: { headers: { authorization?: string }; user?: unknown } = {
    headers: {},
  };
  const context = {
    switchToHttp: () => ({ getRequest: () => request }),
  } as ExecutionContext;
  const jwtService = { verifyAsync: jest.fn() };
  const guard = new JwtAuthGuard(jwtService as unknown as JwtService);

  beforeEach(() => {
    request.headers = {};
    delete request.user;
    jest.clearAllMocks();
  });

  it('rejects requests without a bearer token', async () => {
    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('attaches a verified user to the request', async () => {
    const user = { sub: 'user-1', email: 'user@example.com', role: 'USER' };
    request.headers.authorization = 'Bearer valid-token';
    jwtService.verifyAsync.mockResolvedValue(user);

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(request.user).toEqual(user);
  });
});
