import { nanoid } from 'nanoid';
import { Poll } from '../models/Poll.js';
import { PollVote } from '../models/PollVote.js';
import { generateManagementToken, hashToken, verifyToken } from '../utils/token.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * Escapes regex special characters
 */
const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Normalizes poll data, computing effective status and options
 */
const formatPollResponse = (pollDoc, userVote = null) => {
  const poll = pollDoc.toObject ? pollDoc.toObject() : { ...pollDoc };
  delete poll.managementTokenHash;
  delete poll.__v;

  const effectiveStatus =
    poll.status === 'closed'
      ? 'closed'
      : poll.expiresAt && new Date() > new Date(poll.expiresAt)
      ? 'expired'
      : 'active';

  poll.status = effectiveStatus;

  // Compute option percentages
  const total = poll.totalVotes || 0;
  poll.options = (poll.options || []).map((opt) => {
    const count = opt.voteCount || 0;
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
    return {
      optionId: opt.optionId,
      text: opt.text,
      voteCount: opt.voteCount,
      percentage,
    };
  });

  if (userVote) {
    poll.userVote = {
      selectedOptionIds: userVote.selectedOptionIds,
      votedAt: userVote.createdAt,
    };
  } else {
    poll.userVote = null;
  }

  return poll;
};

/**
 * Applies results visibility rules
 */
const applyResultsVisibility = (poll, userVote) => {
  const visibility = poll.settings?.resultsVisibility || 'afterVote';
  const isClosedOrExpired = poll.status === 'closed' || poll.status === 'expired';

  let canSeeResults = false;

  if (visibility === 'always') {
    canSeeResults = true;
  } else if (visibility === 'afterClose') {
    canSeeResults = isClosedOrExpired;
  } else if (visibility === 'afterVote') {
    canSeeResults = Boolean(userVote) || isClosedOrExpired;
  }

  if (!canSeeResults) {
    // Redact vote counts and percentages
    poll.resultsHidden = true;
    poll.resultsVisibilityRule = visibility;
    poll.options = poll.options.map((opt) => ({
      optionId: opt.optionId,
      text: opt.text,
      // voteCount and percentage intentionally omitted
    }));
    poll.totalVotes = null;
  } else {
    poll.resultsHidden = false;
  }

  return poll;
};

/**
 * Create a new poll
 */
export const createPoll = async (pollData) => {
  const pollId = nanoid(8);
  const rawManagementToken = generateManagementToken();
  const managementTokenHash = hashToken(rawManagementToken);

  // Generate unique optionIds
  const options = pollData.options.map((text, idx) => ({
    optionId: `opt_${idx + 1}_${nanoid(6)}`,
    text,
    voteCount: 0,
  }));

  const newPoll = await Poll.create({
    pollId,
    question: pollData.question,
    options,
    settings: pollData.settings,
    expiresAt: pollData.expiresAt,
    status: 'active',
    totalVotes: 0,
    managementTokenHash,
  });

  const formatted = formatPollResponse(newPoll, null);

  return {
    poll: formatted,
    managementToken: rawManagementToken, // Returned ONLY on creation
  };
};

/**
 * Get single poll by pollId
 */
export const getPollById = async (pollId, voterId = null) => {
  const poll = await Poll.findOne({ pollId });
  if (!poll) {
    throw new AppError('Poll not found', 404);
  }

  // Check user vote if voterId is supplied
  let userVote = null;
  if (voterId) {
    userVote = await PollVote.findOne({ pollId: poll._id, voterId });
  }

  const formatted = formatPollResponse(poll, userVote);
  const finalPoll = applyResultsVisibility(formatted, userVote);

  return finalPoll;
};

/**
 * Get detailed analytics / results for a poll
 */
