import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/ApiResponse.js';
import * as authService from '../services/auth.service.js';

export const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  ok(res, result, 'Registered successfully', 201);
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  ok(res, result, 'Login successful');
});

export const me = asyncHandler(async (req, res) => {
  const user = await authService.me(req.user.id);
  ok(res, user);
});
