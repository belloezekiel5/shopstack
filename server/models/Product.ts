import mongoose, { Schema, Document } from 'mongoose';

export interface IReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface IProduct extends Document {
  name: string;
  brand: string;
  category: string;
  price: number;
  discountPrice?: number;
  stock: number;
  description: string;
  images: string[];
  rating: number;
  reviews: IReview[];
  specifications?: Record<string, string>;
  sku?: string;
  featured?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema({
  id: { type: String, required: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userAvatar: { type: String, default: '' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const ProductSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    brand: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    discountPrice: {
      type: Number,
      min: 0
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    description: {
      type: String,
      default: ''
    },
    images: {
      type: [String],
      default: []
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 0,
      max: 5
    },
    reviews: {
      type: [ReviewSchema],
      default: []
    },
    specifications: {
      type: Map,
      of: String,
      default: {}
    },
    sku: {
      type: String,
      default: ''
    },
    featured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

export const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
