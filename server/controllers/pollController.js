import * as pollService from '../services/pollService.js';
import { validateCreatePoll, validateVote } from '../validators/pollValidator.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * Extract token from Authorization header or body
 */
const extractManagementToken = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    if (authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7).trim();
    }
    return authHeader.trim();
  }
  if (req.body && req.body.managementToken) {
    return req.body.managementToken.trim();
  }
  return null;
};

/**
 * POST /api/polls - Create new poll
 */
export const handleCreatePoll = async (req, res, next) => {
  try {
    const { isValid, error, sanitized } = validateCreatePoll(req.body);
    if (!isValid) {
      throw new AppError(error, 400);
    }

    const result = await pollService.createPoll(sanitized);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/polls/:pollId - Get single poll
 */
export const handleGetPoll = async (req, res, next) => {
  try {
    const { pollId } = req.params;
    const voterId = req.query.voterId || req.headers['x-voter-id'] || null;

    const poll = await pollService.getPollById(pollId, voterId);

    res.status(200).json({
      success: true,
      data: poll,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/polls/:pollId/results - Get poll results/analytics
 */
export const handleGetPollResults = async (req, res, next) => {
  try {
    const { pollId } = req.params;
    const voterId = req.query.voterId || req.headers['x-voter-id'] || null;

    const results = await pollService.getPollResults(pollId, voterId);

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/polls/:pollId/vote - Cast a vote
 */
export const handleVote = async (req, res, next) => {
  try {
    const { pollId } = req.params;
    const { isValid, error, voterId, optionIds } = validateVote(req.body);
    if (!isValid) {
      throw new AppError(error, 400);
    }

    const updatedPoll = await pollService.voteOnPoll(pollId, voterId, optionIds);

    res.status(200).json({
      success: true,
      data: updatedPoll,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/polls - Search & explore public polls
 */
export const handleGetPolls = async (req, res, next) => {
  try {
    const { page, limit, search, status, sort } = req.query;

    const data = await pollService.getPolls({
      page,
      limit,
      search,
      status,
      sort,
    });

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/polls/:pollId/close - Close a poll
 */
export const handleClosePoll = async (req, res, next) => {
  try {
    const { pollId } = req.params;
    const token = extractManagementToken(req);

    if (!token) {
      throw new AppError('Management token required via Authorization header', 401);
    }

    const updatedPoll = await pollService.closePoll(pollId, token);

    res.status(200).json({
      success: true,
      data: updatedPoll,
      message: 'Poll closed successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/polls/:pollId - Delete a poll permanently
 */
export const handleDeletePoll = async (req, res, next) => {
  try {
    const { pollId } = req.params;
    const token = extractManagementToken(req);

    if (!token) {
      throw new AppError('Management token required via Authorization header', 401);
    }

    const result = await pollService.deletePoll(pollId, token);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