export const getPollResults = async (pollId, voterId = null) => {
  const poll = await Poll.findOne({ pollId });
  if (!poll) {
    throw new AppError('Poll not found', 404);
  }

  let userVote = null;
  if (voterId) {
    userVote = await PollVote.findOne({ pollId: poll._id, voterId });
  }

  const formatted = formatPollResponse(poll, userVote);
  const visibility = formatted.settings?.resultsVisibility || 'afterVote';
  const isClosedOrExpired = formatted.status === 'closed' || formatted.status === 'expired';

  if (visibility === 'afterClose' && !isClosedOrExpired) {
    throw new AppError(
      'Results for this poll are hidden until the poll closes.',
      403
    );
  }

  if (visibility === 'afterVote' && !userVote && !isClosedOrExpired) {
    throw new AppError(
      'You must cast your vote before viewing the results for this poll.',
      403
    );
  }

  // Find top option
  let topOption = null;
  let maxCount = -1;
  for (const opt of formatted.options) {
    if (opt.voteCount > maxCount && opt.voteCount > 0) {
      maxCount = opt.voteCount;
      topOption = opt;
    }
  }

  return {
    ...formatted,
    topOption: topOption ? { optionId: topOption.optionId, text: topOption.text, voteCount: topOption.voteCount } : null,
  };
};

/**
 * Cast or change vote on a poll
 */
export const voteOnPoll = async (pollId, voterId, optionIds) => {
  const poll = await Poll.findOne({ pollId });
  if (!poll) {
    throw new AppError('Poll not found', 404);
  }

  // Check status & expiration
  const effectiveStatus = poll.getEffectiveStatus();
  if (effectiveStatus === 'closed') {
    throw new AppError('This poll is closed and no longer accepting votes.', 410);
  }
  if (effectiveStatus === 'expired') {
    throw new AppError('This poll has expired.', 410);
  }

  // Validate option IDs
  const validOptionMap = new Map();
  poll.options.forEach((opt) => validOptionMap.set(opt.optionId, opt));

  for (const optId of optionIds) {
    if (!validOptionMap.has(optId)) {
      throw new AppError(`Option ID "${optId}" is not valid for this poll`, 400);
    }
  }

  // Validate choice limits
  if (poll.settings.votingType === 'single') {
    if (optionIds.length !== 1) {
      throw new AppError('Single-choice polls require exactly 1 option to be selected', 400);
    }
  } else {
    // Multiple choice
    const maxSel = poll.settings.maxSelections || poll.options.length;
    if (optionIds.length > maxSel) {
      throw new AppError(`You can select at most ${maxSel} option(s)`, 400);
    }
  }

  // Check for existing vote
  const existingVote = await PollVote.findOne({ pollId: poll._id, voterId });

  if (existingVote) {
    if (!poll.settings.allowVoteChange) {
      throw new AppError("You've already voted on this poll.", 409);
    }

    // Process vote update
    const oldOptionIds = existingVote.selectedOptionIds;
    const removedOptionIds = oldOptionIds.filter((id) => !optionIds.includes(id));
    const addedOptionIds = optionIds.filter((id) => !oldOptionIds.includes(id));

    // If identical, just return current state
    if (removedOptionIds.length === 0 && addedOptionIds.length === 0) {
      const refreshedPoll = await Poll.findById(poll._id);
      return formatPollResponse(refreshedPoll, existingVote);
    }

    // Atomic decrement of removed options
    if (removedOptionIds.length > 0) {
      const decInc = {};
      const decFilters = [];
      removedOptionIds.forEach((optId, idx) => {
        decInc[`options.$[elemDec${idx}].voteCount`] = -1;
        decFilters.push({ [`elemDec${idx}.optionId`]: optId });
      });

      await Poll.updateOne(
        { _id: poll._id },
        { $inc: decInc },
        { arrayFilters: decFilters }
      );
    }

    // Atomic increment of added options
    if (addedOptionIds.length > 0) {
      const incInc = {};
      const incFilters = [];
      addedOptionIds.forEach((optId, idx) => {
        incInc[`options.$[elemInc${idx}].voteCount`] = 1;
        incFilters.push({ [`elemInc${idx}.optionId`]: optId });
      });

      await Poll.updateOne(
        { _id: poll._id },
        { $inc: incInc },
        { arrayFilters: incFilters }
      );
    }

    // Update vote record
    existingVote.selectedOptionIds = optionIds;
    await existingVote.save();

    const updatedPoll = await Poll.findById(poll._id);
    return formatPollResponse(updatedPoll, existingVote);
  }

  // Brand new vote submission
  try {
    const newVote = await PollVote.create({
      pollId: poll._id,
      voterId,
      selectedOptionIds: optionIds,
    });

    // Atomically increment voteCount for each selected option & totalVotes by 1
    const incFields = { totalVotes: 1 };
    const arrayFilters = [];
    optionIds.forEach((optId, idx) => {
      incFields[`options.$[elem${idx}].voteCount`] = 1;
      arrayFilters.push({ [`elem${idx}.optionId`]: optId });
    });

    await Poll.updateOne(
      { _id: poll._id },
      { $inc: incFields },
      { arrayFilters }
    );

    const updatedPoll = await Poll.findById(poll._id);
    return formatPollResponse(updatedPoll, newVote);
  } catch (err) {
    if (err.code === 11000) {
      throw new AppError("You've already voted on this poll.", 409);
    }
    throw err;
  }
};

