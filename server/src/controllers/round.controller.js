import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/ApiResponse.js';
import { prisma } from '../config/db.js';
import * as roundService from '../services/round.service.js';

export const createRound = asyncHandler(async (req, res) => {
  ok(res, await roundService.createRound(req.user, Number(req.params.id), req.body), 'Round added', 201);
});

export const listRounds = asyncHandler(async (req, res) => {
  ok(res, await roundService.listRounds(Number(req.params.id)));
});

export const listResults = asyncHandler(async (req, res) => {
  ok(res, await roundService.listResults(Number(req.params.id)));
});

export const recordResult = asyncHandler(async (req, res) => {
  ok(res, await roundService.recordResult(req.user, Number(req.params.id), req.body), 'Result recorded');
});

export const myNotifications = asyncHandler(async (req, res) => {
  const [notifications, unreadCount] = await Promise.all([
    prisma.notification.findMany({ where: { userId: req.user.id }, orderBy: { createdAt: 'desc' }, take: 15 }),
    prisma.notification.count({ where: { userId: req.user.id, isRead: false } }),
  ]);
  ok(res, { notifications, unreadCount });
});

export const markAllRead = asyncHandler(async (req, res) => {
  await prisma.notification.updateMany({ where: { userId: req.user.id, isRead: false }, data: { isRead: true } });
  ok(res, null, 'All notifications marked read');
});