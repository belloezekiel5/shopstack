import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';
import { useToast } from './ToastContext';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  items: Product[];
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);
const WISHLIST_STORAGE_KEY = 'shopstack_wishlist_v1';

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { info, success } = useToast();
  const { user } = useAuth();

  const [items, setItems] = useState<Product[]>(() => {
    try {
      const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // When user logs in, load wishlist from MongoDB
  useEffect(() => {
    let active = true;
    if (user) {
      api.getWishlist()
        .then((res) => {
          if (active && res.products) {
            setItems(res.products);
          }
        })
        .catch(() => {});
    }

    return () => {
      active = false;
    };
  }, [user?.id]);

  useEffect(() => {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const isInWishlist = (productId: string) => {
    return items.some((item) => item.id === productId);
  };

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      setItems((prev) => prev.filter((item) => item.id !== product.id));
      info(`Removed "${product.name}" from your wishlist.`);
    } else {
      setItems((prev) => [...prev, product]);
      success(`Saved "${product.name}" to your wishlist!`);
    }

    if (user) {
      api.toggleWishlist(product.id).catch(() => {});
    }
  };

  const removeFromWishlist = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
    if (user) {
      api.toggleWishlist(productId).catch(() => {});
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
