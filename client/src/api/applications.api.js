import { api } from './axios.js';

export const myApplications = () => api.get('/applications/me');
export const updateApplicationStatus = (id, status) => api.patch(`/applications/${id}/status`, { status });