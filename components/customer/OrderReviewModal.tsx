'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { orderService } from '@/lib/orderService';
import { useLanguageStore } from '@/lib/store';
import { translations } from '@/lib/i18n';
import { Star, Sparkles, Check, Heart, ThumbsUp } from 'lucide-react';
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
    'Fresh & Piping Hot',
    'Splendid Ambiance',
  ]);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableTags = [
    'Fresh & Piping Hot',
    'Splendid Ambiance',
    'Prompt Service',
    'Generous Portions',
    'Authentic Spices',
    'Relaxing Atmosphere',
    'Tender & Flavorful',
    'Child Friendly',
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await orderService.submitReview({
        tableId,
        tableNumber,
        orderId,
        overallRating: overall,
        foodRating: food,
        ambianceRating: ambiance,
        serviceRating: service,
        tags: selectedTags,
        customerName: name.trim() || undefined,
        comment: comment.trim() || undefined,
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2500);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number, setRating: (r: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className="p-1 hover:scale-110 active:scale-95 transition-transform"
          >
            <Star
              className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors ${
                star <= rating
                  ? 'text-sun fill-sun'
                  : 'text-borderSubtle fill-canvas'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md" title={t.title}>
      {submitted ? (
        <div className="py-8 text-center space-y-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 mx-auto rounded-full bg-status-success/20 text-status-success flex items-center justify-center shadow-soft"
          >
            <Check className="w-8 h-8" />
          </motion.div>
          <h3 className="font-heading font-black text-2xl text-content-primary">
            {t.reviewSuccess}
          </h3>
          <p className="text-xs sm:text-sm text-content-secondary max-w-xs mx-auto">
            Your review helps us refine our recipes, hospitality, and dining ambiance.
          </p>
        </div>
      ) : (
        <div className="space-y-4 pt-1 text-content-primary">
          <p className="text-xs text-content-secondary">
            {t.subtitle}
          </p>

          {/* Overall Rating */}
          <div className="p-3.5 rounded-2xl bg-canvas border border-borderSubtle flex items-center justify-between">
            <div>
              <span className="font-heading font-bold text-sm block">
                {t.overallRating}
              </span>
              <span className="text-[11px] text-content-muted">General impression</span>
            </div>
            {renderStars(overall, setOverall)}
          </div>

          {/* Factor Ratings */}
          <div className="space-y-2">
            <div className="p-2.5 rounded-xl bg-surface border border-borderSubtle flex items-center justify-between">
              <span className="text-xs font-semibold">{t.foodQuality}</span>
              {renderStars(food, setFood)}
            </div>

            <div className="p-2.5 rounded-xl bg-surface border border-borderSubtle flex items-center justify-between">
              <span className="text-xs font-semibold">{t.ambiance}</span>
              {renderStars(ambiance, setAmbiance)}
            </div>

            <div className="p-2.5 rounded-xl bg-surface border border-borderSubtle flex items-center justify-between">
              <span className="text-xs font-semibold">{t.serviceHospitality}</span>
              {renderStars(service, setService)}
            </div>
          </div>

          {/* Quick Compliment Tags */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-content-secondary block">
              {t.selectTags}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {availableTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-pill text-xs font-bold transition-all border ${
                      isSelected
                        ? 'bg-primary text-white border-primary shadow-xs'
                        : 'bg-canvas text-content-secondary border-borderSubtle hover:bg-surface'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Name & Comments */}
          <div className="space-y-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name (Optional)"
              className="w-full h-10 px-3.5 rounded-2xl bg-canvas border border-borderSubtle text-xs focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <textarea
              rows={2}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t.commentPlaceholder}
              className="w-full p-3 rounded-2xl bg-canvas border border-borderSubtle text-xs focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex gap-2">
            <Button variant="ghost" size="md" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              className="flex-1 font-bold shadow-accent"
              isLoading={isSubmitting}
              onClick={handleSubmit}
            >
              {t.submitReview}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
