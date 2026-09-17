import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/ApiResponse.js';
import * as appService from '../services/application.service.js';

export const applyToDrive = asyncHandler(async (req, res) => {
  const application = await appService.apply(req.user.id, Number(req.params.id));
  ok(res, application, 'Application submitted', 201);
});

export const myApplications = asyncHandler(async (req, res) => {
  const apps = await appService.myApplications(req.user.id);
  ok(res, apps);
});

export const listDriveApplications = asyncHandler(async (req, res) => {
  const apps = await appService.listByDrive(req.user, Number(req.params.id));
  ok(res, apps);
});

export const updateStatus = asyncHandler(async (req, res) => {
  const application = await appService.updateStatus(req.user, Number(req.params.id), req.body.status);
  ok(res, application, 'Application status updated');
});
