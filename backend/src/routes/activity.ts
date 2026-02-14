import express from 'express';
import { getActivityLogs } from '../controllers/activityController';
import { authenticateToken, checkPermission } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticateToken, checkPermission('reports', 'generate'), getActivityLogs);

export default router;
