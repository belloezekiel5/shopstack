import bcrypt from 'bcryptjs';
import { UserDoc, ProductDoc, OrderDoc, ProductReview } from './types.js';

class InMemoryStore {
  users: UserDoc[] = [];
  products: ProductDoc[] = [];
  orders: OrderDoc[] = [];

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    const salt = bcrypt.genSaltSync(10);
    const adminPasswordHash = bcrypt.hashSync('admin123', salt);
    const customerPasswordHash = bcrypt.hashSync('customer123', salt);

    // Initial Users
    this.users = [
      {
        id: 'usr_admin_01',
        name: 'Alex Rivera (Admin)',
        email: 'admin@shopstack.com',
        password: adminPasswordHash,
        role: 'admin',
        phone: '+1 (555) 019-2834',
        address: {
          street: '742 Evergreen Terrace',
          city: 'San Francisco',
          state: 'CA',
          postalCode: '94107',
          country: 'United States'
        },
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        isActive: true,
        createdAt: '2026-01-10T10:00:00.000Z',
        updatedAt: '2026-01-10T10:00:00.000Z'
      },
      {
        id: 'usr_cust_01',
        name: 'Jordan Lee',
        email: 'customer@shopstack.com',
        password: customerPasswordHash,
        role: 'customer',
        phone: '+1 (555) 438-9201',
        address: {
          street: '124 Market Street, Apt 4B',
          city: 'Seattle',
          state: 'WA',
          postalCode: '98101',
          country: 'United States'
        },
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        isActive: true,
        createdAt: '2026-02-01T14:30:00.000Z',
        updatedAt: '2026-02-01T14:30:00.000Z'
      },
      {
        id: 'usr_cust_02',
        name: 'Elena Rostova',
        email: 'elena@example.com',
        password: customerPasswordHash,
        role: 'customer',
        phone: '+1 (555) 839-1120',
        address: {
          street: '55 Pine Avenue',
          city: 'Austin',
          state: 'TX',
          postalCode: '78701',
          country: 'United States'
        },
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
        isActive: true,
        createdAt: '2026-02-15T09:12:00.000Z',
        updatedAt: '2026-02-15T09:12:00.000Z'
      }
    ];

