import React, { useState, useEffect } from 'react';
import { Equipment, EquipmentAvailability } from '../../types';
import { useLanguage } from '../../i18n';
import { X, Save } from 'lucide-react';
import { DEFAULT_COMPANY_ID } from '../../services/storage';

interface EquipmentFormModalProps {
  isOpen: boolean;
  equipment?: Equipment | null; // If null, create mode; if set, edit mode
  onClose: () => void;
  onSave: (data: Omit<Equipment, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export const EquipmentFormModal: React.FC<EquipmentFormModalProps> = ({
  isOpen,
  equipment,
  onClose,
  onSave,
}) => {
  const { t } = useLanguage();

  const isEdit = Boolean(equipment);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Contrôle Non Destructif (CND)',
    assetId: '',
    codification: '',
    manufacturer: '',
    model: '',
    serialNumber: '',
    location: '',
    process: '',
    availability: 'IN_SERVICE' as EquipmentAvailability,
    lastCalibrationDate: '',
    nextCalibrationDate: '',
    validityPeriodMonths: 12,
    inspectionOrganization: '',
    lastMaintenanceDate: '',
    nextMaintenanceDate: '',
    maintenancePeriodMonths: 0,
    lifeSheetRef: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (equipment) {
      setFormData({
        name: equipment.name || '',
        category: equipment.category || 'Contrôle Non Destructif (CND)',
        assetId: equipment.assetId || '',
        codification: equipment.codification || '',
        manufacturer: equipment.manufacturer || '',
        model: equipment.model || '',
        serialNumber: equipment.serialNumber || '',
        location: equipment.location || '',
        process: equipment.process || '',
        availability: equipment.availability || 'IN_SERVICE',
        lastCalibrationDate: equipment.lastCalibrationDate || '',
        nextCalibrationDate: equipment.nextCalibrationDate || '',
        validityPeriodMonths: equipment.validityPeriodMonths || 12,
        inspectionOrganization: equipment.inspectionOrganization || '',
        lastMaintenanceDate: equipment.lastMaintenanceDate || '',
        nextMaintenanceDate: equipment.nextMaintenanceDate || '',
        maintenancePeriodMonths: equipment.maintenancePeriodMonths || 0,
        lifeSheetRef: equipment.lifeSheetRef || '',
        notes: equipment.notes || '',
      });
      setErrors({});
    } else {
      // Default initial form
      setFormData({
        name: '',
        category: 'Contrôle Non Destructif (CND)',
        assetId: '',
        codification: '',
        manufacturer: '',
        model: '',
        serialNumber: '',
        location: 'Atelier Principal',
        process: '',
        availability: 'IN_SERVICE',
        lastCalibrationDate: new Date().toISOString().split('T')[0],
        nextCalibrationDate: '',
        validityPeriodMonths: 12,
        inspectionOrganization: '',
        lastMaintenanceDate: '',
        nextMaintenanceDate: '',
        maintenancePeriodMonths: 0,
        lifeSheetRef: '',
        notes: '',
      });
      setErrors({});
    }
  }, [equipment, isOpen]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = t('form_err_required');
    if (!formData.assetId.trim()) newErrors.assetId = t('form_err_required');
    if (!formData.serialNumber.trim()) newErrors.serialNumber = t('form_err_required');
    if (!formData.manufacturer.trim()) newErrors.manufacturer = t('form_err_required');
    if (!formData.location.trim()) newErrors.location = t('form_err_required');
    if (!formData.nextCalibrationDate.trim()) newErrors.nextCalibrationDate = t('form_err_required');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      companyId: DEFAULT_COMPANY_ID,
      name: formData.name.trim(),
      category: formData.category.trim(),
      assetId: formData.assetId.trim(),
      codification: formData.codification.trim() || undefined,
      manufacturer: formData.manufacturer.trim(),
      model: formData.model.trim(),
      serialNumber: formData.serialNumber.trim(),
      location: formData.location.trim(),
      process: formData.process.trim() || undefined,
      availability: formData.availability,
      lastCalibrationDate: formData.lastCalibrationDate || undefined,
      nextCalibrationDate: formData.nextCalibrationDate,
      validityPeriodMonths: Number(formData.validityPeriodMonths) || 12,
      inspectionOrganization: formData.inspectionOrganization.trim() || undefined,
      lastMaintenanceDate: formData.lastMaintenanceDate || undefined,
      nextMaintenanceDate: formData.nextMaintenanceDate || undefined,
      maintenancePeriodMonths: Number(formData.maintenancePeriodMonths) || undefined,
      lifeSheetRef: formData.lifeSheetRef.trim() || undefined,
      notes: formData.notes.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full my-8 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold">
              {isEdit ? t('btn_edit') + ' : ' + equipment?.name : t('btn_add_equipment')}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {t('form_required_fields')}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Section 1: Identification */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wider border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
              <span>1. {t('eq_info_identification')}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('col_equipment')} *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="ex: Mesureur d'épaisseur 38DL"
                  className={`w-full px-3 py-2 text-sm rounded-lg border ${
                    errors.name ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                  } focus:outline-hidden focus:ring-2 focus:ring-blue-500`}
                />
                {errors.name && <p className="text-[11px] text-rose-600 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('col_category')} *
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="ex: Contrôle Non Destructif (CND), Électricité..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('col_asset_id')} *
                </label>
                <input
                  type="text"
                  value={formData.assetId}
                  onChange={(e) => setFormData({ ...formData, assetId: e.target.value })}
                  placeholder="ex: EQ-CND-001"
                  className={`w-full px-3 py-2 text-sm rounded-lg border font-mono ${
                    errors.assetId ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                  } focus:outline-hidden focus:ring-2 focus:ring-blue-500`}
                />
                {errors.assetId && <p className="text-[11px] text-rose-600 mt-1">{errors.assetId}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('eq_codification')}
                </label>
                <input
                  type="text"
                  value={formData.codification}
                  onChange={(e) => setFormData({ ...formData, codification: e.target.value })}
                  placeholder="ex: CND-US-38DL"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('col_manufacturer')} *
                </label>
                <input
                  type="text"
                  value={formData.manufacturer}
                  onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                  placeholder="ex: Evident / Olympus, Fluke, Testo..."
                  className={`w-full px-3 py-2 text-sm rounded-lg border ${
                    errors.manufacturer ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                  } focus:outline-hidden focus:ring-2 focus:ring-blue-500`}
                />
                {errors.manufacturer && <p className="text-[11px] text-rose-600 mt-1">{errors.manufacturer}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('col_model')}
                </label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  placeholder="ex: 38DL Plus High-Precision"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('col_serial')} *
                </label>
                <input
                  type="text"
                  value={formData.serialNumber}
                  onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                  placeholder="ex: 38DL-94821"
                  className={`w-full px-3 py-2 text-sm rounded-lg border font-mono ${
                    errors.serialNumber ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                  } focus:outline-hidden focus:ring-2 focus:ring-blue-500`}
                />
                {errors.serialNumber && <p className="text-[11px] text-rose-600 mt-1">{errors.serialNumber}</p>}
              </div>
            </div>
          </div>

          {/* Section 2: Organization & Availability */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wider border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
              <span>2. {t('eq_info_organization')}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('col_location')} *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="ex: Atelier CND, Véhicule 01..."
                  className={`w-full px-3 py-2 text-sm rounded-lg border ${
                    errors.location ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                  } focus:outline-hidden focus:ring-2 focus:ring-blue-500`}
                />
                {errors.location && <p className="text-[11px] text-rose-600 mt-1">{errors.location}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('eq_process')}
                </label>
                <input
                  type="text"
                  value={formData.process}
                  onChange={(e) => setFormData({ ...formData, process: e.target.value })}
                  placeholder="ex: Contrôle DESP tuyauteries..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('col_status')} / Disponibilité
                </label>
                <select
                  value={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.value as EquipmentAvailability })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  <option value="IN_SERVICE">{t('avail_in_service')}</option>
                  <option value="UNDER_MAINTENANCE">{t('avail_under_maintenance')}</option>
                  <option value="OUT_OF_SERVICE">{t('avail_out_of_service')}</option>
                  <option value="IN_CALIBRATION">{t('avail_in_calibration')}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Calibration / Inspection */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wider border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
              <span>3. {t('eq_tab_calibration')}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('eq_last_cal_date')}
                </label>
                <input
                  type="date"
                  value={formData.lastCalibrationDate}
                  onChange={(e) => setFormData({ ...formData, lastCalibrationDate: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('eq_next_cal_date')} *
                </label>
                <input
                  type="date"
                  value={formData.nextCalibrationDate}
                  onChange={(e) => setFormData({ ...formData, nextCalibrationDate: e.target.value })}
                  className={`w-full px-3 py-2 text-sm rounded-lg border font-semibold ${
                    errors.nextCalibrationDate ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                  } focus:outline-hidden focus:ring-2 focus:ring-blue-500`}
                />
                {errors.nextCalibrationDate && (
                  <p className="text-[11px] text-rose-600 mt-1">{errors.nextCalibrationDate}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('eq_validity_period')} (mois)
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={formData.validityPeriodMonths}
                  onChange={(e) => setFormData({ ...formData, validityPeriodMonths: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('eq_inspection_org')}
                </label>
                <input
                  type="text"
                  value={formData.inspectionOrganization}
                  onChange={(e) => setFormData({ ...formData, inspectionOrganization: e.target.value })}
                  placeholder="ex: Apave, Bureau Veritas, CETIM..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Maintenance */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wider border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
              <span>4. {t('eq_tab_maintenance')}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('eq_last_maint_date')}
                </label>
                <input
                  type="date"
                  value={formData.lastMaintenanceDate}
                  onChange={(e) => setFormData({ ...formData, lastMaintenanceDate: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('eq_next_maint_date')}
                </label>
                <input
                  type="date"
                  value={formData.nextMaintenanceDate}
                  onChange={(e) => setFormData({ ...formData, nextMaintenanceDate: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Fréquence Maintenance (mois)
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={formData.maintenancePeriodMonths || ''}
                  onChange={(e) => setFormData({ ...formData, maintenancePeriodMonths: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  placeholder="ex: 12"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Traceability & Notes */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wider border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
              <span>5. {t('eq_info_lifesheet')} & {t('eq_notes')}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('eq_lifesheet_ref')}
                </label>
                <input
                  type="text"
                  value={formData.lifeSheetRef}
                  onChange={(e) => setFormData({ ...formData, lifeSheetRef: e.target.value })}
                  placeholder="ex: FDV-2024-CND-001"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('eq_notes')}
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Accessoires inclus, particularités, restrictions..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
            >
              {t('btn_cancel')}
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors"
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
