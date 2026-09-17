import { api } from './axios.js';

export const listStudents = (params) => api.get('/students', { params });
export const getMyProfile = () => api.get('/students/me');
export const updateMyProfile = (body) => api.patch('/students/me', body);
export const uploadResume = (file) => {
  const fd = new FormData();
  fd.append('resume', file);
  return api.post('/students/me/resume', fd);
};