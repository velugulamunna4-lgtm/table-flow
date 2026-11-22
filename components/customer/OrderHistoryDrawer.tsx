'use client';

import React, { useState, useEffect } from 'react';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { VegIndicator } from '@/components/ui/VegIndicator';
import { orderService } from '@/lib/orderService';
import { useLanguageStore } from '@/lib/store';
import { translations } from '@/lib/i18n';
import { formatCurrency, formatTimeElapsed } from '@/lib/utils';
import { Order } from '@/types';
import { Clock, Star, Receipt, ArrowRight } from 'lucide-react';

export interface OrderHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tableId: string;
  tableNumber: number;
  onOpenReview: (orderId?: string) => void;
}

export const OrderHistoryDrawer: React.FC<OrderHistoryDrawerProps> = ({
  isOpen,
  onClose,
  tableId,
  tableNumber,
  onOpenReview,
}) => {
  const { language } = useLanguageStore();
  const t = translations[language];

  const [historyOrders, setHistoryOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (isOpen) {
      orderService.getTableOrderHistory(tableId).then(setHistoryOrders);
    }
  }, [isOpen, tableId]);

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          <span>{t.orderHistory} · Table {tableNumber}</span>
        </div>
      }
    >
      <div className="space-y-4 pb-6">
        {historyOrders.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-canvas border border-borderSubtle flex items-center justify-center shadow-soft">
              <Receipt className="w-8 h-8 text-primary/60" />
            </div>
            <h4 className="font-heading font-bold text-lg text-content-primary">
              No orders placed yet
            </h4>
            <p className="text-xs text-content-secondary max-w-xs mx-auto">
              Your table orders will appear here as you dine.
            </p>
          </div>
        ) : (
          historyOrders.map((ord) => (
            <div
              key={ord.id}
              className="p-4 rounded-3xl bg-canvas border border-borderSubtle space-y-3 shadow-soft"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-heading font-black text-base text-content-primary">
                    {ord.orderNumber}
                  </span>
                  <span className="text-[11px] text-content-muted block">
                    {formatTimeElapsed(ord.createdAt)}
                  </span>
                </div>
                <StatusBadge status={ord.status} size="sm" />
              </div>

              {/* Items */}
              <div className="divide-y divide-borderSubtle/60 text-xs">
                {ord.items.map((item, i) => (
                  <div key={i} className="py-1.5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <VegIndicator type={item.vegType} size="sm" />
                      <span className="font-bold text-primary">{item.quantity}x</span>
                      <span className="text-content-primary font-medium">{item.name}</span>
                    </div>
                    <span className="font-bold text-content-primary">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-borderSubtle flex items-center justify-between text-xs font-bold">
                <span className="text-content-secondary">Total Amount</span>
                <span className="font-heading font-black text-sm text-primary">
                  {formatCurrency(ord.total)}
                </span>
              </div>

              {/* Review button */}
              <div className="pt-1">
                <button
                  onClick={() => {
                    onClose();
                    onOpenReview(ord.id);
                  }}
                  className="w-full py-2 px-3 rounded-pill bg-surface hover:bg-white border border-borderSubtle text-xs font-bold text-content-primary flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  <Star className="w-3.5 h-3.5 text-[#FFC233] fill-[#FFC233]" />
                  <span>Rate Dishes & Experience</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </BottomSheet>
  );
};
