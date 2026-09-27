import { MaintenanceRecord } from '../types';
import { db } from '../config/firebase';
import { collection, doc, getDocs, getDoc, setDoc, deleteDoc, updateDoc, query, where } from 'firebase/firestore';
import { generateId } from '../utils/idGenerator';
import { DEFAULT_COMPANY_ID } from './storage';

const COLLECTION = 'maintenance';

export const maintenanceService = {
  async getAll(companyId: string = DEFAULT_COMPANY_ID): Promise<MaintenanceRecord[]> {
    const q = query(collection(db, COLLECTION), where("companyId", "==", companyId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as MaintenanceRecord);
  },

  async getById(id: string): Promise<MaintenanceRecord | undefined> {
    const d = await getDoc(doc(db, COLLECTION, id));
    return d.exists() ? (d.data() as MaintenanceRecord) : undefined;
  },

  async create(data: Omit<MaintenanceRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<MaintenanceRecord> {
    const id = generateId('maint');
    const now = new Date().toISOString();
    const newItem = {
      ...data,
      id,
      companyId: data.companyId || DEFAULT_COMPANY_ID,
      createdAt: now,
      updatedAt: now,
    } as unknown as MaintenanceRecord;
    
    await setDoc(doc(db, COLLECTION, id), newItem as any);
    return newItem;
  },

  async update(id: string, updates: Partial<MaintenanceRecord>): Promise<MaintenanceRecord> {
    const now = new Date().toISOString();
    const ref = doc(db, COLLECTION, id);
    await updateDoc(ref, { ...updates, updatedAt: now });
    const d = await getDoc(ref);
    return d.data() as MaintenanceRecord;
  },

  async delete(id: string): Promise<boolean> {
    await deleteDoc(doc(db, COLLECTION, id));
    return true;
  }
};
