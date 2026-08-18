import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product } from '../types';
import { useToast } from './ToastContext';

interface WishlistContextType {
  items: Product[];
  isInWishlist: (productId: string | undefined) => boolean;
  toggleWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);
const WISHLIST_STORAGE_KEY = 'shopstack_wishlist_v1';

function normalizeId(productOrId: any): string {
  if (!productOrId) return '';
  if (typeof productOrId === 'string') return productOrId.trim();
  const id = productOrId.id || productOrId._id;
  return typeof id === 'string' ? id.trim() : String(id || '').trim();
}

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { info, success } = useToast();

  const [items, setItems] = useState<Product[]>(() => {
    try {
      const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .map((p: any) => {
          const validId = normalizeId(p);
          return validId ? { ...p, id: validId } : null;
        })
        .filter((p: any): p is Product => p !== null && p.id.length > 0);
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const isInWishlist = useCallback(
    (productId: string | undefined): boolean => {
      const targetId = normalizeId(productId);
      if (!targetId) return false;
      return items.some((item) => normalizeId(item) === targetId);
    },
    [items]
  );

  const toggleWishlist = useCallback(
    (product: Product) => {
      const prodId = normalizeId(product);
      if (!prodId) return;

      const normalizedProduct: Product = {
        ...product,
        id: prodId
      };

      setItems((prevItems) => {
        const isAlreadyPresent = prevItems.some((item) => normalizeId(item) === prodId);

        if (isAlreadyPresent) {
          info(`Removed "${product.name}" from your wishlist.`);
          return prevItems.filter((item) => normalizeId(item) !== prodId);
        } else {
          success(`Saved "${product.name}" to your wishlist!`);
          return [...prevItems.filter((item) => normalizeId(item) !== prodId), normalizedProduct];
        }
      });
    },
    [info, success]
  );

  const removeFromWishlist = useCallback(
    (productId: string) => {
      const targetId = normalizeId(productId);
      if (!targetId) return;
      setItems((prev) => prev.filter((item) => normalizeId(item) !== targetId));
    },
    []
  );

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
