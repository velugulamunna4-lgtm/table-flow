import React from 'react';
import { VegType } from '@/types';
import { cn } from '@/lib/utils';

export interface VegIndicatorProps {
  type: VegType;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const VegIndicator: React.FC<VegIndicatorProps> = ({
  type,
  size = 'md',
  showLabel = false,
  className,
}) => {
  const isVeg = type === 'veg';

  const containerSizes = {
    sm: 'w-4 h-4 p-[2px]',
    md: 'w-5 h-5 p-[3px]',
    lg: 'w-6 h-6 p-1',
  };

  return (
    <div className={cn('inline-flex items-center gap-1.5 select-none', className)}>
      <div
        className={cn(
          'flex items-center justify-center rounded-[4px] border-2 bg-white shrink-0',
          containerSizes[size],
          isVeg ? 'border-[#2DBE7E]' : 'border-[#FF5A6E]'
        )}
        aria-label={isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
        title={isVeg ? 'Pure Vegetarian' : 'Non-Vegetarian'}
      >
        {isVeg ? (
          <div className="w-full h-full rounded-full bg-[#2DBE7E]" />
        ) : (
          <div
            className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[8px] border-b-[#FF5A6E]"
            style={{
              borderLeftWidth: size === 'sm' ? '3px' : '4px',
              borderRightWidth: size === 'sm' ? '3px' : '4px',
              borderBottomWidth: size === 'sm' ? '6px' : '8px',
            }}
          />
        )}
      </div>
      {showLabel && (
        <span
          className={cn(
            'text-xs font-bold uppercase tracking-wider',
            isVeg ? 'text-[#2DBE7E]' : 'text-[#FF5A6E]'
          )}
        >
          {isVeg ? 'Veg' : 'Non-Veg'}
        </span>
      )}
    </div>
  );
};
