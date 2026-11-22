'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguageStore } from '@/lib/store';
import { Language } from '@/lib/i18n';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const LANGUAGES: { code: Language; name: string; nativeName: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
];

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguageStore();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-pill bg-surface border border-borderSubtle shadow-soft text-content-primary hover:bg-canvas transition-colors text-xs sm:text-sm font-semibold select-none"
        aria-label="Select Language"
      >
        <Globe className="w-3.5 h-3.5 text-primary" />
        <span>{currentLang.nativeName}</span>
        <ChevronDown className="w-3.5 h-3.5 text-content-secondary" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-44 rounded-2xl bg-surface border border-borderSubtle shadow-lifted p-1.5 z-40"
          >
            {LANGUAGES.map((item) => (
              <button
                key={item.code}
                onClick={() => {
                  setLanguage(item.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm transition-colors text-left font-medium ${
                  language === item.code
                    ? 'bg-primary/10 text-primary font-bold'
                    : 'text-content-primary hover:bg-canvas'
                }`}
              >
                <div>
                  <div className="font-bold">{item.nativeName}</div>
                  <div className="text-[11px] text-content-muted">{item.name}</div>
                </div>
                {language === item.code && <Check className="w-4 h-4 text-primary" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
