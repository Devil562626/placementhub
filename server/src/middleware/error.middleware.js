import { Prisma } from '@prisma/client';
import { ApiError } from '../utils/ApiError.js';
import { env } from '../config/env.js';

export const notFoundHandler = (req, res, next) =>
  next(new ApiError(404, 'Route not found: ' + req.method + ' ' + req.originalUrl));

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') { statusCode = 409; message = 'Duplicate value: ' + (err.meta?.target || ''); }
    if (err.code === 'P2025') { statusCode = 404; message = 'Record not found'; }
  }

  if (statusCode === 500) console.error(err);

  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || [],
    ...(env.nodeEnv === 'development' && { stack: err.stack }),
  });
};
