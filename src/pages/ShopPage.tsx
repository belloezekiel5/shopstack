import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, ArrowUpDown, X, Star, Check } from 'lucide-react';
import { api } from '../services/api';
import { Product, Category } from '../types';
import { ProductCard } from '../components/product/ProductCard';
import { ProductGridSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/common/Button';

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // Filter States from URL or defaults
  const categoryParam = searchParams.get('category') || 'All';
  const queryParam = searchParams.get('q') || '';
  const sortParam = searchParams.get('sort') || 'newest';
  const minPriceParam = searchParams.get('minPrice') || '';
  const maxPriceParam = searchParams.get('maxPrice') || '';
  const inStockParam = searchParams.get('inStock') === 'true';
  const discountParam = searchParams.get('discount') === 'true';

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [prodRes, catRes] = await Promise.all([
          api.getProducts({
            category: categoryParam,
            q: queryParam,
            sort: sortParam,
            minPrice: minPriceParam,
            maxPrice: maxPriceParam,
            inStock: inStockParam ? 'true' : undefined,
            limit: 50
          }),
          api.getCategories()
        ]);

        let list = prodRes.products;
        if (discountParam) {
          list = list.filter((p) => p.discountPrice && p.discountPrice < p.price);
        }

        setProducts(list);
        setTotalCount(list.length);
        setCategories(catRes.categories);
      } catch (err) {
        console.error('Failed to load shop catalog:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [categoryParam, queryParam, sortParam, minPriceParam, maxPriceParam, inStockParam, discountParam]);

  const updateFilter = (key: string, value: string | boolean | null) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value === null || value === '' || value === false || value === 'All') {
      nextParams.delete(key);
    } else {
      nextParams.set(key, String(value));
    }
    setSearchParams(nextParams);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 py-6 sm:py-8 space-y-6">
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1A1A]">
            {categoryParam !== 'All' ? `${categoryParam}` : discountParam ? 'Deals & Specials' : 'All Products'}
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Showing {totalCount} {totalCount === 1 ? 'result' : 'results'}
            {queryParam && ` for "${queryParam}"`}
          </p>
        </div>

        {/* Controls: Sorting & Mobile Filter Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="lg:hidden inline-flex items-center gap-1.5 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-[#1A1A1A]"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-medium">
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={sortParam}
              onChange={(e) => updateFilter('sort', e.target.value)}
              className="bg-transparent text-[#1A1A1A] font-semibold focus:outline-none cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="name_asc">Name: A to Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Layout: Filters Sidebar + Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside
          className={`lg:block space-y-6 ${
            isMobileFilterOpen
              ? 'block fixed inset-0 z-50 bg-white p-6 overflow-y-auto'
              : 'hidden'
          }`}
        >
          {isMobileFilterOpen && (
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 lg:hidden">
              <h3 className="font-bold text-sm text-[#1A1A1A]">Filters</h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 text-gray-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Categories Filter */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Categories</h4>
            <div className="space-y-1">
              <button
                onClick={() => updateFilter('category', 'All')}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                  categoryParam === 'All'
                    ? 'bg-[#FAF92A] text-[#1A1A1A] font-bold border border-[#FDBF2D]'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span>All Categories</span>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => updateFilter('category', cat.name)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                    categoryParam === cat.name
                      ? 'bg-[#FAF92A] text-[#1A1A1A] font-bold border border-[#FDBF2D]'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="text-[10px] text-gray-400">{cat.count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2 pt-4 border-t border-gray-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Price ($)</h4>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPriceParam}
                onChange={(e) => updateFilter('minPrice', e.target.value)}
                className="w-full text-xs p-2 bg-gray-50 border border-gray-200 rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#FDBF2D]"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPriceParam}
                onChange={(e) => updateFilter('maxPrice', e.target.value)}
                className="w-full text-xs p-2 bg-gray-50 border border-gray-200 rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#FDBF2D]"
              />
            </div>
          </div>

          {/* In Stock & Deals Toggle */}
          <div className="space-y-2 pt-4 border-t border-gray-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Availability</h4>
            <label className="flex items-center gap-2.5 text-xs text-gray-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockParam}
                onChange={(e) => updateFilter('inStock', e.target.checked)}
                className="rounded text-[#1A1A1A] accent-[#FAF92A] focus:ring-0"
              />
              <span>In Stock Only</span>
            </label>
            <label className="flex items-center gap-2.5 text-xs text-gray-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={discountParam}
                onChange={(e) => updateFilter('discount', e.target.checked)}
                className="rounded text-[#1A1A1A] accent-[#FAF92A] focus:ring-0"
              />
              <span>Discounted Items</span>
            </label>
          </div>

          {/* Reset Filters */}
          <div className="pt-4 border-t border-gray-100">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={clearAllFilters}
            >
              Reset Filters
            </Button>
          </div>
        </aside>

        {/* Catalog Grid Area */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <ProductGridSkeleton count={9} />
          ) : products.length === 0 ? (
            <EmptyState
              title="No products matched your criteria"
              description="Try relaxing your price filters or search for another keyword."
              actionText="Reset Filters"
              onAction={clearAllFilters}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {products.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
