import { Router, Response } from 'express';
import { getAdminStats } from '../store';
import { requireAuth, requireAdmin, AuthRequest } from '../middleware/auth';
import { isDbConnected } from '../db';

const router = Router();

// Admin: Analytics and metrics
router.get('/admin', requireAuth, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const stats = await getAdminStats();
    return res.json({
      success: true,
      stats,
      dbConnected: isDbConnected()
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch stats' });
  }
});

// Database status check
router.get('/db-status', (req, res) => {
  res.json({
    connected: isDbConnected(),
    configured: Boolean(process.env.MONGODB_URI && !process.env.MONGODB_URI.includes('<username>'))
  });
});

export default router;
