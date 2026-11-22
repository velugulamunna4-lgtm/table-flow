'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { VegIndicator } from '@/components/ui/VegIndicator';
import { useMenuStore } from '@/lib/store';
import { orderService } from '@/lib/orderService';
import { formatCurrency } from '@/lib/utils';
import { MenuItem } from '@/types';
import { Search, Plus, Minus, ArrowRight } from 'lucide-react';

export interface WaiterPlaceOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableId: string;
  tableNumber: number;
}

export const WaiterPlaceOrderModal: React.FC<WaiterPlaceOrderModalProps> = ({
  isOpen,
  onClose,
  tableId,
  tableNumber,
}) => {
  const { menuItems } = useMenuStore();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableDishes = menuItems.filter(
    (i) => i.isAvailable && i.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpdate = (item: MenuItem, delta: number) => {
    setSelected((prev) => {
      const current = prev[item.id] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[item.id];
        return copy;
      }
      return { ...prev, [item.id]: next };
    });
  };

  const selectedCount = Object.values(selected).reduce((sum, n) => sum + n, 0);

  const calculateSubtotal = () => {
    return Object.entries(selected).reduce((sum, [itemId, qty]) => {
      const item = menuItems.find((i) => i.id === itemId);
      return sum + (item ? item.price * qty : 0);
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const tax = Math.round(subtotal * 0.05);
  const serviceCharge = Math.round(subtotal * 0.05);
  const total = subtotal + tax + serviceCharge;

  const handleSubmit = async () => {
    if (selectedCount === 0 || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const itemsPayload = Object.entries(selected).map(([itemId, qty]) => {
        const item = menuItems.find((i) => i.id === itemId)!;
        return {
          menuItemId: item.id,
          name: item.name,
          price: item.price,
          quantity: qty,
          vegType: item.vegType,
          notes: 'Punch by Captain',
        };
      });

      await orderService.placeOrder({
        tableId,
        tableNumber,
        items: itemsPayload,
        subtotal,
        tax,
        serviceCharge,
        total,
        status: 'cooking', // Waiter orders go straight to cooking
        estimatedMinutes: 15,
        customerNotes: 'Waiter-assisted punch',
        paymentStatus: 'unpaid',
      });

      setSelected({});
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Punch Order · Table ${tableNumber}`}
      maxWidth="lg"
    >
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-content-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dish to punch..."
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-canvas border border-borderSubtle text-content-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Dish List */}
        <div className="max-h-[50vh] overflow-y-auto divide-y divide-borderSubtle pr-1">
          {availableDishes.map((dish) => {
            const qty = selected[dish.id] || 0;
            return (
              <div
                key={dish.id}
                className="py-3 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5">
                  <VegIndicator type={dish.vegType} size="sm" />
                  <div>
                    <h5 className="font-heading font-bold text-sm text-content-primary">
                      {dish.name}
                    </h5>
                    <span className="text-xs font-bold text-content-secondary">
                      {formatCurrency(dish.price)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {qty > 0 && (
                    <>
                      <button
                        onClick={() => handleUpdate(dish, -1)}
                        className="w-8 h-8 rounded-full bg-canvas border border-borderSubtle flex items-center justify-center text-content-primary hover:bg-white"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-heading font-black text-sm tabular-nums min-w-[16px] text-center">
                        {qty}
                      </span>
                    </>
                  )}
                  <button
                    onClick={() => handleUpdate(dish, 1)}
                    className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-hover shadow-accent"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Summary & Punch Button */}
        {selectedCount > 0 && (
          <div className="pt-3 border-t border-borderSubtle space-y-3">
            <div className="flex justify-between font-heading font-black text-base text-content-primary">
              <span>Selected {selectedCount} items</span>
              <span className="text-primary text-lg">{formatCurrency(total)}</span>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full font-bold"
              isLoading={isSubmitting}
              onClick={handleSubmit}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Send Straight to Kitchen · {formatCurrency(total)}
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};
