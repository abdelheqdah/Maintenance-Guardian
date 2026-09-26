import React, { useState, useEffect } from 'react';
import { Employee } from '../../types';
import { useLanguage } from '../../i18n';
import { X, Save, Users, Award } from 'lucide-react';
import { DEFAULT_COMPANY_ID } from '../../services/storage';

interface EmployeeFormModalProps {
  isOpen: boolean;
  employee?: Employee | null;
  onClose: () => void;
  onSave: (data: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({
  isOpen,
  employee,
  onClose,
  onSave,
}) => {
  const { t } = useLanguage();
  const isEdit = Boolean(employee);

  const [name, setName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [position, setPosition] = useState('');
  const [department, setDepartment] = useState('');
  const [certificateName, setCertificateName] = useState('');
  const [certificateNumber, setCertificateNumber] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (employee) {
      setName(employee.name);
      setEmployeeId(employee.employeeId);
      setPosition(employee.position);
      setDepartment(employee.department || '');
      setCertificateName(employee.certificateName);
      setCertificateNumber(employee.certificateNumber);
      setIssueDate(employee.issueDate || '');
      setExpiryDate(employee.expiryDate);
      setNotes(employee.notes || '');
    } else {
      setName('');
      setEmployeeId('');
      setPosition('');
      setDepartment('');
      setCertificateName('');
      setCertificateNumber('');
      setIssueDate(new Date().toISOString().split('T')[0]);
      // Default expiry date: 1 year from today
      const nextYear = new Date();
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      setExpiryDate(nextYear.toISOString().split('T')[0]);
      setNotes('');
    }
    setErrors({});
  }, [employee, isOpen]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = t('form_err_required');
    if (!employeeId.trim()) errs.employeeId = t('form_err_required');
    if (!position.trim()) errs.position = t('form_err_required');
    if (!certificateName.trim()) errs.certificateName = t('form_err_required');
    if (!certificateNumber.trim()) errs.certificateNumber = t('form_err_required');
    if (!expiryDate) errs.expiryDate = t('form_err_required');
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      companyId: DEFAULT_COMPANY_ID,
      name: name.trim(),
      employeeId: employeeId.trim(),
      position: position.trim(),
      department: department.trim() || undefined,
      certificateName: certificateName.trim(),
      certificateNumber: certificateNumber.trim(),
      issueDate: issueDate || undefined,
      expiryDate,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full my-8 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold">
              {isEdit ? t('btn_edit') + ' : ' + employee?.name : t('btn_add_employee')}
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
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Section 1: Employee info */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wider border-b pb-1">
              1. Informations Collaborateur
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nom & Prénom *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ex: Jean-Pierre Laurent"
                  className={`w-full px-3 py-2 text-sm rounded-lg border ${
                    errors.name ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                  } focus:ring-2 focus:ring-blue-500`}
                />
                {errors.name && <p className="text-[11px] text-rose-600 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Matricule / Identifiant RH *
                </label>
                <input
                  type="text"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  placeholder="ex: MAT-2024-042"
                  className={`w-full px-3 py-2 text-sm rounded-lg border font-mono ${
                    errors.employeeId ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                  } focus:ring-2 focus:ring-blue-500`}
                />
                {errors.employeeId && <p className="text-[11px] text-rose-600 mt-1">{errors.employeeId}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Poste / Fonction *
                </label>
                <input
                  type="text"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="ex: Inspecteur CND Ultrasons, Métrologue..."
                  className={`w-full px-3 py-2 text-sm rounded-lg border ${
                    errors.position ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                  } focus:ring-2 focus:ring-blue-500`}
                />
                {errors.position && <p className="text-[11px] text-rose-600 mt-1">{errors.position}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Service / Département
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="ex: Contrôle Qualité, Maintenance..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Certificate details */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wider border-b pb-1 flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              <span>2. Titre, Habilitation ou Certification</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Intitulé de la certification / habilitation *
              </label>
              <input
                type="text"
                value={certificateName}
                onChange={(e) => setCertificateName(e.target.value)}
                placeholder="ex: COFREND UT Niveau 2 (EN ISO 9712), Habilitation B2V..."
                className={`w-full px-3 py-2 text-sm rounded-lg border ${
                  errors.certificateName ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                } focus:ring-2 focus:ring-blue-500`}
              />
              {errors.certificateName && <p className="text-[11px] text-rose-600 mt-1">{errors.certificateName}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  N° de Titre / Certificat *
                </label>
                <input
                  type="text"
                  value={certificateNumber}
                  onChange={(e) => setCertificateNumber(e.target.value)}
                  placeholder="ex: COF-UT2-88412"
                  className={`w-full px-3 py-2 text-sm rounded-lg border font-mono ${
                    errors.certificateNumber ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                  } focus:ring-2 focus:ring-blue-500`}
                />
                {errors.certificateNumber && (
                  <p className="text-[11px] text-rose-600 mt-1">{errors.certificateNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Date de délivrance
                </label>
                <input
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Date d'expiration *
                </label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className={`w-full px-3 py-2 text-sm rounded-lg border font-semibold ${
                    errors.expiryDate ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                  } focus:ring-2 focus:ring-blue-500`}
                />
                {errors.expiryDate && (
                  <p className="text-[11px] text-rose-600 mt-1">{errors.expiryDate}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t('eq_notes')}
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Session de recyclage prévue, organisme de formation, restriction d'aptitude..."
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
