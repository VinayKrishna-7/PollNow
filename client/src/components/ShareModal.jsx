import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Copy,
  Check,
  Share2,
  ExternalLink,
  Key,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import Button from './Button';
import { useToast } from '../context/ToastContext';

export const ShareModal = ({
  isOpen,
  onClose,
  pollId,
  question,
  managementToken = null,
  isInitialSuccess = false,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const toast = useToast();

  if (!isOpen) return null;

  const pollUrl = `${window.location.origin}/p/${pollId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(pollUrl);
      setCopiedLink(true);
      toast.success('Poll link copied to clipboard!');
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const handleCopyToken = async () => {
    if (!managementToken) return;
    try {
      await navigator.clipboard.writeText(managementToken);
      setCopiedToken(true);
      toast.success('Management token copied!');
      setTimeout(() => setCopiedToken(false), 2000);
    } catch {
      toast.error('Failed to copy token');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: question ? `${question} — PollNow` : 'PollNow',
          text: `Vote on this poll: "${question || 'Quick question'}"`,
          url: pollUrl,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-[#12151e] border border-slate-200 dark:border-white/[0.08] shadow-2xl p-6 sm:p-7 z-10 overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.05] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="mb-6">
            {isInitialSuccess ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Your poll is ready!
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Share the link and start collecting votes instantly.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Share this poll
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Anyone with this link can cast their vote.
                </p>
              </div>
            )}
          </div>

          {/* Poll Link section */}
          <div className="space-y-2 mb-6">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              Public Poll Link
            </label>
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08]">
              <input
                type="text"
                readOnly
                value={pollUrl}
                className="bg-transparent flex-1 px-3 py-1.5 text-xs sm:text-sm font-mono text-slate-700 dark:text-slate-300 outline-none truncate"
              />
              <Button
                size="sm"
                variant={copiedLink ? 'secondary' : 'primary'}
                onClick={handleCopyLink}
                leftIcon={copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              >
                {copiedLink ? 'Copied' : 'Copy Link'}
              </Button>
            </div>
          </div>

          {/* Management Token section (only shown immediately after poll creation) */}
          {managementToken && (
            <div className="mb-6 p-4 rounded-xl bg-amber-500/[0.06] border border-amber-500/20 text-slate-800 dark:text-slate-200">
              <div className="flex items-start gap-2.5 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                    Creator Management Key (Save This)
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    This key allows you to close or delete your poll. It will never be shown again!
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3 p-1 rounded-lg bg-white/60 dark:bg-black/30 border border-amber-500/20">
                <span className="font-mono text-xs text-amber-600 dark:text-amber-400 px-2 py-1 truncate flex-1 select-all">
                  {managementToken}
                </span>
                <button
                  type="button"
                  onClick={handleCopyToken}
                  className="px-2.5 py-1 text-xs font-medium rounded-md bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 transition-colors flex items-center gap-1 shrink-0"
                >
                  {copiedToken ? <Check className="w-3 h-3 text-emerald-500" /> : <Key className="w-3 h-3" />}
                  {copiedToken ? 'Copied' : 'Copy Key'}
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <Button
                variant="outline"
                size="md"
                onClick={handleNativeShare}
                leftIcon={<Share2 className="w-4 h-4" />}
                className="w-full sm:w-auto flex-1"
              >
                Native Share
              </Button>
            )}

            <a
              href={pollUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex-1"
            >
              <Button
                variant="primary"
                size="md"
                leftIcon={<ExternalLink className="w-4 h-4" />}
                className="w-full justify-center"
              >
                Open Poll
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ShareModal;
