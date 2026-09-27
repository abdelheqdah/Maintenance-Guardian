import React, { useState } from 'react';
import {
  Equipment,
  CalibrationRecord,
  MaintenanceRecord,
  DocumentRecord,
  CalibrationResult,
} from '../../types';
import { useLanguage } from '../../i18n';
import { StatusBadge } from '../common/StatusBadge';
import { calculateComplianceStatus, formatDate } from '../../utils/dateUtils';
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Gauge,
  Wrench,
  FileText,
  Building2,
  Plus,
  Trash,
} from 'lucide-react';

interface EquipmentDetailProps {
  equipment: Equipment;
  calibrations: CalibrationRecord[];
  maintenance: MaintenanceRecord[];
  documents: DocumentRecord[];
  onBack: () => void;
  onEditEquipment: (equipment: Equipment) => void;
  onDeleteEquipment: (equipment: Equipment) => void;
  onAddCalibration: () => void;
  onEditCalibration: (record: CalibrationRecord) => void;
  onDeleteCalibration: (record: CalibrationRecord) => void;
  onAddMaintenance: () => void;
  onEditMaintenance: (record: MaintenanceRecord) => void;
  onDeleteMaintenance: (record: MaintenanceRecord) => void;
  onAddDocument: () => void;
  onDeleteDocument: (doc: DocumentRecord) => void;
}

type TabType = 'info' | 'history' | 'calibration' | 'maintenance' | 'documents';

