/**
 * Voter identity and local poll management utilities
 */

const VOTER_ID_KEY = 'pollnow_voter_id';
const MANAGED_POLLS_KEY = 'pollnow_managed_polls';

/**
 * Returns existing anonymous voterId from localStorage or generates and persists a new one
 * @returns {string}
 */
export const getOrCreateVoterId = () => {
  try {
    let voterId = localStorage.getItem(VOTER_ID_KEY);
    if (!voterId) {
      // Generate a collision-resistant random anonymous identifier
      const randomStr = Math.random().toString(36).substring(2, 10);
      const timestamp = Date.now().toString(36);
      voterId = `vtr_${timestamp}_${randomStr}`;
      localStorage.setItem(VOTER_ID_KEY, voterId);
    }
    return voterId;
  } catch (err) {
    console.warn('localStorage not available, using fallback memory voter ID', err);
    return `vtr_mem_${Date.now().toString(36)}`;
  }
};

/**
 * Stores management token for a created poll in creator's browser
 * @param {string} pollId
 * @param {string} token
 */
export const storeManagementToken = (pollId, token) => {
  try {
    const raw = localStorage.getItem(MANAGED_POLLS_KEY);
    const map = raw ? JSON.parse(raw) : {};
    map[pollId] = token;
    localStorage.setItem(MANAGED_POLLS_KEY, JSON.stringify(map));
  } catch (err) {
    console.warn('Failed to store management token', err);
  }
};

/**
 * Retrieves management token for a poll from creator's browser if saved
 * @param {string} pollId
 * @returns {string|null}
 */
export const getManagementToken = (pollId) => {
  try {
    const raw = localStorage.getItem(MANAGED_POLLS_KEY);
    if (!raw) return null;
    const map = JSON.parse(raw);
    return map[pollId] || null;
  } catch {
    return null;
  }
};

/**
 * Removes management token for a poll
 * @param {string} pollId
 */
export const removeManagementToken = (pollId) => {
  try {
    const raw = localStorage.getItem(MANAGED_POLLS_KEY);
    if (!raw) return;
    const map = JSON.parse(raw);
    delete map[pollId];
    localStorage.setItem(MANAGED_POLLS_KEY, JSON.stringify(map));
  } catch {
    // Ignore
  }
};
