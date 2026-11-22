'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CustomerHeader } from '@/components/customer/CustomerHeader';
import { FloatingCartBar } from '@/components/customer/FloatingCartBar';
import { CartBottomSheet } from '@/components/customer/CartBottomSheet';
import { OnboardingGuideModal } from '@/components/customer/OnboardingGuideModal';
import { TableSecurityLockModal } from '@/components/customer/TableSecurityLockModal';
import { useCartStore, useMenuStore } from '@/lib/store';
import { orderService } from '@/lib/orderService';

export default function CustomerTableLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const tableId = (params?.tableId as string) || '7';
  const tableNumber = parseInt(tableId, 10) || 7;

  const [isCartOpen, setIsCartOpen] = useState(false);
  const initForTable = useCartStore((state) => state.initForTable);
  const setItemAvailability = useMenuStore((state) => state.setItemAvailability);

  // Initialize cart for this specific table from localStorage
  useEffect(() => {
    initForTable(tableId);
  }, [tableId, initForTable]);

  // Subscribe to live kitchen 86 / Sold Out status changes
  useEffect(() => {
    const unsub = orderService.subscribeToItemAvailability(({ itemId, available }) => {
      setItemAvailability(itemId, available);
    });
    return () => unsub();
  }, [setItemAvailability]);

  return (
    <div className="min-h-screen bg-canvas flex flex-col transition-colors duration-300">
      <TableSecurityLockModal tableId={tableId} tableNumber={tableNumber} />
      <OnboardingGuideModal />
      <CustomerHeader tableNumber={tableNumber} tableId={tableId} />
      <main className="flex-1 pb-28">{children}</main>
      <FloatingCartBar onOpenCart={() => setIsCartOpen(true)} />
      <CartBottomSheet
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        tableNumber={tableNumber}
        tableId={tableId}
      />
    </div>
  );
}
