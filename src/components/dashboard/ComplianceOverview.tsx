import React from 'react';
import { useLanguage } from '../../i18n';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

interface ComplianceOverviewProps {
  totalEquipment: number;
  equipmentOverdue: number;
  equipmentDue30: number;
  equipmentDue90: number;
  equipmentValid: number;
  employeeCertsAttention: number;
}

export const ComplianceOverview: React.FC<ComplianceOverviewProps> = ({
  totalEquipment,
  equipmentOverdue,
  equipmentDue30,
  equipmentDue90,
  equipmentValid,
  employeeCertsAttention,
}) => {
  const { t } = useLanguage();

  const totalItems = totalEquipment;
  const compliancePercentage = totalItems > 0
    ? Math.round((equipmentValid / totalItems) * 100)
    : 100;

  const overduePercent = totalItems > 0 ? (equipmentOverdue / totalItems) * 100 : 0;
  const due30Percent = totalItems > 0 ? (equipmentDue30 / totalItems) * 100 : 0;
  const due90Percent = totalItems > 0 ? (equipmentDue90 / totalItems) * 100 : 0;
  const validPercent = totalItems > 0 ? (equipmentValid / totalItems) * 100 : 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            {t('dash_compliance_rate')}
          </h3>
          <div className="flex items-baseline gap-3 mt-1">
            <span className="text-3xl font-extrabold text-slate-900">
              {compliancePercentage}%
            </span>
            <span className="text-xs text-slate-500 font-medium">
              ({equipmentValid} / {totalEquipment} équipements 100% à jour)
            </span>
          </div>
        </div>

        {/* Global indicator pill */}
        <div className="flex items-center gap-2">
          {equipmentOverdue > 0 || employeeCertsAttention > 0 ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{equipmentOverdue + employeeCertsAttention} éléments nécessitent une action</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Conformité réglementaire optimale</span>
            </div>
          )}
        </div>
      </div>

      {/* Segmented Progress Bar */}
      <div className="mt-4 w-full h-3 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
        {overduePercent > 0 && (
          <div
            style={{ width: `${overduePercent}%` }}
            className="bg-rose-500 hover:opacity-90 transition-all"
            title={`${t('status_overdue')}: ${equipmentOverdue}`}
          />
        )}
        {due30Percent > 0 && (
          <div
            style={{ width: `${due30Percent}%` }}
            className="bg-amber-500 hover:opacity-90 transition-all"
            title={`${t('status_due_30')}: ${equipmentDue30}`}
          />
        )}
        {due90Percent > 0 && (
          <div
            style={{ width: `${due90Percent}%` }}
            className="bg-sky-500 hover:opacity-90 transition-all"
            title={`${t('status_due_90')}: ${equipmentDue90}`}
          />
        )}
        {validPercent > 0 && (
          <div
            style={{ width: `${validPercent}%` }}
            className="bg-emerald-500 hover:opacity-90 transition-all"
            title={`${t('status_valid')}: ${equipmentValid}`}
          />
        )}
      </div>

      {/* Legend & Stats Details */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
          <span className="text-slate-600">{t('status_overdue')}:</span>
          <span className="font-bold text-rose-600">{equipmentOverdue}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
          <span className="text-slate-600">{t('status_due_30')}:</span>
          <span className="font-bold text-amber-600">{equipmentDue30}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-500 shrink-0" />
          <span className="text-slate-600">{t('status_due_90')}:</span>
          <span className="font-bold text-sky-600">{equipmentDue90}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
          <span className="text-slate-600">{t('status_valid')}:</span>
          <span className="font-bold text-emerald-600">{equipmentValid}</span>
        </div>
      </div>
    </div>
  );
};
