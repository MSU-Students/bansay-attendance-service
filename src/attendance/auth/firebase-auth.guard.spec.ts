import { Reflector } from '@nestjs/core';
import { RpcException } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { FirebaseService } from '../firebase/firebase.service';
import { FirebaseAuthGuard } from './firebase-auth.guard';

const mockDecodedUser = {
  uid: 'abc123',
  email: 'juan@msu.edu',
  email_verified: true,
  name: 'Juan',
};

describe('FirebaseAuthGuard', () => {
  let guard: FirebaseAuthGuard;
  let firebaseService: FirebaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FirebaseAuthGuard,
        {
          provide: FirebaseService,
          useValue: {
            verifyToken: jest.fn(),
          },
        },
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<FirebaseAuthGuard>(FirebaseAuthGuard);
    firebaseService = module.get<FirebaseService>(FirebaseService);
  });

  const mockRpcContext = (data?: Record<string, unknown>) =>
    ({
      switchToRpc: () => ({
        getData: () => data ?? {},
      }),
      getHandler: () => null,
      getClass: () => null,
    }) as any;

  it('should allow public handlers without token', async () => {
    const reflector = (guard as any).reflector as Reflector;
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);

    const result = await guard.canActivate(mockRpcContext());

    expect(result).toBe(true);
  });

  it('should throw RpcException when no token is provided', async () => {
    jest.spyOn(Reflector.prototype, 'getAllAndOverride').mockReturnValue(false);

    await expect(guard.canActivate(mockRpcContext({}))).rejects.toThrow(
      RpcException,
    );
  });

  it('should throw RpcException when token validation fails', async () => {
    jest.spyOn(Reflector.prototype, 'getAllAndOverride').mockReturnValue(false);
    jest
      .spyOn(firebaseService, 'verifyToken')
      .mockRejectedValue(new Error('invalid token'));

    await expect(
      guard.canActivate(mockRpcContext({ token: 'bad-token' })),
    ).rejects.toThrow(RpcException);
  });

  it('should attach decoded user to data and return true on valid token', async () => {
    jest.spyOn(Reflector.prototype, 'getAllAndOverride').mockReturnValue(false);
    jest
      .spyOn(firebaseService, 'verifyToken')
      .mockResolvedValue(mockDecodedUser as any);

    const data: Record<string, unknown> = { token: 'valid-token' };
    const context = mockRpcContext(data);

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(data.__user).toEqual(mockDecodedUser);
  });
});
