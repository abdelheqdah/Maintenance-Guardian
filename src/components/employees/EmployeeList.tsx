import React, { useState, useMemo } from 'react';
import { Employee, ComplianceStatus } from '../../types';
import { useLanguage } from '../../i18n';
import { StatusBadge } from '../common/StatusBadge';
import { EmptyState } from '../common/EmptyState';
import { calculateComplianceStatus, formatDate } from '../../utils/dateUtils';
import {
  Search,
  Plus,
  Filter,
  Edit2,
  Trash2,
  Users,
  Award,
  RotateCcw,
  Download,
} from 'lucide-react';
import { exportToCSV } from '../../utils/exportUtils';

interface EmployeeListProps {
  employees: Employee[];
  initialStatusFilter?: ComplianceStatus | 'ALL';
  onAddEmployee: () => void;
  onEditEmployee: (employee: Employee) => void;
  onDeleteEmployee: (employee: Employee) => void;
}

export const EmployeeList: React.FC<EmployeeListProps> = ({
  employees,
  initialStatusFilter = 'ALL',
  onAddEmployee,
  onEditEmployee,
  onDeleteEmployee,
}) => {
  const { t, language } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ComplianceStatus | 'ALL'>(initialStatusFilter);

  const filteredEmployees = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return employees.filter((emp) => {
      // 1. Search text
      if (q) {
        const matches =
          emp.name.toLowerCase().includes(q) ||
          emp.employeeId.toLowerCase().includes(q) ||
          emp.position.toLowerCase().includes(q) ||
          emp.certificateName.toLowerCase().includes(q) ||
          emp.certificateNumber.toLowerCase().includes(q) ||
          (emp.department && emp.department.toLowerCase().includes(q));
        if (!matches) return false;
      }

      // 2. Status filter
      if (statusFilter !== 'ALL') {
        const status = calculateComplianceStatus(emp.expiryDate).status;
        if (status !== statusFilter) return false;
      }

      return true;
    });
  }, [employees, searchQuery, statusFilter]);

  const handleExportCSV = () => {
    const headers = [
      t('col_employee'),
      'ID',
      t('col_position'),
      'Département',
      'Certificat/Habilitation',
      'N° Certificat',
      'Délivré par',
      "Date d'obtention",
      "Date d'expiration",
    ];

    const data = filteredEmployees.map((emp) => [
      emp.name,
      emp.employeeId,
      emp.position,
      emp.department || '',
      emp.certificateName,
      emp.certificateNumber,
      '', // No issuingAuthority on Employee
      emp.issueDate ? formatDate(emp.issueDate, language) : '',
      formatDate(emp.expiryDate, language),
    ]);

    exportToCSV('Collaborateurs', headers, data);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {t('nav_employees')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {filteredEmployees.length} {filteredEmployees.length === 1 ? 'collaborateur répertorié' : 'collaborateurs répertoriés'}
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
            onClick={onAddEmployee}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            {t('btn_add_employee')}
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('search_employee_placeholder')}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
          />
        </div>

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

        {(searchQuery || statusFilter !== 'ALL') && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('ALL');
            }}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
            title={t('btn_reset')}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Table or Empty State */}
      {filteredEmployees.length === 0 ? (
        <EmptyState
          icon={Users}
          title={employees.length === 0 ? t('empty_no_employees') : t('empty_no_results')}
          description={employees.length === 0 ? t('empty_no_employees_desc') : 'Ajustez vos filtres pour voir les collaborateurs.'}
          actionLabel={employees.length === 0 ? t('btn_add_employee') : undefined}
          onAction={employees.length === 0 ? onAddEmployee : undefined}
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th scope="col" className="py-3 px-4">{t('col_employee')}</th>
                  <th scope="col" className="py-3 px-4">{t('col_employee_id')}</th>
                  <th scope="col" className="py-3 px-4">{t('col_certificate')}</th>
                  <th scope="col" className="py-3 px-4">{t('col_expiry_date')}</th>
                  <th scope="col" className="py-3 px-4">{t('col_status')}</th>
                  <th scope="col" className="py-3 px-4 text-right">{t('col_actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredEmployees.map((emp) => {
                  const certCalc = calculateComplianceStatus(emp.expiryDate);

                  return (
                    <tr
                      key={emp.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      {/* Name & Role */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 leading-tight">
                          {emp.name}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {emp.position} {emp.department && `• ${emp.department}`}
                        </div>
                      </td>

                      {/* Employee ID */}
                      <td className="py-3.5 px-4 font-mono font-medium text-xs whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-slate-100 border text-slate-700">
                          {emp.employeeId}
                        </span>
                      </td>

                      {/* Certificate details */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-800 text-xs">
                          <Award className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>{emp.certificateName}</span>
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                          N° {emp.certificateNumber}
                        </div>
                      </td>

                      {/* Expiry date */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-mono text-xs font-bold text-slate-900">
                          {formatDate(emp.expiryDate, language)}
                        </span>
                        <span className="block text-[11px] text-slate-400">
                          {certCalc.daysRemaining < 0
                            ? `Expiré il y a ${Math.abs(certCalc.daysRemaining)} j`
                            : `${certCalc.daysRemaining} j restants`}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge
                          status={certCalc.status}
                          daysRemaining={certCalc.daysRemaining}
                          showDays={true}
                          size="sm"
                        />
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onEditEmployee(emp)}
                            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title={t('btn_edit')}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteEmployee(emp)}
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
