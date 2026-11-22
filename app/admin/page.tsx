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
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { language } = useLanguageStore();
  const t = translations[language].admin;

  const [activeTab, setActiveTab] = useState<
    'overview' | 'menu' | 'stock' | 'security' | 'reviews' | 'tables' | 'settings'
  >('overview');

  return (
    <div className="min-h-screen bg-canvas text-content-primary p-4 sm:p-6 md:p-8 flex flex-col font-sans transition-colors duration-300">
      <div className="max-w-6xl mx-auto w-full space-y-8">
        {/* Top Header */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-borderSubtle">
          <div className="flex items-center gap-3.5 w-full sm:w-auto">
            <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-heading font-black text-2xl shadow-accent">
              TF
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading font-black text-2xl sm:text-3xl text-content-primary">
                  {restaurantConfig.name} {t.overviewTab}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-sun text-content-primary font-bold text-xs uppercase tracking-wider">
                  Admin
                </span>
              </div>
              <p className="text-xs sm:text-sm text-content-secondary">
                Revenue, Item Sales, Gross Profit, Stock Maintenance & ODG Table Security
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <LanguageSwitcher />

            <Link
              href="/kitchen"
              className="px-3.5 py-2 rounded-pill bg-surface border border-borderSubtle text-xs font-bold hover:border-primary transition-all shadow-soft"
            >
              Kitchen KDS
            </Link>

            <Link
              href="/waiter"
              className="px-3.5 py-2 rounded-pill bg-surface border border-borderSubtle text-xs font-bold hover:border-primary transition-all shadow-soft"
            >
              Waiter Floor
            </Link>

            <Link
              href="/t/7"
              target="_blank"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-pill bg-primary text-white text-xs font-bold shadow-accent hover:bg-primary-hover transition-all"
            >
              <span>Preview Customer</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-borderSubtle pb-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: t.overviewTab, icon: <BarChart3 className="w-4 h-4" /> },
            { id: 'menu', label: 'Menu Catalog', icon: <UtensilsCrossed className="w-4 h-4" /> },
            { id: 'stock', label: t.stockTab, icon: <Droplets className="w-4 h-4" /> },
            { id: 'security', label: t.securityTab, icon: <ShieldCheck className="w-4 h-4" /> },
            { id: 'reviews', label: t.reviewsTab, icon: <Star className="w-4 h-4" /> },
            { id: 'tables', label: 'Table QRs', icon: <QrCode className="w-4 h-4" /> },
            { id: 'settings', label: 'Store Settings', icon: <Settings className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-pill font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
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
            {/* 4 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Revenue Spent */}
              <Card padding="md" className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-content-muted">
                    {t.totalRevenue}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-status-success/15 text-status-success flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-heading font-black text-3xl text-content-primary">
                  ₹1,48,900
                </div>
                <div className="text-xs text-status-success font-bold flex items-center gap-1">
                  <span>+24.2% today (142 orders)</span>
                </div>
              </Card>

              {/* Total Items Sold */}
              <Card padding="md" className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-content-muted">
                    {t.itemsSold}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-sun/20 text-sun flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-heading font-black text-3xl text-content-primary">
                  384 Dishes
                </div>
                <div className="text-xs text-content-secondary font-medium">
                  Biryani: 112 · Mains: 148 · Starters: 124
                </div>
              </Card>

              {/* Gross Profit & Margin */}
              <Card padding="md" className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-content-muted">
                    {t.grossProfit}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center">
                    <Percent className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-heading font-black text-3xl text-primary">
                  ₹92,318
                </div>
                <div className="text-xs text-status-success font-bold">
                  ⚡ 62.0% {t.profitMargin}
                </div>
              </Card>

              {/* Average Guest Rating */}
              <Card padding="md" className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-content-muted">
                    {t.avgRating}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#8B6CF6]/15 text-[#8B6CF6] flex items-center justify-center">
                    <Star className="w-4 h-4 fill-[#8B6CF6]" />
                  </div>
                </div>
                <div className="font-heading font-black text-3xl text-content-primary flex items-center gap-1.5">
                  <Star className="w-6 h-6 text-[#FFC233] fill-[#FFC233]" />
                  <span>4.8 / 5.0</span>
                </div>
                <div className="text-xs text-content-secondary">
                  Based on live customer feedback
                </div>
              </Card>
            </div>

            {/* Sales Hourly Chart */}
            <Card padding="lg" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-black text-xl text-content-primary">
                    Today's Hourly Revenue Stream
                  </h3>
                  <p className="text-xs text-content-secondary">
                    Real-time sales distribution across lunch and dinner services
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-canvas text-xs font-mono font-bold text-content-secondary border border-borderSubtle">
                  Live Stream
                </span>
              </div>

              <AdminAnalyticsChart />
            </Card>
          </div>
        )}

        {/* Tab 2: Menu Catalog */}
        {activeTab === 'menu' && <AdminMenuManager />}

        {/* Tab 3: Stock Maintenance & Water Tank */}
        {activeTab === 'stock' && <AdminStockWaterManager />}

        {/* Tab 4: Table Security & ODG Anti-Hijack */}
        {activeTab === 'security' && <AdminSecurityDashboard />}

        {/* Tab 5: Guest Reviews */}
        {activeTab === 'reviews' && <AdminReviewsFeed />}

        {/* Tab 6: Table QRs */}
        {activeTab === 'tables' && <AdminTableQrManager />}

        {/* Tab 7: Settings */}
        {activeTab === 'settings' && <AdminSettings />}
      </div>
    </div>
  );
}
