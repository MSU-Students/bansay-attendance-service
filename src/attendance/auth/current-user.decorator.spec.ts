import { RpcArgumentsHost } from '@nestjs/common/interfaces';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { resolveCurrentUser } from './current-user.decorator';

describe('resolveCurrentUser', () => {
  const mockDecodedUser = {
    uid: 'abc123',
    email: 'juan@msu.edu',
  };

  const createContext = (data?: Record<string, unknown>) => {
    const rpcHost: RpcArgumentsHost = {
      getData: () => data ?? {},
      getContext: () => ({}),
    };
    return new ExecutionContextHost(
      [data ?? {}],
      undefined,
      undefined,
      undefined,
      rpcHost,
    );
  };

  it('should return the user from __user in the RPC data', () => {
    const ctx = createContext({ __user: mockDecodedUser });
    const result = resolveCurrentUser({}, ctx);

    expect(result).toEqual(mockDecodedUser);
  });

  it('should return undefined when __user is not set', () => {
    const ctx = createContext({ someField: 'value' });
    const result = resolveCurrentUser({}, ctx);

    expect(result).toBeUndefined();
  });

  it('should return undefined when data is empty', () => {
    const ctx = createContext({});
    const result = resolveCurrentUser({}, ctx);

    expect(result).toBeUndefined();
  });
});
