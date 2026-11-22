'use client';

import React from 'react';
import { Table, Order } from '@/types';
import { WaiterCall } from '@/lib/orderService';
import { Users, Clock, BellRing, Receipt, Check, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export interface TableStatusCardProps {
  table: Table;
  activeOrder?: Order;
  activeCall?: WaiterCall;
  onClick: () => void;
}

export const TableStatusCard: React.FC<TableStatusCardProps> = ({
  table,
  activeOrder,
  activeCall,
  onClick,
}) => {
  // Determine table state
  let stateKey: 'free' | 'occupied' | 'needs_help' | 'bill_pending' = 'free';

  if (activeCall) {
    stateKey = 'needs_help';
  } else if (activeOrder) {
    if (activeOrder.status === 'ready' || activeOrder.paymentStatus === 'paid_online') {
      stateKey = 'bill_pending';
    } else {
      stateKey = 'occupied';
    }
  }

  const styles = {
    free: {
      border: 'border-[#2DBE7E]/30',
      bg: 'bg-white',
      badgeBg: 'bg-[#2DBE7E]/15 text-[#2DBE7E]',
      label: 'Free',
      dot: 'bg-[#2DBE7E]',
      pulse: false,
    },
    occupied: {
      border: 'border-[#FFC233]/40',
      bg: 'bg-white',
      badgeBg: 'bg-[#FFC233]/25 text-[#9A6700]',
      label: 'Occupied',
      dot: 'bg-[#FF7A45]',
      pulse: false,
    },
    needs_help: {
      border: 'border-[#FF5A6E] shadow-[0_0_20px_rgba(255,90,110,0.25)]',
      bg: 'bg-[#FFF2F4]',
      badgeBg: 'bg-[#FF5A6E] text-white',
      label: activeCall?.type === 'water' ? 'Needs Water' : activeCall?.type === 'bill' ? 'Wants Bill' : 'Needs Help!',
      dot: 'bg-[#FF5A6E]',
      pulse: true,
    },
    bill_pending: {
      border: 'border-[#3A2A22]/20',
      bg: 'bg-[#F9F6F0]',
      badgeBg: 'bg-[#3A2A22] text-white',
      label: 'Bill Pending',
      dot: 'bg-[#3A2A22]',
      pulse: false,
    },
  };

  const current = styles[stateKey];

  return (
    <motion.button
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`rounded-3xl p-5 border text-left transition-all duration-200 shadow-soft hover:shadow-lifted flex flex-col justify-between min-h-[160px] relative overflow-hidden ${current.bg} ${current.border}`}
    >
      <div>
        {/* Table Number & Status Pill */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="font-heading font-black text-2xl sm:text-3xl text-content-primary">
            Table {table.number}
          </span>

          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${current.badgeBg} ${
              current.pulse ? 'animate-pulse' : ''
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${current.dot}`} />
            <span>{current.label}</span>
          </span>
        </div>

        {/* Capacity */}
        <div className="flex items-center gap-1.5 text-xs text-content-muted">
          <Users className="w-3.5 h-3.5" />
          <span>Seats up to {table.capacity} guests</span>
        </div>
      </div>

      {/* Order Info or Help Alert Footer */}
      <div className="pt-3 border-t border-borderSubtle">
        {activeCall ? (
          <div className="flex items-center gap-2 text-xs font-bold text-[#FF5A6E]">
            <BellRing className="w-4 h-4 shrink-0 animate-bounce" />
            <span className="line-clamp-1">Customer requested assistance</span>
          </div>
        ) : activeOrder ? (
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-content-primary">
              {activeOrder.orderNumber} ({activeOrder.items.length} items)
            </span>
            <span className="capitalize font-mono px-2 py-0.5 rounded-md bg-canvas font-bold text-primary">
              {activeOrder.status}
            </span>
          </div>
        ) : (
          <div className="text-xs text-content-muted flex items-center gap-1">
            <Check className="w-3.5 h-3.5 text-[#2DBE7E]" />
            <span>Table clean & ready</span>
          </div>
        )}
      </div>
    </motion.button>
  );
};
