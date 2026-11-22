import React from 'react';
import { Button } from './Button';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  emoji?: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  emoji = '🍽️',
  title,
  description,
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-card bg-surface border border-dashed border-borderSubtle',
        className
      )}
    >
      <div className="text-5xl sm:text-6xl mb-4 select-none animate-bounce">{emoji}</div>
      <h3 className="font-heading font-bold text-xl sm:text-2xl text-content-primary mb-2">
        {title}
      </h3>
      <p className="text-sm sm:text-base text-content-secondary max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary" size="md">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
