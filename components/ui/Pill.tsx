'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface PillProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  active?: boolean;
  count?: number;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Pill = React.forwardRef<HTMLButtonElement, PillProps>(
  ({ className, active = false, count, icon, children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.95 }}
        className={cn(
          'inline-flex items-center gap-2 px-5 py-2.5 rounded-pill font-sans text-sm sm:text-base font-semibold select-none transition-all duration-200 border whitespace-nowrap',
          active
            ? 'bg-primary text-white border-primary shadow-accent'
            : 'bg-white text-content-primary border-borderSubtle hover:bg-[#FAF4EB] shadow-sm',
          className
        )}
        {...props}
      >
        {icon && <span className="inline-flex shrink-0">{icon}</span>}
        <span>{children}</span>
        {count !== undefined && (
          <span
            className={cn(
              'px-2 py-0.5 rounded-full text-xs font-bold transition-colors',
              active ? 'bg-white/20 text-white' : 'bg-canvas text-content-secondary'
            )}
          >
            {count}
          </span>
        )}
      </motion.button>
    );
  }
);

Pill.displayName = 'Pill';
