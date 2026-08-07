import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Globe, Sparkles, Info } from 'lucide-react';
import { translations } from '../data/translations';

export default function Header({ language, setLanguage, onReset, currentScreen, setScreen }) {
  const navigate = useNavigate();
  const t = translations[language] || translations.EN;

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-8 h-16 bg-surface dark:bg-surface-container-low border-b border-outline-variant shadow-sm">
      <div 
        className="flex items-center gap-3 cursor-pointer select-none"
        onClick={onReset}
      >
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-md">
          <ShieldCheck className="w-6 h-6 text-saffron" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-bold tracking-tight text-primary dark:text-primary-fixed">{t.appTitle}</span>
            <span 
              onClick={(e) => { e.stopPropagation(); navigate('/'); }}
              className="bg-saffron/15 hover:bg-saffron/30 text-saffron text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
              title="Click to view Informational Landing Page"
            >
              <Info className="w-3 h-3" /> Info Page
            </span>
          </div>
          <p className="text-[11px] text-on-surface-variant hidden sm:block font-medium leading-none mt-0.5">
            {t.appSubtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Ask AI Chatbot Button */}
        <button
          onClick={() => navigate('/chatbot')}
          className="hidden sm:flex items-center gap-1.5 bg-primary/10 hover:bg-primary/20 text-primary dark:text-primary-fixed border border-primary/20 font-bold text-xs px-3 py-1.5 rounded-lg transition-all shadow-sm active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5 text-saffron animate-pulse" />
          <span>Ask AI Chatbot</span>
        </button>

        {/* Language Selector Toggle */}
        <div className="flex items-center bg-surface-container rounded-lg p-1 border border-outline-variant text-xs font-semibold">
          <Globe className="w-4 h-4 text-on-surface-variant ml-1 mr-1.5" />
          <button
            onClick={() => setLanguage('EN')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              language === 'EN'
                ? 'bg-primary text-white shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('HI')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              language === 'HI'
                ? 'bg-primary text-white shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            हिंदी
          </button>
          <button
            onClick={() => setLanguage('MR')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              language === 'MR'
                ? 'bg-primary text-white shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            मराठी
          </button>
        </div>
      </div>
    </header>
  );
}
