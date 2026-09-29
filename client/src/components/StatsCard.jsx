import React from 'react';

export const StatsCard = ({
  icon: Icon,
  label,
  value,
  subtitle,
  badge = null,
  color = 'indigo',
}) => {
  const colorMap = {
    indigo: 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    emerald: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    amber: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20',
    blue: 'text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20',
  };

  return (
    <div className="rounded-2xl p-5 bg-white dark:bg-[#12151e] border border-slate-200/80 dark:border-white/[0.08] shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {label}
        </span>
        {Icon && (
          <div className={`p-2 rounded-xl border ${colorMap[color] || colorMap.indigo}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div>
        <div className="flex items-baseline gap-2">
          <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white truncate">
            {value}
          </span>
          {badge}
        </div>
        {subtitle && (
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 truncate">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
