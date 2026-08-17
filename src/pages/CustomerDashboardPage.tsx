import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  User as UserIcon,
  Heart,
  ShoppingBag,
  MapPin,
  Mail,
  Phone,
  Shield,
  LogOut,
  Save,
  Trash2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';

export const CustomerDashboardPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'profile';

  const { user, logout, updateProfile } = useAuth();
  const { items: wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { success, error } = useToast();

  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    postalCode: user?.address?.postalCode || '',
    country: user?.address?.country || 'United States'
  });

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await updateProfile({
        name: formData.name,
        phone: formData.phone,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country
        }
      });
      success('Profile updated successfully!');
    } catch (err: any) {
      error(err.message || 'Failed to save profile updates.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 py-6 sm:py-8 space-y-8">
      {/* Header Profile Bar */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <img
            src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'User'}`}
            alt={user?.name}
            className="w-16 h-16 rounded-2xl object-cover bg-gray-50 border border-gray-200"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1A1A1A]">
                {user?.name}
              </h1>
              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                  user?.role === 'admin'
                    ? 'bg-[#FAF92A] text-[#1A1A1A] border-[#FDBF2D]'
                    : 'bg-gray-100 text-gray-700 border-gray-200'
                }`}
              >
                {user?.role}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">{user?.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user?.role === 'admin' && (
            <Link to="/admin">
              <Button variant="primary" size="sm" leftIcon={<Shield className="w-3.5 h-3.5" />}>
                Admin Console
              </Button>
            </Link>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            leftIcon={<LogOut className="w-3.5 h-3.5 text-rose-500" />}
          >
            Sign Out
          </Button>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation side column (3 cols) */}
        <aside className="lg:col-span-3 bg-white p-3 rounded-2xl border border-gray-100 shadow-xs space-y-1">
          <button
            onClick={() => setSearchParams({ tab: 'profile' })}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-[#FAF92A] text-[#1A1A1A] border border-[#FDBF2D]'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <UserIcon className="w-4 h-4" />
              <span>Profile & Address</span>
            </div>
          </button>

          <button
            onClick={() => setSearchParams({ tab: 'wishlist' })}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'wishlist'
                ? 'bg-[#FAF92A] text-[#1A1A1A] border border-[#FDBF2D]'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Heart className="w-4 h-4" />
              <span>Saved Wishlist</span>
            </div>
            {wishlistItems.length > 0 && (
              <span className="text-[10px] bg-[#1A1A1A] text-white px-1.5 py-0.2 rounded-full">
                {wishlistItems.length}
              </span>
            )}
          </button>

          <Link
            to="/orders"
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-4 h-4" />
              <span>Order History</span>
            </div>
            <span className="text-gray-400">→</span>
          </Link>
        </aside>

        {/* Content Column (9 cols) */}
        <div className="lg:col-span-9">
          {activeTab === 'profile' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-6">
              <div>
                <h2 className="text-base font-bold text-[#1A1A1A]">Account Details & Address</h2>
                <p className="text-xs text-gray-400">Update your contact information for faster checkout.</p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FDBF2D] text-[#1A1A1A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      disabled
                      value={user?.email || ''}
                      className="w-full text-xs p-2.5 bg-gray-100 border border-gray-200 rounded-xl text-gray-400 cursor-not-allowed"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FDBF2D] text-[#1A1A1A]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">Street Address</label>
                    <input
                      type="text"
                      value={formData.street}
                      onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                      placeholder="123 Utility Street"
                      className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FDBF2D] text-[#1A1A1A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FDBF2D] text-[#1A1A1A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">State / Province</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FDBF2D] text-[#1A1A1A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Postal Code</label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FDBF2D] text-[#1A1A1A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Country</label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FDBF2D] text-[#1A1A1A]"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    isLoading={isSaving}
                    leftIcon={<Save className="w-3.5 h-3.5" />}
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <h2 className="text-base font-bold text-[#1A1A1A]">
                  Saved Wishlist ({wishlistItems.length})
                </h2>
              </div>

              {wishlistItems.length === 0 ? (
                <EmptyState
                  icon={Heart}
                  title="Your wishlist is currently empty"
                  description="Save items you want to keep track of by clicking the heart button on product cards."
                  actionText="Explore Shop"
                  onAction={() => window.location.assign('/shop')}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {wishlistItems.map((prod) => (
                    <div
                      key={prod.id}
                      className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between"
                    >
                      <div className="aspect-[4/3] bg-gray-50 rounded-xl mb-3 overflow-hidden relative">
                        <img
                          src={prod.images[0]}
                          alt={prod.name}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => removeFromWishlist(prod.id)}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 text-rose-500 hover:bg-rose-50 cursor-pointer"
                          title="Remove from wishlist"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex-1 mb-3">
                        <p className="text-[10px] uppercase font-bold text-gray-400">{prod.brand}</p>
                        <h4 className="font-bold text-xs text-[#1A1A1A] line-clamp-1">{prod.name}</h4>
                        <p className="text-xs font-bold text-[#1A1A1A] mt-1">
                          ${(prod.discountPrice ?? prod.price).toFixed(2)}
                        </p>
                      </div>

                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => addToCart(prod, 1)}
                        className="w-full text-xs"
                      >
                        Add to Cart
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
