import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Analytics } from '@vercel/analytics/react';
import {
  Equipment,
  Employee,
  MaintenanceRecord,
  CalibrationRecord,
  DocumentRecord,
  ComplianceStatus,
} from './types';
import {
  equipmentService,
  employeeService,
  maintenanceService,
  calibrationService,
  documentService,
} from './services';
import { calculateComplianceStatus } from './utils/dateUtils';
import { useLanguage } from './i18n';
import { Layout } from './components/layout/Layout';
import { NavigationTab } from './components/layout/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { UrgentItem } from './components/dashboard/UrgentItemsTable';
import { EquipmentList } from './components/equipment/EquipmentList';
import { EquipmentDetail } from './components/equipment/EquipmentDetail';
import { EquipmentFormModal } from './components/equipment/EquipmentFormModal';
import { CalibrationModal } from './components/equipment/CalibrationModal';
import { MaintenanceModal } from './components/equipment/MaintenanceModal';
import { EmployeeList } from './components/employees/EmployeeList';
import { EmployeeFormModal } from './components/employees/EmployeeFormModal';
import { AlertsView } from './components/alerts/AlertsView';
import { DocumentsView } from './components/documents/DocumentsView';
import { DocumentModal } from './components/documents/DocumentModal';
import { ConfirmModal } from './components/common/ConfirmModal';
import { ToastContainer, ToastMessage, ToastType } from './components/common/Toast';

