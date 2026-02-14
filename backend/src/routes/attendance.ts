import express from 'express';
import { getAttendance, checkIn, checkOut } from '../controllers/attendanceController';
import { authenticateToken, checkPermission } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticateToken, checkPermission('attendance', 'view'), getAttendance);
router.post('/check-in', authenticateToken, checkPermission('attendance', 'create'), checkIn);
router.post('/check-out', authenticateToken, checkPermission('attendance', 'create'), checkOut);

export default router;
