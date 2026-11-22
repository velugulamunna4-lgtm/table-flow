'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore, useLanguageStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { translations } from '@/lib/i18n';
import { ShoppingBag, ChevronUp } from 'lucide-react';

export interface FloatingCartBarProps {
  onOpenCart: () => void;
}

export const FloatingCartBar: React.FC<FloatingCartBarProps> = ({ onOpenCart }) => {
  const { items, getTotal, getItemCount } = useCartStore();
  const { language } = useLanguageStore();
  const t = translations[language];

  const count = getItemCount();
  const total = getTotal();

  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="fixed bottom-0 left-0 right-0 z-40 p-4 pointer-events-none flex justify-center"
        >
          <div className="w-full max-w-lg pointer-events-auto">
            <button
              onClick={onOpenCart}
              className="w-full h-14 sm:h-16 px-5 sm:px-6 rounded-pill bg-primary text-white shadow-lifted flex items-center justify-between select-none hover:bg-primary-hover active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
                  {count}
                </div>
                <div className="text-left">
                  <div className="font-heading font-extrabold text-base sm:text-lg leading-tight">
                    {count} {count === 1 ? t.itemWord : t.itemsWord} · {formatCurrency(total)}
                  </div>
                  <div className="text-[11px] text-white/80 font-medium">
                    Tap to review items & notes
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 font-bold text-sm sm:text-base bg-white/15 px-4 py-2 rounded-full backdrop-blur-sm">
                <span>{t.viewOrder}</span>
                <ChevronUp className="w-4 h-4" />
              </div>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
