import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RpcException } from '@nestjs/microservices';
import { FirebaseService } from '../firebase/firebase.service';
import { IS_PUBLIC_KEY } from './is-public.decorator';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const data = context.switchToRpc().getData();
    const token = data?.token;

    if (!token) {
      throw new RpcException('Unauthorized');
    }

    try {
      const user = await this.firebaseService.verifyToken(token);
      data.__user = user;
      return true;
    } catch {
      throw new RpcException('Unauthorized');
    }
  }
}
