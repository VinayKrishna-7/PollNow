import { useState, useEffect, useCallback } from 'react';
import { getPoll, voteOnPoll, getResults } from '../services/api';
import { getOrCreateVoterId } from '../utils/voter';

export const usePoll = (pollId) => {
  const [poll, setPoll] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVoting, setIsVoting] = useState(false);

  const fetchPoll = useCallback(async () => {
    if (!pollId) return;
    setIsLoading(true);
    setError(null);
    try {
      const voterId = getOrCreateVoterId();
      const res = await getPoll(pollId, voterId);
      setPoll(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [pollId]);

  useEffect(() => {
    fetchPoll();
  }, [fetchPoll]);

  const submitVote = async (optionIds) => {
    setIsVoting(true);
    try {
      const voterId = getOrCreateVoterId();
      const res = await voteOnPoll(pollId, { voterId, optionIds });
      setPoll(res.data);
      return res.data;
    } catch (err) {
      throw err;
    } finally {
      setIsVoting(false);
    }
  };

  return {
    poll,
    setPoll,
    isLoading,
    error,
    isVoting,
    refetch: fetchPoll,
    submitVote,
  };
};

export default usePoll;
