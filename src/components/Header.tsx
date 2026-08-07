import React from 'react';
import { useLanguage, Language } from '../context/LanguageContext';
import { useMemory } from '../context/MemoryContext';
import { Brain, CheckCircle, Eye, Type } from 'lucide-react';

export const Header: React.FC = () => {
  const { language, setLanguage, textScale, setTextScale, highContrast, setHighContrast, t } = useLanguage();
  const { memories } = useMemory();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#f7f9fb] border-b border-[#c3c6d1] flex justify-between items-center px-4 md:px-8 h-16 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#1b4d89] flex items-center justify-center text-white font-bold text-sm shadow-sm overflow-hidden">
          <span className="text-lg">🏛️</span>
        </div>
        <div>
          <h1 className="font-bold text-lg text-[#00366b] leading-none flex items-center gap-2">
            {t('brand.title')}
          </h1>
          <div className="flex items-center gap-1 text-[11px] text-[#424750] mt-0.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-[#035a00]"></span>
            {t('status.online')}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Verified Badge */}
        <div className="hidden md:flex items-center gap-1.5 bg-[#f2f4f6] px-3 py-1 rounded-full border border-[#c3c6d1] text-xs font-semibold text-[#424750]">
          <CheckCircle size={14} className="text-[#035a00]" />
          <span>{t('status.verified')}</span>
        </div>

        {/* Memory Active Badge */}
        <div className="hidden sm:flex items-center gap-1.5 bg-[#7C3AED]/10 px-3 py-1 rounded-full border border-[#7C3AED]/30 text-xs font-bold text-[#7C3AED]">
          <Brain size={14} />
          <span>🧠 {memories.length}</span>
        </div>

        {/* Accessibility Tools: Text Scale & High Contrast */}
        <div className="flex items-center gap-1 bg-[#eceef0] rounded-lg p-1 border border-[#c3c6d1]">
          <button
            onClick={() => setTextScale(textScale === 1.0 ? 1.2 : 1.0)}
            className={`p-1.5 rounded transition-colors text-xs font-bold ${
              textScale > 1.0 ? 'bg-[#1b4d89] text-white' : 'text-[#424750] hover:bg-[#e0e3e5]'
            }`}
            title="Toggle Text Size (1.2x Accessibility)"
          >
            <Type size={14} />
          </button>
          <button
            onClick={() => setHighContrast(!highContrast)}
            className={`p-1.5 rounded transition-colors text-xs font-bold ${
              highContrast ? 'bg-[#1b4d89] text-white' : 'text-[#424750] hover:bg-[#e0e3e5]'
            }`}
            title="Toggle High Contrast Mode"
          >
            <Eye size={14} />
          </button>
        </div>

        {/* Language Switcher */}
        <div className="flex items-center bg-[#eceef0] rounded-lg p-1 border border-[#c3c6d1] text-xs font-semibold text-[#424750]">
          {(['en', 'hi', 'mr'] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-2 py-1 rounded transition-all cursor-pointer ${
                language === lang
                  ? 'bg-[#1b4d89] text-white font-bold'
                  : 'hover:bg-[#e0e3e5] text-[#424750]'
              }`}
            >
              {lang === 'en' ? 'EN' : lang === 'hi' ? 'हिंदी' : 'मराठी'}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
