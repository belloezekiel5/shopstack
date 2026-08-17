import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ChevronRight, Package, Truck, Clock } from 'lucide-react';
import { api } from '../services/api';
import { Order } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/common/Button';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        setIsLoading(true);
        const res = await api.getMyOrders();
        setOrders(res.orders);
      } catch (err) {
        console.error('Failed to load user orders:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadOrders();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-4 animate-pulse">
        <div className="h-8 w-48 bg-gray-100 rounded" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-white rounded-3xl border border-gray-100 p-6" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12">
        <EmptyState
          icon={ShoppingBag}
          title="No orders placed yet"
          description="Once you place an order, you can track its real-time shipping status and view receipts here."
          actionText="Start Shopping"
          onAction={() => window.location.assign('/shop')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-10 py-6 sm:py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1A1A]">
          My Orders ({orders.length})
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Review recent transactions, tracking details, and fulfillment statuses.
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-3xl border border-gray-100 p-5 sm:p-6 shadow-xs space-y-4 hover:border-gray-200 transition-colors"
          >
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-sm text-[#1A1A1A]">{order.id}</span>
                <span className="text-xs text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <StatusBadge status={order.orderStatus} type="order" />
                <StatusBadge status={order.paymentStatus} type="payment" />
              </div>
            </div>

            {/* Items summary */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 overflow-x-auto py-1">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover bg-gray-50 border border-gray-100"
                    />
                    <div className="text-xs">
                      <p className="font-semibold text-[#1A1A1A] max-w-[140px] truncate">{item.name}</p>
                      <p className="text-[10px] text-gray-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total & Action */}
              <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-50">
                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-gray-400 uppercase font-bold">Total</span>
                  <div className="text-base font-bold text-[#1A1A1A]">${order.total.toFixed(2)}</div>
                </div>

                <Link to={`/orders/${order.id}`}>
                  <Button variant="outline" size="sm" rightIcon={<ChevronRight className="w-3.5 h-3.5" />}>
                    Details
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
