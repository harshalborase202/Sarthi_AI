import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'hi' | 'mr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  textScale: number;
  setTextScale: (scale: number) => void;
  highContrast: boolean;
  setHighContrast: (contrast: boolean) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    'brand.title': 'SarkarSaathi',
    'brand.tagline': 'AI Government Guide',
    'nav.chat': 'Chat',
    'nav.schemes': 'Schemes',
    'nav.memory': 'Memory',
    'nav.profile': 'Profile',
    'nav.sources': 'Verified Sources',
    'status.online': 'Online',
    'status.verified': 'Sources Verified',
    'status.memory': 'Memory Active',
    'chat.placeholder': 'Ask SarkarSaathi about any scheme or policy...',
    'chat.send': 'Send',
    'memory.title': 'Memory Dashboard',
    'memory.subtitle': 'Review, edit, or clear what SarkarSaathi remembers about you. You are in control.',
    'memory.longterm': 'Long-term Scope',
    'memory.session': 'Session Only',
    'memory.forget': 'Forget This',
    'memory.clearall': 'Forget Everything',
    'memory.activity': 'Activity Log',
  },
  hi: {
    'brand.title': 'सरकारसाथी',
    'brand.tagline': 'एआई सरकारी गाइड',
    'nav.chat': 'चैट',
    'nav.schemes': 'योजनाएं',
    'nav.memory': 'मेमोरी',
    'nav.profile': 'प्रोफ़ाइल',
    'nav.sources': 'सत्यापित स्रोत',
    'status.online': 'ऑनलाइन',
    'status.verified': 'स्रोत सत्यापित',
    'status.memory': 'मेमोरी सक्रिय',
    'chat.placeholder': 'सरकारसाथी से किसी भी योजना के बारे में पूछें...',
    'chat.send': 'भेजें',
    'memory.title': 'मेमोरी डैशबोर्ड',
    'memory.subtitle': 'समीक्षा करें, संपादित करें या हटाएं कि सरकारसाथी आपके बारे में क्या याद रखता है।',
    'memory.longterm': 'दीर्घकालिक दायरा',
    'memory.session': 'केवल सत्र के लिए',
    'memory.forget': 'इसे हटाएं',
    'memory.clearall': 'सब कुछ भूल जाएं',
    'memory.activity': 'गतिविधि लॉग',
  },
  mr: {
    'brand.title': 'सरकारसाथी',
    'brand.tagline': 'एआय शासकीय मार्गदर्शक',
    'nav.chat': 'चॅट',
    'nav.schemes': 'योजना',
    'nav.memory': 'मेमरी',
    'nav.profile': 'प्रोफाइल',
    'nav.sources': 'प्रमाणित स्रोत',
    'status.online': 'ऑनलाइन',
    'status.verified': 'स्रोत प्रमाणित',
    'status.memory': 'मेमरी सक्रिय',
    'chat.placeholder': 'शासकीय योजनांबद्दल सरकारसाथीला विचारा...',
    'chat.send': 'पाठवा',
    'memory.title': 'मेमरी डैशबोर्ड',
    'memory.subtitle': 'सरकारसाथी तुमच्याबद्दल काय लक्षात ठेवते ते तपासा आणि नियंत्रित करा.',
    'memory.longterm': 'दीर्घकालीन मेमरी',
    'memory.session': 'फक्त या सत्रासाठी',
    'memory.forget': 'हटवा',
    'memory.clearall': 'सर्व हटवा',
    'memory.activity': 'कृती नोंद',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [textScale, setTextScale] = useState<number>(1.0);
  const [highContrast, setHighContrast] = useState<boolean>(false);

  const t = (key: string): string => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      textScale, 
      setTextScale, 
      highContrast, 
      setHighContrast, 
      t 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
