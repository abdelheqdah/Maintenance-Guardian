export type CalibrationType = 
  | 'INTERNAL_CALIBRATION'   // Étalonnage interne
  | 'EXTERNAL_CALIBRATION'   // Étalonnage externe
  | 'PERIODIC_INSPECTION'    // Vérification périodique
  | 'LEGAL_METROLOGY'        // Métrologie légale
  | 'SAFETY_AUDIT';          // Audit de conformité

export type CalibrationResult = 
  | 'CONFORM'                // Conforme
  | 'NON_CONFORM'            // Non conforme
  | 'RESTRICTED'             // Conforme avec restrictions
  | 'ADJUSTED';              // Réajusté et conforme

export interface CalibrationRecord {
  id: string;
  equipmentId: string;
  companyId: string;
  date: string;                     // YYYY-MM-DD
  type: CalibrationType;
  result: CalibrationResult;
  certificateNumber: string;        // PV / N° Certificat d'étalonnage
  performedBy: string;              // Organisme ou technicien métrologue
  nextDueDate: string;              // YYYY-MM-DD
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
