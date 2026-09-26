import React from 'react';
import { useLanguage } from '../../i18n';
import { ShieldCheck, Bell, Globe, Menu } from 'lucide-react';

interface HeaderProps {
  urgentAlertCount: number;
  onNavigateAlerts: () => void;
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  urgentAlertCount,
  onNavigateAlerts,
  onToggleMobileMenu,
}) => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-industrial-900 border-b border-industrial-800 text-white shadow-md">
      {/* Left Branding & Mobile Toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="p-2 -ml-2 text-slate-300 hover:text-white rounded-lg lg:hidden hover:bg-industrial-800 focus:outline-hidden"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-600 text-white shadow-sm ring-1 ring-blue-400/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-white">
                {t('app_title')}
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-blue-500/20 text-blue-300 rounded border border-blue-500/30">
                {t('v1_mvp_badge')}
              </span>
            </div>
            <p className="hidden md:block text-xs text-slate-400 font-medium leading-none mt-0.5">
              {t('app_tagline')}
            </p>
          </div>
        </div>
      </div>

      {/* Right Actions: Alert Counter, Language Switcher, Company badge */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Quick Alert Bell */}
        <button
          type="button"
          onClick={onNavigateAlerts}
          className="relative flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-industrial-800 hover:bg-industrial-700 text-slate-200 border border-industrial-700 transition-colors"
          title={t('nav_alerts')}
        >
          <Bell className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">{t('nav_alerts')}</span>
          {urgentAlertCount > 0 && (
            <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[11px] font-bold text-white bg-rose-600 rounded-full animate-pulse">
              {urgentAlertCount}
            </span>
          )}
        </button>

        {/* Language Switcher */}
        <div className="flex items-center bg-industrial-800 p-1 rounded-lg border border-industrial-700">
          <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1 hidden xs:block" />
          <button
            type="button"
            onClick={() => setLanguage('fr')}
            className={`px-2 py-1 text-xs font-bold rounded transition-colors ${
              language === 'fr'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            FR
          </button>
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`px-2 py-1 text-xs font-bold rounded transition-colors ${
              language === 'en'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            EN
          </button>
        </div>
      </div>
    </header>
  );
};
