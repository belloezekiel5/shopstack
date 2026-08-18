import { Router, Request, Response } from 'express';
import { getAllUsers, updateUser } from '../store';
import { requireAuth, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

// Admin: Get all users
router.get('/', requireAuth, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const users = await getAllUsers();
    return res.json({
      success: true,
      users,
      total: users.length
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch users' });
  }
});

// Admin: Update user role
router.patch('/:id/role', requireAuth, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.body;
    if (!role || !['customer', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Valid role (customer or admin) required' });
    }

    const updated = await updateUser(req.params.id, { role });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({
      success: true,
      user: updated
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to update user role' });
  }
});

export default router;