export const EquipmentDetail: React.FC<EquipmentDetailProps> = ({
  equipment,
  calibrations,
  maintenance,
  documents,
  onBack,
  onEditEquipment,
  onDeleteEquipment,
  onAddCalibration,
  onEditCalibration,
  onDeleteCalibration,
  onAddMaintenance,
  onEditMaintenance,
  onDeleteMaintenance,
  onAddDocument,
  onDeleteDocument,
}) => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>('info');

  const calCalc = calculateComplianceStatus(equipment.nextCalibrationDate);
  const maintCalc = equipment.nextMaintenanceDate
    ? calculateComplianceStatus(equipment.nextMaintenanceDate)
    : null;

  const getResultBadge = (result: CalibrationResult) => {
    switch (result) {
      case 'CONFORM':
        return (
          <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
            {t('cal_res_conform')}
          </span>
        );
      case 'RESTRICTED':
        return (
          <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-amber-50 text-amber-800 border border-amber-200">
            {t('cal_res_restricted')}
          </span>
        );
      case 'ADJUSTED':
        return (
          <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-blue-50 text-blue-700 border border-blue-200">
            {t('cal_res_adjusted')}
          </span>
        );
      case 'NON_CONFORM':
        return (
          <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-rose-50 text-rose-700 border border-rose-200">
            {t('cal_res_non_conform')}
          </span>
        );
    }
  };

  const unifiedHistory = [
    ...calibrations.map((c) => ({ ...c, _historyType: 'CALIBRATION' as const })),
    ...maintenance.map((m) => ({ ...m, _historyType: 'MAINTENANCE' as const })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 text-slate-500 hover:text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs transition-colors"
            title={t('btn_back')}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {equipment.name}
              </h1>
              <span className="px-2 py-0.5 text-xs font-mono font-bold bg-slate-200 text-slate-700 rounded-md">
                {equipment.assetId}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              {equipment.manufacturer} • {equipment.model} • SN: {equipment.serialNumber}
            </p>
          </div>
        </div>

        {/* Top actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEditEquipment(equipment)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-2xs transition-colors"
          >
            <Edit2 className="w-4 h-4 text-slate-500" />
            {t('btn_edit')}
          </button>
          <button
            type="button"
            onClick={() => onDeleteEquipment(equipment)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-600 bg-white hover:bg-rose-50 border border-rose-200 rounded-xl shadow-2xs transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            {t('btn_delete')}
          </button>
        </div>
      </div>

      {/* PROMINENT STATUS BANNER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Calibration Status Box */}
        <div className={`p-5 rounded-2xl border shadow-xs ${
          calCalc.status === 'OVERDUE' ? 'bg-rose-50/70 border-rose-300' :
          calCalc.status === 'DUE_30' ? 'bg-amber-50/70 border-amber-300' :
          calCalc.status === 'DUE_90' ? 'bg-sky-50/70 border-sky-300' :
          'bg-emerald-50/70 border-emerald-300'
        }`}>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Gauge className="w-5 h-5 text-slate-700" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  {t('eq_badge_calibration')}
                </span>
              </div>
              <div className="mt-3">
                <StatusBadge
                  status={calCalc.status}
                  daysRemaining={calCalc.daysRemaining}
                  showDays={true}
                  size="lg"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={onAddCalibration}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              {t('btn_add_record')}
            </button>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200/80 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-slate-500">{t('eq_next_cal_date')} :</span>
              <span className="ml-1 font-mono font-bold text-slate-800">
                {formatDate(equipment.nextCalibrationDate, language)}
              </span>
            </div>
            <div>
              <span className="text-slate-500">{t('eq_inspection_org')} :</span>
              <span className="ml-1 font-semibold text-slate-800">
                {equipment.inspectionOrganization || '-'}
              </span>
            </div>
          </div>
        </div>

        {/* Maintenance Status Box */}
        <div className={`p-5 rounded-2xl border shadow-xs ${
          !maintCalc ? 'bg-white border-slate-200' :
          maintCalc.status === 'OVERDUE' ? 'bg-rose-50/70 border-rose-300' :
          maintCalc.status === 'DUE_30' ? 'bg-amber-50/70 border-amber-300' :
          maintCalc.status === 'DUE_90' ? 'bg-sky-50/70 border-sky-300' :
          'bg-emerald-50/70 border-emerald-300'
        }`}>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-slate-700" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  {t('eq_badge_maintenance')}
                </span>
              </div>
              <div className="mt-3">
                {maintCalc ? (
                  <StatusBadge
                    status={maintCalc.status}
                    daysRemaining={maintCalc.daysRemaining}
                    showDays={true}
                    size="lg"
                  />
                ) : (
                  <span className="text-xs text-slate-500 italic">
                    Aucune échéance de maintenance renseignée
                  </span>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={onAddMaintenance}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              {t('btn_add_record')}
            </button>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200/80 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-slate-500">{t('eq_next_maint_date')} :</span>
              <span className="ml-1 font-mono font-bold text-slate-800">
                {equipment.nextMaintenanceDate ? formatDate(equipment.nextMaintenanceDate, language) : '-'}
              </span>
            </div>
            <div>
              <span className="text-slate-500">{t('eq_last_maint_date')} :</span>
              <span className="ml-1 font-semibold text-slate-800">
                {equipment.lastMaintenanceDate ? formatDate(equipment.lastMaintenanceDate, language) : '-'}
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-500">Fréquence :</span>
              <span className="ml-1 font-semibold text-slate-800">
                {equipment.maintenancePeriodMonths ? `${equipment.maintenancePeriodMonths} mois` : '-'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('info')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'info'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Building2 className="w-4 h-4" />
          {t('eq_tab_info')}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'history'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Historique
          <span className="px-1.5 py-0.5 text-xs rounded-full bg-slate-200 text-slate-800 font-mono">
            {unifiedHistory.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('calibration')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'calibration'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Gauge className="w-4 h-4" />
          {t('eq_tab_calibration')}
          <span className="px-1.5 py-0.5 text-xs rounded-full bg-slate-200 text-slate-800 font-mono">
            {calibrations.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('maintenance')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'maintenance'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Wrench className="w-4 h-4" />
          {t('eq_tab_maintenance')}
          <span className="px-1.5 py-0.5 text-xs rounded-full bg-slate-200 text-slate-800 font-mono">
            {maintenance.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('documents')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'documents'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <FileText className="w-4 h-4" />
          {t('eq_tab_documents')}
          <span className="px-1.5 py-0.5 text-xs rounded-full bg-slate-200 text-slate-800 font-mono">
            {documents.length}
          </span>
        </button>
      </div>

      {/* TAB CONTENT */}

      {/* 1. General Info */}
      {activeTab === 'info' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Identification */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b pb-1">
                {t('eq_info_identification')}
              </h3>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <div>
                  <dt className="text-xs text-slate-500 font-medium">{t('col_equipment')}</dt>
                  <dd className="font-semibold text-slate-900">{equipment.name}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500 font-medium">{t('col_category')}</dt>
                  <dd className="font-semibold text-slate-900">{equipment.category}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500 font-medium">{t('col_asset_id')}</dt>
                  <dd className="font-mono font-bold text-slate-900">{equipment.assetId}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500 font-medium">{t('eq_codification')}</dt>
                  <dd className="font-mono text-slate-800">{equipment.codification || '-'}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500 font-medium">{t('col_manufacturer')}</dt>
                  <dd className="font-semibold text-slate-900">{equipment.manufacturer}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500 font-medium">{t('col_model')}</dt>
                  <dd className="font-semibold text-slate-900">{equipment.model || '-'}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500 font-medium">{t('col_serial')}</dt>
                  <dd className="font-mono font-bold text-slate-900">{equipment.serialNumber}</dd>
                </div>
              </dl>
            </div>

            {/* Organization */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b pb-1">
                {t('eq_info_organization')}
              </h3>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <div>
                  <dt className="text-xs text-slate-500 font-medium">{t('col_location')}</dt>
                  <dd className="font-semibold text-slate-900">{equipment.location}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500 font-medium">{t('col_status')}</dt>
                  <dd className="font-semibold text-slate-900">{equipment.availability}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-xs text-slate-500 font-medium">{t('eq_process')}</dt>
                  <dd className="font-semibold text-slate-900">{equipment.process || '-'}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500 font-medium">{t('eq_validity_period')}</dt>
                  <dd className="font-semibold text-slate-900">
                    {equipment.validityPeriodMonths ? t('eq_validity_months', { months: equipment.validityPeriodMonths }) : '-'}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500 font-medium">{t('eq_lifesheet_ref')}</dt>
                  <dd className="font-mono font-bold text-blue-700">{equipment.lifeSheetRef || '-'}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Notes */}
          {equipment.notes && (
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                {t('eq_notes')}
              </h4>
              <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
                {equipment.notes}
              </p>
            </div>
          )}
        </div>
      )}

      {/* History Timeline */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Historique des interventions
            </h3>
          </div>
          <div className="p-5">
            {unifiedHistory.length === 0 ? (
              <div className="text-center text-sm text-slate-500 italic py-8">
                Aucun historique disponible
              </div>
            ) : (
              <div className="relative border-l border-slate-200 ml-3 space-y-6">
                {unifiedHistory.map((item) => (
                  <div key={item.id} className="relative pl-6">
                    <span className={`absolute -left-2.5 top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white ring-2 ring-white ${item._historyType === 'CALIBRATION' ? 'bg-emerald-500' : 'bg-blue-500'}`}>
                      {item._historyType === 'CALIBRATION' ? <Gauge className="w-3 h-3 text-white" /> : <Wrench className="w-3 h-3 text-white" />}
                    </span>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">
                          {item._historyType === 'CALIBRATION' ? 'Étalonnage / Vérification' : 'Maintenance'}
                          {' - '}
                          {item.type}
                        </h4>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">
                          {formatDate(item.date, language)} • Par {item._historyType === 'CALIBRATION' ? (item as CalibrationRecord).performedBy : (item as MaintenanceRecord).technician}
                        </p>
                      </div>
                      {item._historyType === 'CALIBRATION' && (
                        <div className="shrink-0">
                          {getResultBadge((item as CalibrationRecord).result)}
                        </div>
                      )}
                    </div>
                    <div className="mt-2 text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200">
                      {(item as MaintenanceRecord).description || (item as CalibrationRecord).notes || '-'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. Calibration History */}
      {activeTab === 'calibration' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              {t('eq_tab_calibration')}
            </h3>
            <button
              type="button"
              onClick={onAddCalibration}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              {t('eq_btn_add_calibration')}
            </button>
          </div>

          {calibrations.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500 italic">
              {t('eq_no_records')}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">{t('col_date')}</th>
                    <th className="py-3 px-4">{t('col_type')}</th>
                    <th className="py-3 px-4">{t('col_result')}</th>
                    <th className="py-3 px-4">N° Certificat / PV</th>
                    <th className="py-3 px-4">{t('eq_inspection_org')}</th>
                    <th className="py-3 px-4">{t('col_due_date')}</th>
                    <th className="py-3 px-4 text-right">{t('col_actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {calibrations.map((cal) => (
                    <tr key={cal.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-medium whitespace-nowrap">
                        {formatDate(cal.date, language)}
                      </td>
                      <td className="py-3 px-4 text-xs font-semibold whitespace-nowrap">
                        {cal.type}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {getResultBadge(cal.result)}
                      </td>
                      <td className="py-3 px-4 font-mono text-xs whitespace-nowrap">
                        {cal.certificateNumber}
                      </td>
                      <td className="py-3 px-4 text-xs whitespace-nowrap">
                        {cal.performedBy}
                      </td>
                      <td className="py-3 px-4 font-mono text-xs font-bold text-slate-900 whitespace-nowrap">
                        {formatDate(cal.nextDueDate, language)}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => onEditCalibration(cal)}
                            className="p-1 text-slate-400 hover:text-amber-600 rounded"
                            title={t('btn_edit')}
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteCalibration(cal)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded"
                            title={t('btn_delete')}
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 3. Maintenance History */}
      {activeTab === 'maintenance' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              {t('eq_tab_maintenance')}
            </h3>
            <button
              type="button"
              onClick={onAddMaintenance}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              {t('eq_btn_add_maintenance')}
            </button>
          </div>

          {maintenance.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500 italic">
              {t('eq_no_records')}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">{t('col_date')}</th>
                    <th className="py-3 px-4">{t('col_type')}</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">{t('col_technician')}</th>
                    <th className="py-3 px-4">{t('col_cost')}</th>
                    <th className="py-3 px-4">{t('eq_next_maint_date')}</th>
                    <th className="py-3 px-4 text-right">{t('col_actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {maintenance.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-medium whitespace-nowrap">
                        {formatDate(m.date, language)}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-slate-100 text-slate-800 border">
                          {m.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs font-medium max-w-xs truncate">
                        {m.description}
                      </td>
                      <td className="py-3 px-4 text-xs whitespace-nowrap">
                        {m.technician}
                      </td>
                      <td className="py-3 px-4 text-xs font-mono font-semibold whitespace-nowrap">
                        {m.cost !== undefined ? `${m.cost.toFixed(2)} €` : '-'}
                      </td>
                      <td className="py-3 px-4 font-mono text-xs whitespace-nowrap">
                        {m.nextMaintenanceDate ? formatDate(m.nextMaintenanceDate, language) : '-'}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => onEditMaintenance(m)}
                            className="p-1 text-slate-400 hover:text-amber-600 rounded"
                            title={t('btn_edit')}
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteMaintenance(m)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded"
                            title={t('btn_delete')}
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 4. Linked Documents */}
      {activeTab === 'documents' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              {t('eq_tab_documents')}
            </h3>
            <button
              type="button"
              onClick={onAddDocument}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              {t('eq_btn_add_document')}
            </button>
          </div>

          {documents.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500 italic">
              {t('empty_no_documents')}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">{t('col_document_name')}</th>
                    <th className="py-3 px-4">{t('col_type')}</th>
                    <th className="py-3 px-4">{t('col_reference')}</th>
                    <th className="py-3 px-4">{t('col_date')}</th>
                    <th className="py-3 px-4">Fichier</th>
                    <th className="py-3 px-4 text-right">{t('col_actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {documents.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {doc.name}
                      </td>
                      <td className="py-3 px-4 text-xs font-medium whitespace-nowrap">
                        {doc.type}
                      </td>
                      <td className="py-3 px-4 font-mono text-xs whitespace-nowrap">
                        {doc.referenceNumber}
                      </td>
                      <td className="py-3 px-4 font-mono text-xs whitespace-nowrap">
                        {formatDate(doc.date, language)}
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-500 font-mono whitespace-nowrap">
                        {doc.fileName || '-'} {doc.fileSize && `(${doc.fileSize})`}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => onDeleteDocument(doc)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded"
                          title={t('btn_delete')}
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
