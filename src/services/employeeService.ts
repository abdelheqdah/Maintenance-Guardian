import { Employee, ComplianceStatus } from '../types';
import { storage, DEFAULT_COMPANY_ID } from './storage';
import { generateId } from '../utils/idGenerator';
import { calculateComplianceStatus } from '../utils/dateUtils';
import { equipmentService } from './equipmentService';

const STORAGE_KEY = 'employees';

export const employeeService = {
  getAll(companyId: string = DEFAULT_COMPANY_ID): Employee[] {
    equipmentService.ensureInitialized();
    const all = storage.get<Employee[]>(STORAGE_KEY, []);
    return all.filter((emp) => emp.companyId === companyId);
  },

  getById(id: string): Employee | undefined {
    equipmentService.ensureInitialized();
    const all = storage.get<Employee[]>(STORAGE_KEY, []);
    return all.find((emp) => emp.id === id);
  },

  create(data: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>): Employee {
    equipmentService.ensureInitialized();
    const all = storage.get<Employee[]>(STORAGE_KEY, []);
    const now = new Date().toISOString();
    const newEmployee: Employee = {
      ...data,
      id: generateId('emp'),
      companyId: data.companyId || DEFAULT_COMPANY_ID,
      createdAt: now,
      updatedAt: now,
    };
    all.unshift(newEmployee);
    storage.set(STORAGE_KEY, all);
    return newEmployee;
  },

  update(id: string, updates: Partial<Employee>): Employee {
    equipmentService.ensureInitialized();
    const all = storage.get<Employee[]>(STORAGE_KEY, []);
    const index = all.findIndex((emp) => emp.id === id);
    if (index === -1) {
      throw new Error(`Employee with ID ${id} not found`);
    }

    const updated: Employee = {
      ...all[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    all[index] = updated;
    storage.set(STORAGE_KEY, all);
    return updated;
  },

  delete(id: string): boolean {
    equipmentService.ensureInitialized();
    const all = storage.get<Employee[]>(STORAGE_KEY, []);
    const filtered = all.filter((emp) => emp.id !== id);
    if (filtered.length !== all.length) {
      storage.set(STORAGE_KEY, filtered);
      return true;
    }
    return false;
  },

  search(
    query: string = '',
    statusFilter: ComplianceStatus | 'ALL' = 'ALL',
    companyId: string = DEFAULT_COMPANY_ID
  ): Employee[] {
    const list = this.getAll(companyId);
    const q = query.toLowerCase().trim();

    return list.filter((emp) => {
      // 1. Search text
      const matchesText = !q || (
        emp.name.toLowerCase().includes(q) ||
        emp.employeeId.toLowerCase().includes(q) ||
        emp.position.toLowerCase().includes(q) ||
        emp.certificateName.toLowerCase().includes(q) ||
        emp.certificateNumber.toLowerCase().includes(q) ||
        (emp.department && emp.department.toLowerCase().includes(q))
      );

      if (!matchesText) return false;

      // 2. Status filter
      if (statusFilter !== 'ALL') {
        const certStatus = calculateComplianceStatus(emp.expiryDate).status;
        if (certStatus !== statusFilter) return false;
      }

      return true;
    });
  },
};
