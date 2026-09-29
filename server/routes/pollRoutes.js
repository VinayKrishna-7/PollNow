import express from 'express';
import {
  handleCreatePoll,
  handleGetPoll,
  handleGetPollResults,
  handleVote,
  handleGetPolls,
  handleClosePoll,
  handleDeletePoll,
} from '../controllers/pollController.js';
import {
  createPollLimiter,
  voteLimiter,
  managementLimiter,
  generalLimiter,
} from '../middleware/rateLimiter.js';

const router = express.Router();

// Public routes
router.post('/', createPollLimiter, handleCreatePoll);
router.get('/', generalLimiter, handleGetPolls);
router.get('/:pollId', generalLimiter, handleGetPoll);
router.get('/:pollId/results', generalLimiter, handleGetPollResults);
router.post('/:pollId/vote', voteLimiter, handleVote);

// Management routes
router.post('/:pollId/close', managementLimiter, handleClosePoll);
router.delete('/:pollId', managementLimiter, handleDeletePoll);

export default router;
