import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { CollectionName, CollectionTypes } from '../models/collection.type';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private db: admin.firestore.Firestore;

  onModuleInit() {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: 'msu-attendance',
      });
    }
    this.db = admin.firestore();
  }

  async getRecord<T extends CollectionName>(
    collection: T,
    key: string,
  ): Promise<CollectionTypes[T] | null> {
    const doc = await this.db.collection(collection).doc(key).get();
    if (!doc.exists) return null;
    return { key: doc.id, ...doc.data() } as CollectionTypes[T];
  }

  async findRecords<T extends CollectionName>(
    collection: T,
    filters?: Record<string, string>,
  ): Promise<CollectionTypes[T][]> {
    let query: admin.firestore.Query = this.db.collection(collection);
    if (filters) {
      for (const [field, value] of Object.entries(filters)) {
        query = query.where(field, '==', value);
      }
    }
    const snapshot = await query.get();
    return snapshot.docs.map(
      (doc) => ({ key: doc.id, ...doc.data() }) as CollectionTypes[T],
    );
  }

  getFirestore(): admin.firestore.Firestore {
    return this.db;
  }
}
