import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  AlertTriangle,
  TrendingUp,
  ChevronRight,
  Database,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { api } from '../../services/api';
import { AdminStats, Order, OrderStatus, Product } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';

export const AdminDashboardPage: React.FC = () => {
  const { success, error } = useToast();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [dbStatus, setDbStatus] = useState<{ connected: boolean; configured: boolean }>({ connected: false, configured: false });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [statsRes, ordersRes, productsRes] = await Promise.all([
        api.getAdminStats(),
        api.getAdminOrders({ limit: 6 }),
        api.getAdminProducts({ limit: 50 })
      ]);

      setStats(statsRes);
      setRecentOrders(ordersRes.orders);
      setLowStockProducts(productsRes.products.filter((p) => p.stock <= 5));

      // Fetch DB status
      fetch('/api/stats/db-status')
        .then((r) => r.json())
        .then((d) => setDbStatus(d))
        .catch(() => {});
    } catch (err: any) {
      error(err.message || 'Failed to load admin stats.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await api.updateOrderStatus(orderId, status);
      success(`Order #${orderId} marked as ${status}.`);
      loadDashboardData();
    } catch (err: any) {
      error(err.message || 'Failed to update order status.');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-white rounded-2xl border border-gray-200 p-5" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] tracking-tight">Admin Overview</h1>
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                dbStatus.connected
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
              title={
                dbStatus.connected
                  ? 'Connected to Live MongoDB Database'
                  : 'Add MONGODB_URI to .env to connect to your live database'
              }
            >
              <Database className="w-3.5 h-3.5" />
              <span>{dbStatus.connected ? 'MongoDB Connected' : 'Database Ready (Configure in .env)'}</span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Real-time analytics, revenue tracking, and inventory control.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/admin/products">
            <Button variant="primary" size="sm" leftIcon={<Package className="w-3.5 h-3.5" />}>
              Manage Products
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Revenue */}
        <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Revenue</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
            ${stats?.totalRevenue ? stats.totalRevenue.toFixed(2) : '0.00'}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Active transactions</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Orders</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#1A1A1A]">{stats?.totalOrders || 0}</div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-gray-500">
            <span>{stats?.ordersByStatus?.processing || 0} currently processing</span>
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Products in Catalog</span>
            <div className="w-9 h-9 rounded-xl bg-yellow-50 text-amber-600 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#1A1A1A]">{stats?.totalProducts || 0}</div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-amber-600 font-semibold">
            <span>{lowStockProducts.length} low stock alerts</span>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Registered Users</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#1A1A1A]">{stats?.totalUsers || 0}</div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-gray-500">
            <span>Customer & admin accounts</span>
          </div>
        </div>
      </div>

      {/* Low Stock Warning Banner if any */}
      {lowStockProducts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 sm:p-6 shadow-xs">
          <div className="flex items-center gap-2.5 mb-3 text-amber-900 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>Low Stock Alert ({lowStockProducts.length} items need replenishment)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStockProducts.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl p-3 border border-amber-200/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5 truncate">
                  <img src={p.images[0]} alt={p.name} className="w-9 h-9 rounded-lg object-cover bg-gray-100 shrink-0" />
                  <div className="truncate">
                    <p className="font-bold text-gray-900 truncate">{p.name}</p>
                    <p className="text-gray-400 text-[10px]">{p.category}</p>
                  </div>
                </div>
                <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md shrink-0 ml-2">
                  {p.stock} left
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders Management Section */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-[#1A1A1A]">Recent Customer Orders</h2>
            <p className="text-xs text-gray-500">Quickly update fulfilment status.</p>
          </div>
          <Link to="/admin/orders" className="text-xs font-bold text-amber-700 hover:underline">
            View All Orders →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                <th className="pb-3 pl-2">Order ID</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Items</th>
                <th className="pb-3">Total</th>
                <th className="pb-3">Payment</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right pr-2">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 pl-2 font-mono font-bold text-[#1A1A1A]">
                    <Link to={`/orders/${order.id}`} className="hover:underline text-amber-800">
                      {order.id}
                    </Link>
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
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                      className="text-xs bg-gray-50 border border-gray-200 rounded-lg py-1 px-2 font-semibold text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#FAF92A] cursor-pointer"
                    >
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
