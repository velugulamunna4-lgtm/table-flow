'use client';

import React, { useState, useEffect } from 'react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { WaterRequestModal } from './WaterRequestModal';
import { CleanTableModal } from './CleanTableModal';
import { OrderHistoryDrawer } from './OrderHistoryDrawer';
import { OrderReviewModal } from './OrderReviewModal';
import { useLanguageStore, useMenuStore } from '@/lib/store';
import { translations } from '@/lib/i18n';
import { restaurantConfig } from '@/config/restaurant.config';
import { orderService, WaiterCall } from '@/lib/orderService';
import { Search, BellRing, Sparkles, X, Check, Droplets, Clock, Star } from 'lucide-react';
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
  const [isCleanModalOpen, setIsCleanModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [activeCalls, setActiveCalls] = useState<WaiterCall[]>([]);

  useEffect(() => {
    const unsub = orderService.subscribeToWaiterCalls((calls) => {
      setActiveCalls(calls.filter((c) => c.tableId === tableId));
    });
    return () => unsub();
  }, [tableId]);

  const isCleaningRequested = activeCalls.some((c) => c.type === 'clean_table');
  const isWaterRequested = activeCalls.some((c) => c.type === 'water');

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
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3.5 space-y-2.5">
          {/* Top row: Brand & Table identifier + Lang & Call Waiter */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-primary text-white flex items-center justify-center font-heading font-black text-lg sm:text-xl shadow-accent shrink-0">
                TF
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h1 className="font-heading font-extrabold text-base sm:text-xl text-content-primary leading-tight truncate">
                    {restaurantConfig.name}
                  </h1>
                  <span className="px-2 py-0.5 rounded-full bg-sun text-content-primary text-[11px] font-black uppercase tracking-wider shrink-0 shadow-xs">
                    {t.tableLabel} {tableNumber}
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-content-secondary truncate hidden xs:block">
                  {t.welcomeLine}
                </p>
              </div>
            </div>

            {/* Quick Actions & Switcher */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Call Waiter */}
              <button
                onClick={handleCallWaiter}
                disabled={waiterCalled}
                className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-pill font-bold text-xs transition-all select-none ${
                  waiterCalled
                    ? 'bg-status-success text-white'
                    : 'bg-surface border border-borderSubtle text-content-primary hover:bg-canvas shadow-soft'
                }`}
                title="Call waiter to table"
              >
                {waiterCalled ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Called</span>
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

          {/* Quick utility bar for phones: Water, Clean Table, History, Review */}
          <div className="flex items-center justify-between gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Quick Water Button */}
              <button
                onClick={() => setIsWaterModalOpen(true)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-pill font-bold text-xs transition-all border ${
                  isWaterRequested
                    ? 'bg-info/15 text-info border-info/40 shadow-xs'
                    : 'bg-surface border-borderSubtle text-primary hover:bg-canvas shadow-soft'
                }`}
              >
                <Droplets className="w-3.5 h-3.5 text-primary" />
                <span>
                  {isWaterRequested ? 'Water Requested' : t.water.requestWater}
                </span>
                {isWaterRequested && (
                  <span className="w-2 h-2 rounded-full bg-info animate-pulse" />
                )}
              </button>

              {/* Clean Table Button */}
              <button
                onClick={() => setIsCleanModalOpen(true)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-pill font-bold text-xs transition-all border ${
                  isCleaningRequested
                    ? 'bg-status-success/15 text-status-success border-status-success/40 shadow-xs'
                    : 'bg-surface border-borderSubtle text-content-primary hover:bg-canvas shadow-soft'
                }`}
                title={t.cleanTable.modalTitle}
              >
                <Sparkles className={`w-3.5 h-3.5 ${isCleaningRequested ? 'text-status-success' : 'text-sun'}`} />
                <span>
                  {isCleaningRequested
                    ? t.cleanTable.cleaningActiveBadge
                    : t.cleanTable.cleanTableBtn}
                </span>
                {isCleaningRequested && (
                  <span className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
                )}
              </button>

              {/* Order History */}
              <button
                onClick={() => setIsHistoryOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-pill font-bold text-xs bg-surface border border-borderSubtle text-content-primary hover:bg-canvas shadow-soft transition-all"
              >
                <Clock className="w-3.5 h-3.5 text-content-secondary" />
                <span>{t.orderHistory}</span>
              </button>

              {/* Rate Experience */}
              <button
                onClick={() => setIsReviewOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-pill font-bold text-xs bg-surface border border-borderSubtle text-sun hover:bg-canvas shadow-soft transition-all"
              >
                <Star className="w-3.5 h-3.5 text-sun fill-sun" />
                <span>Rate</span>
              </button>
            </div>
          </div>

          {/* Search bar & Dietary toggle buttons */}
          <div className="flex flex-col sm:flex-row gap-2 pt-0.5">
            {/* Search bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-content-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full h-10 pl-10 pr-9 rounded-pill bg-surface border border-borderSubtle text-content-primary text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-soft"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-content-muted hover:text-content-primary"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Dietary toggle buttons */}
            <div className="flex gap-1.5 shrink-0 justify-end">
              <button
                onClick={() => setDietaryFilter('all')}
                className={`px-3 py-1.5 rounded-pill text-xs font-bold transition-all border ${
                  dietaryFilter === 'all'
                    ? 'bg-content-primary text-white border-content-primary'
                    : 'bg-surface text-content-secondary border-borderSubtle hover:bg-canvas'
                }`}
              >
                {t.filterAll}
              </button>
              <button
                onClick={() => setDietaryFilter('veg')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-xs font-bold transition-all border ${
                  dietaryFilter === 'veg'
                    ? 'bg-status-success text-white border-status-success shadow-xs'
                    : 'bg-surface text-status-success border-borderSubtle hover:bg-canvas'
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-current" />
                {t.filterVeg}
              </button>
              <button
                onClick={() => setDietaryFilter('non-veg')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-xs font-bold transition-all border ${
                  dietaryFilter === 'non-veg'
                    ? 'bg-status-alert text-white border-status-alert shadow-xs'
                    : 'bg-surface text-status-alert border-borderSubtle hover:bg-canvas'
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-current" />
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

      {/* Clean Table Modal */}
      <CleanTableModal
        isOpen={isCleanModalOpen}
        onClose={() => setIsCleanModalOpen(false)}
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
