import { api } from './axios.js';

export const myOffers = () => api.get('/offers/me');
export const respondToOffer = (id, action) => api.patch(`/offers/${id}/respond`, { action });