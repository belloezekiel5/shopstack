import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface IShippingAddress {
  fullName: string;
  email: string;
  phone?: string;
  street: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  userId?: string;
  customerEmail: string;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  orderStatus: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded';
  paymentMethod: string;
  trackingNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String, default: '' }
});

const ShippingAddressSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, default: '' },
  postalCode: { type: String, default: '' },
  country: { type: String, default: 'United States' }
});

const OrderSchema: Schema = new Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true
    },
    userId: {
      type: String,
      default: null
    },
    customerEmail: {
      type: String,
      required: true
    },
    items: {
      type: [OrderItemSchema],
      required: true
    },
    shippingAddress: {
      type: ShippingAddressSchema,
      required: true
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0
    },
    shipping: {
      type: Number,
      required: true,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: true,
      min: 0
    },
    orderStatus: {
      type: String,
      enum: ['processing', 'shipped', 'delivered', 'cancelled'],
      default: 'processing'
    },
    paymentStatus: {
      type: String,
      enum: ['paid', 'pending', 'failed', 'refunded'],
      default: 'paid'
    },
    paymentMethod: {
      type: String,
      default: 'Credit Card'
    },
    trackingNumber: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

export const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
