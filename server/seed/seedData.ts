import { ProductModel } from '../models/Product.js';

export const INITIAL_PRODUCTS = [
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
    numReviews: 2,
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
        userId: 'usr_sample_01',
        userName: 'Audio Enthusiast',
        userAvatar: '',
        rating: 5,
        comment: 'Incredible soundstage and the noise cancellation blocks out coffee shop chatter completely.',
        createdAt: '2026-02-05T12:00:00.000Z'
      },
      {
        id: 'rev_02',
        userId: 'usr_sample_02',
        userName: 'Studio Pro',
        userAvatar: '',
        rating: 5,
        comment: 'Super comfortable even when wearing glasses for 8-hour work days.',
        createdAt: '2026-02-18T16:20:00.000Z'
      }
    ]
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
    numReviews: 1,
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
        userId: 'usr_sample_01',
        userName: 'Trail Runner',
        userAvatar: '',
        rating: 5,
        comment: 'Accurate GPS tracking on trail runs and battery lasts easily over 10 days.',
        createdAt: '2026-02-10T14:10:00.000Z'
      }
    ]
  },
  {
    id: 'prod_elec_03',
    name: 'Lumix Beam Mechanical 75% Keyboard',
    description: 'Hot-swappable mechanical switches, CNC machined anodized aluminum case, custom gasket mount acoustics, RGB per-key backlighting, and triple connectivity.',
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
    numReviews: 0,
    featured: true,
    sku: 'SKU-EL-5590',
    specifications: {
      'Layout': '75% Compact (84 keys)',
      'Switches': 'Gateron Oil King Linear',
      'Case': 'CNC Anodized Aluminum'
    },
    reviews: []
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
    numReviews: 0,
    featured: true,
    sku: 'SKU-FA-8812',
    specifications: {
      'Material': '100% Extra-fine Merino Wool',
      'Fit': 'Modern Relaxed Fit'
    },
    reviews: []
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
    numReviews: 0,
    featured: true,
    sku: 'SKU-FA-1094',
    specifications: {
      'Capacity': '42 Liters',
      'Material': 'Vegetable Tanned Leather'
    },
    reviews: []
  },
  {
    id: 'prod_home_01',
    name: 'AromaPulse Ultrasonic Ceramic Diffuser',
    description: 'Sculpted matte ceramic shell with ambient soft warm LED light. Disperses ultra-fine aromatherapy mist up to 500 sq ft with whisper-quiet operation.',
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
    numReviews: 0,
    featured: false,
    sku: 'SKU-HO-2290',
    specifications: {
      'Capacity': '300ml Water Tank',
      'Coverage': 'Up to 500 sq. ft.'
    },
    reviews: []
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
    numReviews: 0,
    featured: false,
    sku: 'SKU-HO-4411',
    specifications: {
      'Burn Time': '65 Hours per candle',
      'Wax': '100% Natural Soy'
    },
    reviews: []
  },
  {
    id: 'prod_beau_01',
    name: 'Botanical Hydrating Peptide Face Serum',
    description: 'Concentrated clinical formula containing multi-molecular hyaluronic acid, copper tripeptides, niacinamide, and wild rosehip oil to restore skin barrier resilience.',
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
    numReviews: 0,
    featured: true,
    sku: 'SKU-BE-1920',
    specifications: {
      'Volume': '50 ml / 1.7 fl. oz.',
      'Type': 'Cruelty-Free, Vegan'
    },
    reviews: []
  },
  {
    id: 'prod_acc_01',
    name: 'Aviator Polarized Titanium Sunglasses',
    description: 'Ultra-lightweight Japanese aerospace grade titanium frames with Zeiss anti-reflective UV400 polarized emerald tint lenses. Zero distortion optical clarity.',
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
    numReviews: 0,
    featured: true,
    sku: 'SKU-AC-7789',
    specifications: {
      'Frame': '100% Aerospace Titanium',
      'Protection': 'UV400 Polarized'
    },
    reviews: []
  }
];

import { UserModel } from '../models/User.js';
import bcrypt from 'bcryptjs';

export async function seedMongoIfEmpty(): Promise<void> {
  try {
    // 1. Check existing products and backfill missing 'id' fields
    const existingProducts = await ProductModel.find({});
    for (const p of existingProducts) {
      if (!p.id && (p as any)._id) {
        p.id = (p as any)._id.toString();
        await p.save();
      }
    }

    // 2. Ensure initial catalog products exist
    if (existingProducts.length === 0) {
      console.log('[MongoDB Seed] No products found. Seeding initial catalog to MongoDB...');
      await ProductModel.insertMany(INITIAL_PRODUCTS);
      console.log(`[MongoDB Seed] Successfully seeded ${INITIAL_PRODUCTS.length} products to MongoDB.`);
    } else {
      // Upsert any missing initial products so catalog has full category breadth
      for (const initial of INITIAL_PRODUCTS) {
        const found = await ProductModel.findOne({
          $or: [
            { id: initial.id },
            { name: initial.name }
          ]
        });
        if (!found) {
          await ProductModel.create(initial);
          console.log(`[MongoDB Seed] Added missing catalog item: ${initial.name}`);
        }
      }
    }

    // 3. Ensure test admin and customer users exist in MongoDB
    const adminEmail = 'admin@shopstack.com';
    const adminUser = await UserModel.findOne({ email: adminEmail });
    if (!adminUser) {
      const hashedAdminPassword = await bcrypt.hash('admin123', 10);
      await UserModel.create({
        id: 'usr_admin_01',
        name: 'ShopStack Admin',
        email: adminEmail,
        password: hashedAdminPassword,
        role: 'admin',
        isActive: true,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        cart: [],
        wishlist: []
      });
      console.log('[MongoDB Seed] Created default admin account in MongoDB.');
    }

    const customerEmail = 'customer@shopstack.com';
    const customerUser = await UserModel.findOne({ email: customerEmail });
    if (!customerUser) {
      const hashedCustPassword = await bcrypt.hash('customer123', 10);
      await UserModel.create({
        id: 'usr_cust_01',
        name: 'Jordan Lee',
        email: customerEmail,
        password: hashedCustPassword,
        role: 'customer',
        isActive: true,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        cart: [],
        wishlist: []
      });
      console.log('[MongoDB Seed] Created default customer account in MongoDB.');
    }
  } catch (err) {
    console.error('[MongoDB Seed] Error during database synchronization/seeding:', err);
  }
}
