import { api } from './axios.js';

export const summary = () => api.get('/reports/summary');
export const exportCsv = () => api.get('/reports/export', { responseType: 'blob' });