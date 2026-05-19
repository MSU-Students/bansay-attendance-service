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

  @MessagePattern({ cmd: 'attendance.createMeeting' })
  createMeeting(data: {
    classKey: string;
    date: string;
    teacher: string;
    location?: { lat: number; lng: number };
  }) {
    return this.attendanceService.createMeeting(data);
  }

  @MessagePattern({ cmd: 'attendance.getMeeting' })
  getMeeting(data: { key: string }) {
    return this.attendanceService.getMeeting(data.key);
  }

  @MessagePattern({ cmd: 'attendance.listMeetings' })
  listMeetings(data: { classKey?: string }) {
    return this.attendanceService.listMeetings(data?.classKey);
  }

  @MessagePattern({ cmd: 'attendance.updateMeeting' })
  updateMeeting(data: {
    key: string;
    status?: 'open' | 'cancelled' | 'concluded';
    location?: { lat: number; lng: number };
  }) {
    return this.attendanceService.updateMeeting(data.key, data);
  }
}
