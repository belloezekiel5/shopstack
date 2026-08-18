import { store } from './data/store.js';
import { isMongoConnected } from './db.js';
import { UserModel } from './models/User.js';
import { ProductModel } from './models/Product.js';
import { OrderModel } from './models/Order.js';
import { UserDoc, ProductDoc, OrderDoc, ProductReview } from './data/types.js';

// Sync initial seed data to MongoDB if connected and empty
export async function seedMongoIfEmpty() {
  if (!isMongoConnected()) return;

  try {
    const productCount = await (ProductModel as any).countDocuments();
    if (productCount === 0) {
      console.log('[Database] Seeding initial products to MongoDB...');
      const initialProducts = store.getAllProducts();
      await (ProductModel as any).insertMany(initialProducts);
      console.log(`[Database] Seeded ${initialProducts.length} products to MongoDB.`);
    }

    const userCount = await (UserModel as any).countDocuments();
    if (userCount === 0) {
      console.log('[Database] Seeding initial users to MongoDB...');
      const initialUsers = store.getAllUsers();
      await (UserModel as any).insertMany(initialUsers);
      console.log(`[Database] Seeded ${initialUsers.length} users to MongoDB.`);
    }

    const orderCount = await (OrderModel as any).countDocuments();
    if (orderCount === 0) {
      console.log('[Database] Seeding initial orders to MongoDB...');
      const initialOrders = store.getAllOrders();
      await (OrderModel as any).insertMany(initialOrders);
      console.log(`[Database] Seeded ${initialOrders.length} orders to MongoDB.`);
    }
  } catch (error) {
    console.error('[Database] Error while checking/seeding MongoDB:', error);
  }
}

