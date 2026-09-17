import { api } from './axios.js';

export const registerUser = (body) => api.post('/auth/register', body);
export const forgotPassword = (email) => api.post('/auth/forgot-password', { email });
export const resetPassword = (token, password) => api.post('/auth/reset-password', { token, password });
export const changePassword = (oldPassword, newPassword) => api.patch('/auth/change-password', { oldPassword, newPassword });