'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LanguageSwitcher } from './LanguageSwitcher';
import { WaterRequestModal } from './WaterRequestModal';
import { OrderHistoryDrawer } from './OrderHistoryDrawer';
import { OrderReviewModal } from './OrderReviewModal';
import { useLanguageStore, useMenuStore } from '@/lib/store';
import { translations } from '@/lib/i18n';
import { restaurantConfig } from '@/config/restaurant.config';
import { orderService } from '@/lib/orderService';
import { Search, BellRing, Sparkles, X, Check, Droplet, Clock, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface CustomerHeaderProps {
  tableNumber: number;
  tableId: string;
}

export const CustomerHeader: React.FC<CustomerHeaderProps> = ({ tableNumber, tableId }) => {
  const { language } = useLanguageStore();
  const t = translations[language];
  const { searchQuery, setSearchQuery, dietaryFilter, setDietaryFilter } = useMenuStore();

  const [waiterCalled, setWaiterCalled] = useState(false);
  const [isWaterModalOpen, setIsWaterModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const handleCallWaiter = async () => {
    try {
      await orderService.callWaiter(tableId, tableNumber, 'call_waiter');
      setWaiterCalled(true);
      setTimeout(() => setWaiterCalled(false), 5000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-canvas/95 backdrop-blur-md border-b border-borderSubtle transition-all">
        <div className="max-w-4xl mx-auto px-4 py-3 sm:py-4 space-y-3">
          {/* Top row: Brand & Table identifier */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center font-heading font-black text-xl shadow-accent">
                TF
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-heading font-extrabold text-lg sm:text-xl text-content-primary leading-tight">
                    {restaurantConfig.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-sun text-content-primary text-xs font-black uppercase tracking-wider shadow-sm">
                    {t.tableLabel} {tableNumber}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-content-secondary line-clamp-1">
                  {t.welcomeLine}
                </p>
              </div>
            </div>

            {/* Right controls: Water, History, Review, Waiter & Language */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Quick Water Button */}
              <button
                onClick={() => setIsWaterModalOpen(true)}
                className="flex items-center gap-1 px-2.5 py-2 rounded-pill font-bold text-xs bg-surface border border-borderSubtle text-primary hover:bg-[#FAF4EB] shadow-soft transition-all"
                title={t.water.requestWater}
              >
                <Droplet className="w-3.5 h-3.5 text-primary fill-primary/20" />
                <span className="hidden sm:inline">{t.water.requestWater}</span>
              </button>

              {/* Order History */}
              <button
                onClick={() => setIsHistoryOpen(true)}
                className="flex items-center gap-1 px-2.5 py-2 rounded-pill font-bold text-xs bg-surface border border-borderSubtle text-content-primary hover:bg-[#FAF4EB] shadow-soft transition-all"
                title={t.orderHistory}
              >
                <Clock className="w-3.5 h-3.5 text-content-secondary" />
                <span className="hidden md:inline">{t.orderHistory}</span>
              </button>

              {/* Review Experience */}
              <button
                onClick={() => setIsReviewOpen(true)}
                className="flex items-center gap-1 px-2.5 py-2 rounded-pill font-bold text-xs bg-surface border border-borderSubtle text-[#9A6700] hover:bg-[#FAF4EB] shadow-soft transition-all"
                title={t.reviews.title}
              >
                <Star className="w-3.5 h-3.5 text-[#FFC233] fill-[#FFC233]" />
                <span className="hidden md:inline">Rate</span>
              </button>

              {/* Call Waiter */}
              <button
                onClick={handleCallWaiter}
                disabled={waiterCalled}
                className={`flex items-center gap-1 px-2.5 sm:px-3 py-2 rounded-pill font-bold text-xs transition-all select-none ${
                  waiterCalled
                    ? 'bg-status-success text-white'
                    : 'bg-surface border border-borderSubtle text-content-primary hover:bg-[#FAF4EB] shadow-soft'
                }`}
                title="Call waiter to table"
              >
                {waiterCalled ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Called!</span>
                  </>
                ) : (
                  <>
                    <BellRing className="w-3.5 h-3.5 text-primary" />
                    <span className="hidden sm:inline">{t.callWaiter}</span>
                  </>
                )}
              </button>

              <LanguageSwitcher />
            </div>
          </div>

          {/* Search bar & Quick dietary filters */}
          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            {/* Search bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-content-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full h-11 pl-10 pr-9 rounded-pill bg-surface border border-borderSubtle text-content-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-soft"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-content-muted hover:text-content-primary"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Dietary toggle buttons */}
            <div className="flex gap-1.5 shrink-0 self-center sm:self-auto">
              <button
                onClick={() => setDietaryFilter('all')}
                className={`px-3.5 py-2 rounded-pill text-xs font-bold transition-all border ${
                  dietaryFilter === 'all'
                    ? 'bg-content-primary text-white border-content-primary'
                    : 'bg-surface text-content-secondary border-borderSubtle hover:bg-canvas'
                }`}
              >
                {t.filterAll}
              </button>
              <button
                onClick={() => setDietaryFilter('veg')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-pill text-xs font-bold transition-all border ${
                  dietaryFilter === 'veg'
                    ? 'bg-[#2DBE7E] text-white border-[#2DBE7E] shadow-sm'
                    : 'bg-surface text-[#2DBE7E] border-borderSubtle hover:bg-canvas'
                }`}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-current" />
                {t.filterVeg}
              </button>
              <button
                onClick={() => setDietaryFilter('non-veg')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-pill text-xs font-bold transition-all border ${
                  dietaryFilter === 'non-veg'
                    ? 'bg-[#FF5A6E] text-white border-[#FF5A6E] shadow-sm'
                    : 'bg-surface text-[#FF5A6E] border-borderSubtle hover:bg-canvas'
                }`}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-current" />
                {t.filterNonVeg}
              </button>
            </div>
          </div>

          {/* Waiter confirmation banner if tapped */}
          <AnimatePresence>
            {waiterCalled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-status-success/15 border border-status-success/30 rounded-2xl p-2.5 text-xs text-status-success font-bold flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>{t.waiterCalledToast}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Water Request Modal */}
      <WaterRequestModal
        isOpen={isWaterModalOpen}
        onClose={() => setIsWaterModalOpen(false)}
        tableId={tableId}
        tableNumber={tableNumber}
      />

      {/* Order History Drawer */}
      <OrderHistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        tableId={tableId}
        tableNumber={tableNumber}
        onOpenReview={() => setIsReviewOpen(true)}
      />

      {/* Review Experience Modal */}
      <OrderReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        tableId={tableId}
        tableNumber={tableNumber}
      />
    </>
  );
};
