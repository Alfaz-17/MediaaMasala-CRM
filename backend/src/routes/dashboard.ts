import express from 'express';
import { getDashboardStats, getRecentActivity } from '../controllers/dashboardController';
import { authenticateToken, checkPermission } from '../middleware/auth';

const router = express.Router();

// Dashboard uses leads + tasks scope internally, but requires at least dashboard:view
router.get('/stats', authenticateToken, checkPermission('dashboard', 'view'), getDashboardStats);
router.get('/activity', authenticateToken, checkPermission('dashboard', 'view'), getRecentActivity);

export default router;
