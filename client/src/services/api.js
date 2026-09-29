import axios from 'axios';
import { getOrCreateVoterId } from '../utils/voter';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to automatically attach voterId in header
apiClient.interceptors.request.use((config) => {
  const voterId = getOrCreateVoterId();
  if (voterId) {
    config.headers['x-voter-id'] = voterId;
  }
  return config;
});

// Response interceptor to unwrap data and normalize errors
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    const status = error.response?.status;
    const customError = new Error(message);
    customError.status = status;
    customError.data = error.response?.data;
    return Promise.reject(customError);
  }
);

/**
 * Create a new poll
 * @param {Object} pollData
 * @returns {Promise<{ success: boolean, data: { poll: Object, managementToken: string } }>}
 */
export const createPoll = async (pollData) => {
  return apiClient.post('/polls', pollData);
};

/**
 * Fetch a single poll by ID
 * @param {string} pollId
 * @param {string} [voterId]
 * @returns {Promise<{ success: boolean, data: Object }>}
 */
export const getPoll = async (pollId, voterId) => {
  const params = voterId ? { voterId } : {};
  return apiClient.get(`/polls/${pollId}`, { params });
};

/**
 * Vote on a poll
 * @param {string} pollId
 * @param {{ voterId: string, optionIds: string[] }} payload
 * @returns {Promise<{ success: boolean, data: Object }>}
 */
export const voteOnPoll = async (pollId, payload) => {
  return apiClient.post(`/polls/${pollId}/vote`, payload);
};

/**
 * Fetch poll results
 * @param {string} pollId
 * @param {string} [voterId]
 * @returns {Promise<{ success: boolean, data: Object }>}
 */
export const getResults = async (pollId, voterId) => {
  const params = voterId ? { voterId } : {};
  return apiClient.get(`/polls/${pollId}/results`, { params });
};

/**
 * Explore / search public polls with pagination
 * @param {{ page?: number, limit?: number, search?: string, status?: string, sort?: string }} params
 * @returns {Promise<{ success: boolean, data: { polls: Array, pagination: Object } }>}
 */
export const getPolls = async (params = {}) => {
  return apiClient.get('/polls', { params });
};

/**
 * Close a poll using management token
 * @param {string} pollId
 * @param {string} managementToken
 * @returns {Promise<{ success: boolean, data: Object }>}
 */
export const closePoll = async (pollId, managementToken) => {
  return apiClient.post(
    `/polls/${pollId}/close`,
    {},
    {
      headers: {
        Authorization: `Bearer ${managementToken}`,
      },
    }
  );
};

/**
 * Delete a poll permanently using management token
 * @param {string} pollId
 * @param {string} managementToken
 * @returns {Promise<{ success: boolean, data: Object }>}
 */
export const deletePoll = async (pollId, managementToken) => {
  return apiClient.delete(`/polls/${pollId}`, {
    headers: {
      Authorization: `Bearer ${managementToken}`,
    },
  });
};

export default apiClient;
