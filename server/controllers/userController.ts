import { Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { UserModel } from '../models/User.js';
import { ProductModel } from '../models/Product.js';
import { OrderModel } from '../models/Order.js';
import { AuthRequest } from '../middleware/auth.js';
import { buildIdFilter, normalizeDocs, normalizeDoc } from '../utils/dbUtils.js';

function sanitizeUser(user: any) {
  if (!user) return null;
  const userObject = user.toObject ? user.toObject() : { ...user };
  const { password, __v, ...safeUser } = userObject;
  safeUser.id = safeUser.id || (safeUser._id ? safeUser._id.toString() : '');
  delete safeUser._id;
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
      .select('-password -__v')
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      users: normalizeDocs(users),
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
      buildIdFilter(id),
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
    const [
      totalCustomers,
      totalProducts,
      totalOrders,
      salesResult,
      orderStatusResult,
      categorySalesResult,
      lowStockProducts,
      recentOrders,
    ] = await Promise.all([
      UserModel.countDocuments({
        role: 'customer',
      }),
      ProductModel.countDocuments(),
      OrderModel.countDocuments(),
      OrderModel.aggregate([
        {
          $match: {
            paymentStatus: 'paid',
            orderStatus: { $ne: 'cancelled' },
          },
        },
        {
          $group: {
            _id: null,
            totalSales: { $sum: '$total' },
          },
        },
      ]),
      OrderModel.aggregate([
        {
          $group: {
            _id: '$orderStatus',
            count: { $sum: 1 },
          },
        },
      ]),
      OrderModel.aggregate([
        {
          $match: {
            paymentStatus: 'paid',
            orderStatus: { $ne: 'cancelled' },
          },
        },
        { $unwind: '$items' },
        {
          $lookup: {
            from: 'products',
            localField: 'items.productId',
            foreignField: 'id',
            as: 'product',
          },
        },
        {
          $unwind: {
            path: '$product',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: '$product.category',
            sales: {
              $sum: { $multiply: ['$items.price', '$items.quantity'] },
            },
          },
        },
        {
          $project: {
            _id: 0,
            category: '$_id',
            sales: 1,
          },
        },
        { $sort: { sales: -1 } },
      ]),
      ProductModel.find({
        stock: { $lte: 5 },
      })
        .sort({ stock: 1 })
        .limit(10)
        .lean(),
      OrderModel.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

    const orderStatusCount: Record<string, number> = {
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };

    for (const item of orderStatusResult) {
      if (item._id && item._id in orderStatusCount) {
        orderStatusCount[item._id] = item.count;
      }
    }

    const totalSales = salesResult[0]?.totalSales || 0;

    const categorySales: Record<string, number> = {};
    for (const item of categorySalesResult) {
      if (item.category) {
        categorySales[item.category] = item.sales;
      }
    }

    return res.json({
      stats: {
        totalSales,
        totalOrders,
        totalProducts,
        totalCustomers,
        orderStatusCount,
        categorySales,
        lowStockProducts,
        recentOrders,
      },
    });
  } catch (error) {
    console.error('getAdminStats error:', error);

    return res.status(500).json({
      message: 'Error retrieving analytics data.',
    });
  }
}