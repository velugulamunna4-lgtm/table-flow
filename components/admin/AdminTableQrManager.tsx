'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { restaurantConfig } from '@/config/restaurant.config';
import tablesData from '@/data/mock/tables.json';
import { Table } from '@/types';
import { Plus, Printer, ExternalLink, QrCode } from 'lucide-react';

export const AdminTableQrManager: React.FC = () => {
  const [tables, setTables] = useState<Table[]>(tablesData as Table[]);
  const [newTableCapacity, setNewTableCapacity] = useState('4');

  const handleAddTable = () => {
    const nextNumber = tables.length + 1;
    const newTable: Table = {
      id: nextNumber.toString(),
      number: nextNumber,
      capacity: parseInt(newTableCapacity, 10) || 4,
      status: 'free',
    };
    setTables([...tables, newTable]);
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
            Printable acrylic tent-card templates with multi-language order prompts.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="secondary"
            size="md"
            onClick={handlePrint}
            leftIcon={<Printer className="w-4 h-4" />}
          >
            Print All QR Cards
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
          const qrUrl = `/t/${table.number}`;

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
                  value={
                    typeof window !== 'undefined'
                      ? `${window.location.origin}/t/${table.number}`
                      : `/t/${table.number}`
                  }
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

              {/* Interactive test link */}
              <div className="pt-2 border-t border-borderSubtle w-full flex justify-between items-center text-xs">
                <span className="text-content-muted">Seats: {table.capacity}</span>
                <Link
                  href={`/t/${table.number}`}
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
