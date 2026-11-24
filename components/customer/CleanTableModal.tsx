'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { orderService } from '@/lib/orderService';
import { useLanguageStore } from '@/lib/store';
import { translations } from '@/lib/i18n';
import {
  Sparkles,
  UtensilsCrossed,
  Droplets,
  Utensils,
  Check,
  CheckCircle2,
} from 'lucide-react';
import { motion } from 'framer-motion';

export interface CleanTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableId: string;
  tableNumber: number;
}

export const CleanTableModal: React.FC<CleanTableModalProps> = ({
  isOpen,
  onClose,
  tableId,
  tableNumber,
}) => {
  const { language } = useLanguageStore();
  const t = translations[language].cleanTable;

  const [selectedOption, setSelectedOption] = useState<string>('wipe');
  const [sent, setSent] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const cleaningOptions = [
    {
      id: 'wipe',
      label: t.wipeTable,
      icon: <Sparkles className="w-5 h-5 text-primary" />,
      desc: 'Wipe down & sanitize table surface',
    },
    {
      id: 'plates',
      label: t.clearPlates,
      icon: <UtensilsCrossed className="w-5 h-5 text-sun" />,
      desc: 'Clear empty dishes, bowls & glasses',
    },
    {
      id: 'spill',
      label: t.spillCleanup,
      icon: <Droplets className="w-5 h-5 text-status-alert" />,
      desc: 'Quick wipe for spilled beverage or curry',
    },
    {
      id: 'cutlery',
      label: t.freshCutlery,
      icon: <Utensils className="w-5 h-5 text-status-success" />,
      desc: 'Replenish spoons, forks & tissue napkins',
    },
  ];

  const handleRequest = async () => {
    setIsSending(true);
    const chosen = cleaningOptions.find((c) => c.id === selectedOption);
    const detail = chosen ? chosen.label : 'General Table Cleaning';

    try {
      await orderService.requestTableCleaning(tableId, tableNumber, detail);
      setSent(true);
      setTimeout(() => {
        setSent(false);
        onClose();
      }, 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="sm" title={t.modalTitle}>
      {sent ? (
        <div className="py-6 text-center space-y-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 mx-auto rounded-full bg-status-success/20 text-status-success flex items-center justify-center shadow-soft"
          >
            <Check className="w-8 h-8 stroke-[3]" />
          </motion.div>
          <h3 className="font-heading font-black text-xl text-content-primary">
            {t.requestSentToast}
          </h3>
          <p className="text-xs text-content-secondary max-w-xs mx-auto">
            {t.quickCleanPrompt}
          </p>
        </div>
      ) : (
        <div className="space-y-4 pt-1">
          <p className="text-xs text-content-secondary">
            {t.modalSubtitle}
          </p>

          <div className="space-y-2.5">
            {cleaningOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedOption(opt.id)}
                className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all select-none ${
                  selectedOption === opt.id
                    ? 'border-primary bg-primary/10 shadow-soft'
                    : 'border-borderSubtle bg-canvas hover:bg-surface'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface border border-borderSubtle flex items-center justify-center shrink-0">
                    {opt.icon}
                  </div>
                  <div>
                    <div className="font-heading font-bold text-sm text-content-primary">
                      {opt.label}
                    </div>
                    <div className="text-[11px] text-content-secondary">{opt.desc}</div>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    selectedOption === opt.id
                      ? 'border-primary bg-primary text-white'
                      : 'border-content-muted'
                  }`}
                >
                  {selectedOption === opt.id && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>
            ))}
          </div>

          <div className="pt-2 flex gap-2">
            <Button variant="ghost" size="md" className="flex-1" onClick={onClose}>
              {t.cancel}
            </Button>
            <Button
              variant="primary"
              size="md"
              className="flex-1 font-bold shadow-accent"
              isLoading={isSending}
              onClick={handleRequest}
            >
              {t.confirmBtn}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
