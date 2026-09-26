import React from 'react';
import { ComplianceStatus } from '../../types';
import { useLanguage } from '../../i18n';
import { AlertTriangle, Clock, CheckCircle2, AlertOctagon } from 'lucide-react';

interface StatusBadgeProps {
  status: ComplianceStatus;
  daysRemaining?: number;
  showDays?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  daysRemaining,
  showDays = false,
  size = 'md',
  className = '',
}) => {
  const { t } = useLanguage();

  const getStatusConfig = () => {
    switch (status) {
      case 'OVERDUE':
        return {
          label: t('status_overdue'),
          icon: AlertOctagon,
          classes: 'bg-rose-50 text-rose-700 border-rose-300 ring-rose-500/20',
          dot: 'bg-rose-600 animate-pulse',
        };
      case 'DUE_30':
        return {
          label: t('status_due_30'),
          icon: AlertTriangle,
          classes: 'bg-amber-50 text-amber-800 border-amber-300 ring-amber-500/20',
          dot: 'bg-amber-500',
        };
      case 'DUE_90':
        return {
          label: t('status_due_90'),
          icon: Clock,
          classes: 'bg-sky-50 text-sky-800 border-sky-300 ring-sky-500/20',
          dot: 'bg-sky-500',
        };
      case 'VALID':
      default:
        return {
          label: t('status_valid'),
          icon: CheckCircle2,
          classes: 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-emerald-500/20',
          dot: 'bg-emerald-500',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs font-medium px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-semibold px-3 py-1.5 gap-2',
  }[size];

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  }[size];

  let extraText = '';
  if (showDays && daysRemaining !== undefined) {
    if (daysRemaining < 0) {
      extraText = ` (${Math.abs(daysRemaining)}j retard)`;
    } else if (daysRemaining === 0) {
      extraText = ` (aujourd'hui)`;
    } else {
      extraText = ` (${daysRemaining}j)`;
    }
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-xs tracking-tight ${sizeClasses} ${config.classes} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} shrink-0`} />
      <Icon className={`${iconSizes} shrink-0`} />
      <span className="truncate">
        {config.label}
        {extraText}
      </span>
    </span>
  );
};
