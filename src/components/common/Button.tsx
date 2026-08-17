import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'dark' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold tracking-tight rounded-xl transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const sizeStyles = {
    sm: 'px-3.5 py-1.5 text-xs gap-1.5 rounded-lg',
    md: 'px-5 py-2.5 text-xs sm:text-sm gap-2 rounded-xl',
    lg: 'px-7 py-3 text-sm sm:text-base gap-2.5 rounded-xl'
  }[size];

  const variantStyles = {
    primary: 'bg-[#FAF92A] text-[#1A1A1A] border border-[#FDBF2D] hover:bg-[#eae820] shadow-xs active:scale-[0.98]',
    secondary: 'bg-[#FDBF2D] text-[#1A1A1A] hover:bg-[#f0b020] shadow-xs active:scale-[0.98]',
    dark: 'bg-[#1A1A1A] text-white hover:bg-black shadow-xs active:scale-[0.98]',
    outline: 'bg-white text-[#1A1A1A] border border-gray-200 hover:bg-gray-50 active:scale-[0.98]',
    ghost: 'text-[#1A1A1A] hover:bg-gray-100 active:bg-gray-200',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-xs active:scale-[0.98]'
  }[variant];

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
