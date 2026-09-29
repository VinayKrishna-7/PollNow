import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export const PollOption = ({
  option,
  isSelected,
  onSelect,
  isMultiple = false,
  disabled = false,
}) => {
  const { optionId, text } = option;

  const handleKeyDown = (e) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onSelect(optionId);
    }
  };

  return (
    <motion.div
      whileHover={disabled ? {} : { scale: 1.008, y: -1 }}
      whileTap={disabled ? {} : { scale: 0.995 }}
      onClick={() => !disabled && onSelect(optionId)}
      onKeyDown={handleKeyDown}
      role={isMultiple ? 'checkbox' : 'radio'}
      aria-checked={isSelected}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      className={`group relative flex items-center justify-between p-4 sm:p-5 rounded-2xl border cursor-pointer select-none transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${
        disabled
          ? 'opacity-60 cursor-not-allowed bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.06]'
          : isSelected
          ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500/80 shadow-md shadow-indigo-500/10'
          : 'bg-white dark:bg-[#12151e] border-slate-200/90 dark:border-white/[0.08] hover:border-slate-400 dark:hover:border-white/[0.2] hover:bg-slate-50/50 dark:hover:bg-white/[0.02]'
      }`}
    >
      <div className="flex items-center gap-3.5 sm:gap-4 pr-3 min-w-0">
        {/* Custom Indicator Circle / Checkbox */}
        <div
          className={`flex items-center justify-center shrink-0 transition-colors duration-200 ${
            isMultiple ? 'w-5 h-5 rounded-md' : 'w-5 h-5 rounded-full'
          } ${
            isSelected
              ? 'bg-indigo-600 border border-indigo-500 text-white'
              : 'border border-slate-300 dark:border-white/[0.2] bg-white dark:bg-white/[0.05] group-hover:border-indigo-400'
          }`}
        >
          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </motion.div>
          )}
        </div>

        {/* Option Text */}
        <span
          className={`text-sm sm:text-base font-medium break-words leading-relaxed transition-colors ${
            isSelected
              ? 'text-indigo-950 dark:text-indigo-100 font-semibold'
              : 'text-slate-800 dark:text-slate-200 group-hover:text-slate-950 dark:group-hover:text-white'
          }`}
        >
          {text}
        </span>
      </div>

      {/* Visual Accent Pill if selected */}
      {isSelected && (
        <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 tracking-wide uppercase px-2 py-0.5 rounded-full bg-indigo-100/80 dark:bg-indigo-900/50 shrink-0">
          Selected
        </span>
      )}
    </motion.div>
  );
};

export default PollOption;
