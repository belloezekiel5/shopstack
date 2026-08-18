import { Product, Category, Order, User, AdminStats, OrderStatus, PaymentStatus, UserRole } from '../types';

const TOKEN_KEY = 'shopstack_token_v1';
const USER_KEY = 'shopstack_current_user_v1';

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data as T;
}

export const api = {
  // Authentication
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await request<{ success: boolean; token: string; user: any }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    const user: User = {
      id: res.user._id || res.user.id,
      name: res.user.name,
      email: res.user.email,
      role: res.user.role || 'customer',
      avatar: res.user.avatar,
      phone: res.user.phone,
      address: res.user.address,
      createdAt: res.user.createdAt
    };

    setToken(res.token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return { token: res.token, user };
  },

  async register(name: string, email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await request<{ success: boolean; token: string; user: any }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });

    const user: User = {
      id: res.user._id || res.user.id,
      name: res.user.name,
      email: res.user.email,
      role: res.user.role || 'customer',
      avatar: res.user.avatar,
      phone: res.user.phone,
      address: res.user.address,
      createdAt: res.user.createdAt
    };

    setToken(res.token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return { token: res.token, user };
  },

  async getCurrentUser(): Promise<{ user: User | null }> {
    const token = getToken();
    if (!token) return { user: null };

    try {
      const res = await request<{ success: boolean; user: any }>('/api/auth/me');
      const user: User = {
        id: res.user._id || res.user.id,
        name: res.user.name,
        email: res.user.email,
        role: res.user.role || 'customer',
        avatar: res.user.avatar,
        phone: res.user.phone,
        address: res.user.address,
        createdAt: res.user.createdAt
      };
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      return { user };
    } catch {
      removeToken();
      return { user: null };
    }
  },

  async updateProfile(updates: Partial<User>): Promise<{ user: User }> {
    const res = await request<{ success: boolean; user: any }>('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates)
    });

    const user: User = {
      id: res.user._id || res.user.id,
      name: res.user.name,
      email: res.user.email,
      role: res.user.role || 'customer',
      avatar: res.user.avatar,
      phone: res.user.phone,
      address: res.user.address,
      createdAt: res.user.createdAt
    };
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return { user };
  },

  // Products
  async getProducts(params?: Record<string, any>): Promise<{ products: Product[]; pagination: any }> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') {
          query.append(k, String(v));
        }
      });
    }

    const res = await request<{ success: boolean; products: any[]; total: number }>(
      `/api/products${query.toString() ? '?' + query.toString() : ''}`
    );

    const products: Product[] = (res.products || []).map((p: any) => ({
      id: p._id || p.id,
      name: p.name,
      brand: p.brand,
      category: p.category,
      price: p.price,
      discountPrice: p.discountPrice,
      stock: p.stock,
      rating: p.rating || 5.0,
      numReviews: p.reviews?.length || p.numReviews || 0,
      description: p.description || '',
      images: p.images || [],
      specifications: p.specifications || {},
      sku: p.sku || '',
      featured: p.featured,
      reviews: p.reviews || [],
      createdAt: p.createdAt
    }));

    return {
      products,
      pagination: {
        page: Number(params?.page || 1),
        limit: Number(params?.limit || products.length),
        total: res.total || products.length,
        totalPages: Math.ceil((res.total || products.length) / (Number(params?.limit) || 12)) || 1
      }
    };
  },

  async getProductById(id: string): Promise<{ product: Product; related: Product[] }> {
    const res = await request<{ success: boolean; product: any; related: any[] }>(`/api/products/${id}`);

    const product: Product = {
      id: res.product._id || res.product.id,
      name: res.product.name,
      brand: res.product.brand,
      category: res.product.category,
      price: res.product.price,
      discountPrice: res.product.discountPrice,
      stock: res.product.stock,
      rating: res.product.rating || 5.0,
      numReviews: res.product.reviews?.length || 0,
      description: res.product.description || '',
      images: res.product.images || [],
      specifications: res.product.specifications || {},
      sku: res.product.sku || '',
      featured: res.product.featured,
      reviews: res.product.reviews || [],
      createdAt: res.product.createdAt
    };

    const related: Product[] = (res.related || []).map((p: any) => ({
      id: p._id || p.id,
      name: p.name,
      brand: p.brand,
      category: p.category,
      price: p.price,
      discountPrice: p.discountPrice,
      stock: p.stock,
      rating: p.rating || 5.0,
      numReviews: p.reviews?.length || 0,
      description: p.description || '',
      images: p.images || [],
      specifications: p.specifications || {},
      sku: p.sku || '',
      featured: p.featured,
      reviews: p.reviews || [],
      createdAt: p.createdAt
    }));

    return { product, related };
  },

  async getCategories(): Promise<{ categories: Category[] }> {
    const res = await this.getProducts();
    const map: Record<string, number> = {};

    res.products.forEach((p) => {
      map[p.category] = (map[p.category] || 0) + 1;
    });

    const categories: Category[] = Object.entries(map).map(([name, count]) => ({
      name,
      count
    }));

    return { categories };
  },

  async addReview(productId: string, data: { rating: number; comment: string }): Promise<{ product: Product }> {
    const res = await request<{ success: boolean; product: any }>(`/api/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(data)
    });

    const product: Product = {
      id: res.product._id || res.product.id,
      name: res.product.name,
      brand: res.product.brand,
      category: res.product.category,
      price: res.product.price,
      discountPrice: res.product.discountPrice,
      stock: res.product.stock,
      rating: res.product.rating || 5.0,
      numReviews: res.product.reviews?.length || 0,
      description: res.product.description || '',
      images: res.product.images || [],
      specifications: res.product.specifications || {},
      sku: res.product.sku || '',
      featured: res.product.featured,
      reviews: res.product.reviews || [],
      createdAt: res.product.createdAt
    };

    return { product };
  },

  // Orders
  async getMyOrders(): Promise<{ orders: Order[] }> {
    const res = await request<{ success: boolean; orders: any[] }>('/api/orders/my-orders');
    const orders: Order[] = (res.orders || []).map((o: any) => ({
      id: o.orderNumber || o._id || o.id,
      userId: o.userId,
      customerName: o.shippingAddress?.fullName,
      customerEmail: o.customerEmail,
      items: o.items || [],
      shippingAddress: o.shippingAddress,
      paymentMethod: o.paymentMethod,
      paymentStatus: o.paymentStatus || 'paid',
      orderStatus: o.orderStatus || 'processing',
      subtotal: o.subtotal,
      shipping: o.shipping,
      discount: o.discount,
      total: o.total,
      trackingNumber: o.trackingNumber,
      createdAt: o.createdAt,
      updatedAt: o.updatedAt
    }));
    return { orders };
  },

  async getOrderById(id: string): Promise<{ order: Order }> {
    const res = await request<{ success: boolean; order: any }>(`/api/orders/${id}`);
    const o = res.order;
    const order: Order = {
      id: o.orderNumber || o._id || o.id,
      userId: o.userId,
      customerName: o.shippingAddress?.fullName,
      customerEmail: o.customerEmail,
      items: o.items || [],
      shippingAddress: o.shippingAddress,
      paymentMethod: o.paymentMethod,
      paymentStatus: o.paymentStatus || 'paid',
      orderStatus: o.orderStatus || 'processing',
      subtotal: o.subtotal,
      shipping: o.shipping,
      discount: o.discount,
      total: o.total,
      trackingNumber: o.trackingNumber,
      createdAt: o.createdAt,
      updatedAt: o.updatedAt
    };
    return { order };
  },

  async createOrder(payload: any): Promise<{ order: Order }> {
    const res = await request<{ success: boolean; order: any }>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    const o = res.order;
    const order: Order = {
      id: o.orderNumber || o._id || o.id,
      userId: o.userId,
      customerName: o.shippingAddress?.fullName,
      customerEmail: o.customerEmail,
      items: o.items || [],
      shippingAddress: o.shippingAddress,
      paymentMethod: o.paymentMethod,
      paymentStatus: o.paymentStatus || 'paid',
      orderStatus: o.orderStatus || 'processing',
      subtotal: o.subtotal,
      shipping: o.shipping,
      discount: o.discount,
      total: o.total,
      trackingNumber: o.trackingNumber,
      createdAt: o.createdAt,
      updatedAt: o.updatedAt
    };
    return { order };
  },

  // Admin APIs
  async getAdminStats(): Promise<AdminStats> {
    const res = await request<{ success: boolean; stats: any }>('/api/stats/admin');
    return res.stats;
  },

  async getAdminProducts(params?: any): Promise<{ products: Product[]; pagination: any }> {
    return this.getProducts(params);
  },

  async createProduct(data: Partial<Product>): Promise<{ product: Product }> {
    const res = await request<{ success: boolean; product: any }>('/api/products', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    const p = res.product;
    return {
      product: {
        id: p._id || p.id,
        name: p.name,
        brand: p.brand,
        category: p.category,
        price: p.price,
        discountPrice: p.discountPrice,
        stock: p.stock,
        rating: p.rating || 5.0,
        numReviews: p.reviews?.length || 0,
        description: p.description || '',
        images: p.images || [],
        specifications: p.specifications || {},
        sku: p.sku || '',
        featured: p.featured,
        reviews: p.reviews || [],
        createdAt: p.createdAt
      }
    };
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<{ product: Product }> {
    const res = await request<{ success: boolean; product: any }>(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
    const p = res.product;
    return {
      product: {
        id: p._id || p.id,
        name: p.name,
        brand: p.brand,
        category: p.category,
        price: p.price,
        discountPrice: p.discountPrice,
        stock: p.stock,
        rating: p.rating || 5.0,
        numReviews: p.reviews?.length || 0,
        description: p.description || '',
        images: p.images || [],
        specifications: p.specifications || {},
        sku: p.sku || '',
        featured: p.featured,
        reviews: p.reviews || [],
        createdAt: p.createdAt
      }
    };
  },

  async deleteProduct(id: string): Promise<{ success: boolean }> {
    await request<{ success: boolean }>(`/api/products/${id}`, {
      method: 'DELETE'
    });
    return { success: true };
  },

  async getAdminOrders(params?: any): Promise<{ orders: Order[]; pagination: any }> {
    const res = await request<{ success: boolean; orders: any[]; total: number }>('/api/orders');
    const orders: Order[] = (res.orders || []).map((o: any) => ({
      id: o.orderNumber || o._id || o.id,
      userId: o.userId,
      customerName: o.shippingAddress?.fullName,
      customerEmail: o.customerEmail,
      items: o.items || [],
      shippingAddress: o.shippingAddress,
      paymentMethod: o.paymentMethod,
      paymentStatus: o.paymentStatus || 'paid',
      orderStatus: o.orderStatus || 'processing',
      subtotal: o.subtotal,
      shipping: o.shipping,
      discount: o.discount,
      total: o.total,
      trackingNumber: o.trackingNumber,
      createdAt: o.createdAt,
      updatedAt: o.updatedAt
    }));
    return {
      orders,
      pagination: {
        page: 1,
        limit: orders.length,
        total: res.total || orders.length,
        totalPages: 1
      }
    };
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<{ order: Order }> {
    const res = await request<{ success: boolean; order: any }>(`/api/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
    const o = res.order;
    return {
      order: {
        id: o.orderNumber || o._id || o.id,
        userId: o.userId,
        customerName: o.shippingAddress?.fullName,
        customerEmail: o.customerEmail,
        items: o.items || [],
        shippingAddress: o.shippingAddress,
        paymentMethod: o.paymentMethod,
        paymentStatus: o.paymentStatus || 'paid',
        orderStatus: o.orderStatus || 'processing',
        subtotal: o.subtotal,
        shipping: o.shipping,
        discount: o.discount,
        total: o.total,
        trackingNumber: o.trackingNumber,
        createdAt: o.createdAt,
        updatedAt: o.updatedAt
      }
    };
  },

  async getAdminUsers(): Promise<{ users: User[] }> {
    const res = await request<{ success: boolean; users: any[] }>('/api/users');
    const users: User[] = (res.users || []).map((u: any) => ({
      id: u._id || u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      avatar: u.avatar,
      phone: u.phone,
      address: u.address,
      createdAt: u.createdAt
    }));
    return { users };
  },

  async updateUserRole(userId: string, role: UserRole): Promise<{ user: User }> {
    const res = await request<{ success: boolean; user: any }>(`/api/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role })
    });
    const u = res.user;
    return {
      user: {
        id: u._id || u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        avatar: u.avatar,
        phone: u.phone,
        address: u.address,
        createdAt: u.createdAt
      }
    };
  }
};
