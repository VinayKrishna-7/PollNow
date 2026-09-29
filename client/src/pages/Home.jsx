import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Zap,
  Share2,
  UserX,
  PieChart,
  Clock,
  ShieldCheck,
  ArrowRight,
  Plus,
  Compass,
  Check,
  BarChart2,
  Sparkles,
} from 'lucide-react';
import Button from '../components/Button';
import ResultBar from '../components/ResultBar';
import { getPolls, getPoll, voteOnPoll } from '../services/api';
import { getOrCreateVoterId } from '../utils/voter';
import { formatVoteCount } from '../utils/formatters';
import { useToast } from '../context/ToastContext';

export const Home = () => {
  const [featuredPoll, setFeaturedPoll] = useState(null);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [isVoting, setIsVoting] = useState(false);
  const [isLoadingPoll, setIsLoadingPoll] = useState(true);
  const toast = useToast();

  useEffect(() => {
    document.title = 'PollNow — Create. Share. Vote.';
  }, []);

  // Fetch real featured active poll from database
  useEffect(() => {
    const fetchLatestPoll = async () => {
      try {
        const voterId = getOrCreateVoterId();
        const res = await getPolls({ limit: 1, sort: 'newest', status: 'active' });
        const list = res.data?.polls || [];
        if (list.length > 0) {
          const detailRes = await getPoll(list[0].pollId, voterId);
          setFeaturedPoll(detailRes.data);
          if (detailRes.data.userVote?.selectedOptionIds?.length > 0) {
            setSelectedOptionId(detailRes.data.userVote.selectedOptionIds[0]);
          }
        } else {
          setFeaturedPoll(null);
        }
      } catch {
        setFeaturedPoll(null);
      } finally {
        setIsLoadingPoll(false);
      }
    };

    fetchLatestPoll();
  }, []);

  const handleVoteSubmit = async () => {
    if (!featuredPoll || !selectedOptionId) {
      toast.info('Please select an option');
      return;
    }
    setIsVoting(true);
    try {
      const voterId = getOrCreateVoterId();
      const res = await voteOnPoll(featuredPoll.pollId, {
        voterId,
        optionIds: [selectedOptionId],
      });
      setFeaturedPoll(res.data);
      toast.success('Vote submitted successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to submit vote');
    } finally {
      setIsVoting(false);
    }
  };

  const hasVoted = Boolean(featuredPoll?.userVote);

  return (
    <div className="space-y-24 sm:space-y-32 pb-24 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 lg:pt-28 text-center max-w-5xl mx-auto px-4 sm:px-6">
        {/* Glow ambient background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-r from-indigo-500/20 via-violet-500/15 to-emerald-500/15 rounded-full blur-[100px] pointer-events-none -z-10" />

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-6"
        >
          Create polls.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-500 dark:from-indigo-400 dark:via-violet-300 dark:to-indigo-200">
            Get answers.
          </span>
        </motion.h1>

        {/* Supporting text */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal"
        >
          Create a poll in seconds, share one simple link, and collect opinions
          without requiring an account.
        </motion.p>

        {/* Hero CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link to="/create" className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="lg"
              leftIcon={<Plus className="w-5 h-5" />}
              className="w-full sm:w-auto px-8 font-semibold shadow-indigo-500/25"
            >
              Create a Poll
            </Button>
          </Link>
          <Link to="/polls" className="w-full sm:w-auto">
            <Button
              variant="secondary"
              size="lg"
              leftIcon={<Compass className="w-5 h-5" />}
              className="w-full sm:w-auto px-7"
            >
              Explore Polls
            </Button>
          </Link>
        </motion.div>

        {/* Real Live Poll / Clean Creation Callout */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="relative max-w-xl mx-auto rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#12151e] border border-slate-200 dark:border-white/[0.08] shadow-2xl text-left"
        >
          {isLoadingPoll ? (
            <div className="py-12 text-center text-slate-400 text-sm animate-pulse">
              Connecting to live polls...
            </div>
          ) : featuredPoll ? (
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Community Poll
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {formatVoteCount(featuredPoll.totalVotes)}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-5 leading-tight">
                {featuredPoll.question}
              </h3>

              {!hasVoted ? (
                <div className="space-y-2.5">
                  {featuredPoll.options.map((opt) => (
                    <button
                      key={opt.optionId}
                      type="button"
                      onClick={() => setSelectedOptionId(opt.optionId)}
                      className={`w-full flex items-center justify-between p-3.5 sm:p-4 rounded-xl border text-sm font-medium transition-all duration-200 ${
                        selectedOptionId === opt.optionId
                          ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 text-indigo-950 dark:text-indigo-100'
                          : 'bg-slate-50/70 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.06] hover:border-slate-300 dark:hover:border-white/[0.15] text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center ${
                            selectedOptionId === opt.optionId
                              ? 'bg-indigo-600 text-white'
                              : 'border border-slate-300 dark:border-white/20'
                          }`}
                        >
                          {selectedOptionId === opt.optionId && (
                            <Check className="w-3 h-3 stroke-[3]" />
                          )}
                        </div>
                        <span className="truncate">{opt.text}</span>
                      </div>
                      <span className="text-xs text-slate-400 group-hover:text-indigo-500">
                        Select
                      </span>
                    </button>
                  ))}

                  <div className="pt-2 flex items-center gap-3">
                    <Button
                      variant="primary"
                      size="md"
                      onClick={handleVoteSubmit}
                      isLoading={isVoting}
                      disabled={!selectedOptionId}
                      className="flex-1 justify-center"
                    >
                      Submit Vote
                    </Button>
                    <Link to={`/p/${featuredPoll.pollId}`}>
                      <Button variant="outline" size="md">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-fade-in">
                  {featuredPoll.options.map((opt) => (
                    <ResultBar
                      key={opt.optionId}
                      text={opt.text}
                      voteCount={opt.voteCount}
                      percentage={opt.percentage}
                      isUserChoice={featuredPoll.userVote?.selectedOptionIds?.includes(opt.optionId)}
                      isTopChoice={
                        opt.voteCount > 0 &&
                        opt.voteCount === Math.max(...featuredPoll.options.map((o) => o.voteCount || 0))
                      }
                    />
                  ))}

                  <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
                    <span>Vote recorded anonymously</span>
                    <Link
                      to={`/p/${featuredPoll.pollId}/results`}
                      className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1"
                    >
                      <span>Full Analytics</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Clean Empty State Prompt when no polls in DB */
            <div className="py-8 text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Ready to ask a question?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  Create a poll in seconds, share with your audience, and get real-time answers.
                </p>
              </div>
              <Link to="/create">
                <Button
                  variant="primary"
                  size="md"
                  leftIcon={<Plus className="w-4 h-4" />}
                >
                  Create First Poll
                </Button>
              </Link>
            </div>
          )}
        </motion.div>
      </section>

      {/* Feature Cards Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
            Everything you need to ask better questions.
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
            High performance polling designed without unnecessary complexity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="group rounded-2xl p-7 bg-white dark:bg-[#12151e] border border-slate-200/80 dark:border-white/[0.08] hover:border-indigo-500/40 dark:hover:border-indigo-500/40 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-5 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              1. Instant Polls
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Create a poll in seconds. Type your question, add 2 to 10 choices, and generate a shareable link immediately.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group rounded-2xl p-7 bg-white dark:bg-[#12151e] border border-slate-200/80 dark:border-white/[0.08] hover:border-indigo-500/40 dark:hover:border-indigo-500/40 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-5 group-hover:scale-110 transition-transform">
              <Share2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              2. Share Anywhere
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              One link works everywhere. Drop your poll into Slack, Discord, Twitter, WhatsApp, or email newsletters seamlessly.
            </p>
          </div>

          {/* Card 3 */}
          <div className="group rounded-2xl p-7 bg-white dark:bg-[#12151e] border border-slate-200/80 dark:border-white/[0.08] hover:border-indigo-500/40 dark:hover:border-indigo-500/40 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-5 group-hover:scale-110 transition-transform">
              <UserX className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              3. Anonymous Voting
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              No account required. Voters cast their choice with zero friction, while duplicate voting is prevented securely.
            </p>
          </div>

          {/* Card 4 */}
          <div className="group rounded-2xl p-7 bg-white dark:bg-[#12151e] border border-slate-200/80 dark:border-white/[0.08] hover:border-indigo-500/40 dark:hover:border-indigo-500/40 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-5 group-hover:scale-110 transition-transform">
              <PieChart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              4. Beautiful Results
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Understand responses instantly with real-time percentage progress bars, interactive donut charts, and breakdown statistics.
            </p>
          </div>

          {/* Card 5 */}
          <div className="group rounded-2xl p-7 bg-white dark:bg-[#12151e] border border-slate-200/80 dark:border-white/[0.08] hover:border-indigo-500/40 dark:hover:border-indigo-500/40 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-5 group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              5. Poll Expiration
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Automatically close polls when time runs out. Support for 10 minutes, 1 hour, 1 day, 7 days, 30 days, or indefinite.
            </p>
          </div>

          {/* Card 6 */}
          <div className="group rounded-2xl p-7 bg-white dark:bg-[#12151e] border border-slate-200/80 dark:border-white/[0.08] hover:border-indigo-500/40 dark:hover:border-indigo-500/40 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400 mb-5 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              6. Privacy First
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              No unnecessary accounts, profiles, passwords, or intrusive trackers. Clean, honest polling that respects user privacy.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Simple 3-step workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">
            How PollNow Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="relative flex flex-col items-center text-center p-8 rounded-3xl bg-white dark:bg-[#12151e] border border-slate-200/80 dark:border-white/[0.08] shadow-sm">
            <span className="text-4xl font-black text-indigo-600/30 dark:text-indigo-400/20 mb-3 tabular-nums font-mono">
              01
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Create
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Write your question and add your options. Configure single or multiple choice and optional expiration.
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative flex flex-col items-center text-center p-8 rounded-3xl bg-white dark:bg-[#12151e] border border-slate-200/80 dark:border-white/[0.08] shadow-sm">
            <span className="text-4xl font-black text-indigo-600/30 dark:text-indigo-400/20 mb-3 tabular-nums font-mono">
              02
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Share
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Copy your unique PollNow link and share it anywhere. Your voters won&apos;t need to log in or download anything.
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative flex flex-col items-center text-center p-8 rounded-3xl bg-white dark:bg-[#12151e] border border-slate-200/80 dark:border-white/[0.08] shadow-sm">
            <span className="text-4xl font-black text-indigo-600/30 dark:text-indigo-400/20 mb-3 tabular-nums font-mono">
              03
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Vote
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Collect responses in real-time and view interactive charts and breakdowns according to your visibility settings.
            </p>
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-16 text-center">
          <Link to="/create">
            <Button
              variant="primary"
              size="lg"
              leftIcon={<Plus className="w-5 h-5" />}
              className="px-8 font-semibold shadow-indigo-500/30"
            >
              Start Polling for Free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
