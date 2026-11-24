'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { restaurantConfig } from '@/config/restaurant.config';
import tablesData from '@/data/mock/tables.json';
import { Table } from '@/types';
import { Plus, Printer, ExternalLink, QrCode, RefreshCw, KeyRound, Check } from 'lucide-react';

export const AdminTableQrManager: React.FC = () => {
  const [tables, setTables] = useState<Table[]>(tablesData as Table[]);
  const [newTableCapacity, setNewTableCapacity] = useState('4');
  const [tokens, setTokens] = useState<Record<string, string>>({});
  const [regenerating, setRegenerating] = useState<Record<string, boolean>>({});

  // Generate tokens for tables if not present
  const handleRegenerateToken = async (tableNum: number) => {
    setRegenerating((prev) => ({ ...prev, [tableNum]: true }));
    try {
      const res = await fetch(`/api/tables/${tableNum}/token`, { method: 'POST' });
      const data = await res.json();
      if (data && data.token) {
        setTokens((prev) => ({ ...prev, [tableNum]: data.token }));
      }
    } catch (e) {
      console.warn('Failed to regenerate token:', e);
    } finally {
      setRegenerating((prev) => ({ ...prev, [tableNum]: false }));
    }
  };

  const handleRegenerateAll = async () => {
    for (const t of tables) {
      await handleRegenerateToken(t.number);
    }
  };

  useEffect(() => {
    // Generate initial tokens on load
    tables.forEach((t) => {
      handleRegenerateToken(t.number);
    });
  }, []);

  const handleAddTable = () => {
    const nextNumber = tables.length + 1;
    const newTable: Table = {
      id: nextNumber.toString(),
      number: nextNumber,
      capacity: parseInt(newTableCapacity, 10) || 4,
      status: 'free',
    };
    setTables([...tables, newTable]);
    handleRegenerateToken(nextNumber);
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <h3 className="font-heading font-black text-xl text-content-primary">
            Table QR Cards & Generation
          </h3>
          <p className="text-xs text-content-secondary mt-0.5">
            Printable acrylic tent-card templates with cryptographically signed tokens.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
          <Button
            variant="secondary"
            size="md"
            onClick={handleRegenerateAll}
            leftIcon={<RefreshCw className="w-4 h-4 text-primary" />}
          >
            Regenerate All Tokens
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={handlePrint}
            leftIcon={<Printer className="w-4 h-4" />}
          >
            Print Cards
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={handleAddTable}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Table {tables.length + 1}
          </Button>
        </div>
      </div>

      {/* Grid of Printable Tent Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {tables.map((table) => {
          const token = tokens[table.number];
          const relativeUrl = token ? `/t/${table.number}?t=${encodeURIComponent(token)}` : `/t/${table.number}`;
          const fullUrl = typeof window !== 'undefined'
            ? `${window.location.origin}${relativeUrl}`
            : relativeUrl;

          return (
            <div
              key={table.id}
              className="bg-white rounded-3xl border-2 border-borderSubtle shadow-soft p-6 flex flex-col items-center text-center space-y-4 hover:border-primary transition-all group relative overflow-hidden"
            >
              {/* Brand Header */}
              <div className="space-y-1">
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-primary text-white font-black text-sm">
                  TF
                </div>
                <div className="font-heading font-black text-lg text-content-primary">
                  {restaurantConfig.name}
                </div>
                <div className="text-[11px] font-bold text-content-muted uppercase tracking-widest">
                  Authentic Dining
                </div>
              </div>

              {/* Huge Table Number */}
              <div className="px-4 py-1.5 rounded-full bg-sun text-content-primary font-heading font-black text-xl shadow-sm">
                Table {table.number}
              </div>

              {/* QR Code Container */}
              <div className="p-4 bg-canvas rounded-2xl border border-borderSubtle shadow-inner">
                <QRCodeSVG
                  value={fullUrl}
                  size={140}
                  level="H"
                  includeMargin={false}
                />
              </div>

              {/* 3 Languages Instruction */}
              <div className="space-y-1 text-content-secondary">
                <div className="font-heading font-bold text-sm text-content-primary">
                  Scan to Order · ఆర్డర్ చేయండి · ऑर्डर करें
                </div>
                <p className="text-[11px] text-content-muted">
                  No app download needed · Instant kitchen order
                </p>
              </div>

              {/* Token Status & Regeneration */}
              <div className="w-full pt-2 border-t border-borderSubtle flex items-center justify-between text-xs">
                <button
                  onClick={() => handleRegenerateToken(table.number)}
                  disabled={regenerating[table.number]}
                  className="inline-flex items-center gap-1 font-bold text-content-secondary hover:text-primary transition-colors disabled:opacity-50"
                  title="Generate new HMAC-SHA256 Token"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${regenerating[table.number] ? 'animate-spin text-primary' : ''}`} />
                  <span>{regenerating[table.number] ? 'Updating...' : 'Regenerate Token'}</span>
                </button>

                <Link
                  href={relativeUrl}
                  target="_blank"
                  className="inline-flex items-center gap-1 font-bold text-primary hover:underline"
                >
                  <span>Test Link</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
