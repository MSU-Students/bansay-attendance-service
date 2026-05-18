import { ClassMeeting, MeetingCheckIn } from './attendance.model';
import { QAttendanceClass, StudentEnrollment } from './class.model';
import { OrgEvent } from './attendance.model';
import { QAttendanceOrg } from './org.model';
import { RecordKeeping } from './record-keeping.model';
import { QAttendanceUser } from './user.model';

export type CollectionTypes = {
  users: QAttendanceUser;
  classes: QAttendanceClass;
  teachers: QAttendanceUser;
  enrolled: StudentEnrollment;
  meetings: ClassMeeting;
  'check-ins': MeetingCheckIn;
  'class-keepings': RecordKeeping;
  organizations: QAttendanceOrg;
  officers: QAttendanceUser;
  members: QAttendanceUser;
  'org-events': OrgEvent;
  confirmations: MeetingCheckIn;
};

export type CollectionName = keyof CollectionTypes;
