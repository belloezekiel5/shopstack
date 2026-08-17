import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  Heart,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  Check,
  ChevronRight,
  Send,
  MessageSquare
} from 'lucide-react';
import { api } from '../services/api';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import { ProductCard } from '../components/product/ProductCard';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { user } = useAuth();
  const { success, error } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Review submission
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);

  useEffect(() => {
    async function loadProduct() {
      if (!id) return;
      try {
        setIsLoading(true);
        const res = await api.getProductById(id);
        setProduct(res.product);
        setRelated(res.related);
        setSelectedImage(res.product.images[0]);
        setQuantity(1);
      } catch (err: any) {
        error(err.message || 'Product not found.');
        navigate('/shop');
      } finally {
        setIsLoading(false);
      }
    }
    loadProduct();
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    if (!user) {
      navigate('/login');
      return;
    }
    if (!reviewComment.trim()) {
      error('Please write a review comment.');
      return;
    }

    try {
      setIsSubmittingReview(true);
      const res = await api.addReview(product.id, {
        rating: reviewRating,
        comment: reviewComment.trim()
      });
      setProduct(res.product);
      setReviewComment('');
      setReviewRating(5);
      success('Review posted successfully!');
    } catch (err: any) {
      error(err.message || 'Failed to submit review.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoading || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 py-12 animate-pulse space-y-8">
        <div className="h-6 w-32 bg-gray-100 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="aspect-square bg-gray-100 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 bg-gray-100 rounded" />
            <div className="h-4 w-1/4 bg-gray-100 rounded" />
            <div className="h-6 w-1/3 bg-gray-100 rounded" />
            <div className="h-24 bg-gray-100 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  const effectivePrice = product.discountPrice ?? product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const isFavorite = isInWishlist(product.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 py-6 sm:py-8 space-y-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-gray-400">
        <Link to="/" className="hover:text-[#1A1A1A]">
          Home
        </Link>
        <ChevronRight className="w-3 h-3" />
        <Link to={`/shop?category=${product.category}`} className="hover:text-[#1A1A1A]">
          {product.category}
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#1A1A1A] font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left: Product Images Stage (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-[4/3] bg-gray-50 rounded-3xl border border-gray-100 overflow-hidden relative flex items-center justify-center">
            <img
              src={selectedImage || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {hasDiscount && (
              <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                Sale
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    selectedImage === img
                      ? 'border-[#FAF92A] ring-2 ring-[#FDBF2D]/50'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <img src={img} alt={`${product.name} preview ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Buy Box & Specs (5 cols) */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                {product.brand} • {product.category}
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1A1A]">
                {product.name}
              </h1>
            </div>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-3">
              <div className="flex items-center text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(product.rating) ? 'fill-current' : 'text-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-gray-700">
                {product.rating.toFixed(1)} ({product.reviews?.length || 0} reviews)
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-xs font-medium text-gray-500 font-mono">
                {product.sku || 'SKU-001'}
              </span>
            </div>

            {/* Price section */}
            <div className="flex items-baseline gap-3 py-2 border-y border-gray-100">
              <span className="text-3xl font-bold text-[#1A1A1A]">${effectivePrice.toFixed(2)}</span>
              {hasDiscount && (
                <span className="text-base text-gray-400 line-through">
                  ${product.price.toFixed(2)}
                </span>
              )}
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  product.stock > 0
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-rose-50 text-rose-700'
                }`}
              >
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
              </span>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Controls: Quantity & Action Buttons */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="p-2 text-gray-500 hover:text-[#1A1A1A] disabled:opacity-30 cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center font-bold text-xs text-[#1A1A1A]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  className="p-2 text-gray-500 hover:text-[#1A1A1A] disabled:opacity-30 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                  isFavorite
                    ? 'bg-rose-50 border-rose-200 text-rose-600'
                    : 'bg-white border-gray-200 text-gray-600 hover:text-rose-600 hover:border-gray-300'
                }`}
                title={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full text-sm"
              disabled={product.stock <= 0}
              onClick={handleAddToCart}
              leftIcon={<ShoppingBag className="w-4 h-4" />}
            >
              {product.stock > 0 ? `Add to Cart • $${(effectivePrice * quantity).toFixed(2)}` : 'Out of Stock'}
            </Button>
          </div>

          {/* Delivery & Assurance checklist */}
          <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] text-gray-500">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#1A1A1A]" />
              <span>Ships in 24 hours</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#1A1A1A]" />
              <span>2-Year Warranty</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications & Reviews Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 border-t border-gray-100">
        {/* Left: Specifications Table (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <h3 className="text-base font-bold text-[#1A1A1A]">Technical Specifications</h3>
          <div className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden divide-y divide-gray-100 text-xs">
            {product.specifications && Object.entries(product.specifications).length > 0 ? (
              Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between p-3.5">
                  <span className="text-gray-500 font-medium">{key}</span>
                  <span className="font-semibold text-[#1A1A1A]">{value}</span>
                </div>
              ))
            ) : (
              <div className="p-4 text-gray-400 text-center">No additional specifications listed.</div>
            )}
          </div>
        </div>

        {/* Right: Reviews & Write a Review (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#1A1A1A]">
              Customer Reviews ({product.reviews?.length || 0})
            </h3>
          </div>

          {/* Review Submission Box */}
          <form
            onSubmit={handleReviewSubmit}
            className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1A1A1A]">Rate this product</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="p-0.5 focus:outline-none cursor-pointer"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        star <= reviewRating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-gray-200'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <textarea
              rows={2}
              placeholder="Share your experience with this item..."
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FDBF2D] text-[#1A1A1A]"
            />

            <div className="flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isSubmittingReview}
                leftIcon={<Send className="w-3 h-3" />}
              >
                Submit Review
              </Button>
            </div>
          </form>

          {/* Reviews List */}
          <div className="space-y-3">
            {!product.reviews || product.reviews.length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-400 bg-gray-50 rounded-2xl">
                No reviews yet. Be the first to review this product!
              </div>
            ) : (
              product.reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white p-4 rounded-2xl border border-gray-100 space-y-2 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={rev.userAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${rev.userName}`}
                        alt={rev.userName}
                        className="w-6 h-6 rounded-full object-cover bg-gray-100"
                      />
                      <span className="font-bold text-xs text-[#1A1A1A]">{rev.userName}</span>
                    </div>
                    <div className="flex items-center text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < rev.rating ? 'fill-current' : 'text-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">{rev.comment}</p>
                  <span className="text-[10px] text-gray-400">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Related Products Carousel/Grid */}
      {related.length > 0 && (
        <section className="space-y-4 pt-8 border-t border-gray-100">
          <h3 className="text-lg font-bold text-[#1A1A1A]">Related Essentials</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {related.map((relProd) => (
              <ProductCard key={relProd.id} product={relProd} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
