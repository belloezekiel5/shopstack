import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Tag,
  ShieldCheck,
  Truck,
  X
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    subtotal,
    shipping,
    discount,
    total,
    promoCode,
    updateQuantity,
    removeFromCart,
    applyPromoCode,
    removePromoCode,
    clearCart
  } = useCart();

  const [inputCode, setInputCode] = useState('');

  const handleApplyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim()) {
      applyPromoCode(inputCode.trim());
      setInputCode('');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 py-12">
        <EmptyState
          icon={ShoppingBag}
          title="Your shopping cart is empty"
          description="Looks like you haven't added any items to your bag yet. Explore our curated catalogue."
          actionText="Start Shopping"
          onAction={() => navigate('/shop')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 py-6 sm:py-8 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1A1A]">
            Shopping Bag
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs font-semibold text-gray-400 hover:text-rose-600 transition-colors"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Item Rows (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-xl object-cover bg-gray-50 border border-gray-100 shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-[10px] uppercase font-bold text-gray-400">
                    {item.category} • {item.brand}
                  </p>
                  <Link
                    to={`/products/${item.id}`}
                    className="font-bold text-sm text-[#1A1A1A] hover:text-amber-700 transition-colors line-clamp-1"
                  >
                    {item.name}
                  </Link>
                  <p className="text-xs font-bold text-[#1A1A1A] mt-1">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Controls: Quantity + Subtotal + Delete */}
              <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-50">
                {/* Quantity input */}
                <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 p-0.5">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1.5 text-gray-500 hover:text-black cursor-pointer"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-[#1A1A1A]">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                    className="p-1.5 text-gray-500 hover:text-black disabled:opacity-30 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <div className="text-right min-w-[70px]">
                  <span className="font-bold text-sm text-[#1A1A1A]">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <div className="pt-2">
            <Link
              to="/shop"
              className="text-xs font-bold text-gray-500 hover:text-[#1A1A1A] transition-colors inline-flex items-center gap-1.5"
            >
              <span>← Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Order Summary & Promo Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-6">
            <h2 className="text-base font-bold text-[#1A1A1A]">Order Summary</h2>

            {/* Subtotals breakdown */}
            <div className="space-y-2.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#1A1A1A]">${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping Estimate</span>
                <span className="font-semibold text-[#1A1A1A]">
                  {shipping === 0 ? (
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                      FREE
                    </span>
                  ) : (
                    `$${shipping.toFixed(2)}`
                  )}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount ({promoCode})</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="pt-3 border-t border-gray-100 flex justify-between text-sm sm:text-base font-bold text-[#1A1A1A]">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Promo code input */}
            <div className="pt-2 space-y-2">
              <label className="text-xs font-bold text-[#1A1A1A]">Promo Code</label>
              {promoCode ? (
                <div className="flex items-center justify-between p-2.5 bg-[#FAF92A]/30 border border-[#FDBF2D] rounded-xl text-xs">
                  <div className="flex items-center gap-2 font-bold text-[#1A1A1A]">
                    <Tag className="w-3.5 h-3.5" />
                    <span>{promoCode} applied</span>
                  </div>
                  <button
                    onClick={removePromoCode}
                    className="text-gray-500 hover:text-black p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCode} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. SHOP10 or SUMMER20"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    className="flex-1 text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FDBF2D] uppercase font-semibold text-[#1A1A1A]"
                  />
                  <Button type="submit" variant="dark" size="sm">
                    Apply
                  </Button>
                </form>
              )}
            </div>

            {/* Checkout CTA */}
            <Button
              variant="primary"
              size="lg"
              className="w-full text-sm"
              onClick={() => navigate('/checkout')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Proceed to Checkout (${total.toFixed(2)})
            </Button>
          </div>

          {/* Trust badges */}
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center justify-around text-[11px] text-gray-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-gray-700" />
              <span>SSL Secure Checkout</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-gray-700" />
              <span>Fast Tracked Shipping</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
