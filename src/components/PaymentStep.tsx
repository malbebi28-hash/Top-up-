import React, { useState, useEffect } from 'react';
import { DiamondPack, Language } from '../types';
import { UPI_ID, PAYEE_NAME, TRANSLATIONS, DISCOUNT_PERCENT } from '../data/packages';
import QRCode from 'qrcode';
import { Copy, Check, QrCode, Download, ExternalLink, ShieldAlert, ArrowRight } from 'lucide-react';

interface PaymentStepProps {
  language: Language;
  selectedPack: DiamondPack | null;
  playerUid: string;
}

export const PaymentStep: React.FC<PaymentStepProps> = ({
  language,
  selectedPack,
  playerUid,
}) => {
  const t = TRANSLATIONS[language];
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [qrLoading, setQrLoading] = useState(true);

  const discountAmount = selectedPack
    ? (selectedPack.originalPrice * (DISCOUNT_PERCENT / 100)).toFixed(2)
    : '0.00';
  const finalPrice = selectedPack
    ? (selectedPack.originalPrice - parseFloat(discountAmount)).toFixed(2)
    : '0.00';

  // Construct UPI deep link
  const note = `FreeFireDiamond${playerUid ? `-UID-${playerUid}` : ''}`;
  const upiUrl = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(PAYEE_NAME)}&am=${finalPrice}&cu=INR&tn=${encodeURIComponent(note)}`;

  // Generate QR Code dynamically
  useEffect(() => {
    if (!selectedPack) return;

    setQrLoading(true);
    QRCode.toDataURL(upiUrl, {
      width: 320,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    })
      .then((url: string) => {
        setQrDataUrl(url);
        setQrLoading(false);
      })
      .catch((err: Error) => {
        console.error('QR generation error:', err);
        // Fallback to online QR API if canvas fails
        setQrDataUrl(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiUrl)}`);
        setQrLoading(false);
      });
  }, [upiUrl, selectedPack]);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `PhonePe_FreeFire_TopUp_${finalPrice}INR.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-2.5">
        <h2 className="text-sm sm:text-base font-bold text-amber-400 flex items-center gap-2">
          <span className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center text-xs font-mono font-bold">
            3
          </span>
          <span>{t.step3Title}</span>
        </h2>
        <span className="text-[11px] font-semibold text-purple-400 bg-purple-950/60 border border-purple-800/60 px-2.5 py-0.5 rounded-full">
          PhonePe Verified
        </span>
      </div>

      <div className="bg-[#141b25] border border-slate-800 rounded-xl p-4 sm:p-5 shadow-lg">
        {/* Bill Breakdown */}
        <div className="space-y-2 text-xs sm:text-sm">
          <div className="flex justify-between items-center text-slate-300">
            <span>{t.summarySelectedPack}</span>
            <span className="font-bold text-white">
              {selectedPack ? selectedPack.name : t.selectPackPrompt}
            </span>
          </div>

          <div className="flex justify-between items-center text-slate-400">
            <span>{t.summaryOriginal}</span>
            <span className="font-mono-numbers">
              ₹{selectedPack ? selectedPack.originalPrice : 0}
            </span>
          </div>

          <div className="flex justify-between items-center text-emerald-400 font-medium">
            <span>{t.summaryDiscount}</span>
            <span className="font-mono-numbers">- ₹{discountAmount}</span>
          </div>

          <div className="pt-2.5 mt-2 border-t border-dashed border-slate-700/80 flex justify-between items-baseline">
            <span className="font-bold text-white text-sm sm:text-base">
              {t.summaryTotal}
            </span>
            <div className="text-right">
              <span className="text-xl sm:text-2xl font-extrabold text-amber-400 font-mono-numbers">
                ₹{finalPrice}
              </span>
              <div className="text-[10px] text-emerald-400 font-medium">
                (Flat 2% Discount Applied)
              </div>
            </div>
          </div>
        </div>

        {/* UPI Box */}
        <div className="mt-5 p-3.5 rounded-lg bg-[#0e141d] border border-slate-800">
          <div className="text-center text-xs text-slate-300 font-medium mb-1.5">
            {t.paymentUpiTitle}
          </div>

          <div className="flex items-center justify-center gap-2 bg-[#17202d] border border-slate-700/80 rounded-lg p-2 max-w-sm mx-auto">
            <span className="font-mono text-sm sm:text-base font-bold text-amber-300 select-all tracking-wider">
              {UPI_ID}
            </span>
            <button
              type="button"
              onClick={handleCopyUpi}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors cursor-pointer shrink-0"
            >
              {copiedUpi ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{t.copiedBtn}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{t.copyBtn}</span>
                </>
              )}
            </button>
          </div>

          <div className="text-center text-[11px] text-slate-400 mt-2">
            {t.payeeName}
          </div>
        </div>

        {/* QR Code Container */}
        {selectedPack && (
          <div className="mt-5 text-center p-4 bg-[#0e141d] border border-slate-800/80 rounded-xl">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
              <QrCode className="w-4 h-4" />
              <span>Instant Scan & Pay</span>
            </div>

            <div className="relative inline-block p-3 bg-white rounded-xl shadow-xl min-w-[190px] min-h-[190px]">
              {qrLoading || !qrDataUrl ? (
                <div className="w-44 h-44 sm:w-48 sm:h-48 flex flex-col items-center justify-center text-slate-700 text-xs gap-2">
                  <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                  <span className="font-medium">Generating QR...</span>
                </div>
              ) : (
                <>
                  <img
                    src={qrDataUrl}
                    alt={`PhonePe UPI QR Code for ₹${finalPrice}`}
                    className="w-44 h-44 sm:w-48 sm:h-48 mx-auto object-contain rounded-md"
                  />
                  {/* PhonePe badge overlay in the center of QR */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#5f259f] text-white text-[9px] font-bold px-2 py-0.5 rounded shadow border border-white">
                    PhonePe
                  </div>
                </>
              )}
            </div>

            <p className="text-xs text-slate-300 mt-2.5 max-w-xs mx-auto">
              {t.qrInstruction}
            </p>

            <div className="flex items-center justify-center gap-3 mt-3">
              <button
                type="button"
                onClick={handleDownloadQr}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.downloadQr}</span>
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons: PhonePe and UPI Link */}
        <div className="mt-5 space-y-2.5">
          <a
            href={upiUrl}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-[#5f259f] to-[#7836c2] hover:from-[#521e8c] hover:to-[#672ea8] shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2 transition-all cursor-pointer text-center group"
          >
            <span>{t.payWithPhonePe}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>

          <a
            href={upiUrl}
            className="w-full py-2.5 px-4 rounded-xl font-medium text-xs sm:text-sm text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-center"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.payWithAnyUpi} (Google Pay / Paytm / BHIM)</span>
          </a>
        </div>

        {/* Small security notice */}
        <div className="mt-4 flex items-start gap-2 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200/90">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            পেমেন্ট করার সময় কোনো রেফারেন্স টেক্সট পরিবর্তন করবেন না। পেমেন্ট শেষ হলে নিচে থাকা ১২ ডিজিটের UTR/Transaction ID লিখে অর্ডার সাবমিট করুন।
          </span>
        </div>
      </div>
    </section>
  );
};
