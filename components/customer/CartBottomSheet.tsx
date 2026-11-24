'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { VegIndicator } from '@/components/ui/VegIndicator';
import { useCartStore, useLanguageStore } from '@/lib/store';
import { orderService } from '@/lib/orderService';
import { formatCurrency } from '@/lib/utils';
import { translations } from '@/lib/i18n';
import { Utensils, MessageSquare, Trash2, ArrowRight } from 'lucide-react';

export interface CartBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  tableNumber: number;
  tableId: string;
}

export const CartBottomSheet: React.FC<CartBottomSheetProps> = ({
  isOpen,
  onClose,
  tableNumber,
  tableId,
}) => {
  const router = useRouter();
  const { language } = useLanguageStore();
  const t = translations[language];
  const {
    items,
    updateQuantity,
    updateItemNotes,
    clearCart,
    getSubtotal,
    getTax,
    getServiceCharge,
    getTotal,
    getItemCount,
  } = useCartStore();

  const [activeNotesItemId, setActiveNotesItemId] = useState<string | null>(null);
  const [generalNotes, setGeneralNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const itemCount = getItemCount();
  const subtotal = getSubtotal();
  const tax = getTax();
  const serviceCharge = getServiceCharge();
  const total = getTotal();

  const handlePlaceOrder = async () => {
    if (items.length === 0 || isSubmitting) return;

    try {
      setIsSubmitting(true);

      const token = typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('t') || undefined
        : undefined;

      const orderPayload = {
        tableId,
        tableNumber,
        items: items.map((i) => ({
          menuItemId: i.menuItem.id,
          name: i.menuItem.name,
          price: i.menuItem.price,
          quantity: i.quantity,
          vegType: i.menuItem.vegType,
          notes: i.notes,
        })),
        subtotal,
        tax,
        serviceCharge,
        total,
        status: 'sent' as const,
        estimatedMinutes: 18,
        customerNotes: generalNotes,
        paymentStatus: 'unpaid' as const,
        qrToken: token,
      };

      const placedOrder = await orderService.placeOrder(orderPayload);

      // Clear table's active cart after placing order
      clearCart();
      onClose();

      // Navigate directly to live status tracker
      router.push(`/t/${tableId}/status?orderId=${placedOrder.id}`);
    } catch (err) {
      console.error('Failed to place order', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <span>{t.cartTitle}</span>
          <span className="text-sm font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
            {itemCount} {itemCount === 1 ? t.itemWord : t.itemsWord}
          </span>
        </div>
      }
    >
      {items.length === 0 ? (
        <div className="py-12 text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-canvas border border-borderSubtle flex items-center justify-center shadow-soft">
            <Utensils className="w-9 h-9 text-primary/60" />
          </div>
          <h4 className="font-heading font-bold text-xl text-content-primary">
            {t.emptyCart}
          </h4>
          <p className="text-sm text-content-secondary max-w-xs mx-auto">
            {t.emptyCartSub}
          </p>
          <Button variant="primary" size="md" onClick={onClose}>
            Browse Menu
          </Button>
        </div>
      ) : (
        <div className="space-y-6 pb-6">
          {/* Itemized Cart List */}
          <div className="divide-y divide-borderSubtle">
            {items.map(({ menuItem, quantity, notes }) => (
              <div key={menuItem.id} className="py-3.5 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5 flex-1">
                    <div className="mt-1">
                      <VegIndicator type={menuItem.vegType} size="sm" />
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-base text-content-primary leading-tight">
                        {menuItem.name}
                      </h4>
                      <div className="text-sm font-extrabold text-content-primary mt-1">
                        {formatCurrency(menuItem.price * quantity)}
                        <span className="text-xs font-normal text-content-muted ml-1.5">
                          ({formatCurrency(menuItem.price)} each)
                        </span>
                      </div>
                    </div>
                  </div>

                  <QuantityStepper
                    quantity={quantity}
                    size="sm"
                    onAdd={() => updateQuantity(menuItem.id, 1)}
                    onIncrement={() => updateQuantity(menuItem.id, quantity + 1)}
                    onDecrement={() => updateQuantity(menuItem.id, quantity - 1)}
                  />
                </div>

                {/* Per-item cooking notes */}
                <div className="pl-6">
                  {activeNotesItemId === menuItem.id || notes ? (
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="text"
                        value={notes || ''}
                        onChange={(e) => updateItemNotes(menuItem.id, e.target.value)}
                        placeholder={t.notesPlaceholder}
                        className="w-full text-xs py-1.5 px-3 rounded-xl bg-canvas border border-borderSubtle text-content-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      {activeNotesItemId === menuItem.id && (
                        <button
                          onClick={() => setActiveNotesItemId(null)}
                          className="text-xs text-primary font-bold hover:underline shrink-0"
                        >
                          Done
                        </button>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => setActiveNotesItemId(menuItem.id)}
                      className="inline-flex items-center gap-1 text-xs text-content-secondary hover:text-primary transition-colors font-medium"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>{t.addSpecialNotes}</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* General Table Cooking Instructions */}
          <div className="p-3.5 rounded-2xl bg-canvas border border-borderSubtle space-y-1.5">
            <label className="text-xs font-bold text-content-secondary block">
              {t.addSpecialNotes}
            </label>
            <input
              type="text"
              value={generalNotes}
              onChange={(e) => setGeneralNotes(e.target.value)}
              placeholder="e.g. Bring food hot, extra napkins..."
              className="w-full text-xs sm:text-sm py-2 px-3 rounded-xl bg-surface border border-borderSubtle text-content-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Bill Calculation Breakdown */}
          <div className="p-4 rounded-2xl bg-surface border border-borderSubtle space-y-2 text-sm">
            <div className="flex justify-between text-content-secondary">
              <span>{t.subtotal}</span>
              <span className="font-medium text-content-primary">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-content-secondary text-xs">
              <span>GST (5%)</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between text-content-secondary text-xs">
              <span>Service Charge (5%)</span>
              <span>{formatCurrency(serviceCharge)}</span>
            </div>
            <div className="pt-2 border-t border-borderSubtle flex justify-between font-heading font-black text-lg text-content-primary">
              <span>{t.totalPayable}</span>
              <span className="text-primary text-xl">{formatCurrency(total)}</span>
            </div>
          </div>

          {/* Place Order Primary Action */}
          <Button
            variant="primary"
            size="lg"
            className="w-full text-base font-bold shadow-accent"
            isLoading={isSubmitting}
            onClick={handlePlaceOrder}
            rightIcon={<ArrowRight className="w-5 h-5" />}
          >
            {t.placeOrder} · {formatCurrency(total)}
          </Button>
        </div>
      )}
    </BottomSheet>
  );
};
