import React from 'react';
import { LucideIcon, PackageOpen } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = PackageOpen,
  title,
  description,
  actionText,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white rounded-3xl border border-gray-100 max-w-md mx-auto my-8">
      <div className="w-16 h-16 rounded-2xl bg-[#FAF92A]/30 border border-[#FDBF2D]/40 text-[#1A1A1A] flex items-center justify-center mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-base sm:text-lg font-bold text-[#1A1A1A] tracking-tight mb-1">{title}</h3>
      <p className="text-xs sm:text-sm text-gray-500 max-w-xs mb-6">{description}</p>
      {actionText && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
