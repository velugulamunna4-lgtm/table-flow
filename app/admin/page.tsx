'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AdminAnalyticsChart } from '@/components/admin/AdminAnalyticsChart';
import { AdminMenuManager } from '@/components/admin/AdminMenuManager';
import { AdminTableQrManager } from '@/components/admin/AdminTableQrManager';
import { AdminSettings } from '@/components/admin/AdminSettings';
import { restaurantConfig } from '@/config/restaurant.config';
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
  ChevronRight,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'menu' | 'tables' | 'settings'>('overview');

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
                  {restaurantConfig.name} Owner Portal
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-sun text-content-primary font-bold text-xs uppercase tracking-wider">
                  Admin
                </span>
              </div>
              <p className="text-xs sm:text-sm text-content-secondary">
                Live Sales Analytics, Menu Management & QR Generation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
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
              <span>Preview Customer (/t/7)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-borderSubtle pb-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: 'Sales & Overview', icon: <BarChart3 className="w-4 h-4" /> },
            { id: 'menu', label: 'Menu Catalog', icon: <UtensilsCrossed className="w-4 h-4" /> },
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

        {/* Tab 1: Overview & Metrics */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* 4 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card padding="md" className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-content-muted">
                    Today's Revenue
                  </span>
                  <div className="w-8 h-8 rounded-full bg-status-success/15 text-status-success flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-heading font-black text-3xl text-content-primary">
                  ₹98,400
                </div>
                <div className="text-xs text-status-success font-bold flex items-center gap-1">
                  <span>+18.4% vs last Sunday</span>
                </div>
              </Card>

              <Card padding="md" className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-content-muted">
                    Total Table Orders
                  </span>
                  <div className="w-8 h-8 rounded-full bg-sun/20 text-sun flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-heading font-black text-3xl text-content-primary">
                  142
                </div>
                <div className="text-xs text-content-secondary font-medium">
                  Average ticket: ₹693
                </div>
              </Card>

              <Card padding="md" className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-content-muted">
                    Avg Table Turnover
                  </span>
                  <div className="w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-heading font-black text-3xl text-content-primary">
                  38 Mins
                </div>
                <div className="text-xs text-status-success font-bold">
                  ⚡ 14 mins faster with QR ordering
                </div>
              </Card>

              <Card padding="md" className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-content-muted">
                    Top Selling Dish
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#8B6CF6]/15 text-[#8B6CF6] flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-heading font-black text-xl text-content-primary line-clamp-1">
                  Chicken Dum Biryani
                </div>
                <div className="text-xs text-content-secondary">
                  54 orders placed today
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
                  Today · Sunday
                </span>
              </div>

              <AdminAnalyticsChart />
            </Card>
          </div>
        )}

        {/* Tab 2: Menu Catalog */}
        {activeTab === 'menu' && <AdminMenuManager />}

        {/* Tab 3: Table QRs */}
        {activeTab === 'tables' && <AdminTableQrManager />}

        {/* Tab 4: Settings */}
        {activeTab === 'settings' && <AdminSettings />}
      </div>
    </div>
  );
}
