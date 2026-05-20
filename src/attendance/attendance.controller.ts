import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Public } from './auth/is-public.decorator';

@Controller()
export class AttendanceController {
  @Public()
  @MessagePattern({ cmd: 'attendance.ping' })
  ping(): string {
    return '[Attendance] I am alive.';
  }
}
