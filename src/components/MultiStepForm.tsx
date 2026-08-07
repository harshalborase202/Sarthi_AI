import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { triggerMemoryConsent } from './MemoryConsentToast';
import { ShieldCheck, ChevronRight, Check, BrainCircuit } from 'lucide-react';
import clsx from 'clsx';
import { useMemory } from '../context/MemoryContext';

interface MultiStepFormProps {
  onComplete: () => void;
}

export const MultiStepForm: React.FC<MultiStepFormProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const { t } = useLanguage();
  const { memories } = useMemory();
  const [formData, setFormData] = useState({
    age: '',
    gender: 'male',
    state: memories.find(m => m.fact.includes('Maharashtra')) ? 'maharashtra' : '', // prefill if in memory
    education: '',
    income: '',
    category: ''
  });

  const handleNext = () => {
    // Simulate memory interception on specific inputs during the flow
    if (step === 2 && formData.state === 'maharashtra') {
      const alreadyRemembered = memories.some(m => m.fact.includes('Maharashtra'));
      if (!alreadyRemembered) {
        triggerMemoryConsent({
          category: 'About You',
          fact: 'Lives in Maharashtra',
          sourceContext: 'Profile Setup'
        });
      }
    }
    setStep(s => s + 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 animate-in fade-in zoom-in-95 duration-300">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{t('form.title')}</h1>
        <p className="text-slate-500 mt-2">{t('form.subtitle')}</p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center mb-8 gap-2">
        {[1, 2, 3].map(s => (
          <React.Fragment key={s}>
            <div className={clsx(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors",
              step === s ? "bg-primary-600 text-white" : step > s ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400"
            )}>
              {step > s ? <Check size={16} /> : s}
            </div>
            {s < 3 && <div className={clsx("flex-grow h-1 rounded-full transition-colors", step > s ? "bg-emerald-100" : "bg-slate-100")} />}
          </React.Fragment>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {step === 1 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 fade-in">
            <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2">Personal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Age</label>
                <input 
                  type="number" 
                  value={formData.age}
                  onChange={e => setFormData({...formData, age: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                  placeholder="e.g. 35"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Gender</label>
                <select 
                  value={formData.gender}
                  onChange={e => setFormData({...formData, gender: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-white"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <button type="button" onClick={handleNext} className="w-full flex justify-center items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-semibold transition-colors mt-8">
              {t('form.next')} <ChevronRight size={20} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 fade-in">
            <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2">Location & Education</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex justify-between">
                State
                {memories.find(m => m.fact.includes('Maharashtra')) && (
                  <span className="text-[10px] bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-bold uppercase flex items-center gap-1">
                    <BrainCircuit size={10} /> Auto-filled from memory
                  </span>
                )}
              </label>
              <select 
                value={formData.state}
                onChange={e => setFormData({...formData, state: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-white"
                required
              >
                <option value="" disabled>Select your state</option>
                <option value="maharashtra">Maharashtra</option>
                <option value="delhi">Delhi</option>
                <option value="karnataka">Karnataka</option>
              </select>
              <p className="text-xs text-slate-500">Determines state-specific scheme eligibility.</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Education Level</label>
              <select 
                value={formData.education}
                onChange={e => setFormData({...formData, education: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-white"
                required
              >
                <option value="" disabled>Select highest education</option>
                <option value="secondary">Secondary (10th)</option>
                <option value="higher_secondary">Higher Secondary (12th)</option>
                <option value="graduate">Graduate</option>
              </select>
            </div>
            
            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(1)} className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-semibold transition-colors">
                Back
              </button>
              <button type="button" onClick={handleNext} className="w-2/3 flex justify-center items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-semibold transition-colors">
                {t('form.next')} <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 fade-in">
            <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2">Financial Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Annual Family Income</label>
                <select 
                  value={formData.income}
                  onChange={e => setFormData({...formData, income: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-white"
                  required
                >
                  <option value="" disabled>Select range</option>
                  <option value="0_1L">Up to ₹1 Lakh</option>
                  <option value="1_2.5L">₹1 Lakh - ₹2.5 Lakhs</option>
                  <option value="2.5_5L">₹2.5 Lakhs - ₹5 Lakhs</option>
                </select>
                <p className="text-xs text-slate-500 mt-1 leading-snug">Many schemes use this to verify EWS (Economically Weaker Section) status.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Category</label>
                <select 
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-white"
                  required
                >
                  <option value="" disabled>Select category</option>
                  <option value="open">General / Open</option>
                  <option value="obc">OBC</option>
                  <option value="sc">SC</option>
                  <option value="st">ST</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(2)} className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-semibold transition-colors">
                Back
              </button>
              <button type="submit" className="w-2/3 flex justify-center items-center gap-2 bg-primary-900 hover:bg-primary-950 text-white py-3 rounded-xl font-bold transition-colors shadow-sm">
                {t('form.submit')}
              </button>
            </div>
          </div>
        )}

      </form>

      {/* Trust Messaging */}
      <div className="mt-8 flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
        <ShieldCheck className="text-emerald-600 shrink-0 mt-0.5" size={24} />
        <p className="text-xs md:text-sm text-slate-600 font-medium leading-relaxed">
          {t('form.trust')}
        </p>
      </div>

    </div>
  );
};
