import { Response } from 'express';
import crypto from 'crypto';
import { OrderModel } from '../models/Order.js';
import { ProductModel } from '../models/Product.js';
import { AuthRequest } from '../middleware/auth.js';
import { buildIdFilter, normalizeDoc, normalizeDocs } from '../utils/dbUtils.js';

export async function createOrder(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: 'Authentication required to place an order.',
      });
    }

    const {
      items,
      shippingAddress,
      paymentMethod,
      discount = 0,
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: 'Cannot place an empty order.',
      });
    }

    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.street ||
      !shippingAddress.city
    ) {
      return res.status(400).json({
        message: 'Please provide a valid shipping address.',
      });
    }

    const verifiedItems = [];
    let calculatedSubtotal = 0;

    for (const item of items) {
      const product = await ProductModel.findOne(buildIdFilter(item.productId));

      if (!product) {
        return res.status(400).json({
          message: `Product ${item.name || item.productId} no longer exists.`,
        });
      }

      const quantity = Number(item.quantity);

      if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({
          message: `Invalid quantity for ${product.name}.`,
        });
      }

      if (product.stock < quantity) {
        return res.status(400).json({
          message: `Not enough stock available for ${product.name}. Available: ${product.stock}`,
        });
      }

      const itemPrice = product.discountPrice ?? product.price;

      calculatedSubtotal += itemPrice * quantity;

      verifiedItems.push({
        productId: product.id || (product as any)._id?.toString(),
        name: product.name,
        image: product.images[0] || '',
        price: itemPrice,
        quantity,
      });
    }

    const shippingCost = calculatedSubtotal > 50 ? 0 : 9.99;

    const discountAmount = Math.min(
      Math.max(Number(discount) || 0, 0),
      calculatedSubtotal
    );

    const finalTotal = Number(
      (calculatedSubtotal + shippingCost - discountAmount).toFixed(2)
    );

    // Reduce product stock
    for (const item of verifiedItems) {
      await ProductModel.updateOne(
        buildIdFilter(item.productId),
        { $inc: { stock: -item.quantity } }
      );
    }

    const newOrder = await OrderModel.create({
      id: crypto.randomUUID(),

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
        country: shippingAddress.country || 'United States',
      },

      subtotal: Number(calculatedSubtotal.toFixed(2)),

      shipping: shippingCost,

      discount: discountAmount,

      total: finalTotal,

      paymentMethod:
        paymentMethod || 'Credit Card (Mock Payment)',

      paymentStatus: 'paid',

      orderStatus: 'processing',

      trackingNumber: `TRK-${Math.floor(
        10000000 + Math.random() * 90000000
      )}US`,
    });

    return res.status(201).json({
      order: newOrder,
      message: 'Order placed successfully!',
    });
  } catch (error) {
    console.error('createOrder error:', error);

    return res.status(500).json({
      message: 'Error processing order.',
    });
  }
}


export async function getMyOrders(
  req: AuthRequest,
  res: Response
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: 'Authentication required.',
      });
    }

    const orders = await OrderModel.find({
      userId: req.user.id,
    })
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      orders: normalizeDocs(orders),
    });
  } catch (error) {
    console.error('getMyOrders error:', error);

    return res.status(500).json({
      message: 'Error fetching order history.',
    });
  }
}


export async function getOrderById(
  req: AuthRequest,
  res: Response
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: 'Authentication required.',
      });
    }

    const { id } = req.params;

    const rawOrder = await OrderModel.findOne(buildIdFilter(id)).lean();

    if (!rawOrder) {
      return res.status(404).json({
        message: 'Order not found.',
      });
    }

    const order = normalizeDoc(rawOrder)!;

    // User must own the order unless they are an admin
    if (
      order.userId !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        message: 'Unauthorized to view this order.',
      });
    }

    return res.json({
      order,
    });
  } catch (error) {
    console.error('getOrderById error:', error);

    return res.status(500).json({
      message: 'Error retrieving order.',
    });
  }
}


export async function getAllOrdersAdmin(
  req: AuthRequest,
  res: Response
) {
  try {
    const {
      status,
      paymentStatus,
      search,
    } = req.query;

    const filter: Record<string, any> = {};

    if (
      status &&
      typeof status === 'string' &&
      status !== 'all'
    ) {
      filter.orderStatus = status;
    }

    if (
      paymentStatus &&
      typeof paymentStatus === 'string' &&
      paymentStatus !== 'all'
    ) {
      filter.paymentStatus = paymentStatus;
    }

    if (search && typeof search === 'string') {
      const q = search.trim();

      if (q) {
        filter.$or = [
          {
            id: {
              $regex: q,
              $options: 'i',
            },
          },
          {
            customerName: {
              $regex: q,
              $options: 'i',
            },
          },
          {
            customerEmail: {
              $regex: q,
              $options: 'i',
            },
          },
          {
            trackingNumber: {
              $regex: q,
              $options: 'i',
            },
          },
        ];
      }
    }

    const orders = await OrderModel.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      orders,
      total: orders.length,
    });
  } catch (error) {
    console.error('getAllOrdersAdmin error:', error);

    return res.status(500).json({
      message: 'Error fetching admin orders.',
    });
  }
}


export async function updateOrderStatusAdmin(
  req: AuthRequest,
  res: Response
) {
  try {
    const { id } = req.params;

    const {
      orderStatus,
      paymentStatus,
    } = req.body;

    const updates: Record<string, any> = {};

    if (orderStatus !== undefined) {
      updates.orderStatus = orderStatus;
    }

    if (paymentStatus !== undefined) {
      updates.paymentStatus = paymentStatus;
    }

    const updated = await OrderModel.findOneAndUpdate(
      { id },
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    ).lean();

    if (!updated) {
      return res.status(404).json({
        message: 'Order not found.',
      });
    }

    return res.json({
      order: updated,
      message: 'Order status updated successfully.',
    });
  } catch (error) {
    console.error(
      'updateOrderStatusAdmin error:',
      error
    );

    return res.status(500).json({
      message: 'Error updating order status.',
    });
  }
}