import React from 'react';
import { useLanguage, Language } from '../context/LanguageContext';

export const Header: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-8 h-16 bg-[#f7f9fb] border-b border-[#c4c6cf] shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#002045] flex items-center justify-center text-white font-bold text-sm shadow-sm overflow-hidden">
          <img 
            alt="BharatAI Logo" 
            className="h-8 w-8 object-contain rounded-full" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAL95W4zkFWQunnfZsB_b181GOM95H-1DDDy3at2OXkVUINywRzLdn0TkriEe1pI8AoJ7Tic-_dFDrB9u9dkbO8U3l1m0boFCqguQPuIeVEdcNwsbXkZHeCc9UU28aM6AwLaw34dQSQL66S9_fFtc2f9XgTr11FILnMmvjtQcnE_5ecIgLOFPLkmrp3rgEGZ-LlYq4-oN-uKDvrtqsEPiPGuKtXcRxmJgQkgvu-SzwJ8mdNU7wVrmq3"
            onError={(e) => {
              // fallback if image blocked
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <span className="hidden">🇮🇳</span>
        </div>
        <span className="text-xl font-bold text-[#002045]">BharatAI</span>
      </div>

      <div className="flex items-center bg-[#eceef0] rounded px-2 py-1 border border-[#c4c6cf] text-xs font-semibold text-[#43474e]">
        {(['en', 'hi', 'mr'] as Language[]).map((lang) => (
          <button
            key={lang}
            onClick={() => setLanguage(lang)}
            className={`px-2 py-1 rounded transition-all cursor-pointer ${
              language === lang
                ? 'bg-[#002045] text-white font-bold'
                : 'hover:bg-[#e6e8ea] text-[#43474e]'
            }`}
          >
            {lang === 'en' ? 'EN' : lang === 'hi' ? 'हिंदी' : 'मराठी'}
          </button>
        ))}
      </div>
    </header>
  );
};
