export type DocumentType = 
  | 'CALIBRATION_CERTIFICATE'   // Certificat d'étalonnage
  | 'MAINTENANCE_REPORT'        // Rapport de maintenance
  | 'USER_MANUAL'               // Notice / Manuel d'utilisation
  | 'COMPLIANCE_CERTIFICATE'    // Certificat de conformité CE
  | 'EMPLOYEE_CERTIFICATE'      // Habilitation / Titre employé
  | 'TECHNICAL_SHEET'           // Fiche technique
  | 'OTHER';                    // Autre

export type AssociatedRecordType = 'EQUIPMENT' | 'EMPLOYEE' | 'MAINTENANCE' | 'CALIBRATION';

export interface DocumentRecord {
  id: string;
  companyId: string;
  name: string;
  type: DocumentType;
  referenceNumber: string;
  date: string;                       // YYYY-MM-DD
  associatedType: AssociatedRecordType;
  associatedId: string;
  associatedName?: string;            // cached name for display
  fileName?: string;                  // Mock or real attached filename
  fileSize?: string;                  // e.g. "1.4 MB"
  notes?: string;
  createdAt: string;
}
