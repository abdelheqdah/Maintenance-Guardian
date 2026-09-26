import { WorkOrder } from '../types/workOrder';
import { generateId } from '../utils/idGenerator';

const STORAGE_KEY = 'mg_work_orders';

export const getWorkOrders = (): WorkOrder[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveWorkOrders = (workOrders: WorkOrder[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workOrders));
};

export const addWorkOrder = (workOrder: Omit<WorkOrder, 'id' | 'createdAt'>): WorkOrder => {
  const workOrders = getWorkOrders();
  const newWorkOrder: WorkOrder = {
    ...workOrder,
    id: generateId('wo'),
    createdAt: new Date().toISOString(),
  };
  
  saveWorkOrders([...workOrders, newWorkOrder]);
  return newWorkOrder;
};

export const updateWorkOrder = (id: string, updates: Partial<WorkOrder>): WorkOrder => {
  const workOrders = getWorkOrders();
  const index = workOrders.findIndex(wo => wo.id === id);
  
  if (index === -1) {
    throw new Error('Work order not found');
  }
  
  const updatedWorkOrder = { ...workOrders[index], ...updates };
  workOrders[index] = updatedWorkOrder;
  
  saveWorkOrders(workOrders);
  return updatedWorkOrder;
};

export const deleteWorkOrder = (id: string): void => {
  const workOrders = getWorkOrders();
  saveWorkOrders(workOrders.filter(wo => wo.id !== id));
};
