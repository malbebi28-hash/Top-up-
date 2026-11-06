import React, { useState } from 'react';
import { DiamondPack, Language } from '../types';
import { PACKAGES, TRANSLATIONS, DISCOUNT_PERCENT } from '../data/packages';
import { Gem, Check, Crown, Flame } from 'lucide-react';

interface PackSelectorProps {
  language: Language;
  selectedPack: DiamondPack | null;
  onSelectPack: (pack: DiamondPack) => void;
}

export const PackSelector: React.FC<PackSelectorProps> = ({
  language,
  selectedPack,
  onSelectPack,
}) => {
  const t = TRANSLATIONS[language];
  const [activeCategory, setActiveCategory] = useState<'all' | 'diamonds' | 'membership'>('all');

  const filteredPacks = PACKAGES.filter((pack) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'diamonds') return pack.category === 'diamonds';
    if (activeCategory === 'membership') return pack.category === 'membership' || pack.category === 'special';
    return true;
  });

  return (
    <section className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <h2 className="text-sm sm:text-base font-bold text-amber-400 flex items-center gap-2">
          <span className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center text-xs font-mono font-bold">
            2
          </span>
          <span>{t.step2Title}</span>
        </h2>

        {/* Category Tabs */}
        <div className="flex items-center gap-1 p-1 bg-[#141b25] border border-slate-800 rounded-lg self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-all cursor-pointer whitespace-nowrap ${
              activeCategory === 'all'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.catAll}
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('diamonds')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-all cursor-pointer whitespace-nowrap ${
              activeCategory === 'diamonds'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.catDiamonds}
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('membership')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-all cursor-pointer whitespace-nowrap ${
              activeCategory === 'membership'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.catMemberships}
          </button>
        </div>
      </div>

      {/* Packs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
        {filteredPacks.map((pack) => {
          const discount = pack.originalPrice * (DISCOUNT_PERCENT / 100);
          const finalPrice = (pack.originalPrice - discount).toFixed(2);
          const isSelected = selectedPack?.id === pack.id;

          return (
            <div
              key={pack.id}
              onClick={() => onSelectPack(pack)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectPack(pack);
                }
              }}
              className={`relative group rounded-xl p-3.5 text-center transition-all duration-200 cursor-pointer select-none flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-b from-[#241e12] to-[#1a1c22] border-2 border-amber-400 shadow-lg shadow-amber-500/10 scale-[1.01]'
                  : 'bg-[#141b25] hover:bg-[#18212e] border border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Discount Tag */}
              <div className="absolute -top-2 -right-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-sm flex items-center gap-0.5">
                <span>{DISCOUNT_PERCENT}% OFF</span>
              </div>

              {/* Special Badge if any */}
              {pack.badge && (
                <div className="absolute -top-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-800 border border-slate-700 text-amber-300">
                  {pack.badge}
                </div>
              )}

              {/* Icon & Diamonds Name */}
              <div className="pt-1.5 pb-2">
                <div className="w-9 h-9 mx-auto mb-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                  {pack.category === 'membership' ? (
                    <Crown className="w-5 h-5 text-amber-400" />
                  ) : pack.popular ? (
                    <Flame className="w-5 h-5 text-orange-400" />
                  ) : (
                    <Gem className="w-5 h-5 text-cyan-400" />
                  )}
                </div>

                <div className="text-sm sm:text-base font-bold text-white font-heading leading-tight line-clamp-1">
                  {pack.name}
                </div>
              </div>

              {/* Price Details */}
              <div className="pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-center gap-1.5">
                  <span className="text-xs text-slate-400 line-through font-mono-numbers">
                    ₹{pack.originalPrice}
                  </span>
                  <span className="text-base sm:text-lg font-extrabold text-emerald-400 font-mono-numbers">
                    ₹{finalPrice}
                  </span>
                </div>

                <div className="text-[10px] text-slate-400 mt-0.5">
                  Save ₹{discount.toFixed(2)}
                </div>
              </div>

              {/* Selected Indicator Checkmark */}
              {isSelected && (
                <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
