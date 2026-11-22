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

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsModifyCapacityOpen(true)}
              leftIcon={<Sliders className="w-4 h-4" />}
            >
              Modify Tank Capacity
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleRefillWater(1000)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              +1,000L Refill Tank
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
              Water Purity: <strong className="text-content-primary">{waterTank.tdsPpm} PPM (Excellent)</strong>
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

        <div className="bg-surface rounded-3xl border border-borderSubtle overflow-hidden shadow-soft">
          <div className="overflow-x-auto">
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
              <tbody className="divide-y divide-borderSubtle">
                {stockItems.map((item) => (
                  <tr key={item.id} className="hover:bg-canvas/50 transition-colors">
                    <td className="py-3.5 px-4 font-heading font-bold text-sm text-content-primary">
                      {item.name}
                    </td>
                    <td className="py-3.5 px-3 capitalize text-content-secondary font-medium">
                      {item.category}
                    </td>
                    <td className="py-3.5 px-3 font-heading font-black text-base text-content-primary">
                      {item.currentQty} <span className="text-xs font-normal text-content-muted">{item.unit}</span>
                    </td>
                    <td className="py-3.5 px-3 text-content-secondary">
                      {item.minThreshold} {item.unit}
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-content-primary">
                      {formatCurrency(item.costPerUnit)}
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          item.status === 'in_stock'
                            ? 'bg-status-success/15 text-status-success'
                            : item.status === 'low_stock'
                            ? 'bg-sun/25 text-[#9A6700]'
                            : 'bg-status-alert/15 text-status-alert animate-pulse'
                        }`}
                      >
                        {item.status === 'in_stock' ? t.inStock : item.status === 'low_stock' ? t.lowStock : t.critical}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleRestock(item.id, item.minThreshold)}
                        className="px-3 py-1.5 rounded-pill bg-canvas hover:bg-surface border border-borderSubtle hover:border-primary font-bold text-xs text-primary transition-all shadow-sm"
                      >
                        + Restock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modify Tank Capacity Modal */}
      <Modal
        isOpen={isModifyCapacityOpen}
        onClose={() => setIsModifyCapacityOpen(false)}
        title="Modify Water Tank Capacity"
        maxWidth="sm"
      >
        <div className="space-y-4 pt-1">
          <div>
            <label className="text-xs font-bold text-content-secondary block mb-1">
              New Commercial Tank Volume (Liters)
            </label>
            <input
              type="number"
              value={newCapacity}
              onChange={(e) => setNewCapacity(e.target.value)}
              className="w-full p-3 rounded-2xl bg-canvas border border-borderSubtle font-heading font-black text-xl text-content-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="secondary" size="md" className="flex-1" onClick={() => setIsModifyCapacityOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" className="flex-1 font-bold" onClick={handleSaveCapacity}>
              Save Capacity
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
