import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbRepository } from '../repository.js';
import { AuthRequest } from '../middleware/auth.js';

const JWT_SECRET = process.env.JWT_SECRET || 'shopstack_super_secret_jwt_key_2026';

function generateToken(user: { id: string; email: string; role: string; name: string }) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function sanitizeUser(user: any) {
  const { password, ...safeUser } = user;
  return safeUser;
}

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    const existingUser = await dbRepository.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await dbRepository.createUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role: role === 'admin' ? 'admin' : 'customer',
      isActive: true,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name.trim())}`
    });

    const token = generateToken(newUser);
    return res.status(201).json({
      user: sanitizeUser(newUser),
      token,
      message: 'Account registered successfully.'
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Server error during registration.' });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password.' });
    }

    const user = await dbRepository.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Your account has been deactivated. Please contact support.' });
    }

    const isMatch = await bcrypt.compare(password, user.password || '');
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = generateToken(user);
    return res.json({
      user: sanitizeUser(user),
      token,
      message: 'Logged in successfully.'
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error during login.' });
  }
}

export async function getMe(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated.' });
    }

    const user = await dbRepository.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.json({ user: sanitizeUser(user) });
  } catch (error) {
    console.error('GetMe error:', error);
    return res.status(500).json({ message: 'Server error retrieving user profile.' });
  }
}

export async function updateProfile(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated.' });
    }

    const { name, phone, address, avatar, password } = req.body;
    const updates: any = {};

    if (name) updates.name = name.trim();
    if (phone !== undefined) updates.phone = phone;
    if (address !== undefined) updates.address = address;
    if (avatar !== undefined) updates.avatar = avatar;

    if (password && password.trim().length >= 6) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password.trim(), salt);
    }

    const updatedUser = await dbRepository.updateUser(req.user.id, updates);
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.json({
      user: sanitizeUser(updatedUser),
      message: 'Profile updated successfully.'
    });
  } catch (error) {
    console.error('UpdateProfile error:', error);
    return res.status(500).json({ message: 'Server error updating profile.' });
  }
}
