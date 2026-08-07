import React, { useState } from 'react';
import { Header } from './components/Header';
import { useLanguage } from './context/LanguageContext';

export type ViewState = 'form' | 'eligible' | 'detail' | 'reasoning' | 'unqualified';

export interface Scheme {
  id: string;
  name: string;
  category: string;
  type: string;
  benefit: string;
  benefitDesc: string;
  eligibility: string;
  documents: string[];
  status: string;
  matchScore: string;
}

const sampleSchemes: Scheme[] = [
  {
    id: 'pm-kisan',
    name: 'PM-KISAN Samman Nidhi',
    category: 'Agriculture & Farmer Welfare',
    type: 'Central Sector Scheme',
    benefit: '₹6,000 / year',
    benefitDesc: 'Direct income support of ₹6,000 per year paid in three equal installments to small & marginal farmers.',
    eligibility: 'Landholding farmer families with cultivable land up to 2 hectares and annual family income within limits.',
    documents: ['Aadhaar Card', 'Land Ownership Records (7/12 extract)', 'Bank Account Details', 'e-KYC Verification'],
    status: 'Eligible',
    matchScore: '98% Match'
  },
  {
    id: 'ayushman-bharat',
    name: 'Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (PM-JAY)',
    category: 'Healthcare & Insurance',
    type: 'Centrally Sponsored Scheme',
    benefit: '₹5 Lakhs coverage / family',
    benefitDesc: 'Free health insurance cover of up to ₹5,000,000 per family per year for secondary and tertiary care hospitalization.',
    eligibility: 'Families listed in SECC 2011 database, low-income households, and designated informal sector workers.',
    documents: ['Aadhaar Card / Ration Card', 'Income Certificate', 'Mobile Number linked with Aadhaar'],
    status: 'Eligible',
    matchScore: '95% Match'
  },
  {
    id: 'pm-awaya-yojana',
    name: 'Pradhan Mantri Awas Yojana (PMAY-U / Gramin)',
    category: 'Housing & Urban Poverty Alleviation',
    type: 'Credit Linked Subsidy Scheme',
    benefit: 'Up to ₹2.67 Lakhs subsidy',
    benefitDesc: 'Interest subsidy on housing loans for construction or purchase of first pucca home for EWS/LIG families.',
    eligibility: 'Family must not own a pucca house in India; annual income up to ₹3 Lakhs (EWS) or ₹6 Lakhs (LIG).',
    documents: ['Salary Slip / Income Proof', 'Property Registration Papers', 'Aadhaar Card & PAN Card', 'Affidavit of No Pucca House'],
    status: 'Eligible',
    matchScore: '89% Match'
  }
];

