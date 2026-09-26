import React, { useState, useMemo } from 'react';
import { DocumentRecord, DocumentType } from '../../types';
import { useLanguage } from '../../i18n';
import { formatDate } from '../../utils/dateUtils';
import { EmptyState } from '../common/EmptyState';
import {
  FileText,
  Search,
  Plus,
  Trash2,
  Cpu,
  Users,
  RotateCcw,
} from 'lucide-react';

interface DocumentsViewProps {
  documents: DocumentRecord[];
  onAddDocument: () => void;
  onDeleteDocument: (doc: DocumentRecord) => void;
  onNavigateItem: (type: 'equipment' | 'employee', id: string) => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  documents,
  onAddDocument,
  onDeleteDocument,
  onNavigateItem,
}) => {
  const { t, language } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<DocumentType | 'ALL'>('ALL');

  const filteredDocuments = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return documents.filter((doc) => {
      if (q) {
        const matches =
          doc.name.toLowerCase().includes(q) ||
          doc.referenceNumber.toLowerCase().includes(q) ||
          (doc.associatedName && doc.associatedName.toLowerCase().includes(q)) ||
          (doc.notes && doc.notes.toLowerCase().includes(q));
        if (!matches) return false;
      }

      if (typeFilter !== 'ALL' && doc.type !== typeFilter) {
        return false;
      }

      return true;
    });
  }, [documents, searchQuery, typeFilter]);

  const getTypeLabel = (type: DocumentType) => {
    switch (type) {
      case 'CALIBRATION_CERTIFICATE':
        return t('doc_type_cal_cert');
      case 'MAINTENANCE_REPORT':
        return t('doc_type_maint_rep');
      case 'USER_MANUAL':
        return t('doc_type_manual');
      case 'COMPLIANCE_CERTIFICATE':
        return t('doc_type_compliance');
      case 'EMPLOYEE_CERTIFICATE':
        return t('doc_type_emp_cert');
      case 'TECHNICAL_SHEET':
        return t('doc_type_tech_sheet');
      case 'OTHER':
      default:
        return t('doc_type_other');
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {t('nav_documents')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {filteredDocuments.length} documents et certificats référencés
          </p>
        </div>

        <button
          type="button"
          onClick={onAddDocument}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          {t('eq_btn_add_document')}
        </button>
      </div>

      {/* Toolbar */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par nom de document, référence, élément lié..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
          />
        </div>

        <div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as DocumentType | 'ALL')}
            className="px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">Tous les types de documents</option>
            <option value="CALIBRATION_CERTIFICATE">{t('doc_type_cal_cert')}</option>
            <option value="MAINTENANCE_REPORT">{t('doc_type_maint_rep')}</option>
            <option value="USER_MANUAL">{t('doc_type_manual')}</option>
            <option value="COMPLIANCE_CERTIFICATE">{t('doc_type_compliance')}</option>
            <option value="EMPLOYEE_CERTIFICATE">{t('doc_type_emp_cert')}</option>
            <option value="TECHNICAL_SHEET">{t('doc_type_tech_sheet')}</option>
            <option value="OTHER">{t('doc_type_other')}</option>
          </select>
        </div>

        {(searchQuery || typeFilter !== 'ALL') && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setTypeFilter('ALL');
            }}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
            title={t('btn_reset')}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Table */}
      {filteredDocuments.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={documents.length === 0 ? 'Aucun document enregistré' : t('empty_no_results')}
          description={documents.length === 0 ? 'Associez des PV d’étalonnage, fiches constructeurs ou habilitations.' : 'Modifiez vos critères de recherche.'}
          actionLabel={documents.length === 0 ? t('eq_btn_add_document') : undefined}
          onAction={documents.length === 0 ? onAddDocument : undefined}
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th scope="col" className="py-3 px-4">{t('col_document_name')}</th>
                  <th scope="col" className="py-3 px-4">{t('col_type')}</th>
                  <th scope="col" className="py-3 px-4">{t('col_reference')}</th>
                  <th scope="col" className="py-3 px-4">Élément Associé</th>
                  <th scope="col" className="py-3 px-4">{t('col_date')}</th>
                  <th scope="col" className="py-3 px-4 text-right">{t('col_actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredDocuments.map((doc) => {
                  const isEquipment = doc.associatedType === 'EQUIPMENT';

                  return (
                    <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 leading-tight">
                          {doc.name}
                        </div>
                        <div className="text-xs text-slate-400 font-mono mt-0.5">
                          {doc.fileName} {doc.fileSize && `• ${doc.fileSize}`}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 border text-slate-700">
                          {getTypeLabel(doc.type)}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-xs font-medium whitespace-nowrap">
                        {doc.referenceNumber}
                      </td>

                      <td className="py-3.5 px-4">
                        {doc.associatedName ? (
                          <button
                            type="button"
                            onClick={() => onNavigateItem(isEquipment ? 'equipment' : 'employee', doc.associatedId)}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {isEquipment ? <Cpu className="w-3.5 h-3.5" /> : <Users className="w-3.5 h-3.5" />}
                            <span className="truncate max-w-[200px]">{doc.associatedName}</span>
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400">-</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-xs whitespace-nowrap">
                        {formatDate(doc.date, language)}
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => onDeleteDocument(doc)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title={t('btn_delete')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
