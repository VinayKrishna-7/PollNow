import React from 'react';
import { Sliders, Clock, Eye, ToggleLeft, ToggleRight, CheckSquare } from 'lucide-react';

export const PollSettings = ({ settings, setSettings, expiresOption, setExpiresOption }) => {
  const handleVotingTypeChange = (type) => {
    setSettings((prev) => ({
      ...prev,
      votingType: type,
      maxSelections: type === 'single' ? 1 : prev.maxSelections || 2,
    }));
  };

  const handleMaxSelectionsChange = (val) => {
    setSettings((prev) => ({
      ...prev,
      maxSelections: val === 'unlimited' ? null : Number(val),
    }));
  };

  const handleVisibilityChange = (visibility) => {
    setSettings((prev) => ({
      ...prev,
      resultsVisibility: visibility,
    }));
  };

  const toggleAllowVoteChange = () => {
    setSettings((prev) => ({
      ...prev,
      allowVoteChange: !prev.allowVoteChange,
    }));
  };

  return (
    <div className="space-y-6 pt-6 border-t border-slate-200 dark:border-white/[0.08]">
      <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
        <Sliders className="w-4 h-4 text-indigo-500" />
        <span>Poll Settings</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Setting 1: Voting Type */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <CheckSquare className="w-3.5 h-3.5 text-indigo-500" />
            Voting Type
          </label>
          <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.06]">
            <button
              type="button"
              onClick={() => handleVotingTypeChange('single')}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                settings.votingType === 'single'
                  ? 'bg-white dark:bg-[#1c202d] text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Single choice
            </button>
            <button
              type="button"
              onClick={() => handleVotingTypeChange('multiple')}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                settings.votingType === 'multiple'
                  ? 'bg-white dark:bg-[#1c202d] text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Multiple choice
            </button>
          </div>

          {/* Multiple choice max selections */}
          {settings.votingType === 'multiple' && (
            <div className="pt-2 animate-fade-in flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">Max selections:</span>
              <div className="flex items-center gap-1">
                {['2', '3', '4', '5', 'unlimited'].map((val) => {
                  const isSelected =
                    val === 'unlimited'
                      ? settings.maxSelections === null
                      : settings.maxSelections === Number(val);
                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleMaxSelectionsChange(val)}
                      className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 dark:bg-white/[0.05] text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {val === 'unlimited' ? '∞' : val}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Setting 2: Results Visibility */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-indigo-500" />
            Results Visibility
          </label>
          <select
            value={settings.resultsVisibility}
            onChange={(e) => handleVisibilityChange(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-xs font-medium bg-white dark:bg-[#161923] border border-slate-200 dark:border-white/[0.08] text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 shadow-sm"
          >
            <option value="afterVote" className="bg-white dark:bg-[#161923] text-slate-800 dark:text-slate-100">
              After voting (Standard)
            </option>
            <option value="always" className="bg-white dark:bg-[#161923] text-slate-800 dark:text-slate-100">
              Always visible (Public preview)
            </option>
            <option value="afterClose" className="bg-white dark:bg-[#161923] text-slate-800 dark:text-slate-100">
              Only after poll closes
            </option>
          </select>
        </div>

        {/* Setting 3: Allow Vote Changes */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06]">
          <div>
            <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Allow vote changes
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Voters can revise their selection
            </div>
          </div>
          <button
            type="button"
            onClick={toggleAllowVoteChange}
            className="text-slate-400 hover:text-indigo-500 transition-colors focus:outline-none"
            aria-label="Toggle allow vote changes"
          >
            {settings.allowVoteChange ? (
              <ToggleRight className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            ) : (
              <ToggleLeft className="w-7 h-7 text-slate-400" />
            )}
          </button>
        </div>

        {/* Setting 4: Poll Expiration */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            Poll Expiration
          </label>
          <select
            value={expiresOption}
            onChange={(e) => setExpiresOption(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-xs font-medium bg-white dark:bg-[#161923] border border-slate-200 dark:border-white/[0.08] text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 shadow-sm"
          >
            <option value="never" className="bg-white dark:bg-[#161923] text-slate-800 dark:text-slate-100">
              Never expires
            </option>
            <option value="10m" className="bg-white dark:bg-[#161923] text-slate-800 dark:text-slate-100">
              10 minutes
            </option>
            <option value="1h" className="bg-white dark:bg-[#161923] text-slate-800 dark:text-slate-100">
              1 hour
            </option>
            <option value="1d" className="bg-white dark:bg-[#161923] text-slate-800 dark:text-slate-100">
              1 day
            </option>
            <option value="7d" className="bg-white dark:bg-[#161923] text-slate-800 dark:text-slate-100">
              7 days
            </option>
            <option value="30d" className="bg-white dark:bg-[#161923] text-slate-800 dark:text-slate-100">
              30 days
            </option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default PollSettings;
