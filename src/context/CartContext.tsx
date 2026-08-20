import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import { CartItem, Product } from '../types';
import { useToast } from './ToastContext';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

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

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { success, error, info } = useToast();
  const { user } = useAuth();
  const isInitialLoad = useRef(true);

  const [items, setItems] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState<string | null>(null);

  // When authenticated user changes, fetch cart directly from MongoDB
  useEffect(() => {
    let active = true;
    if (user) {
      api.getCart()
        .then((res) => {
          if (active && res.cart) {
            setItems(res.cart);
          }
        })
        .catch(() => {})
        .finally(() => {
          isInitialLoad.current = false;
        });
    } else {
      isInitialLoad.current = false;
    }

    return () => {
      active = false;
    };
  }, [user?.id]);

  // Sync to MongoDB whenever items change if user is logged in
  useEffect(() => {
    if (user && !isInitialLoad.current) {
      const timer = setTimeout(() => {
        api.syncCart(items).catch(() => {});
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [items, user]);

  const addToCart = (product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id || item.productId === product.id);
      const effectivePrice = product.discountPrice ?? product.price;

      if (existing) {
        const newQty = existing.quantity + quantity;
        if (product.stock && newQty > product.stock) {
          error(`Only ${product.stock} items available in stock.`);
          return prev;
        }
        success(`Updated quantity for "${product.name}" in cart.`);
        return prev.map((item) =>
          item.id === product.id || item.productId === product.id
            ? { ...item, quantity: newQty }
            : item
        );
      } else {
        if (product.stock && quantity > product.stock) {
          error(`Only ${product.stock} items available in stock.`);
          return prev;
        }
        success(`Added "${product.name}" to cart.`);
        const newItem: CartItem = {
          id: product.id,
          productId: product.id,
          name: product.name,
          brand: product.brand || '',
          category: product.category,
          price: effectivePrice,
          originalPrice: product.price,
          image: product.images && product.images[0] ? product.images[0] : '',
          quantity,
          stock: product.stock,
        };
        return [...prev, newItem];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.id === productId || i.productId === productId);
      if (item) {
        info(`Removed "${item.name}" from cart.`);
      }
      return prev.filter((i) => i.id !== productId && i.productId !== productId);
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.id === productId || item.productId === productId) {
          if (item.stock && quantity > item.stock) {
            error(`Only ${item.stock} items available in stock.`);
            return item;
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setPromoCode(null);
    if (user) {
      api.clearCart().catch(() => {});
    }
  };

  const applyPromoCode = (code: string): boolean => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'SAVE10' || cleanCode === 'DISCOUNT20' || cleanCode === 'WELCOME15') {
      setPromoCode(cleanCode);
      success(`Promo code ${cleanCode} applied!`);
      return true;
    } else {
      error('Invalid promo code. Try SAVE10, DISCOUNT20, or WELCOME15.');
      return false;
    }
  };

  const removePromoCode = () => {
    setPromoCode(null);
    info('Promo code removed.');
  };

  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [items]);

  const itemCount = useMemo(() => {
    return items.reduce((acc, item) => acc + item.quantity, 0);
  }, [items]);

  const shipping = useMemo(() => {
    if (subtotal === 0) return 0;
    return subtotal > 50 ? 0 : 9.99;
  }, [subtotal]);

  const discount = useMemo(() => {
    if (!promoCode || subtotal === 0) return 0;
    if (promoCode === 'SAVE10') return subtotal * 0.1;
    if (promoCode === 'DISCOUNT20') return subtotal * 0.2;
    if (promoCode === 'WELCOME15') return subtotal * 0.15;
    return 0;
  }, [promoCode, subtotal]);

  const total = useMemo(() => {
    return Math.max(0, subtotal + shipping - discount);
  }, [subtotal, shipping, discount]);

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
        removePromoCode,
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
