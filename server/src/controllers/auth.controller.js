import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/ApiResponse.js';
import * as authService from '../services/auth.service.js';
import * as passwordService from '../services/password.service.js';

export const register = asyncHandler(async (req, res) => {
  ok(res, await authService.register(req.body), 'Registered successfully', 201);
});

export const login = asyncHandler(async (req, res) => {
  ok(res, await authService.login(req.body), 'Login successful');
});

export const me = asyncHandler(async (req, res) => {
  ok(res, await authService.me(req.user.id));
});

export const createStaff = asyncHandler(async (req, res) => {
  ok(res, await authService.createStaff(req.user, req.body), 'Staff account created', 201);
});

export const listUsers = asyncHandler(async (req, res) => {
  ok(res, await authService.listUsers(req.user));
});

export const forgotPassword = asyncHandler(async (req, res) => {
  ok(res, await passwordService.forgotPassword(req.body.email), 'If that email exists, a reset link has been sent');
});

export const resetPassword = asyncHandler(async (req, res) => {
  ok(res, await passwordService.resetPassword(req.body.token, req.body.password), 'Password reset successful');
});

export const changePassword = asyncHandler(async (req, res) => {
  ok(res, await passwordService.changePassword(req.user.id, req.body.oldPassword, req.body.newPassword), 'Password changed');
});