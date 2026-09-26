import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'default' | 'danger' | 'warning' | 'info' | 'success';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'default',
  onClick,
}) => {
  const variantStyles = {
    default: {
      card: 'border-slate-200 hover:border-slate-300 bg-white',
      iconBox: 'bg-slate-100 text-slate-700',
      value: 'text-slate-900',
    },
    danger: {
      card: 'border-rose-200 hover:border-rose-300 bg-rose-50/40',
      iconBox: 'bg-rose-100 text-rose-700',
      value: 'text-rose-700 font-bold',
    },
    warning: {
      card: 'border-amber-200 hover:border-amber-300 bg-amber-50/40',
      iconBox: 'bg-amber-100 text-amber-800',
      value: 'text-amber-800 font-bold',
    },
    info: {
      card: 'border-sky-200 hover:border-sky-300 bg-sky-50/40',
      iconBox: 'bg-sky-100 text-sky-700',
      value: 'text-sky-800 font-bold',
    },
    success: {
      card: 'border-emerald-200 hover:border-emerald-300 bg-emerald-50/40',
      iconBox: 'bg-emerald-100 text-emerald-700',
      value: 'text-emerald-700 font-bold',
    },
  }[variant];

  return (
    <div
      onClick={onClick}
      className={`p-5 rounded-xl border shadow-xs transition-all duration-150 ${variantStyles.card} ${
        onClick ? 'cursor-pointer hover:shadow-md active:scale-[0.99]' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold tracking-tight ${variantStyles.value}`}>
              {value}
            </span>
          </div>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-500 font-medium">
              {subtitle}
            </p>
          )}
        </div>
        <div className={`p-2.5 rounded-xl shrink-0 shadow-2xs ${variantStyles.iconBox}`}>
          <Icon className="w-5 h-5 stroke-[2]" />
        </div>
      </div>
    </div>
  );
};
