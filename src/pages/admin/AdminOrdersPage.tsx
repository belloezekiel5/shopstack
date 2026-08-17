import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye, Filter, ArrowUpDown } from 'lucide-react';
import { api } from '../../services/api';
import { Order, OrderStatus } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';

export const AdminOrdersPage: React.FC = () => {
  const { success, error } = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // Order Details Modal
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const res = await api.getAdminOrders({ limit: 100 });
      setOrders(res.orders);
    } catch (err: any) {
      error(err.message || 'Failed to load orders.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await api.updateOrderStatus(orderId, status);
      success(`Order #${orderId} marked as ${status}.`);
      loadOrders();
      if (viewingOrder && viewingOrder.id === orderId) {
        setViewingOrder({ ...viewingOrder, orderStatus: status });
      }
    } catch (err: any) {
      error(err.message || 'Failed to update order status.');
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.shippingAddress.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || o.orderStatus === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] tracking-tight">Order Management</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Monitor order statuses, update fulfillment stages, and review customer invoices.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Search by Order ID, customer name, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs py-2 pl-9 pr-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FDBF2D] text-[#1A1A1A]"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="text-xs bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 font-semibold text-gray-800 focus:outline-none focus:border-[#FDBF2D] cursor-pointer w-full sm:w-auto"
        >
          <option value="All">All Statuses</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                <th className="pb-3 pl-2">Order ID</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Items</th>
                <th className="pb-3">Total</th>
                <th className="pb-3">Payment</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right pr-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-400">
                    Loading orders...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-400">
                    No orders match your filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 pl-2 font-mono font-bold text-[#1A1A1A]">
                      #{order.id}
                    </td>
                    <td className="py-3 text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3">
                      <div className="font-bold text-[#1A1A1A]">{order.shippingAddress.fullName}</div>
                      <div className="text-[11px] text-gray-400">{order.customerEmail}</div>
                    </td>
                    <td className="py-3 text-gray-600">
                      {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                    </td>
                    <td className="py-3 font-bold text-[#1A1A1A]">${order.total.toFixed(2)}</td>
                    <td className="py-3">
                      <StatusBadge status={order.paymentStatus} type="payment" />
                    </td>
                    <td className="py-3">
                      <StatusBadge status={order.orderStatus} type="order" />
                    </td>
                    <td className="py-3 text-right pr-2">
                      <div className="flex items-center justify-end gap-2">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                          className="text-xs bg-gray-50 border border-gray-200 rounded-lg py-1 px-2 font-semibold text-gray-800 focus:outline-none cursor-pointer"
                        >
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>

                        <button
                          onClick={() => setViewingOrder(order)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer"
                          title="View order details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      <Modal
        isOpen={!!viewingOrder}
        onClose={() => setViewingOrder(null)}
        title={`Order Details #${viewingOrder?.id}`}
      >
        {viewingOrder && (
          <div className="space-y-4 text-xs">
            {/* Status overview */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-100">
              <div>
                <span className="text-gray-400 uppercase font-bold text-[10px]">Placed On</span>
                <p className="font-bold text-[#1A1A1A]">
                  {new Date(viewingOrder.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={viewingOrder.orderStatus} type="order" />
                <StatusBadge status={viewingOrder.paymentStatus} type="payment" />
              </div>
            </div>

            {/* Line items */}
            <div className="space-y-2">
              <h4 className="font-bold text-gray-700">Items Ordered</h4>
              <div className="divide-y divide-gray-100 bg-white border border-gray-100 rounded-2xl p-3">
                {viewingOrder.items.map((it, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={it.image}
                        alt={it.name}
                        className="w-8 h-8 rounded-lg object-cover bg-gray-100 shrink-0"
                      />
                      <div>
                        <p className="font-bold text-[#1A1A1A]">{it.name}</p>
                        <p className="text-gray-400 text-[10px]">Qty: {it.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-[#1A1A1A]">
                      ${(it.price * it.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Info */}
            <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
              <h4 className="font-bold text-gray-700">Shipping Destination</h4>
              <p className="font-semibold text-[#1A1A1A]">{viewingOrder.shippingAddress.fullName}</p>
              <p className="text-gray-500">{viewingOrder.shippingAddress.street}</p>
              <p className="text-gray-500">
                {viewingOrder.shippingAddress.city}, {viewingOrder.shippingAddress.state}{' '}
                {viewingOrder.shippingAddress.postalCode}
              </p>
              <p className="text-gray-500">{viewingOrder.shippingAddress.country}</p>
            </div>

            {/* Financial summary */}
            <div className="space-y-1.5 pt-2 border-t border-gray-100">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal:</span>
                <span className="font-semibold">${viewingOrder.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping:</span>
                <span className="font-semibold">${viewingOrder.shipping.toFixed(2)}</span>
              </div>
              {viewingOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount:</span>
                  <span>-${viewingOrder.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-sm text-[#1A1A1A] pt-1 border-t border-gray-100">
                <span>Total Amount:</span>
                <span>${viewingOrder.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-3 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setViewingOrder(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
