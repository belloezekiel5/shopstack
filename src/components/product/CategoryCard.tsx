import React from 'react';
import { Link } from 'react-router-dom';
import { Headphones, Laptop, Sparkles, Shirt, Home, Watch } from 'lucide-react';

interface CategoryCardProps {
  category: {
    name: string;
    count: number;
    image?: string;
  };
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const getIcon = () => {
    switch (category.name.toLowerCase()) {
      case 'electronics':
        return <Headphones className="w-5 h-5" />;
      case 'fashion':
        return <Shirt className="w-5 h-5" />;
      case 'home':
        return <Home className="w-5 h-5" />;
      case 'beauty':
        return <Sparkles className="w-5 h-5" />;
      case 'accessories':
        return <Watch className="w-5 h-5" />;
      default:
        return <Laptop className="w-5 h-5" />;
    }
  };

  return (
    <Link
      to={`/shop?category=${encodeURIComponent(category.name)}`}
      className="group bg-white rounded-2xl p-4 border border-gray-100 hover:border-gray-200 hover:shadow-xs transition-all flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 text-[#1A1A1A] group-hover:bg-[#FAF92A] group-hover:border-[#FDBF2D] transition-colors flex items-center justify-center">
          {getIcon()}
        </div>
        <div>
          <h4 className="font-bold text-xs sm:text-sm text-[#1A1A1A]">{category.name}</h4>
          <span className="text-[11px] text-gray-400">{category.count} items</span>
        </div>
      </div>
      <span className="text-gray-300 group-hover:text-[#1A1A1A] group-hover:translate-x-0.5 transition-all text-xs font-bold">
        →
      </span>
    </Link>
  );
};
