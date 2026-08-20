import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { getDatabaseStatus } from '../db.js';

import * as authController from '../controllers/authController.js';
import * as productController from '../controllers/productController.js';
import * as orderController from '../controllers/orderController.js';
import * as reviewController from '../controllers/reviewController.js';
import * as userController from '../controllers/userController.js';
import * as cartWishlistController from '../controllers/cartWishlistController.js';

const router = Router();

router.get('/db-status', (_req, res) => {
  const db = getDatabaseStatus();

  res.json({
    success: db.status === 'connected',
    database: db,
  });
});

// Auth Routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', authenticateToken as any, authController.getMe as any);
router.put('/auth/profile', authenticateToken as any, authController.updateProfile as any);

// Cart Routes (MongoDB backed)
router.get('/cart', authenticateToken as any, cartWishlistController.getCart as any);
router.post('/cart/sync', authenticateToken as any, cartWishlistController.syncCart as any);
router.delete('/cart', authenticateToken as any, cartWishlistController.clearCart as any);

// Wishlist Routes (MongoDB backed)
router.get('/wishlist', authenticateToken as any, cartWishlistController.getWishlist as any);
router.post('/wishlist/toggle', authenticateToken as any, cartWishlistController.toggleWishlist as any);

// Product Public Routes
router.get('/products/categories', productController.getCategories);
router.get('/products', productController.getProducts);
router.get('/products/:id', productController.getProductById);

// Product Admin Routes
router.post('/products', authenticateToken as any, requireAdmin as any, productController.createProduct as any);
router.put('/products/:id', authenticateToken as any, requireAdmin as any, productController.updateProduct as any);
router.delete('/products/:id', authenticateToken as any, requireAdmin as any, productController.deleteProduct as any);

// Review Routes
router.post('/products/:productId/reviews', authenticateToken as any, reviewController.addReview as any);

// Order User Routes
router.post('/orders', authenticateToken as any, orderController.createOrder as any);
router.get('/orders/my-orders', authenticateToken as any, orderController.getMyOrders as any);
router.get('/orders/:id', authenticateToken as any, orderController.getOrderById as any);

// Admin Routes
router.get('/admin/orders', authenticateToken as any, requireAdmin as any, orderController.getAllOrdersAdmin as any);
router.put('/admin/orders/:id/status', authenticateToken as any, requireAdmin as any, orderController.updateOrderStatusAdmin as any);
router.get('/admin/users', authenticateToken as any, requireAdmin as any, userController.getAllUsersAdmin as any);
router.post('/admin/users', authenticateToken as any, requireAdmin as any, userController.createAdmin as any);
router.put('/admin/users/:id', authenticateToken as any, requireAdmin as any, userController.updateUserRoleAdmin as any);
router.get('/admin/stats', authenticateToken as any, requireAdmin as any, userController.getAdminStats as any);

export default router;