/**
 * List / search public polls with pagination
 */
export const getPolls = async ({
  page = 1,
  limit = 12,
  search = '',
  status = 'all',
  sort = 'newest',
}) => {
  const numericPage = Math.max(1, parseInt(page, 10) || 1);
  const numericLimit = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));
  const skip = (numericPage - 1) * numericLimit;

  const query = {};

  // Search filter
  if (search && search.trim().length > 0) {
    const escaped = escapeRegex(search.trim());
    query.question = { $regex: escaped, $options: 'i' };
  }

  const now = new Date();

  // Status filter
  if (status === 'active') {
    query.status = 'active';
    query.$or = [{ expiresAt: null }, { expiresAt: { $gt: now } }];
  } else if (status === 'closed') {
    query.$or = [{ status: 'closed' }, { expiresAt: { $lte: now } }];
  }

  // Sorting
  let sortObj = { createdAt: -1 };
  if (sort === 'mostVotes') {
    sortObj = { totalVotes: -1, createdAt: -1 };
  } else if (sort === 'oldest') {
    sortObj = { createdAt: 1 };
  }

  const [polls, total] = await Promise.all([
    Poll.find(query)
      .select('-managementTokenHash -__v')
      .sort(sortObj)
      .skip(skip)
      .limit(numericLimit)
      .lean(),
    Poll.countDocuments(query),
  ]);

  const formattedPolls = polls.map((p) => {
    const effectiveStatus =
      p.status === 'closed'
        ? 'closed'
        : p.expiresAt && new Date() > new Date(p.expiresAt)
        ? 'expired'
        : 'active';

    return {
      pollId: p.pollId,
      question: p.question,
      optionsCount: p.options ? p.options.length : 0,
      totalVotes: p.totalVotes || 0,
      status: effectiveStatus,
      expiresAt: p.expiresAt,
      settings: p.settings,
      createdAt: p.createdAt,
    };
  });

  return {
    polls: formattedPolls,
    pagination: {
      page: numericPage,
      limit: numericLimit,
      total,
      totalPages: Math.ceil(total / numericLimit) || 1,
    },
  };
};

/**
 * Close a poll using management token
 */
export const closePoll = async (pollId, rawToken) => {
  if (!rawToken) {
    throw new AppError('Management token is required', 401);
  }

  const poll = await Poll.findOne({ pollId }).select('+managementTokenHash');
  if (!poll) {
    throw new AppError('Poll not found', 404);
  }

  const isMatch = verifyToken(rawToken, poll.managementTokenHash);
  if (!isMatch) {
    throw new AppError('Invalid management token', 401);
  }

  poll.status = 'closed';
  await poll.save();

  return formatPollResponse(poll, null);
};

/**
 * Permanently delete a poll and its votes using management token
 */
export const deletePoll = async (pollId, rawToken) => {
  if (!rawToken) {
    throw new AppError('Management token is required', 401);
  }

  const poll = await Poll.findOne({ pollId }).select('+managementTokenHash');
  if (!poll) {
    throw new AppError('Poll not found', 404);
  }

  const isMatch = verifyToken(rawToken, poll.managementTokenHash);
  if (!isMatch) {
    throw new AppError('Invalid management token', 401);
  }

  await PollVote.deleteMany({ pollId: poll._id });
  await Poll.deleteOne({ _id: poll._id });

  return { message: 'Poll and all associated votes deleted successfully' };
};
