import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, Truck, ArrowRight, ShoppingBag, Download } from 'lucide-react';
import { api } from '../services/api';
import { Order } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { Button } from '../components/common/Button';

export const OrderConfirmationPage: React.FC = () => {
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
      <div className="max-w-3xl mx-auto px-4 py-16 text-center animate-pulse space-y-4">
        <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto" />
        <div className="h-6 w-48 bg-gray-100 rounded mx-auto" />
        <div className="h-4 w-64 bg-gray-100 rounded mx-auto" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-10 sm:py-14 space-y-8">
      {/* Celebration Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-[#FAF92A] border border-[#FDBF2D] text-[#1A1A1A] flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1A1A]">
          Thank you for your order!
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
          We've received your order and are getting it ready for dispatch. A confirmation email has been sent to <strong>{order.customerEmail}</strong>.
        </p>
      </div>

      {/* Order Info Card */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Header Metadata */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Order ID</span>
            <div className="text-lg font-mono font-bold text-[#1A1A1A]">{order.id}</div>
          </div>

          <div className="flex items-center gap-3">
            <StatusBadge status={order.orderStatus} type="order" />
            <StatusBadge status={order.paymentStatus} type="payment" />
          </div>
        </div>

        {/* Tracking number banner */}
        {order.trackingNumber && (
          <div className="bg-[#FAF92A]/20 border border-[#FDBF2D]/50 rounded-2xl p-4 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-[#1A1A1A]" />
              <div>
                <p className="font-bold text-[#1A1A1A]">Tracking Number: {order.trackingNumber}</p>
                <p className="text-gray-500 text-[11px]">Carrier: Express Air Courier</p>
              </div>
            </div>
            <span className="text-[10px] uppercase font-bold bg-[#FAF92A] px-2 py-0.5 rounded border border-[#FDBF2D]">
              Dispatched Soon
            </span>
          </div>
        )}

        {/* Items list */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Items Ordered</h3>
          <div className="divide-y divide-gray-50">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-xl object-cover bg-gray-50 border border-gray-100 shrink-0"
                  />
                  <div>
                    <div className="font-bold text-[#1A1A1A]">{item.name}</div>
                    <div className="text-gray-400 text-[11px]">Quantity: {item.quantity}</div>
                  </div>
                </div>
                <span className="font-bold text-[#1A1A1A]">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping & Payment summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-100 text-xs">
          <div>
            <h4 className="font-bold text-gray-400 uppercase tracking-wider text-[10px] mb-1.5">
              Delivery Address
            </h4>
            <div className="text-gray-700 leading-relaxed">
              <p className="font-bold text-[#1A1A1A]">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.street}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-400 uppercase tracking-wider text-[10px] mb-1.5">
              Payment Summary
            </h4>
            <div className="space-y-1 text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold">{order.shipping === 0 ? 'FREE' : `$${order.shipping.toFixed(2)}`}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount</span>
                  <span>-${order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-gray-100 flex justify-between font-bold text-sm text-[#1A1A1A]">
                <span>Total Paid</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Next Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link to="/orders" className="w-full sm:w-auto">
          <Button variant="dark" size="md" className="w-full">
            View All Orders
          </Button>
        </Link>
        <Link to="/shop" className="w-full sm:w-auto">
          <Button variant="primary" size="md" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
};
