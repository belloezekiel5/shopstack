import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingBag, Eye } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isFavorite = isInWishlist(product.id);
  const effectivePrice = product.discountPrice ?? product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  return (
    <div className="group flex flex-col h-full bg-white p-3 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all hover:shadow-xs">
      {/* Product Image Stage */}
      <div className="aspect-[4/3] bg-gray-100 rounded-2xl mb-3 relative overflow-hidden flex items-center justify-center">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Badge in top-left */}
        {hasDiscount ? (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase shadow-xs">
            -{discountPercent}%
          </div>
        ) : product.featured ? (
          <div className="absolute top-3 left-3 bg-[#FAF92A] text-[#1A1A1A] text-[10px] font-bold px-2 py-0.5 rounded uppercase border border-[#FDBF2D]">
            Featured
          </div>
        ) : product.stock <= 5 ? (
          <div className="absolute top-3 left-3 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
            Low Stock
          </div>
        ) : (
          <div className="absolute top-3 left-3 bg-[#FAF92A] text-[#1A1A1A] text-[10px] font-bold px-2 py-0.5 rounded uppercase border border-[#FDBF2D]">
            New
          </div>
        )}

        {/* Wishlist toggle in top-right */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-1.5 rounded-full backdrop-blur-md transition-colors ${
            isFavorite
              ? 'bg-rose-50 text-rose-600 shadow-xs'
              : 'bg-white/80 text-gray-600 hover:text-rose-600 hover:bg-white'
          }`}
          title={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Info & Price Section */}
      <Link to={`/products/${product.id}`} className="flex-1 flex flex-col justify-between">
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase font-bold text-gray-400 mb-0.5 truncate">
              {product.category} • {product.brand}
            </p>
            <h4 className="font-semibold text-sm text-[#1A1A1A] group-hover:text-amber-700 transition-colors line-clamp-1">
              {product.name}
            </h4>
          </div>

          {/* Rating pill */}
          <div className="flex items-center gap-1 shrink-0 bg-gray-50 px-1.5 py-0.5 rounded text-[11px] font-bold text-gray-700">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{product.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Pricing */}
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-bold text-sm sm:text-base text-[#1A1A1A]">
            ${effectivePrice.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-gray-400 line-through">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>
      </Link>

      {/* Action Button */}
      <button
        type="button"
        id={`add-to-cart-${product.id}`}
        onClick={(e) => {
          e.preventDefault();
          addToCart(product, 1);
        }}
        className="mt-3 w-full bg-[#FAF92A] text-[#1A1A1A] py-2 rounded-xl text-xs font-bold border border-[#FDBF2D] hover:bg-[#eae820] transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]"
      >
        <ShoppingBag className="w-3.5 h-3.5" />
        <span>Add to Cart</span>
      </button>
    </div>
  );
};
