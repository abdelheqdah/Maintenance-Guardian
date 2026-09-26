import React from 'react';
import { useLanguage } from '../../i18n';
import {
  LayoutDashboard,
  Cpu,
  Users,
  AlertTriangle,
  FileText,
  Building2,
  X,
} from 'lucide-react';

export type NavigationTab = 'dashboard' | 'equipment' | 'employees' | 'alerts' | 'documents';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  urgentAlertCount: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  urgentAlertCount,
  isOpenMobile,
  onCloseMobile,
}) => {
  const { t } = useLanguage();

  const navItems: { id: NavigationTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    {
      id: 'dashboard',
      label: t('nav_dashboard'),
      icon: LayoutDashboard,
    },
    {
      id: 'equipment',
      label: t('nav_equipment'),
      icon: Cpu,
    },
    {
      id: 'employees',
      label: t('nav_employees'),
      icon: Users,
    },
    {
      id: 'alerts',
      label: t('nav_alerts'),
      icon: AlertTriangle,
      badge: urgentAlertCount,
    },
    {
      id: 'documents',
      label: t('nav_documents'),
      icon: FileText,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Header Inside Sidebar */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800 lg:hidden">
          <span className="font-bold text-white text-sm tracking-wide">
            {t('app_title')}
          </span>
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                      isActive
                        ? 'bg-white text-blue-700'
                        : 'bg-rose-500 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Company & Environment Status Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-slate-800 text-slate-400 shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-200 truncate">
                {t('company_name')}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[11px] text-slate-400 font-mono">
                  default-company
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
