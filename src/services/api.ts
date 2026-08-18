import { Product, Category, Order, User, AdminStats, OrderStatus, UserRole } from '../types';

const AUTH_TOKEN_KEY = 'shopstack_token_v1';
const AUTH_USER_KEY = 'shopstack_current_user_v1';

// Helper for API fetch
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`/api${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({ message: 'Network response error.' }));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data as T;
}

export const api = {
  // Database status
  async getDatabaseStatus(): Promise<{ database: { isConfigured: boolean; status: string; host: string | null; name: string | null } }> {
    try {
      return await apiRequest<{ database: { isConfigured: boolean; status: string; host: string | null; name: string | null } }>('/status');
    } catch {
      return { database: { isConfigured: false, status: 'disconnected', host: null, name: null } };
    }
  },

  // Auth
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await apiRequest<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (res.token) {
      localStorage.setItem(AUTH_TOKEN_KEY, res.token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(res.user));
    }

    return res;
  },

  async register(name: string, email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await apiRequest<{ token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });

    if (res.token) {
      localStorage.setItem(AUTH_TOKEN_KEY, res.token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(res.user));
    }

    return res;
  },

  async getCurrentUser(): Promise<{ user: User | null }> {
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (!token) return { user: null };

      const res = await apiRequest<{ user: User }>('/auth/me');
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(res.user));
      return res;
    } catch {
      // Return cached user if offline or token invalid
      const cached = localStorage.getItem(AUTH_USER_KEY);
      return { user: cached ? JSON.parse(cached) : null };
    }
  },

  async updateProfile(updates: Partial<User>): Promise<{ user: User }> {
    const res = await apiRequest<{ user: User }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });

    if (res.user) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(res.user));
    }

    return res;
  },

  // Products
  async getProducts(params?: Record<string, any>): Promise<{ products: Product[]; pagination: any }> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          query.set(key, String(val));
        }
      });
    }

    const qs = query.toString() ? `?${query.toString()}` : '';
    return apiRequest<{ products: Product[]; pagination: any }>(`/products${qs}`);
  },

  async getProductById(id: string): Promise<{ product: Product; related: Product[] }> {
    return apiRequest<{ product: Product; related: Product[] }>(`/products/${id}`);
  },

  async getCategories(): Promise<{ categories: Category[] }> {
    return apiRequest<{ categories: Category[] }>('/products/categories');
  },

  async addReview(productId: string, data: { rating: number; comment: string }): Promise<{ product: Product }> {
    return apiRequest<{ product: Product }>(`/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Orders
  async getMyOrders(): Promise<{ orders: Order[] }> {
    return apiRequest<{ orders: Order[] }>('/orders/my-orders');
  },

  async getOrderById(id: string): Promise<{ order: Order }> {
    return apiRequest<{ order: Order }>(`/orders/${id}`);
  },

  async createOrder(payload: any): Promise<{ order: Order }> {
    return apiRequest<{ order: Order }>('/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Admin API
  async getAdminStats(): Promise<AdminStats> {
    const res = await apiRequest<{ stats: any }>('/admin/stats');
    const statsData = res.stats || {};
    return {
      totalRevenue: statsData.totalSales ?? 0,
      totalOrders: statsData.totalOrders ?? 0,
      totalProducts: statsData.totalProducts ?? 0,
      totalUsers: statsData.totalCustomers ?? 0,
      recentOrdersCount: statsData.recentOrders?.length ?? 0,
      lowStockCount: statsData.lowStockProducts?.length ?? 0,
      ordersByStatus: statsData.orderStatusCount ?? { processing: 0, shipped: 0, delivered: 0, cancelled: 0 },
      categoryDistribution: Object.entries(statsData.categorySales || {}).map(([category, count]) => ({
        category,
        count: Number(count),
      })),
    };
  },

  async getAdminProducts(params?: any): Promise<{ products: Product[]; pagination: any }> {
    return this.getProducts(params);
  },

  async createProduct(data: Partial<Product>): Promise<{ product: Product }> {
    return apiRequest<{ product: Product }>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<{ product: Product }> {
    return apiRequest<{ product: Product }>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async deleteProduct(id: string): Promise<{ success: boolean }> {
    await apiRequest(`/products/${id}`, {
      method: 'DELETE',
    });
    return { success: true };
  },

  async getAdminOrders(params?: any): Promise<{ orders: Order[]; pagination: any }> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null) query.set(key, String(val));
      });
    }
    const qs = query.toString() ? `?${query.toString()}` : '';
    const res = await apiRequest<{ orders: Order[]; total: number }>(`/admin/orders${qs}`);
    return {
      orders: res.orders || [],
      pagination: {
        page: 1,
        limit: 100,
        total: res.total || 0,
        totalPages: 1,
      },
    };
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<{ order: Order }> {
    return apiRequest<{ order: Order }>(`/admin/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ orderStatus: status }),
    });
  },

  async getAdminUsers(): Promise<{ users: User[] }> {
    return apiRequest<{ users: User[] }>('/admin/users');
  },

  async updateUserRole(userId: string, role: UserRole): Promise<{ user: User }> {
    return apiRequest<{ user: User }>(`/admin/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  },
};
