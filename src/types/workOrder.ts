export type WorkOrderStatus = 'OPEN' | 'IN_PROGRESS' | 'WAITING_FOR_PARTS' | 'COMPLETED' | 'CANCELLED';
export type WorkOrderPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type WorkOrderType = 'PREVENTIVE' | 'CORRECTIVE';

export interface WorkOrder {
  id: string;
  equipmentId: string;
  title: string;
  description: string;
  type: WorkOrderType;
  priority: WorkOrderPriority;
  status: WorkOrderStatus;
  assignedTo?: string; // Employee ID or name
  createdAt: string;
  dueDate?: string;
  completedAt?: string;
  notes?: string;
  partsUsed?: string[];
}
