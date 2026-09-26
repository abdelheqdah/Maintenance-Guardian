import React from 'react';
import { useLanguage } from '../../i18n';
import { StatCard } from './StatCard';
import { ComplianceOverview } from './ComplianceOverview';
import { UrgentItemsTable, UrgentItem } from './UrgentItemsTable';
import {
  Cpu,
  AlertOctagon,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Users,
  Award,
  ShieldAlert,
  Plus,
} from 'lucide-react';
import { ComplianceStatus } from '../../types';

interface DashboardViewProps {
  stats: {
    totalEquipment: number;
    equipmentRequiringAttention: number;
    equipmentOverdue: number;
    equipmentDue30: number;
    equipmentDue90: number;
    equipmentValid: number;
    totalEmployees: number;
    employeeCertsAttention: number;
  };
  urgentItems: UrgentItem[];
  onNavigateToEquipmentFilter: (status: ComplianceStatus | 'ALL') => void;
  onNavigateToEmployeesFilter: (status: ComplianceStatus | 'ALL') => void;
  onNavigateItem: (type: 'equipment' | 'employee', id: string) => void;
  onViewAllAlerts: () => void;
  onOpenAddEquipment: () => void;
  onOpenAddEmployee: () => void;
  onQuickAction?: (categoryType: string, targetId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  urgentItems,
  onNavigateToEquipmentFilter,
  onNavigateToEmployeesFilter,
  onNavigateItem,
  onViewAllAlerts,
  onOpenAddEquipment,
  onOpenAddEmployee,
  onQuickAction,
}) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Banner & Quick Creation Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {t('nav_dashboard')}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {t('app_tagline')}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenAddEquipment}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            {t('btn_add_equipment')}
          </button>
          <button
            type="button"
            onClick={onOpenAddEmployee}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-xs transition-colors"
          >
            <Users className="w-4 h-4 text-slate-500" />
            {t('btn_add_employee')}
          </button>
        </div>
      </div>

      {/* Grid of 8 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total Equipment */}
        <StatCard
          title={t('dash_total_equipment')}
          value={stats.totalEquipment}
          subtitle="Parc d’appareils enregistrés"
          icon={Cpu}
          variant="default"
          onClick={() => onNavigateToEquipmentFilter('ALL')}
        />

        {/* 2. Equipment Requiring Attention */}
        <StatCard
          title={t('dash_requiring_attention')}
          value={stats.equipmentRequiringAttention}
          subtitle="Échus ou échéance ≤ 90j"
          icon={ShieldAlert}
          variant={stats.equipmentRequiringAttention > 0 ? 'warning' : 'default'}
          onClick={() => onNavigateToEquipmentFilter('DUE_30')}
        />

        {/* 3. Overdue Items */}
        <StatCard
          title={t('dash_overdue_items')}
          value={stats.equipmentOverdue}
          subtitle="Date dépassée - action urgente"
          icon={AlertOctagon}
          variant={stats.equipmentOverdue > 0 ? 'danger' : 'default'}
          onClick={() => onNavigateToEquipmentFilter('OVERDUE')}
        />

        {/* 4. Items Due in 30 Days */}
        <StatCard
          title={t('dash_due_30_items')}
          value={stats.equipmentDue30}
          subtitle="À planifier ce mois-ci"
          icon={AlertTriangle}
          variant={stats.equipmentDue30 > 0 ? 'warning' : 'default'}
          onClick={() => onNavigateToEquipmentFilter('DUE_30')}
        />

        {/* 5. Items Due in 90 Days */}
        <StatCard
          title={t('dash_due_90_items')}
          value={stats.equipmentDue90}
          subtitle="À anticiper sous 3 mois"
          icon={Clock}
          variant="info"
          onClick={() => onNavigateToEquipmentFilter('DUE_90')}
        />

        {/* 6. Valid Items */}
        <StatCard
          title={t('dash_valid_items')}
          value={stats.equipmentValid}
          subtitle="Conformes (> 90 jours)"
          icon={CheckCircle2}
          variant="success"
          onClick={() => onNavigateToEquipmentFilter('VALID')}
        />

        {/* 7. Total Employees */}
        <StatCard
          title={t('dash_total_employees')}
          value={stats.totalEmployees}
          subtitle="Inspecteurs et techniciens"
          icon={Users}
          variant="default"
          onClick={() => onNavigateToEmployeesFilter('ALL')}
        />

        {/* 8. Employee Certificates Requiring Attention */}
        <StatCard
          title={t('dash_expiring_certificates')}
          value={stats.employeeCertsAttention}
          subtitle="Titres échus ou à renouveler"
          icon={Award}
          variant={stats.employeeCertsAttention > 0 ? 'danger' : 'default'}
          onClick={() => onNavigateToEmployeesFilter('OVERDUE')}
        />
      </div>

      {/* Visual Compliance Bar */}
      <ComplianceOverview
        totalEquipment={stats.totalEquipment}
        equipmentOverdue={stats.equipmentOverdue}
        equipmentDue30={stats.equipmentDue30}
        equipmentDue90={stats.equipmentDue90}
        equipmentValid={stats.equipmentValid}
        employeeCertsAttention={stats.employeeCertsAttention}
      />

      {/* Urgent Items Table */}
      <UrgentItemsTable
        items={urgentItems}
        onNavigate={onNavigateItem}
        onViewAllAlerts={onViewAllAlerts}
        onQuickAction={onQuickAction}
      />
    </div>
  );
};
