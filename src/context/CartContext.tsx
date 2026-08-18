import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { CartItem, Product } from '../types';
import { useToast } from './ToastContext';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  promoCode: string | null;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_STORAGE_KEY = 'shopstack_cart_v1';
const PROMO_STORAGE_KEY = 'shopstack_promo_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { success, error, info } = useToast();

  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [promoCode, setPromoCode] = useState<string | null>(() => {
    try {
      return localStorage.getItem(PROMO_STORAGE_KEY) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (promoCode) {
      localStorage.setItem(PROMO_STORAGE_KEY, promoCode);
    } else {
      localStorage.removeItem(PROMO_STORAGE_KEY);
    }
  }, [promoCode]);

  const addToCart = (product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      const effectivePrice = product.discountPrice ?? product.price;

      if (existing) {
        const nextQty = Math.min(product.stock, existing.quantity + quantity);
        success(`Updated quantity for "${product.name}" (${nextQty} in cart)`);
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: nextQty } : item
        );
      } else {
        success(`Added "${product.name}" to cart!`);
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            brand: product.brand,
            category: product.category,
            price: effectivePrice,
            originalPrice: product.price,
            image: product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200',
            quantity: Math.min(product.stock, quantity),
            stock: product.stock
          }
        ];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
    info('Item removed from cart.');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: Math.min(item.stock, quantity) } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setPromoCode(null);
  };

  const applyPromoCode = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    if (clean === 'SHOP10' || clean === 'SUMMER20' || clean === 'FREESHIP') {
      setPromoCode(clean);
      success(`Promo code "${clean}" applied successfully!`);
      return true;
    } else {
      error('Invalid promo code. Try "SHOP10" or "SUMMER20".');
      return false;
    }
  };

  const removePromoCode = () => {
    setPromoCode(null);
    info('Promo code removed.');
  };

  const itemCount = useMemo(
    () => items.reduce((acc, item) => acc + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [items]
  );

  // Free shipping on orders >= $50 or code 'FREESHIP'
  const shipping = useMemo(() => {
    if (items.length === 0) return 0;
    if (promoCode === 'FREESHIP' || subtotal >= 50) return 0;
    return 9.99;
  }, [items, promoCode, subtotal]);

  const discount = useMemo(() => {
    if (!promoCode || items.length === 0) return 0;
    if (promoCode === 'SHOP10') return subtotal * 0.1;
    if (promoCode === 'SUMMER20') return subtotal * 0.2;
    return 0;
  }, [promoCode, items, subtotal]);

  const total = useMemo(() => {
    if (items.length === 0) return 0;
    return Math.max(0, subtotal + shipping - discount);
  }, [items, subtotal, shipping, discount]);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        shipping,
        discount,
        total,
        promoCode,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyPromoCode,
        removePromoCode
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
