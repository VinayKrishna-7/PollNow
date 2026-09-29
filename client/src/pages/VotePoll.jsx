import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Clock,
  BarChart2,
  Share2,
  CheckCircle2,
  AlertCircle,
  Settings,
  ArrowRight,
  RotateCcw,
  PlusCircle,
} from 'lucide-react';
import usePoll from '../hooks/usePoll';
import PollOption from '../components/PollOption';
import ResultBar from '../components/ResultBar';
import Button from '../components/Button';
import ShareModal from '../components/ShareModal';
import ManagePollModal from '../components/ManagePollModal';
import { PollSkeleton } from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { formatCountdown, formatVoteCount } from '../utils/formatters';
import { useToast } from '../context/ToastContext';

export const VotePoll = () => {
  const { pollId } = useParams();
  const { poll, setPoll, isLoading, error, isVoting, submitVote, refetch } = usePoll(pollId);

  const [selectedOptionIds, setSelectedOptionIds] = useState([]);
  const [isEditingVote, setIsEditingVote] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [countdownText, setCountdownText] = useState('');

  const toast = useToast();

  // Dynamic document title
  useEffect(() => {
    if (poll?.question) {
      document.title = `${poll.question} — PollNow`;
    } else {
      document.title = 'Vote on Poll — PollNow';
    }
  }, [poll]);

  // Sync selectedOptionIds if user has voted before
  useEffect(() => {
    if (poll?.userVote?.selectedOptionIds) {
      setSelectedOptionIds(poll.userVote.selectedOptionIds);
    }
  }, [poll]);

  // Live countdown timer ticker
  useEffect(() => {
    if (!poll?.expiresAt) return;

    const updateCountdown = () => {
      const cd = formatCountdown(poll.expiresAt);
      setCountdownText(cd.text);
      if (cd.isExpired && poll.status === 'active') {
        // Poll just expired while user is on page!
        refetch();
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [poll, refetch]);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <PollSkeleton />
      </div>
    );
  }

  if (error || !poll) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <ErrorState
          statusCode={error?.status || 404}
          title={error?.status === 404 ? 'Poll not found' : 'Unable to load poll'}
          message={
            error?.message ||
            "The poll you are looking for doesn't exist or may have been removed."
          }
          onRetry={refetch}
        />
      </div>
    );
  }

  const isMultiple = poll.settings?.votingType === 'multiple';
  const maxSelections = isMultiple ? (poll.settings?.maxSelections || poll.options.length) : 1;
  const isClosed = poll.status === 'closed';
  const isExpired = poll.status === 'expired';
  const isInactive = isClosed || isExpired;
  const hasVoted = Boolean(poll.userVote);
  const allowVoteChange = Boolean(poll.settings?.allowVoteChange);

  // Results visibility logic
  const canShowResults = !poll.resultsHidden;

  const handleSelectOption = (optionId) => {
    if (isInactive) return;

    if (isMultiple) {
      if (selectedOptionIds.includes(optionId)) {
        setSelectedOptionIds(selectedOptionIds.filter((id) => id !== optionId));
      } else {
        if (selectedOptionIds.length < maxSelections) {
          setSelectedOptionIds([...selectedOptionIds, optionId]);
        } else {
          toast.info(`You can select at most ${maxSelections} options`);
        }
      }
    } else {
      setSelectedOptionIds([optionId]);
    }
  };

  const handleVoteSubmit = async () => {
    if (selectedOptionIds.length === 0) {
      toast.error('Please select at least one option to vote');
      return;
    }

    try {
      await submitVote(selectedOptionIds);
      setIsEditingVote(false);
      toast.success(hasVoted ? 'Your vote has been updated!' : 'Vote submitted successfully!');
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {
        // Ignore
      }
    } catch (err) {
      toast.error(err.message || 'Failed to submit vote');
    }
  };

  const handlePollUpdated = (updated) => {
    setPoll(updated);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      {/* Centered Poll Card */}
      <div className="relative rounded-3xl p-6 sm:p-10 bg-white dark:bg-[#12151e] border border-slate-200/90 dark:border-white/[0.08] shadow-2xl transition-all">
        {/* Top Badges & Status */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            {isClosed ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-white/[0.08] text-slate-600 dark:text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                CLOSED
              </span>
            ) : isExpired ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                EXPIRED
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                ACTIVE
              </span>
            )}

            {poll.expiresAt && !isInactive && (
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                {countdownText}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
              title="Share poll"
              aria-label="Share poll"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setIsManageModalOpen(true)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
              title="Manage poll"
              aria-label="Manage poll"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Question Heading */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug break-words">
            {poll.question}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">
            {isMultiple
              ? `Select up to ${maxSelections} options`
              : 'Choose one option'}
          </p>
        </div>

        {/* Inactive Notice Banner */}
        {isInactive && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300 flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>
              This poll is {isClosed ? 'closed' : 'expired'} and no longer accepting votes.
            </span>
          </div>
        )}

        {/* View Mode: Voting Form OR Results State */}
        {hasVoted && !isEditingVote ? (
          /* User has voted state */
          <div className="space-y-6">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>You&apos;ve cast your vote on this poll.</span>
              </div>
              {allowVoteChange && !isInactive && (
                <button
                  type="button"
                  onClick={() => setIsEditingVote(true)}
                  className="font-bold underline hover:opacity-80 transition-opacity ml-2 shrink-0"
                >
                  Change vote
                </button>
              )}
            </div>

            {canShowResults ? (
              <div className="space-y-4 pt-2">
                {poll.options.map((opt) => (
                  <ResultBar
                    key={opt.optionId}
                    text={opt.text}
                    voteCount={opt.voteCount}
                    percentage={opt.percentage}
                    isUserChoice={poll.userVote?.selectedOptionIds?.includes(opt.optionId)}
                    isTopChoice={
                      opt.voteCount > 0 &&
                      opt.voteCount === Math.max(...poll.options.map((o) => o.voteCount || 0))
                    }
                  />
                ))}
              </div>
            ) : (
              <div className="p-6 text-center rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05]">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Results for this poll are hidden until the poll closes.
                </p>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">
                {formatVoteCount(poll.totalVotes)}
              </span>
              <Link to={`/p/${poll.pollId}/results`}>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<BarChart2 className="w-3.5 h-3.5" />}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Full Analytics
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          /* Active Voting Selection Form */
          <div className="space-y-6">
            <div className="space-y-3">
              {poll.options.map((opt) => (
                <PollOption
                  key={opt.optionId}
                  option={opt}
                  isSelected={selectedOptionIds.includes(opt.optionId)}
                  onSelect={handleSelectOption}
                  isMultiple={isMultiple}
                  disabled={isInactive}
                />
              ))}
            </div>

            {!isInactive && (
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleVoteSubmit}
                  isLoading={isVoting}
                  disabled={selectedOptionIds.length === 0}
                  className="w-full justify-center text-base font-semibold shadow-indigo-500/25"
                >
                  {isVoting
                    ? 'Submitting...'
                    : hasVoted
                    ? 'Update Vote'
                    : 'Submit Vote'}
                </Button>

                {isEditingVote && (
                  <Button
                    variant="ghost"
                    size="md"
                    onClick={() => {
                      setIsEditingVote(false);
                      setSelectedOptionIds(poll.userVote?.selectedOptionIds || []);
                    }}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            )}

            {/* Poll footer stats */}
            <div className="pt-4 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <BarChart2 className="w-3.5 h-3.5 text-indigo-500" />
                <span>{formatVoteCount(poll.totalVotes)}</span>
              </div>

              {canShowResults && (
                <Link
                  to={`/p/${poll.pollId}/results`}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <span>View live results</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        pollId={poll.pollId}
        question={poll.question}
      />

      {/* Manage Poll Modal */}
      <ManagePollModal
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        pollId={poll.pollId}
        isClosed={isClosed}
        onPollUpdated={handlePollUpdated}
      />
    </div>
  );
};

export default VotePoll;
