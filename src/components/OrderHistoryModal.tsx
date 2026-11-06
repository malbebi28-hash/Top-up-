import React, { useState } from 'react';
import { PlacedOrder, Language } from '../types';
import { ADMIN_WHATSAPP, UPI_ID, TRANSLATIONS } from '../data/packages';
import {
  X,
  History,
  Copy,
  Check,
  ExternalLink,
  Receipt,
  Search,
  Trash2,
  Clock,
  CheckCircle,
  Gem,
  ArrowRight,
  Download,
  Share2,
} from 'lucide-react';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: PlacedOrder[];
  language: Language;
  onViewReceipt: (order: PlacedOrder) => void;
  onClearHistory: () => void;
  onUpdateStatus: (orderId: string, status: 'pending' | 'completed') => void;
}

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  isOpen,
  onClose,
  orders,
  language,
  onViewReceipt,
  onClearHistory,
  onUpdateStatus,
}) => {
  const t = TRANSLATIONS[language];
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);

  if (!isOpen) return null;

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.uid.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.packName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.utrNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ? true : order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportCsv = () => {
    if (orders.length === 0) return;

    const headers = ['Order ID', 'Player UID', 'Diamond Pack', 'Original Price (INR)', 'Discount (INR)', 'Final Price (INR)', 'UTR/Tran ID', 'Status', 'Date Time'];
    const rows = orders.map((o) => [
      `"${o.orderId}"`,
      `"${o.uid}"`,
      `"${o.packName.replace(/"/g, '""')}"`,
      o.originalPrice,
      o.discount.toFixed(2),
      o.finalPrice,
      `"${o.utrNumber}"`,
      `"${o.status.toUpperCase()}"`,
      `"${new Date(o.timestamp).toISOString()}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `FreeFire_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopySummary = async () => {
    if (orders.length === 0) return;

    const summaryText =
      `📋 FREE FIRE TOP-UP ORDER HISTORY (${orders.length} Orders)\n` +
      `==========================================\n` +
      orders
        .map(
          (o, i) =>
            `#${i + 1} | Order: ${o.orderId}\n` +
            `• Player UID : ${o.uid}\n` +
            `• Pack       : ${o.packName}\n` +
            `• Amount     : ₹${o.finalPrice} (2% OFF)\n` +
            `• UTR/Ref    : ${o.utrNumber}\n` +
            `• Status     : ${o.status === 'completed' ? 'DELIVERED ✅' : 'PENDING ⏳'}\n` +
            `• Date       : ${new Date(o.timestamp).toLocaleString()}`
        )
        .join('\n------------------------------------------\n') +
      `\n==========================================\n` +
      `Payment Method: PhonePe UPI (${UPI_ID})`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Free Fire Top-Up Orders Summary',
          text: summaryText,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    navigator.clipboard.writeText(summaryText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  const handleResendWhatsApp = (order: PlacedOrder) => {
    const message =
      `🔥 Free Fire Top-Up অর্ডার স্ট্যাটাস চেক 🔥\n\n` +
      `🆔 Order ID: ${order.orderId}\n` +
      `👤 Player UID: ${order.uid}\n` +
      `💎 প্যাক: ${order.packName}\n` +
      `💰 প্রদেয় মূল্য: ₹${order.finalPrice}\n` +
      `🧾 UTR / Tran ID: ${order.utrNumber}\n` +
      `✅ পেমেন্ট মেথড: PhonePe (${UPI_ID})\n\n` +
      `দয়া করে আমার অর্ডারের বর্তমান স্ট্যাটাসটি কনফার্ম করুন।`;

    window.open(`https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0f1522] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-[#141b29]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-heading flex items-center gap-2">
                <span>{language === 'bn' ? 'অর্ডার হিস্ট্রি' : 'Order History'}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 border border-slate-700">
                  {orders.length}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {language === 'bn'
                  ? 'আপনার আগের সমস্ত টপ-আপ অর্ডারের বিবরণ ও স্ট্যাটাস'
                  : 'All your previous top-up orders, transaction status, and receipts'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-3 sm:p-4 border-b border-slate-800 bg-[#111723] flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={
                language === 'bn'
                  ? 'UID, Order ID বা UTR দিয়ে খুঁজুন...'
                  : 'Search by UID, Order ID, or UTR...'
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#0a0e16] border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 bg-[#0a0e16] p-1 border border-slate-800 rounded-lg">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
                  statusFilter === 'all'
                    ? 'bg-slate-700 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {language === 'bn' ? 'সব' : 'All'}
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('pending')}
                className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
                  statusFilter === 'pending'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {language === 'bn' ? 'পেন্ডিং' : 'Pending'}
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('completed')}
                className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
                  statusFilter === 'completed'
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {language === 'bn' ? 'সফল' : 'Done'}
              </button>
            </div>

            {orders.length > 0 && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleExportCsv}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-[#0a0e16] hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors cursor-pointer"
                  title={language === 'bn' ? 'CSV ফাইলে এক্সপোর্ট করুন' : 'Export orders to CSV'}
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>CSV</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-[#0a0e16] hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors cursor-pointer"
                  title={language === 'bn' ? 'অর্ডার সামারি শেয়ার বা কপি করুন' : 'Share or copy order summary'}
                >
                  {copiedSummary ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">{language === 'bn' ? 'কপি হয়েছে' : 'Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>{language === 'bn' ? 'সামারি' : 'Share'}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={onClearHistory}
                  className="p-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
                  title={language === 'bn' ? 'হিস্ট্রি মুছুন' : 'Clear History'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Order List Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-3">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-500 mb-3">
                <Receipt className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-slate-300">
                {t.emptyHistory}
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                {language === 'bn'
                  ? 'উপরে আপনার UID দিয়ে প্যাক সিলেক্ট করে WhatsApp-এ কনফার্ম করলে এখানে আপনার অর্ডার হিস্ট্রি জমা হবে।'
                  : 'Place an order by selecting a pack and confirming on WhatsApp to track your order history here.'}
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const formattedDate = new Date(order.timestamp).toLocaleString(
                language === 'bn' ? 'bn-BD' : 'en-US',
                {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                }
              );

              const isCompleted = order.status === 'completed';

              return (
                <div
                  key={order.orderId}
                  className="bg-[#141b27] border border-slate-800 hover:border-slate-700/80 rounded-xl p-3.5 sm:p-4 transition-all"
                >
                  {/* Row 1: Order ID, Status, Timestamp */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-400">
                        {order.orderId}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(order.orderId, `id-${order.orderId}`)}
                        className="text-slate-500 hover:text-slate-300 transition-colors"
                        title="Copy Order ID"
                      >
                        {copiedId === `id-${order.orderId}` ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        {formattedDate}
                      </span>

                      {/* Status Toggle / Badge */}
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateStatus(
                            order.orderId,
                            isCompleted ? 'pending' : 'completed'
                          )
                        }
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                          isCompleted
                            ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-800/80'
                            : 'bg-amber-950/70 text-amber-300 border border-amber-800/80 animate-pulse'
                        }`}
                        title="Click to toggle status"
                      >
                        {isCompleted ? (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            <span>{language === 'bn' ? 'সফল (Delivered)' : 'Completed'}</span>
                          </>
                        ) : (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            <span>{language === 'bn' ? 'ভেরিফিকেশন চলছে' : 'Processing'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Row 2: Details Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 text-xs">
                    {/* UID */}
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400">
                        Player UID
                      </div>
                      <div className="font-mono font-bold text-white flex items-center gap-1 mt-0.5">
                        <span>{order.uid}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(order.uid, `uid-${order.orderId}`)}
                          className="text-slate-500 hover:text-slate-300"
                        >
                          {copiedId === `uid-${order.orderId}` ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Pack */}
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400">
                        Diamond Pack
                      </div>
                      <div className="font-semibold text-amber-300 flex items-center gap-1 mt-0.5">
                        <Gem className="w-3 h-3 text-cyan-400 shrink-0" />
                        <span className="truncate">{order.packName}</span>
                      </div>
                    </div>

                    {/* Price & Discount */}
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400">
                        Paid (2% OFF)
                      </div>
                      <div className="font-bold text-emerald-400 font-mono-numbers mt-0.5">
                        ₹{order.finalPrice}{' '}
                        <span className="text-[10px] text-slate-400 line-through">
                          ₹{order.originalPrice}
                        </span>
                      </div>
                    </div>

                    {/* UTR */}
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400">
                        UTR / Tran ID
                      </div>
                      <div className="font-mono text-slate-200 flex items-center gap-1 mt-0.5">
                        <span className="truncate max-w-[90px]">{order.utrNumber}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(order.utrNumber, `utr-${order.orderId}`)}
                          className="text-slate-500 hover:text-slate-300"
                        >
                          {copiedId === `utr-${order.orderId}` ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Row 3: Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-slate-800/80">
                    <div className="text-[11px] text-slate-400">
                      Method: <strong className="text-slate-200">PhonePe UPI</strong>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onViewReceipt(order)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors cursor-pointer"
                      >
                        <Receipt className="w-3.5 h-3.5 text-amber-400" />
                        <span>{t.viewReceipt}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleResendWhatsApp(order)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-950 bg-emerald-500 hover:bg-emerald-400 rounded-md transition-colors cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>{language === 'bn' ? 'WhatsApp চেক' : 'WhatsApp Check'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 sm:p-4 border-t border-slate-800 bg-[#141b29] flex items-center justify-between">
          <div className="text-xs text-slate-400">
            {language === 'bn'
              ? 'যেকোনো সমস্যার জন্য সরাসরি WhatsApp-এ যোগাযোগ করুন'
              : 'Contact WhatsApp support anytime for order issues'}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
