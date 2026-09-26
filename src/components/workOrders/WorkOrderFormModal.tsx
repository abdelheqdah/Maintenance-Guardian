import React, { useState, useEffect } from 'react';
import { WorkOrder, Equipment, Employee } from '../../types';
import { useLanguage } from '../../i18n';
import { X, Check } from 'lucide-react';

interface WorkOrderFormModalProps {
  isOpen: boolean;
  workOrder: WorkOrder | null;
  equipmentList: Equipment[];
  employeeList: Employee[];
  onClose: () => void;
  onSave: (data: Omit<WorkOrder, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export const WorkOrderFormModal: React.FC<WorkOrderFormModalProps> = ({
  isOpen,
  workOrder,
  equipmentList,
  employeeList,
  onClose,
  onSave,
}) => {
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState<Omit<WorkOrder, 'id' | 'createdAt' | 'updatedAt'>>({
    title: '',
    description: '',
    equipmentId: '',
    assignedToId: '',
    priority: 'MEDIUM',
    status: 'OPEN',
    dueDate: '',
    completedDate: '',
    estimatedHours: 0,
    actualHours: 0,
    cost: 0,
    notes: ''
  });

  useEffect(() => {
    if (workOrder) {
      setFormData({
        title: workOrder.title,
        description: workOrder.description,
        equipmentId: workOrder.equipmentId || '',
        assignedToId: workOrder.assignedToId || '',
        priority: workOrder.priority,
        status: workOrder.status,
        dueDate: workOrder.dueDate || '',
        completedDate: workOrder.completedDate || '',
        estimatedHours: workOrder.estimatedHours || 0,
        actualHours: workOrder.actualHours || 0,
        cost: workOrder.cost || 0,
        notes: workOrder.notes || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        equipmentId: '',
        assignedToId: '',
        priority: 'MEDIUM',
        status: 'OPEN',
        dueDate: '',
        completedDate: '',
        estimatedHours: 0,
        actualHours: 0,
        cost: 0,
        notes: ''
      });
    }
  }, [workOrder, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">
            {workOrder ? 'Modifier le Bon de Travail' : 'Nouveau Bon de Travail'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Titre *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Description
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Équipement *
              </label>
              <select
                required
                value={formData.equipmentId}
                onChange={(e) => setFormData({ ...formData, equipmentId: e.target.value })}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              >
                <option value="">Sélectionner...</option>
                {equipmentList.map(eq => (
                  <option key={eq.id} value={eq.id}>{eq.name} ({eq.assetId})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Assigné à
              </label>
              <select
                value={formData.assignedToId}
                onChange={(e) => setFormData({ ...formData, assignedToId: e.target.value })}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              >
                <option value="">Non assigné</option>
                {employeeList.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Priorité
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as WorkOrder['priority'] })}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              >
                <option value="LOW">Basse</option>
                <option value="MEDIUM">Moyenne</option>
                <option value="HIGH">Haute</option>
                <option value="URGENT">Urgente</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Statut
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as WorkOrder['status'] })}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              >
                <option value="OPEN">Ouvert</option>
                <option value="IN_PROGRESS">En cours</option>
                <option value="WAITING_FOR_PARTS">En attente de pièces</option>
                <option value="COMPLETED">Terminé</option>
                <option value="CANCELLED">Annulé</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Date prévue
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
            
            {formData.status === 'COMPLETED' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Date de complétion
                </label>
                <input
                  type="date"
                  value={formData.completedDate}
                  onChange={(e) => setFormData({ ...formData, completedDate: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            )}
          </div>
        </form>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-colors"
          >
            {t('cancel')}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors"
          >
            <Check className="w-4 h-4" />
            {t('save')}
          </button>
        </div>
      </div>
    </div>
  );
};
