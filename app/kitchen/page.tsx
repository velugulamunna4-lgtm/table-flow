'use client';

import React, { useState, useEffect } from 'react';
import { KdsHeader } from '@/components/kitchen/KdsHeader';
import { KdsOrderCard } from '@/components/kitchen/KdsOrderCard';
import { KdsSoldOutDrawer } from '@/components/kitchen/KdsSoldOutDrawer';
import { orderService } from '@/lib/orderService';
import { Order, OrderStatus } from '@/types';
import { Send, Flame, CheckCircle2, Inbox } from 'lucide-react';

export default function KitchenDisplayPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isSoldOutOpen, setIsSoldOutOpen] = useState(false);

  // Fetch initial orders & subscribe to live orders
  useEffect(() => {
    const unsub = orderService.subscribeToOrders((latest) => {
      setOrders(latest);
    });
    return () => unsub();
  }, []);

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    await orderService.updateOrderStatus(orderId, status);
  };

  const handleRejectOrder = async (orderId: string, reason: string) => {
    await orderService.rejectOrderItem(orderId, 'all', reason);
    await orderService.updateOrderStatus(orderId, 'cancelled');
  };

  // Group orders by swimlane status
  const newOrders = orders.filter((o) => o.status === 'sent');
  const cookingOrders = orders.filter((o) => o.status === 'cooking' || o.status === 'accepted');
  const readyOrders = orders.filter((o) => o.status === 'ready');

  return (
    <div className="min-h-screen bg-[#12100E] text-white flex flex-col font-sans selection:bg-[#FF7A45]/30">
      {/* KDS Header with Live Clock & Counters */}
      <KdsHeader
        orderCounts={{
          new: newOrders.length,
          cooking: cookingOrders.length,
          ready: readyOrders.length,
        }}
        onOpenSoldOut={() => setIsSoldOutOpen(true)}
        onRefresh={async () => {
          const fresh = await orderService.getOrders();
          setOrders(fresh);
        }}
      />

      {/* Main KDS 3-Column Kanban Board */}
      <main className="flex-1 p-4 sm:p-6 overflow-x-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-w-[900px] h-full items-start">
          {/* Column 1: NEW / SENT */}
          <div className="bg-[#171412] rounded-3xl p-4 border border-[#2B241F] flex flex-col min-h-[70vh]">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#2B241F]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#8B6CF6]/20 text-[#8B6CF6] flex items-center justify-center font-bold">
                  <Send className="w-4 h-4" />
                </div>
                <h2 className="font-heading font-black text-xl text-white">
                  1. Incoming New
                </h2>
              </div>
              <span className="w-7 h-7 rounded-full bg-[#8B6CF6] text-white font-mono font-bold text-xs flex items-center justify-center">
                {newOrders.length}
              </span>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto pr-1">
              {newOrders.length > 0 ? (
                newOrders.map((ord) => (
                  <KdsOrderCard
                    key={ord.id}
                    order={ord}
                    onUpdateStatus={handleUpdateStatus}
                    onRejectOrder={handleRejectOrder}
                  />
                ))
              ) : (
                <div className="py-16 text-center text-[#847C76] space-y-2">
                  <Inbox className="w-10 h-10 mx-auto opacity-40" />
                  <p className="text-sm font-medium">No pending new orders</p>
                </div>
              )}
            </div>
          </div>

          {/* Column 2: COOKING / ON FLAME */}
          <div className="bg-[#171412] rounded-3xl p-4 border border-[#2B241F] flex flex-col min-h-[70vh]">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#2B241F]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FF7A45]/20 text-[#FF7A45] flex items-center justify-center font-bold">
                  <Flame className="w-4 h-4" />
                </div>
                <h2 className="font-heading font-black text-xl text-white">
                  2. Sizzling / Cooking
                </h2>
              </div>
              <span className="w-7 h-7 rounded-full bg-[#FF7A45] text-white font-mono font-bold text-xs flex items-center justify-center">
                {cookingOrders.length}
              </span>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto pr-1">
              {cookingOrders.length > 0 ? (
                cookingOrders.map((ord) => (
                  <KdsOrderCard
                    key={ord.id}
                    order={ord}
                    onUpdateStatus={handleUpdateStatus}
                  />
                ))
              ) : (
                <div className="py-16 text-center text-[#847C76] space-y-2">
                  <Flame className="w-10 h-10 mx-auto opacity-40" />
                  <p className="text-sm font-medium">All items plated or ready</p>
                </div>
              )}
            </div>
          </div>

          {/* Column 3: READY FOR PICKUP */}
          <div className="bg-[#171412] rounded-3xl p-4 border border-[#2B241F] flex flex-col min-h-[70vh]">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#2B241F]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#2DBE7E]/20 text-[#2DBE7E] flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <h2 className="font-heading font-black text-xl text-white">
                  3. Plated & Ready
                </h2>
              </div>
              <span className="w-7 h-7 rounded-full bg-[#2DBE7E] text-white font-mono font-bold text-xs flex items-center justify-center">
                {readyOrders.length}
              </span>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto pr-1">
              {readyOrders.length > 0 ? (
                readyOrders.map((ord) => (
                  <KdsOrderCard
                    key={ord.id}
                    order={ord}
                    onUpdateStatus={handleUpdateStatus}
                  />
                ))
              ) : (
                <div className="py-16 text-center text-[#847C76] space-y-2">
                  <CheckCircle2 className="w-10 h-10 mx-auto opacity-40" />
                  <p className="text-sm font-medium">No dishes waiting for pickup</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* 86 / Sold Out Drawer */}
      <KdsSoldOutDrawer
        isOpen={isSoldOutOpen}
        onClose={() => setIsSoldOutOpen(false)}
      />
    </div>
  );
}
