'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Order, MenuItem, WaterTankStatus } from '@/types';
import { useLanguageStore } from '@/lib/store';
import { translations } from '@/lib/i18n';
import {
  Layers,
  Flame,
  CookingPot,
  Soup,
  UtensilsCrossed,
  Wine,
  Clock,
  CheckCircle2,
  AlertCircle,
  Droplet,
  ShieldCheck,
} from 'lucide-react';

export interface KdsProductionViewProps {
  orders: Order[];
  waterTank?: WaterTankStatus | null;
  onBatchComplete?: (station: string, dishName: string) => void;
}

export const KdsProductionView: React.FC<KdsProductionViewProps> = ({
  orders,
  waterTank,
}) => {
  const { language } = useLanguageStore();
  const t = translations[language].production;
  const tWater = translations[language].water;

  const [activeStation, setActiveStation] = useState<string>('all');

  // Aggregate pending/cooking items across active orders
  const activeOrders = orders.filter(
    (o) => o.status === 'sent' || o.status === 'accepted' || o.status === 'cooking'
  );

  interface AggregatedDish {
    name: string;
    totalQuantity: number;
    station: string;
    tables: number[];
    vegType: 'veg' | 'non-veg';
    notes: string[];
  }

  const dishQuantities: Record<string, AggregatedDish> = {};

  activeOrders.forEach((order) => {
    order.items.forEach((item) => {
      const key = item.name;
      if (!dishQuantities[key]) {
        let detectedStation = 'wok';
        const lower = key.toLowerCase();
        if (lower.includes('tikka') || lower.includes('kebab') || lower.includes('tandoor')) {
          detectedStation = 'tandoor';
        } else if (lower.includes('biryani')) {
          detectedStation = 'biryani';
        } else if (lower.includes('naan') || lower.includes('roti') || lower.includes('paratha')) {
          detectedStation = 'breads';
        } else if (lower.includes('lassi') || lower.includes('chai') || lower.includes('shake') || lower.includes('coffee')) {
          detectedStation = 'bar';
        }

        dishQuantities[key] = {
          name: item.name,
          totalQuantity: 0,
          station: detectedStation,
          tables: [],
          vegType: item.vegType,
          notes: [],
        };
      }

      dishQuantities[key].totalQuantity += item.quantity;
      if (!dishQuantities[key].tables.includes(order.tableNumber)) {
        dishQuantities[key].tables.push(order.tableNumber);
      }
      if (item.notes && !dishQuantities[key].notes.includes(item.notes)) {
        dishQuantities[key].notes.push(item.notes);
      }
    });
  });

  const batchItems = Object.values(dishQuantities).filter((dish) => {
    if (activeStation === 'all') return true;
    return dish.station === activeStation;
  });

  const stations = [
    { id: 'all', label: t.allStations, icon: <Layers className="w-4 h-4" /> },
    { id: 'tandoor', label: t.tandoor, icon: <Flame className="w-4 h-4 text-primary" /> },
    { id: 'wok', label: t.wok, icon: <CookingPot className="w-4 h-4 text-sun" /> },
    { id: 'biryani', label: t.biryani, icon: <Soup className="w-4 h-4 text-status-success" /> },
    { id: 'breads', label: t.breads, icon: <UtensilsCrossed className="w-4 h-4 text-info" /> },
    { id: 'bar', label: t.bar, icon: <Wine className="w-4 h-4 text-[#E5A020]" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner: Water Tank Live Utility Gauge in Kitchen */}
      {waterTank && (
        <div className="p-4 rounded-3xl bg-[#1C1C20] border border-borderSubtle flex flex-col sm:flex-row items-center justify-between gap-4 text-white shadow-soft">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center font-bold">
              <Droplet className="w-6 h-6 fill-primary/30" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-heading font-black text-base text-white">
                  {tWater.waterTankTitle}
                </h4>
                <span className="px-2 py-0.5 rounded-full bg-status-success/20 text-status-success text-[11px] font-bold">
                  RO Pure ({waterTank.tdsPpm} PPM)
                </span>
              </div>
              <p className="text-xs text-[#A89689]">
                Live Reservoir: {waterTank.currentLiters} L / {waterTank.capacityLiters} L ({Math.round((waterTank.currentLiters / waterTank.capacityLiters) * 100)}%)
              </p>
            </div>
          </div>

          <div className="w-full sm:w-48 space-y-1">
            <div className="h-3 rounded-full bg-black/40 overflow-hidden border border-white/10 p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-status-success"
                style={{ width: `${Math.round((waterTank.currentLiters / waterTank.capacityLiters) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-white/60 font-mono">
              <span>0L</span>
              <span>Available Water</span>
              <span>{waterTank.capacityLiters}L</span>
            </div>
          </div>
        </div>
      )}

      {/* Station Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {stations.map((st) => (
          <button
            key={st.id}
            onClick={() => setActiveStation(st.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-pill font-heading font-black text-xs sm:text-sm whitespace-nowrap transition-all ${
              activeStation === st.id
                ? 'bg-primary text-white shadow-accent'
                : 'bg-[#1C1C20] text-[#A89689] border border-borderSubtle hover:bg-[#25252A]'
            }`}
          >
            <span>{st.icon}</span>
            <span>{st.label}</span>
          </button>
        ))}
      </div>

      {/* Aggregated Batch Grid */}
      {batchItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {batchItems.map((batch, idx) => (
            <Card
              key={idx}
              padding="md"
              className="bg-[#1C1C20] border-borderSubtle text-white space-y-3 relative overflow-hidden"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        batch.vegType === 'veg' ? 'bg-status-success' : 'bg-status-alert'
                      }`}
                    />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#A89689]">
                      {batch.station} station
                    </span>
                  </div>
                  <h4 className="font-heading font-black text-xl text-white">
                    {batch.name}
                  </h4>
                </div>

                <div className="w-14 h-14 rounded-2xl bg-primary/20 text-primary border border-primary/30 flex flex-col items-center justify-center font-heading font-black shrink-0">
                  <span className="text-2xl leading-none">{batch.totalQuantity}</span>
                  <span className="text-[10px] uppercase font-bold text-white/70">Portions</span>
                </div>
              </div>

              {/* Tables Breakdown */}
              <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 space-y-1">
                <span className="text-[11px] font-bold text-[#A89689] block">
                  Active Table Handis:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {batch.tables.map((tNum) => (
                    <span
                      key={tNum}
                      className="px-2.5 py-0.5 rounded-full bg-sun/20 text-sun font-bold text-xs"
                    >
                      Table {tNum}
                    </span>
                  ))}
                </div>
              </div>

              {/* Special Cooking Notes */}
              {batch.notes.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-status-alert block">
                    Customer Instructions:
                  </span>
                  <div className="space-y-0.5 text-xs text-status-alert/90 italic">
                    {batch.notes.map((note, nIdx) => (
                      <div key={nIdx}>• {note}</div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between border-t border-white/10 text-xs text-[#A89689]">
                <span className="inline-flex items-center gap-1 text-primary font-bold">
                  <Flame className="w-3.5 h-3.5" />
                  <span>Active Batch</span>
                </span>
                <span>Prioritize Dum Time</span>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl bg-[#1C1C20] border border-borderSubtle text-[#A89689] space-y-2">
          <CheckCircle2 className="w-10 h-10 mx-auto text-status-success mb-2" />
          <h4 className="font-heading font-bold text-lg text-white">
            All Current Batches Cleared
          </h4>
          <p className="text-xs max-w-sm mx-auto">
            No pending items in queue for the {activeStation} station. Ready for incoming orders.
          </p>
        </div>
      )}
    </div>
  );
};
