import { MaintenanceRecord } from '../types';
import { storage, DEFAULT_COMPANY_ID } from './storage';
import { generateId } from '../utils/idGenerator';
import { equipmentService } from './equipmentService';

const STORAGE_KEY = 'maintenance';

export const maintenanceService = {
  getAll(companyId: string = DEFAULT_COMPANY_ID): MaintenanceRecord[] {
    equipmentService.ensureInitialized();
    const all = storage.get<MaintenanceRecord[]>(STORAGE_KEY, []);
    return all
      .filter((r) => r.companyId === companyId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  getByEquipmentId(equipmentId: string): MaintenanceRecord[] {
    return this.getAll().filter((m) => m.equipmentId === equipmentId);
  },

  getById(id: string): MaintenanceRecord | undefined {
    equipmentService.ensureInitialized();
    const all = storage.get<MaintenanceRecord[]>(STORAGE_KEY, []);
    return all.find((r) => r.id === id);
  },

  create(data: Omit<MaintenanceRecord, 'id' | 'createdAt' | 'updatedAt'>): MaintenanceRecord {
    equipmentService.ensureInitialized();
    const all = storage.get<MaintenanceRecord[]>(STORAGE_KEY, []);
    const now = new Date().toISOString();
    const newRecord: MaintenanceRecord = {
      ...data,
      id: generateId('maint'),
      companyId: data.companyId || DEFAULT_COMPANY_ID,
      createdAt: now,
      updatedAt: now,
    };
    all.unshift(newRecord);
    storage.set(STORAGE_KEY, all);

    // Sync with Equipment record
    try {
      const eq = equipmentService.getById(data.equipmentId);
      if (eq) {
        equipmentService.update(data.equipmentId, {
          lastMaintenanceDate: data.date,
          ...(data.nextMaintenanceDate ? { nextMaintenanceDate: data.nextMaintenanceDate } : {}),
        });
      }
    } catch (err) {
      console.warn('Could not sync equipment maintenance dates:', err);
    }

    return newRecord;
  },

  update(id: string, updates: Partial<MaintenanceRecord>): MaintenanceRecord {
    equipmentService.ensureInitialized();
    const all = storage.get<MaintenanceRecord[]>(STORAGE_KEY, []);
    const index = all.findIndex((r) => r.id === id);
    if (index === -1) {
      throw new Error(`Maintenance record ${id} not found`);
    }

    const updated: MaintenanceRecord = {
      ...all[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    all[index] = updated;
    storage.set(STORAGE_KEY, all);

    // If dates changed, sync equipment
    if (updates.date || updates.nextMaintenanceDate) {
      try {
        equipmentService.update(updated.equipmentId, {
          ...(updates.date ? { lastMaintenanceDate: updates.date } : {}),
          ...(updates.nextMaintenanceDate ? { nextMaintenanceDate: updates.nextMaintenanceDate } : {}),
        });
      } catch (err) {
        console.warn('Could not sync equipment maintenance dates:', err);
      }
    }

    return updated;
  },

  delete(id: string): boolean {
    equipmentService.ensureInitialized();
    const all = storage.get<MaintenanceRecord[]>(STORAGE_KEY, []);
    const filtered = all.filter((r) => r.id !== id);
    if (filtered.length !== all.length) {
      storage.set(STORAGE_KEY, filtered);
      return true;
    }
    return false;
  },
};
