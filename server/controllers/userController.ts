import { Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { UserModel } from '../models/User.js';
import { ProductModel } from '../models/Product.js';
import { OrderModel } from '../models/Order.js';
import { AuthRequest } from '../middleware/auth.js';

function sanitizeUser(user: any) {
  const userObject = user.toObject ? user.toObject() : user;
  const { password, _id, __v, ...safeUser } = userObject;

  return safeUser;
}

// ==========================================
// GET ALL USERS
// ==========================================

export async function getAllUsersAdmin(
  req: AuthRequest,
  res: Response
) {
  try {
    const users = await UserModel.find()
      .select('-password -_id -__v')
      .sort({ createdAt: -1 });

    return res.json({
      users,
    });
  } catch (error) {
    console.error('getAllUsersAdmin error:', error);

    return res.status(500).json({
      message: 'Error retrieving users.',
    });
  }
}

// ==========================================
// CREATE ADMIN
// ==========================================

export async function createAdmin(
  req: AuthRequest,
  res: Response
) {
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
        message: 'A user with this email already exists.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await UserModel.create({
      id: crypto.randomUUID(),
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: 'admin',
      isActive: true,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
        name.trim()
      )}`,
    });

    return res.status(201).json({
      user: sanitizeUser(newAdmin),
      message: 'Admin account created successfully.',
    });
  } catch (error) {
    console.error('createAdmin error:', error);

    return res.status(500).json({
      message: 'Error creating admin account.',
    });
  }
}

// ==========================================
// UPDATE USER ROLE / STATUS
// ==========================================

export async function updateUserRoleAdmin(
  req: AuthRequest,
  res: Response
) {
  try {
    const { id } = req.params;
    const { role, isActive } = req.body;

    const updates: any = {};

    if (role === 'admin' || role === 'customer') {
      updates.role = role;
    }

    if (isActive !== undefined) {
      updates.isActive = Boolean(isActive);
    }

    const updatedUser = await UserModel.findOneAndUpdate(
      { id },
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: 'User not found.',
      });
    }

    return res.json({
      user: sanitizeUser(updatedUser),
      message: 'User updated successfully.',
    });
  } catch (error) {
    console.error('updateUserRoleAdmin error:', error);

    return res.status(500).json({
      message: 'Error updating user.',
    });
  }
}

// ==========================================
// ADMIN STATS
// ==========================================

export async function getAdminStats(
  req: AuthRequest,
  res: Response
) {
  try {
    const totalCustomers = await UserModel.countDocuments({
      role: 'customer',
    });

    const totalProducts = await ProductModel.countDocuments();

    const totalOrders = await OrderModel.countDocuments();

    console.log('STATS DEBUG:', {
      totalCustomers,
      totalProducts,
      totalOrders,
    });

    return res.json({
      totalCustomers,
      totalProducts,
      totalOrders,
    });
  } catch (error) {
    console.error('getAdminStats error:', error);

    return res.status(500).json({
      message: 'Error retrieving analytics data.',
    });
  }
}