import { api } from './axios.js';

export const getRounds = (driveId) => api.get(`/drives/${driveId}/rounds`);
export const createRound = (driveId, body) => api.post(`/drives/${driveId}/rounds`, body);
export const getRoundResults = (roundId) => api.get(`/rounds/${roundId}/results`);
export const recordResult = (roundId, body) => api.post(`/rounds/${roundId}/results`, body);