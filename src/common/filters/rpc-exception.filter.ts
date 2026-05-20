import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const message =
      exception instanceof RpcException
        ? exception.getError()
        : exception instanceof Error
          ? exception.message
          : 'Internal server error';

    return {
      status: 'error',
      message: typeof message === 'string' ? message : 'Internal server error',
      timestamp: new Date().toISOString(),
    };
  }
}
