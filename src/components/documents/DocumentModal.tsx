import React, { useState, useEffect } from 'react';
import { DocumentRecord, DocumentType, AssociatedRecordType } from '../../types';
import { useLanguage } from '../../i18n';
import { X, Save, FileText, Upload } from 'lucide-react';
import { DEFAULT_COMPANY_ID } from '../../services/storage';

interface DocumentModalProps {
  isOpen: boolean;
  associatedType?: AssociatedRecordType;
  associatedId?: string;
  associatedName?: string;
  onClose: () => void;
  onSave: (data: Omit<DocumentRecord, 'id' | 'createdAt'>) => void;
}

export const DocumentModal: React.FC<DocumentModalProps> = ({
  isOpen,
  associatedType = 'EQUIPMENT',
  associatedId = '',
  associatedName = '',
  onClose,
  onSave,
}) => {
  const { t } = useLanguage();

  const [name, setName] = useState('');
  const [type, setType] = useState<DocumentType>('CALIBRATION_CERTIFICATE');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setName('');
    setType('CALIBRATION_CERTIFICATE');
    setReferenceNumber('');
    setDate(new Date().toISOString().split('T')[0]);
    setFileName('');
    setFileSize('');
    setNotes('');
    setErrors({});
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      setFileSize(`${sizeMb} MB`);
      if (!name) {
        setName(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = t('form_err_required');
    if (!referenceNumber.trim()) errs.referenceNumber = t('form_err_required');
    if (!date) errs.date = t('form_err_required');
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      companyId: DEFAULT_COMPANY_ID,
      name: name.trim(),
      type,
      referenceNumber: referenceNumber.trim(),
      date,
      associatedType,
      associatedId,
      associatedName,
      fileName: fileName || `${name.replace(/\s+/g, '_')}.pdf`,
      fileSize: fileSize || '1.2 MB',
      notes: notes.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold">
              {t('eq_btn_add_document')}
            </h2>
          </div>
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
          {associatedName && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
              <span className="font-semibold text-slate-800">Élément lié : </span>
              {associatedName}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t('col_document_name')} *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ex: Certificat d'étalonnage COFRAC 2024"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && <p className="text-[11px] text-rose-600 mt-1">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('col_type')} *
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as DocumentType)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="CALIBRATION_CERTIFICATE">{t('doc_type_cal_cert')}</option>
                <option value="MAINTENANCE_REPORT">{t('doc_type_maint_rep')}</option>
                <option value="USER_MANUAL">{t('doc_type_manual')}</option>
                <option value="COMPLIANCE_CERTIFICATE">{t('doc_type_compliance')}</option>
                <option value="EMPLOYEE_CERTIFICATE">{t('doc_type_emp_cert')}</option>
                <option value="TECHNICAL_SHEET">{t('doc_type_tech_sheet')}</option>
                <option value="OTHER">{t('doc_type_other')}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('col_reference')} *
              </label>
              <input
                type="text"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                placeholder="ex: CERT-2024-001"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 font-mono focus:ring-2 focus:ring-blue-500"
              />
              {errors.referenceNumber && <p className="text-[11px] text-rose-600 mt-1">{errors.referenceNumber}</p>}
            </div>
          </div>

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

          {/* File Picker Metadata Simulation */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Fichier joint (Métadonnées V1)
            </label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors">
                <Upload className="w-4 h-4" />
                <span>Sélectionner fichier</span>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <span className="text-xs text-slate-500 truncate">
                {fileName || 'Aucun fichier sélectionné (nom automatique par défaut)'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Note : En V1, les métadonnées de conformité sont enregistrées localement sans saturer le stockage navigateur.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t('eq_notes')}
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Organisme émetteur, clauses particulières..."
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
