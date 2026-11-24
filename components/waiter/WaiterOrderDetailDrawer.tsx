'use client';

import React from 'react';
import Link from 'next/link';
import { Table, Order } from '@/types';
import { WaiterCall, orderService } from '@/lib/orderService';
import { formatCurrency, formatTimeElapsed } from '@/lib/utils';
import { VegIndicator } from '@/components/ui/VegIndicator';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { X, Check, BellOff, ArrowRight, QrCode, Trash2, PlusCircle, Utensils, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface WaiterOrderDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  table: Table | null;
  activeOrder?: Order;
  activeCall?: WaiterCall;
  onOpenOrderModal: (tableId: string) => void;
  onApproveOrder: (orderId: string) => void;
  onClearTable: (tableId: string) => void;
}

export const WaiterOrderDetailDrawer: React.FC<WaiterOrderDetailDrawerProps> = ({
  isOpen,
  onClose,
  table,
  activeOrder,
  activeCall,
  onOpenOrderModal,
  onApproveOrder,
  onClearTable,
}) => {
  if (!table) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative z-10 w-full max-w-lg bg-surface border-l border-borderSubtle h-full flex flex-col p-6 shadow-2xl overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-borderSubtle">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-black text-2xl text-content-primary">
                    Table {table.number}
                  </h3>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-canvas text-content-secondary border border-borderSubtle">
                    Capacity {table.capacity}
                  </span>
                </div>
                <p className="text-xs text-content-secondary mt-0.5">
                  Real-time Captain & Waiter Overview
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-canvas flex items-center justify-center text-content-secondary hover:text-content-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Active Waiter Call Alert if present */}
            {activeCall && (
              <div
                className={`my-4 p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                  activeCall.type === 'clean_table'
                    ? 'bg-[#FFF9F2] border-[#FF7A45]'
                    : 'bg-[#FFF2F4] border-[#FF5A6E]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-full text-white flex items-center justify-center font-bold ${
                      activeCall.type === 'clean_table' ? 'bg-[#FF7A45]' : 'bg-[#FF5A6E]'
                    }`}
                  >
                    {activeCall.type === 'clean_table' ? (
                      <Sparkles className="w-5 h-5 text-white" />
                    ) : (
                      '!'
                    )}
                  </div>
                  <div>
                    <div
                      className={`font-heading font-bold text-sm ${
                        activeCall.type === 'clean_table' ? 'text-[#FF7A45]' : 'text-[#FF5A6E]'
                      }`}
                    >
                      {activeCall.type === 'clean_table'
                        ? 'Clean Table Request'
                        : `Customer Alert: ${activeCall.type.toUpperCase()}`}
                    </div>
                    {activeCall.type === 'clean_table' && activeCall.cleanDetails && (
                      <div className="text-xs font-semibold text-content-primary">
                        {activeCall.cleanDetails}
                      </div>
                    )}
                    <div className="text-xs text-content-secondary">
                      Requested {formatTimeElapsed(activeCall.timestamp)}
                    </div>
                  </div>
                </div>

                <button
                  onClick={async () => {
                    await orderService.clearWaiterCall(table.id);
                  }}
                  className={`px-3 py-1.5 rounded-full font-bold text-xs border transition-all flex items-center gap-1 shadow-sm ${
                    activeCall.type === 'clean_table'
                      ? 'bg-white text-[#FF7A45] border-[#FF7A45]/30 hover:bg-[#FF7A45] hover:text-white'
                      : 'bg-white text-[#FF5A6E] border-[#FF5A6E]/30 hover:bg-[#FF5A6E] hover:text-white'
                  }`}
                >
                  {activeCall.type === 'clean_table' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Mark Cleaned</span>
                    </>
                  ) : (
                    <>
                      <BellOff className="w-3.5 h-3.5" />
                      <span>Resolve</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Active Order Details or Empty State */}
            <div className="flex-1 py-4 space-y-4">
              {activeOrder ? (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-heading font-black text-lg text-content-primary">
                        {activeOrder.orderNumber}
                      </span>
                      <span className="text-xs text-content-muted block">
                        Placed {formatTimeElapsed(activeOrder.createdAt)}
                      </span>
                    </div>
                    <StatusBadge status={activeOrder.status} />
                  </div>

                  {/* Sent status approval action */}
                  {activeOrder.status === 'sent' && (
                    <div className="p-4 rounded-2xl bg-sun/20 border border-sun/50 space-y-2">
                      <div className="text-xs font-bold text-[#9A6700]">
                        Action Required: New customer self-order awaiting confirmation
                      </div>
                      <button
                        onClick={() => onApproveOrder(activeOrder.id)}
                        className="w-full h-12 rounded-pill bg-primary text-white font-bold text-base shadow-accent flex items-center justify-center gap-2 hover:bg-primary-hover active:scale-95 transition-all"
                      >
                        <Check className="w-5 h-5 stroke-[3]" />
                        <span>Approve & Send to Kitchen</span>
                      </button>
                    </div>
                  )}

                  {/* Items list */}
                  <div className="p-4 rounded-2xl bg-canvas border border-borderSubtle space-y-3">
                    <h5 className="font-heading font-bold text-xs text-content-secondary uppercase tracking-wider">
                      Ordered Dishes ({activeOrder.items.length})
                    </h5>

                    <div className="divide-y divide-borderSubtle">
                      {activeOrder.items.map((item, idx) => (
                        <div key={idx} className="py-2 flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <VegIndicator type={item.vegType} size="sm" />
                            <span className="font-heading font-black text-primary">
                              {item.quantity}x
                            </span>
                            <span className="font-medium text-content-primary">
                              {item.name}
                            </span>
                            {item.notes && (
                              <span className="text-xs text-status-alert font-bold">
                                [{item.notes}]
                              </span>
                            )}
                          </div>
                          <span className="font-bold text-content-primary">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-borderSubtle flex justify-between font-heading font-black text-lg text-content-primary">
                      <span>Total Bill</span>
                      <span className="text-primary">{formatCurrency(activeOrder.total)}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-12 text-center space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-3xl bg-canvas border border-borderSubtle flex items-center justify-center shadow-soft">
                    <Utensils className="w-8 h-8 text-primary/60" />
                  </div>
                  <h4 className="font-heading font-bold text-lg text-content-primary">
                    Table is currently free
                  </h4>
                  <p className="text-xs text-content-secondary max-w-xs mx-auto">
                    Guests can scan the table QR code to start ordering, or you can place an order directly.
                  </p>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="pt-4 border-t border-borderSubtle space-y-2.5">
              <button
                onClick={() => onOpenOrderModal(table.id)}
                className="w-full h-12 rounded-pill bg-sun text-content-primary font-bold text-sm shadow-sun hover:brightness-95 flex items-center justify-center gap-2 transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Place Order for Customer (Waiter Assist)</span>
              </button>

              <div className="flex gap-2">
                <Link
                  href={`/t/${table.id}`}
                  target="_blank"
                  className="flex-1 h-11 rounded-pill bg-white border border-borderSubtle hover:bg-canvas text-content-primary font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <QrCode className="w-4 h-4 text-primary" />
                  <span>Open Customer URL</span>
                </Link>

                {activeOrder && (
                  <button
                    onClick={() => onClearTable(table.id)}
                    className="flex-1 h-11 rounded-pill bg-white border border-borderSubtle hover:bg-canvas text-content-secondary hover:text-status-alert font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Clear Table</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
