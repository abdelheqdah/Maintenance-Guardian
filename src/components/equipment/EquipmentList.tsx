import React, { useState, useMemo } from 'react';
import { Equipment, ComplianceStatus, EquipmentAvailability } from '../../types';
import { useLanguage } from '../../i18n';
import { StatusBadge } from '../common/StatusBadge';
import { EmptyState } from '../common/EmptyState';
import { calculateComplianceStatus, formatDate } from '../../utils/dateUtils';
import {
  Search,
  Plus,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Cpu,
  RotateCcw,
  Download,
} from 'lucide-react';
import { exportToCSV } from '../../utils/exportUtils';

interface EquipmentListProps {
  equipment: Equipment[];
  categories: string[];
  initialStatusFilter?: ComplianceStatus | 'ALL';
  onSelectEquipment: (id: string) => void;
  onAddEquipment: () => void;
  onEditEquipment: (equipment: Equipment) => void;
  onDeleteEquipment: (equipment: Equipment) => void;
}

export const EquipmentList: React.FC<EquipmentListProps> = ({
  equipment,
  categories,
  initialStatusFilter = 'ALL',
  onSelectEquipment,
  onAddEquipment,
  onEditEquipment,
  onDeleteEquipment,
}) => {
  const { t, language } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ComplianceStatus | 'ALL'>(initialStatusFilter);
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Availability badge mapping
  const getAvailabilityBadge = (avail: EquipmentAvailability) => {
    switch (avail) {
      case 'IN_SERVICE':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            {t('avail_in_service')}
          </span>
        );
      case 'UNDER_MAINTENANCE':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            {t('avail_under_maintenance')}
          </span>
        );
      case 'OUT_OF_SERVICE':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            {t('avail_out_of_service')}
          </span>
        );
      case 'IN_CALIBRATION':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            {t('avail_in_calibration')}
          </span>
        );
    }
  };

  // Filtered Equipment List
  const filteredEquipment = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return equipment.filter((item) => {
      // 1. Text Search
      if (q) {
        const matches =
          item.name.toLowerCase().includes(q) ||
          item.assetId.toLowerCase().includes(q) ||
          item.serialNumber.toLowerCase().includes(q) ||
          item.manufacturer.toLowerCase().includes(q) ||
          item.model.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q) ||
          (item.codification && item.codification.toLowerCase().includes(q)) ||
          (item.process && item.process.toLowerCase().includes(q));
        if (!matches) return false;
      }

      // 2. Status Filter
      if (statusFilter !== 'ALL') {
        const calStatus = calculateComplianceStatus(item.nextCalibrationDate).status;
        const maintStatus = item.nextMaintenanceDate
          ? calculateComplianceStatus(item.nextMaintenanceDate).status
          : 'VALID';
        if (calStatus !== statusFilter && maintStatus !== statusFilter) {
          return false;
        }
      }

      // 3. Category Filter
      if (categoryFilter !== 'ALL' && item.category !== categoryFilter) {
        return false;
      }

      return true;
    });
  }, [equipment, searchQuery, statusFilter, categoryFilter]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setCategoryFilter('ALL');
  };

  const handleExportCSV = () => {
    const headers = [
      t('col_equipment'),
      t('col_asset_id'),
      t('col_serial'),
      t('col_category'),
      t('col_manufacturer'),
      t('col_model'),
      t('col_location'),
      t('col_status'),
      t('eq_next_cal_date'),
      t('eq_next_maint_date'),
    ];

    const data = filteredEquipment.map((eq) => [
      eq.name,
      eq.assetId,
      eq.serialNumber,
      eq.category,
      eq.manufacturer,
      eq.model || '',
      eq.location,
      eq.availability,
      eq.nextCalibrationDate ? formatDate(eq.nextCalibrationDate, language) : '',
      eq.nextMaintenanceDate ? formatDate(eq.nextMaintenanceDate, language) : '',
    ]);

    exportToCSV('Equipements', headers, data);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Title & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {t('nav_equipment')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {filteredEquipment.length} {filteredEquipment.length === 1 ? 'équipement répertorié' : 'équipements répertoriés'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            Exporter
          </button>
          <button
            type="button"
            onClick={onAddEquipment}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            {t('btn_add_equipment')}
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Box */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('search_equipment_placeholder')}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ComplianceStatus | 'ALL')}
            className="px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">{t('status_all')}</option>
            <option value="OVERDUE">{t('status_overdue')}</option>
            <option value="DUE_30">{t('status_due_30')}</option>
            <option value="DUE_90">{t('status_due_90')}</option>
            <option value="VALID">{t('status_valid')}</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500 max-w-[200px]"
          >
            <option value="ALL">{t('filter_all_categories')}</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Filters */}
        {(searchQuery || statusFilter !== 'ALL' || categoryFilter !== 'ALL') && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
            title={t('btn_reset')}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Equipment Table or Empty State */}
      {filteredEquipment.length === 0 ? (
        <EmptyState
          icon={Cpu}
          title={equipment.length === 0 ? t('empty_no_equipment') : t('empty_no_results')}
          description={equipment.length === 0 ? t('empty_no_equipment_desc') : 'Essayez d’ajuster vos filtres de recherche.'}
          actionLabel={equipment.length === 0 ? t('btn_add_equipment') : undefined}
          onAction={equipment.length === 0 ? onAddEquipment : undefined}
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th scope="col" className="py-3 px-4">{t('col_equipment')}</th>
                  <th scope="col" className="py-3 px-4">{t('col_category')}</th>
                  <th scope="col" className="py-3 px-4">{t('col_location')}</th>
                  <th scope="col" className="py-3 px-4">{t('col_calibration_status')}</th>
                  <th scope="col" className="py-3 px-4">{t('col_maintenance_status')}</th>
                  <th scope="col" className="py-3 px-4 text-right">{t('col_actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredEquipment.map((item) => {
                  const calCalc = calculateComplianceStatus(item.nextCalibrationDate);
                  const maintCalc = item.nextMaintenanceDate
                    ? calculateComplianceStatus(item.nextMaintenanceDate)
                    : null;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      onClick={() => onSelectEquipment(item.id)}
                    >
                      {/* Name & Identifiers */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                          {item.name}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 font-mono">
                          <span className="font-semibold text-slate-700">{item.assetId}</span>
                          <span>•</span>
                          <span>{item.manufacturer} {item.model}</span>
                          <span>•</span>
                          <span className="text-slate-400">SN: {item.serialNumber}</span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="text-xs font-medium text-slate-600">
                          {item.category}
                        </span>
                        {item.codification && (
                          <span className="block text-[11px] font-mono text-slate-400 mt-0.5">
                            {item.codification}
                          </span>
                        )}
                      </td>

                      {/* Location & Availability */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="text-xs font-semibold text-slate-800">
                          {item.location}
                        </div>
                        <div className="mt-1">
                          {getAvailabilityBadge(item.availability)}
                        </div>
                      </td>

                      {/* Calibration Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge
                          status={calCalc.status}
                          daysRemaining={calCalc.daysRemaining}
                          showDays={true}
                          size="sm"
                        />
                        <div className="text-[11px] font-mono text-slate-500 mt-1">
                          {t('col_due_date')}: {formatDate(item.nextCalibrationDate, language)}
                        </div>
                      </td>

                      {/* Maintenance Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {maintCalc ? (
                          <>
                            <StatusBadge
                              status={maintCalc.status}
                              daysRemaining={maintCalc.daysRemaining}
                              showDays={true}
                              size="sm"
                            />
                            <div className="text-[11px] font-mono text-slate-500 mt-1">
                              {t('col_due_date')}: {formatDate(item.nextMaintenanceDate, language)}
                            </div>
                          </>
                        ) : (
                          <span className="text-xs text-slate-400 italic">
                            Non planifiée
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td
                        className="py-3.5 px-4 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onSelectEquipment(item.id)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title={t('btn_view')}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onEditEquipment(item)}
                            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title={t('btn_edit')}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteEquipment(item)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title={t('btn_delete')}
                          >
                            <Trash2 className="w-4 h-4" />
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
      )}
    </div>
  );
};
