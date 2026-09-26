import React, { useState, useEffect } from 'react';
import { CalibrationRecord, CalibrationType, CalibrationResult } from '../../types';
import { useLanguage } from '../../i18n';
import { X, Save } from 'lucide-react';
import { DEFAULT_COMPANY_ID } from '../../services/storage';

interface CalibrationModalProps {
  isOpen: boolean;
  equipmentId: string;
  record?: CalibrationRecord | null;
  onClose: () => void;
  onSave: (data: Omit<CalibrationRecord, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export const CalibrationModal: React.FC<CalibrationModalProps> = ({
  isOpen,
  equipmentId,
  record,
  onClose,
  onSave,
}) => {
  const { t } = useLanguage();
  const isEdit = Boolean(record);

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<CalibrationType>('EXTERNAL_CALIBRATION');
  const [result, setResult] = useState<CalibrationResult>('CONFORM');
  const [certificateNumber, setCertificateNumber] = useState('');
  const [performedBy, setPerformedBy] = useState('');
  const [nextDueDate, setNextDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (record) {
      setDate(record.date);
      setType(record.type);
      setResult(record.result);
      setCertificateNumber(record.certificateNumber);
      setPerformedBy(record.performedBy);
      setNextDueDate(record.nextDueDate);
      setNotes(record.notes || '');
    } else {
      const todayStr = new Date().toISOString().split('T')[0];
      setDate(todayStr);
      setType('EXTERNAL_CALIBRATION');
      setResult('CONFORM');
      setCertificateNumber('');
      setPerformedBy('');
      // Default next due date = today + 1 year
      const nextYear = new Date();
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      setNextDueDate(nextYear.toISOString().split('T')[0]);
      setNotes('');
    }
    setErrors({});
  }, [record, isOpen]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!date) errs.date = t('form_err_required');
    if (!certificateNumber.trim()) errs.certificateNumber = t('form_err_required');
    if (!performedBy.trim()) errs.performedBy = t('form_err_required');
    if (!nextDueDate) errs.nextDueDate = t('form_err_required');
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
      result,
      certificateNumber: certificateNumber.trim(),
      performedBy: performedBy.trim(),
      nextDueDate,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <h2 className="text-base font-bold">
            {isEdit ? 'Modifier étalonnage / contrôle' : t('eq_btn_add_calibration')}
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
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
              />
              {errors.date && <p className="text-[11px] text-rose-600 mt-1">{errors.date}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('eq_next_cal_date')} *
              </label>
              <input
                type="date"
                value={nextDueDate}
                onChange={(e) => setNextDueDate(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 font-semibold focus:ring-2 focus:ring-blue-500"
              />
              {errors.nextDueDate && <p className="text-[11px] text-rose-600 mt-1">{errors.nextDueDate}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('col_type')} *
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as CalibrationType)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="EXTERNAL_CALIBRATION">{t('cal_type_external')}</option>
                <option value="INTERNAL_CALIBRATION">{t('cal_type_internal')}</option>
                <option value="PERIODIC_INSPECTION">{t('cal_type_periodic')}</option>
                <option value="LEGAL_METROLOGY">{t('cal_type_legal')}</option>
                <option value="SAFETY_AUDIT">{t('cal_type_safety')}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('col_result')} *
              </label>
              <select
                value={result}
                onChange={(e) => setResult(e.target.value as CalibrationResult)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 font-semibold"
              >
                <option value="CONFORM">{t('cal_res_conform')}</option>
                <option value="RESTRICTED">{t('cal_res_restricted')}</option>
                <option value="ADJUSTED">{t('cal_res_adjusted')}</option>
                <option value="NON_CONFORM">{t('cal_res_non_conform')}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              N° Certificat / PV d'étalonnage *
            </label>
            <input
              type="text"
              value={certificateNumber}
              onChange={(e) => setCertificateNumber(e.target.value)}
              placeholder="ex: CERT-2024-CAL-9912"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 font-mono focus:ring-2 focus:ring-blue-500"
            />
            {errors.certificateNumber && <p className="text-[11px] text-rose-600 mt-1">{errors.certificateNumber}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t('eq_inspection_org')} / Métrologue *
            </label>
            <input
              type="text"
              value={performedBy}
              onChange={(e) => setPerformedBy(e.target.value)}
              placeholder="ex: Trescal, Apave, Bureau Veritas, CETIM..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
            />
            {errors.performedBy && <p className="text-[11px] text-rose-600 mt-1">{errors.performedBy}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t('eq_notes')}
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Constat de vérification, incertitudes, dérive mesurée..."
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
