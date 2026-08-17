import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Percent,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { api } from '../services/api';
import { Product, Category } from '../types';
import { ProductCard } from '../components/product/ProductCard';
import { CategoryCard } from '../components/product/CategoryCard';
import { ProductGridSkeleton } from '../components/common/LoadingSkeleton';

export const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        setIsLoading(true);
        const [prodRes, catRes] = await Promise.all([
          api.getProducts({ limit: 12 }),
          api.getCategories()
        ]);
        setAllProducts(prodRes.products);
        setFeaturedProducts(prodRes.products.filter((p) => p.featured));
        setCategories(catRes.categories);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadHomeData();
  }, []);

  const displayProducts =
    selectedCategory === 'All'
      ? allProducts
      : allProducts.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 py-6 sm:py-8 space-y-12">
      {/* Hero Section — Clean Minimalist Utility */}
      <section className="relative rounded-3xl bg-[#F9F9F9] border border-gray-100 px-6 sm:px-12 py-12 lg:py-16 overflow-hidden">
        <div className="relative z-10 max-w-xl space-y-6">
          <div className="inline-flex items-center gap-2 bg-[#FAF92A]/50 border border-[#FDBF2D]/50 px-3 py-1 rounded-full text-xs font-bold text-[#1A1A1A]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>New Season Catalog 2026</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-[#1A1A1A]">
            Everything You Need. <br />
            <span className="text-gray-400 font-normal">All in One Place.</span>
          </h1>

          <p className="text-gray-500 text-base sm:text-lg leading-relaxed max-w-md">
            Discover quality products curated for your daily life, starting at affordable prices with fast, reliable shipping.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to="/shop"
              className="bg-[#FAF92A] text-[#1A1A1A] px-8 py-3.5 rounded-xl font-bold shadow-xs hover:shadow-md border border-[#FDBF2D] transition-all inline-flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Shop Now</span>
            </Link>

            <Link
              to="/shop?category=Electronics"
              className="bg-white text-[#1A1A1A] px-8 py-3.5 rounded-xl font-bold border border-gray-200 hover:bg-gray-50 transition-all"
            >
              Explore Audio & Tech
            </Link>
          </div>
        </div>

        {/* Diagonal Utility Accent */}
        <div
          className="hidden md:block absolute right-0 top-0 h-full w-1/2 bg-[#FAF92A] opacity-15 pointer-events-none"
          style={{ clipPath: 'polygon(25% 0, 100% 0, 100% 100%, 0% 100%)' }}
        />

        {/* Floating Promotion Card */}
        <div className="hidden lg:flex absolute right-16 top-1/2 -translate-y-1/2 w-80 h-52 bg-white rounded-3xl shadow-xl border border-gray-100 items-center justify-center p-6 z-10">
          <div className="text-center">
            <div className="w-14 h-14 bg-[#FAF92A] border border-[#FDBF2D] rounded-full mx-auto mb-3 flex items-center justify-center font-bold text-xl text-[#1A1A1A]">
              %
            </div>
            <p className="font-bold text-lg text-[#1A1A1A]">Summer Specials</p>
            <p className="text-gray-400 text-xs mb-3">Up to 30% Off on tech & living essentials</p>
            <Link
              to="/shop?discount=true"
              className="text-xs font-bold text-amber-700 hover:underline"
            >
              Browse Deals →
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories Row */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-gray-100">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Featured Categories
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                selectedCategory === 'All'
                  ? 'bg-[#1A1A1A] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c.name}
                onClick={() => setSelectedCategory(c.name)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                  selectedCategory === c.name
                    ? 'bg-[#FAF92A] text-[#1A1A1A] border border-[#FDBF2D]'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Category overview cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <CategoryCard key={cat.name} category={cat} />
          ))}
        </div>
      </section>

      {/* Product Grid Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1A1A1A]">
              {selectedCategory === 'All' ? 'Curated Products' : `${selectedCategory} Collection`}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Tested for durability, ergonomic simplicity, and daily reliability.
            </p>
          </div>

          <Link
            to="/shop"
            className="text-xs sm:text-sm font-bold text-[#1A1A1A] hover:text-amber-700 transition-colors flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <ProductGridSkeleton count={8} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {displayProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </section>

      {/* Trust & Guarantee Utility Badges */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-8 border-t border-gray-100">
        <div className="p-5 rounded-2xl bg-white border border-gray-100 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-[#1A1A1A] shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-[#1A1A1A]">Free Expedited Delivery</h4>
            <p className="text-[11px] text-gray-400">On all orders over $50</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-100 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-[#1A1A1A] shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-[#1A1A1A]">2-Year Warranty</h4>
            <p className="text-[11px] text-gray-400">Guaranteed authentic goods</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-100 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-[#1A1A1A] shrink-0">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-[#1A1A1A]">30-Day Easy Returns</h4>
            <p className="text-[11px] text-gray-400">Hassle-free refunds</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-100 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-[#1A1A1A] shrink-0">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-[#1A1A1A]">24/7 Expert Support</h4>
            <p className="text-[11px] text-gray-400">Ready to assist anytime</p>
          </div>
        </div>
      </section>
    </div>
  );
};
