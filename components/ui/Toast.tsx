'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ToastProps {
  id: string;
  type?: 'success' | 'alert' | 'info';
  title: string;
  message?: string;
  onClose?: () => void;
  className?: string;
}

export const Toast: React.FC<ToastProps> = ({
  type = 'info',
  title,
  message,
  onClose,
  className,
}) => {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-status-success shrink-0" />,
    alert: <AlertTriangle className="w-5 h-5 text-status-alert shrink-0" />,
    info: <Bell className="w-5 h-5 text-primary shrink-0" />,
  };

  const borders = {
    success: 'border-status-success/30',
    alert: 'border-status-alert/30',
    info: 'border-primary/30',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={cn(
        'flex items-start gap-3 p-4 rounded-2xl bg-surface border shadow-lifted min-w-[280px] max-w-md',
        borders[type],
        className
      )}
    >
      {icons[type]}
      <div className="flex-1 pr-1">
        <h5 className="font-heading font-bold text-sm text-content-primary">{title}</h5>
        {message && <p className="text-xs text-content-secondary mt-0.5">{message}</p>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-content-muted hover:text-content-primary transition-colors p-1"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
};