const ineligibleSchemes = [
  {
    name: 'PM National Apprenticeship Promotion Scheme (NAPS)',
    reason: 'Age limit criteria (Max 30 years). Your entered age exceeds the scheme limit by 5 years.',
    fixHint: 'Explore Skill India training modules or MUDRA loan schemes suitable for mature entrepreneurs.'
  },
  {
    name: 'Post-Matric Scholarship for SC/ST Students',
    reason: 'Annual family income threshold exceeded (Max ₹2.5 Lakhs).',
    fixHint: 'Consider National Overseas Scholarship or Higher Education Credit Guarantee schemes.'
  }
];

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('form');
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>('pm-kisan');
  const [isScanningDoc, setIsScanningDoc] = useState<boolean>(false);
  const [scannedDocName, setScannedDocName] = useState<string>('');
  
  // Form State
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [education, setEducation] = useState<string>('');
  const [income, setIncome] = useState<string>('');
  const [category, setCategory] = useState<string>('');

  const { t } = useLanguage();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScannedDocName(file.name);
      setIsScanningDoc(true);
      setTimeout(() => {
        setIsScanningDoc(false);
        // Pre-fill fields automatically from OCR simulation
        setAge('35');
        setGender('male');
        setState('maharashtra');
        setEducation('higher_secondary');
        setIncome('1_2.5L');
        setCategory('obc');
      }, 1500);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentView('eligible');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectedScheme = sampleSchemes.find(s => s.id === selectedSchemeId) || sampleSchemes[0];

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] min-h-screen flex flex-col font-sans antialiased">
      <Header />

      {/* Main Content Area */}
      <main className="flex-grow pt-[80px] pb-[96px] md:pb-[40px] px-4 md:px-8 flex justify-center items-start overflow-y-auto">
        
        {/* VIEW 1: Profile Input with Document Upload */}
        {currentView === 'form' && (
          <div className="w-full max-w-2xl bg-white border border-[#c4c6cf] shadow-sm p-6 md:p-8 mt-2 rounded-lg">
            <div className="mb-6 text-center">
              <h1 className="text-2xl md:text-3xl font-bold text-[#191c1e] mb-2">{t('form.title')}</h1>
              <p className="text-sm md:text-base text-[#43474e]">{t('form.subtitle')}</p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              {/* Document Fast-Track Upload Section */}
              <div className="flex flex-col gap-3 mb-4 p-4 bg-[#f2f4f6] rounded-lg border border-[#c4c6cf]">
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-bold text-[#191c1e]">{t('form.upload.title')}</h3>
                  <p className="text-xs text-[#43474e]">{t('form.upload.subtitle')}</p>
                </div>

                <div className="relative border-2 border-dashed border-[#74777f] rounded-lg p-6 bg-white flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-[#eceef0] transition-colors text-center">
                  <input 
                    type="file" 
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <span className="material-symbols-outlined text-[36px] text-[#1a365d]">cloud_upload</span>
                  <div>
                    {isScanningDoc ? (
                      <div className="flex items-center gap-2 text-sm font-bold text-[#002045]">
                        <span className="animate-spin material-symbols-outlined text-lg">sync</span>
                        Scanning {scannedDocName} via AI OCR...
                      </div>
                    ) : scannedDocName ? (
                      <p className="text-sm font-bold text-emerald-700 flex items-center justify-center gap-1">
                        <span className="material-symbols-outlined text-base">check_circle</span>
                        Verified & Auto-filled from {scannedDocName}!
                      </p>
                    ) : (
                      <>
                        <p className="text-sm font-bold text-[#191c1e]">{t('form.upload.dropzone')}</p>
                        <p className="text-xs text-[#43474e]">{t('form.upload.hint')}</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 py-1">
                  <div className="flex-grow h-px bg-[#c4c6cf]"></div>
                  <span className="text-xs font-semibold text-[#74777f] uppercase tracking-wider">{t('form.upload.or')}</span>
                  <div className="flex-grow h-px bg-[#c4c6cf]"></div>
                </div>
              </div>

              {/* Age & Gender Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-[#191c1e] flex items-center justify-between" htmlFor="age">
                    <span>{t('form.age')}</span>
                    <span className="material-symbols-outlined text-base text-[#74777f] cursor-pointer" title="Determines which age-based schemes apply to you.">info</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#74777f]">
                      <span className="material-symbols-outlined text-xl">calendar_month</span>
                    </span>
                    <input 
                      id="age"
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder={t('form.age.placeholder')}
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-[#f7f9fb] border border-[#c4c6cf] rounded-lg text-sm text-[#191c1e] focus:outline-none focus:ring-2 focus:ring-[#fe9832] transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-[#191c1e]" htmlFor="gender">{t('form.gender')}</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#74777f]">
                      <span className="material-symbols-outlined text-xl">wc</span>
                    </span>
                    <select 
                      id="gender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      required
                      className="w-full pl-10 pr-8 py-2.5 bg-[#f7f9fb] border border-[#c4c6cf] rounded-lg text-sm text-[#191c1e] focus:outline-none focus:ring-2 focus:ring-[#fe9832] cursor-pointer"
                    >
                      <option value="" disabled>{t('form.gender.select')}</option>
                      <option value="male">{t('form.gender.male')}</option>
                      <option value="female">{t('form.gender.female')}</option>
                      <option value="other">{t('form.gender.other')}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* State */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#191c1e]" htmlFor="state">{t('form.state')}</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#74777f]">
                    <span className="material-symbols-outlined text-xl">map</span>
                  </span>
                  <select 
                    id="state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                    className="w-full pl-10 pr-8 py-2.5 bg-[#f7f9fb] border border-[#c4c6cf] rounded-lg text-sm text-[#191c1e] focus:outline-none focus:ring-2 focus:ring-[#fe9832] cursor-pointer"
                  >
                    <option value="" disabled>{t('form.state.select')}</option>
                    <option value="maharashtra">Maharashtra</option>
                    <option value="delhi">Delhi</option>
                    <option value="karnataka">Karnataka</option>
                    <option value="gujarat">Gujarat</option>
                  </select>
                </div>
              </div>

              {/* Education Level */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#191c1e]" htmlFor="education">{t('form.education')}</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#74777f]">
                    <span className="material-symbols-outlined text-xl">school</span>
                  </span>
                  <select 
                    id="education"
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    required
                    className="w-full pl-10 pr-8 py-2.5 bg-[#f7f9fb] border border-[#c4c6cf] rounded-lg text-sm text-[#191c1e] focus:outline-none focus:ring-2 focus:ring-[#fe9832] cursor-pointer"
                  >
                    <option value="" disabled>{t('form.education.select')}</option>
                    <option value="none">No formal education</option>
                    <option value="primary">Primary (up to 5th)</option>
                    <option value="secondary">Secondary (up to 10th)</option>
                    <option value="higher_secondary">Higher Secondary (12th)</option>
                    <option value="graduate">Graduate</option>
                  </select>
                </div>
              </div>

              {/* Income & Category Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-[#191c1e] flex items-center justify-between" htmlFor="income">
                    <span>{t('form.income')}</span>
                    <span className="material-symbols-outlined text-base text-[#74777f] cursor-pointer" title="Used to check income-based eligibility limits.">info</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#74777f]">
                      <span className="material-symbols-outlined text-xl">currency_rupee</span>
                    </span>
                    <select 
                      id="income"
                      value={income}
                      onChange={(e) => setIncome(e.target.value)}
                      required
                      className="w-full pl-10 pr-8 py-2.5 bg-[#f7f9fb] border border-[#c4c6cf] rounded-lg text-sm text-[#191c1e] focus:outline-none focus:ring-2 focus:ring-[#fe9832] cursor-pointer"
                    >
                      <option value="" disabled>{t('form.income.select')}</option>
                      <option value="0_1L">Up to ₹1 Lakh</option>
                      <option value="1_2.5L">₹1 Lakh - ₹2.5 Lakhs</option>
                      <option value="2.5_5L">₹2.5 Lakhs - ₹5 Lakhs</option>
                      <option value="5_8L">₹5 Lakhs - ₹8 Lakhs</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-[#191c1e] flex items-center justify-between" htmlFor="category">
                    <span>{t('form.category')}</span>
                    <span className="material-symbols-outlined text-base text-[#74777f] cursor-pointer" title="Some schemes reserve slots or have different income limits by category.">info</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#74777f]">
                      <span className="material-symbols-outlined text-xl">group</span>
                    </span>
                    <select 
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                      className="w-full pl-10 pr-8 py-2.5 bg-[#f7f9fb] border border-[#c4c6cf] rounded-lg text-sm text-[#191c1e] focus:outline-none focus:ring-2 focus:ring-[#fe9832] cursor-pointer"
                    >
                      <option value="" disabled>{t('form.category.select')}</option>
                      <option value="open">General / Open</option>
                      <option value="obc">OBC</option>
                      <option value="sc">SC</option>
                      <option value="st">ST</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Trust Note */}
              <div className="flex items-start gap-3 p-3 bg-[#f7f9fb] rounded-lg border border-[#c4c6cf] mt-2">
                <span className="material-symbols-outlined text-[#002045] text-xl mt-0.5">shield_lock</span>
                <p className="text-xs text-[#43474e] leading-relaxed">{t('form.trust')}</p>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button 
                  type="submit" 
                  className="w-full flex items-center justify-center gap-2 bg-[#1a365d] text-white font-bold py-3.5 px-6 rounded-lg hover:bg-[#002045] transition-all shadow-sm active:scale-[0.99]"
                >
                  <span className="material-symbols-outlined text-xl">search</span>
                  {t('form.submit')}
                </button>
              </div>

            </form>
          </div>
        )}

        {/* VIEW 2: Eligible Schemes */}
        {currentView === 'eligible' && (
          <div className="w-full max-w-3xl space-y-4">
            <div className="bg-white p-6 rounded-lg border border-[#c4c6cf] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-[#191c1e]">{t('eligible.title')}</h1>
                <p className="text-xs md:text-sm text-[#43474e] mt-1">{t('eligible.subtitle')}</p>
              </div>
              <span className="bg-[#024000] text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                <span className="material-symbols-outlined text-base">verified</span> Verified Matches
              </span>
            </div>

            <div className="space-y-4">
              {sampleSchemes.map((s) => (
                <div key={s.id} className="bg-white border border-[#c4c6cf] rounded-lg p-5 shadow-sm hover:border-[#fe9832] transition-all">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <span className="text-xs font-semibold px-2.5 py-1 bg-[#eceef0] text-[#002045] rounded-full">{s.category}</span>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">{s.matchScore}</span>
                  </div>
                  <h2 className="text-lg font-bold text-[#002045] mb-1">{s.name}</h2>
                  <p className="text-sm font-semibold text-[#8f4e00] mb-2">{s.benefit}</p>
                  <p className="text-xs md:text-sm text-[#43474e] mb-4">{s.benefitDesc}</p>
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#c4c6cf]">
                    <span className="text-xs text-[#74777f]">{s.type}</span>
                    <button 
                      onClick={() => {
                        setSelectedSchemeId(s.id);
                        setCurrentView('detail');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-xs font-bold text-[#002045] hover:text-[#8f4e00] flex items-center gap-1"
                    >
                      View Scheme Details & Apply <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: Scheme Detail */}
        {currentView === 'detail' && (
          <div className="w-full max-w-2xl bg-white border border-[#c4c6cf] rounded-lg p-6 md:p-8 shadow-sm space-y-6">
            <button 
              onClick={() => setCurrentView('eligible')}
              className="text-xs font-bold text-[#002045] hover:underline flex items-center gap-1"
            >
              {t('details.back')}
            </button>

            <div>
              <span className="text-xs font-bold px-3 py-1 bg-[#1a365d] text-white rounded-full">{selectedScheme.category}</span>
              <h1 className="text-2xl font-bold text-[#002045] mt-3">{selectedScheme.name}</h1>
              <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <span className="text-xs text-amber-800 uppercase font-bold tracking-wider">Key Benefit</span>
                <p className="text-lg font-bold text-amber-900">{selectedScheme.benefit}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-[#191c1e]">Eligibility Criteria Matched</h3>
              <p className="text-xs md:text-sm text-[#43474e] bg-[#f7f9fb] p-3 rounded-lg border border-[#c4c6cf] leading-relaxed">
                {selectedScheme.eligibility}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-[#191c1e]">Required Documents Checklist</h3>
              <ul className="space-y-2">
                {selectedScheme.documents.map((doc, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs md:text-sm text-[#191c1e]">
                    <span className="material-symbols-outlined text-emerald-600 text-base">check_circle</span>
                    {doc}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-[#c4c6cf]">
              <button 
                onClick={() => alert(`Redirecting to official government portal for ${selectedScheme.name}...`)}
                className="w-full py-3 bg-[#fe9832] text-[#683700] hover:bg-[#8f4e00] hover:text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                {t('details.apply')}
                <span className="material-symbols-outlined text-lg">open_in_new</span>
              </button>
            </div>
          </div>
        )}

        {/* VIEW 4: AI Reasoning / Matching Intelligence */}
        {currentView === 'reasoning' && (
          <div className="w-full max-w-2xl bg-white border border-[#c4c6cf] rounded-lg p-6 md:p-8 shadow-sm space-y-6">
            <div className="border-b border-[#c4c6cf] pb-4">
              <h1 className="text-xl font-bold text-[#002045] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#8f4e00]">psychology</span>
                {t('reasoning.title')}
              </h1>
              <p className="text-xs text-[#43474e] mt-1">{t('reasoning.subtitle')}</p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-[#f7f9fb] rounded-lg border border-[#c4c6cf] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#002045]">Matched Factor: Income & Category</span>
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">Pass</span>
                </div>
                <p className="text-xs text-[#43474e] leading-relaxed">
                  Your family income range (₹1L - ₹2.5L) falls within the eligibility threshold of ₹3,000,000 for EWS and OBC reservations.
                </p>
              </div>

              <div className="p-4 bg-[#f7f9fb] rounded-lg border border-[#c4c6cf] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#002045]">Matched Factor: Domicile & Region</span>
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">Pass</span>
                </div>
                <p className="text-xs text-[#43474e] leading-relaxed">
                  State preference set to Maharashtra, qualifying for both Central Sector and Maharashtra State-level Welfare Subsidies.
                </p>
              </div>

              <div className="p-4 bg-[#f7f9fb] rounded-lg border border-[#c4c6cf] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#002045]">Matched Factor: Age & Education</span>
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">Pass</span>
                </div>
                <p className="text-xs text-[#43474e] leading-relaxed">
                  Age 35 meets general adult family criteria without exceeding upper age thresholds for agriculture & housing schemes.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 5: Why You Didn't Qualify / Unqualified Schemes */}
        {currentView === 'unqualified' && (
          <div className="w-full max-w-2xl bg-white border border-[#c4c6cf] rounded-lg p-6 md:p-8 shadow-sm space-y-6">
            <div className="border-b border-[#c4c6cf] pb-4">
              <h1 className="text-xl font-bold text-[#002045] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ba1a1a]">cancel</span>
                {t('unqualified.title')}
              </h1>
              <p className="text-xs text-[#43474e] mt-1">{t('unqualified.subtitle')}</p>
            </div>

            <div className="space-y-4">
              {ineligibleSchemes.map((item, idx) => (
                <div key={idx} className="p-4 bg-[#ffdad6]/40 border border-[#ffdad6] rounded-lg space-y-2">
                  <h3 className="text-sm font-bold text-[#93000a]">{item.name}</h3>
                  <p className="text-xs text-[#ba1a1a]"><strong>Reason:</strong> {item.reason}</p>
                  <div className="p-2.5 bg-white rounded border border-[#ffdad6] text-xs text-[#43474e] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#8f4e00] text-base">lightbulb</span>
                    <span><strong>Recommendation:</strong> {item.fixHint}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Persistent Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-16 px-4 bg-white border-t border-[#c4c6cf] shadow-lg">
        <button 
          onClick={() => { setCurrentView('form'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className={`flex flex-col items-center justify-center transition-all ${
            currentView === 'form' ? 'text-[#002045] font-bold' : 'text-[#43474e] hover:text-[#002045]'
          }`}
        >
          <span className="material-symbols-outlined text-2xl">home</span>
          <span className="text-xs">{t('nav.home')}</span>
        </button>
        
        <button 
          onClick={() => { setCurrentView('eligible'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className={`flex flex-col items-center justify-center transition-all ${
            currentView === 'eligible' || currentView === 'detail' ? 'text-[#002045] font-bold' : 'text-[#43474e] hover:text-[#002045]'
          }`}
        >
          <span className="material-symbols-outlined text-2xl">apps</span>
          <span className="text-xs">{t('nav.services')}</span>
        </button>
        
        <button 
          onClick={() => { setCurrentView('reasoning'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className={`flex flex-col items-center justify-center transition-all ${
            currentView === 'reasoning' ? 'text-[#002045] font-bold' : 'text-[#43474e] hover:text-[#002045]'
          }`}
        >
          <span className="material-symbols-outlined text-2xl">verified_user</span>
          <span className="text-xs">{t('nav.verify')}</span>
        </button>
        
        <button 
          onClick={() => { setCurrentView('unqualified'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className={`flex flex-col items-center justify-center transition-all ${
            currentView === 'unqualified' ? 'text-[#002045] font-bold' : 'text-[#43474e] hover:text-[#002045]'
          }`}
        >
          <span className="material-symbols-outlined text-2xl">person</span>
          <span className="text-xs">{t('nav.profile')}</span>
        </button>
      </nav>
    </div>
  );
}
