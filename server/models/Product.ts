import mongoose, { Schema, Document } from 'mongoose';

export interface IReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface IProduct extends Document {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  brand: string;
  images: string[];
  stock: number;
  rating: number;
  numReviews: number;
  featured: boolean;
  sku: string;
  specifications: Record<string, string>;
  reviews: IReview[];
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    id: { type: String, required: true },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    userAvatar: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    category: { type: String, required: true, index: true },
    brand: { type: String, required: true, index: true },
    images: { type: [String], default: [] },
    stock: { type: Number, required: true, default: 0, min: 0 },
    rating: { type: Number, default: 5.0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0 },
    featured: { type: Boolean, default: false, index: true },
    sku: { type: String, required: true, unique: true },
    specifications: { type: Map, of: String, default: {} },
    reviews: { type: [ReviewSchema], default: [] },
  },
  {
    timestamps: true,
  }
);

// Add text search index for name, description, brand, and category
ProductSchema.index({ name: 'text', description: 'text', brand: 'text', category: 'text' });

export const ProductModel = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
