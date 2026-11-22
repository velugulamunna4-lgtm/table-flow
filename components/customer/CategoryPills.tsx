'use client';

import React from 'react';
import { Pill } from '@/components/ui/Pill';
import { useMenuStore, useLanguageStore } from '@/lib/store';
import { translations } from '@/lib/i18n';
import { Sparkles, UtensilsCrossed, CookingPot, Flame, Cake, Wine } from 'lucide-react';

export const CategoryPills: React.FC = () => {
  const { selectedCategory, setSelectedCategory, menuItems } = useMenuStore();
  const { language } = useLanguageStore();
  const t = translations[language].categories;

  const categories = [
    { id: 'specials', label: t.specials, icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'starters', label: t.starters, icon: <UtensilsCrossed className="w-3.5 h-3.5" /> },
    { id: 'mains', label: t.mains, icon: <CookingPot className="w-3.5 h-3.5" /> },
    { id: 'biryani', label: t.biryani, icon: <Flame className="w-3.5 h-3.5" /> },
    { id: 'desserts', label: t.desserts, icon: <Cake className="w-3.5 h-3.5" /> },
    { id: 'drinks', label: t.drinks, icon: <Wine className="w-3.5 h-3.5" /> },
  ];

  const getCount = (catId: string) => {
    return menuItems.filter((i) => i.category === catId).length;
  };

  return (
    <div className="py-2 overflow-x-auto no-scrollbar flex items-center gap-2 select-none touch-pan-x">
      {categories.map((cat) => {
        const isActive = selectedCategory === cat.id;
        const count = getCount(cat.id);

        return (
          <Pill
            key={cat.id}
            active={isActive}
            count={count}
            onClick={() => setSelectedCategory(cat.id)}
            className="text-xs sm:text-sm py-2 px-3.5 shrink-0 flex items-center gap-1.5 font-bold"
          >
            <span className={isActive ? 'text-white' : 'text-primary'}>{cat.icon}</span>
            <span>{cat.label}</span>
          </Pill>
        );
      })}
    </div>
  );
};
