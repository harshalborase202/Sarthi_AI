import React, { useState, useEffect } from 'react';
import { Brain, Clock, ShieldCheck, UserCheck, FileText, MessageSquare, ShieldAlert, Sparkles, Check, Trash2, X, AlertTriangle } from 'lucide-react';
import { translations } from '../data/translations';

export default function MemoryCenter({ language }) {
  const t = translations[language] || translations.EN;

  // Initial timeline card entries
  const INITIAL_CARDS = [
    {
      id: 'profile_details',
      title: 'Profile Details',
      icon: UserCheck,
      speechBubble: 'I can remember your age, state, and education level for faster searches next time.',
      status: 'until_delete', // until_delete | 30_days | session_only | never_stored
      expiryDate: null,
      badgeText: '✅ Remembered until you delete it',
      badgeStyle: 'bg-emerald-50 text-emerald-800 border-emerald-300'
    },
    {
      id: 'income_cert',
      title: 'Income Certificate',
      icon: FileText,
      speechBubble: 'This document helps verify income-based eligibility.',
      status: '30_days',
      expiryDate: '5 Sept 2026',
      badgeText: '⏳ Remembered for 30 days — expires 5 Sept 2026',
      badgeStyle: 'bg-amber-50 text-amber-900 border-amber-300'
    },
    {
      id: 'gate_prep',
      title: 'GATE Exam Prep',
      icon: MessageSquare,
      speechBubble: 'You mentioned preparing for GATE — I can use this to suggest education schemes.',
      status: 'session_only',
      expiryDate: null,
      badgeText: '💬 Session only — already forgotten',
      badgeStyle: 'bg-slate-100 text-slate-600 border-slate-300 opacity-80'
    },
    {
      id: 'aadhaar_card',
      title: 'Aadhaar Card',
      icon: ShieldCheck,
      speechBubble: '🔒 Never stored — image was discarded immediately after verification.',
      status: 'never_stored',
      expiryDate: null,
      badgeText: '🔒 Never stored',
      badgeStyle: 'bg-slate-100 text-slate-700 border-slate-300'
    }
  ];

  const [cards, setCards] = useState(() => {
    const saved = localStorage.getItem('sarthi_memory_center_cards');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_CARDS;
  });

  const [editingCardId, setEditingCardId] = useState(null);
  const [showConfirmForgetModal, setShowConfirmForgetModal] = useState(false);
  const [successToast, setSuccessToast] = useState(null);

  useEffect(() => {
    localStorage.setItem('sarthi_memory_center_cards', JSON.stringify(cards));
  }, [cards]);

  // Calculate summary stat card metrics dynamically
  const countRemembered = cards.filter(c => c.status === 'until_delete').length;
  const countExpiring = cards.filter(c => c.status === '30_days').length;
  const countNeverStored = cards.filter(c => c.status === 'never_stored' || c.status === 'session_only').length;

  // Handle status renegotiation inline
  const handleUpdateCardStatus = (cardId, newStatus) => {
    setCards(prev => prev.map(card => {
      if (card.id !== cardId) return card;

      let newBadgeText = '';
      let newBadgeStyle = '';

      if (newStatus === 'until_delete') {
        newBadgeText = '✅ Remembered until you delete it';
        newBadgeStyle = 'bg-emerald-50 text-emerald-800 border-emerald-300';
      } else if (newStatus === '30_days') {
        newBadgeText = '⏳ Remembered for 30 days — expires 5 Sept 2026';
        newBadgeStyle = 'bg-amber-50 text-amber-900 border-amber-300';
      } else if (newStatus === 'session_only') {
        newBadgeText = '💬 Session only — already forgotten';
        newBadgeStyle = 'bg-slate-100 text-slate-600 border-slate-300 opacity-80';
      } else if (newStatus === 'never_stored') {
        newBadgeText = '🔒 Never stored — discarded';
        newBadgeStyle = 'bg-slate-100 text-slate-700 border-slate-300';
      }

      return {
        ...card,
        status: newStatus,
        badgeText: newBadgeText,
        badgeStyle: newBadgeStyle
      };
    }));

    setEditingCardId(null);
  };

  // Handle Forget Everything action
  const handleForgetEverything = () => {
    setCards(prev => prev.map(card => ({
      ...card,
      status: 'never_stored',
      badgeText: '🔒 Never stored — discarded',
      badgeStyle: 'bg-slate-100 text-slate-700 border-slate-300'
    })));

    localStorage.removeItem('sarthi_verified_docs');
    sessionStorage.removeItem('sarthi_session_docs');
    setShowConfirmForgetModal(false);

    setSuccessToast("Everything has been forgotten. Zero personal data remains stored.");
    setTimeout(() => setSuccessToast(null), 4000);
  };

  return (
    <div className="w-full max-w-3xl mx-auto pt-4 pb-28 px-4 space-y-6">
      
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary via-primary-container to-secondary text-white p-6 md:p-8 rounded-3xl shadow-lg relative overflow-hidden space-y-2">
        <div className="inline-flex items-center gap-1.5 bg-saffron text-primary font-black text-xs px-3 py-1 rounded-full shadow-sm">
          <Brain className="w-4 h-4" /> BharatAI Memory Center
        </div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight">
          Your Memory, Your Choice
        </h1>
        <p className="text-xs md:text-sm text-slate-200 leading-relaxed max-w-xl">
          Here's everything BharatAI has asked to remember, and what you decided.
        </p>
      </div>

      {/* Top Summary Strip: 3 Stat Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-3.5 text-center space-y-1 shadow-sm">
          <div className="text-base md:text-lg font-black text-emerald-600 flex items-center justify-center gap-1">
            <span>🧠</span> {countRemembered}
          </div>
          <div className="text-[11px] font-bold text-on-surface">Things Remembered</div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-3.5 text-center space-y-1 shadow-sm">
          <div className="text-base md:text-lg font-black text-amber-600 flex items-center justify-center gap-1">
            <span>⏳</span> {countExpiring}
          </div>
          <div className="text-[11px] font-bold text-on-surface">Expiring Soon</div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-3.5 text-center space-y-1 shadow-sm">
          <div className="text-base md:text-lg font-black text-slate-600 flex items-center justify-center gap-1">
            <span>🔒</span> {countNeverStored}
          </div>
          <div className="text-[11px] font-bold text-on-surface">Never Stored</div>
        </div>
      </div>

      {/* Success Toast Notice */}
      {successToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-950 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fadeIn shadow-sm">
          <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Timeline Card Feed */}
      <div className="space-y-4 pt-1">
        {cards.map((card) => {
          const CardIcon = card.icon;
          const isEditing = editingCardId === card.id;

          return (
            <div
              key={card.id}
              className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all space-y-3.5"
            >
              {/* Card Header Title */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <CardIcon className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-base text-on-surface">{card.title}</h3>
                </div>

                <button
                  type="button"
                  onClick={() => setEditingCardId(isEditing ? null : card.id)}
                  className="text-xs font-bold text-primary hover:text-primary-container hover:underline transition-all cursor-pointer"
                >
                  {isEditing ? 'Close' : 'Change'}
                </button>
              </div>

              {/* Conversational AI Speech Bubble */}
              <div className="p-3.5 bg-surface-container-low/70 border border-outline-variant/40 rounded-xl text-xs text-on-surface-variant flex items-start gap-2.5">
                <span className="text-base shrink-0">🤖</span>
                <p className="leading-relaxed font-medium italic">"{card.speechBubble}"</p>
              </div>

              {/* Status Badge */}
              <div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${card.badgeStyle}`}>
                  {card.badgeText}
                </span>
              </div>

              {/* Inline Choice Picker (Revealed on clicking "Change") */}
              {isEditing && (
                <div className="mt-3 pt-3 border-t border-outline-variant/40 space-y-2 animate-fadeIn bg-primary/5 p-4 rounded-xl">
                  <span className="text-[11px] font-bold text-primary uppercase tracking-wider block">
                    Choose retention preference for {card.title}:
                  </span>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleUpdateCardStatus(card.id, 'until_delete')}
                      className={`py-1.5 px-3 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                        card.status === 'until_delete'
                          ? 'bg-primary text-white border-primary shadow-sm'
                          : 'bg-surface text-on-surface border-outline-variant/60 hover:bg-surface-container'
                      }`}
                    >
                      Remember Until I Delete
                    </button>

                    <button
                      type="button"
                      onClick={() => handleUpdateCardStatus(card.id, '30_days')}
                      className={`py-1.5 px-3 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                        card.status === '30_days'
                          ? 'bg-primary text-white border-primary shadow-sm'
                          : 'bg-surface text-on-surface border-outline-variant/60 hover:bg-surface-container'
                      }`}
                    >
                      30 Days
                    </button>

                    <button
                      type="button"
                      onClick={() => handleUpdateCardStatus(card.id, 'session_only')}
                      className={`py-1.5 px-3 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                        card.status === 'session_only'
                          ? 'bg-primary text-white border-primary shadow-sm'
                          : 'bg-surface text-on-surface border-outline-variant/60 hover:bg-surface-container'
                      }`}
                    >
                      Session Only
                    </button>

                    <button
                      type="button"
                      onClick={() => handleUpdateCardStatus(card.id, 'never_stored')}
                      className={`py-1.5 px-3 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                        card.status === 'never_stored'
                          ? 'bg-rose-700 text-white border-rose-700 shadow-sm'
                          : 'bg-surface text-rose-700 border-rose-200 hover:bg-rose-50'
                      }`}
                    >
                      Forget Now
                    </button>
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* Bottom Action: Forget Everything */}
      <div className="pt-4 text-center">
        <button
          type="button"
          onClick={() => setShowConfirmForgetModal(true)}
          className="py-3 px-6 bg-rose-50 hover:bg-rose-100 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800 rounded-xl font-bold text-xs shadow-sm transition-all inline-flex items-center gap-2 cursor-pointer"
        >
          <Trash2 className="w-4 h-4 text-rose-600" />
          <span>Forget Everything</span>
        </button>
      </div>

      {/* Forget Everything Confirmation Modal */}
      {showConfirmForgetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl shadow-2xl w-full max-w-md p-6 space-y-5 text-center">
            <div className="w-12 h-12 bg-rose-100 text-rose-700 rounded-2xl flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-on-surface">Forget All Memory?</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                This will immediately discard all remembered profile details, document metadata, and session notes from BharatAI.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmForgetModal(false)}
                className="flex-1 py-3 bg-surface-container-high hover:bg-surface-container text-on-surface font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleForgetEverything}
                className="flex-1 py-3 bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                Yes, Forget Everything
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
