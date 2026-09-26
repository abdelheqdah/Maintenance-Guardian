import React from 'react';
import { useLanguage } from '../../i18n';
import { StatusBadge } from '../common/StatusBadge';
import { formatDate } from '../../utils/dateUtils';
import { ComplianceStatus } from '../../types';
import { ArrowRight, Wrench, Gauge, Award, CheckCircle2 } from 'lucide-react';

export interface UrgentItem {
  id: string;
  title: string;
  subtitle: string;
  categoryType: 'CALIBRATION' | 'MAINTENANCE' | 'CERTIFICATE';
  dueDate: string;
  daysRemaining: number;
  status: ComplianceStatus;
  targetType: 'equipment' | 'employee';
  targetId: string;
}

interface UrgentItemsTableProps {
  items: UrgentItem[];
  onNavigate: (type: 'equipment' | 'employee', id: string) => void;
  onViewAllAlerts: () => void;
  onQuickAction?: (categoryType: string, targetId: string) => void;
}

export const UrgentItemsTable: React.FC<UrgentItemsTableProps> = ({
  items,
  onNavigate,
  onViewAllAlerts,
  onQuickAction,
}) => {
  const { t, language } = useLanguage();

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

  if (items.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200 shadow-xs">
        <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <p className="text-sm font-semibold text-slate-800">{t('dash_no_urgent')}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            {t('dash_urgent_deadlines')}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('dash_urgent_subtitle')}
          </p>
        </div>
        <button
          type="button"
          onClick={onViewAllAlerts}
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
        >
          {t('dash_view_all')}
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-100">
            <tr>
              <th scope="col" className="py-3 px-4">{t('col_equipment')} / {t('col_employee')}</th>
              <th scope="col" className="py-3 px-4">{t('col_type')}</th>
              <th scope="col" className="py-3 px-4">{t('col_due_date')}</th>
              <th scope="col" className="py-3 px-4">{t('col_status')}</th>
              <th scope="col" className="py-3 px-4 text-right">{t('col_actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
            {items.map((item) => {
              const meta = getCategoryMeta(item.categoryType);
              const CatIcon = meta.icon;

              return (
                <tr
                  key={`${item.targetType}_${item.id}_${item.categoryType}`}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  {/* Name & Asset info */}
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900 leading-tight">
                      {item.title}
                    </div>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">
                      {item.subtitle}
                    </div>
                  </td>

                  {/* Type badge */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${meta.color}`}>
                      <CatIcon className="w-3.5 h-3.5 shrink-0" />
                      {meta.label}
                    </span>
                  </td>

                  {/* Due Date */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="font-mono text-xs text-slate-800 font-semibold">
                      {formatDate(item.dueDate, language)}
                    </span>
                    <span className="block text-[11px] text-slate-400">
                      {item.daysRemaining < 0
                        ? `${Math.abs(item.daysRemaining)} j retard`
                        : item.daysRemaining === 0
                        ? "Aujourd'hui"
                        : `${item.daysRemaining} j restants`}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <StatusBadge status={item.status} size="sm" />
                  </td>

                  {/* Action Link */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onQuickAction && onQuickAction(item.categoryType, item.targetId); }}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 transition-colors"
                        title={item.categoryType === 'CALIBRATION' ? 'Étalonner' : item.categoryType === 'MAINTENANCE' ? 'Maintenir' : 'Renouveler'}
                      >
                        {item.categoryType === 'CALIBRATION' ? <Gauge className="w-4 h-4" /> : item.categoryType === 'MAINTENANCE' ? <Wrench className="w-4 h-4" /> : <Award className="w-4 h-4" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => onNavigate(item.targetType, item.targetId)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        {t('btn_view')}
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
