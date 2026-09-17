import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { env } from './config/env.js';
import { notFoundHandler, errorHandler } from './middleware/error.middleware.js';
import authRoutes from './routes/auth.routes.js';
import driveRoutes from './routes/drive.routes.js';
import driveApplicationRoutes from './routes/driveApplication.routes.js';
import applicationRoutes from './routes/application.routes.js';
import offerRoutes from './routes/offer.routes.js';
import reportRoutes from './routes/report.routes.js';
import companyRoutes from './routes/companies.routes.js';

const app = express();

app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json({ limit: '5mb' }));
app.use(morgan('dev'));

app.get('/', (req, res) => res.json({ success: true, message: 'PlacementHub API is live. Health check at /api/health' }));

app.get('/api/health', (req, res) =>
  res.json({ success: true, message: 'PlacementHub API running' })
);

app.use('/api/auth', authRoutes);
app.use('/api/drives', driveRoutes);
app.use('/api/drives', driveApplicationRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/companies', companyRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;