import React from 'react';
import { Link } from 'react-router-dom';
import { SearchX, Plus, RefreshCw } from 'lucide-react';
import Button from './Button';

export const EmptyState = ({
  icon: CustomIcon,
  title = 'No polls found',
  description = 'Try adjusting your search terms or filters to find what you are looking for.',
  actionText = 'Create a Poll',
  actionLink = '/create',
  onReset = null,
}) => {
  const Icon = CustomIcon || SearchX;

  return (
    <div className="w-full max-w-md mx-auto text-center py-12 px-6 rounded-2xl bg-white/50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06] my-8">
      <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/[0.08] flex items-center justify-center text-slate-400">
        <Icon className="w-6 h-6" />
      </div>

      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1.5">
        {title}
      </h3>

      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto">
        {description}
      </p>

      <div className="flex items-center justify-center gap-3">
        {onReset && (
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Clear Filters
          </Button>
        )}
        {actionLink && (
          <Link to={actionLink}>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              {actionText}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
