import { Equipment } from '../types';
import { db } from '../config/firebase';
import { collection, doc, getDocs, getDoc, setDoc, deleteDoc, updateDoc, query, where } from 'firebase/firestore';
import { generateId } from '../utils/idGenerator';
import { DEFAULT_COMPANY_ID } from './storage';

const COLLECTION = 'equipment';

export const equipmentService = {
  async getAll(companyId: string = DEFAULT_COMPANY_ID): Promise<Equipment[]> {
    const q = query(collection(db, COLLECTION), where("companyId", "==", companyId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Equipment);
  },

  async getById(id: string): Promise<Equipment | undefined> {
    const d = await getDoc(doc(db, COLLECTION, id));
    return d.exists() ? (d.data() as Equipment) : undefined;
  },

  async create(data: Omit<Equipment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Equipment> {
    const id = generateId('eq');
    const now = new Date().toISOString();
    const newItem = {
      ...data,
      id,
      companyId: data.companyId || DEFAULT_COMPANY_ID,
      createdAt: now,
      updatedAt: now,
    } as unknown as Equipment;
    
    await setDoc(doc(db, COLLECTION, id), newItem as any);
    return newItem;
  },

  async update(id: string, updates: Partial<Equipment>): Promise<Equipment> {
    const now = new Date().toISOString();
    const ref = doc(db, COLLECTION, id);
    await updateDoc(ref, { ...updates, updatedAt: now });
    const d = await getDoc(ref);
    return d.data() as Equipment;
  },

  async delete(id: string): Promise<boolean> {
    await deleteDoc(doc(db, COLLECTION, id));
    return true;
  }
};
