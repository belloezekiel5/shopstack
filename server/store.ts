import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from './models/User';
import { Product } from './models/Product';
import { Order } from './models/Order';
import { isDbConnected } from './db';
import { initialProducts } from '../src/data/initialProducts';

const JWT_SECRET = process.env.JWT_SECRET || 'shopstack_dev_secret_key_2025_ecommerce';

// In-memory / Fallback stores for zero-setup local dev
let fallbackUsers: any[] = [];
let fallbackProducts: any[] = JSON.parse(JSON.stringify(initialProducts));
let fallbackOrders: any[] = [];

// Seed default accounts if needed
export async function initStore() {
  if (isDbConnected()) {
    try {
      const prodCount = await (Product as any).countDocuments();
      if (prodCount === 0) {
        console.log('[Store] 📦 Seeding initial catalog into MongoDB...');
        await (Product as any).insertMany(initialProducts);
      }
    } catch (e: any) {
      console.error('[Store] Error checking/seeding MongoDB:', e.message);
    }
  }
}

export function generateToken(payload: { id: string; email: string; role: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
  } catch {
    return null;
  }
}

// User Operations
export async function findUserByEmail(email: string) {
  if (isDbConnected()) {
    return await (User as any).findOne({ email: email.toLowerCase() });
  }
  return fallbackUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export async function findUserById(id: string) {
  if (isDbConnected()) {
    return await (User as any).findById(id).select('-password');
  }
  const u = fallbackUsers.find((user) => user._id === id || user.id === id);
  if (u) {
    const { password, ...rest } = u;
    return rest;
  }
  return null;
}

export async function createUser(data: any) {
  if (isDbConnected()) {
    const newUser = new User(data);
    await newUser.save();
    const obj = newUser.toObject();
    delete obj.password;
    return obj;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(data.password, salt);
  const user = {
    _id: 'user_' + Date.now(),
    id: 'user_' + Date.now(),
    ...data,
    password: hashedPassword,
    createdAt: new Date()
  };
  fallbackUsers.push(user);
  const { password, ...rest } = user;
  return rest;
}

export async function updateUser(id: string, updates: any) {
  if (isDbConnected()) {
    return await (User as any).findByIdAndUpdate(id, updates, { new: true }).select('-password');
  }
  const idx = fallbackUsers.findIndex((u) => u._id === id || u.id === id);
  if (idx !== -1) {
    fallbackUsers[idx] = { ...fallbackUsers[idx], ...updates };
    const { password, ...rest } = fallbackUsers[idx];
    return rest;
  }
  return null;
}

export async function getAllUsers() {
  if (isDbConnected()) {
    return await (User as any).find().select('-password').sort({ createdAt: -1 });
  }
  return fallbackUsers.map(({ password, ...rest }) => rest);
}

// Product Operations
export async function getProducts(query: any = {}) {
  if (isDbConnected()) {
    const filter: any = {};
    if (query.category && query.category !== 'All') {
      filter.category = query.category;
    }
    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { brand: { $regex: query.search, $options: 'i' } },
        { description: { $regex: query.search, $options: 'i' } }
      ];
    }
    if (query.featured) {
      filter.featured = true;
    }
    return await (Product as any).find(filter).sort({ createdAt: -1 });
  }

  let list = [...fallbackProducts];
  if (query.category && query.category !== 'All') {
    list = list.filter((p) => p.category.toLowerCase() === query.category.toLowerCase());
  }
  if (query.search) {
    const s = query.search.toLowerCase();
    list = list.filter((p) => p.name.toLowerCase().includes(s) || p.brand.toLowerCase().includes(s));
  }
  if (query.featured) {
    list = list.filter((p) => p.featured);
  }
  return list;
}

export async function getProductById(id: string) {
  if (isDbConnected()) {
    return await (Product as any).findById(id);
  }
  return fallbackProducts.find((p) => p._id === id || p.id === id) || null;
}

