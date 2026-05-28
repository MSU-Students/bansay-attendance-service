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

  // --- Class Management Endpoints (Validated via DTOs) ---
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

  // --- Meeting Management Endpoints (From branch feat/attendance-meetings) ---
  @MessagePattern({ cmd: 'attendance.createMeeting' })
  createMeeting(@Payload() data: {
    classKey: string;
    date: string;
    teacher: string;
    location?: { lat: number; lng: number };
  }) {
    return this.attendanceService.createMeeting(data);
  }

  @MessagePattern({ cmd: 'attendance.getMeeting' })
  getMeeting(@Payload() data: { key: string }) {
    return this.attendanceService.getMeeting(data.key);
  }

  @MessagePattern({ cmd: 'attendance.listMeetings' })
  listMeetings(@Payload() data: { classKey?: string }) {
    return this.attendanceService.listMeetings(data?.classKey);
  }

  @MessagePattern({ cmd: 'attendance.updateMeeting' })
  updateMeeting(@Payload() data: {
    key: string;
    status?: 'open' | 'cancelled' | 'concluded';
    location?: { lat: number; lng: number };
  }) {
    return this.attendanceService.updateMeeting(data.key, data);
  }
}