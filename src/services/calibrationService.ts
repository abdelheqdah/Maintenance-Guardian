import { CalibrationRecord } from '../types';
import { storage, DEFAULT_COMPANY_ID } from './storage';
import { generateId } from '../utils/idGenerator';
import { equipmentService } from './equipmentService';

const STORAGE_KEY = 'calibrations';

export const calibrationService = {
  getAll(companyId: string = DEFAULT_COMPANY_ID): CalibrationRecord[] {
    equipmentService.ensureInitialized();
    const all = storage.get<CalibrationRecord[]>(STORAGE_KEY, []);
    return all
      .filter((r) => r.companyId === companyId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  getByEquipmentId(equipmentId: string): CalibrationRecord[] {
    return this.getAll().filter((c) => c.equipmentId === equipmentId);
  },

  getById(id: string): CalibrationRecord | undefined {
    equipmentService.ensureInitialized();
    const all = storage.get<CalibrationRecord[]>(STORAGE_KEY, []);
    return all.find((r) => r.id === id);
  },

  create(data: Omit<CalibrationRecord, 'id' | 'createdAt' | 'updatedAt'>): CalibrationRecord {
    equipmentService.ensureInitialized();
    const all = storage.get<CalibrationRecord[]>(STORAGE_KEY, []);
    const now = new Date().toISOString();
    const newRecord: CalibrationRecord = {
      ...data,
      id: generateId('cal'),
      companyId: data.companyId || DEFAULT_COMPANY_ID,
      createdAt: now,
      updatedAt: now,
    };
    all.unshift(newRecord);
    storage.set(STORAGE_KEY, all);

    // Sync with Equipment record
    try {
      equipmentService.update(data.equipmentId, {
        lastCalibrationDate: data.date,
        nextCalibrationDate: data.nextDueDate,
        ...(data.performedBy ? { inspectionOrganization: data.performedBy } : {}),
      });
    } catch (err) {
      console.warn('Could not sync equipment calibration dates:', err);
    }

    return newRecord;
  },

  update(id: string, updates: Partial<CalibrationRecord>): CalibrationRecord {
    equipmentService.ensureInitialized();
    const all = storage.get<CalibrationRecord[]>(STORAGE_KEY, []);
    const index = all.findIndex((r) => r.id === id);
    if (index === -1) {
      throw new Error(`Calibration record ${id} not found`);
    }

    const updated: CalibrationRecord = {
      ...all[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    all[index] = updated;
    storage.set(STORAGE_KEY, all);

    // If dates changed, sync equipment
    if (updates.date || updates.nextDueDate) {
      try {
        equipmentService.update(updated.equipmentId, {
          ...(updates.date ? { lastCalibrationDate: updates.date } : {}),
          ...(updates.nextDueDate ? { nextCalibrationDate: updates.nextDueDate } : {}),
        });
      } catch (err) {
        console.warn('Could not sync equipment calibration dates:', err);
      }
    }

    return updated;
  },

  delete(id: string): boolean {
    equipmentService.ensureInitialized();
    const all = storage.get<CalibrationRecord[]>(STORAGE_KEY, []);
    const filtered = all.filter((r) => r.id !== id);
    if (filtered.length !== all.length) {
      storage.set(STORAGE_KEY, filtered);
      return true;
    }
    return false;
  },
};
