import React from 'react';
import { Button } from './Button';
import { cn } from '@/lib/utils';
import { Utensils } from 'lucide-react';

export interface EmptyStateProps {
  emoji?: string;
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  emoji,
  icon,
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
      <div className="w-16 h-16 rounded-3xl bg-canvas border border-borderSubtle flex items-center justify-center mb-4 shadow-soft">
        {icon || <Utensils className="w-8 h-8 text-primary/60" />}
      </div>
      <h3 className="font-heading font-black text-xl sm:text-2xl text-content-primary mb-2">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-content-secondary max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary" size="md" className="font-bold shadow-accent">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
