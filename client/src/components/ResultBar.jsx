import React from 'react';
import { motion } from 'framer-motion';
import { Check, Trophy } from 'lucide-react';
import { formatVoteCount } from '../utils/formatters';

export const ResultBar = ({
  text,
  voteCount = 0,
  percentage = 0,
  isUserChoice = false,
  isTopChoice = false,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm sm:text-base gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={`font-medium break-words leading-tight ${
              isUserChoice
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-slate-800 dark:text-slate-200'
            }`}
          >
            {text}
          </span>
          {isUserChoice && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full shrink-0">
              <Check className="w-3 h-3 stroke-[3]" />
              Your vote
            </span>
          )}
          {isTopChoice && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full shrink-0">
              <Trophy className="w-3 h-3" />
              Leading
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {formatVoteCount(voteCount)}
          </span>
          <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white tabular-nums w-12 text-right">
            {percentage}%
          </span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="relative h-3 w-full bg-slate-100 dark:bg-white/[0.06] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={`h-full rounded-full transition-colors ${
            isUserChoice
              ? 'bg-gradient-to-r from-indigo-500 to-indigo-600'
              : isTopChoice
              ? 'bg-gradient-to-r from-amber-500 to-amber-600'
              : 'bg-gradient-to-r from-slate-400 to-slate-500 dark:from-slate-600 dark:to-slate-500'
          }`}
        />
      </div>
    </div>
  );
};

export default ResultBar;
