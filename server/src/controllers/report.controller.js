import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/ApiResponse.js';
import * as reportService from '../services/report.service.js';

export const summary = asyncHandler(async (req, res) => {
  const gradYear = req.query.gradYear ? Number(req.query.gradYear) : undefined;
  ok(res, await reportService.summary(gradYear));
});

export const exportCsv = asyncHandler(async (req, res) => {
  const gradYear = req.query.gradYear ? Number(req.query.gradYear) : undefined;
  const csv = await reportService.exportCsv(gradYear);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="placements.csv"');
  res.send(csv);
});
