'use client';

import React, { useState, useEffect } from 'react';
import { Order, MenuItem, WaterTankStatus } from '@/types';
import { orderService } from '@/lib/orderService';
import { useLanguageStore } from '@/lib/store';
import { translations } from '@/lib/i18n';
import menuData from '@/data/mock/menu.json';
import { Flame, Droplet, Clock, CheckCircle2, Layers, Filter } from 'lucide-react';

export interface KdsProductionViewProps {
  orders: Order[];
}

export const KdsProductionView: React.FC<KdsProductionViewProps> = ({ orders }) => {
  const { language } = useLanguageStore();
  const t = translations[language].production;
  const tWater = translations[language].water;

  const [activeStation, setActiveStation] = useState<string>('all');
  const [waterTank, setWaterTank] = useState<WaterTankStatus | null>(null);

  useEffect(() => {
    orderService.getWaterTankStatus().then(setWaterTank);
    const unsub = orderService.subscribeToWaterTank(setWaterTank);
    return () => unsub();
  }, []);

  // Compute live active orders in cooking or sent
  const activeOrders = orders.filter((o) => o.status === 'cooking' || o.status === 'sent');

  // Aggregate batch production quantities across all active tickets
  const dishQuantities: Record<string, { name: string; quantity: number; station: string; veg: string }> = {};

  activeOrders.forEach((order) => {
    order.items.forEach((item) => {
      const match = (menuData as MenuItem[]).find((m) => m.id === item.menuItemId);
      const station = match?.station || 'wok';

      if (!dishQuantities[item.name]) {
        dishQuantities[item.name] = {
          name: item.name,
          quantity: item.quantity,
          station,
          veg: item.vegType,
        };
      } else {
        dishQuantities[item.name].quantity += item.quantity;
      }
    });
  });

  const batchItems = Object.values(dishQuantities).filter((dish) => {
    if (activeStation === 'all') return true;
    return dish.station === activeStation;
  });

  const stations = [
    { id: 'all', label: t.allStations, icon: '🔥' },
    { id: 'tandoor', label: t.tandoor, icon: '🍢' },
    { id: 'wok', label: t.wok, icon: '🥘' },
    { id: 'biryani', label: t.biryani, icon: '🍚' },
    { id: 'breads', label: t.breads, icon: '🫓' },
    { id: 'bar', label: t.bar, icon: '🥭' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner: Water Tank Live Utility Gauge in Kitchen */}
      {waterTank && (
        <div className="p-4 rounded-3xl bg-[#1E1B18] border border-[#332C26] flex flex-col sm:flex-row items-center justify-between gap-4 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center font-bold">
              <Droplet className="w-6 h-6 fill-primary/30" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-heading font-black text-base text-white">
                  {tWater.waterTankTitle}
                </h4>
                <span className="px-2 py-0.5 rounded-full bg-[#2DBE7E]/20 text-[#2DBE7E] text-[11px] font-bold">
                  RO Pure ({waterTank.tdsPpm} PPM)
                </span>
              </div>
              <p className="text-xs text-[#A89689]">
                Live Reservoir: {waterTank.currentLiters} L / {waterTank.capacityLiters} L ({Math.round((waterTank.currentLiters / waterTank.capacityLiters) * 100)}%)
              </p>
            </div>
          </div>

          {/* Quick refill action */}
          <button
            onClick={() => orderService.refillWaterTank(500)}
            className="px-4 py-2 rounded-pill bg-[#2E2824] hover:bg-primary hover:text-white text-xs font-bold transition-all text-[#FFC233] border border-[#FFC233]/30"
          >
            +500L Quick Tank Refill
          </button>
        </div>
      )}

      {/* Station Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {stations.map((st) => (
          <button
            key={st.id}
            onClick={() => setActiveStation(st.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-pill text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeStation === st.id
                ? 'bg-primary text-white shadow-accent'
                : 'bg-[#1E1B18] text-[#C4BBB4] border border-[#332C26] hover:bg-[#2A2420]'
            }`}
          >
            <span>{st.icon}</span>
            <span>{st.label}</span>
          </button>
        ))}
      </div>

      {/* Live Batch Aggregation Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-[#847C76] px-1 font-mono">
          <span>{t.batchSummary} ({batchItems.length} active recipes)</span>
          <span>Aggregated from {activeOrders.length} live tickets</span>
        </div>

        {batchItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {batchItems.map((dish, i) => (
              <div
                key={i}
                className="p-4 rounded-3xl bg-[#1A1715] border border-[#2B241F] flex items-center justify-between shadow-soft hover:border-primary/50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#241F1C] border border-white/5 flex items-center justify-center font-heading font-black text-2xl text-[#FFC233]">
                    {dish.quantity}x
                  </div>
                  <div>
                    <h5 className="font-heading font-bold text-base text-white leading-tight">
                      {dish.name}
                    </h5>
                    <span className="text-xs text-[#847C76] capitalize">
                      Station: {dish.station}
                    </span>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-[#FF7A45]/20 text-[#FFC0A8] text-xs font-bold">
                  On Fire 🔥
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-[#847C76] space-y-2 bg-[#171412] rounded-3xl border border-[#2B241F]">
            <CheckCircle2 className="w-10 h-10 mx-auto opacity-30 text-[#2DBE7E]" />
            <p className="text-sm font-medium">No pending production batches for this station!</p>
          </div>
        )}
      </div>
    </div>
  );
};
