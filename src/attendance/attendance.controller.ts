import { Controller, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AttendanceService } from './attendance.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { Public } from './auth/is-public.decorator';

@Controller()
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Public()
  @MessagePattern({ cmd: 'attendance.ping' })
  ping(): string {
    return '[Attendance] I am alive.';
  }

  @MessagePattern({ cmd: 'attendance.createClass' })
  createClass(@Payload(new ValidationPipe()) data: CreateClassDto) {
    return this.attendanceService.createClass(data);
  }

  @MessagePattern({ cmd: 'attendance.getClass' })
  getClass(@Payload() data: { key: string }) {
    return this.attendanceService.getClass(data.key);
  }

  @MessagePattern({ cmd: 'attendance.listClasses' })
  listClasses() {
    return this.attendanceService.listClasses();
  }

  @MessagePattern({ cmd: 'attendance.updateClass' })
  updateClass(@Payload(new ValidationPipe()) data: UpdateClassDto & { key: string }) {
    const { key, ...rest } = data;
    return this.attendanceService.updateClass(key, rest);
  }
}