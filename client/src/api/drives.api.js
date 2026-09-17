import { api } from './axios.js';

export const getDrives = () => api.get('/drives');
export const createDrive = (body) => api.post('/drives', body);
export const updateDriveStatus = (id, status) => api.patch(`/drives/${id}/status`, { status });
export const applyToDrive = (id) => api.post(`/drives/${id}/apply`);
export const getDriveApplications = (id) => api.get(`/drives/${id}/applications`);