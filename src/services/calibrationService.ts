import { CalibrationRecord } from '../types';
import { db } from '../config/firebase';
import { collection, doc, getDocs, getDoc, setDoc, deleteDoc, updateDoc, query, where } from 'firebase/firestore';
import { generateId } from '../utils/idGenerator';
import { DEFAULT_COMPANY_ID } from './storage';

const COLLECTION = 'calibrations';

export const calibrationService = {
  async getAll(companyId: string = DEFAULT_COMPANY_ID): Promise<CalibrationRecord[]> {
    const q = query(collection(db, COLLECTION), where("companyId", "==", companyId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as CalibrationRecord);
  },

  async getById(id: string): Promise<CalibrationRecord | undefined> {
    const d = await getDoc(doc(db, COLLECTION, id));
    return d.exists() ? (d.data() as CalibrationRecord) : undefined;
  },

  async create(data: Omit<CalibrationRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<CalibrationRecord> {
    const id = generateId('cal');
    const now = new Date().toISOString();
    const newItem = {
      ...data,
      id,
      companyId: data.companyId || DEFAULT_COMPANY_ID,
      createdAt: now,
      updatedAt: now,
    } as unknown as CalibrationRecord;
    
    await setDoc(doc(db, COLLECTION, id), newItem as any);
    return newItem;
  },

  async update(id: string, updates: Partial<CalibrationRecord>): Promise<CalibrationRecord> {
    const now = new Date().toISOString();
    const ref = doc(db, COLLECTION, id);
    await updateDoc(ref, { ...updates, updatedAt: now });
    const d = await getDoc(ref);
    return d.data() as CalibrationRecord;
  },

  async delete(id: string): Promise<boolean> {
    await deleteDoc(doc(db, COLLECTION, id));
    return true;
  }
};
