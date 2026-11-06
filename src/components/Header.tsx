import React from 'react';
import { Sparkles, Globe, History, ShieldCheck, Zap } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/packages';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  orderCount: number;
  onOpenHistory: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  orderCount,
  onOpenHistory,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <header className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl mb-6">
      {/* Background Hero Image with Dark Gradient Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_gaming_diamonds_1793946497801.jpg"
          alt="Free Fire Top-Up Store Banner"
          className="w-full h-full object-cover object-center opacity-30"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f17]/60 via-[#0b0f17]/85 to-[#0f1522]" />
      </div>

      <div className="relative z-10 p-5 md:p-7">
        {/* Top utility row: Status, Language Switcher & Order History */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-lg backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>24/7 Instant Delivery</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Order History Button */}
            <button
              onClick={onOpenHistory}
              className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/60 transition-all cursor-pointer backdrop-blur-sm"
              title={t.orderHistory}
            >
              <History className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">{t.orderHistory}</span>
              {orderCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 bg-amber-500 text-slate-950 text-[10px] font-bold rounded-full">
                  {orderCount}
                </span>
              )}
            </button>

            {/* Language Selector */}
            <button
              onClick={() => onLanguageChange(language === 'bn' ? 'en' : 'bn')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800/80 hover:bg-slate-700/80 text-amber-300 border border-amber-500/30 transition-all cursor-pointer backdrop-blur-sm"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>
          </div>
        </div>

        {/* Main Brand Title & Offer Banner */}
        <div className="text-center max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold tracking-wider uppercase mb-3">
            <Zap className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
            <span>Official PhonePe UPI Top-Up</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white uppercase drop-shadow-md font-heading">
            <span className="text-amber-400">Free Fire</span> Top-Up Store
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
            {t.tagline}
          </p>

          {/* Discount Ribbon */}
          <div className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 text-slate-950 px-4 py-1.5 rounded-full font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-500/20">
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>{t.flatDiscountBadge}</span>
          </div>

          {/* Trust Guarantees */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              100% Safe UID Delivery
            </span>
            <span>·</span>
            <span>PhonePe & Direct UPI</span>
            <span>·</span>
            <span className="text-amber-300 font-medium">Delivery: 5-15 Mins</span>
          </div>
        </div>
      </div>
    </header>
  );
};
