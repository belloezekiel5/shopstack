import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { UserModel } from '../models/User.js';
import { AuthRequest } from '../middleware/auth.js';
import { JWT_SECRET } from '../config/env.js';
import { buildIdFilter } from '../utils/dbUtils.js';

function generateToken(user: {
  id?: string;
  _id?: any;
  email: string;
  role: string;
  name: string;
}) {
  const id = user.id || (user._id ? user._id.toString() : '');
  return jwt.sign(
    {
      id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function sanitizeUser(user: any) {
  if (!user) return null;
  const userObject = user.toObject ? user.toObject() : { ...user };
  const { password, __v, ...safeUser } = userObject;
  safeUser.id = safeUser.id || (safeUser._id ? safeUser._id.toString() : '');
  return safeUser;
}

// =========================
// REGISTER
// =========================

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Name, email, and password are required.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await UserModel.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'An account with this email already exists.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await UserModel.create({
      id: crypto.randomUUID(),
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,

      // IMPORTANT:
      // Normal registration can ONLY create customers.
      role: 'customer',

      isActive: true,

      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
        name.trim()
      )}`,
    });

    const token = generateToken(newUser);

    return res.status(201).json({
      user: sanitizeUser(newUser),
      token,
      message: 'Account registered successfully.',
    });
  } catch (error) {
    console.error('Register error:', error);

    return res.status(500).json({
      message: 'Server error during registration.',
    });
  }
}

// =========================
// LOGIN
// =========================

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Please provide both email and password.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await UserModel.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password.',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        message:
          'Your account has been deactivated. Please contact support.',
      });
    }

    if (!user.password) {
      return res.status(401).json({
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid email or password.',
      });
    }

    const token = generateToken(user);

    return res.json({
      user: sanitizeUser(user),
      token,
      message: 'Logged in successfully.',
    });
  } catch (error) {
    console.error('Login error:', error);

    return res.status(500).json({
      message: 'Server error during login.',
    });
  }
}

// =========================
// GET CURRENT USER
// =========================

export async function getMe(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: 'Not authenticated.',
      });
    }

    const user = await UserModel.findOne(buildIdFilter(req.user.id));

    if (!user) {
      return res.status(404).json({
        message: 'User not found.',
      });
    }

    return res.json({
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error('GetMe error:', error);

    return res.status(500).json({
      message: 'Server error retrieving user profile.',
    });
  }
}

// =========================
// UPDATE PROFILE
// =========================

export async function updateProfile(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: 'Not authenticated.',
      });
    }

    const { name, phone, address, avatar, password } = req.body;

    const updates: any = {};

    if (name) {
      updates.name = name.trim();
    }

    if (phone !== undefined) {
      updates.phone = phone;
    }

    if (address !== undefined) {
      updates.address = address;
    }

    if (avatar !== undefined) {
      updates.avatar = avatar;
    }

    if (password && password.trim().length >= 6) {
      const salt = await bcrypt.genSalt(10);

      updates.password = await bcrypt.hash(
        password.trim(),
        salt
      );
    }

    const updatedUser = await UserModel.findOneAndUpdate(
      buildIdFilter(req.user.id),
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: 'User not found.',
      });
    }

    return res.json({
      user: sanitizeUser(updatedUser),
      message: 'Profile updated successfully.',
    });
  } catch (error) {
    console.error('UpdateProfile error:', error);

    return res.status(500).json({
      message: 'Server error updating profile.',
    });
  }
}