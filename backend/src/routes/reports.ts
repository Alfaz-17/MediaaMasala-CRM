import express from 'express';
import { getSalesReport, getProductivityReport, getAttendanceReport } from '../controllers/reportController';
import { authenticateToken, checkPermission } from '../middleware/auth';

const router = express.Router();

router.get('/sales', authenticateToken, checkPermission('reports', 'generate'), getSalesReport);
router.get('/productivity', authenticateToken, checkPermission('reports', 'generate'), getProductivityReport);
router.get('/attendance', authenticateToken, checkPermission('reports', 'generate'), getAttendanceReport);

export default router;
