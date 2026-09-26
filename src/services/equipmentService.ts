import { Equipment, ComplianceStatus } from '../types';
import { storage, DEFAULT_COMPANY_ID } from './storage';
import { generateId } from '../utils/idGenerator';
import { calculateComplianceStatus } from '../utils/dateUtils';
import { getInitialSeedData } from './seedData';

const STORAGE_KEY = 'equipment';
const INIT_KEY = 'is_initialized';

export const equipmentService = {
  /**
   * Initializes data if first visit
   */
  ensureInitialized(): void {
    const isInit = storage.get<boolean>(INIT_KEY, false);
    if (!isInit) {
      const seed = getInitialSeedData();
      storage.set('equipment', seed.equipment);
      storage.set('employees', seed.employees);
      storage.set('maintenance', seed.maintenance);
      storage.set('calibrations', seed.calibrations);
      storage.set('documents', seed.documents);
      storage.set(INIT_KEY, true);
    }
  },

  getAll(companyId: string = DEFAULT_COMPANY_ID): Equipment[] {
    this.ensureInitialized();
    const all = storage.get<Equipment[]>(STORAGE_KEY, []);
    return all.filter((eq) => eq.companyId === companyId);
  },

  getById(id: string): Equipment | undefined {
    this.ensureInitialized();
    const all = storage.get<Equipment[]>(STORAGE_KEY, []);
    return all.find((eq) => eq.id === id);
  },

  create(data: Omit<Equipment, 'id' | 'createdAt' | 'updatedAt'>): Equipment {
    this.ensureInitialized();
    const all = storage.get<Equipment[]>(STORAGE_KEY, []);
    const now = new Date().toISOString();
    const newEquipment: Equipment = {
      ...data,
      id: generateId('eq'),
      companyId: data.companyId || DEFAULT_COMPANY_ID,
      createdAt: now,
      updatedAt: now,
    };
    all.unshift(newEquipment);
    storage.set(STORAGE_KEY, all);
    return newEquipment;
  },

  update(id: string, updates: Partial<Equipment>): Equipment {
    this.ensureInitialized();
    const all = storage.get<Equipment[]>(STORAGE_KEY, []);
    const index = all.findIndex((eq) => eq.id === id);
    if (index === -1) {
      throw new Error(`Equipment with ID ${id} not found`);
    }

    const updated: Equipment = {
      ...all[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    all[index] = updated;
    storage.set(STORAGE_KEY, all);
    return updated;
  },

  delete(id: string): boolean {
    this.ensureInitialized();
    const all = storage.get<Equipment[]>(STORAGE_KEY, []);
    const filtered = all.filter((eq) => eq.id !== id);
    if (filtered.length !== all.length) {
      storage.set(STORAGE_KEY, filtered);
      return true;
    }
    return false;
  },

  search(
    query: string = '',
    statusFilter: ComplianceStatus | 'ALL' = 'ALL',
    categoryFilter: string = 'ALL',
    companyId: string = DEFAULT_COMPANY_ID
  ): Equipment[] {
    const list = this.getAll(companyId);
    const q = query.toLowerCase().trim();

    return list.filter((item) => {
      // 1. Text search
      const matchesText = !q || (
        item.name.toLowerCase().includes(q) ||
        item.assetId.toLowerCase().includes(q) ||
        item.serialNumber.toLowerCase().includes(q) ||
        item.manufacturer.toLowerCase().includes(q) ||
        item.model.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        (item.codification && item.codification.toLowerCase().includes(q)) ||
        (item.process && item.process.toLowerCase().includes(q))
      );

      if (!matchesText) return false;

      // 2. Status filter
      if (statusFilter !== 'ALL') {
        const calStatus = calculateComplianceStatus(item.nextCalibrationDate).status;
        const maintStatus = item.nextMaintenanceDate 
          ? calculateComplianceStatus(item.nextMaintenanceDate).status 
          : 'VALID';
        
        // Match if either calibration or maintenance matches the filter status
        const matchesStatus = calStatus === statusFilter || maintStatus === statusFilter;
        if (!matchesStatus) return false;
      }

      // 3. Category filter
      if (categoryFilter !== 'ALL' && item.category !== categoryFilter) {
        return false;
      }

      return true;
    });
  },

  getCategories(companyId: string = DEFAULT_COMPANY_ID): string[] {
    const list = this.getAll(companyId);
    const categories = new Set<string>();
    list.forEach((eq) => {
      if (eq.category) categories.add(eq.category);
    });
    return Array.from(categories).sort();
  },

  getLocations(companyId: string = DEFAULT_COMPANY_ID): string[] {
    const list = this.getAll(companyId);
    const locations = new Set<string>();
    list.forEach((eq) => {
      if (eq.location) locations.add(eq.location);
    });
    return Array.from(locations).sort();
  }
};
