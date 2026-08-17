import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ChevronLeft,
  Truck,
  CheckCircle2,
  Package,
  Clock,
  MapPin,
  CreditCard,
  Receipt
} from 'lucide-react';
import { api } from '../services/api';
import { Order, OrderStatus } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { Button } from '../components/common/Button';

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadOrder() {
      if (!id) return;
      try {
        setIsLoading(true);
        const res = await api.getOrderById(id);
        setOrder(res.order);
      } catch (err) {
        console.error('Failed to load order:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadOrder();
  }, [id]);

  if (isLoading || !order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse space-y-6">
        <div className="h-6 w-32 bg-gray-100 rounded" />
        <div className="h-64 bg-white rounded-3xl border border-gray-100 p-8" />
      </div>
    );
  }

  const steps: OrderStatus[] = ['processing', 'shipped', 'delivered'];
  const currentStepIdx = steps.indexOf(order.orderStatus);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-10 py-6 sm:py-8 space-y-8">
      {/* Back link & Header */}
      <div>
        <Link
          to="/orders"
          className="text-xs font-semibold text-gray-500 hover:text-[#1A1A1A] inline-flex items-center gap-1 mb-2"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Back to all orders</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1A1A]">
              Order #{order.id}
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
              {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <StatusBadge status={order.orderStatus} type="order" />
            <StatusBadge status={order.paymentStatus} type="payment" />
          </div>
        </div>
      </div>

      {/* Visual Tracking Progress Step Bar */}
      {order.orderStatus !== 'cancelled' ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-6">
            Fulfillment Progress
          </h2>
          <div className="grid grid-cols-3 gap-2 relative">
            <div className="text-center space-y-2">
              <div
                className={`w-10 h-10 rounded-full mx-auto flex items-center justify-center font-bold text-xs transition-colors ${
                  currentStepIdx >= 0
                    ? 'bg-[#FAF92A] border border-[#FDBF2D] text-[#1A1A1A]'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                <Package className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-xs text-[#1A1A1A]">Processing</p>
                <p className="text-[10px] text-gray-400">Order confirmed</p>
              </div>
            </div>

            <div className="text-center space-y-2">
              <div
                className={`w-10 h-10 rounded-full mx-auto flex items-center justify-center font-bold text-xs transition-colors ${
                  currentStepIdx >= 1
                    ? 'bg-[#FAF92A] border border-[#FDBF2D] text-[#1A1A1A]'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-xs text-[#1A1A1A]">Shipped</p>
                <p className="text-[10px] text-gray-400">In transit with carrier</p>
              </div>
            </div>

            <div className="text-center space-y-2">
              <div
                className={`w-10 h-10 rounded-full mx-auto flex items-center justify-center font-bold text-xs transition-colors ${
                  currentStepIdx >= 2
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-xs text-[#1A1A1A]">Delivered</p>
                <p className="text-[10px] text-gray-400">Package arrived</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 text-rose-800 text-xs font-bold">
          This order has been cancelled and any charges have been refunded.
        </div>
      )}

      {/* Items List */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-[#1A1A1A]">Order Line Items</h2>
        <div className="divide-y divide-gray-100">
          {order.items.map((item, idx) => (
            <div key={idx} className="py-4 flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-14 h-14 rounded-xl object-cover bg-gray-50 border border-gray-100 shrink-0"
                />
                <div>
                  <Link
                    to={`/products/${item.productId}`}
                    className="font-bold text-sm text-[#1A1A1A] hover:text-amber-700 transition-colors"
                  >
                    {item.name}
                  </Link>
                  <p className="text-gray-400 text-[11px] mt-0.5">
                    Qty: {item.quantity} × ${item.price.toFixed(2)}
                  </p>
                </div>
              </div>
              <span className="font-bold text-sm text-[#1A1A1A]">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping Address & Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-3 text-xs">
          <h3 className="font-bold text-gray-400 uppercase tracking-wider text-[10px]">
            Shipping Address
          </h3>
          <div className="text-gray-700 leading-relaxed">
            <p className="font-bold text-[#1A1A1A] text-sm">{order.shippingAddress.fullName}</p>
            <p className="text-gray-500">{order.shippingAddress.email}</p>
            <p className="text-gray-500">{order.shippingAddress.phone || 'No phone provided'}</p>
            <p className="mt-2">{order.shippingAddress.street}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
            </p>
            <p>{order.shippingAddress.country}</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-3 text-xs">
          <h3 className="font-bold text-gray-400 uppercase tracking-wider text-[10px]">
            Payment & Breakdown
          </h3>
          <div className="space-y-2 text-gray-600">
            <div className="flex justify-between">
              <span>Payment Method</span>
              <span className="font-semibold text-[#1A1A1A]">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-[#1A1A1A]">${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-semibold text-[#1A1A1A]">
                {order.shipping === 0 ? 'FREE' : `$${order.shipping.toFixed(2)}`}
              </span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Discount</span>
                <span>-${order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="pt-2 border-t border-gray-100 flex justify-between font-bold text-sm text-[#1A1A1A]">
              <span>Total Amount</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
