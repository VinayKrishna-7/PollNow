import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, Plus, HelpCircle } from 'lucide-react';
import Button from '../components/Button';

export const NotFound = () => {
  useEffect(() => {
    document.title = 'Page Not Found — PollNow';
  }, []);

  return (
    <div className="max-w-md mx-auto px-4 py-24 sm:py-32 text-center">
      <div className="w-16 h-16 mx-auto mb-6 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500">
        <HelpCircle className="w-8 h-8" />
      </div>

      <span className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
        Error 404
      </span>

      <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mt-2 mb-3">
        Page not found
      </h1>

      <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
        Looks like this page doesn&apos;t exist, or the poll you were looking for has been removed.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link to="/" className="w-full sm:w-auto">
          <Button
            variant="secondary"
            size="md"
            leftIcon={<Home className="w-4 h-4" />}
            className="w-full justify-center"
          >
            Go Home
          </Button>
        </Link>
        <Link to="/create" className="w-full sm:w-auto">
          <Button
            variant="primary"
            size="md"
            leftIcon={<Plus className="w-4 h-4" />}
            className="w-full justify-center"
          >
            Create Poll
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