    // Initial Products with high-res images and specs
    this.products = [
      {
        id: 'prod_elec_01',
        name: 'AcousticPro Wireless Noise-Cancelling Headphones',
        description: 'Engineered for audio purists. Features dual-chamber 40mm titanium drivers, adaptive 45dB hybrid ANC, 40 hours of playtime, and memory-foam plush ear cushions.',
        price: 249.99,
        discountPrice: 199.99,
        category: 'Electronics',
        brand: 'SoundCore Studio',
        images: [
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80'
        ],
        stock: 38,
        rating: 4.8,
        numReviews: 24,
        featured: true,
        sku: 'SKU-EL-9082',
        specifications: {
          'Battery Life': '40 Hours ANC On',
          'Bluetooth': '5.3 Multipoint',
          'Charging': 'USB-C Fast Charge (10 min = 5 hrs)',
          'Weight': '250g'
        },
        reviews: [
          {
            id: 'rev_01',
            userId: 'usr_cust_01',
            userName: 'Jordan Lee',
            userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
            rating: 5,
            comment: 'Incredible soundstage and the noise cancellation blocks out coffee shop chatter completely. Worth every penny!',
            createdAt: '2026-02-05T12:00:00.000Z'
          },
          {
            id: 'rev_02',
            userId: 'usr_cust_02',
            userName: 'Elena Rostova',
            userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
            rating: 5,
            comment: 'Super comfortable even when wearing glasses for 8-hour work days.',
            createdAt: '2026-02-18T16:20:00.000Z'
          }
        ],
        createdAt: '2026-01-15T08:00:00.000Z',
        updatedAt: '2026-01-15T08:00:00.000Z'
      },
      {
        id: 'prod_elec_02',
        name: 'Vantage Smart Sports Watch Series 4',
        description: 'Ultra-bright AMOLED display, sapphire crystal glass, continuous optical heart-rate & SpO2 tracking, dual-band GPS, and 14-day battery endurance.',
        price: 189.00,
        discountPrice: 159.00,
        category: 'Electronics',
        brand: 'VantageTech',
        images: [
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80'
        ],
        stock: 22,
        rating: 4.7,
        numReviews: 18,
        featured: true,
        sku: 'SKU-EL-3341',
        specifications: {
          'Water Resistance': '50M (5 ATM)',
          'Display': '1.43" AMOLED 466x466',
          'Sensors': 'ECG, PPG, SpO2, Barometer',
          'Battery': '14 days typical'
        },
        reviews: [
          {
            id: 'rev_03',
            userId: 'usr_cust_01',
            userName: 'Jordan Lee',
            rating: 4,
            comment: 'Accurate GPS tracking on trail runs and battery lasts easily over 10 days.',
            createdAt: '2026-02-10T14:10:00.000Z'
          }
        ],
        createdAt: '2026-01-18T10:00:00.000Z',
        updatedAt: '2026-01-18T10:00:00.000Z'
      },
      {
        id: 'prod_elec_03',
        name: 'Lumix Beam Mechanical 75% Keyboard',
        description: 'Hot-swappable mechanical switches, CNC machined anodized aluminum case, custom gasket mount acoustics, RGB per-key backlighting, and triple connectivity (BT/2.4G/Wired).',
        price: 139.99,
        discountPrice: 119.99,
        category: 'Electronics',
        brand: 'Lumix Keyboards',
        images: [
          'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop&q=80'
        ],
        stock: 45,
        rating: 4.9,
        numReviews: 32,
        featured: true,
        sku: 'SKU-EL-5590',
        specifications: {
          'Layout': '75% Compact (84 keys)',
          'Switches': 'Gateron Oil King Linear',
          'Case': 'CNC Anodized Aluminum',
          'Weight': '1.35 kg'
        },
        reviews: [],
        createdAt: '2026-01-20T11:00:00.000Z',
        updatedAt: '2026-01-20T11:00:00.000Z'
      },
      {
        id: 'prod_fash_01',
        name: 'Merino Wool Minimalist Knit Sweater',
        description: 'Crafted from 100% extrafine Australian Merino wool. Ultra-soft, naturally temperature-regulating, moisture-wicking, and designed with a relaxed modern silhouette.',
        price: 110.00,
        discountPrice: 89.00,
        category: 'Fashion',
        brand: 'Nordic Atelier',
        images: [
          'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop&q=80'
        ],
        stock: 19,
        rating: 4.6,
        numReviews: 15,
        featured: true,
        sku: 'SKU-FA-8812',
        specifications: {
          'Material': '100% Extra-fine Merino Wool (19.5 micron)',
          'Care': 'Hand wash or dry clean',
          'Fit': 'Modern Relaxed Fit',
          'Origin': 'Ethically sourced in Melbourne'
        },
        reviews: [],
        createdAt: '2026-01-22T13:00:00.000Z',
        updatedAt: '2026-01-22T13:00:00.000Z'
      },
      {
        id: 'prod_fash_02',
        name: 'Heritage Full-Grain Leather Weekender Bag',
        description: 'Handcrafted from vegetable-tanned full-grain Italian leather. Includes a dedicated padded laptop sleeve, separate ventilated shoe compartment, and solid brass hardware.',
        price: 285.00,
        discountPrice: 245.00,
        category: 'Fashion',
        brand: 'Vanguard Leatherworks',
        images: [
          'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80'
        ],
        stock: 12,
        rating: 4.9,
        numReviews: 29,
        featured: true,
        sku: 'SKU-FA-1094',
        specifications: {
          'Dimensions': '52cm x 30cm x 26cm (Carry-on compliant)',
          'Capacity': '42 Liters',
          'Hardware': 'Antiqued Solid Brass YKK Zippers',
          'Warranty': 'Lifetime Craftsmanship'
        },
        reviews: [],
        createdAt: '2026-01-25T09:00:00.000Z',
        updatedAt: '2026-01-25T09:00:00.000Z'
      },
      {
        id: 'prod_home_01',
        name: 'AromaPulse Ultrasonic Ceramic Diffuser',
        description: 'Sculpted matte ceramic shell with ambient soft warm LED light. Disperses ultra-fine aromatherapy mist up to 500 sq ft with whisper-quiet 20dB operation.',
        price: 68.00,
        discountPrice: 54.00,
        category: 'Home',
        brand: 'SereneLiving',
        images: [
          'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1512290900672-1a6c1e3eb8c6?w=800&auto=format&fit=crop&q=80'
        ],
        stock: 50,
        rating: 4.7,
        numReviews: 41,
        featured: false,
        sku: 'SKU-HO-2290',
        specifications: {
          'Capacity': '300ml Water Tank (10 Hours Continuous)',
          'Auto Shut-off': 'Yes, when empty',
          'Coverage': 'Up to 500 sq. ft.',
          'Lighting': 'Warm 2700K Glow (Dimmable)'
        },
        reviews: [],
        createdAt: '2026-02-01T15:00:00.000Z',
        updatedAt: '2026-02-01T15:00:00.000Z'
      },
      {
        id: 'prod_home_02',
        name: 'Artisan Hand-Poured Soy Wax Candle Duo',
        description: 'Non-toxic, soot-free 100% natural soy wax infused with pure cedarwood, amber resin, and crisp bergamot essential oils. Dual lead-free cotton wicks.',
        price: 42.00,
        discountPrice: 34.00,
        category: 'Home',
        brand: 'Botanica Elements',
        images: [
          'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&auto=format&fit=crop&q=80'
        ],
        stock: 64,
        rating: 4.8,
        numReviews: 19,
        featured: false,
        sku: 'SKU-HO-4411',
        specifications: {
          'Burn Time': '65 Hours per candle',
          'Wax Type': '100% Organic USA Soy',
          'Scents': 'Cedarwood & Bergamot + Smoked Vanilla',
          'Weight': '2 x 8.5 oz (240g)'
        },
        reviews: [],
        createdAt: '2026-02-03T11:00:00.000Z',
        updatedAt: '2026-02-03T11:00:00.000Z'
      },
      {
        id: 'prod_beau_01',
        name: 'Botanical Hydrating Peptide Face Serum',
        description: 'Concentrated clinical formula containing 2% multi-molecular hyaluronic acid, copper tripeptides, niacinamide, and wild rosehip oil to restore barrier resilience.',
        price: 58.00,
        discountPrice: 48.00,
        category: 'Beauty',
        brand: 'Aura Dermaceuticals',
        images: [
          'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1608248597359-251f4961dbb0?w=800&auto=format&fit=crop&q=80'
        ],
        stock: 35,
        rating: 4.9,
        numReviews: 53,
        featured: true,
        sku: 'SKU-BE-1920',
        specifications: {
          'Volume': '50 ml / 1.7 fl. oz.',
          'Skin Type': 'All skin types, sensitive safe',
          'Certifications': 'Cruelty-Free, Vegan, Paraben-Free',
          'Application': '2-3 drops morning and evening'
        },
        reviews: [],
        createdAt: '2026-02-05T10:00:00.000Z',
        updatedAt: '2026-02-05T10:00:00.000Z'
      },
      {
        id: 'prod_acc_01',
        name: 'Aviator polarized Titanium Sunglasses',
        description: 'Ultra-lightweight Japanese aerospace grade titanium frames with Zeiss anti-reflective UV400 polarized emerald tint lenses. Zero distortion clarity.',
        price: 165.00,
        discountPrice: 135.00,
        category: 'Accessories',
        brand: 'Oculus Optics',
        images: [
          'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80'
        ],
        stock: 28,
        rating: 4.8,
        numReviews: 22,
        featured: true,
        sku: 'SKU-AC-7789',
        specifications: {
          'Frame': '100% Aerospace Titanium (18g)',
          'Lens': 'Zeiss Polarized Category 3 (UV400)',
          'Includes': 'Hard leather case + microfiber cloth',
          'Fit': 'Medium to Wide'
        },
        reviews: [],
        createdAt: '2026-02-08T09:00:00.000Z',
        updatedAt: '2026-02-08T09:00:00.000Z'
      },
      {
        id: 'prod_acc_02',
        name: 'RFID-Shielded Slim Bifold Cardholder',
        description: 'Precision-stitched Horween Dublin leather wallet. Holds 8-10 cards plus folded bills with military-grade RFID signal blocking protection.',
        price: 49.00,
        discountPrice: 39.00,
        category: 'Accessories',
        brand: 'Vanguard Leatherworks',
        images: [
          'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?w=800&auto=format&fit=crop&q=80'
        ],
        stock: 75,
        rating: 4.7,
        numReviews: 38,
        featured: false,
        sku: 'SKU-AC-3301',
        specifications: {
          'Dimensions': '10.5cm x 7.5cm x 0.8cm',
          'Card Capacity': '8-10 Cards + Cash Slot',
          'RFID Frequency': '13.56 MHz Shielding',
          'Leather': 'Vegetable Tanned Full Grain'
        },
        reviews: [],
        createdAt: '2026-02-10T14:00:00.000Z',
        updatedAt: '2026-02-10T14:00:00.000Z'
      },
      {
        id: 'prod_home_03',
        name: 'Matte Black Precision Gooseneck Electric Kettle',
        description: 'Variable temperature control down to 1 degree, 60-minute keep-warm mode, built-in brew stopwatch, and ergonomic counterbalanced handle for barista pours.',
        price: 129.00,
        discountPrice: 109.00,
        category: 'Home',
        brand: 'BrewMaster Craft',
        images: [
          'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&auto=format&fit=crop&q=80'
        ],
        stock: 20,
        rating: 4.9,
        numReviews: 47,
        featured: false,
        sku: 'SKU-HO-9901',
        specifications: {
          'Capacity': '0.9 Liter (30 oz)',
          'Power': '1200W Rapid Boil Element',
          'Temp Range': '135°F - 212°F (57°C - 100°C)',
          'Base': 'OLED digital display screen'
        },
        reviews: [],
        createdAt: '2026-02-12T16:00:00.000Z',
        updatedAt: '2026-02-12T16:00:00.000Z'
      },
      {
        id: 'prod_fash_03',
        name: 'Waterproof All-Weather Commuter Jacket',
        description: '3-layer microporous breathable membrane with 20,000mm waterproof rating. Taped seams, storm hood with cinch cord, and magnetic storm flap.',
        price: 195.00,
        discountPrice: 165.00,
        category: 'Fashion',
        brand: 'Nordic Atelier',
        images: [
          'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80'
        ],
        stock: 16,
        rating: 4.8,
        numReviews: 12,
        featured: false,
        sku: 'SKU-FA-6644',
        specifications: {
          'Waterproof Rating': '20,000 mm Hydrostatic Head',
          'Breathability': '15,000 g/m²/24h',
          'Zippers': 'YKK AquaGuard Waterproof',
          'Pockets': '4 external zippered + 1 internal media'
        },
        reviews: [],
        createdAt: '2026-02-14T11:00:00.000Z',
        updatedAt: '2026-02-14T11:00:00.000Z'
      }
    ];

