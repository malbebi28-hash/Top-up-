import React, { useState } from 'react';
import { PlacedOrder, Language } from '../types';
import { ADMIN_WHATSAPP, UPI_ID, PAYEE_NAME } from '../data/packages';
import { X, CheckCircle2, Copy, Check, Send, Download, ShieldCheck, Flame } from 'lucide-react';

interface ReceiptModalProps {
  order: PlacedOrder | null;
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  order,
  isOpen,
  onClose,
  language,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !order) return null;

  const formattedDate = new Date(order.timestamp).toLocaleString(
    language === 'bn' ? 'bn-BD' : 'en-US',
    {
      dateStyle: 'medium',
      timeStyle: 'short',
    }
  );

  const receiptText =
    `=============================\n` +
    `   FREE FIRE TOP-UP RECEIPT  \n` +
    `=============================\n` +
    `Order ID    : ${order.orderId}\n` +
    `Player UID  : ${order.uid}\n` +
    `Pack Name   : ${order.packName}\n` +
    `Original    : ₹${order.originalPrice}\n` +
    `Discount    : -₹${order.discount.toFixed(2)} (2% OFF)\n` +
    `Amount Paid : ₹${order.finalPrice}\n` +
    `Payment UPI : ${UPI_ID} (${PAYEE_NAME})\n` +
    `UTR / Tran  : ${order.utrNumber}\n` +
    `Date & Time : ${formattedDate}\n` +
    `Status      : ${order.status === 'completed' ? 'DELIVERED' : 'PROCESSING'}\n` +
    `=============================`;

  const handleCopyReceipt = () => {
    navigator.clipboard.writeText(receiptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendWhatsApp = () => {
    const message =
      `🔥 Free Fire Top-Up Order Slip 🔥\n\n` +
      `🆔 Order ID: ${order.orderId}\n` +
      `👤 Player UID: ${order.uid}\n` +
      `💎 প্যাক: ${order.packName}\n` +
      `💰 প্রদেয় মূল্য: ₹${order.finalPrice} (2% OFF)\n` +
      `🧾 UTR / Tran ID: ${order.utrNumber}\n` +
      `🕒 সময়: ${formattedDate}\n` +
      `✅ পেমেন্ট মেথড: PhonePe (${UPI_ID})`;

    window.open(`https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0f141f] border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 p-3 text-slate-950 font-bold text-center text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 shadow">
          <Flame className="w-4 h-4 fill-current" />
          <span>Official Top-Up Slip</span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 p-1.5 rounded-full text-slate-950 hover:bg-black/10 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-5 sm:p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-6 h-6" />
          </div>

          <h3 className="text-lg font-extrabold text-white font-heading">
            {language === 'bn' ? 'অর্ডার সফলভাবে তৈরি হয়েছে!' : 'Order Dispatched Successfully!'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'bn'
              ? 'আপনার টপ-আপ প্রসেসিং শুরু হয়েছে। সাধারণত ৫-১৫ মিনিটের মধ্যে গেম একাউন্টে ডায়মন্ড যুক্ত হয়।'
              : 'Your top-up verification is in progress. Diamonds will reflect within 5-15 minutes.'}
          </p>

          {/* Clean Receipt Ticket */}
          <div className="mt-4 p-4 rounded-xl bg-[#090d14] border border-slate-800 text-left space-y-2.5 text-xs font-mono">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
              <span className="text-slate-400">Order ID:</span>
              <span className="text-amber-400 font-bold">{order.orderId}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400">Player UID:</span>
              <span className="text-white font-bold">{order.uid}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400">Diamond Pack:</span>
              <span className="text-cyan-300 font-bold">{order.packName}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400">Original Price:</span>
              <span className="text-slate-400 line-through">₹{order.originalPrice}</span>
            </div>

            <div className="flex justify-between items-center text-emerald-400">
              <span>2% Flat Discount:</span>
              <span>-₹{order.discount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-800/80 font-bold text-sm">
              <span className="text-white">Amount Paid:</span>
              <span className="text-amber-400">₹{order.finalPrice}</span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-800/80 text-[11px]">
              <span className="text-slate-400">UTR / Ref No:</span>
              <span className="text-slate-300 break-all">{order.utrNumber}</span>
            </div>

            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-400">Date & Time:</span>
              <span className="text-slate-400">{formattedDate}</span>
            </div>

            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-400">Payment App:</span>
              <span className="text-purple-400 font-semibold">PhonePe ({UPI_ID})</span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-800/80 text-[11px]">
              <span className="text-slate-400">Status:</span>
              <span
                className={`font-semibold ${
                  order.status === 'completed' ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {order.status === 'completed'
                  ? 'COMPLETED / DELIVERED'
                  : 'PROCESSING (5-15 MINS)'}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-5 space-y-2">
            <button
              type="button"
              onClick={handleSendWhatsApp}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-[#25d366] hover:bg-[#20ba5a] flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{language === 'bn' ? 'WhatsApp এ রিসিট পাঠান' : 'Send Slip via WhatsApp'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyReceipt}
              className="w-full py-2 px-4 rounded-xl font-medium text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{language === 'bn' ? 'রিসিট কপি হয়েছে!' : 'Receipt Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'রিসিট কপি করুন' : 'Copy Full Receipt'}</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Guaranteed Safe & Instant Delivery</span>
          </div>
        </div>
      </div>
    </div>
  );
};
