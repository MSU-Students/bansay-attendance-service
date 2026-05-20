import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { FirebaseService } from './firebase/firebase.service';

@Controller()
export class AttendanceController {
  constructor(private readonly firebaseService: FirebaseService) {}

  @MessagePattern({ cmd: 'attendance.ping' })
  async ping(): Promise<Record<string, string>> {
    try {
      await this.firebaseService.getFirestore().listCollections();
      return { status: 'ok', firestore: 'connected', timestamp: new Date().toISOString() };
    } catch {
      return { status: 'degraded', firestore: 'disconnected', timestamp: new Date().toISOString() };
    }
  }
}
