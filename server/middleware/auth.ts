import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User.js';
import { UserRole } from '../data/types.js';
import { JWT_SECRET } from '../config/env.js';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
    name: string;
  };
}



export async function authenticateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      message: 'Authentication required. No token provided.',
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as unknown as {
      id: string;
      email: string;
      role: UserRole;
      name: string;
    };

    const user = await UserModel.findOne({
      id: decoded.id,
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        message: 'User account is invalid or deactivated.',
      });
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    next();
  } catch (err) {
    console.error('Authentication error:', err);

    return res.status(403).json({
      message: 'Invalid or expired token.',
    });
  }
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admin privileges required.' });
  }
  next();
}

export async function optionalAuth(req: AuthRequest, res: Response, next: NextFunction ) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as unknown as {
      id: string;
      email: string;
      role: UserRole;
      name: string;
    };
    const user = await UserModel.findOne({ id: decoded.id });
    if (user && user.isActive) {
      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      };
    }
  } catch (err) {
    // Ignore invalid token for optional auth
  }

  next();
}
