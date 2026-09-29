/**
 * Validates poll creation payload
 * @param {Object} body
 * @returns {{ isValid: boolean, error?: string, sanitized?: Object }}
 */
export const validateCreatePoll = (body) => {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: 'Request body must be a JSON object' };
  }

  const { question, options, settings = {}, expiresAt = null } = body;

  // Validate question
  if (!question || typeof question !== 'string') {
    return { isValid: false, error: 'Question is required' };
  }

  const trimmedQuestion = question.trim();
  if (trimmedQuestion.length === 0) {
    return { isValid: false, error: 'Question cannot be empty' };
  }
  if (trimmedQuestion.length > 200) {
    return { isValid: false, error: 'Question cannot exceed 200 characters' };
  }

  // Validate options
  if (!Array.isArray(options)) {
    return { isValid: false, error: 'Options must be an array' };
  }
  if (options.length < 2) {
    return { isValid: false, error: 'A poll must have at least 2 options' };
  }
  if (options.length > 10) {
    return { isValid: false, error: 'A poll cannot have more than 10 options' };
  }

  const cleanedOptions = [];
  const seenTexts = new Set();

  for (let i = 0; i < options.length; i++) {
    const opt = options[i];
    if (typeof opt !== 'string') {
      return { isValid: false, error: `Option ${i + 1} must be text` };
    }
    const trimmedOpt = opt.trim();
    if (trimmedOpt.length === 0) {
      return { isValid: false, error: `Option ${i + 1} cannot be empty` };
    }
    if (trimmedOpt.length > 100) {
      return { isValid: false, error: `Option ${i + 1} cannot exceed 100 characters` };
    }
    const lowerOpt = trimmedOpt.toLowerCase();
    if (seenTexts.has(lowerOpt)) {
      return { isValid: false, error: `Duplicate option detected: "${trimmedOpt}"` };
    }
    seenTexts.add(lowerOpt);
    cleanedOptions.push(trimmedOpt);
  }

  // Validate settings
  const votingType = settings.votingType === 'multiple' ? 'multiple' : 'single';
  let maxSelections = 1;
  if (votingType === 'multiple') {
    const rawMax = Number(settings.maxSelections);
    if (!Number.isInteger(rawMax) || rawMax < 2) {
      maxSelections = cleanedOptions.length; // Unlimited / all
    } else {
      maxSelections = Math.min(rawMax, cleanedOptions.length);
    }
  }

  const resultsVisibility = ['always', 'afterClose'].includes(settings.resultsVisibility)
    ? settings.resultsVisibility
    : 'afterVote';

  const allowVoteChange = Boolean(settings.allowVoteChange);

  // Validate expiresAt
  let parsedExpiresAt = null;
  if (expiresAt) {
    const expDate = new Date(expiresAt);
    if (isNaN(expDate.getTime())) {
      return { isValid: false, error: 'Invalid expiration date format' };
    }
    if (expDate.getTime() <= Date.now()) {
      return { isValid: false, error: 'Expiration date must be in the future' };
    }
    parsedExpiresAt = expDate;
  }

  return {
    isValid: true,
    sanitized: {
      question: trimmedQuestion,
      options: cleanedOptions,
      settings: {
        votingType,
        maxSelections,
        resultsVisibility,
        allowVoteChange,
      },
      expiresAt: parsedExpiresAt,
    },
  };
};

/**
 * Validates vote submission payload
 * @param {Object} body
 * @returns {{ isValid: boolean, error?: string, voterId?: string, optionIds?: string[] }}
 */
export const validateVote = (body) => {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: 'Invalid request body' };
  }

  const { voterId, optionIds } = body;

  if (!voterId || typeof voterId !== 'string' || voterId.trim().length === 0) {
    return { isValid: false, error: 'Anonymous voter ID is required' };
  }

  const cleanVoterId = voterId.trim();
  if (cleanVoterId.length > 100) {
    return { isValid: false, error: 'Invalid voter ID format' };
  }

  if (!Array.isArray(optionIds) || optionIds.length === 0) {
    return { isValid: false, error: 'At least one option must be selected' };
  }

  const cleanOptionIds = [];
  for (const optId of optionIds) {
    if (typeof optId !== 'string' || optId.trim().length === 0) {
      return { isValid: false, error: 'Invalid option identifier' };
    }
    cleanOptionIds.push(optId.trim());
  }

  // Deduplicate submitted optionIds
  const uniqueOptionIds = [...new Set(cleanOptionIds)];

  return {
    isValid: true,
    voterId: cleanVoterId,
    optionIds: uniqueOptionIds,
  };
};
