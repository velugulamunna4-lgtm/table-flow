'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { orderService } from '@/lib/orderService';
import { OrderReview } from '@/types';
import { useLanguageStore } from '@/lib/store';
import { translations } from '@/lib/i18n';
import { formatTimeElapsed } from '@/lib/utils';
import { Star, User, Sparkles, MessageSquare, Utensils, Heart, UserCheck } from 'lucide-react';

export const AdminReviewsFeed: React.FC = () => {
  const { language } = useLanguageStore();
  const t = translations[language].reviews;

  const [reviews, setReviews] = useState<OrderReview[]>([]);

  useEffect(() => {
    orderService.getReviews().then(setReviews);
    const unsub = orderService.subscribeToReviews(setReviews);
    return () => unsub();
  }, []);

  const calculateAverage = (field: keyof OrderReview) => {
    if (reviews.length === 0) return '5.0';
    const sum = reviews.reduce((acc, r) => acc + (typeof r[field] === 'number' ? (r[field] as number) : 0), 0);
    return (sum / reviews.length).toFixed(1);
  };

  const avgOverall = calculateAverage('overallRating');
  const avgFood = calculateAverage('foodRating');
  const avgAmbiance = calculateAverage('ambianceRating');
  const avgService = calculateAverage('serviceRating');

  return (
    <div className="space-y-6">
      {/* Top 4 Factor Summary Scorecards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card padding="md" className="space-y-1 text-center bg-gradient-to-br from-surface to-canvas">
          <span className="text-[11px] sm:text-xs font-bold text-content-secondary uppercase tracking-wider">
            Overall Rating
          </span>
          <div className="font-heading font-black text-2xl sm:text-3xl text-content-primary flex items-center justify-center gap-1.5">
            <Star className="w-5 h-5 text-sun fill-sun" />
            <span>{avgOverall}</span>
          </div>
          <span className="text-[11px] text-content-muted">Based on {reviews.length} reviews</span>
        </Card>

        <Card padding="md" className="space-y-1 text-center">
          <span className="text-[11px] sm:text-xs font-bold text-content-secondary uppercase tracking-wider">
            Food & Taste
          </span>
          <div className="font-heading font-black text-2xl sm:text-3xl text-primary flex items-center justify-center gap-1.5">
            <Utensils className="w-5 h-5 text-primary" />
            <span>{avgFood}</span>
          </div>
          <span className="text-[11px] text-content-muted">Flavors & Portions</span>
        </Card>

        <Card padding="md" className="space-y-1 text-center">
          <span className="text-[11px] sm:text-xs font-bold text-content-secondary uppercase tracking-wider">
            Ambiance
          </span>
          <div className="font-heading font-black text-2xl sm:text-3xl text-status-success flex items-center justify-center gap-1.5">
            <Sparkles className="w-5 h-5 text-status-success" />
            <span>{avgAmbiance}</span>
          </div>
          <span className="text-[11px] text-content-muted">Decor & Lighting</span>
        </Card>

        <Card padding="md" className="space-y-1 text-center">
          <span className="text-[11px] sm:text-xs font-bold text-content-secondary uppercase tracking-wider">
            Service
          </span>
          <div className="font-heading font-black text-2xl sm:text-3xl text-info flex items-center justify-center gap-1.5">
            <UserCheck className="w-5 h-5 text-info" />
            <span>{avgService}</span>
          </div>
          <span className="text-[11px] text-content-muted">Captain Hospitality</span>
        </Card>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        <h4 className="font-heading font-black text-xl text-content-primary">
          {t.recentFeedback} ({reviews.length})
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((rev) => (
            <Card key={rev.id} padding="md" className="space-y-3">
              <div className="flex items-start justify-between gap-2 border-b border-borderSubtle pb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-heading font-bold text-sm text-content-primary">
                      {rev.customerName || 'Dining Guest'} · Table {rev.tableNumber}
                    </h5>
                    <span className="text-[11px] text-content-muted">
                      {formatTimeElapsed(rev.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Star pill */}
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-sun/20 text-content-primary font-heading font-black text-xs shrink-0">
                  <Star className="w-3.5 h-3.5 fill-sun text-sun" />
                  <span>{rev.overallRating}.0</span>
                </div>
              </div>

              {/* Multi factor mini scores */}
              <div className="grid grid-cols-3 gap-2 py-1 bg-canvas rounded-xl p-2 text-[11px] text-center font-semibold text-content-secondary">
                <div>Food: <strong className="text-content-primary">{rev.foodRating}/5</strong></div>
                <div>Ambiance: <strong className="text-content-primary">{rev.ambianceRating}/5</strong></div>
                <div>Service: <strong className="text-content-primary">{rev.serviceRating}/5</strong></div>
              </div>

              {/* Tags */}
              {rev.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {rev.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-full bg-surface border border-borderSubtle text-[11px] font-bold text-content-primary shadow-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Comment */}
              {rev.comment && (
                <p className="text-xs text-content-secondary leading-relaxed italic">
                  "{rev.comment}"
                </p>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
