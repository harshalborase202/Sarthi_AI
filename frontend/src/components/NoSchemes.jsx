import React from 'react';
import { SearchX, RefreshCw, HelpCircle, ArrowLeft } from 'lucide-react';
import { translations } from '../data/translations';

export default function NoSchemes({ onReset, language }) {
  const t = translations[language] || translations.EN;

  return (
    <div className="w-full max-w-2xl mx-auto pt-8 pb-16 px-4 text-center space-y-6">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-8 shadow-lg space-y-6">
        
        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-600 border border-amber-200">
          <SearchX className="w-10 h-10" />
        </div>

        <div className="space-y-2 max-w-md mx-auto">
          <h2 className="text-2xl font-extrabold text-on-surface">{t.noSchemesTitle}</h2>
          <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">{t.noSchemesDesc}</p>
        </div>

        <div className="p-4 bg-surface-container-low rounded-2xl text-xs text-left text-on-surface-variant space-y-2 border border-outline-variant/50">
          <div className="font-bold text-on-surface flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-primary" /> Suggested Profile Adjustments:
          </div>
          <ul className="list-disc list-inside space-y-1 pl-1">
            <li>Verify if family income was entered correctly in Indian Rupees.</li>
            <li>Select "Other State / UT" if seeking pan-India central schemes.</li>
            <li>Explore general category options for unreserved scheme grants.</li>
          </ul>
        </div>

        <button
          onClick={onReset}
          className="py-3.5 px-8 bg-primary hover:bg-primary-container text-white font-bold text-sm rounded-xl shadow-md inline-flex items-center gap-2 transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>{t.resetProfile}</span>
        </button>

      </div>
    </div>
  );
}
