import { Response } from 'express';
import { UserModel } from '../models/User.js';
import { ProductModel } from '../models/Product.js';
import { AuthRequest } from '../middleware/auth.js';

// ========================
// CART CONTROLLERS
// ========================

export async function getCart(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    const user = await UserModel.findOne({ id: req.user.id }).lean();
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.json({ cart: user.cart || [] });
  } catch (error) {
    console.error('getCart error:', error);
    return res.status(500).json({ message: 'Error retrieving cart.' });
  }
}

export async function syncCart(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    const { items } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ message: 'Items array is required.' });
    }

    const user = await UserModel.findOneAndUpdate(
      { id: req.user.id },
      { $set: { cart: items } },
      { new: true }
    ).lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.json({ cart: user.cart || [], message: 'Cart synced successfully.' });
  } catch (error) {
    console.error('syncCart error:', error);
    return res.status(500).json({ message: 'Error syncing cart.' });
  }
}

export async function clearCart(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    await UserModel.updateOne(
      { id: req.user.id },
      { $set: { cart: [] } }
    );

    return res.json({ message: 'Cart cleared successfully.', cart: [] });
  } catch (error) {
    console.error('clearCart error:', error);
    return res.status(500).json({ message: 'Error clearing cart.' });
  }
}

// ========================
// WISHLIST CONTROLLERS
// ========================

export async function getWishlist(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    const user = await UserModel.findOne({ id: req.user.id }).lean();
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const productIds = user.wishlist || [];
    const products = await ProductModel.find({ id: { $in: productIds } }).lean();

    return res.json({ wishlist: productIds, products });
  } catch (error) {
    console.error('getWishlist error:', error);
    return res.status(500).json({ message: 'Error retrieving wishlist.' });
  }
}

export async function toggleWishlist(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required.' });
    }

    const user = await UserModel.findOne({ id: req.user.id });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const currentList = user.wishlist || [];
    const exists = currentList.includes(productId);

    if (exists) {
      user.wishlist = currentList.filter(id => id !== productId);
    } else {
      user.wishlist.push(productId);
    }

    await user.save();

    return res.json({
      wishlist: user.wishlist,
      added: !exists,
      message: exists ? 'Removed from wishlist.' : 'Added to wishlist.'
    });
  } catch (error) {
    console.error('toggleWishlist error:', error);
    return res.status(500).json({ message: 'Error updating wishlist.' });
  }
}