export async function createProduct(data: any) {
  if (isDbConnected()) {
    const p = new Product(data);
    return await p.save();
  }
  const p = {
    _id: 'prod_' + Date.now(),
    id: 'prod_' + Date.now(),
    rating: 5.0,
    reviews: [],
    ...data,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  fallbackProducts.unshift(p);
  return p;
}

export async function updateProduct(id: string, updates: any) {
  if (isDbConnected()) {
    return await (Product as any).findByIdAndUpdate(id, updates, { new: true });
  }
  const idx = fallbackProducts.findIndex((p) => p._id === id || p.id === id);
  if (idx !== -1) {
    fallbackProducts[idx] = { ...fallbackProducts[idx], ...updates, updatedAt: new Date() };
    return fallbackProducts[idx];
  }
  return null;
}

export async function deleteProduct(id: string) {
  if (isDbConnected()) {
    return await (Product as any).findByIdAndDelete(id);
  }
  const idx = fallbackProducts.findIndex((p) => p._id === id || p.id === id);
  if (idx !== -1) {
    const deleted = fallbackProducts.splice(idx, 1);
    return deleted[0];
  }
  return null;
}

export async function addProductReview(productId: string, review: any) {
  if (isDbConnected()) {
    const p = await (Product as any).findById(productId);
    if (!p) return null;
    p.reviews.unshift(review);
    const sum = p.reviews.reduce((acc: number, r: any) => acc + r.rating, 0);
    p.rating = Number((sum / p.reviews.length).toFixed(1));
    return await p.save();
  }
  const p = fallbackProducts.find((prod) => prod._id === productId || prod.id === productId);
  if (!p) return null;
  if (!p.reviews) p.reviews = [];
  p.reviews.unshift(review);
  const sum = p.reviews.reduce((acc: number, r: any) => acc + r.rating, 0);
  p.rating = Number((sum / p.reviews.length).toFixed(1));
  return p;
}

// Order Operations
export async function createOrder(data: any) {
  const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;
  if (isDbConnected()) {
    const order = new Order({ ...data, orderNumber });
    return await order.save();
  }
  const order = {
    _id: 'order_' + Date.now(),
    id: orderNumber,
    orderNumber,
    orderStatus: 'processing',
    paymentStatus: 'paid',
    createdAt: new Date(),
    ...data
  };
  fallbackOrders.unshift(order);
  return order;
}

export async function getOrders(userId?: string) {
  if (isDbConnected()) {
    const filter = userId ? { userId } : {};
    return await (Order as any).find(filter).sort({ createdAt: -1 });
  }
  if (userId) {
    return fallbackOrders.filter((o) => o.userId === userId);
  }
  return [...fallbackOrders];
}

export async function getOrderById(id: string) {
  if (isDbConnected()) {
    return await (Order as any).findOne({ $or: [{ _id: id }, { orderNumber: id }] });
  }
  return fallbackOrders.find((o) => o._id === id || o.id === id || o.orderNumber === id) || null;
}

export async function updateOrderStatus(orderId: string, status: string) {
  if (isDbConnected()) {
    return await (Order as any).findOneAndUpdate(
      { $or: [{ _id: orderId }, { orderNumber: orderId }] },
      { orderStatus: status },
      { new: true }
    );
  }
  const o = fallbackOrders.find((ord) => ord._id === orderId || ord.id === orderId || ord.orderNumber === orderId);
  if (o) {
    o.orderStatus = status;
    return o;
  }
  return null;
}

export async function getAdminStats() {
  const orders = await getOrders();
  const products = await getProducts();
  const users = await getAllUsers();

  const totalRevenue = orders.reduce((acc: number, o: any) => acc + (o.total || 0), 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const totalUsers = users.length;

  const ordersByStatus = {
    processing: orders.filter((o: any) => o.orderStatus === 'processing').length,
    shipped: orders.filter((o: any) => o.orderStatus === 'shipped').length,
    delivered: orders.filter((o: any) => o.orderStatus === 'delivered').length,
    cancelled: orders.filter((o: any) => o.orderStatus === 'cancelled').length
  };

  return {
    totalRevenue,
    totalOrders,
    totalProducts,
    totalUsers,
    ordersByStatus
  };
}
