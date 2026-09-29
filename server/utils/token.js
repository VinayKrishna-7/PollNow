import crypto from 'crypto';

/**
 * Generate a cryptographically secure random token
 * @returns {string} 32-character hexadecimal token
 */
export const generateManagementToken = () => {
  return crypto.randomBytes(24).toString('hex');
};

/**
 * Hash a management token using SHA-256
 * @param {string} token - Raw management token
 * @returns {string} SHA-256 hash in hex format
 */
export const hashToken = (token) => {
  if (!token || typeof token !== 'string') return '';
  return crypto.createHash('sha256').update(token.trim()).digest('hex');
};

/**
 * Safely compare a raw token against a stored hash
 * @param {string} rawToken - Provided token
 * @param {string} storedHash - Stored SHA-256 hash
 * @returns {boolean}
 */
export const verifyToken = (rawToken, storedHash) => {
  if (!rawToken || !storedHash) return false;
  const computedHash = hashToken(rawToken);
  try {
    const a = Buffer.from(computedHash, 'hex');
    const b = Buffer.from(storedHash, 'hex');
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
};
