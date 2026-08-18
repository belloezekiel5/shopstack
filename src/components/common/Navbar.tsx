import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Heart, Search, User as UserIcon, Shield, Menu, X, Layers } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { itemCount } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { user, isAdmin } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/shop' },
    { label: 'Deals', path: '/shop?discount=true' },
    { label: 'Orders', path: '/orders' }
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 h-[72px] flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Main Nav Links */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-bold tracking-tight text-[#1A1A1A]">
              Shop<span className="text-[#FDBF2D]">Stack</span>
            </span>
          </Link>

          {/* Desktop Navigation Links (Visible only on lg screens) */}
          <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-500">
            {navLinks.map((link) => {
              const isActive =
                link.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(link.path.split('?')[0]);
              return (
                <Link
                  key={link.label}
                  to={link.path}
                  className={`transition-colors hover:text-[#1A1A1A] ${
                    isActive ? 'text-[#1A1A1A] font-semibold' : ''
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right: Search, Wishlist, Cart & Account Button */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Search Input Bar */}
          <form onSubmit={handleSearch} className="hidden sm:block relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-full py-2 pl-4 pr-9 text-xs w-40 md:w-48 lg:w-64 focus:outline-none focus:border-[#FDBF2D] text-[#1A1A1A] placeholder-gray-400 transition-all"
            />
            <button
              type="submit"
              className="absolute right-3 top-2.5 text-gray-400 hover:text-[#1A1A1A]"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Wishlist Button */}
          <Link
            to="/dashboard?tab=wishlist"
            className="relative p-2 text-gray-700 hover:text-[#1A1A1A] transition-colors"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistItems.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#FAF92A] text-[#1A1A1A] text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-[#1A1A1A]">
                {wishlistItems.length}
              </span>
            )}
          </Link>

          {/* Cart Bag Icon with Yellow Badge */}
          <Link
            to="/cart"
            className="relative p-2 text-gray-700 hover:text-[#1A1A1A] transition-colors"
            title="Shopping Cart"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#FAF92A] text-[#1A1A1A] text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-[#1A1A1A]">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Admin shortcut badge if logged in as Admin */}
          {isAdmin && (
            <Link
              to="/admin"
              className="hidden sm:inline-flex items-center gap-1.5 bg-[#FAF92A] text-[#1A1A1A] text-xs font-bold px-3 py-1.5 rounded-full border border-[#FDBF2D] hover:bg-[#eae820] transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>
          )}

          {/* Account Pill Button */}
          {user ? (
            <Link
              to="/dashboard"
              className="text-sm font-medium bg-[#1A1A1A] text-white px-4 sm:px-5 py-2 rounded-full hover:bg-black transition-colors flex items-center gap-1.5"
            >
              <span className="truncate max-w-[100px]">{user.name.split(' ')[0]}</span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="text-sm font-medium bg-[#1A1A1A] text-white px-4 sm:px-5 py-2 rounded-full hover:bg-black transition-colors"
            >
              Account
            </Link>
          )}

          {/* Tablet & Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:text-[#1A1A1A] rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-6 py-5 space-y-4 shadow-sm animate-in slide-in-from-top-2 duration-150">
          <form onSubmit={handleSearch} className="sm:hidden relative">
            <input
              type="text"
              placeholder="Search catalog..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 pl-4 pr-9 text-xs focus:outline-none focus:border-[#FDBF2D]"
            />
            <Search className="w-4 h-4 text-gray-400 absolute right-3 top-2.5" />
          </form>

          <div className="flex flex-col space-y-2 text-sm font-medium text-gray-600">
            {navLinks.map((link) => {
              const isActive =
                link.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(link.path.split('?')[0]);
              return (
                <Link
                  key={link.label}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-2 px-3 rounded-lg transition-colors flex items-center justify-between ${
                    isActive
                      ? 'bg-gray-100 text-[#1A1A1A] font-semibold'
                      : 'hover:bg-gray-50 hover:text-[#1A1A1A]'
                  }`}
                >
                  <span>{link.label}</span>
                </Link>
              );
            })}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg font-bold text-amber-700 hover:bg-amber-50 flex items-center gap-2 transition-colors"
              >
                <Shield className="w-4 h-4" />
                <span>Admin Console</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
