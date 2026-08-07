import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Edit3, Globe, Brain, FileText, Info, ShieldCheck, ChevronRight, X, Sparkles, Lock } from 'lucide-react';
import { translations } from '../data/translations';

export default function UserProfile({ profile, language, setLanguage }) {
  const navigate = useNavigate();
  const t = translations[language] || translations.EN;

  const [activeModal, setActiveModal] = useState(null); // 'about' | 'privacy' | null

  // Map readable label for education
  const getEducationLabel = (val) => {
    const map = {
      below10th: 'Below 10th Standard',
      class10: '10th Passed',
      class12: '12th Passed',
      graduate: 'Undergraduate / B.Tech / Degree',
      postGraduate: "Postgraduate / Master's"
    };
    return map[val] || val || 'Graduate';
  };

  return (
    <div className="w-full max-w-3xl mx-auto pt-4 pb-28 px-4 space-y-6">
      
      {/* Header Section with Avatar */}
      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col items-center text-center space-y-3 relative overflow-hidden">
        {/* Saffron banner background accent */}
        <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-r from-primary to-primary-container" />
        
        {/* Avatar Placeholder */}
        <div className="relative z-10 w-20 h-20 rounded-full bg-surface-container-lowest p-1 shadow-md mt-4">
          <div className="w-full h-full rounded-full bg-primary text-white flex items-center justify-center font-bold text-2xl border-2 border-saffron">
            <User className="w-10 h-10 text-saffron" />
          </div>
        </div>

        <div className="space-y-1 relative z-10">
          <h1 className="text-2xl font-black text-on-surface">Harshal Sharma</h1>
          <p className="text-xs text-on-surface-variant font-medium">Verified BharatAI Citizen Account</p>
        </div>
      </div>

      {/* Basic Info Card */}
      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-outline-variant/40 pb-3">
          <h2 className="text-base font-extrabold text-on-surface flex items-center gap-2">
            <User className="w-4 h-4 text-primary" /> Basic Information
          </h2>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-xs font-bold text-primary hover:text-primary-container hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
        </div>

        {/* Read-Only Parameter Summary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 bg-surface rounded-2xl border border-outline-variant/40 space-y-0.5">
            <span className="text-outline uppercase text-[10px] font-bold block">Age</span>
            <span className="font-bold text-on-surface text-sm">{profile.age || 22} years</span>
          </div>

          <div className="p-3.5 bg-surface rounded-2xl border border-outline-variant/40 space-y-0.5">
            <span className="text-outline uppercase text-[10px] font-bold block">State / UT</span>
            <span className="font-bold text-on-surface text-sm">{profile.state || 'Maharashtra'}</span>
          </div>

          <div className="p-3.5 bg-surface rounded-2xl border border-outline-variant/40 space-y-0.5">
            <span className="text-outline uppercase text-[10px] font-bold block">Education Level</span>
            <span className="font-bold text-on-surface text-sm">{getEducationLabel(profile.education)}</span>
          </div>

          <div className="p-3.5 bg-surface rounded-2xl border border-outline-variant/40 space-y-0.5">
            <span className="text-outline uppercase text-[10px] font-bold block">Category / Caste</span>
            <span className="font-bold text-on-surface text-sm uppercase">{profile.category || 'SC'}</span>
          </div>

          <div className="p-3.5 bg-surface rounded-2xl border border-outline-variant/40 space-y-0.5">
            <span className="text-outline uppercase text-[10px] font-bold block">Occupation Status</span>
            <span className="font-bold text-on-surface text-sm capitalize">{profile.occupation || 'Student'}</span>
          </div>

          <div className="p-3.5 bg-surface rounded-2xl border border-outline-variant/40 space-y-0.5">
            <span className="text-outline uppercase text-[10px] font-bold block">Annual Family Income</span>
            <span className="font-extrabold text-primary text-sm">₹{Number(profile.income || 250000).toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Language Preference Row */}
      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-3xl p-5 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-on-surface">Language Preference</h3>
            <p className="text-xs text-on-surface-variant">Switch interface language</p>
          </div>
        </div>

        {/* Language Switcher Segmented Buttons */}
        <div className="flex items-center bg-surface-container-high p-1 rounded-xl border border-outline-variant/60">
          {['EN', 'HI', 'MR'].map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setLanguage && setLanguage(lang)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
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

      {/* Quick Links List */}
      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-3xl p-4 shadow-sm space-y-1">
        <h3 className="text-xs font-bold text-outline uppercase tracking-wider px-3 pt-2 pb-1">
          Quick Access Hub
        </h3>

        {/* Memory Center Link */}
        <button
          type="button"
          onClick={() => navigate('/memory')}
          className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-surface-container-low transition-all text-left cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-saffron/15 text-saffron flex items-center justify-center font-bold">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm text-on-surface block">Memory Center</span>
              <span className="text-[11px] text-on-surface-variant">View & renegotiate remembered parameters</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-outline group-hover:translate-x-1 transition-transform" />
        </button>

        {/* My Documents Link */}
        <button
          type="button"
          onClick={() => navigate('/verify')}
          className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-surface-container-low transition-all text-left cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm text-on-surface block">My Documents</span>
              <span className="text-[11px] text-on-surface-variant">Scan & verify document OCR metadata</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-outline group-hover:translate-x-1 transition-transform" />
        </button>

        {/* About SarthiAI */}
        <button
          type="button"
          onClick={() => setActiveModal('about')}
          className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-surface-container-low transition-all text-left cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm text-on-surface block">About SarthiAI</span>
              <span className="text-[11px] text-on-surface-variant">Explainable AI & Trust Engine (PS01 + PS03)</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-outline group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Privacy Policy */}
        <button
          type="button"
          onClick={() => setActiveModal('privacy')}
          className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-surface-container-low transition-all text-left cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm text-on-surface block">Privacy Policy</span>
              <span className="text-[11px] text-on-surface-variant">Zero server storage & citizen data sovereignty</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-outline group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Info Modals */}
      {activeModal === 'about' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl shadow-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-outline-variant/40 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-saffron" />
                <h3 className="font-extrabold text-lg text-on-surface">About SarthiAI (BharatAI)</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-full hover:bg-surface-container text-outline">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              SarthiAI functions as Google Maps for Government Schemes—visualizing exact policy rule branches, confidence levels, and document readiness checklists.
            </p>
            <div className="p-3 bg-surface rounded-xl text-xs space-y-1">
              <div className="font-bold text-primary">PS01: Explainable AI Engine</div>
              <div className="text-on-surface-variant">Live streaming reasoning step logs & field evaluation.</div>
              <div className="font-bold text-primary mt-2">PS03: Trustworthy Interface</div>
              <div className="text-on-surface-variant">Detailed "Why You Didn't Qualify" audit breakdowns.</div>
            </div>
            <button onClick={() => setActiveModal(null)} className="w-full py-3 bg-primary text-white font-bold text-xs rounded-xl">
              Close
            </button>
          </div>
        </div>
      )}

      {activeModal === 'privacy' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl shadow-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-outline-variant/40 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-lg text-on-surface">Privacy Policy</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-full hover:bg-surface-container text-outline">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-xs text-on-surface-variant leading-relaxed space-y-2">
              <p>1. <strong>Zero Server Storage:</strong> Your personal profile and document files are processed client-side and never saved on backend servers.</p>
              <p>2. <strong>Citizen Data Sovereignty:</strong> You control retention duration for extracted text attributes via the Memory Center.</p>
              <p>3. <strong>Immediate Image Discard:</strong> Document images uploaded for OCR are immediately discarded post-parsing.</p>
            </div>
            <button onClick={() => setActiveModal(null)} className="w-full py-3 bg-primary text-white font-bold text-xs rounded-xl">
              I Understand
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
