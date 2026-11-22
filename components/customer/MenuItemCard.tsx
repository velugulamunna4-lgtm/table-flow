'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { VegIndicator } from '@/components/ui/VegIndicator';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { MenuItem } from '@/types';
import { useCartStore, useLanguageStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { translations } from '@/lib/i18n';
import { Clock, Plus, Flame, Sparkles, Utensils } from 'lucide-react';

export interface MenuItemCardProps {
  item: MenuItem;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item }) => {
  const { items, addItem, updateQuantity } = useCartStore();
  const { language } = useLanguageStore();
  const t = translations[language];

  const [imageError, setImageError] = useState(false);

  // Check if item is already in cart
  const cartItem = items.find((i) => i.menuItem.id === item.id);
  const quantity = cartItem?.quantity || 0;

  // Localized text resolution
  const displayName = language === 'en' ? item.name : ((item.nameTranslations as any)?.[language] || item.name);
  const displayDescription = language === 'en' ? item.description : ((item.descriptionTranslations as any)?.[language] || item.description);

  const handleAdd = () => {
    if (!item.isAvailable) return;
    addItem(item);
  };

  const handleQuantityChange = (newQty: number) => {
    updateQuantity(item.id, newQty);
  };

  return (
    <Card
      padding="none"
      interactive
      className={`overflow-hidden flex flex-col justify-between transition-all duration-300 border border-borderSubtle hover:border-primary/30 shadow-soft hover:shadow-lifted ${
        !item.isAvailable ? 'opacity-70 grayscale-[20%]' : ''
      }`}
    >
      <div>
        {/* Photo with Fallback & Veg Badge */}
        <div className="relative w-full h-44 sm:h-48 overflow-hidden bg-canvas">
          {!imageError ? (
            <img
              src={item.image}
              alt={displayName}
              onError={() => setImageError(true)}
              loading="lazy"
              className={`w-full h-full object-cover transition-transform duration-300 ${
                item.isAvailable ? 'hover:scale-105' : 'grayscale'
              }`}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-surface to-canvas border-b border-borderSubtle">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Utensils className="w-7 h-7 text-primary/60" />
              </div>
            </div>
          )}

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
            <div className="p-1.5 rounded-lg bg-surface/95 shadow-sm backdrop-blur-sm">
              <VegIndicator type={item.vegType} size="md" />
            </div>
            {item.isSpecial && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sun text-content-primary text-xs font-bold shadow-sm backdrop-blur-sm">
                <Sparkles className="w-3 h-3 text-primary" />
                <span>Special</span>
              </span>
            )}
          </div>

          {/* Prep time badge */}
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/65 text-white text-xs font-semibold backdrop-blur-sm flex items-center gap-1">
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
            <h3 className="font-heading font-extrabold text-base sm:text-lg text-content-primary leading-snug">
              {displayName}
            </h3>
          </div>

          <p className="text-content-secondary text-xs sm:text-sm line-clamp-2 leading-relaxed">
            {displayDescription}
          </p>

          {/* Spice level indicators */}
          {item.spiceLevel > 0 && (
            <div className="flex items-center gap-1 pt-1" title={`Spice Level ${item.spiceLevel}/3`}>
              <span className="text-[11px] font-semibold text-content-muted">Spice:</span>
              <div className="flex gap-0.5">
                {[1, 2, 3].map((lvl) => (
                  <span
                    key={lvl}
                    className={`w-2 h-2 rounded-full ${
                      lvl <= item.spiceLevel ? 'bg-primary' : 'bg-borderSubtle'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer: Price and Add / Stepper CTA */}
      <div className="p-4 sm:p-5 pt-0 flex items-center justify-between gap-3 border-t border-borderSubtle/50 mt-2">
        <div>
          <span className="text-[11px] font-semibold text-content-muted block leading-none">Price</span>
          <span className="font-heading font-black text-lg sm:text-xl text-content-primary">
            {formatCurrency(item.price)}
          </span>
        </div>

        <div>
          {item.isAvailable ? (
            <QuantityStepper
              quantity={quantity}
              onAdd={handleAdd}
              onIncrement={() => updateQuantity(item.id, quantity + 1)}
              onDecrement={() => updateQuantity(item.id, quantity - 1)}
              addLabel={t.addBtn}
              size="md"
            />
          ) : (
            <Button variant="ghost" size="sm" disabled className="opacity-50 text-xs">
              Unavailable
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
