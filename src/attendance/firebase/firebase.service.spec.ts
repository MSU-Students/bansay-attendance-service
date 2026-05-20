import { Test, TestingModule } from '@nestjs/testing';
import { FirebaseService } from './firebase.service';

const mockSnapshot = {
  exists: true,
  id: 'abc123',
  data: () => ({ fullName: 'Juan', email: 'juan@msu.edu' }),
};

const mockCollection = {
  doc: jest.fn().mockReturnThis(),
  get: jest.fn(),
  where: jest.fn().mockReturnThis(),
};

jest.mock('firebase-admin', () => ({
  apps: [],
  initializeApp: jest.fn(),
  credential: { applicationDefault: jest.fn() },
  firestore: () => ({
    collection: jest.fn(() => mockCollection),
  }),
}));

describe('FirebaseService', () => {
  let service: FirebaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FirebaseService],
    }).compile();

    service = module.get<FirebaseService>(FirebaseService);
    await service.onModuleInit();
    jest.clearAllMocks();
    mockCollection.get.mockResolvedValue(mockSnapshot);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getRecord', () => {
    it('should return a document by collection and key', async () => {
      const result = await service.getRecord('users', 'abc123');

      expect(mockCollection.doc).toHaveBeenCalledWith('abc123');
      expect(result).toEqual({
        key: 'abc123',
        fullName: 'Juan',
        email: 'juan@msu.edu',
      });
    });

    it('should return null when document does not exist', async () => {
      mockCollection.get.mockResolvedValueOnce({ exists: false, id: 'missing', data: () => ({}) });

      const result = await service.getRecord('users', 'missing');
      expect(result).toBeNull();
    });
  });

  describe('findRecords', () => {
    it('should return all documents with no filters', async () => {
      mockCollection.get.mockResolvedValueOnce({
        docs: [
          { id: '1', data: () => ({ fullName: 'A' }) },
          { id: '2', data: () => ({ fullName: 'B' }) },
        ],
      });

      const result = await service.findRecords('users');

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ key: '1', fullName: 'A' });
    });

    it('should apply filters when provided', async () => {
      mockCollection.get.mockResolvedValueOnce({
        docs: [
          { id: '1', data: () => ({ fullName: 'C', role: 'student' }) },
        ],
      });

      await service.findRecords('users', { role: 'student' });

      expect(mockCollection.where).toHaveBeenCalledWith('role', '==', 'student');
    });
  });

  describe('getFirestore', () => {
    it('should return the firestore instance', () => {
      const db = service.getFirestore();
      expect(db).toBeDefined();
    });
  });
});
