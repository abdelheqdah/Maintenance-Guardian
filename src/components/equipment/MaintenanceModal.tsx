import React, { useState, useEffect } from 'react';
import { MaintenanceRecord, MaintenanceType } from '../../types';
import { useLanguage } from '../../i18n';
import { X, Save } from 'lucide-react';
import { DEFAULT_COMPANY_ID } from '../../services/storage';

interface MaintenanceModalProps {
  isOpen: boolean;
  equipmentId: string;
  maintenancePeriodMonths?: number;
  record?: MaintenanceRecord | null;
  onClose: () => void;
  onSave: (data: Omit<MaintenanceRecord, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export const MaintenanceModal: React.FC<MaintenanceModalProps> = ({
  isOpen,
  equipmentId,
  maintenancePeriodMonths,
  record,
  onClose,
  onSave,
}) => {
  const { t } = useLanguage();
  const isEdit = Boolean(record);

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<MaintenanceType>('PREVENTIVE');
  const [description, setDescription] = useState('');
  const [technician, setTechnician] = useState('');
  const [cost, setCost] = useState<string>('');
  const [nextMaintenanceDate, setNextMaintenanceDate] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (record) {
      setDate(record.date);
      setType(record.type);
      setDescription(record.description);
      setTechnician(record.technician);
      setCost(record.cost !== undefined ? String(record.cost) : '');
      setNextMaintenanceDate(record.nextMaintenanceDate || '');
      setNotes(record.notes || '');
    } else {
      const todayStr = new Date().toISOString().split('T')[0];
      setDate(todayStr);
      setType('PREVENTIVE');
      setDescription('');
      setTechnician('');
      setCost('');
      
      let defaultNextStr = '';
      if (maintenancePeriodMonths) {
        const nextDate = new Date();
        nextDate.setMonth(nextDate.getMonth() + maintenancePeriodMonths);
        defaultNextStr = nextDate.toISOString().split('T')[0];
      }
      setNextMaintenanceDate(defaultNextStr);
      
      setNotes('');
    }
    setErrors({});
  }, [record, isOpen, maintenancePeriodMonths]);

  // Recalculate nextMaintenanceDate if date changes and it's a new record
  const handleDateChange = (newDateStr: string) => {
    setDate(newDateStr);
    if (!record && maintenancePeriodMonths && newDateStr) {
      const parsedDate = new Date(newDateStr);
      if (!isNaN(parsedDate.getTime())) {
        parsedDate.setMonth(parsedDate.getMonth() + maintenancePeriodMonths);
        setNextMaintenanceDate(parsedDate.toISOString().split('T')[0]);
      }
    }
  };

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!date) errs.date = t('form_err_required');
    if (!description.trim()) errs.description = t('form_err_required');
    if (!technician.trim()) errs.technician = t('form_err_required');
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      equipmentId,
      companyId: DEFAULT_COMPANY_ID,
      date,
      type,
      description: description.trim(),
      technician: technician.trim(),
      cost: cost ? parseFloat(cost) : undefined,
      nextMaintenanceDate: nextMaintenanceDate || undefined,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <h2 className="text-base font-bold">
            {isEdit ? 'Modifier intervention de maintenance' : t('eq_btn_add_maintenance')}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('col_date')} *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => handleDateChange(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
              />
              {errors.date && <p className="text-[11px] text-rose-600 mt-1">{errors.date}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('col_type')} *
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as MaintenanceType)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="PREVENTIVE">{t('maint_type_preventive')}</option>
                <option value="CORRECTIVE">{t('maint_type_corrective')}</option>
                <option value="INSPECTION">{t('maint_type_inspection')}</option>
                <option value="OVERHAUL">{t('maint_type_overhaul')}</option>
                <option value="OTHER">{t('maint_type_other')}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description des travaux réalisés *
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ex: Remplacement des joints, vidange, mise à jour software..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
            />
            {errors.description && <p className="text-[11px] text-rose-600 mt-1">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('col_technician')} *
              </label>
              <input
                type="text"
                value={technician}
                onChange={(e) => setTechnician(e.target.value)}
                placeholder="ex: Luc Moreau, SAV Constructeur..."
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
              />
              {errors.technician && <p className="text-[11px] text-rose-600 mt-1">{errors.technician}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('col_cost')}
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                placeholder="ex: 450.00"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t('eq_next_maint_date')}
            </label>
            <input
              type="date"
              value={nextMaintenanceDate}
              onChange={(e) => setNextMaintenanceDate(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t('eq_notes')}
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Pièces détachées remplacées, observations..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50"
            >
              {t('btn_cancel')}
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
            >
              <Save className="w-4 h-4" />
              {t('btn_save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
