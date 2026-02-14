import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from './lib/prisma';

import authRoutes from './routes/auth';
import leadRoutes from './routes/leads';
import taskRoutes from './routes/tasks';
import adminRoutes from './routes/admin';
import dashboardRoutes from './routes/dashboard';
import eodRoutes from './routes/eod';
import projectRoutes from './routes/projects';
import activityRoutes from './routes/activity';
import attendanceRoutes from './routes/attendance';
import leaveRoutes from './routes/leaves';
import reportRoutes from './routes/reports';
import productRoutes from './routes/products';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/eod', eodRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/products', productRoutes);

// Global Error Handler
app.use(errorHandler);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', database: 'connected' });
});

app.listen(port, () => {
  console.log(`🚀 Backend server running at http://localhost:${port}`);
});
