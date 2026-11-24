'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { TableStatusCard } from '@/components/waiter/TableStatusCard';
import { WaiterOrderDetailDrawer } from '@/components/waiter/WaiterOrderDetailDrawer';
import { WaiterPlaceOrderModal } from '@/components/waiter/WaiterPlaceOrderModal';
import { LanguageSwitcher } from '@/components/customer/LanguageSwitcher';
import { orderService, WaiterCall } from '@/lib/orderService';
import { Table, Order } from '@/types';
import tablesData from '@/data/mock/tables.json';
import { restaurantConfig } from '@/config/restaurant.config';
import {
  BellRing,
  Volume2,
  VolumeX,
  Users,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  QrCode,
  ArrowLeft,
  Droplet,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WaiterAppPage() {
  const [tables, setTables] = useState<Table[]>(tablesData as Table[]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [waiterCalls, setWaiterCalls] = useState<WaiterCall[]>([]);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [isPunchModalOpen, setIsPunchModalOpen] = useState(false);
  const [punchTableId, setPunchTableId] = useState<string>('1');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [bannerAlert, setBannerAlert] = useState<string | null>(null);

  // Subscribe to live orders and waiter help calls
  useEffect(() => {
    const unsubOrders = orderService.subscribeToOrders((latestOrders) => {
      setOrders(latestOrders);
    });

    const unsubCalls = orderService.subscribeToWaiterCalls((latestCalls) => {
      setWaiterCalls(latestCalls);
      if (latestCalls.length > 0) {
        const topCall = latestCalls[0];
        let detail = topCall.type.replace('_', ' ').toUpperCase();
        if (topCall.type === 'water') {
          detail = `Water (${topCall.waterType?.toUpperCase() || 'NORMAL'})`;
        } else if (topCall.type === 'clean_table') {
          detail = `Table Cleaning (${topCall.cleanDetails || 'Full Wipe & Clear'})`;
        }
        setBannerAlert(
          `Table ${topCall.tableNumber} is requesting: ${detail}!`
        );
        setTimeout(() => setBannerAlert(null), 6000);
      }
    });

    return () => {
      unsubOrders();
      unsubCalls();
    };
  }, []);

  const handleApproveOrder = async (orderId: string) => {
    await orderService.updateOrderStatus(orderId, 'cooking');
    const updated = await orderService.getOrders();
    setOrders(updated);
  };

  const handleClearTable = async (tableId: string) => {
    const order = orders.find((o) => o.tableId === tableId && o.status !== 'served');
    if (order) {
      await orderService.updateOrderStatus(order.id, 'served');
    }
    await orderService.clearWaiterCall(tableId);
    setSelectedTable(null);
  };

  const totalTables = tables.length;
  const occupiedCount = tables.filter((t) =>
    orders.some((o) => o.tableId === t.id && o.status !== 'served')
  ).length;
  const helpCount = waiterCalls.length;
  const freeCount = totalTables - occupiedCount;

  return (
    <div className="min-h-screen bg-canvas p-4 sm:p-6 md:p-8 flex flex-col font-sans transition-colors duration-300">
      {/* Header Bar */}
      <header className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-borderSubtle">
        <div className="flex items-center gap-3.5 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sun text-content-primary flex items-center justify-center font-heading font-black text-2xl shadow-sun">
              TF
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading font-black text-2xl text-content-primary">
                  {restaurantConfig.name} Captain & Waiter Hub
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                  Live Floor
                </span>
              </div>
              <p className="text-xs text-content-secondary">
                Tablet Floor Overview · Instant Order Approvals & Assistance
              </p>
            </div>
          </div>
        </div>

        {/* Floor Metrics Pill Counter & Language Switcher */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-pill bg-surface border border-[#2DBE7E]/30 text-xs font-bold shadow-soft">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2DBE7E]" />
            <span className="text-content-secondary">Free:</span>
            <span className="font-heading text-sm text-content-primary font-black">
              {freeCount}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-pill bg-surface border border-[#FFC233]/40 text-xs font-bold shadow-soft">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF7A45]" />
            <span className="text-content-secondary">Occupied:</span>
            <span className="font-heading text-sm text-content-primary font-black">
              {occupiedCount}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-pill bg-surface border border-[#FF5A6E]/40 text-xs font-bold shadow-soft">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5A6E] animate-pulse" />
            <span className="text-content-secondary">Assistance:</span>
            <span className="font-heading text-sm text-[#FF5A6E] font-black">
              {helpCount}
            </span>
          </div>

          <LanguageSwitcher />

          {/* Audio Chime Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2.5 rounded-full border transition-all ${
              soundEnabled
                ? 'bg-surface text-content-primary border-borderSubtle'
                : 'bg-status-alert/15 text-status-alert border-status-alert/30'
            }`}
            title={soundEnabled ? 'Chime Active' : 'Muted'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <Link
            href="/kitchen"
            className="px-3.5 py-2 rounded-pill bg-surface border border-borderSubtle text-content-primary font-bold text-xs hover:border-primary transition-all shadow-soft"
          >
            Switch to Kitchen
          </Link>
        </div>
      </header>

      {/* Real-time Notification Banner for Help Calls */}
      <AnimatePresence>
        {bannerAlert && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-4 rounded-3xl bg-[#FFF2F4] border-2 border-[#FF5A6E] shadow-lifted flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-status-alert text-white flex items-center justify-center font-bold">
                <BellRing className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div>
                <h4 className="font-heading font-black text-base text-[#FF5A6E]">
                  Captain Attention Required
                </h4>
                <p className="text-xs font-semibold text-content-primary">{bannerAlert}</p>
              </div>
            </div>

            <button
              onClick={() => setBannerAlert(null)}
              className="text-xs font-bold px-3 py-1.5 rounded-full bg-[#FF5A6E] text-white hover:brightness-95"
            >
              Acknowledge
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Floor Grid (12 Tables) */}
      <main className="flex-1 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          {tables.map((table) => {
            const activeOrder = orders.find(
              (o) => o.tableId === table.id && o.status !== 'served' && o.status !== 'cancelled'
            );
            const activeCall = waiterCalls.find((c) => c.tableId === table.id);

            return (
              <TableStatusCard
                key={table.id}
                table={table}
                activeOrder={activeOrder}
                activeCall={activeCall}
                onClick={() => setSelectedTable(table)}
              />
            );
          })}
        </div>
      </main>

      {/* Table Detail Drawer */}
      <WaiterOrderDetailDrawer
        isOpen={Boolean(selectedTable)}
        onClose={() => setSelectedTable(null)}
        table={selectedTable}
        activeOrder={
          selectedTable
            ? orders.find(
                (o) =>
                  o.tableId === selectedTable.id &&
                  o.status !== 'served' &&
                  o.status !== 'cancelled'
              )
            : undefined
        }
        activeCall={
          selectedTable
            ? waiterCalls.find((c) => c.tableId === selectedTable.id)
            : undefined
        }
        onOpenOrderModal={(tableId) => {
          setPunchTableId(tableId);
          setIsPunchModalOpen(true);
        }}
        onApproveOrder={handleApproveOrder}
        onClearTable={handleClearTable}
      />

      {/* Waiter-Assisted Order Punch Modal */}
      <WaiterPlaceOrderModal
        isOpen={isPunchModalOpen}
        onClose={() => setIsPunchModalOpen(false)}
        tableId={punchTableId}
        tableNumber={parseInt(punchTableId, 10) || 1}
      />
    </div>
  );
}
