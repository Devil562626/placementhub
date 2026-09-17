import { api } from './axios.js';

export const getNotifications = () => api.get('/notifications/me');
export const markAllRead = () => api.patch('/notifications/read-all');