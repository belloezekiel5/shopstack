import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  CreditCard,
  Truck,
  ShieldCheck,
  Lock,
  ArrowRight,
  ChevronLeft,
  CheckCircle2
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { Button } from '../components/common/Button';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, subtotal, shipping, discount, total, clearCart, promoCode } = useCart();
  const { user } = useAuth();
  const { success, error } = useToast();

  const [isProcessing, setIsProcessing] = useState(false);

  // Form State
  const [shippingData, setShippingData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    postalCode: user?.address?.postalCode || '',
    country: user?.address?.country || 'United States'
  });

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod'>('card');
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardExp: '',
    cardCvc: ''
  });

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!shippingData.fullName || !shippingData.email || !shippingData.street || !shippingData.city) {
      error('Please fill in all required shipping fields.');
      return;
    }

    try {
      setIsProcessing(true);

      const orderPayload = {
        items: items.map((it) => ({
          productId: it.id,
          name: it.name,
          price: it.price,
          quantity: it.quantity
        })),
        shippingAddress: shippingData,
        paymentMethod: paymentMethod === 'card' ? 'Credit Card (•••• 4242)' : 'Cash on Delivery',
        discount
      };

      const res = await api.createOrder(orderPayload);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}

      clearCart();
      success('Order placed successfully!');
      navigate(`/order-confirmation/${res.order.id}`);
    } catch (err: any) {
      error(err.message || 'Failed to process order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 py-6 sm:py-8 space-y-8">
      {/* Checkout Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div>
          <Link
            to="/cart"
            className="text-xs font-semibold text-gray-500 hover:text-[#1A1A1A] flex items-center gap-1 mb-1"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Return to bag</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1A1A]">
            Checkout & Payment
          </h1>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Encrypted 256-bit</span>
        </div>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Shipping & Payment (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Shipping Address Section */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-[#1A1A1A] font-bold text-base">
              <Truck className="w-5 h-5" />
              <span>1. Shipping Information</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={shippingData.fullName}
                  onChange={(e) => setShippingData({ ...shippingData, fullName: e.target.value })}
                  className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FDBF2D] text-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={shippingData.email}
                  onChange={(e) => setShippingData({ ...shippingData, email: e.target.value })}
                  className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FDBF2D] text-[#1A1A1A]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1">Street Address *</label>
                <input
                  type="text"
                  required
                  value={shippingData.street}
                  onChange={(e) => setShippingData({ ...shippingData, street: e.target.value })}
                  placeholder="Street name and house/flat number"
                  className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FDBF2D] text-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={shippingData.city}
                  onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                  className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FDBF2D] text-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">State / Province</label>
                <input
                  type="text"
                  value={shippingData.state}
                  onChange={(e) => setShippingData({ ...shippingData, state: e.target.value })}
                  className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FDBF2D] text-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Postal / ZIP Code</label>
                <input
                  type="text"
                  value={shippingData.postalCode}
                  onChange={(e) => setShippingData({ ...shippingData, postalCode: e.target.value })}
                  className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FDBF2D] text-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Country</label>
                <select
                  value={shippingData.country}
                  onChange={(e) => setShippingData({ ...shippingData, country: e.target.value })}
                  className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FDBF2D] text-[#1A1A1A] cursor-pointer"
                >
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Germany">Germany</option>
                  <option value="Australia">Australia</option>
                </select>
              </div>
            </div>
          </div>

          {/* Payment Method Section */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-[#1A1A1A] font-bold text-base">
              <CreditCard className="w-5 h-5" />
              <span>2. Payment Option</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label
                onClick={() => setPaymentMethod('card')}
                className={`p-3.5 rounded-2xl border-2 flex items-center gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'card'
                    ? 'border-[#FAF92A] bg-[#FAF92A]/10 ring-1 ring-[#FDBF2D]'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment_choice"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="accent-[#FAF92A]"
                />
                <div>
                  <div className="font-bold text-xs text-[#1A1A1A]">Credit / Debit Card</div>
                  <div className="text-[10px] text-gray-400">Instant validation</div>
                </div>
              </label>

              <label
                onClick={() => setPaymentMethod('cod')}
                className={`p-3.5 rounded-2xl border-2 flex items-center gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-[#FAF92A] bg-[#FAF92A]/10 ring-1 ring-[#FDBF2D]'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment_choice"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="accent-[#FAF92A]"
                />
                <div>
                  <div className="font-bold text-xs text-[#1A1A1A]">Cash on Delivery</div>
                  <div className="text-[10px] text-gray-400">Pay upon delivery</div>
                </div>
              </label>
            </div>

            {paymentMethod === 'card' && (
              <div className="space-y-3 pt-2 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardData.cardNumber}
                    onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
                    className="w-full text-xs p-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#FDBF2D] font-mono text-[#1A1A1A]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">Expires (MM/YY)</label>
                    <input
                      type="text"
                      value={cardData.cardExp}
                      onChange={(e) => setCardData({ ...cardData, cardExp: e.target.value })}
                      className="w-full text-xs p-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#FDBF2D] font-mono text-[#1A1A1A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">CVC Code</label>
                    <input
                      type="text"
                      value={cardData.cardCvc}
                      onChange={(e) => setCardData({ ...cardData, cardCvc: e.target.value })}
                      className="w-full text-xs p-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#FDBF2D] font-mono text-[#1A1A1A]"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Review & Submit (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-6">
            <h2 className="text-base font-bold text-[#1A1A1A]">Review Your Order</h2>

            {/* Line items mini preview */}
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover bg-gray-50 border border-gray-100 shrink-0"
                    />
                    <div className="truncate">
                      <p className="font-bold text-[#1A1A1A] truncate">{item.name}</p>
                      <p className="text-[11px] text-gray-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-[#1A1A1A] shrink-0">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 pt-4 border-t border-gray-100 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#1A1A1A]">${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold text-[#1A1A1A]">
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount ({promoCode})</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="pt-3 border-t border-gray-100 flex justify-between text-base font-bold text-[#1A1A1A]">
                <span>Total Due</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full text-sm"
              isLoading={isProcessing}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Place Order (${total.toFixed(2)})
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
