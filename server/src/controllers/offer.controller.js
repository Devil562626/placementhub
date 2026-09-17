import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/ApiResponse.js';
import * as offerService from '../services/offer.service.js';

export const createOffer = asyncHandler(async (req, res) => {
  const offer = await offerService.createOffer(req.user, Number(req.params.id), req.body);
  ok(res, offer, 'Offer sent to student', 201);
});

export const myOffers = asyncHandler(async (req, res) => {
  const offers = await offerService.myOffers(req.user.id);
  ok(res, offers);
});

export const respondToOffer = asyncHandler(async (req, res) => {
  const offer = await offerService.respondToOffer(req.user.id, Number(req.params.id), req.body.action);
  ok(res, offer, 'Offer ' + req.body.action.toLowerCase());
});
