import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-3.5 flex flex-col h-full animate-pulse">
      <div className="w-full aspect-square bg-gray-100 rounded-xl mb-3" />
      <div className="space-y-2 flex-1">
        <div className="h-3 w-16 bg-gray-100 rounded" />
        <div className="h-4 w-3/4 bg-gray-100 rounded" />
        <div className="h-3 w-12 bg-gray-100 rounded" />
      </div>
      <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
        <div className="h-5 w-16 bg-gray-100 rounded" />
        <div className="h-8 w-8 bg-gray-100 rounded-xl" />
      </div>
    </div>
  );
};

export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};
