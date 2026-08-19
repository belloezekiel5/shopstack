export type UserRole = 'customer' | 'admin';

export interface UserAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  address?: UserAddress;
  createdAt: string;
}

export interface ProductReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  discountPrice?: number;
  stock: number;
  rating: number;
  numReviews: number;
  description: string;
  images: string[];
  sku?: string;
  featured?: boolean;
  specifications?: Record<string, string>;
  reviews?: ProductReview[];
  createdAt?: string;
}

export interface Category {
  name: string;
  count: number;
  image?: string;
}

export interface CartItem {
  id: string; // product id
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice: number;
  image: string;
  quantity: number;
  stock: number;
}

export type OrderStatus = 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface OrderShippingAddress {
  fullName: string;
  email: string;
  phone?: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  shippingAddress: OrderShippingAddress;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  recentOrdersCount: number;
  lowStockCount: number;
  ordersByStatus: Record<OrderStatus, number>;
  categoryDistribution: Array<{ category: string; count: number }>;
}
