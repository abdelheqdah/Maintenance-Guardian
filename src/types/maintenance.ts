export type MaintenanceType = 
  | 'PREVENTIVE'   // Préventive
  | 'CORRECTIVE'   // Corrective / Curative
  | 'INSPECTION'   // Inspection périodique
  | 'OVERHAUL'     // Révision générale
  | 'OTHER';       // Autre

export interface MaintenanceRecord {
  id: string;
  equipmentId: string;
  companyId: string;
  date: string;                     // YYYY-MM-DD
  type: MaintenanceType;
  description: string;
  technician: string;               // Technician or service company
  cost?: number;                    // Cost in currency
  nextMaintenanceDate?: string;     // YYYY-MM-DD
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
