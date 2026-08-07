import React, { useState, useEffect } from 'react';
import { User, ShieldCheck, Trash2, HardDrive, Key, CheckCircle, RefreshCw } from 'lucide-react';
import { translations } from '../data/translations';

export default function ProfileSettings({ profile, language }) {
  const t = translations[language] || translations.EN;
  const [savedDocs, setSavedDocs] = useState([]);
  const [clearedNotice, setClearedNotice] = useState(false);

  useEffect(() => {
    loadSavedDocs();
  }, []);

  const loadSavedDocs = () => {
    const localDocs = JSON.parse(localStorage.getItem('sarthi_verified_docs') || '[]');
    const sessionDocs = JSON.parse(sessionStorage.getItem('sarthi_session_docs') || '[]');
    setSavedDocs([...localDocs, ...sessionDocs]);
  };

  const handleClearAllDocs = () => {
    localStorage.removeItem('sarthi_verified_docs');
    sessionStorage.removeItem('sarthi_session_docs');
    setSavedDocs([]);
    setClearedNotice(true);
    setTimeout(() => setClearedNotice(false), 3000);
  };

  return (
    <div className="w-full max-w-3xl mx-auto pt-4 pb-24 px-4 space-y-6">
      
      {/* Page Header */}
      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-3xl p-6 md:p-8 shadow-sm flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-xl shadow-md">
          <User className="w-8 h-8 text-saffron" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-on-surface">Profile & Data Settings</h1>
          <p className="text-xs text-on-surface-variant">Manage your stored verification data and local memory preferences.</p>
        </div>
      </div>

      {/* Active Profile Summary */}
      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-3xl p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-on-surface flex items-center gap-2">
          <User className="w-4 h-4 text-primary" /> Profile Parameters Overview
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-surface rounded-xl border border-outline-variant/40">
            <span className="text-outline uppercase text-[10px] font-bold block">Age</span>
            <span className="font-bold text-on-surface">{profile.age || 22} years</span>
          </div>
          <div className="p-3 bg-surface rounded-xl border border-outline-variant/40">
            <span className="text-outline uppercase text-[10px] font-bold block">State</span>
            <span className="font-bold text-on-surface">{profile.state || 'Maharashtra'}</span>
          </div>
          <div className="p-3 bg-surface rounded-xl border border-outline-variant/40">
            <span className="text-outline uppercase text-[10px] font-bold block">Category</span>
            <span className="font-bold text-on-surface uppercase">{profile.category || 'SC'}</span>
          </div>
          <div className="p-3 bg-surface rounded-xl border border-outline-variant/40">
            <span className="text-outline uppercase text-[10px] font-bold block">Annual Income</span>
            <span className="font-bold text-primary">₹{Number(profile.income || 250000).toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Stored Document Text Attributes */}
      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-base font-bold text-on-surface flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-emerald-600" /> Stored Text Attribute Memory
          </h2>
          {savedDocs.length > 0 && (
            <button
              onClick={handleClearAllDocs}
              className="py-1.5 px-3 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear Saved Memory
            </button>
          )}
        </div>

        {clearedNotice && (
          <div className="p-3 bg-emerald-50 text-emerald-900 text-xs font-bold rounded-xl flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" /> All stored document memory cleared from local storage.
          </div>
        )}

        {savedDocs.length === 0 ? (
          <div className="p-6 text-center bg-surface rounded-2xl border border-outline-variant/40 space-y-2">
            <ShieldCheck className="w-8 h-8 text-outline mx-auto" />
            <p className="text-xs font-bold text-on-surface">No document text data currently stored.</p>
            <p className="text-[11px] text-on-surface-variant">When you scan documents in the "Verify" tab and select a remember option, text metadata appears here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {savedDocs.map((doc, idx) => (
              <div key={idx} className="p-4 bg-surface rounded-xl border border-outline-variant/60 space-y-2 text-xs">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-primary text-sm">{doc.docType}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary">
                    {doc.retention || 'Saved'}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-on-surface-variant">
                  <div>Name: <span className="font-semibold text-on-surface">{doc.fullName}</span></div>
                  <div>ID: <span className="font-mono font-semibold text-on-surface">{doc.identifierNumber}</span></div>
                  <div>Authority: <span className="font-semibold text-on-surface">{doc.authority}</span></div>
                  <div>Saved At: <span className="font-semibold text-on-surface">{new Date(doc.savedAt).toLocaleDateString()}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
