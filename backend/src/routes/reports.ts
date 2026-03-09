import express from 'express';
import { getSalesReport, getProductivityReport, getAttendanceReport } from '../controllers/reportController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Controllers handle their own data scoping via getModuleWhereClause()
router.get('/sales', authenticateToken, getSalesReport);
router.get('/productivity', authenticateToken, getProductivityReport);
router.get('/attendance', authenticateToken, getAttendanceReport);

export default router;
