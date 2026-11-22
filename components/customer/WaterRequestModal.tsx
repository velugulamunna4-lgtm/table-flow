'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { orderService } from '@/lib/orderService';
import { useLanguageStore } from '@/lib/store';
import { translations } from '@/lib/i18n';
import { Droplets, GlassWater, Snowflake, ThermometerSun, Check, Sparkles } from 'lucide-react';
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
    {
      id: 'normal' as const,
      label: t.normal,
      icon: <GlassWater className="w-5 h-5 text-primary" />,
      desc: 'Purified RO ambient drinking water',
    },
    {
      id: 'chilled' as const,
      label: t.chilled,
      icon: <Snowflake className="w-5 h-5 text-info" />,
      desc: 'Cold filtered water with ice cubes',
    },
    {
      id: 'warm' as const,
      label: t.warm,
      icon: <ThermometerSun className="w-5 h-5 text-sun" />,
      desc: 'Lukewarm soothing water',
    },
    {
      id: 'mineral' as const,
      label: t.mineral,
      icon: <Droplets className="w-5 h-5 text-status-success" />,
      desc: 'Packaged mineral water bottle',
    },
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
            className="w-16 h-16 mx-auto rounded-full bg-status-success/20 text-status-success flex items-center justify-center"
          >
            <Check className="w-8 h-8" />
          </motion.div>
          <h3 className="font-heading font-black text-xl text-content-primary">
            {t.dispatchedToast}
          </h3>
          <p className="text-xs text-content-secondary max-w-xs mx-auto">
            Our floor captain has been notified for Table {tableNumber}.
          </p>
        </div>
      ) : (
        <div className="space-y-4 pt-1">
          <p className="text-xs text-content-secondary">
            Select your preferred water temperature. We serve purified RO water directly to Table {tableNumber}.
          </p>

          <div className="space-y-2.5">
            {waterOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedType(opt.id)}
                className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all select-none ${
                  selectedType === opt.id
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
                    selectedType === opt.id
                      ? 'border-primary bg-primary text-white'
                      : 'border-content-muted'
                  }`}
                >
                  {selectedType === opt.id && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>
            ))}
          </div>

          <div className="pt-2 flex gap-2">
            <Button variant="ghost" size="md" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              className="flex-1 font-bold shadow-accent"
              isLoading={isSending}
              onClick={handleRequest}
            >
              Request Water
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
