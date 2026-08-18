import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import {
  findUserByEmail,
  createUser,
  generateToken,
  updateUser
} from '../store';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// Register new account
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const userRole = role === 'admin' ? 'admin' : 'customer';
    const user = await createUser({
      name,
      email,
      password,
      role: userRole,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`
    });

    const token = generateToken({
      id: user._id?.toString() || user.id,
      email: user.email,
      role: user.role
    });

    return res.status(201).json({
      success: true,
      token,
      user
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Registration failed' });
  }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    // Verify password with bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken({
      id: user._id?.toString() || user.id,
      email: user.email,
      role: user.role
    });

    const userObj = user.toObject ? user.toObject() : { ...user };
    delete userObj.password;

    return res.json({
      success: true,
      token,
      user: userObj
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Login failed' });
  }
});

// Get current authenticated user
router.get('/me', requireAuth, (req: AuthRequest, res: Response) => {
  return res.json({
    success: true,
    user: req.user
  });
});

// Update profile
router.put('/profile', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user._id?.toString() || req.user.id;
    const updated = await updateUser(userId, req.body);
    return res.json({
      success: true,
      user: updated
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Update failed' });
  }
});

export default router;
