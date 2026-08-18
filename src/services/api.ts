import { Product, Category, Order, User, AdminStats, OrderStatus, PaymentStatus, UserRole } from '../types';

const STORAGE_KEYS = {
  PRODUCTS: 'shopstack_products_v1',
  ORDERS: 'shopstack_orders_v1',
  USERS: 'shopstack_users_v1',
  AUTH_TOKEN: 'shopstack_token_v1',
  AUTH_USER: 'shopstack_current_user_v1'
};

const SEED_PRODUCTS: Product[] = [
  {
    id: 'prod_elec_01',
    name: 'SoundLink Wireless XL Headphones',
    brand: 'AudioCraft',
    category: 'Electronics',
    price: 149.00,
    discountPrice: 129.00,
    stock: 18,
    rating: 4.8,
    numReviews: 42,
    description: 'Engineered with 40mm beryllium drivers, active hybrid noise cancellation, and up to 45 hours of playback on a single USB-C charge. Ultra-soft memory foam earcups offer all-day listening comfort.',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80'
    ],
    sku: 'AUD-SL-01',
    featured: true,
    specifications: {
      'Driver Size': '40mm High Dynamic Range',
      'Battery Life': 'Up to 45 hours (ANC ON)',
      'Connectivity': 'Bluetooth 5.3 + 3.5mm Aux',
      'Weight': '248 grams',
      'Warranty': '2 Years Limited'
    },
    reviews: [
      {
        id: 'rev_1',
        userId: 'usr_cust_01',
        userName: 'Alex Morgan',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        rating: 5,
        comment: 'Unbeatable sound stage and battery life. Perfect for office commutes and deep focus sessions.',
        createdAt: '2026-08-01T12:00:00Z'
      }
    ],
    createdAt: '2026-07-15T10:00:00Z'
  },
  {
    id: 'prod_elec_02',
    name: 'ProBook Air 13 M2 Laptop',
    brand: 'TechCore',
    category: 'Electronics',
    price: 1199.00,
    discountPrice: 999.00,
    stock: 8,
    rating: 4.9,
    numReviews: 28,
    description: 'Razor-thin anodized aluminum chassis paired with blazing 8-core silicon, 16GB unified memory, and a Liquid Retina 500-nit true-tone display.',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80'
    ],
    sku: 'LAP-PB-02',
    featured: true,
    specifications: {
      'Processor': 'Octa-Core Ultra Performance',
      'Memory': '16GB LPDDR5',
      'Storage': '512GB NVMe SSD',
      'Display': '13.6-inch Liquid Retina',
      'Weight': '1.24 kg'
    },
    reviews: [],
    createdAt: '2026-07-20T10:00:00Z'
  },
  {
    id: 'prod_home_01',
    name: 'Nordic Minimal Oak Desk',
    brand: 'Hygge Living',
    category: 'Home',
    price: 499.00,
    discountPrice: 450.00,
    stock: 4,
    rating: 4.7,
    numReviews: 19,
    description: 'Sustainably harvested solid white oak with bevelled edges, hidden cable routing tray, and matte powder-coated steel legs.',
    images: [
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&auto=format&fit=crop&q=80'
    ],
    sku: 'FURN-DK-03',
    featured: true,
    specifications: {
      'Material': 'Solid Oak & Steel',
      'Dimensions': '140cm x 70cm x 75cm',
      'Load Capacity': '120 kg',
      'Finish': 'Matte UV-resistant lacquer'
    },
    reviews: [],
    createdAt: '2026-07-22T10:00:00Z'
  },
  {
    id: 'prod_acc_01',
    name: 'Full-Grain Leather Charge Pad',
    brand: 'Craft & Oak',
    category: 'Accessories',
    price: 59.00,
    discountPrice: 49.00,
    stock: 35,
    rating: 4.6,
    numReviews: 34,
    description: 'Italian vegetable-tanned leather dual fast wireless charging pad with weighted zinc alloy base. Powers phone and earbuds simultaneously.',
    images: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1622445262464-84b14e0745b1?w=800&auto=format&fit=crop&q=80'
    ],
    sku: 'ACC-PAD-04',
    featured: true,
    specifications: {
      'Output': '15W Fast Qi Magnetic',
      'Material': 'Italian Tuscan Leather',
      'Cable': '2m Braided Nylon included'
    },
    reviews: [],
    createdAt: '2026-07-25T10:00:00Z'
  },
  {
    id: 'prod_fash_01',
    name: 'Merino Wool Minimalist Crewneck',
    brand: 'Thread & Form',
    category: 'Fashion',
    price: 110.00,
    discountPrice: 89.00,
    stock: 22,
    rating: 4.8,
    numReviews: 15,
    description: '100% extra-fine New Zealand merino wool. Temperature-regulating, odor-resistant, and pill-resistant for effortless everyday wear.',
    images: [
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop&q=80'
    ],
    sku: 'FASH-SW-05',
    featured: false,
    specifications: {
      'Composition': '100% Extra-Fine Merino Wool (19.5 micron)',
      'Fit': 'Tailored Regular',
      'Care': 'Hand wash cold or dry clean'
    },
    reviews: [],
    createdAt: '2026-07-28T10:00:00Z'
  },
  {
    id: 'prod_fash_02',
    name: 'Nomad Canvas & Leather Weekender',
    brand: 'Craft & Oak',
    category: 'Fashion',
    price: 195.00,
    discountPrice: 165.00,
    stock: 9,
    rating: 4.9,
    numReviews: 53,
    description: 'Heavyweight 18oz waxed cotton duck canvas with full-grain leather straps, solid brass hardware, and dedicated shoe compartment.',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&auto=format&fit=crop&q=80'
    ],
    sku: 'FASH-BAG-06',
    featured: true,
    specifications: {
      'Capacity': '42 Liters (Carry-on compliant)',
      'Material': 'Waxed Canvas & Tuscan Leather',
      'Zippers': 'YKK Excella'
    },
    reviews: [],
    createdAt: '2026-08-01T10:00:00Z'
  },
  {
    id: 'prod_beau_01',
    name: 'Botanical Hydrating Facial Elixir',
    brand: 'Aura Botanica',
    category: 'Beauty',
    price: 68.00,
    discountPrice: 54.00,
    stock: 45,
    rating: 4.7,
    numReviews: 24,
    description: 'Cold-pressed botanical oils including rosehip, squalane, and jojoba infused with antioxidant vitamin C and calming blue tansy.',
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1608248597359-52e00818d609?w=800&auto=format&fit=crop&q=80'
    ],
    sku: 'BEAU-OIL-07',
    featured: false,
    specifications: {
      'Volume': '50ml / 1.7 fl oz',
      'Skin Type': 'All skin types, including sensitive',
      'Formulation': '100% Organic Cold-Pressed'
    },
    reviews: [],
    createdAt: '2026-08-03T10:00:00Z'
  },
  {
    id: 'prod_acc_02',
    name: 'Precision Titanium Automatic Watch',
    brand: 'Chronos Lab',
    category: 'Accessories',
    price: 340.00,
    discountPrice: 289.00,
    stock: 6,
    rating: 4.9,
    numReviews: 38,
    description: 'Grade 2 titanium case with anti-reflective sapphire crystal, 41-hour power reserve automatic movement, and 100m water resistance.',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80'
    ],
    sku: 'ACC-WTC-08',
    featured: true,
    specifications: {
      'Movement': 'Japanese Miyota 9039 Automatic',
      'Case Diameter': '39mm',
      'Glass': 'Double-domed Sapphire Crystal',
      'Water Resistance': '10 ATM (100 meters)'
    },
    reviews: [],
    createdAt: '2026-08-05T10:00:00Z'
  }
];

