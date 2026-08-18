import { Router, Request, Response } from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus
} from '../store';
import { requireAuth, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

// Create order (Customer or Guest)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { items, shippingAddress, paymentMethod, discount } = req.body;

    if (!items || !items.length || !shippingAddress) {
      return res.status(400).json({ success: false, message: 'Items and shipping address are required' });
    }

    const subtotal = items.reduce((acc: number, it: any) => acc + it.price * it.quantity, 0);
    const shipping = subtotal > 100 ? 0 : 9.99;
    const discountVal = Number(discount) || 0;
    const total = Math.max(0, subtotal + shipping - discountVal);

    // If Authorization header exists, associate with user
    const authHeader = req.headers.authorization;
    let userId = null;
    let customerEmail = shippingAddress.email;

    const order = await createOrder({
      userId,
      customerEmail,
      items,
      shippingAddress,
      subtotal,
      shipping,
      discount: discountVal,
      total,
      paymentMethod: paymentMethod || 'Credit Card',
      trackingNumber: `EXP-${Math.floor(100000 + Math.random() * 900000)}`
    });

    return res.status(201).json({
      success: true,
      order
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Order creation failed' });
  }
});

// Get user orders (Auth required)
router.get('/my-orders', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user._id?.toString() || req.user.id;
    const orders = await getOrders(userId);
    return res.json({
      success: true,
      orders
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch orders' });
  }
});

// Get order by ID (Auth or public by ID)
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const order = await getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    return res.json({
      success: true,
      order
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch order' });
  }
});

// Admin: Get all orders
router.get('/', requireAuth, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const orders = await getOrders();
    return res.json({
      success: true,
      orders,
      total: orders.length
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch orders' });
  }
});

// Admin: Update order fulfillment status
router.patch('/:id/status', requireAuth, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    const updated = await updateOrderStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    return res.json({
      success: true,
      order: updated
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to update order status' });
  }
});

export default router;
