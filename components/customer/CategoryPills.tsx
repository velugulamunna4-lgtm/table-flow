'use client';

import React from 'react';
import { Pill } from '@/components/ui/Pill';
import { useMenuStore, useLanguageStore } from '@/lib/store';
import { translations } from '@/lib/i18n';

export const CategoryPills: React.FC = () => {
  const { selectedCategory, setSelectedCategory, menuItems } = useMenuStore();
  const { language } = useLanguageStore();
  const t = translations[language].categories;

  const categories = [
    { id: 'specials', label: `⭐ ${t.specials}`, catKey: 'specials' },
    { id: 'starters', label: `🥘 ${t.starters}`, catKey: 'starters' },
    { id: 'mains', label: `🍲 ${t.mains}`, catKey: 'mains' },
    { id: 'biryani', label: `🍚 ${t.biryani}`, catKey: 'biryani' },
    { id: 'desserts', label: `🍨 ${t.desserts}`, catKey: 'desserts' },
    { id: 'drinks', label: `🥭 ${t.drinks}`, catKey: 'drinks' },
  ];

  const getCount = (catId: string) => {
    return menuItems.filter((i) => i.category === catId).length;
  };

  return (
    <div className="py-2 overflow-x-auto no-scrollbar flex items-center gap-2 select-none">
      {categories.map((cat) => {
        const isActive = selectedCategory === cat.id;
        const count = getCount(cat.id);

        return (
          <Pill
            key={cat.id}
            active={isActive}
            count={count}
            onClick={() => setSelectedCategory(cat.id)}
            className="text-sm sm:text-base py-2.5 px-4"
          >
            {cat.label}
          </Pill>
        );
      })}
    </div>
  );
};
