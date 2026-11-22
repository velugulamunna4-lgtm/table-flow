'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface QuantityStepperProps {
  quantity: number;
  onAdd: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
  disabled?: boolean;
  addLabel?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const QuantityStepper: React.FC<QuantityStepperProps> = ({
  quantity,
  onAdd,
  onIncrement,
  onDecrement,
  disabled = false,
  addLabel = 'Add',
  size = 'md',
  className,
}) => {
  const isSelected = quantity > 0;

  const heightClasses = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-4 text-base',
    lg: 'h-12 px-5 text-lg',
  };

  const btnSizes = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-9 h-9',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  if (disabled) {
    return (
      <button
        disabled
        className={cn(
          'inline-flex items-center justify-center rounded-pill bg-[#EBE4DC] text-content-muted font-semibold cursor-not-allowed select-none text-xs sm:text-sm px-4 h-10',
          className
        )}
      >
        Sold Out
      </button>
    );
  }

  return (
    <div className={cn('relative inline-flex items-center', className)}>
      <AnimatePresence mode="wait" initial={false}>
        {!isSelected ? (
          <motion.button
            key="add-btn"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onAdd();
            }}
            className={cn(
              'inline-flex items-center justify-center gap-1.5 rounded-pill font-bold select-none transition-all duration-200 bg-primary text-white shadow-accent hover:bg-primary-hover active:scale-95',
              heightClasses[size]
            )}
          >
            <Plus className={iconSizes[size]} strokeWidth={2.5} />
            <span>{addLabel}</span>
          </motion.button>
        ) : (
          <motion.div
            key="stepper"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={cn(
              'inline-flex items-center justify-between rounded-pill bg-primary text-white shadow-accent select-none p-1 gap-2 sm:gap-3',
              size === 'sm' ? 'h-9 min-w-[96px]' : size === 'lg' ? 'h-12 min-w-[130px]' : 'h-11 min-w-[115px]'
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={onDecrement}
              aria-label="Decrease quantity"
              className={cn(
                'flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors',
                btnSizes[size]
              )}
            >
              <Minus className={iconSizes[size]} strokeWidth={2.5} />
            </motion.button>

            <span className="font-heading font-bold text-base sm:text-lg tabular-nums px-1 text-center min-w-[20px]">
              {quantity}
            </span>

            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={onIncrement}
              aria-label="Increase quantity"
              className={cn(
                'flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors',
                btnSizes[size]
              )}
            >
              <Plus className={iconSizes[size]} strokeWidth={2.5} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
