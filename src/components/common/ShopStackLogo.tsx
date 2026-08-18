import React from 'react';

interface ShopStackLogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'dark' | 'light';
  showText?: boolean;
  className?: string;
}

export const ShopStackLogo: React.FC<ShopStackLogoProps> = ({
  size = 'md',
  variant = 'dark',
  showText = true,
  className = ''
}) => {
  const iconSizeClasses = {
    sm: 'w-7 h-7 rounded-lg',
    md: 'w-8 h-8 rounded-xl',
    lg: 'w-10 h-10 rounded-2xl'
  };

  const svgSize = {
    sm: 18,
    md: 20,
    lg: 26
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  const isLight = variant === 'light';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <div
        className={`${iconSizeClasses[size]} ${
          isLight ? 'bg-zinc-800 border border-zinc-700 shadow-xs' : 'bg-[#1A1A1A] shadow-xs'
        } flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105`}
      >
        <svg
          width={svgSize[size]}
          height={svgSize[size]}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Top diamond layer */}
          <path
            d="M12 2.5L20.5 7.5L12 12.5L3.5 7.5L12 2.5Z"
            fill="#FAF92A"
          />
          {/* Middle stack layer */}
          <path
            d="M3.5 12L12 17L20.5 12"
            stroke="#FDBF2D"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Bottom stack layer */}
          <path
            d="M3.5 16.5L12 21.5L20.5 16.5"
            stroke={isLight ? '#FAF92A' : '#FFFFFF'}
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {showText && (
        <span
          className={`font-bold tracking-tight ${textSizeClasses[size]} ${
            isLight ? 'text-white' : 'text-[#1A1A1A]'
          }`}
        >
          Shop<span className="text-[#FDBF2D]">Stack</span>
        </span>
      )}
    </div>
  );
};