// Data repository that routes to MongoDB when connected, or falls back to store
export const dbRepository = {
  // USER REPOSITORY
  async findUserByEmail(email: string): Promise<UserDoc | undefined> {
    if (isMongoConnected()) {
      try {
        const user = await (UserModel as any).findOne({ email: email.toLowerCase() }).lean().exec();
        if (user) return user as unknown as UserDoc;
      } catch (err) {
        console.error('[DB] findUserByEmail fallback:', err);
      }
    }
    return store.findUserByEmail(email);
  },

  async findUserById(id: string): Promise<UserDoc | undefined> {
    if (isMongoConnected()) {
      try {
        const user = await (UserModel as any).findOne({ id }).lean().exec();
        if (user) return user as unknown as UserDoc;
      } catch (err) {
        console.error('[DB] findUserById fallback:', err);
      }
    }
    return store.findUserById(id);
  },

  async createUser(userData: Omit<UserDoc, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserDoc> {
    const localUser = store.createUser(userData);
    if (isMongoConnected()) {
      try {
        await (UserModel as any).create(localUser);
      } catch (err) {
        console.error('[DB] createUser error in Mongo:', err);
      }
    }
    return localUser;
  },

  async updateUser(id: string, updates: Partial<UserDoc>): Promise<UserDoc | null> {
    const localUpdated = store.updateUser(id, updates);
    if (isMongoConnected()) {
      try {
        const mongoUpdated = await (UserModel as any).findOneAndUpdate({ id }, { $set: updates }, { new: true }).lean().exec();
        if (mongoUpdated) return mongoUpdated as unknown as UserDoc;
      } catch (err) {
        console.error('[DB] updateUser error in Mongo:', err);
      }
    }
    return localUpdated;
  },

  async getAllUsers(): Promise<UserDoc[]> {
    if (isMongoConnected()) {
      try {
        const users = await (UserModel as any).find().lean().exec();
        if (users && users.length > 0) return users as unknown as UserDoc[];
      } catch (err) {
        console.error('[DB] getAllUsers fallback:', err);
      }
    }
    return store.getAllUsers();
  },

  // PRODUCT REPOSITORY
  async getAllProducts(): Promise<ProductDoc[]> {
    if (isMongoConnected()) {
      try {
        const prods = await (ProductModel as any).find().lean().exec();
        if (prods && prods.length > 0) return prods as unknown as ProductDoc[];
      } catch (err) {
        console.error('[DB] getAllProducts fallback:', err);
      }
    }
    return store.getAllProducts();
  },

  async findProductById(id: string): Promise<ProductDoc | undefined> {
    if (isMongoConnected()) {
      try {
        const prod = await (ProductModel as any).findOne({ id }).lean().exec();
        if (prod) return prod as unknown as ProductDoc;
      } catch (err) {
        console.error('[DB] findProductById fallback:', err);
      }
    }
    return store.findProductById(id);
  },

  async createProduct(productData: Omit<ProductDoc, 'id' | 'createdAt' | 'updatedAt' | 'reviews' | 'rating' | 'numReviews'>): Promise<ProductDoc> {
    const localProd = store.createProduct(productData);
    if (isMongoConnected()) {
      try {
        await (ProductModel as any).create(localProd);
      } catch (err) {
        console.error('[DB] createProduct error in Mongo:', err);
      }
    }
    return localProd;
  },

  async updateProduct(id: string, updates: Partial<ProductDoc>): Promise<ProductDoc | null> {
    const localUpdated = store.updateProduct(id, updates);
    if (isMongoConnected()) {
      try {
        const mongoUpdated = await (ProductModel as any).findOneAndUpdate({ id }, { $set: updates }, { new: true }).lean().exec();
        if (mongoUpdated) return mongoUpdated as unknown as ProductDoc;
      } catch (err) {
        console.error('[DB] updateProduct error in Mongo:', err);
      }
    }
    return localUpdated;
  },

  async deleteProduct(id: string): Promise<boolean> {
    const localDeleted = store.deleteProduct(id);
    if (isMongoConnected()) {
      try {
        await (ProductModel as any).deleteOne({ id }).exec();
      } catch (err) {
        console.error('[DB] deleteProduct error in Mongo:', err);
      }
    }
    return localDeleted;
  },

  async addReviewToProduct(productId: string, review: Omit<ProductReview, 'id' | 'createdAt'>): Promise<ProductReview | null> {
    const localRev = store.addReviewToProduct(productId, review);
    if (isMongoConnected() && localRev) {
      try {
        const prod = await (ProductModel as any).findOne({ id: productId }).exec();
        if (prod) {
          prod.reviews.unshift(localRev);
          prod.numReviews = prod.reviews.length;
          const sum = prod.reviews.reduce((acc: number, r: any) => acc + r.rating, 0);
          prod.rating = Number((sum / prod.reviews.length).toFixed(1));
          await prod.save();
        }
      } catch (err) {
        console.error('[DB] addReviewToProduct error in Mongo:', err);
      }
    }
    return localRev;
  },

  // ORDER REPOSITORY
  async getAllOrders(): Promise<OrderDoc[]> {
    if (isMongoConnected()) {
      try {
        const orders = await (OrderModel as any).find().sort({ createdAt: -1 }).lean().exec();
        if (orders && orders.length > 0) return orders as unknown as OrderDoc[];
      } catch (err) {
        console.error('[DB] getAllOrders fallback:', err);
      }
    }
    return store.getAllOrders();
  },

  async findOrderById(id: string): Promise<OrderDoc | undefined> {
    if (isMongoConnected()) {
      try {
        const order = await (OrderModel as any).findOne({ id }).lean().exec();
        if (order) return order as unknown as OrderDoc;
      } catch (err) {
        console.error('[DB] findOrderById fallback:', err);
      }
    }
    return store.findOrderById(id);
  },

  async findOrdersByUserId(userId: string): Promise<OrderDoc[]> {
    if (isMongoConnected()) {
      try {
        const orders = await (OrderModel as any).find({ userId }).sort({ createdAt: -1 }).lean().exec();
        if (orders) return orders as unknown as OrderDoc[];
      } catch (err) {
        console.error('[DB] findOrdersByUserId fallback:', err);
      }
    }
    return store.findOrdersByUserId(userId);
  },

  async createOrder(orderData: Omit<OrderDoc, 'id' | 'createdAt' | 'updatedAt'>): Promise<OrderDoc> {
    const localOrder = store.createOrder(orderData);
    if (isMongoConnected()) {
      try {
        await (OrderModel as any).create(localOrder);
        // Decrease stock in MongoDB as well
        for (const item of localOrder.items) {
          await (ProductModel as any).updateOne(
            { id: item.productId },
            { $inc: { stock: -item.quantity } }
          ).exec();
        }
      } catch (err) {
        console.error('[DB] createOrder error in Mongo:', err);
      }
    }
    return localOrder;
  },

  async updateOrderStatus(orderId: string, orderStatus: OrderDoc['orderStatus'], paymentStatus?: OrderDoc['paymentStatus']): Promise<OrderDoc | null> {
    const localUpdated = store.updateOrderStatus(orderId, orderStatus, paymentStatus);
    if (isMongoConnected()) {
      try {
        const updates: any = { orderStatus };
        if (paymentStatus) updates.paymentStatus = paymentStatus;
        const mongoUpdated = await (OrderModel as any).findOneAndUpdate({ id: orderId }, { $set: updates }, { new: true }).lean().exec();
        if (mongoUpdated) return mongoUpdated as unknown as OrderDoc;
      } catch (err) {
        console.error('[DB] updateOrderStatus error in Mongo:', err);
      }
    }
    return localUpdated;
  }
};
