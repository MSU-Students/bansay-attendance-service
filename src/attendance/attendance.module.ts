import { Module } from '@nestjs/common';
import { AttendanceController } from './attendance.controller';
import { FirebaseModule } from './firebase/firebase.module';

@Module({
  imports: [FirebaseModule],
  controllers: [AttendanceController],
})
export class AttendanceModule {}
