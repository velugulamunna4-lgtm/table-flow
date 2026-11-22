'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useThemeStore } from '@/lib/store';
import { restaurantConfig } from '@/config/restaurant.config';
import { THEMES } from '@/config/themes';
import { Sun, Leaf, Check, Save } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { currentTheme, setTheme } = useThemeStore();
  const [restName, setRestName] = useState(restaurantConfig.name);
  const [tagline, setTagline] = useState(restaurantConfig.tagline);
  const [splitPolicy, setSplitPolicy] = useState(restaurantConfig.splitBillPolicy);
  const [waiterVerify, setWaiterVerify] = useState(restaurantConfig.requireWaiterVerification);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    restaurantConfig.name = restName;
    restaurantConfig.tagline = tagline;
    restaurantConfig.splitBillPolicy = splitPolicy;
    restaurantConfig.requireWaiterVerification = waiterVerify;
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Brand Profile */}
      <Card padding="md" className="space-y-4">
        <h4 className="font-heading font-black text-lg text-content-primary">
          Restaurant Identity
        </h4>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-content-secondary block mb-1">
              App & Restaurant Name
            </label>
            <input
              type="text"
              value={restName}
              onChange={(e) => setRestName(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-canvas border border-borderSubtle text-sm font-bold text-content-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-content-secondary block mb-1">
              Tagline / Subtext
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-canvas border border-borderSubtle text-sm text-content-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      </Card>

      {/* Theme Picker */}
      <Card padding="md" className="space-y-4">
        <div>
          <h4 className="font-heading font-black text-lg text-content-primary">
            Color Theme & Aesthetic
          </h4>
          <p className="text-xs text-content-secondary">
            Switching here re-skins the customer, waiter, and admin apps live.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Sunny Family */}
          <div
            onClick={() => setTheme('sunny-family')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              currentTheme === 'sunny-family'
                ? 'bg-primary/10 border-primary ring-2 ring-primary/20 shadow-sm'
                : 'bg-canvas border-borderSubtle hover:bg-surface'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-heading font-black text-sm flex items-center gap-1.5 text-content-primary">
                <Sun className="w-4 h-4 text-sun" />
                Sunny Family (Default)
              </span>
              {currentTheme === 'sunny-family' && (
                <Check className="w-4 h-4 text-primary" />
              )}
            </div>
            <div className="flex gap-1.5 pt-1">
              <div className="w-6 h-6 rounded-full bg-[#FFF9F2] border border-black/10" />
              <div className="w-6 h-6 rounded-full bg-[#FF7A45]" />
              <div className="w-6 h-6 rounded-full bg-[#FFC233]" />
              <div className="w-6 h-6 rounded-full bg-[#2DBE7E]" />
            </div>
          </div>

          {/* Modern Green */}
          <div
            onClick={() => setTheme('modern-green')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              currentTheme === 'modern-green'
                ? 'bg-[#2D7A58]/10 border-[#2D7A58] ring-2 ring-[#2D7A58]/20 shadow-sm'
                : 'bg-canvas border-borderSubtle hover:bg-surface'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-heading font-black text-sm flex items-center gap-1.5 text-content-primary">
                <Leaf className="w-4 h-4 text-[#2D7A58]" />
                Modern Green
              </span>
              {currentTheme === 'modern-green' && (
                <Check className="w-4 h-4 text-[#2D7A58]" />
              )}
            </div>
            <div className="flex gap-1.5 pt-1">
              <div className="w-6 h-6 rounded-full bg-[#F4F8F5] border border-black/10" />
              <div className="w-6 h-6 rounded-full bg-[#2D7A58]" />
              <div className="w-6 h-6 rounded-full bg-[#A3E635]" />
              <div className="w-6 h-6 rounded-full bg-[#10B981]" />
            </div>
          </div>
        </div>
      </Card>

      {/* Operational Policies */}
      <Card padding="md" className="space-y-4">
        <h4 className="font-heading font-black text-lg text-content-primary">
          Dining Policies
        </h4>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="font-heading font-bold text-sm text-content-primary">
                Split Bill Feature
              </div>
              <div className="text-xs text-content-secondary">
                Allow diners to split equally or by dish on their phone
              </div>
            </div>
            <select
              value={splitPolicy}
              onChange={(e) => setSplitPolicy(e.target.value as any)}
              className="p-2 rounded-xl bg-canvas border border-borderSubtle text-xs font-bold"
            >
              <option value="customer_and_counter">Enabled (Self + Counter)</option>
              <option value="counter_only">Counter Only</option>
            </select>
          </div>

          <div className="flex items-center justify-between gap-4 pt-2 border-t border-borderSubtle">
            <div>
              <div className="font-heading font-bold text-sm text-content-primary">
                Captain Order Approval Gate
              </div>
              <div className="text-xs text-content-secondary">
                Require waiter to tap "Approve" before order reaches kitchen
              </div>
            </div>
            <input
              type="checkbox"
              checked={waiterVerify}
              onChange={(e) => setWaiterVerify(e.target.checked)}
              className="w-5 h-5 accent-primary rounded cursor-pointer"
            />
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex items-center gap-3">
        <Button
          variant="primary"
          size="lg"
          onClick={handleSave}
          leftIcon={<Save className="w-4 h-4" />}
        >
          Save Configuration
        </Button>
        {saved && (
          <span className="text-xs font-bold text-status-success flex items-center gap-1">
            <Check className="w-4 h-4" />
            Changes Saved Successfully!
          </span>
        )}
      </div>
    </div>
  );
};
