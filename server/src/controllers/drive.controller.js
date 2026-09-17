import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/ApiResponse.js';
import * as driveService from '../services/drive.service.js';

export const createDrive = asyncHandler(async (req, res) => {
  const drive = await driveService.createDrive(req.body);
  ok(res, drive, 'Drive created', 201);
});

export const listDrives = asyncHandler(async (req, res) => {
  const drives = await driveService.listDrives(req.user);
  ok(res, drives);
});

export const getDrive = asyncHandler(async (req, res) => {
  const drive = await driveService.getDrive(Number(req.params.id));
  ok(res, drive);
});

export const updateDriveStatus = asyncHandler(async (req, res) => {
  const drive = await driveService.updateDriveStatus(Number(req.params.id), req.body.status);
  ok(res, drive, 'Drive status updated');
});
