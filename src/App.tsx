/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { DiamondPack, PlacedOrder, Language } from './types';
import { PACKAGES } from './data/packages';
import { Header } from './components/Header';
import { PlayerUidStep } from './components/PlayerUidStep';
import { PackSelector } from './components/PackSelector';
import { PaymentStep } from './components/PaymentStep';
import { VerificationStep } from './components/VerificationStep';
import { OrderHistoryModal } from './components/OrderHistoryModal';
import { ReceiptModal } from './components/ReceiptModal';
import { FaqSection } from './components/FaqSection';

// Initial sample order so the user immediately sees the Order History feature in action
const INITIAL_SAMPLE_ORDERS: PlacedOrder[] = [
  {
    orderId: 'FF-2026-7841',
    uid: '13627132953',
    packName: '310 💎 Diamonds',
    originalPrice: 240,
    discount: 4.80,
    finalPrice: '235.20',
    utrNumber: '419827361520',
    timestamp: Date.now() - 1000 * 60 * 35, // 35 minutes ago
    status: 'completed',
  },
  {
    orderId: 'FF-2026-9214',
    uid: '19482017342',
    packName: 'Weekly Membership',
    originalPrice: 160,
    discount: 3.20,
    finalPrice: '156.80',
    utrNumber: '420918237190',
    timestamp: Date.now() - 1000 * 60 * 120, // 2 hours ago
    status: 'completed',
  },
];

export default function App() {
  const [language, setLanguage] = useState<Language>('bn');
  const [playerUid, setPlayerUid] = useState<string>('13627132953');
  const [selectedPack, setSelectedPack] = useState<DiamondPack | null>(PACKAGES[0]);
  const [recentUids, setRecentUids] = useState<string[]>(['13627132953']);

  // Order History State
  const [orders, setOrders] = useState<PlacedOrder[]>(() => {
    try {
      const saved = localStorage.getItem('ff_topup_orders');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return INITIAL_SAMPLE_ORDERS;
  });

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [activeReceiptOrder, setActiveReceiptOrder] = useState<PlacedOrder | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  // Sync orders with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ff_topup_orders', JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders to localStorage', e);
    }
  }, [orders]);

  // Load recent UIDs
  useEffect(() => {
    try {
      const savedUids = localStorage.getItem('ff_recent_uids');
      if (savedUids) {
        setRecentUids(JSON.parse(savedUids));
      }
    } catch {
      // Ignore
    }
  }, []);

  const handleCreateOrder = (orderData: {
    uid: string;
    packName: string;
    originalPrice: number;
    discount: number;
    finalPrice: string;
    utrNumber: string;
  }) => {
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const newOrder: PlacedOrder = {
      orderId: `FF-2026-${randomCode}`,
      uid: orderData.uid,
      packName: orderData.packName,
      originalPrice: orderData.originalPrice,
      discount: orderData.discount,
      finalPrice: orderData.finalPrice,
      utrNumber: orderData.utrNumber,
      timestamp: Date.now(),
      status: 'pending',
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Save UID to recent
    setRecentUids((prev) => {
      const updated = [orderData.uid, ...prev.filter((id) => id !== orderData.uid)].slice(0, 5);
      localStorage.setItem('ff_recent_uids', JSON.stringify(updated));
      return updated;
    });

    // Show digital receipt popup
    setActiveReceiptOrder(newOrder);
    setIsReceiptOpen(true);
  };

  const handleUpdateStatus = (orderId: string, status: 'pending' | 'completed') => {
    setOrders((prev) =>
      prev.map((o) => (o.orderId === orderId ? { ...o, status } : o))
    );
  };

  const handleClearHistory = () => {
    if (window.confirm(language === 'bn' ? 'আপনি কি সব অর্ডার হিস্ট্রি মুছে ফেলতে চান?' : 'Clear all order history?')) {
      setOrders([]);
      localStorage.removeItem('ff_topup_orders');
    }
  };

  const handleViewReceipt = (order: PlacedOrder) => {
    setActiveReceiptOrder(order);
    setIsReceiptOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col items-center p-3 sm:p-5 md:py-8 selection:bg-amber-500 selection:text-slate-950">
      <div className="w-full max-w-[560px] pb-12">
        {/* Top Header */}
        <Header
          language={language}
          onLanguageChange={setLanguage}
          orderCount={orders.length}
          onOpenHistory={() => setIsHistoryOpen(true)}
        />

        {/* Step 1: UID Input */}
        <PlayerUidStep
          language={language}
          playerUid={playerUid}
          onUidChange={setPlayerUid}
          recentUids={recentUids}
        />

        {/* Step 2: Diamond Pack Selector */}
        <PackSelector
          language={language}
          selectedPack={selectedPack}
          onSelectPack={setSelectedPack}
        />

        {/* Step 3: Payment Section (PhonePe UPI) */}
        <PaymentStep
          language={language}
          selectedPack={selectedPack}
          playerUid={playerUid}
        />

        {/* Step 4: Verification & Submit Order */}
        <VerificationStep
          language={language}
          selectedPack={selectedPack}
          playerUid={playerUid}
          onOrderCreated={handleCreateOrder}
        />

        {/* Floating Order History Quick View Banner */}
        {orders.length > 0 && (
          <div className="mt-4 p-3.5 rounded-xl bg-gradient-to-r from-[#17202d] to-[#121924] border border-amber-500/30 flex items-center justify-between gap-3 shadow-lg">
            <div className="text-xs">
              <span className="font-bold text-amber-300">
                {language === 'bn' ? 'অর্ডার ট্র্যাকিং' : 'Order Tracking'}:
              </span>{' '}
              <span className="text-slate-300">
                {orders.length} {language === 'bn' ? 'টি পূর্ববর্তী অর্ডার রেকর্ড আছে' : 'orders saved in history'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsHistoryOpen(true)}
              className="px-3 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer shrink-0"
            >
              {language === 'bn' ? 'হিস্ট্রি দেখুন' : 'View History'}
            </button>
          </div>
        )}

        {/* FAQ Section */}
        <FaqSection language={language} />

        {/* Footer */}
        <footer className="mt-8 text-center text-xs text-slate-500 space-y-1">
          <p>© 2026 Free Fire Diamond Top-Up Store. All rights reserved.</p>
          <p className="text-[11px] text-slate-600">
            Powered by PhonePe UPI ({'6297198453@ybl'}) · WhatsApp: +91 6297198453
          </p>
        </footer>
      </div>

      {/* Order History Modal */}
      <OrderHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        orders={orders}
        language={language}
        onViewReceipt={handleViewReceipt}
        onClearHistory={handleClearHistory}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Digital Receipt Modal */}
      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        order={activeReceiptOrder}
        language={language}
      />
    </div>
  );
}
