'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { orderService } from '@/lib/orderService';
import { useLanguageStore } from '@/lib/store';
import { translations } from '@/lib/i18n';
import { Droplet, Check, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export interface WaterRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableId: string;
  tableNumber: number;
}

export const WaterRequestModal: React.FC<WaterRequestModalProps> = ({
  isOpen,
  onClose,
  tableId,
  tableNumber,
}) => {
  const { language } = useLanguageStore();
  const t = translations[language].water;

  const [selectedType, setSelectedType] = useState<'normal' | 'chilled' | 'warm' | 'mineral'>('normal');
  const [sent, setSent] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const waterOptions = [
    { id: 'normal', label: t.normal, icon: '🥛', desc: 'Fresh purified RO ambient water' },
    { id: 'chilled', label: t.chilled, icon: '🧊', desc: 'Cold water with ice cubes' },
    { id: 'warm', label: t.warm, icon: '🍵', desc: 'Lukewarm soothing water' },
    { id: 'mineral', label: t.mineral, icon: '💧', desc: 'Sealed mineral water bottle' },
  ];

  const handleRequest = async () => {
    setIsSending(true);
    try {
      await orderService.callWaiter(tableId, tableNumber, 'water', selectedType);
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
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="sm" title={t.title}>
      {sent ? (
        <div className="py-6 text-center space-y-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-14 h-14 mx-auto rounded-full bg-status-success/15 text-status-success flex items-center justify-center text-3xl"
          >
            ✓
          </motion.div>
          <h4 className="font-heading font-black text-xl text-content-primary">
            {t.dispatchedToast}
          </h4>
          <p className="text-xs text-content-secondary">
            Your table captain will serve fresh drinking water shortly.
          </p>
        </div>
      ) : (
        <div className="space-y-4 pt-1">
          <p className="text-xs text-content-secondary">
            Select your preferred drinking water type for Table {tableNumber}:
          </p>

          <div className="space-y-2">
            {waterOptions.map((opt) => {
              const active = selectedType === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedType(opt.id as any)}
                  className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                    active
                      ? 'bg-primary/10 border-primary text-primary ring-1 ring-primary'
                      : 'bg-canvas border-borderSubtle hover:bg-surface text-content-primary'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{opt.icon}</span>
                    <div>
                      <div className="font-heading font-bold text-sm">{opt.label}</div>
                      <div className="text-[11px] text-content-secondary">{opt.desc}</div>
                    </div>
                  </div>

                  {active && <Check className="w-4 h-4 text-primary shrink-0" />}
                </button>
              );
            })}
          </div>

          <Button
            variant="primary"
            size="lg"
            isLoading={isSending}
            onClick={handleRequest}
            className="w-full font-bold shadow-accent"
          >
            {t.requestWater} (Table {tableNumber})
          </Button>
        </div>
      )}
    </Modal>
  );
};
