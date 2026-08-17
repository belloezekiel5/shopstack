import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  LogOut,
  ExternalLink,
  Layers
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Customers', path: '/admin/users', icon: Users }
  ];

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-[#1A1A1A] text-white flex flex-col shrink-0 border-r border-zinc-800">
        {/* Brand Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="text-xl font-bold tracking-tight text-white">
              Shop<span className="text-[#FDBF2D]">Stack</span>
            </span>
          </Link>
          <span className="bg-[#FAF92A] text-[#1A1A1A] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#FDBF2D]">
            ADMIN
          </span>
        </div>

        {/* Navigation links */}
        <nav className="p-4 space-y-1.5 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.path === '/admin'
                ? location.pathname === '/admin'
                : location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                  isActive
                    ? 'bg-[#FAF92A] text-[#1A1A1A] shadow-xs'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer actions in sidebar */}
        <div className="p-4 border-t border-zinc-800 space-y-2 text-xs">
          <Link
            to="/"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Back to Storefront</span>
          </Link>

          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-rose-400 hover:bg-zinc-900 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};
