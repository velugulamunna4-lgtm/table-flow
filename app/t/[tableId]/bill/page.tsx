'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { VegIndicator } from '@/components/ui/VegIndicator';
import { orderService } from '@/lib/orderService';
import { formatCurrency } from '@/lib/utils';
import { Order, OrderItem } from '@/types';
import { QRCodeSVG } from 'qrcode.react';
import {
  ArrowLeft,
  Receipt,
  Users,
  CheckCircle2,
  CreditCard,
  QrCode,
  Sparkles,
  Store,
  Split,
  Plus,
  Minus,
  Check,
  Smartphone,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BillAndSplitPage() {
  const params = useParams();
  const tableId = (params?.tableId as string) || '7';
  const tableNumber = parseInt(tableId, 10) || 7;

  const [order, setOrder] = useState<Order | null>(null);
  const [splitMode, setSplitMode] = useState<'full' | 'equal' | 'item' | 'custom'>('full');
  const [splitCount, setSplitCount] = useState<number>(3);
  const [claimedItems, setClaimedItems] = useState<Record<string, number>>({});
  const [customAmount, setCustomAmount] = useState<number>(500);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'counter'>('upi');
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    const fetchBill = async () => {
      const active = await orderService.getOrderByTable(tableId);
      if (active) {
        setOrder(active);
        setCustomAmount(Math.round(active.total / 2));
      } else {
        // Fallback demo order for Table
        const demo: Order = {
          id: `demo_${tableId}`,
          orderNumber: `#TF-${100 + tableNumber}`,
          tableId,
          tableNumber,
          items: [
            {
              menuItemId: 'item-by-1',
              name: 'Hyderabadi Chicken Dum Biryani',
              price: 390,
              quantity: 2,
              vegType: 'non-veg',
            },
            {
              menuItemId: 'item-mn-2',
              name: 'Slow-Simmered Dal Makhani',
              price: 340,
              quantity: 1,
              vegType: 'veg',
            },
            {
              menuItemId: 'item-mn-6',
              name: 'Amritsari Garlic Butter Naan',
              price: 85,
              quantity: 3,
              vegType: 'veg',
            },
            {
              menuItemId: 'item-dr-1',
              name: 'Thick Alphonso Mango Lassi',
              price: 150,
              quantity: 2,
              vegType: 'veg',
            },
          ],
          subtotal: 1675,
          tax: 83.75,
          serviceCharge: 83.75,
          total: 1843,
          status: 'ready',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          estimatedMinutes: 0,
          paymentStatus: 'unpaid',
        };
        setOrder(demo);
        setCustomAmount(Math.round(demo.total / 2));
      }
    };
    fetchBill();
  }, [tableId, tableNumber]);

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-content-secondary">Loading bill details...</p>
      </div>
    );
  }

  // Calculate bill splits
  const equalShareAmount = Math.ceil(order.total / splitCount);

  // Item split calculation
  const claimedSubtotal = Object.entries(claimedItems).reduce((sum, [itemId, qty]) => {
    const itm = order.items.find((i) => i.menuItemId === itemId);
    return sum + (itm ? itm.price * qty : 0);
  }, 0);
  const claimedTotal = Math.round(claimedSubtotal * 1.1); // + 10% tax/charge

  const payableAmount =
    splitMode === 'full'
      ? order.total
      : splitMode === 'equal'
      ? equalShareAmount
      : splitMode === 'item'
      ? claimedTotal || equalShareAmount
      : customAmount;

  // Mock payment handler
  const handlePayNow = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsPaid(true);
    }, 1200);
  };

  const toggleClaimItem = (itemId: string, maxQty: number) => {
    setClaimedItems((prev) => {
      const current = prev[itemId] || 0;
      if (current >= maxQty) {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      }
      return { ...prev, [itemId]: current + 1 };
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Top Nav */}
      <div className="flex items-center justify-between">
        <Link
          href={`/t/${tableId}`}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-content-secondary hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Table {tableNumber}</span>
        </Link>

        <span className="font-heading font-black text-sm text-content-primary px-3 py-1 rounded-full bg-surface border border-borderSubtle">
          Bill for Table {tableNumber}
        </span>
      </div>

      {/* Payment Success Celebration State */}
      <AnimatePresence>
        {isPaid ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 sm:p-12 rounded-3xl bg-surface border-2 border-status-success text-center space-y-5 shadow-lifted"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-status-success/15 text-status-success flex items-center justify-center text-4xl shadow-soft">
              ✨
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-status-success px-3 py-1 rounded-full bg-status-success/10">
                Payment Received
              </span>
              <h2 className="font-heading font-black text-3xl sm:text-4xl text-content-primary mt-2">
                Thank You for Dining!
              </h2>
              <p className="text-sm text-content-secondary max-w-sm mx-auto mt-1">
                Your payment of {formatCurrency(payableAmount)} was successfully settled. We hope you enjoyed the flavors!
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-canvas border border-borderSubtle max-w-xs mx-auto text-xs text-content-secondary space-y-1">
              <div className="flex justify-between">
                <span>Transaction Ref:</span>
                <span className="font-mono font-bold text-content-primary">
                  TF-TXN-{Date.now().toString().slice(-6)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Method:</span>
                <span className="capitalize font-bold text-content-primary">
                  {paymentMethod.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <Link href={`/t/${tableId}`}>
                <Button variant="primary" size="md">
                  Back to Menu
                </Button>
              </Link>
              <Link href={`/t/${tableId}/play`}>
                <Button variant="sun" size="md">
                  Play Table Games
                </Button>
              </Link>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Itemized Bill Breakdown */}
            <Card padding="md" className="space-y-4">
              <div className="flex items-center justify-between border-b border-borderSubtle pb-3">
                <div className="flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-primary" />
                  <h3 className="font-heading font-black text-xl text-content-primary">
                    Itemized Table Bill
                  </h3>
                </div>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-canvas text-content-secondary">
                  {order.orderNumber}
                </span>
              </div>

              {/* Items */}
              <div className="divide-y divide-borderSubtle">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <VegIndicator type={item.vegType} size="sm" />
                      <span className="font-heading font-bold text-content-primary">
                        {item.quantity}x
                      </span>
                      <span className="font-medium text-content-primary">{item.name}</span>
                    </div>
                    <span className="font-bold text-content-primary">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Taxes and charges */}
              <div className="p-4 rounded-2xl bg-canvas border border-borderSubtle space-y-1.5 text-xs text-content-secondary">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-content-primary">
                    {formatCurrency(order.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>GST (5.0%)</span>
                  <span>{formatCurrency(order.tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Restaurant Service Charge (5.0%)</span>
                  <span>{formatCurrency(order.serviceCharge)}</span>
                </div>
                <div className="pt-2 border-t border-borderSubtle flex justify-between font-heading font-black text-lg text-content-primary">
                  <span>Total Bill Amount</span>
                  <span className="text-primary text-xl">{formatCurrency(order.total)}</span>
                </div>
              </div>
            </Card>

            {/* Split Options Section */}
            <div className="space-y-3">
              <h3 className="font-heading font-black text-xl text-content-primary flex items-center gap-2">
                <Split className="w-5 h-5 text-sun" />
                <span>Split This Bill</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'full', label: 'Pay Full', desc: 'Settle entire bill', icon: '💳' },
                  { id: 'equal', label: 'Split Equally', desc: 'Divide by persons', icon: '👥' },
                  { id: 'item', label: 'Split by Items', desc: 'Claim what you ate', icon: '🍲' },
                  { id: 'custom', label: 'Custom Amount', desc: 'Pay specific sum', icon: '✍️' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setSplitMode(mode.id as any)}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      splitMode === mode.id
                        ? 'bg-primary/10 border-primary shadow-sm text-primary'
                        : 'bg-surface border-borderSubtle hover:bg-canvas text-content-primary'
                    }`}
                  >
                    <div className="text-xl mb-1">{mode.icon}</div>
                    <div className="font-heading font-black text-sm">{mode.label}</div>
                    <div className="text-[11px] text-content-muted leading-tight">{mode.desc}</div>
                  </button>
                ))}
              </div>

              {/* Equal split controls */}
              {splitMode === 'equal' && (
                <Card padding="md" className="space-y-3 bg-sun/10 border-sun/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-heading font-black text-base text-content-primary">
                        Number of Persons
                      </div>
                      <div className="text-xs text-content-secondary">
                        Each person pays an equal share
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-surface p-1 rounded-pill border border-borderSubtle">
                      <button
                        onClick={() => setSplitCount((c) => Math.max(2, c - 1))}
                        className="w-8 h-8 rounded-full bg-canvas flex items-center justify-center text-content-primary hover:bg-white"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-heading font-black text-base px-2 tabular-nums">
                        {splitCount}
                      </span>
                      <button
                        onClick={() => setSplitCount((c) => Math.min(12, c + 1))}
                        className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-hover shadow-accent"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-borderSubtle/50 flex justify-between items-center">
                    <span className="text-xs font-bold text-content-secondary">
                      Your Individual Share:
                    </span>
                    <span className="font-heading font-black text-xl text-primary">
                      {formatCurrency(equalShareAmount)} / person
                    </span>
                  </div>
                </Card>
              )}

              {/* Item split interactive picker */}
              {splitMode === 'item' && (
                <Card padding="md" className="space-y-3 bg-canvas border-borderSubtle">
                  <div>
                    <div className="font-heading font-black text-base text-content-primary">
                      Tap the dishes you ordered:
                    </div>
                    <div className="text-xs text-content-secondary">
                      Your share is calculated with taxes automatically
                    </div>
                  </div>

                  <div className="divide-y divide-borderSubtle">
                    {order.items.map((item) => {
                      const claimed = claimedItems[item.menuItemId] || 0;
                      return (
                        <div
                          key={item.menuItemId}
                          onClick={() => toggleClaimItem(item.menuItemId, item.quantity)}
                          className={`py-2 px-3 rounded-xl cursor-pointer transition-all flex items-center justify-between ${
                            claimed > 0
                              ? 'bg-primary/10 border border-primary/30 text-content-primary'
                              : 'hover:bg-surface'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <VegIndicator type={item.vegType} size="sm" />
                            <span className="font-bold text-sm">{item.name}</span>
                            <span className="text-xs text-content-muted">
                              (Table had {item.quantity})
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xs font-bold">
                              {formatCurrency(item.price)}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                claimed > 0 ? 'bg-primary text-white' : 'bg-surface text-content-muted'
                              }`}
                            >
                              Claimed: {claimed}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-2 border-t border-borderSubtle flex justify-between items-center">
                    <span className="text-xs font-bold text-content-secondary">
                      Your Claimed Share:
                    </span>
                    <span className="font-heading font-black text-xl text-primary">
                      {formatCurrency(claimedTotal || equalShareAmount)}
                    </span>
                  </div>
                </Card>
              )}

              {/* Custom amount */}
              {splitMode === 'custom' && (
                <Card padding="md" className="space-y-3 bg-surface border-borderSubtle">
                  <div className="font-heading font-bold text-sm text-content-primary">
                    Enter Custom Contribution:
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-black text-2xl text-content-primary">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(Math.max(1, parseInt(e.target.value) || 0))}
                      className="w-full text-xl font-heading font-black p-3 rounded-2xl bg-canvas border border-borderSubtle focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </Card>
              )}
            </div>

            {/* Payment Method Cards */}
            <Card padding="md" className="space-y-4">
              <h4 className="font-heading font-black text-lg text-content-primary">
                Select Payment Method
              </h4>

              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3.5 rounded-2xl border text-center transition-all ${
                    paymentMethod === 'upi'
                      ? 'bg-primary/10 border-primary text-primary shadow-sm font-bold'
                      : 'bg-canvas border-borderSubtle text-content-secondary hover:bg-surface'
                  }`}
                >
                  <Smartphone className="w-5 h-5 mx-auto mb-1 text-primary" />
                  <span className="text-xs block font-bold">UPI / QR</span>
                </button>

                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3.5 rounded-2xl border text-center transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-primary/10 border-primary text-primary shadow-sm font-bold'
                      : 'bg-canvas border-borderSubtle text-content-secondary hover:bg-surface'
                  }`}
                >
                  <CreditCard className="w-5 h-5 mx-auto mb-1 text-sun" />
                  <span className="text-xs block font-bold">Card / NetBanking</span>
                </button>

                <button
                  onClick={() => setPaymentMethod('counter')}
                  className={`p-3.5 rounded-2xl border text-center transition-all ${
                    paymentMethod === 'counter'
                      ? 'bg-primary/10 border-primary text-primary shadow-sm font-bold'
                      : 'bg-canvas border-borderSubtle text-content-secondary hover:bg-surface'
                  }`}
                >
                  <Store className="w-5 h-5 mx-auto mb-1 text-status-success" />
                  <span className="text-xs block font-bold">Pay at Counter</span>
                </button>
              </div>

              {/* UPI QR & Apps Layout */}
              {paymentMethod === 'upi' && (
                <div className="p-5 rounded-2xl bg-canvas border border-borderSubtle flex flex-col sm:flex-row items-center gap-6">
                  {/* Dynamic QR Code */}
                  <div className="p-3 bg-white rounded-2xl shadow-soft border border-borderSubtle shrink-0">
                    <QRCodeSVG
                      value={`upi://pay?pa=tableflow@upi&pn=TableFlow&am=${payableAmount}&cu=INR`}
                      size={130}
                      level="M"
                    />
                  </div>

                  <div className="space-y-2 text-center sm:text-left flex-1">
                    <div className="font-heading font-black text-base text-content-primary">
                      Scan with any UPI App
                    </div>
                    <p className="text-xs text-content-secondary">
                      Google Pay, PhonePe, Paytm, CRED or BHIM UPI accepted instantly.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1 justify-center sm:justify-start">
                      {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map((app) => (
                        <span
                          key={app}
                          className="px-2.5 py-1 rounded-lg bg-surface border border-borderSubtle text-[11px] font-bold text-content-primary"
                        >
                          {app}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Counter Payment Notice */}
              {paymentMethod === 'counter' && (
                <div className="p-4 rounded-2xl bg-sun/15 border border-sun/30 text-xs text-content-secondary space-y-1">
                  <span className="font-heading font-black text-sm text-content-primary block">
                    Cash or Card at Counter
                  </span>
                  Please mention <strong>Table {tableNumber}</strong> to the receptionist cashier when you finish dining.
                </div>
              )}

              {/* Pay Now Primary CTA */}
              <Button
                variant="primary"
                size="lg"
                className="w-full font-bold shadow-accent text-base"
                isLoading={isProcessing}
                onClick={handlePayNow}
              >
                {paymentMethod === 'counter'
                  ? `Notify Cashier (Table ${tableNumber})`
                  : `Pay Now · ${formatCurrency(payableAmount)}`}
              </Button>
            </Card>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
