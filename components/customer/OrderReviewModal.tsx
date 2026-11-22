'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { orderService } from '@/lib/orderService';
import { useLanguageStore } from '@/lib/store';
import { translations } from '@/lib/i18n';
import { Star, Sparkles, Check, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export interface OrderReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableId: string;
  tableNumber: number;
  orderId?: string;
}

export const OrderReviewModal: React.FC<OrderReviewModalProps> = ({
  isOpen,
  onClose,
  tableId,
  tableNumber,
  orderId,
}) => {
  const { language } = useLanguageStore();
  const t = translations[language].reviews;

  const [overall, setOverall] = useState(5);
  const [food, setFood] = useState(5);
  const [ambiance, setAmbiance] = useState(5);
  const [service, setService] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>([
    'Piping Hot 🔥',
    'Royal Vibe ✨',
  ]);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableTags = [
    'Piping Hot 🔥',
    'Royal Vibe ✨',
    'Quick Service ⚡',
    'Generous Portions 🍛',
    'Authentic Spices 🌶️',
    'Great Music 🎵',
    'Melt-in-Mouth 🍢',
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await orderService.submitReview({
        orderId,
        tableId,
        tableNumber,
        overallRating: overall,
        foodRating: food,
        ambianceRating: ambiance,
        serviceRating: service,
        tags: selectedTags,
        customerName: name.trim() || undefined,
        comment: comment.trim(),
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number, onSelect: (r: number) => void) => (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onSelect(star)}
          className="p-1 hover:scale-110 active:scale-95 transition-transform"
        >
          <Star
            className={`w-6 h-6 transition-colors ${
              star <= rating
                ? 'text-[#FFC233] fill-[#FFC233]'
                : 'text-[#E0D8D0] fill-transparent'
            }`}
          />
        </button>
      ))}
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md" title={t.title}>
      {submitted ? (
        <div className="py-8 text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 mx-auto rounded-full bg-status-success/15 text-status-success flex items-center justify-center text-3xl shadow-soft"
          >
            ✓
          </motion.div>
          <h3 className="font-heading font-black text-2xl text-content-primary">
            {t.reviewSuccess}
          </h3>
          <p className="text-xs text-content-secondary max-w-xs mx-auto">
            Your compliments and ratings have been shared directly with our head chef and restaurant management.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5 pt-1">
          <p className="text-xs text-content-secondary">{t.subtitle}</p>

          {/* Star Rating Breakdown */}
          <div className="space-y-3 p-4 rounded-2xl bg-canvas border border-borderSubtle">
            {/* Overall */}
            <div className="flex items-center justify-between">
              <span className="font-heading font-bold text-sm text-content-primary">
                {t.overallRating}
              </span>
              {renderStars(overall, setOverall)}
            </div>

            {/* Food Taste */}
            <div className="flex items-center justify-between pt-2 border-t border-borderSubtle">
              <span className="text-xs font-semibold text-content-secondary">
                {t.foodQuality}
              </span>
              {renderStars(food, setFood)}
            </div>

            {/* Ambiance */}
            <div className="flex items-center justify-between pt-2 border-t border-borderSubtle">
              <span className="text-xs font-semibold text-content-secondary">
                {t.ambiance}
              </span>
              {renderStars(ambiance, setAmbiance)}
            </div>

            {/* Service */}
            <div className="flex items-center justify-between pt-2 border-t border-borderSubtle">
              <span className="text-xs font-semibold text-content-secondary">
                {t.serviceHospitality}
              </span>
              {renderStars(service, setService)}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-content-secondary block">
              {t.selectTags}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {availableTags.map((tag) => {
                const active = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-pill text-xs font-bold transition-all border ${
                      active
                        ? 'bg-primary text-white border-primary shadow-sm'
                        : 'bg-surface text-content-secondary border-borderSubtle hover:bg-canvas'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Customer Name & Comment */}
          <div className="space-y-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name (optional)"
              className="w-full p-2.5 rounded-xl bg-canvas border border-borderSubtle text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t.commentPlaceholder}
              className="w-full p-2.5 rounded-xl bg-canvas border border-borderSubtle text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            className="w-full font-bold shadow-accent"
          >
            {t.submitReview}
          </Button>
        </form>
      )}
    </Modal>
  );
};
