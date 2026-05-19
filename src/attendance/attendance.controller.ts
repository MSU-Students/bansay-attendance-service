import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AttendanceService } from './attendance.service';

@Controller()
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @MessagePattern({ cmd: 'attendance.ping' })
  ping(): string {
    return '[Attendance] I am alive.';
  }

  @MessagePattern({ cmd: 'attendance.createClass' })
  createClass(data: {
    name: string;
    description?: string;
    schedule?: string;
    room?: string;
    classCode: string;
    section: string;
    academicYear: string;
    teachers?: string[];
  }) {
    return this.attendanceService.createClass(data);
  }

  @MessagePattern({ cmd: 'attendance.getClass' })
  getClass(data: { key: string }) {
    return this.attendanceService.getClass(data.key);
  }

  @MessagePattern({ cmd: 'attendance.listClasses' })
  listClasses() {
    return this.attendanceService.listClasses();
  }

  @MessagePattern({ cmd: 'attendance.updateClass' })
  updateClass(data: {
    key: string;
    name?: string;
    description?: string;
    schedule?: string;
    room?: string;
    section?: string;
    academicYear?: string;
  }) {
    return this.attendanceService.updateClass(data.key, data);
  }
}
