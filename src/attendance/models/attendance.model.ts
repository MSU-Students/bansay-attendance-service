import { BaseEntity } from './base.model';

export interface CheckInComment extends BaseEntity {
  msg: string;
  from: string;
  date: string;
}

export interface MeetingCheckIn extends BaseEntity {
  checkInTime: string;
  status: 'check-in' | 'absent' | 'late' | 'present' | 'excused';
  markedInTime?: string;
  comments?: CheckInComment[];
  validation?: {
    status: 'valid' | 'invalid' | 'unverified';
    reason?: string;
  };
  location?: { lat: number; lng: number };
  validationHistory?: {
    status: 'valid' | 'invalid' | 'unverified';
    reason?: string;
    by?: string;
    date: string;
  }[];
}

export interface ClassMeeting extends BaseEntity {
  classKey: string;
  date: string;
  status: 'open' | 'cancelled' | 'concluded';
  teacher: string;
  location?: { lat: number; lng: number };
  checkIns?: MeetingCheckIn[];
  latestCheckIn?: string;
  latestCall?: string;
  checkInCount?: number;
}

export interface OrgEvent extends BaseEntity {
  orgKey: string;
  date: string;
  status: 'open' | 'cancelled' | 'concluded';
  organizer: string;
  confirmations?: MeetingCheckIn[];
  latestConfirmation?: string;
  confirmationCount?: number;
}
