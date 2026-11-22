'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { orderService } from '@/lib/orderService';
import { WaterTankStatus, StockItem } from '@/types';
import { useLanguageStore } from '@/lib/store';
import { translations } from '@/lib/i18n';
import { formatCurrency, formatTimeElapsed } from '@/lib/utils';
import {
  Droplets,
  Droplet,
  PackageCheck,
  AlertTriangle,
  Plus,
  RefreshCw,
  Sliders,
  CheckCircle2,
  TrendingDown,
  ShieldCheck,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

export const AdminStockWaterManager: React.FC = () => {
  const { language } = useLanguageStore();
  const t = translations[language].stock;
  const tWater = translations[language].water;

  const [waterTank, setWaterTank] = useState<WaterTankStatus | null>(null);
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [isModifyCapacityOpen, setIsModifyCapacityOpen] = useState(false);
  const [newCapacity, setNewCapacity] = useState('2500');

  useEffect(() => {
    orderService.getWaterTankStatus().then((tank) => {
      setWaterTank(tank);
      setNewCapacity(tank.capacityLiters.toString());
    });
    orderService.getStockItems().then(setStockItems);

    const unsubTank = orderService.subscribeToWaterTank(setWaterTank);
    const unsubStock = orderService.subscribeToStock(setStockItems);
    return () => {
      unsubTank();
      unsubStock();
    };
  }, []);

  const handleRefillWater = async (liters: number) => {
    await orderService.refillWaterTank(liters);
  };

  const handleSaveCapacity = async () => {
    const cap = parseInt(newCapacity, 10) || 2500;
    await orderService.modifyWaterTankCapacity(cap);
    setIsModifyCapacityOpen(false);
  };

  const handleRestock = async (itemId: string, addQty: number) => {
    await orderService.restockItem(itemId, addQty);
  };

  if (!waterTank) return null;

  const waterPercent = Math.round((waterTank.currentLiters / waterTank.capacityLiters) * 100);

  return (
    <div className="space-y-8">
      {/* SECTION 1: Commercial Restaurant Water Tank & RO Plant Management */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-heading font-black text-2xl text-content-primary flex items-center gap-2">
              <Droplets className="w-6 h-6 text-primary" />
              <span>{tWater.waterTankTitle}</span>
            </h3>
            <p className="text-xs text-content-secondary mt-0.5">
              Centralized RO filtration, commercial reservoir level & customer dining refill system.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsModifyCapacityOpen(true)}
              leftIcon={<Sliders className="w-4 h-4" />}
              className="flex-1 sm:flex-none text-xs"
            >
              Modify Tank Capacity
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleRefillWater(1000)}
              leftIcon={<Plus className="w-4 h-4" />}
              className="flex-1 sm:flex-none text-xs font-bold shadow-accent"
            >
              +1,000L Refill
            </Button>
          </div>
        </div>

        {/* Water Tank Metrics Card */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Main Visual Fill Level */}
          <Card padding="md" className="md:col-span-2 space-y-4 bg-gradient-to-br from-surface to-canvas">
            <div className="flex items-center justify-between">
              <span className="font-heading font-bold text-sm text-content-primary">
                Current Water Tank Fill Level
              </span>
              <span className="font-mono text-xs font-black px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                {waterPercent}% Capacity
              </span>
            </div>

            {/* Visual Reservoir Bar */}
            <div className="space-y-1.5">
              <div className="w-full h-8 rounded-2xl bg-canvas border border-borderSubtle overflow-hidden p-1 flex items-center">
                <div
                  className="h-full rounded-xl bg-gradient-to-r from-primary via-sun to-status-success transition-all duration-500 shadow-sm"
                  style={{ width: `${Math.min(100, waterPercent)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs font-mono font-bold text-content-secondary">
                <span>0 L</span>
                <span className="text-primary font-black">{waterTank.currentLiters} Liters available</span>
                <span>{waterTank.capacityLiters} L Max</span>
              </div>
            </div>

            <div className="pt-2 border-t border-borderSubtle flex items-center justify-between text-xs text-content-secondary">
              <span>Last Refilled: {formatTimeElapsed(waterTank.lastRefilledAt)}</span>
              <button
                onClick={() => handleRefillWater(waterTank.capacityLiters - waterTank.currentLiters)}
                className="font-bold text-primary hover:underline"
              >
                Fill to 100% Full
              </button>
            </div>
          </Card>

          {/* RO Membrane Health */}
          <Card padding="md" className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-content-muted">
                {tWater.roHealth}
              </span>
              <ShieldCheck className="w-5 h-5 text-status-success" />
            </div>
            <div className="font-heading font-black text-3xl text-status-success">
              {waterTank.roHealthPercent}%
            </div>
            <div className="text-xs text-content-secondary">
              Water Purity: <strong className="text-content-primary">{waterTank.tdsPpm} PPM (Safe)</strong>
            </div>
          </Card>

          {/* Daily Consumption */}
          <Card padding="md" className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-content-muted">
                Daily Usage
              </span>
              <Droplet className="w-5 h-5 text-primary" />
            </div>
            <div className="font-heading font-black text-3xl text-content-primary">
              {waterTank.dailyConsumptionLiters} L
            </div>
            <div className="text-xs text-content-secondary">
              Kitchen prep: 420L · Drinking: 230L
            </div>
          </Card>
        </div>
      </div>

      {/* SECTION 2: General Raw Stock & Inventory Maintenance */}
      <div className="space-y-4">
        <div>
          <h3 className="font-heading font-black text-2xl text-content-primary">
            {t.title}
          </h3>
          <p className="text-xs text-content-secondary mt-0.5">
            {t.subtitle}
          </p>
        </div>

        {/* Desktop PC Table View */}
        <div className="hidden md:block bg-surface rounded-3xl border border-borderSubtle overflow-hidden shadow-soft">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-canvas border-b border-borderSubtle font-heading font-black text-content-secondary uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Commodity Item</th>
                <th className="py-3.5 px-3">Category</th>
                <th className="py-3.5 px-3">Current Reserves</th>
                <th className="py-3.5 px-3">Min Threshold</th>
                <th className="py-3.5 px-3">Unit Cost</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-4 text-right">Quick Restock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderSubtle font-medium">
              {stockItems.map((item) => (
                <tr key={item.id} className="hover:bg-canvas/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-heading font-bold text-content-primary">
                      {item.name}
                    </div>
                    <span className="text-[11px] text-content-muted">
                      Updated {formatTimeElapsed(item.lastRestocked)}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded-full bg-canvas text-content-secondary text-xs uppercase font-bold">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-mono font-bold text-content-primary">
                    {item.currentQty} {item.unit}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-content-muted">
                    {item.minThreshold} {item.unit}
                  </td>
                  <td className="py-3.5 px-3 font-mono">
                    {formatCurrency(item.costPerUnit)}/{item.unit}
                  </td>
                  <td className="py-3.5 px-3">
                    {item.status === 'in_stock' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-status-success/15 text-status-success text-xs font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>In Stock</span>
                      </span>
                    ) : item.status === 'low_stock' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sun/20 text-[#8F6200] text-xs font-bold">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Low Stock</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-status-alert/15 text-status-alert text-xs font-bold">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Reorder</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleRestock(item.id, 25)}
                      className="px-3 py-1.5 rounded-pill bg-primary/10 text-primary hover:bg-primary hover:text-white font-bold text-xs transition-all shadow-xs"
                    >
                      +25 {item.unit}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Phone Card View */}
        <div className="md:hidden space-y-3">
          {stockItems.map((item) => (
            <Card key={item.id} padding="md" className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h5 className="font-heading font-bold text-sm text-content-primary">
                    {item.name}
                  </h5>
                  <span className="text-[11px] text-content-muted capitalize">
                    {item.category} · {formatCurrency(item.costPerUnit)}/{item.unit}
                  </span>
                </div>
                {item.status === 'in_stock' ? (
                  <span className="px-2 py-0.5 rounded-full bg-status-success/15 text-status-success text-[11px] font-bold">
                    Normal
                  </span>
                ) : item.status === 'low_stock' ? (
                  <span className="px-2 py-0.5 rounded-full bg-sun/20 text-[#8F6200] text-[11px] font-bold">
                    Low Stock
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-status-alert/15 text-status-alert text-[11px] font-bold">
                    Reorder
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-borderSubtle">
                <span className="font-mono font-bold text-content-primary">
                  {item.currentQty} {item.unit} available
                </span>
                <button
                  onClick={() => handleRestock(item.id, 25)}
                  className="px-3 py-1 rounded-pill bg-primary/10 text-primary font-bold text-xs"
                >
                  +25 Restock
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Modify Tank Capacity Modal */}
      <Modal
        isOpen={isModifyCapacityOpen}
        onClose={() => setIsModifyCapacityOpen(false)}
        maxWidth="sm"
        title="Modify Water Reservoir Capacity"
      >
        <div className="space-y-4 pt-1">
          <p className="text-xs text-content-secondary leading-relaxed">
            Update the physical commercial RO water reservoir capacity for Table Flow. This re-calibrates percentage gauges on both Kitchen and Admin displays.
          </p>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-content-primary">
              Tank Capacity (in Liters)
            </label>
            <input
              type="number"
              value={newCapacity}
              onChange={(e) => setNewCapacity(e.target.value)}
              min="500"
              max="20000"
              step="100"
              className="w-full h-11 px-3.5 rounded-2xl bg-canvas border border-borderSubtle font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="pt-2 flex gap-2">
            <Button
              variant="ghost"
              size="md"
              className="flex-1"
              onClick={() => setIsModifyCapacityOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              className="flex-1 font-bold shadow-accent"
              onClick={handleSaveCapacity}
            >
              Save Capacity
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
