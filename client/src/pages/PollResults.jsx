import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  BarChart2,
  PieChart as PieIcon,
  Clock,
  Calendar,
  Layers,
  Share2,
  Settings,
  ArrowLeft,
  CheckCircle,
  Vote,
  Sparkles,
} from 'lucide-react';
import { getResults } from '../services/api';
import { getOrCreateVoterId } from '../utils/voter';
import ResultsChart from '../components/ResultsChart';
import ResultBar from '../components/ResultBar';
import StatsCard from '../components/StatsCard';
import Button from '../components/Button';
import ShareModal from '../components/ShareModal';
import ManagePollModal from '../components/ManagePollModal';
import LoadingSpinner from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { formatRelativeTime, formatDate, formatVoteCount } from '../utils/formatters';

export const PollResults = () => {
  const { pollId } = useParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  const fetchResults = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const voterId = getOrCreateVoterId();
      const res = await getResults(pollId, voterId);
      setData(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [pollId]);

  useEffect(() => {
    if (data?.question) {
      document.title = `Results: ${data.question} — PollNow`;
    }
  }, [data]);

  if (isLoading) {
    return <LoadingSpinner label="Loading analytics & results..." />;
  }

  if (error || !data) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <ErrorState
          statusCode={error?.status || 404}
          title={
            error?.status === 403
              ? 'Results are protected'
              : error?.status === 404
              ? 'Poll not found'
              : 'Failed to load results'
          }
          message={
            error?.message ||
            'Unable to load poll results. You may need to vote first.'
          }
          onRetry={fetchResults}
        />
      </div>
    );
  }

  const isClosed = data.status === 'closed';
  const isExpired = data.status === 'expired';
  const hasVoted = Boolean(data.userVote);

  const topOption = data.topOption || (data.options?.length > 0
    ? [...data.options].sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0))[0]
    : null);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Navigation & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Link
          to={`/p/${pollId}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Voting</span>
        </Link>

        <div className="flex items-center gap-2">
          {!hasVoted && !isClosed && !isExpired && (
            <Link to={`/p/${pollId}`}>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Vote className="w-4 h-4" />}
              >
                Cast Your Vote
              </Button>
            </Link>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsShareModalOpen(true)}
            leftIcon={<Share2 className="w-4 h-4" />}
          >
            Share
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsManageModalOpen(true)}
            leftIcon={<Settings className="w-4 h-4" />}
          >
            Manage
          </Button>
        </div>
      </div>

      {/* Main Header Card */}
      <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#12151e] border border-slate-200/80 dark:border-white/[0.08] shadow-sm">
        <div className="flex flex-wrap items-center gap-2.5 mb-4">
          {isClosed ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 dark:bg-white/[0.08] dark:text-slate-300">
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
              LIVE POLL
            </span>
          )}

          <span className="text-xs text-slate-400">
            Created {formatRelativeTime(data.createdAt)}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          {data.question}
        </h1>
      </div>

      {/* Analytics Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Total Votes"
          value={data.totalVotes?.toLocaleString() || 0}
          icon={BarChart2}
          color="indigo"
          subtitle="All recorded responses"
        />

        <StatsCard
          label="Top Choice"
          value={topOption && topOption.voteCount > 0 ? topOption.text : 'None yet'}
          icon={Sparkles}
          color="amber"
          subtitle={
            topOption && topOption.voteCount > 0
              ? `${topOption.voteCount} votes (${topOption.percentage || 0}%)`
              : 'Awaiting votes'
          }
        />

        <StatsCard
          label="Poll Status"
          value={data.status.toUpperCase()}
          icon={Clock}
          color={isClosed || isExpired ? 'amber' : 'emerald'}
          subtitle={
            data.expiresAt
              ? `Expires: ${formatDate(data.expiresAt)}`
              : 'No expiration date set'
          }
        />

        <StatsCard
          label="Voting Method"
          value={
            data.settings?.votingType === 'multiple'
              ? 'Multiple Choice'
              : 'Single Choice'
          }
          icon={Layers}
          color="blue"
          subtitle={
            data.settings?.votingType === 'multiple'
              ? `Max ${data.settings.maxSelections || 'unlimited'} choices`
              : '1 selection per voter'
          }
        />
      </div>

      {/* Main Charts & Breakdown Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Horizontal Vote Breakdown (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#12151e] border border-slate-200/80 dark:border-white/[0.08] shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/[0.06]">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-indigo-500" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Vote Breakdown
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              {formatVoteCount(data.totalVotes)}
            </span>
          </div>

          <div className="space-y-4">
            {data.options.map((opt) => (
              <ResultBar
                key={opt.optionId}
                text={opt.text}
                voteCount={opt.voteCount}
                percentage={opt.percentage}
                isUserChoice={data.userVote?.selectedOptionIds?.includes(opt.optionId)}
                isTopChoice={
                  topOption &&
                  topOption.voteCount > 0 &&
                  opt.optionId === topOption.optionId
                }
              />
            ))}
          </div>
        </div>

        {/* Right: Donut Chart Distribution (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#12151e] border border-slate-200/80 dark:border-white/[0.08] shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-white/[0.06]">
            <PieIcon className="w-4 h-4 text-indigo-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Results Distribution
            </h2>
          </div>

          <ResultsChart options={data.options} totalVotes={data.totalVotes || 0} />
        </div>
      </div>

      {/* Metadata & Audit Card */}
      <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#12151e] border border-slate-200/80 dark:border-white/[0.08] shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
          Poll Specifications
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05]">
            <span className="text-slate-400 block mb-1">Created At</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {formatDate(data.createdAt)}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05]">
            <span className="text-slate-400 block mb-1">Expiration Policy</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {data.expiresAt ? formatDate(data.expiresAt) : 'Indefinite (Never)'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05]">
            <span className="text-slate-400 block mb-1">Results Visibility</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {data.settings?.resultsVisibility === 'always'
                ? 'Always visible'
                : data.settings?.resultsVisibility === 'afterClose'
                ? 'Only after poll closes'
                : 'Visible after voting'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05]">
            <span className="text-slate-400 block mb-1">Vote Alterations</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {data.settings?.allowVoteChange ? 'Allowed' : 'Locked after vote'}
            </span>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        pollId={data.pollId}
        question={data.question}
      />

      {/* Manage Modal */}
      <ManagePollModal
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        pollId={data.pollId}
        isClosed={isClosed}
        onPollUpdated={fetchResults}
      />
    </div>
  );
};

export default PollResults;
