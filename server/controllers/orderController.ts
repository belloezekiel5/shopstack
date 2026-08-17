import { Response } from 'express';
import { store } from '../data/store.js';
import { AuthRequest } from '../middleware/auth.js';

export function createOrder(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required to place an order.' });
    }

    const { items, shippingAddress, paymentMethod, discount = 0 } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Cannot place an empty order.' });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.street || !shippingAddress.city) {
      return res.status(400).json({ message: 'Please provide a valid shipping address.' });
    }

    // Verify items and calculate actual subtotal
    const verifiedItems = [];
    let calculatedSubtotal = 0;

    for (const item of items) {
      const product = store.findProductById(item.productId);
      if (!product) {
        return res.status(400).json({ message: `Product ${item.name || item.productId} no longer exists.` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock available for ${product.name}. Available: ${product.stock}`
        });
      }

      const itemPrice = product.discountPrice ?? product.price;
      calculatedSubtotal += itemPrice * item.quantity;

      verifiedItems.push({
        productId: product.id,
        name: product.name,
        image: product.images[0] || '',
        price: itemPrice,
        quantity: item.quantity
      });
    }

    const shippingCost = calculatedSubtotal > 50 ? 0 : 9.99;
    const discountAmount = Math.min(Number(discount) || 0, calculatedSubtotal);
    const finalTotal = Number((calculatedSubtotal + shippingCost - discountAmount).toFixed(2));

    const newOrder = store.createOrder({
      userId: req.user.id,
      customerName: req.user.name,
      customerEmail: req.user.email,
      items: verifiedItems,
      shippingAddress: {
        fullName: shippingAddress.fullName,
        email: shippingAddress.email || req.user.email,
        phone: shippingAddress.phone || '',
        street: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state || '',
        postalCode: shippingAddress.postalCode || '',
        country: shippingAddress.country || 'United States'
      },
      subtotal: Number(calculatedSubtotal.toFixed(2)),
      shipping: shippingCost,
      discount: discountAmount,
      total: finalTotal,
      paymentMethod: paymentMethod || 'Credit Card (Mock Payment)',
      paymentStatus: 'paid',
      orderStatus: 'processing',
      trackingNumber: `TRK-${Math.floor(10000000 + Math.random() * 90000000)}US`
    });

    return res.status(201).json({
      order: newOrder,
      message: 'Order placed successfully!'
    });
  } catch (error) {
    console.error('createOrder error:', error);
    return res.status(500).json({ message: 'Error processing order.' });
  }
}

export function getMyOrders(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    const orders = store.findOrdersByUserId(req.user.id);
    return res.json({ orders });
  } catch (error) {
    console.error('getMyOrders error:', error);
    return res.status(500).json({ message: 'Error fetching order history.' });
  }
}

export function getOrderById(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    const { id } = req.params;
    const order = store.findOrderById(id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    // Check authorization: user must own order or be admin
    if (order.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized to view this order.' });
    }

    return res.json({ order });
  } catch (error) {
    console.error('getOrderById error:', error);
    return res.status(500).json({ message: 'Error retrieving order.' });
  }
}

export function getAllOrdersAdmin(req: AuthRequest, res: Response) {
  try {
    const { status, paymentStatus, search } = req.query;
    let orders = [...store.getAllOrders()];

    if (status && status !== 'all') {
      orders = orders.filter(o => o.orderStatus === status);
    }

    if (paymentStatus && paymentStatus !== 'all') {
      orders = orders.filter(o => o.paymentStatus === paymentStatus);
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      orders = orders.filter(o =>
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q) ||
        (o.trackingNumber && o.trackingNumber.toLowerCase().includes(q))
      );
    }

    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return res.json({ orders, total: orders.length });
  } catch (error) {
    console.error('getAllOrdersAdmin error:', error);
    return res.status(500).json({ message: 'Error fetching admin orders.' });
  }
}

export function updateOrderStatusAdmin(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    const updated = store.updateOrderStatus(id, orderStatus, paymentStatus);
    if (!updated) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    return res.json({ order: updated, message: 'Order status updated successfully.' });
  } catch (error) {
    console.error('updateOrderStatusAdmin error:', error);
    return res.status(500).json({ message: 'Error updating order status.' });
  }
}
