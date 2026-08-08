import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Globe, Info, User, LogOut } from 'lucide-react';
import { translations } from '../data/translations';
import Auth from './Auth';

export default function Header({ language, setLanguage, onReset, currentScreen, setScreen }) {
  const navigate = useNavigate();
  const t = translations[language] || translations.EN;
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [userSession, setUserSession] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('sarthi_user');
      if (stored) {
        setUserSession(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Session load error:', e);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('sarthi_user');
    setUserSession(null);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-8 h-16 bg-surface dark:bg-surface-container-low border-b border-outline-variant shadow-sm">
      
      {/* Brand Title & Subtitle */}
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

      {/* Top Right Header Controls (Log In Button ON LEFT of Language Selector, matching myScheme.gov.in) */}
      <div className="flex items-center gap-3">
        
        {/* User Auth Session / Log In Button (POSITIONED ON THE LEFT) */}
        {userSession ? (
          <div className="flex items-center gap-1.5 bg-surface-container-high text-primary border border-outline-variant/60 px-3 py-1 rounded-xl text-xs font-bold shadow-sm">
            <User className="w-3.5 h-3.5 text-saffron" />
            <span className="truncate max-w-[110px]">{userSession.name}</span>
            <button
              onClick={handleLogout}
              className="ml-1 text-on-surface-variant hover:text-rose-600 transition-colors cursor-pointer"
              title="Log Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAuthModal(true)}
            className="px-3.5 py-1.5 bg-primary hover:bg-primary-container text-white font-extrabold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <User className="w-3.5 h-3.5 text-saffron" />
            <span>Log In</span>
          </button>
        )}

        {/* Multilingual Selector Toggle (POSITIONED ON THE RIGHT) */}
        <div className="flex items-center bg-surface-container rounded-lg p-1 border border-outline-variant text-xs font-semibold">
          <Globe className="w-4 h-4 text-on-surface-variant ml-1 mr-1.5" />
          <button
            onClick={() => setLanguage('EN')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              language === 'EN'
                ? 'bg-primary text-white shadow-sm font-bold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('HI')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              language === 'HI'
                ? 'bg-primary text-white shadow-sm font-bold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            हिंदी
          </button>
          <button
            onClick={() => setLanguage('MR')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              language === 'MR'
                ? 'bg-primary text-white shadow-sm font-bold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            मराठी
          </button>
        </div>

      </div>

      {/* Auth Modal Overlay */}
      {showAuthModal && (
        <Auth
          language={language}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={(session, newProfile) => {
            setUserSession(session);
            if (setScreen) setScreen('authenticated', newProfile);
          }}
        />
      )}
    </header>
  );
}
