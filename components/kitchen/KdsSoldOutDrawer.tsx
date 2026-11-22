'use client';

import React, { useState } from 'react';
import { useMenuStore } from '@/lib/store';
import { orderService } from '@/lib/orderService';
import { VegIndicator } from '@/components/ui/VegIndicator';
import { X, Search, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface KdsSoldOutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KdsSoldOutDrawer: React.FC<KdsSoldOutDrawerProps> = ({ isOpen, onClose }) => {
  const { menuItems, setItemAvailability } = useMenuStore();
  const [search, setSearch] = useState('');

  const filtered = menuItems.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggle = async (itemId: string, currentAvailable: boolean) => {
    const newStatus = !currentAvailable;
    // Update local store
    setItemAvailability(itemId, newStatus);
    // Broadcast live event across browser tabs to every open table screen!
    await orderService.toggleItemAvailability(itemId, newStatus);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="relative z-10 w-full max-w-md bg-[#1A1715] border-l border-[#2E2824] h-full flex flex-col p-6 text-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#2E2824]">
              <div>
                <h3 className="font-heading font-black text-xl text-white">
                  86 / Sold-Out Manager
                </h3>
                <p className="text-xs text-[#A89689] mt-0.5">
                  Toggling immediately disables items on all customer phones.
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-[#2E2824] flex items-center justify-center text-[#C4BBB4] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search */}
            <div className="py-3">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#847C76]" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search dish to mark sold out..."
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#241F1C] border border-[#332C26] text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* Dishes List */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#2E2824] pr-1">
              {filtered.map((dish) => (
                <div
                  key={dish.id}
                  className="py-3 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5">
                    <VegIndicator type={dish.vegType} size="sm" />
                    <div>
                      <div className="font-heading font-bold text-sm text-white">
                        {dish.name}
                      </div>
                      <div className="text-xs text-[#847C76]">
                        {dish.category} · ₹{dish.price}
                      </div>
                    </div>
                  </div>

                  {/* Toggle button */}
                  <button
                    onClick={() => handleToggle(dish.id, dish.isAvailable)}
                    className={`px-3 py-1.5 rounded-full font-bold text-xs transition-all flex items-center gap-1.5 ${
                      dish.isAvailable
                        ? 'bg-[#2DBE7E]/20 text-[#2DBE7E] border border-[#2DBE7E]/40 hover:bg-[#2DBE7E]/30'
                        : 'bg-[#FF5A6E] text-white shadow-md'
                    }`}
                  >
                    {dish.isAvailable ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>In Stock</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Sold Out</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
