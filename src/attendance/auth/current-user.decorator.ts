import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as admin from 'firebase-admin';

export const resolveCurrentUser = (
  _data: unknown,
  ctx: ExecutionContext,
): admin.auth.DecodedIdToken | undefined => {
  return ctx.switchToRpc().getData<Record<string, unknown>>()
    ?.__user as admin.auth.DecodedIdToken | undefined;
};

export const CurrentUser = createParamDecorator(resolveCurrentUser);
