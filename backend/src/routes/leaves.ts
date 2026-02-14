import express from 'express';
import { getLeaves, applyLeave, approveLeave } from '../controllers/leaveController';
import { authenticateToken, checkPermission } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticateToken, checkPermission('attendance', 'view'), getLeaves);
router.post('/', authenticateToken, checkPermission('attendance', 'create'), applyLeave);
router.patch('/:id/approve', authenticateToken, checkPermission('attendance', 'approve'), approveLeave);

export default router;
