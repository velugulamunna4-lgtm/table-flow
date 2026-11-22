'use client';

import React, { useState } from 'react';
import { Order, OrderStatus } from '@/types';
import { VegIndicator } from '@/components/ui/VegIndicator';
import { formatTimeElapsed } from '@/lib/utils';
import { Clock, AlertTriangle, Check, Flame, ArrowRight, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export interface KdsOrderCardProps {
  order: Order;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onRejectOrder?: (orderId: string, reason: string) => void;
}

export const KdsOrderCard: React.FC<KdsOrderCardProps> = ({
  order,
  onUpdateStatus,
  onRejectOrder,
}) => {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('Ingredients currently exhausted');

  // Compute elapsed minutes
  const createdTime = new Date(order.createdAt).getTime();
  const elapsedMinutes = Math.floor((Date.now() - createdTime) / (1000 * 60));
  const isUrgent = elapsedMinutes >= 15 && order.status !== 'ready' && order.status !== 'served';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`rounded-3xl p-5 border flex flex-col justify-between transition-all duration-300 ${
        isUrgent
          ? 'bg-[#2E1818] border-[#FF5A6E] shadow-[0_0_25px_rgba(255,90,110,0.3)]'
          : 'bg-[#1E1B18] border-[#332C26] hover:border-[#4D423A]'
      }`}
    >
      <div>
        {/* Header: Table Number & Urgency Timer */}
        <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight">
                Table {order.tableNumber}
              </span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-black/40 text-[#C4BBB4]">
                {order.orderNumber}
              </span>
            </div>
            <div className="text-xs text-[#847C76] mt-0.5">
              {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
            </div>
          </div>

          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-bold ${
              isUrgent
                ? 'bg-[#FF5A6E] text-white animate-pulse'
                : 'bg-[#2A2420] text-[#FFC233]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{elapsedMinutes}m ago</span>
          </div>
        </div>

        {/* Urgency Alert Banner if > 15 mins */}
        {isUrgent && (
          <div className="mb-3 px-3 py-1.5 rounded-xl bg-[#FF5A6E]/20 border border-[#FF5A6E]/50 flex items-center gap-2 text-xs font-bold text-[#FF8595]">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>URGENT: Waiting over 15 minutes!</span>
          </div>
        )}

        {/* Item List */}
        <div className="space-y-3 py-1">
          {order.items.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-baseline justify-between gap-2">
                <div className="flex items-baseline gap-2.5">
                  <span className="font-heading font-black text-2xl text-[#FFC233] tabular-nums shrink-0">
                    {item.quantity}x
                  </span>
                  <div className="flex items-center gap-1.5">
                    <VegIndicator type={item.vegType} size="sm" />
                    <span className="font-heading font-bold text-lg sm:text-xl text-white leading-tight">
                      {item.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* Cooking notes highlighted in terracotta */}
              {item.notes && (
                <div className="ml-8 px-2.5 py-1 rounded-xl bg-[#FF5A6E]/25 border border-[#FF5A6E]/40 text-[#FF8595] text-xs font-bold inline-block">
                  Note: {item.notes}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Customer overall table notes */}
        {order.customerNotes && (
          <div className="mt-3 p-2.5 rounded-xl bg-[#2A2420] border border-white/5 text-xs text-[#C4BBB4]">
            <span className="font-bold text-[#FF7A45]">Chef Note: </span>
            {order.customerNotes}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="pt-5 mt-4 border-t border-white/10 space-y-2">
        {order.status === 'sent' && (
          <div className="flex gap-2">
            <button
              onClick={() => onUpdateStatus(order.id, 'cooking')}
              className="flex-1 h-14 rounded-pill bg-[#FF7A45] hover:bg-[#E56734] text-white font-heading font-black text-lg flex items-center justify-center gap-2 shadow-accent active:scale-95 transition-all"
            >
              <Flame className="w-5 h-5" />
              <span>Accept & Cook</span>
            </button>
            <button
              onClick={() => setShowRejectModal(true)}
              className="h-14 px-4 rounded-pill bg-[#2E2824] hover:bg-[#FF5A6E]/30 text-[#FF8595] text-xs font-bold transition-all"
              title="Reject ticket"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        )}

        {order.status === 'cooking' && (
          <button
            onClick={() => onUpdateStatus(order.id, 'ready')}
            className="w-full h-14 rounded-pill bg-[#2DBE7E] hover:bg-[#25A26B] text-white font-heading font-black text-lg flex items-center justify-center gap-2 shadow-soft active:scale-95 transition-all"
          >
            <Check className="w-6 h-6 stroke-[3]" />
            <span>Mark Ready for Table</span>
          </button>
        )}

        {order.status === 'ready' && (
          <button
            onClick={() => onUpdateStatus(order.id, 'served')}
            className="w-full h-12 rounded-pill bg-[#2E2824] hover:bg-[#3E3630] text-[#9CE6C2] font-heading font-bold text-base flex items-center justify-center gap-2 border border-[#2DBE7E]/30 transition-all"
          >
            <ArrowRight className="w-4 h-4" />
            <span>Mark as Served</span>
          </button>
        )}

        {/* Reject Dialog */}
        {showRejectModal && (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
            <div className="bg-[#1E1B18] border border-[#3E3630] rounded-3xl p-6 max-w-sm w-full space-y-4">
              <h4 className="font-heading font-bold text-lg text-white">
                Reject Order for Table {order.tableNumber}?
              </h4>
              <p className="text-xs text-[#C4BBB4]">
                This sends a real-time alert back to the customer table screen.
              </p>
              <input
                type="text"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Reason (e.g. out of stock)"
                className="w-full p-3 rounded-xl bg-[#2E2824] border border-white/10 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#FF5A6E]"
              />
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1 py-2.5 rounded-pill bg-[#2E2824] text-[#C4BBB4] text-xs font-bold hover:bg-[#3E3630]"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onRejectOrder?.(order.id, rejectReason);
                    setShowRejectModal(false);
                  }}
                  className="flex-1 py-2.5 rounded-pill bg-[#FF5A6E] text-white text-xs font-bold hover:brightness-95"
                >
                  Confirm Reject
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