    // Seeded Sample Orders
    this.orders = [
      {
        id: 'ord_1001',
        userId: 'usr_cust_01',
        customerName: 'Jordan Lee',
        customerEmail: 'customer@shopstack.com',
        items: [
          {
            productId: 'prod_elec_01',
            name: 'AcousticPro Wireless Noise-Cancelling Headphones',
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
            price: 199.99,
            quantity: 1
          },
          {
            id: 'ord_item_02',
            productId: 'prod_acc_02',
            name: 'RFID-Shielded Slim Bifold Cardholder',
            image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80',
            price: 39.00,
            quantity: 1
          }
        ],
        shippingAddress: {
          fullName: 'Jordan Lee',
          email: 'customer@shopstack.com',
          phone: '+1 (555) 438-9201',
          street: '124 Market Street, Apt 4B',
          city: 'Seattle',
          state: 'WA',
          postalCode: '98101',
          country: 'United States'
        },
        subtotal: 238.99,
        shipping: 0,
        discount: 0,
        total: 238.99,
        paymentMethod: 'Credit Card (•••• 4242)',
        paymentStatus: 'paid',
        orderStatus: 'delivered',
        trackingNumber: 'TRK-98327104US',
        createdAt: '2026-02-04T10:15:00.000Z',
        updatedAt: '2026-02-07T14:30:00.000Z'
      },
      {
        id: 'ord_1002',
        userId: 'usr_cust_01',
        customerName: 'Jordan Lee',
        customerEmail: 'customer@shopstack.com',
        items: [
          {
            productId: 'prod_elec_02',
            name: 'Vantage Smart Sports Watch Series 4',
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
            price: 159.00,
            quantity: 1
          }
        ],
        shippingAddress: {
          fullName: 'Jordan Lee',
          email: 'customer@shopstack.com',
          phone: '+1 (555) 438-9201',
          street: '124 Market Street, Apt 4B',
          city: 'Seattle',
          state: 'WA',
          postalCode: '98101',
          country: 'United States'
        },
        subtotal: 159.00,
        shipping: 0,
        discount: 15.90,
        total: 143.10,
        paymentMethod: 'Credit Card (•••• 4242)',
        paymentStatus: 'paid',
        orderStatus: 'shipped',
        trackingNumber: 'TRK-88192301US',
        createdAt: '2026-02-12T16:45:00.000Z',
        updatedAt: '2026-02-13T09:20:00.000Z'
      },
      {
        id: 'ord_1003',
        userId: 'usr_cust_02',
        customerName: 'Elena Rostova',
        customerEmail: 'elena@example.com',
        items: [
          {
            productId: 'prod_fash_02',
            name: 'Heritage Full-Grain Leather Weekender Bag',
            image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
            price: 245.00,
            quantity: 1
          }
        ],
        shippingAddress: {
          fullName: 'Elena Rostova',
          email: 'elena@example.com',
          phone: '+1 (555) 839-1120',
          street: '55 Pine Avenue',
          city: 'Austin',
          state: 'TX',
          postalCode: '78701',
          country: 'United States'
        },
        subtotal: 245.00,
        shipping: 0,
        discount: 0,
        total: 245.00,
        paymentMethod: 'Credit Card (•••• 8821)',
        paymentStatus: 'paid',
        orderStatus: 'processing',
        trackingNumber: 'TRK-77401923US',
        createdAt: '2026-02-16T11:20:00.000Z',
        updatedAt: '2026-02-16T11:20:00.000Z'
      }
    ];
  }

  // User Operations
  findUserByEmail(email: string): UserDoc | undefined {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id: string): UserDoc | undefined {
    return this.users.find(u => u.id === id);
  }

  createUser(userData: Omit<UserDoc, 'id' | 'createdAt' | 'updatedAt'>): UserDoc {
    const id = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();
    const newUser: UserDoc = {
      ...userData,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.users.push(newUser);
    return newUser;
  }

  updateUser(id: string, updates: Partial<UserDoc>): UserDoc | null {
    const idx = this.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    this.users[idx] = {
      ...this.users[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return this.users[idx];
  }

  getAllUsers(): UserDoc[] {
    return this.users;
  }

  // Product Operations
  getAllProducts(): ProductDoc[] {
    return this.products;
  }

  findProductById(id: string): ProductDoc | undefined {
    return this.products.find(p => p.id === id);
  }

  createProduct(productData: Omit<ProductDoc, 'id' | 'createdAt' | 'updatedAt' | 'reviews' | 'rating' | 'numReviews'>): ProductDoc {
    const id = `prod_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();
    const newProduct: ProductDoc = {
      ...productData,
      id,
      rating: 5.0,
      numReviews: 0,
      reviews: [],
      createdAt: now,
      updatedAt: now
    };
    this.products.unshift(newProduct);
    return newProduct;
  }

  updateProduct(id: string, updates: Partial<ProductDoc>): ProductDoc | null {
    const idx = this.products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.products[idx] = {
      ...this.products[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return this.products[idx];
  }

  deleteProduct(id: string): boolean {
    const idx = this.products.findIndex(p => p.id === id);
    if (idx === -1) return false;
    this.products.splice(idx, 1);
    return true;
  }

  addReviewToProduct(productId: string, review: Omit<ProductReview, 'id' | 'createdAt'>): ProductReview | null {
    const product = this.findProductById(productId);
    if (!product) return null;
    const reviewId = `rev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newRev: ProductReview = {
      ...review,
      id: reviewId,
      createdAt: new Date().toISOString()
    };
    product.reviews.unshift(newRev);
    product.numReviews = product.reviews.length;
    const sum = product.reviews.reduce((acc, r) => acc + r.rating, 0);
    product.rating = Number((sum / product.reviews.length).toFixed(1));
    product.updatedAt = new Date().toISOString();
    return newRev;
  }

  // Order Operations
  getAllOrders(): OrderDoc[] {
    return this.orders;
  }

  findOrderById(id: string): OrderDoc | undefined {
    return this.orders.find(o => o.id === id);
  }

  findOrdersByUserId(userId: string): OrderDoc[] {
    return this.orders.filter(o => o.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  createOrder(orderData: Omit<OrderDoc, 'id' | 'createdAt' | 'updatedAt'>): OrderDoc {
    const id = `ord_${1000 + this.orders.length + 1}`;
    const now = new Date().toISOString();
    const newOrder: OrderDoc = {
      ...orderData,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.orders.unshift(newOrder);

    // Update stock levels
    for (const item of newOrder.items) {
      const prod = this.findProductById(item.productId);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.quantity);
      }
    }

    return newOrder;
  }

  updateOrderStatus(orderId: string, orderStatus: OrderDoc['orderStatus'], paymentStatus?: OrderDoc['paymentStatus']): OrderDoc | null {
    const order = this.findOrderById(orderId);
    if (!order) return null;
    order.orderStatus = orderStatus;
    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }
    order.updatedAt = new Date().toISOString();
    return order;
  }
}

export const store = new InMemoryStore();
