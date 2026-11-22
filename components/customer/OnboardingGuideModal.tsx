'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useLanguageStore } from '@/lib/store';
import { translations } from '@/lib/i18n';
import { motion, AnimatePresence } from 'framer-motion';
import { Utensils, Smartphone, ChefHat, ArrowRight } from 'lucide-react';

export const OnboardingGuideModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const { language } = useLanguageStore();
  const t = translations[language].onboarding;

  useEffect(() => {
    const hasSeen = localStorage.getItem('tableflow_onboarded_v1');
    if (!hasSeen) {
      setIsOpen(true);
    }
  }, []);

  const handleFinish = () => {
    localStorage.setItem('tableflow_onboarded_v1', 'true');
    setIsOpen(false);
  };

  const steps = [
    {
      icon: <Utensils className="w-10 h-10 text-primary" />,
      title: t.step1Title,
      desc: t.step1Desc,
      emoji: '🍛',
      badge: 'Step 1 of 3',
    },
    {
      icon: <Smartphone className="w-10 h-10 text-sun" />,
      title: t.step2Title,
      desc: t.step2Desc,
      emoji: '📲',
      badge: 'Step 2 of 3',
    },
    {
      icon: <ChefHat className="w-10 h-10 text-status-success" />,
      title: t.step3Title,
      desc: t.step3Desc,
      emoji: '🔥',
      badge: 'Step 3 of 3',
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={handleFinish} maxWidth="md">
      <div className="text-center py-2">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary/10 text-primary uppercase tracking-wider">
            {steps[step].badge}
          </span>
          <button
            onClick={handleFinish}
            className="text-xs font-semibold text-content-secondary hover:text-content-primary underline decoration-dotted"
          >
            {t.skip}
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <div className="w-24 h-24 mx-auto rounded-3xl bg-canvas border border-borderSubtle flex items-center justify-center text-5xl shadow-soft">
              {steps[step].emoji}
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-2xl text-content-primary mb-2">
                {steps[step].title}
              </h3>
              <p className="text-content-secondary text-sm sm:text-base max-w-sm mx-auto leading-relaxed">
                {steps[step].desc}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Step dots */}
        <div className="flex justify-center gap-2 my-6">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`h-2 rounded-full transition-all ${
                i === step ? 'w-8 bg-primary' : 'w-2 bg-content-muted/30'
              }`}
              aria-label={`Go to step ${i + 1}`}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          {step < steps.length - 1 ? (
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              rightIcon={<ArrowRight className="w-5 h-5" />}
              onClick={() => setStep((s) => s + 1)}
            >
              Next Step
            </Button>
          ) : (
            <Button
              variant="sun"
              size="lg"
              className="w-full font-bold"
              onClick={handleFinish}
            >
              {t.getStarted}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
