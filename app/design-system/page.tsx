'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import { VegIndicator } from '@/components/ui/VegIndicator';
import { SpiceLevel } from '@/components/ui/SpiceLevel';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { useThemeStore } from '@/lib/store';
import { THEMES } from '@/config/themes';
import { restaurantConfig } from '@/config/restaurant.config';
import {
  Sparkles,
  ShoppingBag,
  ArrowRight,
  Sun,
  Leaf,
  Check,
  Utensils,
  ChefHat,
  Tv2,
  Settings,
  Flame,
  FileText
} from 'lucide-react';

export default function DesignSystemPreviewPage() {
  const { currentTheme, setTheme } = useThemeStore();
  const [stepperCount, setStepperCount] = useState(2);
  const [activeTab, setActiveTab] = useState('specials');

  return (
    <div className="min-h-screen bg-canvas p-4 sm:p-8 md:p-12 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-borderSubtle">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Design System & Tokens Preview
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-content-primary">
              {restaurantConfig.name} UI Kit
            </h1>
            <p className="text-content-secondary mt-1 text-base sm:text-lg">
              Warm, tactile, and sunny Indian dining aesthetic. Baloo 2 + Plus Jakarta Sans.
            </p>
          </div>

          {/* Theme Switcher Toggle */}
          <div className="flex items-center gap-2 bg-surface p-1.5 rounded-pill border border-borderSubtle shadow-soft self-start md:self-auto">
            <button
              onClick={() => setTheme('sunny-family')}
              className={`flex items-center gap-2 px-4 py-2 rounded-pill font-bold text-sm transition-all ${
                currentTheme === 'sunny-family'
                  ? 'bg-primary text-white shadow-accent'
                  : 'text-content-secondary hover:text-content-primary'
              }`}
            >
              <Sun className="w-4 h-4" />
              Sunny Family (Default)
            </button>
            <button
              onClick={() => setTheme('modern-green')}
              className={`flex items-center gap-2 px-4 py-2 rounded-pill font-bold text-sm transition-all ${
                currentTheme === 'modern-green'
                  ? 'bg-primary text-white shadow-accent'
                  : 'text-content-secondary hover:text-content-primary'
              }`}
            >
              <Leaf className="w-4 h-4" />
              Modern Green
            </button>
          </div>
        </header>

        {/* Section 1: Color Palette Tokens */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-content-primary">
            1. Core Color System ({THEMES[currentTheme]?.name})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
            {[
              { name: 'Canvas', var: '--bg-canvas', hex: THEMES[currentTheme]?.variables.bgCanvas, border: true },
              { name: 'Card Surface', var: '--bg-card', hex: THEMES[currentTheme]?.variables.bgCard, border: true },
              { name: 'Text Primary', var: '--text-primary', hex: THEMES[currentTheme]?.variables.textPrimary },
              { name: 'Primary Accent', var: '--accent-primary', hex: THEMES[currentTheme]?.variables.accentPrimary },
              { name: 'Sun Yellow', var: '--accent-sun', hex: THEMES[currentTheme]?.variables.accentSun },
              { name: 'Success / Veg', var: '--success', hex: THEMES[currentTheme]?.variables.success },
              { name: 'Alert / Non-Veg', var: '--alert', hex: THEMES[currentTheme]?.variables.alert },
            ].map((col) => (
              <Card key={col.name} padding="sm" className="space-y-2">
                <div
                  className={`w-full h-16 rounded-2xl ${col.border ? 'border border-borderSubtle' : ''}`}
                  style={{ backgroundColor: col.hex }}
                />
                <div>
                  <div className="font-heading font-bold text-sm text-content-primary">{col.name}</div>
                  <div className="text-xs font-mono text-content-secondary">{col.hex}</div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Section 2: Buttons & Large Touch Targets */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-content-primary">
            2. Action Buttons (Pill 999px, Min 48px Height)
          </h2>
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="primary" size="md">
              Primary Action
            </Button>
            <Button variant="sun" size="md">
              Sun Accent
            </Button>
            <Button variant="secondary" size="md">
              Secondary Pill
            </Button>
            <Button variant="alert" size="md">
              Alert Action
            </Button>
            <Button variant="success" size="md" leftIcon={<Check className="w-5 h-5" />}>
              Ready State
            </Button>
            <Button variant="outline" size="md">
              Outline
            </Button>
            <Button variant="ghost" size="md">
              Ghost Link
            </Button>
            <Button variant="primary" size="md" isLoading>
              Loading
            </Button>
          </div>
        </section>

        {/* Section 3: Interactive Stepper & Veg/Non-Veg Indicators */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-content-primary">
            3. Menu Card Controls (Morphing Stepper & Dietary Badges)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card padding="md" className="space-y-4">
              <h3 className="font-heading font-bold text-lg text-content-primary">
                Quantity Stepper (Morphing + Add)
              </h3>
              <p className="text-sm text-content-secondary">
                Tap plus or minus to see the interactive transition:
              </p>
              <div className="flex items-center gap-4">
                <QuantityStepper
                  quantity={stepperCount}
                  onAdd={() => setStepperCount(1)}
                  onIncrement={() => setStepperCount((c) => c + 1)}
                  onDecrement={() => setStepperCount((c) => Math.max(0, c - 1))}
                />
                <span className="text-sm text-content-muted">Count: {stepperCount}</span>
              </div>
              <div className="pt-2">
                <div className="text-xs text-content-secondary mb-1">Zero / Unselected State:</div>
                <QuantityStepper
                  quantity={0}
                  onAdd={() => setStepperCount(1)}
                  onIncrement={() => {}}
                  onDecrement={() => {}}
                />
              </div>
            </Card>

            <Card padding="md" className="space-y-4">
              <h3 className="font-heading font-bold text-lg text-content-primary">
                Dietary & Spice Badges
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <VegIndicator type="veg" size="lg" showLabel />
                  <VegIndicator type="non-veg" size="lg" showLabel />
                </div>
                <div className="flex flex-col gap-2 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-content-secondary">Mild:</span>
                    <SpiceLevel level={1} showText />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-content-secondary">Medium:</span>
                    <SpiceLevel level={2} showText />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-content-secondary">Fiery Hot:</span>
                    <SpiceLevel level={3} showText />
                  </div>
                </div>
              </div>
            </Card>

            <Card padding="md" className="space-y-4">
              <h3 className="font-heading font-bold text-lg text-content-primary">
                Live Status Badges
              </h3>
              <div className="flex flex-wrap gap-2">
                <StatusBadge status="sent" />
                <StatusBadge status="accepted" />
                <StatusBadge status="cooking" />
                <StatusBadge status="ready" />
                <StatusBadge status="served" />
              </div>
            </Card>
          </div>
        </section>

        {/* Section 4: Category Navigation Pills */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-content-primary">
            4. Category Pills (Horizontal Scrollable)
          </h2>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {[
              { id: 'specials', label: "Chef's Specials", count: 4 },
              { id: 'starters', label: 'Starters', count: 7 },
              { id: 'mains', label: 'Main Course', count: 7 },
              { id: 'biryani', label: 'Dum Biryani', count: 5 },
              { id: 'desserts', label: 'Desserts', count: 5 },
              { id: 'drinks', label: 'Beverages', count: 4 },
            ].map((cat) => (
              <Pill
                key={cat.id}
                active={activeTab === cat.id}
                count={cat.count}
                onClick={() => setActiveTab(cat.id)}
              >
                {cat.label}
              </Pill>
            ))}
          </div>
        </section>

        {/* Section 5: Dish Card Preview (Reference Design Look) */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-content-primary">
            5. Reference Design Menu Card Example
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card padding="md" interactive className="flex flex-col sm:flex-row gap-5">
              <div className="relative w-full sm:w-44 h-44 rounded-2xl overflow-hidden shrink-0 bg-canvas">
                <img
                  src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80"
                  alt="Hyderabadi Chicken Dum Biryani"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2.5 left-2.5">
                  <VegIndicator type="non-veg" size="md" />
                </div>
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/60 text-white text-xs font-bold backdrop-blur-sm">
                  Bestseller
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-heading font-bold text-xl text-content-primary">
                      Hyderabadi Chicken Dum Biryani
                    </h4>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <SpiceLevel level={2} showText />
                    <span className="text-xs text-content-muted">· ~15 mins</span>
                  </div>
                  <p className="text-sm text-content-secondary line-clamp-2 mt-2 leading-relaxed">
                    Fragrant long-grain aged basmati rice cooked on sealed dum with spiced marinated
                    chicken and saffron ghee.
                  </p>
                </div>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-borderSubtle">
                  <div className="font-heading font-extrabold text-2xl text-content-primary">
                    ₹390
                  </div>
                  <QuantityStepper
                    quantity={2}
                    onAdd={() => {}}
                    onIncrement={() => {}}
                    onDecrement={() => {}}
                  />
                </div>
              </div>
            </Card>

            <Card padding="md" className="flex flex-col sm:flex-row gap-5 opacity-75 relative overflow-hidden">
              <div className="relative w-full sm:w-44 h-44 rounded-2xl overflow-hidden shrink-0 bg-canvas">
                <img
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80"
                  alt="Avadhi Dum Kebab Platter"
                  className="w-full h-full object-cover grayscale"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-2 text-center">
                  <span className="bg-[#FF5A6E] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                    Not available right now
                  </span>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <VegIndicator type="non-veg" size="md" />
                    <h4 className="font-heading font-bold text-xl text-content-muted">
                      Avadhi Dum Kebab Platter
                    </h4>
                  </div>
                  <p className="text-sm text-content-muted line-clamp-2 mt-2 leading-relaxed">
                    A grand assortment of Kakori kebabs, Galouti melts, and Zafrani paneer.
                  </p>
                </div>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-borderSubtle">
                  <div className="font-heading font-bold text-2xl text-content-muted">
                    ₹680
                  </div>
                  <QuantityStepper
                    disabled
                    quantity={0}
                    onAdd={() => {}}
                    onIncrement={() => {}}
                    onDecrement={() => {}}
                  />
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Section 6: Skeletons & Empty States */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-content-primary">
            6. Skeletons & Empty States
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card padding="md" className="space-y-4">
              <div className="text-sm font-bold text-content-secondary">Soft Skeleton Loader:</div>
              <div className="flex gap-4">
                <Skeleton className="w-24 h-24 rounded-2xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-3/4 rounded-xl" />
                  <Skeleton className="h-4 w-full rounded-lg" />
                  <Skeleton className="h-4 w-1/2 rounded-lg" />
                </div>
              </div>
            </Card>

            <EmptyState
              icon={<Utensils className="w-8 h-8 text-primary" />}
              title="Your Feast Awaits"
              description="Choose from fragrant biryanis, slow-simmered gravies, and hot tandoori breads."
              actionLabel="Explore Menu"
              onAction={() => {}}
            />
          </div>
        </section>

        {/* Navigation Quick Jump Footer */}
        <footer className="pt-8 border-t border-borderSubtle">
          <h3 className="font-heading font-bold text-lg text-content-primary mb-4">
            Direct Route Jumps:
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link
              href="/t/7"
              className="flex items-center gap-2 p-3 rounded-2xl bg-surface border border-borderSubtle hover:border-primary text-sm font-bold text-content-primary transition-all"
            >
              <Utensils className="w-4 h-4 text-primary" />
              Customer View (/t/7)
            </Link>
            <Link
              href="/kitchen"
              className="flex items-center gap-2 p-3 rounded-2xl bg-surface border border-borderSubtle hover:border-primary text-sm font-bold text-content-primary transition-all"
            >
              <ChefHat className="w-4 h-4 text-primary" />
              Kitchen Display (/kitchen)
            </Link>
            <Link
              href="/waiter"
              className="flex items-center gap-2 p-3 rounded-2xl bg-surface border border-borderSubtle hover:border-primary text-sm font-bold text-content-primary transition-all"
            >
              <Tv2 className="w-4 h-4 text-primary" />
              Waiter Hub (/waiter)
            </Link>
            <Link
              href="/admin"
              className="flex items-center gap-2 p-3 rounded-2xl bg-surface border border-borderSubtle hover:border-primary text-sm font-bold text-content-primary transition-all"
            >
              <Settings className="w-4 h-4 text-primary" />
              Admin (/admin)
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
