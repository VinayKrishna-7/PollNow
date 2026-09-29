import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import CreatePollForm from '../components/CreatePollForm';
import PollPreview from '../components/PollPreview';
import ShareModal from '../components/ShareModal';
import { createPoll } from '../services/api';
import { storeManagementToken } from '../utils/voter';
import { useToast } from '../context/ToastContext';

export const CreatePoll = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [settings, setSettings] = useState({
    votingType: 'single',
    maxSelections: 1,
    resultsVisibility: 'afterVote',
    allowVoteChange: false,
  });
  const [expiresOption, setExpiresOption] = useState('never');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Success modal state
  const [createdPoll, setCreatedPoll] = useState(null);
  const [managementToken, setManagementToken] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const toast = useToast();

  useEffect(() => {
    document.title = 'Create a Poll — PollNow';
  }, []);

  const calculateExpiresAt = (option) => {
    const now = Date.now();
    switch (option) {
      case '10m':
        return new Date(now + 10 * 60 * 1000).toISOString();
      case '1h':
        return new Date(now + 60 * 60 * 1000).toISOString();
      case '1d':
        return new Date(now + 24 * 60 * 60 * 1000).toISOString();
      case '7d':
        return new Date(now + 7 * 24 * 60 * 60 * 1000).toISOString();
      case '30d':
        return new Date(now + 30 * 24 * 60 * 60 * 1000).toISOString();
      default:
        return null;
    }
  };

  const handleCreateSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        question: question.trim(),
        options: options.map((o) => o.trim()).filter(Boolean),
        settings: {
          votingType: settings.votingType,
          maxSelections:
            settings.votingType === 'single'
              ? 1
              : settings.maxSelections || options.length,
          resultsVisibility: settings.resultsVisibility,
          allowVoteChange: settings.allowVoteChange,
        },
        expiresAt: calculateExpiresAt(expiresOption),
      };

      const res = await createPoll(payload);
      const pollData = res.data.poll;
      const rawToken = res.data.managementToken;

      // Store management token in browser storage
      storeManagementToken(pollData.pollId, rawToken);

      setCreatedPoll(pollData);
      setManagementToken(rawToken);
      setIsShareModalOpen(true);

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Ignore if unsupported
      }

      toast.success('Poll created successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to create poll');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="max-w-3xl mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Create a poll
        </h1>
        <p className="text-base text-slate-500 dark:text-slate-400 mt-2">
          Ask a question. Add your options. Share the link.
        </p>
      </div>

      {/* Two Column Layout on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Form Builder (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#12151e] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/[0.08] shadow-sm">
          <CreatePollForm
            question={question}
            setQuestion={setQuestion}
            options={options}
            setOptions={setOptions}
            settings={settings}
            setSettings={setSettings}
            expiresOption={expiresOption}
            setExpiresOption={setExpiresOption}
            onSubmit={handleCreateSubmit}
            isSubmitting={isSubmitting}
          />
        </div>

        {/* Right Column: Live Sticky Preview (5 cols) */}
        <div className="lg:col-span-5 sticky top-24">
          <PollPreview
            question={question}
            options={options}
            settings={settings}
            expiresOption={expiresOption}
          />
        </div>
      </div>

      {/* Share Modal on Success */}
      {createdPoll && (
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          pollId={createdPoll.pollId}
          question={createdPoll.question}
          managementToken={managementToken}
          isInitialSuccess
        />
      )}
    </div>
  );
};

export default CreatePoll;
