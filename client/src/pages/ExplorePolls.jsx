import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, ArrowLeft, ArrowRight } from 'lucide-react';
import { getPolls } from '../services/api';
import PollCard from '../components/PollCard';
import { PollCardSkeleton } from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';

export const ExplorePolls = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [polls, setPolls] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Search states from URL or defaults
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [status, setStatus] = useState(searchParams.get('status') || 'all');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const page = parseInt(searchParams.get('page') || '1', 10);

  useEffect(() => {
    document.title = 'Explore Polls — PollNow';
  }, []);

  const fetchPolls = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getPolls({
        page,
        limit: 12,
        search: search.trim(),
        status,
        sort,
      });
      setPolls(res.data.polls || []);
      setPagination(res.data.pagination || { page: 1, limit: 12, total: 0, totalPages: 1 });
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [page, search, status, sort]);

  // Debounced search trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPolls();
    }, 300);

    return () => clearTimeout(timer);
  }, [fetchPolls]);

  // Update URL params when filters change
  const updateUrlParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value && value !== 'all' && value !== 'newest') {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    if (key !== 'page') {
      next.delete('page'); // Reset to page 1 on filter/search change
    }
    setSearchParams(next);
  };

  const handleSearchChange = (val) => {
    setSearch(val);
    updateUrlParam('search', val);
  };

  const handleStatusChange = (val) => {
    setStatus(val);
    updateUrlParam('status', val);
  };

  const handleSortChange = (val) => {
    setSort(val);
    updateUrlParam('sort', val);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      const next = new URLSearchParams(searchParams);
      next.set('page', newPage.toString());
      setSearchParams(next);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatus('all');
    setSort('newest');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Explore Polls
        </h1>
        <p className="text-base text-slate-500 dark:text-slate-400 mt-2">
          Discover what people are asking and cast your vote.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#12151e] border border-slate-200/80 dark:border-white/[0.08] shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search polls by question..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.06] text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 self-start md:self-auto p-1 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200/60 dark:border-white/[0.06]">
          {[
            { id: 'all', label: 'All' },
            { id: 'active', label: 'Active' },
            { id: 'closed', label: 'Closed' },
          ].map((pill) => (
            <button
              key={pill.id}
              type="button"
              onClick={() => handleStatusChange(pill.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                status === pill.id
                  ? 'bg-white dark:bg-[#1c202d] text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white dark:bg-[#161923] border border-slate-200 dark:border-white/[0.08] text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 shadow-sm"
          >
            <option value="newest" className="bg-white dark:bg-[#161923] text-slate-800 dark:text-slate-100">
              Newest First
            </option>
            <option value="mostVotes" className="bg-white dark:bg-[#161923] text-slate-800 dark:text-slate-100">
              Most Votes
            </option>
            <option value="oldest" className="bg-white dark:bg-[#161923] text-slate-800 dark:text-slate-100">
              Oldest First
            </option>
          </select>
        </div>
      </div>

      {/* Poll Cards Grid or Skeletons */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <PollCardSkeleton key={i} />
          ))}
        </div>
      ) : polls.length === 0 ? (
        <EmptyState
          title="No polls found"
          description={
            search || status !== 'all'
              ? 'No polls matched your search criteria. Try clearing filters or creating a new poll.'
              : 'No polls have been created yet. Be the first to start a conversation!'
          }
          onReset={search || status !== 'all' ? handleResetFilters : null}
          actionText="Create a Poll"
          actionLink="/create"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {polls.map((poll) => (
            <PollCard key={poll.pollId} poll={poll} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {!isLoading && pagination.totalPages > 1 && (
        <div className="pt-6 border-t border-slate-200 dark:border-white/[0.08] flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Showing Page <span className="font-semibold">{pagination.page}</span> of{' '}
            <span className="font-semibold">{pagination.totalPages}</span> ({pagination.total} polls)
          </span>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExplorePolls;
