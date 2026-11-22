'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { restaurantConfig } from '@/config/restaurant.config';
import {
  Sparkles,
  ArrowRight,
  QrCode,
  Flame,
  Clock,
  TrendingUp,
  CheckCircle2,
  Users,
  Smartphone,
  ChefHat,
  Tv2,
  ShieldCheck,
  Zap,
  PhoneCall,
  ExternalLink,
} from 'lucide-react';

export default function MarketingLandingPage() {
  const [activeMockupTab, setActiveMockupTab] = useState<'customer' | 'kitchen' | 'waiter'>('customer');

  return (
    <div className="min-h-screen bg-canvas font-sans text-content-primary selection:bg-primary/25">
      {/* Navbar */}
      <header className="sticky top-0 z-40 bg-canvas/90 backdrop-blur-md border-b border-borderSubtle">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-primary text-white flex items-center justify-center font-heading font-black text-2xl shadow-accent">
              TF
            </div>
            <div>
              <span className="font-heading font-black text-xl text-content-primary tracking-tight">
                Table Flow
              </span>
              <span className="block text-[11px] font-bold text-content-muted uppercase tracking-wider">
                Digital Ordering OS
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-content-secondary">
            <a href="#how-it-works" className="hover:text-primary transition-colors">
              How it works
            </a>
            <a href="#benefits" className="hover:text-primary transition-colors">
              Benefits
            </a>
            <a href="#demo" className="hover:text-primary transition-colors">
              Live Mockup
            </a>
            <a href="#pricing" className="hover:text-primary transition-colors">
              Pricing
            </a>
            <Link href="/design-system" className="hover:text-primary transition-colors text-xs px-2.5 py-1 rounded-full bg-sun/20 text-[#9A6700]">
              UI Kit Preview
            </Link>
          </nav>

          <div className="flex items-center gap-2.5">
            <Link href="/admin">
              <Button variant="secondary" size="sm" className="hidden sm:inline-flex">
                Owner Portal
              </Button>
            </Link>
            <Link href="/t/7">
              <Button variant="primary" size="sm" className="shadow-accent">
                See Live Demo
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-20 sm:pt-24 sm:pb-28 px-4 text-center max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sun/25 text-content-primary text-xs sm:text-sm font-bold shadow-soft">
          <Sparkles className="w-4 h-4 text-primary" />
          <span>Phase 1 Frontend Prototype · Ready for Restaurant Demos</span>
        </div>

        <h1 className="font-heading font-black text-4xl sm:text-6xl md:text-7xl text-content-primary leading-[1.08] tracking-tight">
          Your restaurant,{' '}
          <span className="bg-gradient-to-r from-primary via-sun to-primary bg-clip-text text-transparent">
            ordering itself.
          </span>
        </h1>

        <p className="text-content-secondary text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
          Zero friction QR dining. Guests tap what they want in their mother tongue, orders reach the kitchen display instantly, and bills split without waiter headaches.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/t/7" className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto font-black shadow-accent text-base sm:text-lg"
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              See Live Demo (Table 7)
            </Button>
          </Link>

          <Link href="/kitchen" className="w-full sm:w-auto">
            <Button
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto font-bold text-base sm:text-lg"
              leftIcon={<ChefHat className="w-5 h-5 text-primary" />}
            >
              Watch Kitchen Screen (KDS)
            </Button>
          </Link>
        </div>

        {/* Quick stat callout */}
        <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-content-secondary text-xs sm:text-sm font-semibold">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-status-success" />
            <span>No App Download Needed</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-status-success" />
            <span>4 Indian Languages</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-status-success" />
            <span>Live Tab Synchronization</span>
          </div>
        </div>
      </section>

      {/* Live 3-Screen Mockup Demonstration Section */}
      <section id="demo" className="py-16 bg-surface border-y border-borderSubtle">
        <div className="max-w-6xl mx-auto px-4 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-primary px-3 py-1 rounded-full bg-primary/10">
              Interactive Preview
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-content-primary">
              All 3 Workflows Synchronized Live
            </h2>
            <p className="text-sm text-content-secondary max-w-lg mx-auto">
              Place an order on the customer phone and watch it arrive on the kitchen display in real time using the BroadcastChannel API.
            </p>
          </div>

          {/* Screen Tab Switcher */}
          <div className="flex justify-center gap-2">
            {[
              { id: 'customer', label: '1. Customer Ordering (/t/7)', icon: <Smartphone className="w-4 h-4" /> },
              { id: 'kitchen', label: '2. Kitchen Display (/kitchen)', icon: <ChefHat className="w-4 h-4" /> },
              { id: 'waiter', label: '3. Waiter Tablet (/waiter)', icon: <Tv2 className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveMockupTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-pill font-bold text-xs sm:text-sm transition-all ${
                  activeMockupTab === tab.id
                    ? 'bg-primary text-white shadow-accent'
                    : 'bg-canvas text-content-secondary border border-borderSubtle hover:bg-surface'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Screen Frame Mockup */}
          <div className="rounded-3xl border-2 border-borderSubtle overflow-hidden shadow-2xl bg-canvas">
            <div className="bg-[#2B1D14] text-white px-4 py-3 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#FF5A6E]" />
                <span className="w-3 h-3 rounded-full bg-[#FFC233]" />
                <span className="w-3 h-3 rounded-full bg-[#2DBE7E]" />
                <span className="ml-2 font-bold opacity-80">
                  {activeMockupTab === 'customer'
                    ? 'http://tableflow.demo/t/7'
                    : activeMockupTab === 'kitchen'
                    ? 'http://tableflow.demo/kitchen'
                    : 'http://tableflow.demo/waiter'}
                </span>
              </div>
              <Link
                href={
                  activeMockupTab === 'customer'
                    ? '/t/7'
                    : activeMockupTab === 'kitchen'
                    ? '/kitchen'
                    : '/waiter'
                }
                target="_blank"
                className="text-[#FFC233] hover:underline flex items-center gap-1 font-bold"
              >
                <span>Open in Tab</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

            <div className="p-4 sm:p-8 flex justify-center">
              {activeMockupTab === 'customer' && (
                <div className="max-w-sm w-full bg-surface rounded-3xl p-5 border border-borderSubtle shadow-lifted space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-borderSubtle">
                    <span className="font-heading font-black text-lg">Table 7 Order</span>
                    <span className="px-2 py-0.5 rounded-full bg-sun text-xs font-bold">2 items</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between font-bold">
                      <span>1x Hyderabadi Dum Biryani</span>
                      <span>₹390</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>2x Alphonso Mango Lassi</span>
                      <span>₹300</span>
                    </div>
                  </div>
                  <Link href="/t/7">
                    <Button variant="primary" size="md" className="w-full mt-2 font-bold">
                      Launch Full Customer App
                    </Button>
                  </Link>
                </div>
              )}

              {activeMockupTab === 'kitchen' && (
                <div className="max-w-md w-full bg-[#1A1715] text-white rounded-3xl p-5 border border-[#332C26] shadow-lifted space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span className="font-heading font-black text-xl text-[#FFC233]">Table 4 · Cooking</span>
                    <span className="px-2 py-0.5 rounded-md bg-[#FF7A45] text-xs font-bold">~12m</span>
                  </div>
                  <div className="space-y-1.5 text-xs text-[#C4BBB4]">
                    <div>🍗 1x Hyderabadi Chicken 65</div>
                    <div>🍚 2x Hyderabadi Chicken Dum Biryani</div>
                  </div>
                  <Link href="/kitchen">
                    <Button variant="primary" size="md" className="w-full mt-2 font-bold">
                      Launch Dark Kitchen KDS
                    </Button>
                  </Link>
                </div>
              )}

              {activeMockupTab === 'waiter' && (
                <div className="max-w-md w-full bg-surface rounded-3xl p-5 border border-borderSubtle shadow-lifted space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-borderSubtle">
                    <span className="font-heading font-black text-lg">Floor Overview (12 Tables)</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#2DBE7E]/20 text-[#2DBE7E] text-xs font-bold">
                      8 Free Tables
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
                    <div className="p-2.5 rounded-xl bg-canvas border">Table 1 (Cooking)</div>
                    <div className="p-2.5 rounded-xl bg-[#2DBE7E]/15 text-[#2DBE7E] border border-[#2DBE7E]/30">Table 2 (Free)</div>
                    <div className="p-2.5 rounded-xl bg-[#FF5A6E]/15 text-[#FF5A6E] border border-[#FF5A6E]/30">Table 3 (Help)</div>
                  </div>
                  <Link href="/waiter">
                    <Button variant="sun" size="md" className="w-full mt-2 font-bold">
                      Launch Waiter Tablet Hub
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* How it Works (3 Illustrated Steps) */}
      <section id="how-it-works" className="py-20 max-w-6xl mx-auto px-4 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-primary px-3 py-1 rounded-full bg-primary/10">
            Simple 3 Steps
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-4xl text-content-primary">
            How Table Flow Works
          </h2>
          <p className="text-sm text-content-secondary max-w-md mx-auto">
            Zero setup for guests. Instant speed for chefs. Seamless accountability for owners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card padding="lg" className="text-center space-y-4 hover:border-primary/40 transition-all">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-sun/25 text-content-primary flex items-center justify-center text-3xl shadow-soft">
              📱
            </div>
            <div className="font-heading font-black text-xl text-content-primary">
              1. Scan Table QR
            </div>
            <p className="text-sm text-content-secondary leading-relaxed">
              Diner opens their native camera and points at the tent card. The menu opens instantly with veg tags, spice indicators, and live photos.
            </p>
          </Card>

          <Card padding="lg" className="text-center space-y-4 hover:border-primary/40 transition-all">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-primary/15 text-primary flex items-center justify-center text-3xl shadow-soft">
              🍳
            </div>
            <div className="font-heading font-black text-xl text-content-primary">
              2. Kitchen Cooks Instantly
            </div>
            <p className="text-sm text-content-secondary leading-relaxed">
              Ticket appears on the dark kitchen display with elapsed timer and custom cooking notes. Overdue tickets turn terracotta after 15 mins.
            </p>
          </Card>

          <Card padding="lg" className="text-center space-y-4 hover:border-primary/40 transition-all">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-status-success/15 text-status-success flex items-center justify-center text-3xl shadow-soft">
              🧾
            </div>
            <div className="font-heading font-black text-xl text-content-primary">
              3. Split Bill & UPI Settle
            </div>
            <p className="text-sm text-content-secondary leading-relaxed">
              Friends split equally or tap what they ordered. Pay via GPay, PhonePe, card, or pay at counter without waiting for bill folders.
            </p>
          </Card>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-surface border-y border-borderSubtle">
        <div className="max-w-6xl mx-auto px-4 space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-primary px-3 py-1 rounded-full bg-primary/10">
              Proven Restaurant ROI
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-content-primary">
              Built for Faster Tables and Higher Margins
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card padding="md" className="space-y-3">
              <div className="text-3xl font-heading font-black text-primary">⚡ 14 Mins</div>
              <h4 className="font-heading font-bold text-lg text-content-primary">
                Faster Table Turnover
              </h4>
              <p className="text-xs text-content-secondary leading-relaxed">
                Eliminates 3 separate waiter trips for menu delivery, taking the order, and settling the bill.
              </p>
            </Card>

            <Card padding="md" className="space-y-3">
              <div className="text-3xl font-heading font-black text-sun">📈 +22%</div>
              <h4 className="font-heading font-bold text-lg text-content-primary">
                Higher Average Bill
              </h4>
              <p className="text-xs text-content-secondary leading-relaxed">
                Visual appetising food photos and easy dessert/drink add-ons encourage impulse ordering.
              </p>
            </Card>

            <Card padding="md" className="space-y-3">
              <div className="text-3xl font-heading font-black text-status-success">🎯 0%</div>
              <h4 className="font-heading font-bold text-lg text-content-primary">
                Misheard Order Errors
              </h4>
              <p className="text-xs text-content-secondary leading-relaxed">
                Chef instructions (e.g. "no onion", "extra spicy") go straight from customer fingertips to the wok.
              </p>
            </Card>

            <Card padding="md" className="space-y-3">
              <div className="text-3xl font-heading font-black text-[#8B6CF6]">😊 100%</div>
              <h4 className="font-heading font-bold text-lg text-content-primary">
                Happier Floor Staff
              </h4>
              <p className="text-xs text-content-secondary leading-relaxed">
                Captains focus on warm hospitality, dish recommendations, and service rather than writing tickets.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section id="pricing" className="py-20 max-w-6xl mx-auto px-4 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-primary px-3 py-1 rounded-full bg-primary/10">
            Simple Pricing
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-4xl text-content-primary">
            Predictable Plans for Every Dining Floor
          </h2>
          <p className="text-sm text-content-secondary max-w-md mx-auto">
            No commission cuts on orders. Keep 100% of your restaurant revenue.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Starter */}
          <Card padding="lg" className="space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="font-heading font-black text-xl text-content-primary">
                Starter Dine
              </div>
              <p className="text-xs text-content-secondary">
                Ideal for cozy cafes and neighborhood bistros.
              </p>
              <div className="font-heading font-black text-4xl text-content-primary">
                ₹1,499<span className="text-sm font-normal text-content-muted">/month</span>
              </div>
              <ul className="space-y-2.5 text-xs text-content-secondary">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-status-success" />
                  <span>Up to 15 table QR codes</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-status-success" />
                  <span>Kitchen Display (1 station)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-status-success" />
                  <span>UPI & Counter bill settling</span>
                </li>
              </ul>
            </div>
            <Button variant="secondary" size="md" className="w-full">
              Get Started
            </Button>
          </Card>

          {/* Growth (Featured) */}
          <Card
            padding="lg"
            className="space-y-6 flex flex-col justify-between border-2 border-primary shadow-lifted relative bg-surface"
          >
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-white text-xs font-black uppercase tracking-wider shadow-sm">
              Most Popular
            </div>
            <div className="space-y-4">
              <div className="font-heading font-black text-xl text-content-primary">
                Growth Restaurant
              </div>
              <p className="text-xs text-content-secondary">
                For busy dining rooms and high-volume family restaurants.
              </p>
              <div className="font-heading font-black text-4xl text-primary">
                ₹2,999<span className="text-sm font-normal text-content-muted">/month</span>
              </div>
              <ul className="space-y-2.5 text-xs text-content-secondary">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-status-success" />
                  <span>Unlimited table QR tent cards</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-status-success" />
                  <span>Multi-station Kitchen Display</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-status-success" />
                  <span>Captain & Waiter assistance tablet app</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-status-success" />
                  <span>4 Languages (English, Telugu, Tamil, Hindi)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-status-success" />
                  <span>Waiting mini-games & rewards</span>
                </li>
              </ul>
            </div>
            <Button variant="primary" size="lg" className="w-full shadow-accent font-bold">
              Start Free 14-Day Trial
            </Button>
          </Card>

          {/* Chain */}
          <Card padding="lg" className="space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="font-heading font-black text-xl text-content-primary">
                Multi-Outlet Chain
              </div>
              <p className="text-xs text-content-secondary">
                For restaurant groups and franchise hospitality brands.
              </p>
              <div className="font-heading font-black text-4xl text-content-primary">
                ₹6,999<span className="text-sm font-normal text-content-muted">/month</span>
              </div>
              <ul className="space-y-2.5 text-xs text-content-secondary">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-status-success" />
                  <span>Central multi-outlet menu sync</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-status-success" />
                  <span>Custom themes & custom domain branding</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-status-success" />
                  <span>Priority 24/7 phone & on-site support</span>
                </li>
              </ul>
            </div>
            <Button variant="secondary" size="md" className="w-full">
              Contact Enterprise
            </Button>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-surface border-t border-borderSubtle">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center font-heading font-black text-sm">
                TF
              </div>
              <span className="font-heading font-black text-lg text-content-primary">
                Table Flow
              </span>
            </div>
            <p className="text-xs text-content-secondary">
              Premium Digital Dining & QR Floor Operating System
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold text-content-secondary">
            <Link href="/t/7" className="hover:text-primary transition-colors">
              Customer View
            </Link>
            <Link href="/kitchen" className="hover:text-primary transition-colors">
              Kitchen Display
            </Link>
            <Link href="/waiter" className="hover:text-primary transition-colors">
              Waiter Hub
            </Link>
            <Link href="/admin" className="hover:text-primary transition-colors">
              Admin Portal
            </Link>
            <Link href="/design-system" className="hover:text-primary transition-colors">
              Design System
            </Link>
          </div>

          <Button variant="sun" size="md" className="font-bold">
            Book a Free Setup Call
          </Button>
        </div>
      </footer>
    </div>
  );
}
