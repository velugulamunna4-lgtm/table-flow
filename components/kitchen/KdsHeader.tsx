'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { LanguageSwitcher } from '@/components/customer/LanguageSwitcher';
import { ChefHat, Volume2, VolumeX, Store, ArrowLeft, RefreshCw, Layers, LayoutGrid } from 'lucide-react';
import { restaurantConfig } from '@/config/restaurant.config';
import { useLanguageStore } from '@/lib/store';
import { translations } from '@/lib/i18n';

export interface KdsHeaderProps {
  orderCounts: { new: number; cooking: number; ready: number };
  activeView: 'tickets' | 'production';
  onChangeView: (view: 'tickets' | 'production') => void;
  onOpenSoldOut: () => void;
  onRefresh: () => void;
}

export const KdsHeader: React.FC<KdsHeaderProps> = ({
  orderCounts,
  activeView,
  onChangeView,
  onOpenSoldOut,
  onRefresh,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const { language } = useLanguageStore();
  const t = translations[language].production;

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-[#1A1715] border-b border-[#2E2824] px-4 py-3 sm:px-6 sm:py-4 sticky top-0 z-30 select-none">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: Brand & Live Clock */}
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-primary text-white flex items-center justify-center font-black shadow-accent">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading font-black text-xl text-white tracking-wide">
                  {restaurantConfig.name} Kitchen
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-[#2E2824] text-xs font-mono text-[#FFC233] border border-[#FFC233]/30">
                  KDS Live
                </span>
              </div>
              <p className="text-xs text-[#A89689]">
                Live Orders Display · Readable from 2m away
              </p>
            </div>
          </div>

          <div className="font-mono font-bold text-lg text-[#FFC233] bg-[#241F1C] px-3 py-1 rounded-xl border border-[#2E2824]">
            {currentTime || '00:00:00'}
          </div>
        </div>

        {/* Center: View Switcher (Tickets vs Batch Production) */}
        <div className="flex items-center gap-1.5 bg-[#241F1C] p-1 rounded-pill border border-[#332C26]">
          <button
            onClick={() => onChangeView('tickets')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-pill text-xs font-bold transition-all ${
              activeView === 'tickets'
                ? 'bg-primary text-white shadow-sm'
                : 'text-[#A89689] hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Tickets Swimlane</span>
          </button>

          <button
            onClick={() => onChangeView('production')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-pill text-xs font-bold transition-all ${
              activeView === 'production'
                ? 'bg-primary text-white shadow-sm'
                : 'text-[#A89689] hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Production & Stations</span>
          </button>
        </div>

        {/* Right: Controls (Sold out sheet, Language, Audio, Refresh, Back link) */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={onOpenSoldOut}
            className="flex items-center gap-1.5 px-3 py-2 rounded-pill bg-[#FF5A6E]/20 text-[#FF8595] border border-[#FF5A6E]/40 hover:bg-[#FF5A6E]/30 text-xs sm:text-sm font-bold transition-all"
          >
            <Store className="w-4 h-4" />
            <span>86 / Sold Out</span>
          </button>

          <LanguageSwitcher />

          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`p-2.5 rounded-full transition-colors ${
              audioEnabled ? 'bg-[#2E2824] text-white hover:bg-[#3E3630]' : 'bg-[#FF5A6E]/20 text-[#FF5A6E]'
            }`}
            title={audioEnabled ? 'Audio Chime On' : 'Muted'}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={onRefresh}
            className="p-2.5 rounded-full bg-[#2E2824] text-white hover:bg-[#3E3630] transition-colors"
            title="Refresh Orders"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <Link
            href="/t/7"
            className="p-2.5 rounded-full bg-[#2E2824] text-white hover:bg-[#3E3630] transition-colors"
            title="Open Table 7 Customer View"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
};
