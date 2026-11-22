'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'sun' | 'secondary' | 'alert' | 'success' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-sans font-semibold rounded-pill select-none transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.97]';

    const variants = {
      primary:
        'bg-primary text-white shadow-accent hover:bg-primary-hover focus-visible:ring-primary',
      sun: 'bg-sun text-content-primary shadow-sun hover:brightness-95 focus-visible:ring-sun font-bold',
      secondary:
        'bg-white text-content-primary border border-borderSubtle shadow-soft hover:bg-[#FAF4EB] focus-visible:ring-primary',
      alert:
        'bg-status-alert text-white shadow-soft hover:brightness-95 focus-visible:ring-status-alert',
      success:
        'bg-status-success text-white shadow-soft hover:brightness-95 focus-visible:ring-status-success',
      ghost:
        'bg-transparent text-content-primary hover:bg-black/5 active:bg-black/10 focus-visible:ring-primary',
      outline:
        'border-2 border-primary text-primary bg-transparent hover:bg-primary/10 focus-visible:ring-primary',
    };

    const sizes = {
      sm: 'h-10 px-4 text-sm gap-1.5 min-w-[80px]',
      md: 'h-12 px-6 text-base gap-2 min-w-[120px]',
      lg: 'h-14 px-8 text-lg gap-2.5 min-w-[140px]',
      icon: 'h-12 w-12 p-0 rounded-full',
    };

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.96 }}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-5 w-5 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Loading...</span>
          </span>
        ) : (
          <>
            {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
