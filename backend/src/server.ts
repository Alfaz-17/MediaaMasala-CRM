import express from 'express';
import cors from 'cors';
import compression from 'compression';
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

const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:3000', 'http://localhost:3001', 'https://mediaa-masala-crm.vercel.app'];

console.log('🌍 Allowed Origins:', allowedOrigins);

app.use(compression());
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      console.warn(`🚫 CORS blocked for origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
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
