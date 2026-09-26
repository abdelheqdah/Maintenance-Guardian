export type EquipmentAvailability = 
  | 'IN_SERVICE'          // En service
  | 'UNDER_MAINTENANCE'   // En maintenance
  | 'OUT_OF_SERVICE'      // Hors service
  | 'IN_CALIBRATION';     // En étalonnage

export interface Equipment {
  id: string;
  companyId: string;
  
  // Identification
  name: string;
  category: string;
  assetId: string;
  codification?: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  
  // Organization
  location: string;
  process?: string;
  availability: EquipmentAvailability;
  
  // Calibration / Inspection
  lastCalibrationDate?: string;      // YYYY-MM-DD
  nextCalibrationDate: string;       // YYYY-MM-DD (Mandatory for deadline tracking)
  validityPeriodMonths?: number;     // e.g. 6, 12, 24
  inspectionOrganization?: string;   // e.g., Bureau Veritas, Apave, CETIM, Fluke Metrology, etc.
  
  // Maintenance
  lastMaintenanceDate?: string;      // YYYY-MM-DD
  nextMaintenanceDate?: string;      // YYYY-MM-DD
  maintenancePeriodMonths?: number;  // e.g. 6, 12, 24
  
  // Other
  lifeSheetRef?: string;             // Référence fiche de vie (ex: FDV-2024-089)
  notes?: string;
  
  createdAt: string;
  updatedAt: string;
}
