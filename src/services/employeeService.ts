import { Employee } from '../types';
import { db } from '../config/firebase';
import { collection, doc, getDocs, getDoc, setDoc, deleteDoc, updateDoc, query, where } from 'firebase/firestore';
import { generateId } from '../utils/idGenerator';
import { DEFAULT_COMPANY_ID } from './storage';

const COLLECTION = 'employees';

export const employeeService = {
  async getAll(companyId: string = DEFAULT_COMPANY_ID): Promise<Employee[]> {
    const q = query(collection(db, COLLECTION), where("companyId", "==", companyId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Employee);
  },

  async getById(id: string): Promise<Employee | undefined> {
    const d = await getDoc(doc(db, COLLECTION, id));
    return d.exists() ? (d.data() as Employee) : undefined;
  },

  async create(data: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>): Promise<Employee> {
    const id = generateId('emp');
    const now = new Date().toISOString();
    const newItem = {
      ...data,
      id,
      companyId: data.companyId || DEFAULT_COMPANY_ID,
      createdAt: now,
      updatedAt: now,
    } as unknown as Employee;
    
    await setDoc(doc(db, COLLECTION, id), newItem as any);
    return newItem;
  },

  async update(id: string, updates: Partial<Employee>): Promise<Employee> {
    const now = new Date().toISOString();
    const ref = doc(db, COLLECTION, id);
    await updateDoc(ref, { ...updates, updatedAt: now });
    const d = await getDoc(ref);
    return d.data() as Employee;
  },

  async delete(id: string): Promise<boolean> {
    await deleteDoc(doc(db, COLLECTION, id));
    return true;
  }
};
