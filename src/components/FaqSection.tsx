import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle, ShieldCheck } from 'lucide-react';
import { Language } from '../types';
import { ADMIN_WHATSAPP } from '../data/packages';

interface FaqSectionProps {
  language: Language;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ language }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = language === 'bn' ? [
    {
      q: 'Free Fire Player UID কোথায় পাবো?',
      a: 'Free Fire গেম ওপেন করে আপনার বামদিকের ওপরের প্রোফাইল বা ব্যানারে ক্লিক করুন। প্রোফাইল পেইজের ওপর আপনার নামের নিচে একটি ৮-১২ ডিজিটের নম্বর (UID) দেখতে পাবেন, পাশে থাকা কপি আইকন দিয়ে সেটি কপি করে এখানে বসান।'
    },
    {
      q: 'টপ-আপ পেতে কতক্ষণ সময় লাগে?',
      a: 'WhatsApp-এ পেমেন্টের UTR নম্বর সহ অর্ডার পাঠানোর পর সাধারণতঃ ৫ থেকে ১৫ মিনিটের মধ্যে সরাসরি আপনার গেম একাউন্টে ডায়মন্ড যুক্ত হয়ে যায়।'
    },
    {
      q: 'PhonePe-তে UTR বা Transaction ID কিভাবে পাবো?',
      a: 'PhonePe অ্যাপের নিচের ডানদিকে থাকা "History" অপশনে গিয়ে করা পেমেন্টে ক্লিক করুন। স্ক্রিনে Transfer Details সেকশনে "UTR" বা "Bank Ref No." দেখতে পাবেন, যা ১২ সংখ্যার হয়ে থাকে।'
    },
    {
      q: 'এখানে টপ-আপ করা কি নিরাপদ?',
      a: 'হ্যাঁ, ১০০% নিরাপদ ও অফিসিয়াল মেথড। টপ-আপের জন্য কোনো পাসওয়ার্ড বা লগইন দিতে হয় না, শুধুমাত্র আপনার Player UID দিয়েই টপ-আপ সম্পন্ন হয়।'
    },
    {
      q: 'কোনো সমস্যা হলে কার সাথে যোগাযোগ করব?',
      a: 'যেকোনো সমস্যায় নিচে দেওয়া WhatsApp সাপোর্ট বাটনে ক্লিক করে সরাসরি এডমিনের সাথে চ্যাট করতে পারেন।'
    }
  ] : [
    {
      q: 'Where can I find my Free Fire Player UID?',
      a: 'Open Free Fire and tap your profile avatar on the top-left corner. Under your profile name, you will find your 8-12 digit numeric Player UID with a quick copy button.'
    },
    {
      q: 'How long does diamond delivery take?',
      a: 'Top-ups are typically credited within 5 to 15 minutes after submitting your payment verification on WhatsApp.'
    },
    {
      q: 'Where can I find the UTR / Transaction ID in PhonePe?',
      a: 'Open PhonePe, tap "History" at bottom-right, click on the successful transaction to MITHUN MAL, and locate the 12-digit UTR or Bank Ref No.'
    },
    {
      q: 'Is this 100% safe for my game account?',
      a: 'Yes, absolutely safe. We only require your in-game Player UID. We never ask for your game password or login credentials.'
    },
    {
      q: 'Who can I contact for support?',
      a: 'You can directly contact our WhatsApp admin support anytime by tapping the WhatsApp Support button below.'
    }
  ];

  return (
    <section className="mt-8 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm sm:text-base font-bold text-amber-400 flex items-center gap-2 font-heading">
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <span>{language === 'bn' ? 'সাধারণ জিজ্ঞাসা (FAQ)' : 'Frequently Asked Questions (FAQ)'}</span>
        </h3>

        <a
          href={`https://wa.me/${ADMIN_WHATSAPP}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-slate-950 bg-[#25d366] hover:bg-[#20ba5a] rounded-lg transition-colors cursor-pointer"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'সরাসরি সাপোর্ট' : 'Support'}</span>
        </a>
      </div>

      <div className="bg-[#141b25] border border-slate-800 rounded-xl divide-y divide-slate-800/80 overflow-hidden">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index} className="p-3 sm:p-4 transition-colors">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex items-center justify-between text-left text-xs sm:text-sm font-semibold text-slate-200 hover:text-white transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-2 ${
                    isOpen ? 'rotate-180 text-amber-400' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="mt-2 text-xs text-slate-400 leading-relaxed pl-1 pt-1 border-t border-slate-800/40">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Safety Notice Footer */}
      <div className="mt-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            {language === 'bn'
              ? 'আইডি ব্যান মুক্ত ও ১০০% লিগ্যাল টপ-আপ'
              : 'Safe, legal top-up with zero risk to game account'}
          </span>
        </div>
        <span className="font-mono text-slate-500">v2.4</span>
      </div>
    </section>
  );
};
