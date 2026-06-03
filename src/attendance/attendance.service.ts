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

  async ping(): Promise<Record<string, string>> {
    try {
      await this.db.listCollections();
      return { status: 'ok', firestore: 'connected', timestamp: new Date().toISOString() };
    } catch {
      return { status: 'degraded', firestore: 'disconnected', timestamp: new Date().toISOString() };
    }
  }
  
  // --- Class CRUD Methods (Using Your Clean DTOs) ---
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

  async updateClass(key: string, data: UpdateClassDto) {
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

  // --- Meeting Methods (Safely Preserving Teammate's Firebase Logic) ---
  async createMeeting(data: {
    classKey: string;
    date: string;
    teacher: string;
    location?: { lat: number; lng: number };
  }) {
    const doc = this.db.collection('meetings').doc();
    const meetingData = {
      key: doc.id,
      classKey: data.classKey,
      date: data.date,
      status: 'open',
      teacher: data.teacher,
      location: data.location || null,
      checkIns: [],
      latestCheckIn: '',
      latestCall: '',
      checkInCount: 0,
      createdAt: this.now(),
      updatedAt: this.now(),
    };
    await doc.set(meetingData);
    return meetingData;
  }

  async getMeeting(key: string) {
    return this.firebase.getRecord('meetings', key);
  }

  async listMeetings(classKey?: string) {
    if (classKey) {
      return this.firebase.findRecords('meetings', { classKey });
    }
    return this.firebase.findRecords('meetings');
  }

  async updateMeeting(
    key: string,
    data: {
      status?: 'open' | 'cancelled' | 'concluded';
      location?: { lat: number; lng: number };
    },
  ) {
    const updateData: Record<string, unknown> = { updatedAt: this.now() };
    if (data.status !== undefined) updateData.status = data.status;
    if (data.location !== undefined) updateData.location = data.location;
    await this.db.collection('meetings').doc(key).update(updateData);
    return this.firebase.getRecord('meetings', key);
  }
}