import { Injectable } from '@nestjs/common';
import { FirebaseService } from './firebase/firebase.service';
import * as admin from 'firebase-admin';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

@Injectable()
export class AttendanceService {
  constructor(private readonly firebase: FirebaseService) {}

  private get db(): admin.firestore.Firestore {
    return this.firebase.getFirestore();
  }

  private now(): string {
    return new Date().toISOString();
  }

  async createClass(data: CreateClassDto) {
    const doc = this.db.collection('classes').doc();
    const classData = {
      key: doc.id,
      name: data.name,
      description: data.description || '',
      schedule: data.schedule || '',
      room: data.room || '',
      classCode: data.classCode,
      section: data.section,
      academicYear: data.academicYear,
      teachers: data.teachers || [],
      enrolled: [],
      createdAt: this.now(),
      updatedAt: this.now(),
    };
    await doc.set(classData);
    return classData;
  }

  async getClass(key: string) {
    return this.firebase.getRecord('classes', key);
  }

  async listClasses() {
    return this.firebase.findRecords('classes');
  }

  async updateClass(
    key: string,
    data: UpdateClassDto,
  ) {
    const updateData: Record<string, unknown> = { updatedAt: this.now() };
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.schedule !== undefined) updateData.schedule = data.schedule;
    if (data.room !== undefined) updateData.room = data.room;
    if (data.section !== undefined) updateData.section = data.section;
    if (data.academicYear !== undefined) updateData.academicYear = data.academicYear;
    await this.db.collection('classes').doc(key).update(updateData);
    return this.firebase.getRecord('classes', key);
  }
}
