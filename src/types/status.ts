export type ComplianceStatus = 'OVERDUE' | 'DUE_30' | 'DUE_90' | 'VALID';

export interface StatusCalculation {
  status: ComplianceStatus;
  daysRemaining: number;
  isOverdue: boolean;
  isDueSoon: boolean; // due within 30 days
  formattedDate: string;
}
