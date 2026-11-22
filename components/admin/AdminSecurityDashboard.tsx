'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { orderService } from '@/lib/orderService';
import { TableSessionSecurity, Order } from '@/types';
import { useLanguageStore } from '@/lib/store';
import { translations } from '@/lib/i18n';
import tablesData from '@/data/mock/tables.json';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Unlock,
  KeyRound,
  RotateCcw,
  Users,
  Smartphone,
  AlertTriangle,
} from 'lucide-react';

export const AdminSecurityDashboard: React.FC = () => {
  const { language } = useLanguageStore();
  const t = translations[language].security;

  const [sessions, setSessions] = useState<Record<string, TableSessionSecurity>>({});
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    orderService.getSecuritySessions().then(setSessions);
    orderService.getOrders().then(setOrders);

    const unsubSec = orderService.subscribeToSecurity(setSessions);
    const unsubOrd = orderService.subscribeToOrders(setOrders);
    return () => {
      unsubSec();
      unsubOrd();
    };
  }, []);

  const handleToggleLock = async (tableId: string, currentLock: boolean) => {
    await orderService.setTableLock(tableId, !currentLock);
  };

  const handleResetSession = async (tableId: string) => {
    if (confirm(`Reset session and unlock Table ${tableId}? This releases the ODG security hold.`)) {
      await orderService.resetTableSession(tableId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Alert Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-sun/20 via-surface to-primary/10 border border-sun/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-2xl shadow-accent shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-heading font-black text-xl text-content-primary">
              {t.securityDashboard} (ODG Protection)
            </h3>
            <p className="text-xs sm:text-sm text-content-secondary">
              Protects dining parties from rogue cross-table scans, accidental cart overwrites, and unauthorized order tampering.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs font-bold text-status-success bg-surface px-3.5 py-2 rounded-pill border border-borderSubtle">
          <span className="w-2.5 h-2.5 rounded-full bg-status-success animate-pulse" />
          <span>Anti-Tamper Shield Active</span>
        </div>
      </div>

      {/* Grid of Floor Tables with ODG Security Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {tablesData.map((table) => {
          const session = sessions[table.id];
          const hasActiveOrder = orders.some(
            (o) => o.tableId === table.id && o.status !== 'served' && o.status !== 'cancelled'
          );
          const isUnderODG = Boolean(session?.isOccupiedUnderODG || hasActiveOrder);
          const isLocked = session?.isLocked ?? isUnderODG;
          const pin = session?.sessionPin || `410${table.id}`;

          return (
            <Card
              key={table.id}
              padding="md"
              className={`space-y-4 border transition-all ${
                isUnderODG
                  ? 'border-primary/40 bg-surface shadow-soft'
                  : 'border-borderSubtle bg-surface/60'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-heading font-black text-2xl text-content-primary">
                    Table {table.number}
                  </h4>
                  <span className="text-[11px] text-content-muted">
                    Seats {table.capacity} guests
                  </span>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                    isUnderODG
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-status-success/15 text-status-success'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isUnderODG ? 'bg-white' : 'bg-status-success'}`} />
                  <span>{isUnderODG ? 'ODG Active' : 'Free / Open'}</span>
                </span>
              </div>

              {/* Security Details */}
              <div className="p-3.5 rounded-2xl bg-canvas border border-borderSubtle space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-content-secondary font-medium">Session PIN Passcode:</span>
                  <div className="flex items-center gap-1 font-mono font-black text-sm text-primary bg-surface px-2.5 py-0.5 rounded-lg border border-borderSubtle">
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>{pin}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-content-secondary font-medium">QR Scanning Gate:</span>
                  <span
                    className={`font-bold flex items-center gap-1 ${
                      isLocked ? 'text-status-alert' : 'text-status-success'
                    }`}
                  >
                    {isLocked ? (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>PIN Locked (ODG Safe)</span>
                      </>
                    ) : (
                      <>
                        <Unlock className="w-3.5 h-3.5" />
                        <span>Open Access</span>
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-1 flex gap-2">
                <button
                  onClick={() => handleToggleLock(table.id, isLocked)}
                  className={`flex-1 py-2 px-3 rounded-pill text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                    isLocked
                      ? 'bg-canvas hover:bg-surface text-content-primary border-borderSubtle'
                      : 'bg-primary text-white border-primary shadow-sm'
                  }`}
                >
                  {isLocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                  <span>{isLocked ? 'Unlock Access' : 'Lock Table'}</span>
                </button>

                {isUnderODG && (
                  <button
                    onClick={() => handleResetSession(table.id)}
                    className="p-2 rounded-full bg-canvas hover:bg-[#FFF2F4] text-content-secondary hover:text-status-alert border border-borderSubtle"
                    title="Reset Table Session"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
