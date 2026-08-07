import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'hi' | 'mr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    'brand.name': 'BharatAI',
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.verify': 'Verify',
    'nav.profile': 'Unqualified',
    'form.title': 'Tell us about yourself',
    'form.subtitle': 'We need a few details to find the best government schemes for you.',
    'form.upload.title': 'Fast-track with Documents',
    'form.upload.subtitle': 'Upload a government ID (like Aadhaar or PAN) to pre-fill your profile automatically.',
    'form.upload.dropzone': 'Tap to upload or take a photo',
    'form.upload.hint': 'PDF, JPG, or PNG (Max 5MB)',
    'form.upload.or': 'Or fill manually',
    'form.age': 'Age',
    'form.age.placeholder': 'e.g. 35',
    'form.gender': 'Gender',
    'form.gender.select': 'Select Gender',
    'form.gender.male': 'Male',
    'form.gender.female': 'Female',
    'form.gender.other': 'Other',
    'form.state': 'State',
    'form.state.select': 'Select your state',
    'form.education': 'Education Level',
    'form.education.select': 'Select highest education',
    'form.income': 'Annual Family Income',
    'form.income.select': 'Select range',
    'form.category': 'Category',
    'form.category.select': 'Select category',
    'form.trust': 'Your data is used only to match schemes and is never stored on our servers.',
    'form.submit': 'Find My Schemes',
    'eligible.title': 'Recommended Government Schemes',
    'eligible.subtitle': 'Based on your verified profile details, you qualify for 3 major schemes.',
    'reasoning.title': 'BharatAI Matching Intelligence',
    'reasoning.subtitle': 'Transparency engine breakdown of why you qualified for these schemes.',
    'unqualified.title': 'Schemes You Didn\'t Qualify For',
    'unqualified.subtitle': 'Below are schemes where criteria weren\'t met, along with guidance.',
    'details.back': '← Back to Eligible Schemes',
    'details.apply': 'Proceed to Official Portal',
  },
  hi: {
    'brand.name': 'BharatAI',
    'nav.home': 'होम',
    'nav.services': 'सेवाएं',
    'nav.verify': 'सत्यापन',
    'nav.profile': 'अयोग्य योजनाएं',
    'form.title': 'अपने बारे में बताएं',
    'form.subtitle': 'आपके लिए सर्वोत्तम सरकारी योजनाएं खोजने के लिए हमें कुछ विवरण चाहिए।',
    'form.upload.title': 'दस्तावेजों के साथ तेजी से भरें',
    'form.upload.subtitle': 'अपनी प्रोफ़ाइल स्वचालित रूप से भरने के लिए एक सरकारी आईडी (जैसे आधार या पैन) अपलोड करें।',
    'form.upload.dropzone': 'अपलोड करने के लिए टैप करें या फोटो लें',
    'form.upload.hint': 'PDF, JPG, या PNG (अधिकतम 5MB)',
    'form.upload.or': 'या मैन्युअल रूप से भरें',
    'form.age': 'आयु',
    'form.age.placeholder': 'उदा. 35',
    'form.gender': 'लिंग',
    'form.gender.select': 'लिंग चुनें',
    'form.gender.male': 'पुरुष',
    'form.gender.female': 'महिला',
    'form.gender.other': 'अन्य',
    'form.state': 'राज्य',
    'form.state.select': 'अपना राज्य चुनें',
    'form.education': 'शिक्षा का स्तर',
    'form.education.select': 'उच्चतम शिक्षा चुनें',
    'form.income': 'वार्षिक पारिवारिक आय',
    'form.income.select': 'आय सीमा चुनें',
    'form.category': 'श्रेणी',
    'form.category.select': 'श्रेणी चुनें',
    'form.trust': 'आपका डेटा केवल योजनाओं के मिलान के लिए उपयोग किया जाता है और कभी भी सर्वर पर संग्रहीत नहीं किया जाता है।',
    'form.submit': 'मेरी योजनाएं खोजें',
    'eligible.title': 'अनुशंसित सरकारी योजनाएं',
    'eligible.subtitle': 'आपके सत्यापित विवरण के आधार पर, आप 3 प्रमुख योजनाओं के लिए पात्र हैं।',
    'reasoning.title': 'BharatAI मैचिंग इंटेलिजेंस',
    'reasoning.subtitle': 'पारदर्शिता इंजन: जानें कि आप इन योजनाओं के लिए क्यों पात्र हैं।',
    'unqualified.title': 'योजनाएं जिनके लिए आप पात्र नहीं हैं',
    'unqualified.subtitle': 'नीचे वे योजनाएं दी गई हैं जिनकी शर्तें पूरी नहीं हुईं, साथ ही मार्गदर्शन भी।',
    'details.back': '← योजनाओं पर वापस जाएं',
    'details.apply': 'आधिकारिक पोर्टल पर जाएं',
  },
  mr: {
    'brand.name': 'BharatAI',
    'nav.home': 'मुख्यपृष्ठ',
    'nav.services': 'सेवा',
    'nav.verify': 'तपासा',
    'nav.profile': 'अपात्र योजना',
    'form.title': 'तुमच्याबद्दल सांगा',
    'form.subtitle': 'योग्य सरकारी योजना शोधण्यासाठी आम्हाला काही माहिती हवी आहे.',
    'form.upload.title': 'कागदपत्रांसह जलद भरा',
    'form.upload.subtitle': 'तुमचे प्रोफाइल आपोआप भरण्यासाठी सरकारी ओळखपत्र (आधार किंवा पॅन) अपलोड करा.',
    'form.upload.dropzone': 'अपलोड करण्यासाठी टॅप करा किंवा फोटो घ्या',
    'form.upload.hint': 'PDF, JPG, किंवा PNG (कमाल 5MB)',
    'form.upload.or': 'किंवा स्वतः माहिती भरा',
    'form.age': 'वय',
    'form.age.placeholder': 'उदा. 35',
    'form.gender': 'लिंग',
    'form.gender.select': 'लिंग निवडा',
    'form.gender.male': 'पुरुष',
    'form.gender.female': 'स्त्री',
    'form.gender.other': 'इतर',
    'form.state': 'राज्य',
    'form.state.select': 'तुमचे राज्य निवडा',
    'form.education': 'शिक्षण',
    'form.education.select': 'उच्चतम शिक्षण निवडा',
    'form.income': 'वार्षिक कौटुंबिक उत्पन्न',
    'form.income.select': 'उत्पन्न गट निवडा',
    'form.category': 'प्रवर्ग',
    'form.category.select': 'प्रवर्ग निवडा',
    'form.trust': 'तुमचा डेटा फक्त योजना जुळवण्यासाठी वापरला जातो आणि सर्व्हरवर साठवला जात नाही.',
    'form.submit': 'माझ्या योजना शोधा',
    'eligible.title': 'शिफारस केलेल्या सरकारी योजना',
    'eligible.subtitle': 'तुमच्या माहितीच्या आधारे तुम्ही ३ प्रमुख योजनांसाठी पात्र आहात.',
    'reasoning.title': 'BharatAI मॅचिंग इंटेलिजन्स',
    'reasoning.subtitle': 'तुम्ही या योजनांसाठी का पात्र आहात याचे विश्लेषण.',
    'unqualified.title': 'ज्या योजनांसाठी तुम्ही अपात्र आहात',
    'unqualified.subtitle': 'अटी पूर्ण न झालेल्या योजना आणि पुढील मार्गदर्शन.',
    'details.back': '← योजनांकडे परत जा',
    'details.apply': 'अधिकृत पोर्टलवर जा',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
