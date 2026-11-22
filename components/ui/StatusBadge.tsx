import React from 'react';
import { OrderStatus } from '@/types';
import { Send, CheckCircle2, Flame, BellRing, Sparkles, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', className }) => {
  const configs: Record<
    OrderStatus,
    { label: string; icon: React.ReactNode; bg: string; text: string; border: string; pulse?: boolean }
  > = {
    sent: {
      label: 'Sent',
      icon: <Send className="w-3.5 h-3.5" />,
      bg: 'bg-status-info/10',
      text: 'text-status-info',
      border: 'border-status-info/20',
    },
    accepted: {
      label: 'Accepted',
      icon: <BellRing className="w-3.5 h-3.5" />,
      bg: 'bg-sun/20',
      text: 'text-[#9A6700]',
      border: 'border-sun/40',
    },
    cooking: {
      label: 'Cooking',
      icon: <Flame className="w-3.5 h-3.5 animate-bounce" />,
      bg: 'bg-primary/15',
      text: 'text-primary',
      border: 'border-primary/30',
      pulse: true,
    },
    ready: {
      label: 'Ready',
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      bg: 'bg-status-success/15',
      text: 'text-status-success',
      border: 'border-status-success/30',
    },
    served: {
      label: 'Served',
      icon: <Sparkles className="w-3.5 h-3.5" />,
      bg: 'bg-[#52443C]/10',
      text: 'text-[#52443C]',
      border: 'border-[#52443C]/20',
    },
    cancelled: {
      label: 'Cancelled',
      icon: <XCircle className="w-3.5 h-3.5" />,
      bg: 'bg-status-alert/10',
      text: 'text-status-alert',
      border: 'border-status-alert/20',
    },
  };

  const current = configs[status] || configs.sent;

  const sizes = {
    sm: 'text-xs px-2.5 py-1 gap-1',
    md: 'text-sm px-3.5 py-1.5 gap-1.5',
    lg: 'text-base px-4 py-2 gap-2',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-bold rounded-pill border select-none transition-all duration-200',
        current.bg,
        current.text,
        current.border,
        sizes[size],
        current.pulse && 'animate-pulse',
        className
      )}
    >
      {current.icon}
      <span>{current.label}</span>
    </span>
  );
};
