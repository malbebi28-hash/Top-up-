import React, { useState } from 'react';
import { User, CheckCircle2, AlertCircle, Sparkles, Copy, Check } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/packages';

interface PlayerUidStepProps {
  language: Language;
  playerUid: string;
  onUidChange: (uid: string) => void;
  recentUids: string[];
}

export const PlayerUidStep: React.FC<PlayerUidStepProps> = ({
  language,
  playerUid,
  onUidChange,
  recentUids,
}) => {
  const t = TRANSLATIONS[language];
  const [copied, setCopied] = useState(false);

  // Free Fire UIDs are typically 8 to 12 numeric digits
  const isValid = playerUid.length >= 8 && playerUid.length <= 12 && /^\d+$/.test(playerUid);
  const hasInput = playerUid.length > 0;

  const handleCopy = () => {
    if (playerUid) {
      navigator.clipboard.writeText(playerUid);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-2.5">
        <h2 className="text-sm sm:text-base font-bold text-amber-400 flex items-center gap-2">
          <span className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center text-xs font-mono font-bold">
            1
          </span>
          <span>{t.step1Title}</span>
        </h2>
        <span className="text-[11px] text-slate-400">
          Server: <strong className="text-slate-200">India / BD (Official)</strong>
        </span>
      </div>

      <div className="bg-[#141b25] border border-slate-800 rounded-xl p-4 shadow-lg">
        <label htmlFor="playerUidInput" className="block text-xs font-medium text-slate-300 mb-2">
          Free Fire Player ID (UID)
        </label>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <User className="w-4 h-4 text-amber-400" />
          </div>
          <input
            id="playerUidInput"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={13}
            value={playerUid}
            onChange={(e) => onUidChange(e.target.value.replace(/\D/g, ''))}
            placeholder={t.uidPlaceholder}
            className="w-full pl-10 pr-24 py-3 bg-[#0d1218] border border-slate-700/80 rounded-lg text-white font-mono text-base placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 transition-all"
          />

          {hasInput && (
            <div className="absolute inset-y-0 right-2 flex items-center gap-1">
              <button
                type="button"
                onClick={handleCopy}
                className="p-1.5 text-xs text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded transition-colors cursor-pointer"
                title="Copy UID"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}
        </div>

        {/* Validation Feedback */}
        <div className="mt-2.5 flex items-center justify-between text-xs">
          {hasInput ? (
            isValid ? (
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {t.uidValid} ({playerUid.length} digits)
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-rose-400">
                <AlertCircle className="w-3.5 h-3.5" />
                {t.uidInvalid}
              </span>
            )
          ) : (
            <span className="text-slate-400">{t.uidHelper}</span>
          )}

          <span className="text-[11px] text-slate-500 font-mono">
            {playerUid.length}/12
          </span>
        </div>

        {/* Recently Used UIDs */}
        {recentUids.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-[11px] text-slate-400 flex items-center gap-1 shrink-0">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Recent:
            </span>
            <div className="flex gap-1.5">
              {recentUids.slice(0, 3).map((savedUid) => (
                <button
                  key={savedUid}
                  type="button"
                  onClick={() => onUidChange(savedUid)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                    playerUid === savedUid
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 border border-slate-700/40'
                  }`}
                >
                  {savedUid}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
