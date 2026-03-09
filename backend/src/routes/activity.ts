import express from 'express';
import { getActivityLogs } from '../controllers/activityController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticateToken, getActivityLogs);

export default router;
