'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { CategoryPills } from '@/components/customer/CategoryPills';
import { MenuItemCard } from '@/components/customer/MenuItemCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { useMenuStore, useLanguageStore } from '@/lib/store';
import { orderService } from '@/lib/orderService';
import { Order } from '@/types';
import { translations } from '@/lib/i18n';
import { Clock, Receipt, Gamepad2, ArrowRight, Search, Sparkles, QrCode, PhoneCall } from 'lucide-react';

function CustomerMenuContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const tableId = (params?.tableId as string) || '7';
  const qrToken = searchParams.get('t');

  const { menuItems, selectedCategory, searchQuery, dietaryFilter, fetchMenuItems } = useMenuStore();
  const { language } = useLanguageStore();
  const t = translations[language];

  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [tokenExpired, setTokenExpired] = useState(false);
  const [waiterCalled, setWaiterCalled] = useState(false);

  useEffect(() => {
    fetchMenuItems();
  }, [fetchMenuItems]);

  // Check table QR token if provided
  useEffect(() => {
    if (qrToken) {
      fetch(`/api/tables/${tableId}/verify?t=${encodeURIComponent(qrToken)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.valid === false) {
            setTokenExpired(true);
          }
        })
        .catch(() => {
          // Graceful fallback in offline/demo mode
        });
    }
  }, [tableId, qrToken]);

  // Check if this table has an active order in progress
  useEffect(() => {
    const checkOrder = async () => {
      const order = await orderService.getOrderByTable(tableId);
      if (order) setActiveOrder(order);
    };
    checkOrder();

    const unsub = orderService.subscribeToOrders((orders) => {
      const current = orders.find(
        (o) => o.tableId === tableId && o.status !== 'served' && o.status !== 'cancelled'
      );
      setActiveOrder(current || null);
    });
    return () => unsub();
  }, [tableId]);

  if (tokenExpired) {
    return (
      <div className="max-w-md mx-auto my-12 px-4 py-8 rounded-3xl bg-surface border border-borderSubtle text-center space-y-5 shadow-lifted">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-sun/20 flex items-center justify-center">
          <QrCode className="w-8 h-8 text-primary" />
        </div>
        <div className="space-y-2">
          <h2 className="font-heading font-black text-2xl text-content-primary">
            Table Code Notice
          </h2>
          <p className="text-sm text-content-secondary leading-relaxed">
            This table code has expired. Please ask our staff for help.
          </p>
        </div>

        <div className="pt-3">
          <Button
            variant="primary"
            size="md"
            className="w-full font-bold h-12"
            disabled={waiterCalled}
            leftIcon={<PhoneCall className="w-4 h-4" />}
            onClick={async () => {
              await orderService.callWaiter(tableId, parseInt(tableId, 10) || 7, 'call_waiter');
              setWaiterCalled(true);
            }}
          >
            {waiterCalled ? 'Staff Notified & Heading Over' : 'Call Staff for New Code'}
          </Button>
        </div>
      </div>
    );
  }

  // Filter items based on category, search, and veg/non-veg
  const filteredItems = menuItems.filter((item) => {
    // Search match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchTe = item.nameTranslations?.te?.toLowerCase().includes(q);
      const matchTa = item.nameTranslations?.ta?.toLowerCase().includes(q);
      const matchHi = item.nameTranslations?.hi?.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchTe && !matchTa && !matchHi) return false;
    } else {
      // Category match (only if not searching)
      if (item.category !== selectedCategory) return false;
    }

    // Dietary filter match
    if (dietaryFilter === 'veg' && item.vegType !== 'veg') return false;
    if (dietaryFilter === 'non-veg' && item.vegType !== 'non-veg') return false;

    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4 space-y-4 sm:space-y-5">
      {/* Active Order in Progress Banner (if diner placed an order) */}
      {activeOrder && (
        <div className="p-3.5 sm:p-4 rounded-3xl bg-sun/20 border border-sun/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sun text-content-primary flex items-center justify-center font-bold shrink-0">
              <Clock className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <div className="font-heading font-black text-sm sm:text-base text-content-primary">
                Order {activeOrder.orderNumber} is cooking!
              </div>
              <div className="text-xs text-content-secondary font-medium">
                Status: <span className="capitalize font-bold text-primary">{activeOrder.status}</span> · Ready in ~{activeOrder.estimatedMinutes}m
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Link
              href={`/t/${tableId}/status`}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-pill bg-primary text-white font-bold text-xs sm:text-sm shadow-accent"
            >
              <span>Track Live Status</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href={`/t/${tableId}/bill`}
              className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-pill bg-surface border border-borderSubtle text-content-primary font-bold text-xs sm:text-sm hover:bg-canvas"
            >
              <Receipt className="w-3.5 h-3.5 text-primary" />
              <span>Bill</span>
            </Link>
          </div>
        </div>
      )}

      {/* Category Pills (Hidden while user is searching) */}
      {!searchQuery && (
        <div className="space-y-1">
          <CategoryPills />
        </div>
      )}

      {/* Items Section Header */}
      <div className="flex items-center justify-between pt-1">
        <h2 className="font-heading font-black text-lg sm:text-2xl text-content-primary">
          {searchQuery ? `Search: "${searchQuery}"` : t.categories[selectedCategory as keyof typeof t.categories] || selectedCategory}
        </h2>
        <span className="text-xs font-bold text-content-secondary px-3 py-1 rounded-full bg-surface border border-borderSubtle">
          {filteredItems.length} {filteredItems.length === 1 ? 'Dish' : 'Dishes'}
        </span>
      </div>

      {/* Dish Grid: single column on phone, 2 cols on tablet+ */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-6">
          {filteredItems.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Search className="w-10 h-10 text-primary" />}
          title="No Dishes Found"
          description="We couldn't find any dishes matching your current search or diet filter. Try resetting your filters."
          actionLabel="Show All Items"
          onAction={() => {
            useMenuStore.getState().setSearchQuery('');
            useMenuStore.getState().setDietaryFilter('all');
          }}
        />
      )}

      {/* Quick Navigation Cards to Play & Bill */}
      <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <Link
          href={`/t/${tableId}/play`}
          className="p-4 sm:p-5 rounded-3xl bg-surface border border-borderSubtle shadow-soft hover:shadow-lifted hover:border-primary/30 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-sun/20 text-sun flex items-center justify-center shrink-0">
              <Gamepad2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="font-heading font-black text-sm sm:text-base text-content-primary group-hover:text-primary transition-colors">
                Waiting for food?
              </div>
              <div className="text-xs text-content-secondary">
                Play quick mini-games & win rewards
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-content-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          href={`/t/${tableId}/bill`}
          className="p-4 sm:p-5 rounded-3xl bg-surface border border-borderSubtle shadow-soft hover:shadow-lifted hover:border-primary/30 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
              <Receipt className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="font-heading font-black text-sm sm:text-base text-content-primary group-hover:text-primary transition-colors">
                View & Split Bill
              </div>
              <div className="text-xs text-content-secondary">
                Split equally, by item, or pay with UPI
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-content-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </Link>
      </div>
    </div>
  );
}

export default function CustomerMenuPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto px-4 py-12 flex justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CustomerMenuContent />
    </Suspense>
  );
}
