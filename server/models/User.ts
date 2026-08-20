import mongoose, { Schema, Document } from 'mongoose';
import { UserRole } from '../data/types.js';

export interface IUserCartItem {
  id: string; // product id
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock?: number;
  category?: string;
}

export interface IUserWishlistItem {
  productId: string;
}

export interface IUser extends Document {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  avatar?: string;
  cart: IUserCartItem[];
  wishlist: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserCartItemSchema = new Schema<IUserCartItem>(
  {
    id: { type: String, required: true },
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, default: '' },
    quantity: { type: Number, required: true, default: 1, min: 1 },
    stock: { type: Number },
    category: { type: String },
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    phone: { type: String, default: '' },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      postalCode: { type: String, default: '' },
      country: { type: String, default: 'United States' },
    },
    avatar: { type: String, default: '' },
    cart: { type: [UserCartItemSchema], default: [] },
    wishlist: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const UserModel =
  (mongoose.models.User as mongoose.Model<IUser>) ||
  mongoose.model<IUser>('User', UserSchema);
