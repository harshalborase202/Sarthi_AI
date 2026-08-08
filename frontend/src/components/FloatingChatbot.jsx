import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Sparkles, X, MessageSquare, ArrowRight, ShieldCheck } from 'lucide-react';
import { translations } from '../data/translations';

export default function FloatingChatbot({ language = 'EN', profile }) {
  const navigate = useNavigate();
  const t = translations[language] || translations.EN;
  const [isOpen, setIsOpen] = useState(false);
  const [quickInput, setQuickInput] = useState('');

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    if (quickInput.trim()) {
      navigate(`/chatbot?query=${encodeURIComponent(quickInput.trim())}`);
      setIsOpen(false);
      setQuickInput('');
    }
  };

  return (
    <>
      {/* Floating Chatbot Toggle Button (Anchored to Bottom-Right, matching myScheme.gov.in) */}
      <div className="fixed bottom-24 right-6 z-50 flex items-center gap-2 group">
        
        {/* Hover Tooltip Badge */}
        {!isOpen && (
          <div className="hidden sm:flex items-center gap-1.5 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg border border-saffron/40 animate-bounce">
            <Sparkles className="w-3.5 h-3.5 text-saffron" />
            <span>Ask SarthiAI Assistant</span>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer relative ${
            isOpen
              ? 'bg-primary-container text-white rotate-90'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white ring-4 ring-emerald-300/50 dark:ring-emerald-900/50'
          }`}
          title="SarthiAI Scheme Assistant"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <>
              <Bot className="w-7 h-7 text-white" />
              {/* Online pulsing indicator */}
              <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-saffron border-2 border-white rounded-full animate-ping" />
              <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-saffron border-2 border-white rounded-full" />
            </>
          )}
        </button>
      </div>

      {/* Floating Quick Chat Modal Window */}
      {isOpen && (
        <div className="fixed bottom-40 right-6 z-50 w-80 sm:w-96 bg-surface-container-lowest border border-outline-variant/60 rounded-3xl shadow-2xl overflow-hidden animate-fadeIn space-y-3">
          
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-primary via-primary-container to-secondary text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-saffron text-primary flex items-center justify-center font-bold">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm flex items-center gap-1">
                  SarthiAI Bot <ShieldCheck className="w-3.5 h-3.5 text-saffron" />
                </h3>
                <p className="text-[10px] text-slate-200">Official Government Scheme Visualizer</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-300 hover:text-white p-1 rounded-full hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Chat Content */}
          <div className="p-4 space-y-3 text-xs">
            <div className="bg-surface p-3 rounded-2xl border border-outline-variant/40 space-y-1.5">
              <p className="font-bold text-on-surface flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-saffron" /> Namaste! How can I help you today?
              </p>
              <p className="text-on-surface-variant text-[11px] leading-relaxed">
                Ask about scheme eligibility, required documents, or application procedures.
              </p>
            </div>

            {/* Suggested Quick Prompts */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase text-outline block">Quick Questions:</span>
              <div className="space-y-1">
                {[
                  "Which scholarship schemes am I eligible for?",
                  "What documents are needed for PM Vidyalaxmi?",
                  "How to apply for Maharashtra state schemes?"
                ].map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      navigate(`/chatbot?query=${encodeURIComponent(prompt)}`);
                      setIsOpen(false);
                    }}
                    className="w-full text-left p-2 bg-surface-container-high hover:bg-primary/10 text-on-surface hover:text-primary rounded-xl font-medium text-[11px] transition-colors flex items-center justify-between"
                  >
                    <span>{prompt}</span>
                    <ArrowRight className="w-3 h-3 shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Question Input Form */}
            <form onSubmit={handleQuickSubmit} className="pt-2 flex gap-1.5">
              <input
                type="text"
                placeholder="Type your question..."
                value={quickInput}
                onChange={(e) => setQuickInput(e.target.value)}
                className="flex-1 px-3 py-2 bg-surface border border-outline-variant/60 rounded-xl text-xs focus:ring-2 focus:ring-primary focus:outline-none"
              />
              <button
                type="submit"
                className="py-2 px-3 bg-primary text-white font-bold rounded-xl text-xs hover:bg-primary-container flex items-center justify-center"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <button
              onClick={() => {
                navigate('/chatbot');
                setIsOpen(false);
              }}
              className="w-full py-2 text-center text-primary text-[11px] font-extrabold hover:underline block pt-1"
            >
              Open Full AI Chatbot Assistant →
            </button>
          </div>

        </div>
      )}
    </>
  );
}