const SEED_USERS: User[] = [
  {
    id: 'usr_admin_01',
    name: 'Alex Admin',
    email: 'admin@shopstack.com',
    role: 'admin',
    phone: '+1 (555) 019-2834',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    address: {
      street: '100 Innovation Way, Suite 400',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94105',
      country: 'United States'
    },
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'usr_cust_01',
    name: 'Jordan Lee',
    email: 'customer@shopstack.com',
    role: 'customer',
    phone: '+1 (555) 847-1920',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    address: {
      street: '742 Evergreen Terrace',
      city: 'Springfield',
      state: 'OR',
      postalCode: '97477',
      country: 'United States'
    },
    createdAt: '2026-02-14T00:00:00Z'
  }
];

const SEED_ORDERS: Order[] = [
  {
    id: 'ORD-9021',
    userId: 'usr_cust_01',
    customerName: 'Jordan Lee',
    customerEmail: 'customer@shopstack.com',
    items: [
      {
        productId: 'prod_elec_01',
        name: 'SoundLink Wireless XL Headphones',
        price: 129.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=80'
      },
      {
        productId: 'prod_acc_01',
        name: 'Full-Grain Leather Charge Pad',
        price: 49.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=200&auto=format&fit=crop&q=80'
      }
    ],
    shippingAddress: {
      fullName: 'Jordan Lee',
      email: 'customer@shopstack.com',
      phone: '+1 (555) 847-1920',
      street: '742 Evergreen Terrace',
      city: 'Springfield',
      state: 'OR',
      postalCode: '97477',
      country: 'United States'
    },
    paymentMethod: 'Credit Card (•••• 4242)',
    paymentStatus: 'paid',
    orderStatus: 'shipped',
    subtotal: 178.00,
    shipping: 0,
    discount: 0,
    total: 178.00,
    trackingNumber: 'TRK-EXP-8839210',
    createdAt: '2026-08-10T14:20:00Z',
    updatedAt: '2026-08-11T09:00:00Z'
  },
  {
    id: 'ORD-9018',
    userId: 'usr_cust_01',
    customerName: 'Jordan Lee',
    customerEmail: 'customer@shopstack.com',
    items: [
      {
        productId: 'prod_fash_02',
        name: 'Nomad Canvas & Leather Weekender',
        price: 165.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&auto=format&fit=crop&q=80'
      }
    ],
    shippingAddress: {
      fullName: 'Jordan Lee',
      email: 'customer@shopstack.com',
      phone: '+1 (555) 847-1920',
      street: '742 Evergreen Terrace',
      city: 'Springfield',
      state: 'OR',
      postalCode: '97477',
      country: 'United States'
    },
    paymentMethod: 'Credit Card (•••• 4242)',
    paymentStatus: 'paid',
    orderStatus: 'delivered',
    subtotal: 165.00,
    shipping: 0,
    discount: 16.50,
    total: 148.50,
    trackingNumber: 'TRK-FED-4491022',
    createdAt: '2026-07-28T11:15:00Z',
    updatedAt: '2026-07-31T16:45:00Z'
  }
];

