'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LanguageSwitcher } from '@/components/customer/LanguageSwitcher';
import { AdminAnalyticsChart } from '@/components/admin/AdminAnalyticsChart';
import { AdminMenuManager } from '@/components/admin/AdminMenuManager';
import { AdminTableQrManager } from '@/components/admin/AdminTableQrManager';
import { AdminSettings } from '@/components/admin/AdminSettings';
import { AdminStockWaterManager } from '@/components/admin/AdminStockWaterManager';
import { AdminSecurityDashboard } from '@/components/admin/AdminSecurityDashboard';
import { AdminReviewsFeed } from '@/components/admin/AdminReviewsFeed';
import { restaurantConfig } from '@/config/restaurant.config';
import { useLanguageStore } from '@/lib/store';
import { translations } from '@/lib/i18n';
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  Sparkles,
  UtensilsCrossed,
  QrCode,
  Settings,
  BarChart3,
  ExternalLink,
  Droplets,
  ShieldCheck,
  Star,
  Percent,
  Layers,
  ArrowUpRight,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { language } = useLanguageStore();
  const t = translations[language].admin;

  const [activeTab, setActiveTab] = useState<
    'overview' | 'menu' | 'stock' | 'security' | 'reviews' | 'tables' | 'settings'
  >('overview');

  return (
    <div className="min-h-screen bg-canvas text-content-primary p-3 sm:p-6 md:p-8 flex flex-col font-sans transition-colors duration-300">
      <div className="max-w-6xl mx-auto w-full space-y-6 sm:space-y-8">
        {/* Top Header - Mobile and Desktop Responsive */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 sm:pb-6 border-b border-borderSubtle">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-heading font-black text-xl sm:text-2xl shadow-accent shrink-0">
              TF
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-heading font-black text-xl sm:text-3xl text-content-primary tracking-tight truncate">
                  {restaurantConfig.name} {t.overviewTab}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-sun text-content-primary font-bold text-[11px] uppercase tracking-wider shrink-0">
                  Manager
                </span>
              </div>
              <p className="text-xs sm:text-sm text-content-secondary truncate">
                Real-time Operations, Revenue, Inventory & Table Security
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end overflow-x-auto no-scrollbar py-0.5">
            <LanguageSwitcher />

            <Link
              href="/kitchen"
              className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-pill bg-surface border border-borderSubtle text-xs font-bold hover:border-primary transition-all shadow-soft shrink-0"
            >
              Kitchen
            </Link>

            <Link
              href="/waiter"
              className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-pill bg-surface border border-borderSubtle text-xs font-bold hover:border-primary transition-all shadow-soft shrink-0"
            >
              Waiter
            </Link>

            <Link
              href="/t/7"
              target="_blank"
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-pill bg-primary text-white text-xs font-bold shadow-accent hover:bg-primary-hover transition-all shrink-0"
            >
              <span>Customer</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </header>

        {/* Navigation Tabs - Mobile Horizontal Touch Scroll & PC Bar */}
        <div className="flex gap-2 border-b border-borderSubtle pb-2 overflow-x-auto no-scrollbar touch-pan-x">
          {[
            { id: 'overview', label: t.overviewTab, icon: <BarChart3 className="w-4 h-4" /> },
            { id: 'menu', label: 'Menu Catalog', icon: <UtensilsCrossed className="w-4 h-4" /> },
            { id: 'stock', label: t.stockTab, icon: <Droplets className="w-4 h-4" /> },
            { id: 'security', label: t.securityTab, icon: <ShieldCheck className="w-4 h-4" /> },
            { id: 'reviews', label: t.reviewsTab, icon: <Star className="w-4 h-4" /> },
            { id: 'tables', label: 'Table QRs', icon: <QrCode className="w-4 h-4" /> },
            { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-pill font-heading font-black text-xs sm:text-sm transition-all whitespace-nowrap shrink-0 ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-accent'
                  : 'bg-surface text-content-secondary border border-borderSubtle hover:bg-canvas'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab 1: Overview & Metrics (Revenue, Items Sold, Gross Profit, Rating) */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* 4 Metric Cards: 2 cols on mobile, 4 on desktop */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Total Revenue Spent */}
              <Card padding="md" className="space-y-1.5 sm:space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-content-muted">
                    {t.totalRevenue}
                  </span>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-status-success/15 text-status-success flex items-center justify-center">
                    <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                </div>
                <div className="font-heading font-black text-2xl sm:text-3xl text-content-primary">
                  ₹1,48,900
                </div>
                <div className="text-[11px] sm:text-xs text-status-success font-bold flex items-center gap-1">
                  <span>+24.2% today (142 orders)</span>
                </div>
              </Card>

              {/* Total Items Sold */}
              <Card padding="md" className="space-y-1.5 sm:space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-content-muted">
                    {t.itemsSold}
                  </span>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-sun/20 text-sun flex items-center justify-center">
                    <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                </div>
                <div className="font-heading font-black text-2xl sm:text-3xl text-content-primary">
                  384 Dishes
                </div>
                <div className="text-[11px] sm:text-xs text-content-secondary font-medium truncate">
                  Biryani: 112 · Mains: 148
                </div>
              </Card>

              {/* Gross Profit & Margin */}
              <Card padding="md" className="space-y-1.5 sm:space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-content-muted">
                    {t.grossProfit}
                  </span>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center">
                    <Percent className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                </div>
                <div className="font-heading font-black text-2xl sm:text-3xl text-primary">
                  ₹92,318
                </div>
                <div className="text-[11px] sm:text-xs text-status-success font-bold flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>62.0% {t.profitMargin}</span>
                </div>
              </Card>

              {/* Average Guest Rating */}
              <Card padding="md" className="space-y-1.5 sm:space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-content-muted">
                    {t.avgRating}
                  </span>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-sun/20 text-sun flex items-center justify-center">
                    <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-sun" />
                  </div>
                </div>
                <div className="font-heading font-black text-2xl sm:text-3xl text-content-primary flex items-center gap-1">
                  <Star className="w-5 h-5 sm:w-6 sm:h-6 text-sun fill-sun" />
                  <span>4.8 / 5.0</span>
                </div>
                <div className="text-[11px] sm:text-xs text-content-secondary">
                  Based on 94 reviews
                </div>
              </Card>
            </div>

            {/* Sales Hourly Chart */}
            <AdminAnalyticsChart />

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <Card
                padding="md"
                interactive
                onClick={() => setActiveTab('stock')}
                className="space-y-2 border-borderSubtle hover:border-primary/40"
              >
                <div className="flex items-center gap-2 font-heading font-bold text-base text-content-primary">
                  <Droplets className="w-5 h-5 text-primary" />
                  <span>Water Tank & Stock</span>
                </div>
                <p className="text-xs text-content-secondary">
                  1,850L RO water available · 2 raw stock items near reorder threshold.
                </p>
              </Card>

              <Card
                padding="md"
                interactive
                onClick={() => setActiveTab('security')}
                className="space-y-2 border-borderSubtle hover:border-primary/40"
              >
                <div className="flex items-center gap-2 font-heading font-bold text-base text-content-primary">
                  <ShieldCheck className="w-5 h-5 text-status-success" />
                  <span>ODG Table Protection</span>
                </div>
                <p className="text-xs text-content-secondary">
                  Anti-tamper shield active across 12 tables. Prevent cross-table scan overwrites.
                </p>
              </Card>

              <Card
                padding="md"
                interactive
                onClick={() => setActiveTab('reviews')}
                className="space-y-2 border-borderSubtle hover:border-primary/40"
              >
                <div className="flex items-center gap-2 font-heading font-bold text-base text-content-primary">
                  <Star className="w-5 h-5 text-sun fill-sun" />
                  <span>Customer Feedback</span>
                </div>
                <p className="text-xs text-content-secondary">
                  4.8 / 5.0 satisfaction · Food quality and ambiance rated highest by diners.
                </p>
              </Card>
            </div>
          </div>
        )}

        {/* Tab 2: Menu Catalog Manager */}
        {activeTab === 'menu' && <AdminMenuManager />}

        {/* Tab 3: Water Tank & Raw Stock Maintenance */}
        {activeTab === 'stock' && <AdminStockWaterManager />}

        {/* Tab 4: ODG Dining Session Security */}
        {activeTab === 'security' && <AdminSecurityDashboard />}

        {/* Tab 5: Customer Reviews Feed */}
        {activeTab === 'reviews' && <AdminReviewsFeed />}

        {/* Tab 6: Table QR Tent Cards Generator */}
        {activeTab === 'tables' && <AdminTableQrManager />}

        {/* Tab 7: Restaurant Settings */}
        {activeTab === 'settings' && <AdminSettings />}
      </div>
    </div>
  );
}
