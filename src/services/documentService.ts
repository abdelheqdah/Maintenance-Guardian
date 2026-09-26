import { DocumentRecord, AssociatedRecordType } from '../types';
import { storage, DEFAULT_COMPANY_ID } from './storage';
import { generateId } from '../utils/idGenerator';
import { equipmentService } from './equipmentService';

const STORAGE_KEY = 'documents';

export const documentService = {
  getAll(companyId: string = DEFAULT_COMPANY_ID): DocumentRecord[] {
    equipmentService.ensureInitialized();
    const all = storage.get<DocumentRecord[]>(STORAGE_KEY, []);
    return all.filter((d) => d.companyId === companyId);
  },

  getByAssociation(associatedType: AssociatedRecordType, associatedId: string): DocumentRecord[] {
    return this.getAll().filter(
      (d) => d.associatedType === associatedType && d.associatedId === associatedId
    );
  },

  getById(id: string): DocumentRecord | undefined {
    equipmentService.ensureInitialized();
    const all = storage.get<DocumentRecord[]>(STORAGE_KEY, []);
    return all.find((d) => d.id === id);
  },

  create(data: Omit<DocumentRecord, 'id' | 'createdAt'>): DocumentRecord {
    equipmentService.ensureInitialized();
    const all = storage.get<DocumentRecord[]>(STORAGE_KEY, []);
    const newDoc: DocumentRecord = {
      ...data,
      id: generateId('doc'),
      companyId: data.companyId || DEFAULT_COMPANY_ID,
      createdAt: new Date().toISOString(),
    };
    all.unshift(newDoc);
    storage.set(STORAGE_KEY, all);
    return newDoc;
  },

  delete(id: string): boolean {
    equipmentService.ensureInitialized();
    const all = storage.get<DocumentRecord[]>(STORAGE_KEY, []);
    const filtered = all.filter((d) => d.id !== id);
    if (filtered.length !== all.length) {
      storage.set(STORAGE_KEY, filtered);
      return true;
    }
    return false;
  },
};
