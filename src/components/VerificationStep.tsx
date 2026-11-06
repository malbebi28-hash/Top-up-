import React, { useState } from 'react';
import { DiamondPack, Language } from '../types';
import { ADMIN_WHATSAPP, UPI_ID, PAYEE_NAME, TRANSLATIONS, DISCOUNT_PERCENT } from '../data/packages';
import { Send, CheckCircle2, HelpCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface VerificationStepProps {
  language: Language;
  selectedPack: DiamondPack | null;
  playerUid: string;
  onOrderCreated: (orderData: {
    uid: string;
    packName: string;
    originalPrice: number;
    discount: number;
    finalPrice: string;
    utrNumber: string;
  }) => void;
}

export const VerificationStep: React.FC<VerificationStepProps> = ({
  language,
  selectedPack,
  playerUid,
  onOrderCreated,
}) => {
  const t = TRANSLATIONS[language];
  const [utrNumber, setUtrNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showUtrHelp, setShowUtrHelp] = useState(false);

  const discountAmount = selectedPack
    ? selectedPack.originalPrice * (DISCOUNT_PERCENT / 100)
    : 0;
  const finalPrice = selectedPack
    ? (selectedPack.originalPrice - discountAmount).toFixed(2)
    : '0.00';

  const handleConfirmOrder = () => {
    setErrorMessage('');

    if (!playerUid || playerUid.trim().length < 8) {
      setErrorMessage(
        language === 'bn'
          ? 'অনুগ্রহ করে সঠিক Free Fire Player UID (৮-১২ ডিজিট) দিন!'
          : 'Please enter a valid Free Fire Player UID (8-12 digits)!'
      );
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }

    if (!selectedPack) {
      setErrorMessage(
        language === 'bn'
          ? 'অনুগ্রহ করে একটি ডায়মন্ড প্যাক সিলেক্ট করুন!'
          : 'Please select a diamond pack!'
      );
      return;
    }

    const cleanUtr = utrNumber.trim();
    if (!cleanUtr || cleanUtr.length < 8) {
      setErrorMessage(
        language === 'bn'
          ? 'অনুগ্রহ করে পেমেন্টের সঠিক UTR / Transaction ID (কমপক্ষে ৮-১২ ডিজিট) লিখুন!'
          : 'Please enter a valid UTR / Transaction ID (at least 8-12 digits)!'
      );
      return;
    }

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // Ignore if confetti not supported
    }

    // Record the order into Order History state
    onOrderCreated({
      uid: playerUid.trim(),
      packName: selectedPack.name,
      originalPrice: selectedPack.originalPrice,
      discount: discountAmount,
      finalPrice,
      utrNumber: cleanUtr,
    });

    // Format WhatsApp message exactly as requested
    const message =
      `🔥 নতুন Free Fire Top-Up অর্ডার 🔥\n\n` +
      `👤 Player UID: ${playerUid.trim()}\n` +
      `💎 প্যাক: ${selectedPack.name}\n` +
      `💰 মোট মূল্য: ₹${finalPrice} (2% OFF)\n` +
      `🧾 UTR / Tran ID: ${cleanUtr}\n` +
      `✅ পেমেন্ট মেথড: PhonePe (${UPI_ID})\n\n` +
      `🕒 সময়: ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}\n` +
      `অনুগ্রহ করে ডায়মন্ড পাঠিয়ে কনফার্ম করুন। ধন্যবাদ!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodedMessage}`;

    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-2.5">
        <h2 className="text-sm sm:text-base font-bold text-amber-400 flex items-center gap-2">
          <span className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center text-xs font-mono font-bold">
            4
          </span>
          <span>{t.step4Title}</span>
        </h2>
        <button
          type="button"
          onClick={() => setShowUtrHelp(!showUtrHelp)}
          className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>UTR কি?</span>
        </button>
      </div>

      <div className="bg-[#141b25] border border-slate-800 rounded-xl p-4 sm:p-5 shadow-lg">
        {/* Help box collapsible */}
        {showUtrHelp && (
          <div className="mb-4 p-3 rounded-lg bg-amber-950/40 border border-amber-800/60 text-xs text-amber-200 space-y-1.5">
            <div className="font-bold text-amber-300 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" />
              <span>PhonePe-তে UTR নম্বর কোথায় পাবেন?</span>
            </div>
            <p>
              ১. PhonePe অ্যাপ ওপেন করে নিচের ডানদিকের <strong>History</strong> তে যান।
            </p>
            <p>
              ২. <strong>{PAYEE_NAME}</strong>-কে করা পেমেন্টটিতে ক্লিক করুন।
            </p>
            <p>
              ৩. সেখানে <strong>"UTR"</strong> বা <strong>"Bank Ref No."</strong> নামের ১২ ডিজিটের নম্বরটি দেখতে পাবেন। সেটি কপি করে এখানে বসান।
            </p>
          </div>
        )}

        <label htmlFor="utrInput" className="block text-xs font-medium text-slate-300 mb-1.5">
          {t.utrLabel}
        </label>

        <div className="relative mb-2">
          <input
            id="utrInput"
            type="text"
            value={utrNumber}
            onChange={(e) => {
              setUtrNumber(e.target.value);
              if (errorMessage) setErrorMessage('');
            }}
            placeholder={t.utrPlaceholder}
            className="w-full px-4 py-3 bg-[#0d1218] border border-slate-700 rounded-lg text-white font-mono text-sm sm:text-base placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 transition-all uppercase"
          />
        </div>

        <p className="text-[11px] text-slate-400 mb-4">
          {t.utrHelp}
        </p>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-rose-950/50 border border-rose-800 text-xs text-rose-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* WhatsApp Submit Button */}
        <button
          type="button"
          onClick={handleConfirmOrder}
          className="w-full py-3.5 px-5 rounded-xl font-bold text-sm sm:text-base text-slate-950 bg-gradient-to-r from-[#25d366] to-[#1ebe5b] hover:from-[#20ba5a] hover:to-[#17a34d] shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition-all cursor-pointer group active:scale-[0.99]"
        >
          <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          <span>{t.submitOrderWhatsApp}</span>
        </button>

        <div className="mt-3 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>WhatsApp-এ মেসেজ পাঠানোর পর ৫-১৫ মিনিটের মধ্যে টপ-আপ পৌঁছে যাবে।</span>
        </div>
      </div>
    </section>
  );
};