export const App: React.FC = () => {
  const { t } = useLanguage();

  // Navigation state
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [activeEquipmentId, setActiveEquipmentId] = useState<string | null>(null);

  // Pre-set filters when jumping from Dashboard
  const [equipmentStatusFilter, setEquipmentStatusFilter] = useState<ComplianceStatus | 'ALL'>('ALL');
  const [employeeStatusFilter, setEmployeeStatusFilter] = useState<ComplianceStatus | 'ALL'>('ALL');

  // Core Data
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [employeeList, setEmployeeList] = useState<Employee[]>([]);
  const [maintenanceList, setMaintenanceList] = useState<MaintenanceRecord[]>([]);
  const [calibrationList, setCalibrationList] = useState<CalibrationRecord[]>([]);
  const [documentList, setDocumentList] = useState<DocumentRecord[]>([]);

  // Modals state
  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);

  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const [isCalibrationModalOpen, setIsCalibrationModalOpen] = useState(false);
  const [editingCalibration, setEditingCalibration] = useState<CalibrationRecord | null>(null);

  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [editingMaintenance, setEditingMaintenance] = useState<MaintenanceRecord | null>(null);

  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [docModalContext, setDocModalContext] = useState<{
    associatedType: 'EQUIPMENT' | 'EMPLOYEE';
    associatedId: string;
    associatedName: string;
  }>({
    associatedType: 'EQUIPMENT',
    associatedId: '',
    associatedName: '',
  });

  // Confirm Modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: ToastType = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Reload data from services
  const refreshData = useCallback(() => {
    setEquipmentList(equipmentService.getAll());
    setEmployeeList(employeeService.getAll());
    setMaintenanceList(maintenanceService.getAll());
    setCalibrationList(calibrationService.getAll());
    setDocumentList(documentService.getAll());
  }, []);

  useEffect(() => {
    equipmentService.ensureInitialized();
    refreshData();
  }, [refreshData]);

  // Derive categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    equipmentList.forEach((eq) => {
      if (eq.category) set.add(eq.category);
    });
    return Array.from(set).sort();
  }, [equipmentList]);

  // Compute urgent items across system
  const urgentItems: UrgentItem[] = useMemo(() => {
    const items: UrgentItem[] = [];

    // 1. Equipment Calibrations
    equipmentList.forEach((eq) => {
      const calc = calculateComplianceStatus(eq.nextCalibrationDate);
      if (calc.status !== 'VALID') {
        items.push({
          id: `cal_${eq.id}`,
          title: eq.name,
          subtitle: `${eq.assetId} • ${eq.manufacturer} ${eq.model}`,
          categoryType: 'CALIBRATION',
          dueDate: eq.nextCalibrationDate,
          daysRemaining: calc.daysRemaining,
          status: calc.status,
          targetType: 'equipment',
          targetId: eq.id,
        });
      }
    });

    // 2. Equipment Maintenances
    equipmentList.forEach((eq) => {
      if (eq.nextMaintenanceDate) {
        const calc = calculateComplianceStatus(eq.nextMaintenanceDate);
        if (calc.status !== 'VALID') {
          items.push({
            id: `maint_${eq.id}`,
            title: eq.name,
            subtitle: `${eq.assetId} • ${eq.location}`,
            categoryType: 'MAINTENANCE',
            dueDate: eq.nextMaintenanceDate,
            daysRemaining: calc.daysRemaining,
            status: calc.status,
            targetType: 'equipment',
            targetId: eq.id,
          });
        }
      }
    });

    // 3. Employee Certificates
    employeeList.forEach((emp) => {
      const calc = calculateComplianceStatus(emp.expiryDate);
      if (calc.status !== 'VALID') {
        items.push({
          id: `cert_${emp.id}`,
          title: emp.name,
          subtitle: `${emp.employeeId} • ${emp.certificateName}`,
          categoryType: 'CERTIFICATE',
          dueDate: emp.expiryDate,
          daysRemaining: calc.daysRemaining,
          status: calc.status,
          targetType: 'employee',
          targetId: emp.id,
        });
      }
    });

    // Sort: most urgent first (ascending daysRemaining)
    return items.sort((a, b) => a.daysRemaining - b.daysRemaining);
  }, [equipmentList, employeeList]);

  // Overall Stats
  const stats = useMemo(() => {
    let overdueCount = 0;
    let due30Count = 0;
    let due90Count = 0;
    let validCount = 0;

    equipmentList.forEach((eq) => {
      const calStatus = calculateComplianceStatus(eq.nextCalibrationDate).status;
      const maintStatus = eq.nextMaintenanceDate
        ? calculateComplianceStatus(eq.nextMaintenanceDate).status
        : 'VALID';

      if (calStatus === 'OVERDUE' || maintStatus === 'OVERDUE') {
        overdueCount++;
      } else if (calStatus === 'DUE_30' || maintStatus === 'DUE_30') {
        due30Count++;
      } else if (calStatus === 'DUE_90' || maintStatus === 'DUE_90') {
        due90Count++;
      } else {
        validCount++;
      }
    });

    let employeeCertsAttention = 0;
    employeeList.forEach((emp) => {
      const s = calculateComplianceStatus(emp.expiryDate).status;
      if (s !== 'VALID') {
        employeeCertsAttention++;
      }
    });

    return {
      totalEquipment: equipmentList.length,
      equipmentRequiringAttention: overdueCount + due30Count + due90Count,
      equipmentOverdue: overdueCount,
      equipmentDue30: due30Count,
      equipmentDue90: due90Count,
      equipmentValid: validCount,
      totalEmployees: employeeList.length,
      employeeCertsAttention,
    };
  }, [equipmentList, employeeList]);

  // Urgent alert count for header / sidebar badge
  const urgentAlertCount = useMemo(() => {
    return urgentItems.filter((i) => i.status === 'OVERDUE' || i.status === 'DUE_30').length;
  }, [urgentItems]);

  // Active Equipment Object for detail view
  const activeEquipment = useMemo(() => {
    if (!activeEquipmentId) return null;
    return equipmentList.find((eq) => eq.id === activeEquipmentId) || null;
  }, [equipmentList, activeEquipmentId]);

  // Active equipment's calibrations, maintenance, documents
  const activeCalibrations = useMemo(() => {
    if (!activeEquipmentId) return [];
    return calibrationList.filter((c) => c.equipmentId === activeEquipmentId);
  }, [calibrationList, activeEquipmentId]);

  const activeMaintenance = useMemo(() => {
    if (!activeEquipmentId) return [];
    return maintenanceList.filter((m) => m.equipmentId === activeEquipmentId);
  }, [maintenanceList, activeEquipmentId]);

  const activeDocuments = useMemo(() => {
    if (!activeEquipmentId) return [];
    return documentList.filter(
      (d) => d.associatedType === 'EQUIPMENT' && d.associatedId === activeEquipmentId
    );
  }, [documentList, activeEquipmentId]);

  // Handlers - Navigation
  const handleSelectTab = (tab: NavigationTab) => {
    setCurrentTab(tab);
    setActiveEquipmentId(null);
  };

  const handleOpenEquipmentDetail = (id: string) => {
    setActiveEquipmentId(id);
  };

  const handleNavigateItem = (type: 'equipment' | 'employee', id: string) => {
    if (type === 'equipment') {
      setActiveEquipmentId(id);
    } else {
      setCurrentTab('employees');
      setActiveEquipmentId(null);
    }
  };

  const handleQuickAction = (categoryType: string, targetId: string) => {
    if (categoryType === 'CALIBRATION') {
      setActiveEquipmentId(targetId);
      setEditingCalibration(null);
      setIsCalibrationModalOpen(true);
    } else if (categoryType === 'MAINTENANCE') {
      setActiveEquipmentId(targetId);
      setEditingMaintenance(null);
      setIsMaintenanceModalOpen(true);
    } else if (categoryType === 'CERTIFICATE') {
      const emp = employeeList.find(e => e.id === targetId);
      if (emp) {
        setEditingEmployee(emp);
        setIsEmployeeModalOpen(true);
      }
    }
  };

  const handleNavigateEquipmentFilter = (status: ComplianceStatus | 'ALL') => {
    setEquipmentStatusFilter(status);
    setCurrentTab('equipment');
    setActiveEquipmentId(null);
  };

  const handleNavigateEmployeesFilter = (status: ComplianceStatus | 'ALL') => {
    setEmployeeStatusFilter(status);
    setCurrentTab('employees');
    setActiveEquipmentId(null);
  };

  // Handlers - Equipment CRUD
  const handleSaveEquipment = (data: Omit<Equipment, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingEquipment) {
      equipmentService.update(editingEquipment.id, data);
      addToast(t('toast_updated'));
    } else {
      equipmentService.create(data);
      addToast(t('toast_created'));
    }
    refreshData();
    setIsEquipmentModalOpen(false);
    setEditingEquipment(null);
  };

  const handleDeleteEquipmentPrompt = (equipment: Equipment) => {
    setConfirmModal({
      isOpen: true,
      title: t('confirm_delete_title'),
      message: t('confirm_delete_equipment_msg', { name: equipment.name }),
      onConfirm: () => {
        equipmentService.delete(equipment.id);
        refreshData();
        addToast(t('toast_deleted'));
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        if (activeEquipmentId === equipment.id) {
          setActiveEquipmentId(null);
        }
      },
    });
  };

  // Handlers - Employee CRUD
  const handleSaveEmployee = (data: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingEmployee) {
      employeeService.update(editingEmployee.id, data);
      addToast(t('toast_updated'));
    } else {
      employeeService.create(data);
      addToast(t('toast_created'));
    }
    refreshData();
    setIsEmployeeModalOpen(false);
    setEditingEmployee(null);
  };

  const handleDeleteEmployeePrompt = (emp: Employee) => {
    setConfirmModal({
      isOpen: true,
      title: t('confirm_delete_title'),
      message: t('confirm_delete_employee_msg', { name: emp.name }),
      onConfirm: () => {
        employeeService.delete(emp.id);
        refreshData();
        addToast(t('toast_deleted'));
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Handlers - Calibration CRUD
  const handleSaveCalibration = (data: Omit<CalibrationRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingCalibration) {
      calibrationService.update(editingCalibration.id, data);
      addToast(t('toast_updated'));
    } else {
      calibrationService.create(data);
      addToast(t('toast_created'));
    }
    refreshData();
    setIsCalibrationModalOpen(false);
    setEditingCalibration(null);
  };

  const handleDeleteCalibrationPrompt = (cal: CalibrationRecord) => {
    setConfirmModal({
      isOpen: true,
      title: t('confirm_delete_title'),
      message: t('confirm_delete_record_msg'),
      onConfirm: () => {
        calibrationService.delete(cal.id);
        refreshData();
        addToast(t('toast_deleted'));
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Handlers - Maintenance CRUD
  const handleSaveMaintenance = (data: Omit<MaintenanceRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingMaintenance) {
      maintenanceService.update(editingMaintenance.id, data);
      addToast(t('toast_updated'));
    } else {
      maintenanceService.create(data);
      addToast(t('toast_created'));
    }
    refreshData();
    setIsMaintenanceModalOpen(false);
    setEditingMaintenance(null);
  };

  const handleDeleteMaintenancePrompt = (maint: MaintenanceRecord) => {
    setConfirmModal({
      isOpen: true,
      title: t('confirm_delete_title'),
      message: t('confirm_delete_record_msg'),
      onConfirm: () => {
        maintenanceService.delete(maint.id);
        refreshData();
        addToast(t('toast_deleted'));
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Handlers - Document CRUD
  const handleSaveDocument = (data: Omit<DocumentRecord, 'id' | 'createdAt'>) => {
    documentService.create(data);
    refreshData();
    addToast(t('toast_created'));
    setIsDocumentModalOpen(false);
  };

  const handleDeleteDocumentPrompt = (doc: DocumentRecord) => {
    setConfirmModal({
      isOpen: true,
      title: t('confirm_delete_title'),
      message: t('confirm_delete_record_msg'),
      onConfirm: () => {
        documentService.delete(doc.id);
        refreshData();
        addToast(t('toast_deleted'));
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleOpenAddDocumentForActive = () => {
    if (activeEquipment) {
      setDocModalContext({
        associatedType: 'EQUIPMENT',
        associatedId: activeEquipment.id,
        associatedName: activeEquipment.name,
      });
      setIsDocumentModalOpen(true);
    }
  };

  return (
    <Layout
      currentTab={currentTab}
      onSelectTab={handleSelectTab}
      urgentAlertCount={urgentAlertCount}
    >
      {/* 1. Detail View if activeEquipment is set */}
      {activeEquipment ? (
        <EquipmentDetail
          equipment={activeEquipment}
          calibrations={activeCalibrations}
          maintenance={activeMaintenance}
          documents={activeDocuments}
          onBack={() => setActiveEquipmentId(null)}
          onEditEquipment={(eq) => {
            setEditingEquipment(eq);
            setIsEquipmentModalOpen(true);
          }}
          onDeleteEquipment={handleDeleteEquipmentPrompt}
          onAddCalibration={() => {
            setEditingCalibration(null);
            setIsCalibrationModalOpen(true);
          }}
          onEditCalibration={(cal) => {
            setEditingCalibration(cal);
            setIsCalibrationModalOpen(true);
          }}
          onDeleteCalibration={handleDeleteCalibrationPrompt}
          onAddMaintenance={() => {
            setEditingMaintenance(null);
            setIsMaintenanceModalOpen(true);
          }}
          onEditMaintenance={(m) => {
            setEditingMaintenance(m);
            setIsMaintenanceModalOpen(true);
          }}
          onDeleteMaintenance={handleDeleteMaintenancePrompt}
          onAddDocument={handleOpenAddDocumentForActive}
          onDeleteDocument={handleDeleteDocumentPrompt}
        />
      ) : (
        <>
          {/* 2. Dashboard View */}
          {currentTab === 'dashboard' && (
            <DashboardView
              stats={stats}
              urgentItems={urgentItems}
              onNavigateToEquipmentFilter={handleNavigateEquipmentFilter}
              onNavigateToEmployeesFilter={handleNavigateEmployeesFilter}
              onNavigateItem={handleNavigateItem}
              onViewAllAlerts={() => setCurrentTab('alerts')}
              onOpenAddEquipment={() => {
                setEditingEquipment(null);
                setIsEquipmentModalOpen(true);
              }}
              onOpenAddEmployee={() => {
                setEditingEmployee(null);
                setIsEmployeeModalOpen(true);
              }}
              onQuickAction={handleQuickAction}
            />
          )}

          {/* 3. Equipment View */}
          {currentTab === 'equipment' && (
            <EquipmentList
              equipment={equipmentList}
              categories={categories}
              initialStatusFilter={equipmentStatusFilter}
              onSelectEquipment={handleOpenEquipmentDetail}
              onAddEquipment={() => {
                setEditingEquipment(null);
                setIsEquipmentModalOpen(true);
              }}
              onEditEquipment={(eq) => {
                setEditingEquipment(eq);
                setIsEquipmentModalOpen(true);
              }}
              onDeleteEquipment={handleDeleteEquipmentPrompt}
            />
          )}

          {/* 4. Employees View */}
          {currentTab === 'employees' && (
            <EmployeeList
              employees={employeeList}
              initialStatusFilter={employeeStatusFilter}
              onAddEmployee={() => {
                setEditingEmployee(null);
                setIsEmployeeModalOpen(true);
              }}
              onEditEmployee={(emp) => {
                setEditingEmployee(emp);
                setIsEmployeeModalOpen(true);
              }}
              onDeleteEmployee={handleDeleteEmployeePrompt}
            />
          )}

          {/* 5. Alerts View */}
          {currentTab === 'alerts' && (
            <AlertsView
              alerts={urgentItems}
              onNavigate={handleNavigateItem}
              onQuickAction={handleQuickAction}
            />
          )}

          {/* 6. Documents View */}
          {currentTab === 'documents' && (
            <DocumentsView
              documents={documentList}
              onAddDocument={() => {
                setDocModalContext({
                  associatedType: 'EQUIPMENT',
                  associatedId: '',
                  associatedName: '',
                });
                setIsDocumentModalOpen(true);
              }}
              onDeleteDocument={handleDeleteDocumentPrompt}
              onNavigateItem={handleNavigateItem}
            />
          )}
        </>
      )}

      {/* MODALS */}

      {/* Equipment Add/Edit */}
      <EquipmentFormModal
        isOpen={isEquipmentModalOpen}
        equipment={editingEquipment}
        onClose={() => {
          setIsEquipmentModalOpen(false);
          setEditingEquipment(null);
        }}
        onSave={handleSaveEquipment}
      />

      {/* Employee Add/Edit */}
      <EmployeeFormModal
        isOpen={isEmployeeModalOpen}
        employee={editingEmployee}
        onClose={() => {
          setIsEmployeeModalOpen(false);
          setEditingEmployee(null);
        }}
        onSave={handleSaveEmployee}
      />

      {/* Calibration Add/Edit */}
      {activeEquipment && (
        <CalibrationModal
          isOpen={isCalibrationModalOpen}
          equipmentId={activeEquipment.id}
          record={editingCalibration}
          onClose={() => {
            setIsCalibrationModalOpen(false);
            setEditingCalibration(null);
          }}
          onSave={handleSaveCalibration}
        />
      )}

      {/* Maintenance Add/Edit */}
      {activeEquipment && (
        <MaintenanceModal
          isOpen={isMaintenanceModalOpen}
          equipmentId={activeEquipment.id}
          maintenancePeriodMonths={activeEquipment.maintenancePeriodMonths}
          record={editingMaintenance}
          onClose={() => {
            setIsMaintenanceModalOpen(false);
            setEditingMaintenance(null);
          }}
          onSave={handleSaveMaintenance}
        />
      )}

      {/* Document Add */}
      <DocumentModal
        isOpen={isDocumentModalOpen}
        associatedType={docModalContext.associatedType}
        associatedId={docModalContext.associatedId}
        associatedName={docModalContext.associatedName}
        onClose={() => setIsDocumentModalOpen(false)}
        onSave={handleSaveDocument}
      />

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Toast Feedback */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    <Analytics />
    </Layout>
  );
};