// Helper functions for local storage data
function getLocalProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(SEED_PRODUCTS));
      return SEED_PRODUCTS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_PRODUCTS;
  }
}

function saveLocalProducts(products: Product[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  } catch (err) {
    console.error('Failed to save products:', err);
  }
}

function getLocalOrders(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(SEED_ORDERS));
      return SEED_ORDERS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_ORDERS;
  }
}

function saveLocalOrders(orders: Order[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  } catch (err) {
    console.error('Failed to save orders:', err);
  }
}

function getLocalUsers(): User[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
      return SEED_USERS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_USERS;
  }
}

function saveLocalUsers(users: User[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save users:', err);
  }
}

export const api = {
  // Auth
  async login(email: string, _pass: string): Promise<{ token: string; user: User }> {
    const users = getLocalUsers();
    let user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      // If user not found, create on the fly as customer for smooth UX
      user = {
        id: `usr_${Date.now()}`,
        name: email.split('@')[0],
        email,
        role: email.includes('admin') ? 'admin' : 'customer',
        createdAt: new Date().toISOString()
      };
      users.push(user);
      saveLocalUsers(users);
    }

    const token = `jwt_token_${user.id}_${Date.now()}`;
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
    return { token, user };
  },

  async register(name: string, email: string, _pass: string): Promise<{ token: string; user: User }> {
    const users = getLocalUsers();
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const user: User = {
      id: `usr_${Date.now()}`,
      name,
      email,
      role: 'customer',
      createdAt: new Date().toISOString()
    };

    users.push(user);
    saveLocalUsers(users);

    const token = `jwt_token_${user.id}_${Date.now()}`;
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
    return { token, user };
  },

  async getCurrentUser(): Promise<{ user: User | null }> {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
      if (!raw) return { user: null };
      return { user: JSON.parse(raw) };
    } catch {
      return { user: null };
    }
  },

  async updateProfile(updates: Partial<User>): Promise<{ user: User }> {
    const currentUser = (await this.getCurrentUser()).user;
    if (!currentUser) throw new Error('Not authenticated');

    const users = getLocalUsers();
    const idx = users.findIndex((u) => u.id === currentUser.id);

    const updatedUser = {
      ...currentUser,
      ...updates,
      address: {
        ...(currentUser.address || { street: '', city: '', state: '', postalCode: '', country: 'United States' }),
        ...(updates.address || {})
      }
    };

    if (idx !== -1) {
      users[idx] = updatedUser;
      saveLocalUsers(users);
    }

    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(updatedUser));
    return { user: updatedUser };
  },

  // Products
  async getProducts(params?: Record<string, any>): Promise<{ products: Product[]; pagination: any }> {
    let list = getLocalProducts();

    if (params?.featured === 'true') {
      list = list.filter((p) => p.featured);
    }
    if (params?.category && params.category !== 'All') {
      list = list.filter((p) => p.category.toLowerCase() === params.category.toLowerCase());
    }
    if (params?.brand && params.brand !== 'All') {
      list = list.filter((p) => p.brand.toLowerCase() === params.brand.toLowerCase());
    }
    if (params?.q) {
      const q = params.q.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
    }
    if (params?.minPrice) {
      list = list.filter((p) => (p.discountPrice ?? p.price) >= Number(params.minPrice));
    }
    if (params?.maxPrice) {
      list = list.filter((p) => (p.discountPrice ?? p.price) <= Number(params.maxPrice));
    }
    if (params?.rating) {
      list = list.filter((p) => p.rating >= Number(params.rating));
    }
    if (params?.inStock === 'true') {
      list = list.filter((p) => p.stock > 0);
    }

    // Sorting
    if (params?.sort === 'price_asc') {
      list.sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price));
    } else if (params?.sort === 'price_desc') {
      list.sort((a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price));
    } else if (params?.sort === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (params?.sort === 'name_asc') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // Newest
      list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }

    const page = Number(params?.page || 1);
    const limit = Number(params?.limit || 12);
    const total = list.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const paginated = list.slice((page - 1) * limit, page * limit);

    return {
      products: paginated,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    };
  },

  async getProductById(id: string): Promise<{ product: Product; related: Product[] }> {
    const list = getLocalProducts();
    const product = list.find((p) => p.id === id);
    if (!product) throw new Error('Product not found');

    const related = list.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
    return { product, related };
  },

  async getCategories(): Promise<{ categories: Category[] }> {
    const list = getLocalProducts();
    const map: Record<string, number> = {};

    list.forEach((p) => {
      map[p.category] = (map[p.category] || 0) + 1;
    });

    const categories: Category[] = Object.entries(map).map(([name, count]) => ({
      name,
      count
    }));

    return { categories };
  },

  async addReview(productId: string, data: { rating: number; comment: string }): Promise<{ product: Product }> {
    const user = (await this.getCurrentUser()).user;
    if (!user) throw new Error('You must be signed in to post a review');

    const list = getLocalProducts();
    const idx = list.findIndex((p) => p.id === productId);
    if (idx === -1) throw new Error('Product not found');

    const review: any = {
      id: `rev_${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      rating: data.rating,
      comment: data.comment,
      createdAt: new Date().toISOString()
    };

    const currentReviews = list[idx].reviews || [];
    currentReviews.unshift(review);

    const avgRating =
      currentReviews.reduce((sum, r) => sum + r.rating, 0) / currentReviews.length;

    list[idx] = {
      ...list[idx],
      rating: Number(avgRating.toFixed(1)),
      numReviews: currentReviews.length,
      reviews: currentReviews
    };

    saveLocalProducts(list);
    return { product: list[idx] };
  },

  // Orders
  async getMyOrders(): Promise<{ orders: Order[] }> {
    const user = (await this.getCurrentUser()).user;
    const all = getLocalOrders();
    if (!user) return { orders: all };
    return { orders: all.filter((o) => o.userId === user.id || o.customerEmail === user.email) };
  },

  async getOrderById(id: string): Promise<{ order: Order }> {
    const all = getLocalOrders();
    const order = all.find((o) => o.id === id);
    if (!order) throw new Error('Order not found');
    return { order };
  },

  async createOrder(payload: any): Promise<{ order: Order }> {
    const user = (await this.getCurrentUser()).user;
    const allProducts = getLocalProducts();
    const orders = getLocalOrders();

    const orderItems = payload.items.map((it: any) => {
      const prod = allProducts.find((p) => p.id === it.productId);
      const price = prod?.discountPrice ?? prod?.price ?? 49.99;
      return {
        productId: it.productId,
        name: it.name || prod?.name || 'Item',
        price,
        quantity: it.quantity || 1,
        image: prod?.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200'
      };
    });

    const subtotal = orderItems.reduce((sum: number, it: any) => sum + it.price * it.quantity, 0);
    const shipping = subtotal >= 50 ? 0 : 9.99;
    const discount = payload.discount || 0;
    const total = Math.max(0, subtotal + shipping - discount);

    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: user?.id || 'guest_user',
      customerName: payload.shippingAddress.fullName,
      customerEmail: payload.shippingAddress.email,
      items: orderItems,
      shippingAddress: payload.shippingAddress,
      paymentMethod: payload.paymentMethod || 'Credit Card',
      paymentStatus: 'paid',
      orderStatus: 'processing',
      subtotal,
      shipping,
      discount,
      total,
      trackingNumber: `TRK-EXP-${Math.floor(1000000 + Math.random() * 9000000)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    orders.unshift(newOrder);
    saveLocalOrders(orders);

    // Deduct stock
    orderItems.forEach((it: any) => {
      const pIdx = allProducts.findIndex((p) => p.id === it.productId);
      if (pIdx !== -1) {
        allProducts[pIdx].stock = Math.max(0, allProducts[pIdx].stock - it.quantity);
      }
    });
    saveLocalProducts(allProducts);

    return { order: newOrder };
  },

  // Admin API
  async getAdminStats(): Promise<AdminStats> {
    const products = getLocalProducts();
    const orders = getLocalOrders();
    const users = getLocalUsers();

    const totalRevenue = orders
      .filter((o) => o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + o.total, 0);

    const ordersByStatus: Record<OrderStatus, number> = {
      processing: orders.filter((o) => o.orderStatus === 'processing').length,
      shipped: orders.filter((o) => o.orderStatus === 'shipped').length,
      delivered: orders.filter((o) => o.orderStatus === 'delivered').length,
      cancelled: orders.filter((o) => o.orderStatus === 'cancelled').length
    };

    const lowStockCount = products.filter((p) => p.stock <= 5).length;

    const catMap: Record<string, number> = {};
    products.forEach((p) => {
      catMap[p.category] = (catMap[p.category] || 0) + 1;
    });

    const categoryDistribution = Object.entries(catMap).map(([category, count]) => ({
      category,
      count
    }));

    return {
      totalRevenue,
      totalOrders: orders.length,
      totalProducts: products.length,
      totalUsers: users.length,
      recentOrdersCount: orders.length,
      lowStockCount,
      ordersByStatus,
      categoryDistribution
    };
  },

  async getAdminProducts(params?: any): Promise<{ products: Product[]; pagination: any }> {
    return this.getProducts(params);
  },

  async createProduct(data: Partial<Product>): Promise<{ product: Product }> {
    const products = getLocalProducts();
    const newProduct: Product = {
      id: `prod_${Date.now()}`,
      name: data.name || 'Untitled Product',
      brand: data.brand || 'ShopStack Essentials',
      category: data.category || 'Electronics',
      price: data.price || 99.00,
      discountPrice: data.discountPrice,
      stock: data.stock || 10,
      rating: 5.0,
      numReviews: 0,
      description: data.description || '',
      images: data.images?.length ? data.images : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'],
      sku: data.sku || `SKU-${Date.now().toString().slice(-4)}`,
      featured: !!data.featured,
      createdAt: new Date().toISOString()
    };

    products.unshift(newProduct);
    saveLocalProducts(products);
    return { product: newProduct };
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<{ product: Product }> {
    const products = getLocalProducts();
    const idx = products.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('Product not found');

    products[idx] = { ...products[idx], ...updates };
    saveLocalProducts(products);
    return { product: products[idx] };
  },

  async deleteProduct(id: string): Promise<{ success: boolean }> {
    const products = getLocalProducts();
    const updated = products.filter((p) => p.id !== id);
    saveLocalProducts(updated);
    return { success: true };
  },

  async getAdminOrders(params?: any): Promise<{ orders: Order[]; pagination: any }> {
    const orders = getLocalOrders();
    return {
      orders,
      pagination: {
        page: 1,
        limit: 100,
        total: orders.length,
        totalPages: 1
      }
    };
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<{ order: Order }> {
    const orders = getLocalOrders();
    const idx = orders.findIndex((o) => o.id === orderId);
    if (idx === -1) throw new Error('Order not found');

    orders[idx].orderStatus = status;
    orders[idx].updatedAt = new Date().toISOString();
    saveLocalOrders(orders);
    return { order: orders[idx] };
  },

  async getAdminUsers(): Promise<{ users: User[] }> {
    return { users: getLocalUsers() };
  },

  async updateUserRole(userId: string, role: UserRole): Promise<{ user: User }> {
    const users = getLocalUsers();
    const idx = users.findIndex((u) => u.id === userId);
    if (idx === -1) throw new Error('User not found');

    users[idx].role = role;
    saveLocalUsers(users);
    return { user: users[idx] };
  }
};
