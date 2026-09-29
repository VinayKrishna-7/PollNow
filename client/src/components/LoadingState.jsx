import React from 'react';
import { Loader2 } from 'lucide-react';

export const PollSkeleton = () => (
  <div className="w-full max-w-2xl mx-auto rounded-2xl p-6 sm:p-8 bg-white dark:bg-[#12151e] border border-slate-200 dark:border-white/[0.08] shadow-xl animate-pulse">
    <div className="flex items-center justify-between mb-6">
      <div className="h-6 w-24 bg-slate-200 dark:bg-white/[0.06] rounded-full" />
      <div className="h-5 w-20 bg-slate-200 dark:bg-white/[0.06] rounded-md" />
    </div>
    <div className="h-8 w-3/4 bg-slate-200 dark:bg-white/[0.06] rounded-lg mb-3" />
    <div className="h-4 w-1/3 bg-slate-200 dark:bg-white/[0.06] rounded-md mb-8" />
    
    <div className="space-y-3 mb-8">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="h-14 rounded-xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.05]"
        />
      ))}
    </div>
    
    <div className="h-12 w-full bg-slate-200 dark:bg-white/[0.06] rounded-xl" />
  </div>
);

export const PollCardSkeleton = () => (
  <div className="rounded-2xl p-6 bg-white dark:bg-[#12151e] border border-slate-200 dark:border-white/[0.08] shadow-sm animate-pulse space-y-4">
    <div className="flex items-center justify-between">
      <div className="h-5 w-16 bg-slate-200 dark:bg-white/[0.06] rounded-full" />
      <div className="h-4 w-20 bg-slate-200 dark:bg-white/[0.06] rounded" />
    </div>
    <div className="h-6 w-5/6 bg-slate-200 dark:bg-white/[0.06] rounded" />
    <div className="h-4 w-1/2 bg-slate-200 dark:bg-white/[0.06] rounded" />
    <div className="pt-4 border-t border-slate-100 dark:border-white/[0.04] flex items-center justify-between">
      <div className="h-4 w-24 bg-slate-200 dark:bg-white/[0.06] rounded" />
      <div className="h-8 w-24 bg-slate-200 dark:bg-white/[0.06] rounded-lg" />
    </div>
  </div>
);

export const LoadingSpinner = ({ label = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center p-12 gap-3 text-slate-500 dark:text-slate-400">
    <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
    <span className="text-sm font-medium">{label}</span>
  </div>
);

export default LoadingSpinner;
