import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Trash2, PowerOff, AlertTriangle } from 'lucide-react';
import Button from './Button';
import { useToast } from '../context/ToastContext';
import { closePoll, deletePoll } from '../services/api';
import { getManagementToken, removeManagementToken } from '../utils/voter';
import { useNavigate } from 'react-router-dom';

export const ManagePollModal = ({
  isOpen,
  onClose,
  pollId,
  isClosed,
  onPollUpdated,
}) => {
  const [tokenInput, setTokenInput] = useState('');
  const [isClosing, setIsClosing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      const stored = getManagementToken(pollId);
      if (stored) {
        setTokenInput(stored);
      }
    }
  }, [isOpen, pollId]);

  if (!isOpen) return null;

  const handleClosePoll = async () => {
    if (!tokenInput.trim()) {
      toast.error('Please enter the management token');
      return;
    }
    setIsClosing(true);
    try {
      const res = await closePoll(pollId, tokenInput.trim());
      toast.success('Poll closed successfully');
      if (onPollUpdated) onPollUpdated(res.data);
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to close poll');
    } finally {
      setIsClosing(false);
    }
  };

  const handleDeletePoll = async () => {
    if (!tokenInput.trim()) {
      toast.error('Please enter the management token');
      return;
    }
    setIsDeleting(true);
    try {
      await deletePoll(pollId, tokenInput.trim());
      removeManagementToken(pollId);
      toast.success('Poll deleted permanently');
      onClose();
      navigate('/polls');
    } catch (err) {
      toast.error(err.message || 'Failed to delete poll');
      setIsDeleting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md rounded-2xl bg-white dark:bg-[#12151e] border border-slate-200 dark:border-white/[0.08] shadow-2xl p-6 z-10 overflow-hidden"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Manage Poll
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Poll creator actions
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                Management Token
              </label>
              <input
                type="password"
                placeholder="Enter 32-character key"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] text-sm text-slate-800 dark:text-white placeholder-slate-400 font-mono focus:outline-none focus:border-indigo-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Received when you created this poll.
              </span>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-white/[0.06] space-y-3">
              {/* Close Poll Action */}
              {!isClosed ? (
                <Button
                  variant="outline"
                  size="md"
                  onClick={handleClosePoll}
                  isLoading={isClosing}
                  leftIcon={<PowerOff className="w-4 h-4 text-amber-500" />}
                  className="w-full justify-center"
                >
                  Close Poll (Stop Voting)
                </Button>
              ) : (
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/[0.03] text-center text-xs font-medium text-slate-500">
                  This poll is already closed
                </div>
              )}

              {/* Delete Poll Action */}
              {!showConfirmDelete ? (
                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => setShowConfirmDelete(true)}
                  leftIcon={<Trash2 className="w-4 h-4 text-rose-500" />}
                  className="w-full justify-center text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                >
                  Delete Poll Permanently
                </Button>
              ) : (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-3">
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-medium">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Are you sure? This cannot be undone.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={handleDeletePoll}
                      isLoading={isDeleting}
                      className="flex-1"
                    >
                      Confirm Delete
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowConfirmDelete(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ManagePollModal;
