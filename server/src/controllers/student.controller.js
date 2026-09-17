import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import * as studentService from '../services/student.service.js';

export const listStudents = asyncHandler(async (req, res) => {
  ok(res, await studentService.listStudents(req.query));
});

export const getMe = asyncHandler(async (req, res) => {
  ok(res, await studentService.getMyProfile(req.user.id));
});

export const updateMe = asyncHandler(async (req, res) => {
  ok(res, await studentService.updateMyProfile(req.user.id, req.body), 'Profile updated');
});

export const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'No file uploaded');
  const url = await studentService.uploadToCloudinary(req.file);
  ok(res, await studentService.saveResumeUrl(req.user.id, url), 'Resume uploaded');
});