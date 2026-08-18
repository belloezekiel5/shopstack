import mongoose, { Schema, Document } from 'mongoose';
import { OrderStatus, PaymentStatus, OrderItem, OrderShippingAddress } from '../data/types.js';

export interface IOrder extends Document {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  shippingAddress: OrderShippingAddress;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  trackingNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<OrderItem>(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const ShippingAddressSchema = new Schema<OrderShippingAddress>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, default: '' },
    postalCode: { type: String, default: '' },
    country: { type: String, default: 'United States' },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true, index: true },
    items: { type: [OrderItemSchema], required: true },
    shippingAddress: { type: ShippingAddressSchema, required: true },
    subtotal: { type: Number, required: true },
    shipping: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paymentMethod: { type: String, default: 'Credit Card' },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'paid',
    },
    orderStatus: {
      type: String,
      enum: ['processing', 'shipped', 'delivered', 'cancelled'],
      default: 'processing',
    },
    trackingNumber: { type: String },
  },
  {
    timestamps: true,
  }
);

export const OrderModel = (mongoose.models.Order as mongoose.Model<IOrder>) || mongoose.model<IOrder>('Order', OrderSchema);
