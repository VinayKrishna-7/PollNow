import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, BarChart2, CheckCircle2, ArrowRight } from 'lucide-react';
import { formatRelativeTime, formatCountdown, formatVoteCount } from '../utils/formatters';

export const PollCard = ({ poll }) => {
  const { pollId, question, optionsCount, totalVotes, status, expiresAt, createdAt } = poll;

  const countdown = expiresAt ? formatCountdown(expiresAt) : null;
  const isExpired = countdown?.isExpired || status === 'expired';
  const isClosed = status === 'closed';

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl p-6 bg-white dark:bg-[#12151e] border border-slate-200/80 dark:border-white/[0.08] hover:border-indigo-500/40 dark:hover:border-indigo-500/40 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            {isClosed ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 dark:bg-white/[0.08] dark:text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                Closed
              </span>
            ) : isExpired ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Expired
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active
              </span>
            )}

            <span className="text-xs text-slate-400 dark:text-slate-500">
              {formatRelativeTime(createdAt)}
            </span>
          </div>

          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <BarChart2 className="w-3.5 h-3.5 text-indigo-500" />
            {formatVoteCount(totalVotes)}
          </div>
        </div>

        {/* Question Title */}
        <Link to={`/p/${pollId}`} className="focus:outline-none">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug">
            {question}
          </h3>
        </Link>
      </div>

      {/* Footer Info */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/[0.05] flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-3">
          <span>{optionsCount} options</span>
          {expiresAt && !isExpired && !isClosed && (
            <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-medium">
              <Clock className="w-3.5 h-3.5" />
              {countdown.text}
            </span>
          )}
        </div>

        <Link
          to={`/p/${pollId}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform"
        >
          <span>View Poll</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default PollCard;
