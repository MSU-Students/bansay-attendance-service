import { BaseEntity } from './base.model';
import { QAttendanceUser, StudentUser } from './user.model';

export interface StudentEnrollment extends StudentUser {
  reportStatus?: 'perfect' | 'good' | 'warning' | 'critical' | 'drop';
  totalAbsences?: number;
  consecutiveAbsences?: number;
  totalTardiness?: number;
}

export interface QAttendanceClass extends BaseEntity {
  name: string;
  description?: string;
  schedule?: string;
  room?: string;
  classCode: string;
  teachers?: QAttendanceUser[];
  section: string;
  academicYear: string;
  enrolled?: StudentEnrollment[];
}
