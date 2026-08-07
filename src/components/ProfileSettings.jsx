import React, { useState, useEffect } from 'react';
import { ShieldCheck, Check, X, Lock, Sparkles, HardDrive, Trash2, CheckCircle2, ChevronRight, Eye, AlertCircle } from 'lucide-react';
import { translations } from '../data/translations';

export default function ProfileSettings({ profile, language }) {
  const t = translations[language] || translations.EN;

  // Field definitions
  const FIELD_DEFINITIONS = [
    { id: 'fullName', name: 'Full Name', reason: 'Speeds up future application pre-filling', defaultVal: profile.fullName || 'Abhishek Sharma' },
    { id: 'age', name: 'Age', reason: 'Filters age-appropriate schemes automatically', defaultVal: `${profile.age || 22} years` },
    { id: 'state', name: 'State / UT', reason: 'Remembers state domicile for local scheme matching', defaultVal: profile.state || 'Maharashtra' },
    { id: 'education', name: 'Education Level', reason: 'Matches relevant student scholarships and degree grants', defaultVal: profile.education || 'Graduate' },
    { id: 'income', name: 'Annual Family Income', reason: 'Validates income ceiling eligibility caps', defaultVal: `₹${Number(profile.income || 250000).toLocaleString('en-IN')}` },
    { id: 'category', name: 'Category / Caste', reason: 'Applies reservation quota benefits', defaultVal: (profile.category || 'SC').toUpperCase() },
    { id: 'documents', name: 'Uploaded Documents (Aadhaar / Income Cert)', reason: 'Stores text OCR verification metadata', defaultVal: 'Text verification attributes' }
  ];

  const DURATION_OPTIONS = [
    { label: '10 Days', value: '10_days', text: 'expires in 10 days' },
    { label: '1 Month', value: '1_month', text: 'expires in 30 days' },
    { label: '3 Months', value: '3_months', text: 'expires in 90 days' },
    { label: 'Until I delete it', value: 'until_delete', text: 'until you delete' },
    { label: 'This session only', value: 'session_only', text: 'this session only' }
  ];

  // State for toggled fields: { [fieldId]: boolean }
  const [toggles, setToggles] = useState(() => {
    const saved = localStorage.getItem('sarthi_memory_toggles');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      fullName: true,
      age: true,
      state: true,
      education: false,
      income: true,
      category: false,
      documents: false
    };
  });

  // State for durations per field: { [fieldId]: string }
  const [durations, setDurations] = useState(() => {
    const saved = localStorage.getItem('sarthi_memory_durations');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      fullName: 'until_delete',
      age: 'until_delete',
      state: 'until_delete',
      education: '1_month',
      income: '1_month',
      category: 'until_delete',
      documents: 'session_only'
    };
  });

  const [savedNotice, setSavedNotice] = useState(false);
  const [showInspector, setShowInspector] = useState(false);
  const [storedMemoryItems, setStoredMemoryItems] = useState([]);

  useEffect(() => {
    loadStoredItems();
  }, []);

  const loadStoredItems = () => {
    const localDocs = JSON.parse(localStorage.getItem('sarthi_verified_docs') || '[]');
    const sessionDocs = JSON.parse(sessionStorage.getItem('sarthi_session_docs') || '[]');
    const prefs = localStorage.getItem('sarthi_memory_toggles');
    
    const items = [];
    if (prefs) items.push({ type: 'Preferences Configuration', key: 'sarthi_memory_toggles', data: 'Saved field retention choices' });
    localDocs.forEach((doc, i) => items.push({ type: 'Verified Document Text', key: `local_doc_${i}`, data: `${doc.docType} (${doc.fullName || 'Verified'})` }));
    sessionDocs.forEach((doc, i) => items.push({ type: 'Session Document Text', key: `session_doc_${i}`, data: `${doc.docType} (Session)` }));

    setStoredMemoryItems(items);
  };

  // Toggle field on/off
  const handleToggleField = (fieldId) => {
    setToggles(prev => ({
      ...prev,
      [fieldId]: !prev[fieldId]
    }));
  };

  // Select duration for a field
  const handleSelectDuration = (fieldId, durationVal) => {
    setDurations(prev => ({
      ...prev,
      [fieldId]: durationVal
    }));
  };

  // Quick Action: Remember Everything
  const handleRememberEverything = () => {
    const allOn = {};
    const defaultDurs = {};
    FIELD_DEFINITIONS.forEach(f => {
      allOn[f.id] = true;
      defaultDurs[f.id] = durations[f.id] || 'until_delete';
    });
    setToggles(allOn);
    setDurations(defaultDurs);
  };

  // Quick Action: Remember Nothing
  const handleRememberNothing = () => {
    const allOff = {};
    FIELD_DEFINITIONS.forEach(f => {
      allOff[f.id] = false;
    });
    setToggles(allOff);
  };

  // Save Preferences
  const handleSavePreferences = () => {
    localStorage.setItem('sarthi_memory_toggles', JSON.stringify(toggles));
    localStorage.setItem('sarthi_memory_durations', JSON.stringify(durations));
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3500);
    loadStoredItems();
  };

  // Delete all stored memory
  const handleClearAllMemory = () => {
    localStorage.removeItem('sarthi_memory_toggles');
    localStorage.removeItem('sarthi_memory_durations');
    localStorage.removeItem('sarthi_verified_docs');
    sessionStorage.removeItem('sarthi_session_docs');
    loadStoredItems();
  };

  // Compute live summary string
  const activeFieldsSummary = FIELD_DEFINITIONS
    .filter(f => toggles[f.id])
    .map(f => {
      const durVal = durations[f.id];
      const durObj = DURATION_OPTIONS.find(d => d.value === durVal);
      const durText = durObj ? ` (${durObj.text})` : '';
      return `${f.name}${durText}`;
    });

  const summaryText = activeFieldsSummary.length > 0
    ? activeFieldsSummary.join(' · ')
    : 'Nothing (Zero data saved)';

  return (
    <div className="w-full max-w-3xl mx-auto pt-4 pb-28 px-4 space-y-6">
      
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary via-primary-container to-secondary text-white p-6 md:p-8 rounded-3xl shadow-lg relative overflow-hidden space-y-3">
        <div className="inline-flex items-center gap-1.5 bg-saffron text-primary font-extrabold text-xs px-3 py-1 rounded-full shadow-sm">
          <ShieldCheck className="w-4 h-4" /> Negotiated Memory Protocol
        </div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight">
          {t.memoryHeaderTitle || "What should BharatAI remember?"}
        </h1>
        <p className="text-xs md:text-sm text-slate-200 leading-relaxed max-w-xl">
          {t.memoryHeaderSubtitle || "You control what's saved, for how long, and can change this anytime."}
        </p>
      </div>

      {/* Quick Action Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Remember Everything Button */}
        <button
          type="button"
          onClick={handleRememberEverything}
          className="bg-surface-container-lowest border-2 border-emerald-500/40 hover:border-emerald-500 p-5 rounded-2xl text-left space-y-1.5 shadow-sm hover:shadow-md transition-all group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-sm text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> {t.rememberEverything || "Remember Everything"}
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform" />
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            {t.rememberEverythingSubtext || "Convenient default for users who don't want to choose field-by-field"}
          </p>
        </button>

        {/* Remember Nothing Button */}
        <button
          type="button"
          onClick={handleRememberNothing}
          className="bg-surface-container-lowest border-2 border-rose-400/40 hover:border-rose-500 p-5 rounded-2xl text-left space-y-1.5 shadow-sm hover:shadow-md transition-all group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-sm text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
              <X className="w-4 h-4 text-rose-600 stroke-[3]" /> {t.rememberNothing || "Remember Nothing"}
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 group-hover:scale-125 transition-transform" />
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            {t.rememberNothingSubtext || "Zero data saved. Re-enter details every session"}
          </p>
        </button>
      </div>

      {/* Field-Level List Title */}
      <div className="pt-2">
        <h2 className="text-base font-extrabold text-on-surface flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-saffron" />
          <span>{t.orChooseIndividually || "Or choose individually:"}</span>
        </h2>
      </div>

      {/* Field-Level Toggles List */}
      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-3xl p-5 md:p-6 shadow-sm space-y-5">
        {FIELD_DEFINITIONS.map((field) => {
          const isToggled = !!toggles[field.id];
          const currentDuration = durations[field.id];

          return (
            <div
              key={field.id}
              className={`p-4 rounded-2xl border transition-all ${
                isToggled
                  ? 'bg-surface border-primary/20 shadow-sm'
                  : 'bg-surface-container-low/40 border-outline-variant/40'
              }`}
            >
              {/* Row Header & Toggle Switch */}
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-on-surface">{field.name}</span>
                    {isToggled && (
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-on-surface-variant leading-tight">{field.reason}</p>
                </div>

                {/* Toggle Switch */}
                <button
                  type="button"
                  onClick={() => handleToggleField(field.id)}
                  className={`w-12 h-6 rounded-full transition-colors relative p-1 shrink-0 cursor-pointer ${
                    isToggled ? 'bg-primary' : 'bg-outline-variant'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform ${
                      isToggled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Inline Duration Picker (Revealed when Toggled ON) */}
              {isToggled && (
                <div className="mt-4 pt-3 border-t border-outline-variant/40 space-y-2 animate-fadeIn">
                  <span className="text-[11px] font-bold text-outline uppercase tracking-wider block">
                    {t.selectDurationPrompt || "Select retention duration for this field:"}
                  </span>

                  <div className="flex flex-wrap gap-2">
                    {DURATION_OPTIONS.map((dur) => {
                      const isSelected = currentDuration === dur.value;
                      return (
                        <button
                          key={dur.value}
                          type="button"
                          onClick={() => handleSelectDuration(field.id, dur.value)}
                          className={`py-1.5 px-3 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-primary text-white shadow-sm ring-2 ring-saffron/40'
                              : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/60 hover:bg-surface-container'
                          }`}
                        >
                          {dur.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* Live Summary Card */}
      <div className="bg-gradient-to-r from-slate-900 to-primary text-white p-5 rounded-2xl shadow-lg border border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-saffron uppercase tracking-wider">
          <HardDrive className="w-4 h-4" /> Live Memory Summary
        </div>
        <div className="text-xs md:text-sm font-medium leading-relaxed text-slate-100">
          <span className="font-bold text-white">{t.currentlyRemembering || "Currently remembering:"} </span>
          <span className="text-saffron font-bold">{summaryText}</span>
        </div>
      </div>

      {/* Save Success Banner */}
      {savedNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-950 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Your negotiated memory preferences have been saved successfully!</span>
        </div>
      )}

      {/* Bottom Actions */}
      <div className="space-y-3 pt-2">
        <button
          type="button"
          onClick={handleSavePreferences}
          className="w-full py-4 px-6 bg-primary hover:bg-primary-container text-white font-black text-sm rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Lock className="w-4 h-4 text-saffron" />
          <span>{t.savePreferences || "Save My Preferences"}</span>
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setShowInspector(!showInspector)}
            className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1.5 py-1 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{t.viewDeleteStoredData || "View & Delete Stored Data"}</span>
          </button>
        </div>
      </div>

      {/* Stored Memory Inspector Drawer / Section */}
      {showInspector && (
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-5 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-primary" /> Memory Storage Inspector
            </h3>
            {storedMemoryItems.length > 0 && (
              <button
                type="button"
                onClick={handleClearAllMemory}
                className="py-1 px-2.5 bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold rounded-lg hover:bg-rose-100 transition-all flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" /> Clear All Data
              </button>
            )}
          </div>

          {storedMemoryItems.length === 0 ? (
            <p className="text-xs text-on-surface-variant">No active data memory saved in local browser storage.</p>
          ) : (
            <div className="space-y-2 text-xs">
              {storedMemoryItems.map((item, idx) => (
                <div key={idx} className="p-3 bg-surface rounded-xl border border-outline-variant/40 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-on-surface block">{item.type}</span>
                    <span className="text-[11px] text-on-surface-variant">{item.data}</span>
                  </div>
                  <span className="text-[10px] font-mono font-semibold text-outline bg-surface-container-high px-2 py-0.5 rounded">
                    {item.key}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
