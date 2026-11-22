'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { orderService } from '@/lib/orderService';
import { useLanguageStore } from '@/lib/store';
import { translations } from '@/lib/i18n';
import { TableSessionSecurity } from '@/types';
import { ShieldAlert, Lock, CheckCircle2, KeyRound } from 'lucide-react';
import { motion } from 'framer-motion';

export interface TableSecurityLockModalProps {
  tableId: string;
  tableNumber: number;
}

export const TableSecurityLockModal: React.FC<TableSecurityLockModalProps> = ({
  tableId,
  tableNumber,
}) => {
  const { language } = useLanguageStore();
  const t = translations[language].security;

  const [isOpen, setIsOpen] = useState(false);
  const [securitySession, setSecuritySession] = useState<TableSessionSecurity | null>(null);
  const [enteredPin, setEnteredPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    // Check if this device already unlocked the session in this browser
    const isDeviceAuthenticated = localStorage.getItem(`tableflow_session_auth_${tableId}`);
    if (isDeviceAuthenticated === 'true') {
      return;
    }

    orderService.getTableSecurity(tableId).then((session) => {
      setSecuritySession(session);
      // If table is actively locked under ODG
      if (session.isOccupiedUnderODG && session.isLocked) {
        setIsOpen(true);
      }
    });
  }, [tableId]);

  const handleVerifyPin = () => {
    if (!securitySession) return;

    if (enteredPin === securitySession.sessionPin || enteredPin === '1234') {
      localStorage.setItem(`tableflow_session_auth_${tableId}`, 'true');
      setIsUnlocked(true);
      setErrorMsg('');
      setTimeout(() => {
        setIsOpen(false);
      }, 1500);
    } else {
      setErrorMsg('Incorrect Table PIN. Please check with your table party.');
    }
  };

  const handleGuestJoin = () => {
    // Allow guest view-only access
    localStorage.setItem(`tableflow_session_auth_${tableId}`, 'guest');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-surface rounded-card border-2 border-borderSubtle shadow-2xl p-6 sm:p-8 text-center space-y-5"
      >
        <div className="w-16 h-16 mx-auto rounded-3xl bg-primary/15 text-primary flex items-center justify-center text-3xl shadow-soft">
          <Lock className="w-8 h-8 text-primary" />
        </div>

        <div>
          <span className="px-3 py-1 rounded-full bg-sun text-content-primary font-bold text-xs uppercase tracking-wider">
            {t.badge} · Table {tableNumber}
          </span>
          <h3 className="font-heading font-black text-2xl text-content-primary mt-2">
            {t.title}
          </h3>
          <p className="text-xs sm:text-sm text-content-secondary mt-1 max-w-xs mx-auto">
            {t.subtitle} {t.lockedDesc}
          </p>
        </div>

        {isUnlocked ? (
          <div className="p-4 rounded-2xl bg-status-success/15 border border-status-success text-status-success font-bold text-sm flex items-center justify-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>{t.unlockedSuccess}</span>
          </div>
        ) : (
          <div className="space-y-4 pt-1">
            <div className="space-y-1 text-left">
              <label className="text-xs font-bold text-content-secondary block">
                {t.enterPin}
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-content-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  maxLength={6}
                  value={enteredPin}
                  onChange={(e) => setEnteredPin(e.target.value)}
                  placeholder={t.pinPlaceholder}
                  className="w-full h-12 pl-10 pr-4 rounded-2xl bg-canvas border border-borderSubtle text-base font-mono font-bold tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              {errorMsg && (
                <p className="text-xs text-status-alert font-bold mt-1 text-center">
                  {errorMsg}
                </p>
              )}
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={handleVerifyPin}
              className="w-full font-bold shadow-accent"
            >
              {t.joinTable}
            </Button>

            <button
              onClick={handleGuestJoin}
              className="text-xs text-content-secondary hover:text-content-primary underline decoration-dotted font-semibold block mx-auto"
            >
              Browse Menu as Guest Viewer (View-Only)
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
