import React from 'react';
import { Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SpiceLevelProps {
  level: 0 | 1 | 2 | 3;
  showText?: boolean;
  className?: string;
}

export const SpiceLevel: React.FC<SpiceLevelProps> = ({ level, showText = false, className }) => {
  if (level === 0) return null;

  const labels = ['', 'Mild Spice', 'Medium Spicy', 'Fiery Hot'];

  return (
    <div
      className={cn('inline-flex items-center gap-1 select-none', className)}
      title={labels[level]}
      aria-label={labels[level]}
    >
      <div className="flex items-center gap-0.5">
        {[1, 2, 3].map((step) => (
          <Flame
            key={step}
            className={cn(
              'w-3.5 h-3.5 transition-colors',
              step <= level ? 'fill-[#FF5A6E] text-[#FF5A6E]' : 'fill-transparent text-[#E0D8D0]'
            )}
          />
        ))}
      </div>
      {showText && (
        <span className="text-xs font-medium text-content-secondary">
          {labels[level]}
        </span>
      )}
    </div>
  );
};
