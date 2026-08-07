import React from 'react';
import { ShieldCheck, Globe, Sparkles } from 'lucide-react';
import { translations } from '../data/translations';

export default function Header({ language, setLanguage, onReset, currentScreen, setScreen }) {
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
            <span className="bg-saffron/15 text-saffron text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> BharatAI
            </span>
          </div>
          <p className="text-[11px] text-on-surface-variant hidden sm:block">Government Scheme Navigator & Decision Visualizer</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {currentScreen !== 'profile' && (
          <button
            onClick={() => setScreen('profile')}
            className="text-xs font-semibold text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20 transition-all hidden sm:block"
          >
            {t.editProfile}
          </button>
        )}

        {/* Language Switcher Segmented Control */}
        <div className="flex items-center bg-surface-container-high p-1 rounded-lg border border-outline-variant/60">
          <Globe className="w-4 h-4 text-outline ml-1 mr-1 hidden sm:block" />
          {['EN', 'HI', 'MR'].map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                language === lang
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              {lang === 'EN' ? 'EN' : lang === 'HI' ? 'हिंदी' : 'मराठी'}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
