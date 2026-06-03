import { BaseEntity } from './base.model';

export interface RecordKeeping extends BaseEntity {
  teaching: string[];
  archivedTeaching: string[];
  enrolled: string[];
  archivedEnrolled: string[];
  memberships: string[];
  archivedMemberships: string[];
}
