import React from 'react';
import { useLanguage } from '../../i18n';
import { StatusBadge } from '../common/StatusBadge';
import { formatDate } from '../../utils/dateUtils';
import { UrgentItem } from '../dashboard/UrgentItemsTable';
import {
  AlertOctagon,
  AlertTriangle,
  Clock,
  ArrowRight,
  Gauge,
  Wrench,
  Award,
  CheckCircle2,
} from 'lucide-react';

interface AlertsViewProps {
  alerts: UrgentItem[];
  onNavigate: (type: 'equipment' | 'employee', id: string) => void;
  onQuickAction?: (categoryType: string, targetId: string) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({ alerts, onNavigate, onQuickAction }) => {
  const { t, language } = useLanguage();

  const overdueAlerts = alerts.filter((a) => a.status === 'OVERDUE');
  const due30Alerts = alerts.filter((a) => a.status === 'DUE_30');
  const due90Alerts = alerts.filter((a) => a.status === 'DUE_90');

  const getCategoryMeta = (cat: UrgentItem['categoryType']) => {
    switch (cat) {
      case 'CALIBRATION':
        return {
          label: t('alerts_item_equipment_cal'),
          icon: Gauge,
          color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
        };
      case 'MAINTENANCE':
        return {
          label: t('alerts_item_equipment_maint'),
          icon: Wrench,
          color: 'text-amber-600 bg-amber-50 border-amber-200',
        };
      case 'CERTIFICATE':
      default:
        return {
          label: t('alerts_item_employee_cert'),
          icon: Award,
          color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
        };
    }
  };

  const renderAlertCard = (item: UrgentItem) => {
    const meta = getCategoryMeta(item.categoryType);
    const CatIcon = meta.icon;

    return (
      <div
        key={`${item.targetType}_${item.id}_${item.categoryType}`}
        className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700 shrink-0">
            <CatIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border ${meta.color}`}>
                {meta.label}
              </span>
              <StatusBadge status={item.status} size="sm" />
            </div>

            <h4 className="text-sm font-bold text-slate-900 mt-1.5 leading-snug">
              {item.title}
            </h4>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              {item.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <div className="text-left sm:text-right">
            <div className="text-xs font-mono font-bold text-slate-800">
              {formatDate(item.dueDate, language)}
            </div>
            <div className="text-[11px] font-medium text-slate-400">
              {item.daysRemaining < 0
                ? `${Math.abs(item.daysRemaining)} jours de retard`
                : item.daysRemaining === 0
                ? "Échéance aujourd'hui"
                : `${item.daysRemaining} jours restants`}
            </div>
          </div>

          <div className="flex justify-end gap-2 shrink-0">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onQuickAction && onQuickAction(item.categoryType, item.targetId); }}
              className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 transition-colors"
              title={item.categoryType === 'CALIBRATION' ? 'Étalonner' : item.categoryType === 'MAINTENANCE' ? 'Maintenir' : 'Renouveler'}
            >
              {item.categoryType === 'CALIBRATION' ? <Gauge className="w-4 h-4" /> : item.categoryType === 'MAINTENANCE' ? <Wrench className="w-4 h-4" /> : <Award className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={() => onNavigate(item.targetType, item.targetId)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors shrink-0"
            >
              <span>{t('btn_view')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          {t('alerts_title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          {t('alerts_subtitle')}
        </p>
      </div>

      {alerts.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900">{t('alerts_empty')}</h3>
        </div>
      ) : (
        <div className="space-y-8">
          {/* 1. OVERDUE SECTION */}
          {overdueAlerts.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                <AlertOctagon className="w-5 h-5 text-rose-600" />
                <h2>{t('alerts_cat_overdue')} ({overdueAlerts.length})</h2>
              </div>
              <div className="space-y-2.5">
                {overdueAlerts.map(renderAlertCard)}
              </div>
            </div>
          )}

          {/* 2. DUE IN 30 DAYS */}
          {due30Alerts.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h2>{t('alerts_cat_due_30')} ({due30Alerts.length})</h2>
              </div>
              <div className="space-y-2.5">
                {due30Alerts.map(renderAlertCard)}
              </div>
            </div>
          )}

          {/* 3. DUE IN 90 DAYS */}
          {due90Alerts.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sky-800 font-bold text-sm">
                <Clock className="w-5 h-5 text-sky-600" />
                <h2>{t('alerts_cat_due_90')} ({due90Alerts.length})</h2>
              </div>
              <div className="space-y-2.5">
                {due90Alerts.map(renderAlertCard)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
