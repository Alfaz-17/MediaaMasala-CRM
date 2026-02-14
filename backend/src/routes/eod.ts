import express from 'express';
import { submitEod, getEodReports } from '../controllers/eodController';
import { authenticateToken, checkPermission } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticateToken, checkPermission('eod', 'view'), getEodReports);
router.post('/', authenticateToken, checkPermission('eod', 'create'), submitEod);

export default router;
