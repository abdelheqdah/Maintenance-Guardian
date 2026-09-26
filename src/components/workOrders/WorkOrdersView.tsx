import React, { useState } from 'react';
import { WorkOrder, Equipment, Employee } from '../../types';
import { useLanguage } from '../../i18n';
import { ClipboardList, Plus, Search, Filter } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';
import { StatusBadge } from '../common/StatusBadge';
import { EmptyState } from '../common/EmptyState';

interface WorkOrdersViewProps {
  workOrders: WorkOrder[];
  equipmentList: Equipment[];
  employeeList: Employee[];
  onAddWorkOrder: () => void;
  onEditWorkOrder: (wo: WorkOrder) => void;
}

export const WorkOrdersView: React.FC<WorkOrdersViewProps> = ({
  workOrders,
  equipmentList,
  employeeList,
  onAddWorkOrder,
  onEditWorkOrder,
}) => {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredOrders = workOrders.filter((wo) => {
    if (statusFilter !== 'ALL' && wo.status !== statusFilter) return false;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const eq = equipmentList.find(e => e.id === wo.equipmentId);
      const searchStr = `${wo.title} ${wo.id} ${eq?.name || ''} ${wo.description}`.toLowerCase();
      if (!searchStr.includes(query)) return false;
    }
    
    return true;
  });

  const getStatusColor = (status: WorkOrder['status']) => {
    switch (status) {
      case 'OPEN': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'IN_PROGRESS': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'WAITING_FOR_PARTS': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'COMPLETED': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'CANCELLED': return 'bg-slate-100 text-slate-800 border-slate-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusLabel = (status: WorkOrder['status']) => {
    switch (status) {
      case 'OPEN': return 'Ouvert';
      case 'IN_PROGRESS': return 'En cours';
      case 'WAITING_FOR_PARTS': return 'En attente de pièces';
      case 'COMPLETED': return 'Terminé';
      case 'CANCELLED': return 'Annulé';
      default: return status;
    }
  };

  const getPriorityBadge = (priority: WorkOrder['priority']) => {
    switch (priority) {
      case 'LOW': return <span className="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-md">Basse</span>;
      case 'MEDIUM': return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-md">Moyenne</span>;
      case 'HIGH': return <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-700 rounded-md">Haute</span>;
      case 'URGENT': return <span className="px-2 py-1 text-xs font-medium bg-rose-100 text-rose-700 rounded-md">Urgente</span>;
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-blue-600" />
            Bons de Travail
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Gérer les interventions et la maintenance
          </p>
        </div>
        <button
          type="button"
          onClick={onAddWorkOrder}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouveau Bon
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder={t('search_placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none min-w-[160px]"
        >
          <option value="ALL">Tous les statuts</option>
          <option value="OPEN">Ouvert</option>
          <option value="IN_PROGRESS">En cours</option>
          <option value="WAITING_FOR_PARTS">En attente pièces</option>
          <option value="COMPLETED">Terminé</option>
        </select>
      </div>

      <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
        {filteredOrders.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="Aucun bon de travail"
            description="Il n'y a aucun bon de travail correspondant à vos critères."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50/50 border-b border-slate-200 text-slate-500 font-medium">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Titre</th>
                  <th className="px-6 py-4">Équipement</th>
                  <th className="px-6 py-4">Priorité</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4">Date prévue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((wo) => {
                  const eq = equipmentList.find(e => e.id === wo.equipmentId);
                  return (
                    <tr 
                      key={wo.id} 
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                      onClick={() => onEditWorkOrder(wo)}
                    >
                      <td className="px-6 py-4 font-mono text-xs text-slate-500">{wo.id}</td>
                      <td className="px-6 py-4 font-medium text-slate-900">{wo.title}</td>
                      <td className="px-6 py-4 text-slate-600">{eq?.name || 'Inconnu'}</td>
                      <td className="px-6 py-4">{getPriorityBadge(wo.priority)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusColor(wo.status)}`}>
                          {getStatusLabel(wo.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {wo.dueDate ? formatDate(wo.dueDate, language) : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
