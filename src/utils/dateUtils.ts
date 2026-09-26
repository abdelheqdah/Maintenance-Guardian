import { ComplianceStatus, StatusCalculation } from '../types';

/**
 * Normalizes a date or date string (YYYY-MM-DD) to local midnight (00:00:00.000).
 */
export function normalizeDate(dateInput: string | Date): Date {
  if (typeof dateInput === 'string') {
    // Expecting YYYY-MM-DD or standard ISO string
    const parts = dateInput.split('T')[0].split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      return new Date(year, month, day, 0, 0, 0, 0);
    }
    const d = new Date(dateInput);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
  }
  return new Date(dateInput.getFullYear(), dateInput.getMonth(), dateInput.getDate(), 0, 0, 0, 0);
}

/**
 * Calculates the number of calendar days between today (00:00) and target date (00:00).
 * Returns negative number if target date is in the past.
 */
export function getDaysRemaining(targetDateInput: string | Date, referenceDate: Date = new Date()): number {
  if (!targetDateInput) return 9999;
  const target = normalizeDate(targetDateInput);
  const ref = normalizeDate(referenceDate);
  const diffMs = target.getTime() - ref.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Centralized compliance status calculator.
 * - Past date (< 0 days) -> OVERDUE
 * - 0 to 30 days -> DUE_30 (Due within 30 days)
 * - 31 to 90 days -> DUE_90 (Due within 90 days)
 * - > 90 days -> VALID
 */
export function calculateComplianceStatus(
  dueDateInput: string | Date | undefined,
  referenceDate: Date = new Date()
): StatusCalculation {
  if (!dueDateInput) {
    return {
      status: 'VALID',
      daysRemaining: 9999,
      isOverdue: false,
      isDueSoon: false,
      formattedDate: '-',
    };
  }

  const daysRemaining = getDaysRemaining(dueDateInput, referenceDate);
  let status: ComplianceStatus = 'VALID';

  if (daysRemaining < 0) {
    status = 'OVERDUE';
  } else if (daysRemaining <= 30) {
    status = 'DUE_30';
  } else if (daysRemaining <= 90) {
    status = 'DUE_90';
  } else {
    status = 'VALID';
  }

  const targetDate = normalizeDate(dueDateInput);
  const formattedDate = targetDate.toISOString().split('T')[0];

  return {
    status,
    daysRemaining,
    isOverdue: status === 'OVERDUE',
    isDueSoon: status === 'DUE_30' || status === 'OVERDUE',
    formattedDate,
  };
}

/**
 * Helper to generate YYYY-MM-DD string with day offset from today
 */
export function getDateOffsetString(dayOffset: number, baseDate: Date = new Date()): string {
  const d = new Date(baseDate);
  d.setDate(d.getDate() + dayOffset);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format a date string for display in French or English.
 */
export function formatDate(dateString?: string, locale: 'fr' | 'en' = 'fr'): string {
  if (!dateString) return '-';
  try {
    const d = normalizeDate(dateString);
    if (isNaN(d.getTime())) return dateString;
    if (locale === 'fr') {
      return d.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    }
    return d.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}
