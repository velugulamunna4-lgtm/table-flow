'use client';

import React, { useState } from 'react';
import { MenuItem } from '@/types';
import { Card } from '@/components/ui/Card';
import { VegIndicator } from '@/components/ui/VegIndicator';
import { SpiceLevel } from '@/components/ui/SpiceLevel';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { useCartStore, useLanguageStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { translations } from '@/lib/i18n';
import { Clock } from 'lucide-react';

export interface MenuItemCardProps {
  item: MenuItem;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item }) => {
  const [imageError, setImageError] = useState(false);
  const { items, addItem, updateQuantity } = useCartStore();
  const { language } = useLanguageStore();
  const t = translations[language];

  // Cart item matching
  const cartItem = items.find((i) => i.menuItem.id === item.id);
  const quantity = cartItem?.quantity || 0;

  // Localized naming
  const displayName =
    (language !== 'en' && item.nameTranslations?.[language as 'te' | 'ta' | 'hi']) ||
    item.name;

  const displayDescription =
    (language !== 'en' && item.descriptionTranslations?.[language as 'te' | 'ta' | 'hi']) ||
    item.description;

  const handleAdd = () => {
    if (!item.isAvailable) return;
    addItem(item);
  };

  const handleIncrement = () => {
    updateQuantity(item.id, quantity + 1);
  };

  const handleDecrement = () => {
    updateQuantity(item.id, quantity - 1);
  };

  return (
    <Card
      padding="none"
      interactive={item.isAvailable}
      className={`overflow-hidden flex flex-col justify-between transition-all duration-200 ${
        !item.isAvailable ? 'opacity-70 bg-[#FAF7F2]' : 'hover:border-primary/40'
      }`}
    >
      <div>
        {/* Image Container with Fallback */}
        <div className="relative w-full h-44 sm:h-48 overflow-hidden bg-[#FAF4EB]">
          {!imageError ? (
            <img
              src={item.image}
              alt={displayName}
              onError={() => setImageError(true)}
              className={`w-full h-full object-cover transition-transform duration-300 ${
                item.isAvailable ? 'hover:scale-105' : 'grayscale'
              }`}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#FFF0E0] to-[#FFE0C2]">
              <span className="text-5xl select-none animate-pulse">{item.emojiFallback}</span>
            </div>
          )}

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
            <div className="p-1.5 rounded-lg bg-white/90 shadow-sm backdrop-blur-sm">
              <VegIndicator type={item.vegType} size="md" />
            </div>
            {item.isSpecial && (
              <span className="px-2.5 py-1 rounded-full bg-sun text-content-primary text-xs font-bold shadow-sm backdrop-blur-sm">
                ⭐ Special
              </span>
            )}
          </div>

          {/* Prep time badge */}
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/60 text-white text-xs font-semibold backdrop-blur-sm flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>~{item.preparationTimeMinutes}m</span>
          </div>

          {/* Sold out overlay */}
          {!item.isAvailable && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center p-3 text-center z-20">
              <span className="bg-status-alert text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-full shadow-lg">
                {t.soldOut}
              </span>
            </div>
          )}
        </div>

        {/* Content Details */}
        <div className="p-4 sm:p-5 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-heading font-extrabold text-lg sm:text-xl text-content-primary leading-snug">
              {displayName}
            </h3>
          </div>

          {/* Spice indicators */}
          {item.spiceLevel > 0 && (
            <div className="pt-0.5">
              <SpiceLevel level={item.spiceLevel} showText />
            </div>
          )}

          {/* Short description */}
          <p className="text-xs sm:text-sm text-content-secondary line-clamp-2 leading-relaxed">
            {displayDescription}
          </p>
        </div>
      </div>

      {/* Bottom Pricing & Add Action */}
      <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-3 border-t border-borderSubtle flex items-center justify-between gap-3">
        <div>
          <span className="text-[11px] text-content-muted uppercase tracking-wider font-semibold block">
            Price
          </span>
          <span className="font-heading font-black text-2xl text-content-primary">
            {formatCurrency(item.price)}
          </span>
        </div>

        <QuantityStepper
          quantity={quantity}
          disabled={!item.isAvailable}
          addLabel={t.addBtn}
          onAdd={handleAdd}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
        />
      </div>
    </Card>
  );
};
