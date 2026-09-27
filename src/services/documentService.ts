import { DocumentRecord } from '../types';
import { db } from '../config/firebase';
import { collection, doc, getDocs, getDoc, setDoc, deleteDoc, updateDoc, query, where } from 'firebase/firestore';
import { generateId } from '../utils/idGenerator';
import { DEFAULT_COMPANY_ID } from './storage';

const COLLECTION = 'documents';

export const documentService = {
  async getAll(companyId: string = DEFAULT_COMPANY_ID): Promise<DocumentRecord[]> {
    const q = query(collection(db, COLLECTION), where("companyId", "==", companyId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as DocumentRecord);
  },

  async getById(id: string): Promise<DocumentRecord | undefined> {
    const d = await getDoc(doc(db, COLLECTION, id));
    return d.exists() ? (d.data() as DocumentRecord) : undefined;
  },

  async create(data: Omit<DocumentRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<DocumentRecord> {
    const id = generateId('doc');
    const now = new Date().toISOString();
    const newItem = {
      ...data,
      id,
      companyId: data.companyId || DEFAULT_COMPANY_ID,
      createdAt: now,
      updatedAt: now,
    } as unknown as DocumentRecord;
    
    await setDoc(doc(db, COLLECTION, id), newItem as any);
    return newItem;
  },

  async update(id: string, updates: Partial<DocumentRecord>): Promise<DocumentRecord> {
    const now = new Date().toISOString();
    const ref = doc(db, COLLECTION, id);
    await updateDoc(ref, { ...updates, updatedAt: now });
    const d = await getDoc(ref);
    return d.data() as DocumentRecord;
  },

  async delete(id: string): Promise<boolean> {
    await deleteDoc(doc(db, COLLECTION, id));
    return true;
  }
};
