import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AttendanceController } from './attendance.controller';
import { AuthModule } from './auth/auth.module';
import { FirebaseAuthGuard } from './auth/firebase-auth.guard';
import { FirebaseModule } from './firebase/firebase.module';

@Module({
  imports: [FirebaseModule, AuthModule],
  controllers: [AttendanceController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: FirebaseAuthGuard,
    },
  ],
})
export class AttendanceModule {}
