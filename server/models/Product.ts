import mongoose, { Schema, Document } from 'mongoose';

export interface IProductReview {
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
  reviews: IProductReview[];
  featured: boolean;
  sku?: string;
  specifications?: Map<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

const ProductReviewSchema = new Schema<IProductReview>(
  {
    id: { type: String, required: true },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    userAvatar: { type: String, default: '' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    createdAt: { type: String, required: true },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    id: {
      type: String,
      default: function () {
        return (this as any)._id ? (this as any)._id.toString() : `prod_${Date.now()}`;
      },
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    discountPrice: {
      type: Number,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    brand: {
      type: String,
      required: true,
      trim: true,
    },

    images: {
      type: [String],
      required: true,
      default: [],
    },

    stock: {
      type: Number,
      required: true,
      default: 0,
    },

    rating: {
      type: Number,
      default: 5,
    },

    numReviews: {
      type: Number,
      default: 0,
    },

    reviews: {
      type: [ProductReviewSchema],
      default: [],
    },

    featured: {
      type: Boolean,
      default: false,
    },

    sku: {
      type: String,
      unique: true,
      sparse: true,
    },

    specifications: {
      type: Map,
      of: String,
      default: {},
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (_doc, ret: any) {
        ret.id = ret.id || (ret._id ? ret._id.toString() : '');
        return ret;
      },
    },
    toObject: {
      transform: function (_doc, ret: any) {
        ret.id = ret.id || (ret._id ? ret._id.toString() : '');
        return ret;
      },
    },
  }
);

export const ProductModel =
  (mongoose.models.Product as mongoose.Model<IProduct>) ||
  mongoose.model<IProduct>('Product', ProductSchema);