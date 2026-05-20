import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AttendanceModule } from './attendance/attendance.module';
import { AllExceptionsFilter } from './common/filters/rpc-exception.filter';

@Module({
  imports: [AttendanceModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
