/**
 * Date, time, and number formatting utilities
 */

/**
 * Format relative time (e.g., "5m ago", "2h ago", "3d ago")
 * @param {string|Date} dateInput
 * @returns {string}
 */
export const formatRelativeTime = (dateInput) => {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 30) return 'Just now';
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths}mo ago`;

  return `${Math.floor(diffInMonths / 12)}y ago`;
};

/**
 * Format expiration countdown (e.g. "Ends in 4h 21m", "Ends in 32m", "Ends in 2d 4h")
 * @param {string|Date} expiresAtInput
 * @returns {{ text: string, isExpired: boolean, remainingMs: number }}
 */
export const formatCountdown = (expiresAtInput) => {
  if (!expiresAtInput) {
    return { text: 'No expiration', isExpired: false, remainingMs: Infinity };
  }

  const expiresAt = new Date(expiresAtInput).getTime();
  const now = Date.now();
  const remainingMs = expiresAt - now;

  if (remainingMs <= 0) {
    return { text: 'Expired', isExpired: true, remainingMs: 0 };
  }

  const seconds = Math.floor(remainingMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  let text = '';
  if (days > 0) {
    text = `Ends in ${days}d ${hours % 24}h`;
  } else if (hours > 0) {
    text = `Ends in ${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    text = `Ends in ${minutes}m ${seconds % 60}s`;
  } else {
    text = `Ends in ${seconds}s`;
  }

  return { text, isExpired: false, remainingMs };
};

/**
 * Format full date string
 * @param {string|Date} dateInput
 * @returns {string}
 */
export const formatDate = (dateInput) => {
  if (!dateInput) return '—';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

/**
 * Pluralize votes string (e.g. "1 vote", "12 votes")
 * @param {number} count
 * @returns {string}
 */
export const formatVoteCount = (count = 0) => {
  const num = Number(count) || 0;
  return `${num.toLocaleString()} ${num === 1 ? 'vote' : 'votes'}`;
};
