'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { VegIndicator } from '@/components/ui/VegIndicator';
import { orderService } from '@/lib/orderService';
import { useLanguageStore } from '@/lib/store';
import { translations } from '@/lib/i18n';
import { formatCurrency, formatTimeElapsed } from '@/lib/utils';
import { Order, OrderStatus } from '@/types';
import { CleanTableModal } from '@/components/customer/CleanTableModal';
import {
  Send,
  BellRing,
  Flame,
  CheckCircle2,
  Sparkles,
  Clock,
  ArrowLeft,
  PlusCircle,
  Gamepad2,
  Receipt,
  PhoneCall,
  Check,
  UtensilsCrossed,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OrderStatusPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const tableId = (params?.tableId as string) || '7';
  const tableNumber = parseInt(tableId, 10) || 7;
  const orderIdFromUrl = searchParams.get('orderId');

  const { language } = useLanguageStore();
  const t = translations[language];

  const [order, setOrder] = useState<Order | null>(null);
  const [waiterCalled, setWaiterCalled] = useState(false);
  const [isCleanModalOpen, setIsCleanModalOpen] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      if (orderIdFromUrl) {
        const found = await orderService.getOrderById(orderIdFromUrl);
        if (found) {
          setOrder(found);
          return;
        }
      }
      const tableOrder = await orderService.getOrderByTable(tableId);
      if (tableOrder) setOrder(tableOrder);
    };
    fetchOrder();

    // Subscribe to live order updates from kitchen / waiter
    const unsub = orderService.subscribeToOrders((orders) => {
      const current = orderIdFromUrl
        ? orders.find((o) => o.id === orderIdFromUrl)
        : orders.find((o) => o.tableId === tableId && o.status !== 'served');

      if (current) {
        setOrder(current);
      }
    });

    return () => unsub();
  }, [tableId, orderIdFromUrl]);

  const stages: {
    key: OrderStatus;
    title: string;
    desc: string;
    icon: React.ReactNode;
  }[] = [
    {
      key: 'sent',
      title: t.orderStages.sent.title,
      desc: t.orderStages.sent.desc,
      icon: <Send className="w-6 h-6" />,
    },
    {
      key: 'accepted',
      title: t.orderStages.accepted.title,
      desc: t.orderStages.accepted.desc,
      icon: <BellRing className="w-6 h-6" />,
    },
    {
      key: 'cooking',
      title: t.orderStages.cooking.title,
      desc: t.orderStages.cooking.desc,
      icon: <Flame className="w-6 h-6" />,
    },
    {
      key: 'ready',
      title: t.orderStages.ready.title,
      desc: t.orderStages.ready.desc,
      icon: <CheckCircle2 className="w-6 h-6" />,
    },
    {
      key: 'served',
      title: t.orderStages.served.title,
      desc: t.orderStages.served.desc,
      icon: <Sparkles className="w-6 h-6" />,
    },
  ];

  const getStageIndex = (status: OrderStatus) => {
    const orderMap: Record<OrderStatus, number> = {
      sent: 0,
      accepted: 1,
      cooking: 2,
      ready: 3,
      served: 4,
      cancelled: -1,
    };
    return orderMap[status] ?? 0;
  };

  const currentStageIndex = order ? getStageIndex(order.status) : 0;

  const handleCallWaiter = async () => {
    try {
      await orderService.callWaiter(tableId, tableNumber, 'call_waiter');
      setWaiterCalled(true);
      setTimeout(() => setWaiterCalled(false), 5000);
    } catch (e) {
      console.error(e);
    }
  };

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-surface border border-borderSubtle flex items-center justify-center shadow-soft">
          <UtensilsCrossed className="w-10 h-10 text-primary" />
        </div>
        <h3 className="font-heading font-extrabold text-2xl text-content-primary">
          No active order found for Table {tableNumber}
        </h3>
        <p className="text-content-secondary text-sm max-w-sm mx-auto">
          You haven't placed an order yet or your meal was completed.
        </p>
        <Link href={`/t/${tableId}`}>
          <Button variant="primary" size="lg">
            Explore Menu & Order
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Top Bar with Back and Table info */}
      <div className="flex items-center justify-between">
        <Link
          href={`/t/${tableId}`}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-content-secondary hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Menu</span>
        </Link>

        <span className="font-heading font-bold text-sm text-content-primary px-3 py-1 rounded-full bg-surface border border-borderSubtle">
          Order {order.orderNumber}
        </span>
      </div>

      {/* Hero ETA Card */}
      <Card
        padding="lg"
        className="bg-gradient-to-br from-surface to-canvas border border-borderSubtle text-center space-y-3 relative overflow-hidden"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-wider">
          <Clock className="w-4 h-4" />
          <span>Estimated Waiting Time</span>
        </div>

        <div className="font-heading font-black text-4xl sm:text-5xl text-content-primary">
          {order.status === 'ready'
            ? 'Hot & Ready to Serve!'
            : order.status === 'served'
            ? 'Meal Served!'
            : `~${order.estimatedMinutes} Minutes`}
        </div>

        <p className="text-content-secondary text-sm sm:text-base max-w-md mx-auto">
          {stages[currentStageIndex]?.desc || 'Preparing your order with care.'}
        </p>
      </Card>

      {/* 5-Stage Live Visual Progress Tracker */}
      <Card padding="md" className="space-y-6">
        <h3 className="font-heading font-black text-xl text-content-primary">
          Live Kitchen Journey
        </h3>

        {/* Desktop / Tablet Horizontal Stepper */}
        <div className="hidden sm:grid grid-cols-5 gap-2 relative">
          {stages.map((st, idx) => {
            const isCompleted = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;
            const isUpcoming = idx > currentStageIndex;

            return (
              <div key={st.key} className="flex flex-col items-center text-center space-y-2 relative">
                {/* Connector line */}
                {idx < stages.length - 1 && (
                  <div
                    className={`absolute top-5 left-1/2 w-full h-1 -z-0 transition-colors duration-300 ${
                      idx < currentStageIndex ? 'bg-primary' : 'bg-[#E8DFD5]'
                    }`}
                  />
                )}

                {/* Circle Icon */}
                <motion.div
                  animate={isCurrent ? { scale: [1, 1.08, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className={`w-11 h-11 rounded-full flex items-center justify-center relative z-10 font-bold transition-all duration-300 ${
                    isCurrent
                      ? 'bg-primary text-white shadow-accent ring-4 ring-primary/20'
                      : isCompleted
                      ? 'bg-status-success text-white'
                      : 'bg-[#EFE8DF] text-content-muted'
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : st.icon}
                </motion.div>

                <div>
                  <div
                    className={`text-xs font-heading font-bold ${
                      isCurrent
                        ? 'text-primary'
                        : isCompleted
                        ? 'text-content-primary'
                        : 'text-content-muted'
                    }`}
                  >
                    {st.title}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Vertical Stepper (Very clear on 360px phones) */}
        <div className="sm:hidden space-y-4">
          {stages.map((st, idx) => {
            const isCompleted = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;
            const isUpcoming = idx > currentStageIndex;

            return (
              <div key={st.key} className="flex items-start gap-3.5 relative">
                {idx < stages.length - 1 && (
                  <div
                    className={`absolute top-8 left-4 w-0.5 h-10 ${
                      idx < currentStageIndex ? 'bg-primary' : 'bg-[#E8DFD5]'
                    }`}
                  />
                )}
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 z-10 transition-all ${
                    isCurrent
                      ? 'bg-primary text-white shadow-accent ring-4 ring-primary/20 animate-pulse'
                      : isCompleted
                      ? 'bg-status-success text-white'
                      : 'bg-[#EFE8DF] text-content-muted'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : st.icon}
                </div>

                <div className="flex-1 pt-1">
                  <div
                    className={`font-heading font-bold text-sm ${
                      isCurrent
                        ? 'text-primary'
                        : isCompleted
                        ? 'text-content-primary'
                        : 'text-content-muted'
                    }`}
                  >
                    {st.title}
                  </div>
                  <p className="text-xs text-content-secondary mt-0.5">{st.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Mini-Games Promotional Card */}
      <Card
        padding="md"
        className="bg-gradient-to-r from-sun/20 via-surface to-primary/10 border border-sun/40 flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3.5 text-center sm:text-left">
          <div className="w-14 h-14 rounded-2xl bg-sun text-content-primary flex items-center justify-center shadow-soft shrink-0">
            <Gamepad2 className="w-7 h-7 text-content-primary" />
          </div>
          <div>
            <h4 className="font-heading font-extrabold text-lg text-content-primary">
              {t.playGameTitle}
            </h4>
            <p className="text-xs sm:text-sm text-content-secondary">
              {t.playGameSub}
            </p>
          </div>
        </div>

        <Link href={`/t/${tableId}/play`} className="w-full sm:w-auto">
          <Button variant="sun" size="md" className="w-full font-bold">
            {t.playNow}
          </Button>
        </Link>
      </Card>

      {/* Order Items Summary Card */}
      <Card padding="md" className="space-y-4">
        <div className="flex items-center justify-between border-b border-borderSubtle pb-3">
          <h4 className="font-heading font-black text-lg text-content-primary">
            Ordered Items ({order.items.length})
          </h4>
          <span className="text-xs font-semibold text-content-secondary">
            Placed {formatTimeElapsed(order.createdAt)}
          </span>
        </div>

        <div className="divide-y divide-borderSubtle">
          {order.items.map((item, idx) => (
            <div key={idx} className="py-2.5 flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <VegIndicator type={item.vegType} size="sm" />
                <span className="font-heading font-bold text-content-primary">
                  {item.quantity}x
                </span>
                <span className="font-medium text-content-primary">{item.name}</span>
                {item.notes && (
                  <span className="text-xs text-status-alert bg-status-alert/10 px-2 py-0.5 rounded-full font-semibold">
                    Note: {item.notes}
                  </span>
                )}
              </div>
              <span className="font-bold text-content-primary">
                {formatCurrency(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        {order.customerNotes && (
          <div className="p-3 rounded-2xl bg-canvas border border-borderSubtle text-xs text-content-secondary">
            <span className="font-bold text-content-primary">Chef Instructions: </span>
            {order.customerNotes}
          </div>
        )}

        <div className="pt-2 flex justify-between font-heading font-extrabold text-base text-content-primary border-t border-borderSubtle">
          <span>Total Payable</span>
          <span className="text-primary text-lg">{formatCurrency(order.total)}</span>
        </div>
      </Card>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
        <Link href={`/t/${tableId}`}>
          <Button
            variant="secondary"
            size="md"
            className="w-full font-bold text-xs sm:text-sm h-12"
            leftIcon={<PlusCircle className="w-4 h-4 text-primary" />}
          >
            {t.orderMore}
          </Button>
        </Link>

        <Button
          variant={waiterCalled ? 'success' : 'secondary'}
          size="md"
          className="w-full font-bold text-xs sm:text-sm h-12"
          onClick={handleCallWaiter}
          disabled={waiterCalled}
          leftIcon={<PhoneCall className="w-4 h-4" />}
        >
          {waiterCalled ? 'Notified!' : t.callWaiter}
        </Button>

        <Button
          variant="secondary"
          size="md"
          className="w-full font-bold text-xs sm:text-sm h-12"
          onClick={() => setIsCleanModalOpen(true)}
          leftIcon={<Sparkles className="w-4 h-4 text-sun" />}
        >
          {t.cleanTable?.cleanTableBtn || 'Clean Table'}
        </Button>

        <Link href={`/t/${tableId}/bill`}>
          <Button
            variant="primary"
            size="md"
            className="w-full font-bold text-xs sm:text-sm h-12"
            leftIcon={<Receipt className="w-4 h-4" />}
          >
            {t.viewBill}
          </Button>
        </Link>
      </div>

      <CleanTableModal
        isOpen={isCleanModalOpen}
        onClose={() => setIsCleanModalOpen(false)}
        tableId={tableId}
        tableNumber={tableNumber}
      />
    </div>
  );
}
