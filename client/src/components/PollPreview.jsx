import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Clock, Sparkles } from 'lucide-react';
import Logo from './Logo';

export const PollPreview = ({ question, options, settings, expiresOption }) => {
  const [previewSelected, setPreviewSelected] = useState([]);

  const isMultiple = settings.votingType === 'multiple';

  const handlePreviewClick = (idx) => {
    if (isMultiple) {
      if (previewSelected.includes(idx)) {
        setPreviewSelected(previewSelected.filter((i) => i !== idx));
      } else {
        const max = settings.maxSelections || options.length;
        if (previewSelected.length < max) {
          setPreviewSelected([...previewSelected, idx]);
        }
      }
    } else {
      setPreviewSelected([idx]);
    }
  };

  const getExpirationPreviewText = () => {
    switch (expiresOption) {
      case '10m':
        return 'Ends in 10m';
      case '1h':
        return 'Ends in 1h';
      case '1d':
        return 'Ends in 24h';
      case '7d':
        return 'Ends in 7d';
      case '30d':
        return 'Ends in 30d';
      default:
        return null;
    }
  };

  const expirationText = getExpirationPreviewText();

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Live Preview</span>
        </div>
        <span className="text-[11px] font-medium text-slate-400">
          Interactive preview
        </span>
      </div>

      <div className="relative rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#12151e] border border-slate-200/90 dark:border-white/[0.08] shadow-xl shadow-slate-200/40 dark:shadow-black/50 transition-all">
        {/* Subtle accent glow */}
        <div className="absolute -top-12 -right-12 w-44 h-44 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Card Header */}
        <div className="flex items-center justify-between gap-2 mb-6">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              LIVE PREVIEW
            </span>
          </div>

          {expirationText && (
            <span className="flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400">
              <Clock className="w-3.5 h-3.5" />
              {expirationText}
            </span>
          )}
        </div>

        {/* Question Title */}
        <div className="mb-2">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white break-words leading-tight">
            {question.trim() ? question : 'Your poll question will appear here'}
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5 font-medium">
            {isMultiple
              ? `Select up to ${settings.maxSelections || 'unlimited'} options`
              : 'Choose one option'}
          </p>
        </div>

        {/* Options List */}
        <div className="space-y-2.5 my-6">
          <AnimatePresence>
            {options.map((opt, idx) => {
              const text = opt.trim() || `Option ${idx + 1}`;
              const isSelected = previewSelected.includes(idx);

              return (
                <motion.div
                  key={idx}
                  layout
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => handlePreviewClick(idx)}
                  className={`flex items-center justify-between p-3.5 sm:p-4 rounded-xl border cursor-pointer select-none transition-all ${
                    isSelected
                      ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500/80 text-indigo-950 dark:text-indigo-100'
                      : 'bg-slate-50/60 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.07] hover:border-slate-300 dark:hover:border-white/[0.15] text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`flex items-center justify-center w-4 h-4 shrink-0 transition-colors ${
                        isMultiple ? 'rounded' : 'rounded-full'
                      } ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'border border-slate-300 dark:border-white/[0.2]'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="text-sm font-medium truncate">{text}</span>
                  </div>

                  {isSelected && (
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/50 px-2 py-0.5 rounded-full">
                      Selected
                    </span>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Bottom Vote CTA Button in preview */}
        <div className="pt-2">
          <button
            type="button"
            className="w-full py-3 rounded-xl bg-indigo-600/90 text-white font-semibold text-sm shadow-md shadow-indigo-500/20 cursor-default opacity-90"
          >
            Submit Vote
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-100 dark:border-white/[0.05]">
          <span>0 votes</span>
          <span>Anonymous • Powered by PollNow</span>
        </div>
      </div>
    </div>
  );
};

export default PollPreview;
