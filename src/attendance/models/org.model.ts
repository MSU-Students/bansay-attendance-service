import { BaseEntity } from './base.model';
import { QAttendanceUser } from './user.model';

export interface QAttendanceOrg extends BaseEntity {
  name: string;
  description?: string;
  logoUrl?: string;
  orgCode: string;
  parentOrgCode?: string;
  parentOrg?: QAttendanceOrg;
  officers?: QAttendanceUser[];
  members?: QAttendanceUser[];
}
