import { BaseEntity } from './base.model';

interface UserBase extends BaseEntity {
  ownerKey: string;
  fullName: string;
  email: string;
  emailVerified?: boolean;
  avatar?: string;
  dateRegistered?: string;
  status?: 'active' | 'inactive' | 'pending';
}

export interface TeacherUser extends UserBase {
  role: 'teacher';
}

export interface AdminUser extends UserBase {
  role: 'admin';
}

export interface SupervisorUser extends UserBase {
  role: 'supervisor';
}

export interface StudentUser extends UserBase {
  role: 'student';
  course?: string;
  contact?: string;
  studentId?: string;
}

export type QAttendanceUser = TeacherUser | AdminUser | SupervisorUser | StudentUser;
