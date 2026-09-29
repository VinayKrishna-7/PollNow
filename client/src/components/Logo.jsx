import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3 } from 'lucide-react';

export const Logo = ({ size = 'default', showTagline = false }) => {
  const isLarge = size === 'large';

  return (
    <Link
      to="/"
      className="inline-flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-0.5"
    >
      <div
        className={`relative flex items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200 ${
          isLarge ? 'w-10 h-10' : 'w-8 h-8'
        }`}
      >
        <BarChart3 className={isLarge ? 'w-5 h-5' : 'w-4 h-4'} />
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-slate-900" />
      </div>
      <div className="flex flex-col">
        <span
          className={`font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1 ${
            isLarge ? 'text-2xl' : 'text-xl'
          }`}
        >
          Poll<span className="text-indigo-600 dark:text-indigo-400">Now</span>
        </span>
        {showTagline && (
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 -mt-0.5 tracking-wider uppercase">
            Create. Share. Vote.
          </span>
        )}
      </div>
    </Link>
  );
};

export default Logo;
