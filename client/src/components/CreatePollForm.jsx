import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  GripVertical,
  HelpCircle,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import Button from './Button';
import PollSettings from './PollSettings';

export const CreatePollForm = ({
  question,
  setQuestion,
  options,
  setOptions,
  settings,
  setSettings,
  expiresOption,
  setExpiresOption,
  onSubmit,
  isSubmitting,
}) => {
  const [errors, setErrors] = useState({});

  const handleQuestionChange = (e) => {
    const val = e.target.value;
    if (val.length <= 200) {
      setQuestion(val);
      if (errors.question) {
        setErrors((prev) => ({ ...prev, question: null }));
      }
    }
  };

  const handleOptionChange = (index, value) => {
    if (value.length <= 100) {
      const nextOptions = [...options];
      nextOptions[index] = value;
      setOptions(nextOptions);
      if (errors.options) {
        setErrors((prev) => ({ ...prev, options: null }));
      }
    }
  };

  const addOption = () => {
    if (options.length < 10) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      const nextOptions = options.filter((_, idx) => idx !== index);
      setOptions(nextOptions);
    }
  };

  const moveOption = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= options.length) return;
    const nextOptions = [...options];
    const temp = nextOptions[index];
    nextOptions[index] = nextOptions[targetIndex];
    nextOptions[targetIndex] = temp;
    setOptions(nextOptions);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!question.trim()) {
      newErrors.question = 'Please enter a poll question';
    } else if (question.trim().length > 200) {
      newErrors.question = 'Question cannot exceed 200 characters';
    }

    const cleanOptions = options.map((o) => o.trim());
    if (cleanOptions.length < 2) {
      newErrors.options = 'At least 2 options are required';
    } else if (cleanOptions.some((o) => o.length === 0)) {
      newErrors.options = 'All options must have text';
    } else {
      // Check for duplicates
      const seen = new Set();
      for (const opt of cleanOptions) {
        const lower = opt.toLowerCase();
        if (seen.has(lower)) {
          newErrors.options = `Duplicate option: "${opt}"`;
          break;
        }
        seen.add(lower);
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Question Input Card */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
            Poll Question
          </label>
          <span
            className={`text-xs tabular-nums font-mono ${
              question.length > 180 ? 'text-amber-500 font-semibold' : 'text-slate-400'
            }`}
          >
            {question.length} / 200
          </span>
        </div>

        <div className="relative">
          <textarea
            rows={2}
            value={question}
            onChange={handleQuestionChange}
            placeholder="What would you like to ask?"
            className={`w-full px-4 py-3 rounded-2xl bg-white dark:bg-[#12151e] border text-slate-900 dark:text-white placeholder-slate-400 text-base sm:text-lg font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none shadow-sm ${
              errors.question
                ? 'border-rose-500 focus:ring-rose-500'
                : 'border-slate-200 dark:border-white/[0.08]'
            }`}
          />
        </div>

        {errors.question && (
          <p className="text-xs font-medium text-rose-500 flex items-center gap-1 mt-1 animate-fade-in">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.question}
          </p>
        )}
      </div>

      {/* Options List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Answer Options ({options.length}/10)
          </label>
          <span className="text-[11px] text-slate-400">
            Min 2, max 10 options
          </span>
        </div>

        <div className="space-y-2.5">
          {options.map((opt, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 group animate-fade-in"
            >
              {/* Move Up/Down Controls */}
              <div className="flex flex-col text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <button
                  type="button"
                  onClick={() => moveOption(idx, -1)}
                  disabled={idx === 0}
                  className="p-0.5 disabled:opacity-20 hover:text-indigo-500 focus:outline-none"
                  aria-label="Move option up"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => moveOption(idx, 1)}
                  disabled={idx === options.length - 1}
                  className="p-0.5 disabled:opacity-20 hover:text-indigo-500 focus:outline-none"
                  aria-label="Move option down"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Text Input */}
              <div className="relative flex-1">
                <input
                  type="text"
                  value={opt}
                  maxLength={100}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                  placeholder={`Option ${idx + 1}`}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#12151e] border border-slate-200 dark:border-white/[0.08] text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-sm transition-all"
                />
                {opt.length > 80 && (
                  <span className="absolute right-3 top-3 text-[10px] text-amber-500 font-mono">
                    {opt.length}/100
                  </span>
                )}
              </div>

              {/* Delete Button */}
              <button
                type="button"
                onClick={() => removeOption(idx)}
                disabled={options.length <= 2}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 disabled:opacity-20 disabled:pointer-events-none transition-colors"
                aria-label={`Delete Option ${idx + 1}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {errors.options && (
          <p className="text-xs font-medium text-rose-500 flex items-center gap-1 mt-1 animate-fade-in">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.options}
          </p>
        )}

        {/* Add Option Button */}
        {options.length < 10 && (
          <button
            type="button"
            onClick={addOption}
            className="w-full py-2.5 px-3 rounded-xl border border-dashed border-slate-300 dark:border-white/[0.15] text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-white/[0.02] flex items-center justify-center gap-1.5 transition-all mt-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add option</span>
          </button>
        )}
      </div>

      {/* Settings Section */}
      <PollSettings
        settings={settings}
        setSettings={setSettings}
        expiresOption={expiresOption}
        setExpiresOption={setExpiresOption}
      />

      {/* Submit Button */}
      <div className="pt-4">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isSubmitting}
          className="w-full justify-center text-base font-semibold shadow-indigo-500/25"
          leftIcon={<Sparkles className="w-5 h-5" />}
        >
          {isSubmitting ? 'Creating poll...' : 'Create & Share Poll'}
        </Button>
      </div>
    </form>
  );
};

export default CreatePollForm;
