import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  Search,
  User as UserIcon,
  Shield,
  Menu,
  X,
  Home,
  Tag,
  Package,
  Compass,
  ArrowRight
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { ShopStackLogo } from './ShopStackLogo';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { itemCount } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { user, isAdmin, logout } = useAuth();

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
    { label: 'Home', path: '/', icon: Home },
    { label: 'Shop', path: '/shop', icon: Compass },
    { label: 'Deals', path: '/shop?discount=true', icon: Tag },
    { label: 'Orders', path: '/orders', icon: Package }
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-[72px] flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Desktop Nav Links */}
        <div className="flex items-center gap-8">
          <Link to="/" className="group flex items-center">
            <ShopStackLogo size="md" />
          </Link>

          {/* Desktop Navigation Links (hidden on tablet & mobile: <1024px, shown on desktop lg+) */}
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
                  className={`transition-colors hover:text-[#1A1A1A] py-1 ${
                    isActive ? 'text-[#1A1A1A] font-semibold border-b-2 border-[#1A1A1A]' : ''
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right: Search, Wishlist, Cart, Account & Tablet/Mobile Hamburger */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Search Input Bar (hidden on mobile, shown on larger screens) */}
          <form onSubmit={handleSearch} className="hidden md:block relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-full py-2 pl-4 pr-9 text-xs w-44 lg:w-60 focus:outline-none focus:border-[#FDBF2D] text-[#1A1A1A] placeholder-gray-400 transition-all"
            />
            <button
              type="submit"
              aria-label="Search"
              className="absolute right-3 top-2.5 text-gray-400 hover:text-[#1A1A1A] cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Wishlist Button */}
          <Link
            to="/dashboard?tab=wishlist"
            className="relative p-2 text-gray-700 hover:text-[#1A1A1A] transition-colors rounded-full hover:bg-gray-100"
            title="Wishlist"
            aria-label="Wishlist"
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
            className="relative p-2 text-gray-700 hover:text-[#1A1A1A] transition-colors rounded-full hover:bg-gray-100"
            title="Shopping Cart"
            aria-label="Shopping Cart"
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

          {/* Account Pill Button (hidden on mobile/tablet, shown on desktop lg+) */}
          {user ? (
            <Link
              to="/dashboard"
              className="hidden lg:flex text-xs sm:text-sm font-medium bg-[#1A1A1A] text-white px-3.5 sm:px-5 py-2 rounded-full hover:bg-black transition-colors items-center gap-1.5"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span className="truncate max-w-[80px] sm:max-w-[100px]">{user.name.split(' ')[0]}</span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="hidden lg:inline-flex text-xs sm:text-sm font-medium bg-[#1A1A1A] text-white px-3.5 sm:px-5 py-2 rounded-full hover:bg-black transition-colors"
            >
              Sign In
            </Link>
          )}

          {/* Tablet & Mobile Hamburger Toggle Button (<1024px lg:hidden) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            className="lg:hidden p-2 text-gray-700 hover:text-[#1A1A1A] rounded-xl hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Tablet & Mobile Menu Drawer (<1024px lg:hidden) */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-5 sm:px-8 py-5 shadow-lg space-y-4 animate-in fade-in duration-200">
          {/* Mobile/Tablet Search Bar */}
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search catalog, brands, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-4 pr-10 text-xs focus:outline-none focus:border-[#FDBF2D] text-[#1A1A1A]"
            />
            <button
              type="submit"
              aria-label="Search submit"
              className="absolute right-3 top-3 text-gray-400 hover:text-[#1A1A1A]"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Navigation Links in Hamburger Menu */}
          <div className="space-y-1 pt-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-3 pb-1">
              Navigation
            </p>
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                link.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(link.path.split('?')[0]);
              return (
                <Link
                  key={link.label}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#FAF92A] text-[#1A1A1A] font-bold'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-[#1A1A1A]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 opacity-40" />
                </Link>
              );
            })}
          </div>

          {/* Quick links: Wishlist, Orders, Dashboard, Admin */}
          <div className="pt-2 border-t border-gray-100 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-3 pb-1">
              My ShopStack
            </p>

            <Link
              to="/dashboard?tab=wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Heart className="w-4 h-4" />
                <span>Wishlist</span>
              </div>
              {wishlistItems.length > 0 && (
                <span className="bg-[#FAF92A] text-[#1A1A1A] text-xs font-bold px-2 py-0.5 rounded-full border border-[#1A1A1A]">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4" />
                <span>Cart</span>
              </div>
              {itemCount > 0 && (
                <span className="bg-[#FAF92A] text-[#1A1A1A] text-xs font-bold px-2 py-0.5 rounded-full border border-[#1A1A1A]">
                  {itemCount}
                </span>
              )}
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold bg-[#FAF92A]/40 text-[#1A1A1A] border border-[#FDBF2D]/50 hover:bg-[#FAF92A] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-[#1A1A1A]" />
                  <span>Admin Console</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}

            {user ? (
              <div className="pt-2 flex items-center justify-between px-3">
                <div className="text-xs">
                  <p className="font-bold text-[#1A1A1A]">{user.name}</p>
                  <p className="text-gray-400 truncate">{user.email}</p>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs font-bold text-rose-500 hover:underline cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full block text-center py-2.5 bg-[#1A1A1A] text-white rounded-xl text-xs font-bold hover:bg-black transition-colors"
                >
                  Sign In / Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
