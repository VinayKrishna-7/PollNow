import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, RefreshCw, PlusCircle, ArrowLeft } from 'lucide-react';
import Button from './Button';

export const ErrorState = ({
  title = 'Something went wrong',
  message = 'We encountered an unexpected error while loading this content.',
  statusCode = null,
  onRetry = null,
  showCreateButton = true,
}) => {
  return (
    <div className="w-full max-w-md mx-auto text-center p-8 rounded-2xl bg-white dark:bg-[#12151e] border border-slate-200 dark:border-white/[0.08] shadow-xl">
      <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
        <AlertTriangle className="w-7 h-7" />
      </div>

      {statusCode && (
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-500 dark:text-rose-400 mb-2 inline-block">
          Error {statusCode}
        </span>
      )}

      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
        {title}
      </h3>

      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
        {message}
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        {onRetry && (
          <Button
            variant="outline"
            size="md"
            onClick={onRetry}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Try Again
          </Button>
        )}

        {showCreateButton ? (
          <Link to="/create">
            <Button
              variant="primary"
              size="md"
              leftIcon={<PlusCircle className="w-4 h-4" />}
            >
              Create a Poll
            </Button>
          </Link>
        ) : (
          <Link to="/">
            <Button
              variant="secondary"
              size="md"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back to Home
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default ErrorState;
