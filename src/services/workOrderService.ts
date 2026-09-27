import { WorkOrder } from '../types';
import { db } from '../config/firebase';
import { collection, doc, getDocs, getDoc, setDoc, deleteDoc, updateDoc, query, where } from 'firebase/firestore';
import { generateId } from '../utils/idGenerator';
import { DEFAULT_COMPANY_ID } from './storage';

const COLLECTION = 'workOrders';

export const workOrderService = {
  async getWorkOrders(companyId: string = DEFAULT_COMPANY_ID): Promise<WorkOrder[]> {
    const q = query(collection(db, COLLECTION), where("companyId", "==", companyId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as WorkOrder);
  },

  async getById(id: string): Promise<WorkOrder | undefined> {
    const d = await getDoc(doc(db, COLLECTION, id));
    return d.exists() ? (d.data() as WorkOrder) : undefined;
  },

  async create(data: Omit<WorkOrder, 'id' | 'createdAt' | 'updatedAt'>): Promise<WorkOrder> {
    const id = generateId('wo');
    const now = new Date().toISOString();
    const newItem = {
      ...data,
      id,
      
      createdAt: now,
      updatedAt: now,
    } as unknown as WorkOrder;
    
    await setDoc(doc(db, COLLECTION, id), newItem as any);
    return newItem;
  },

  async update(id: string, updates: Partial<WorkOrder>): Promise<WorkOrder> {
    const now = new Date().toISOString();
    const ref = doc(db, COLLECTION, id);
    await updateDoc(ref, { ...updates, updatedAt: now });
    const d = await getDoc(ref);
    return d.data() as WorkOrder;
  },

  async delete(id: string): Promise<boolean> {
    await deleteDoc(doc(db, COLLECTION, id));
    return true;
  }
};
