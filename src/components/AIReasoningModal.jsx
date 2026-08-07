import React, { useState, useEffect } from 'react';
import { Cpu, CheckCircle2, Loader2, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { translations } from '../data/translations';

export default function AIReasoningModal({ profile, onComplete, language }) {
  const t = translations[language] || translations.EN;
  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = [
    { text: "Initializing BharatAI reasoning model PS01...", detail: "Loading central policy decision matrix & rule definitions." },
    { text: `Parsing user profile (Age: ${profile.age || 22}, State: ${profile.state || 'Maharashtra'})...`, detail: "Extracting demographic eligibility parameters." },
    { text: `Evaluating annual family income cap (₹${Number(profile.income || 250000).toLocaleString('en-IN')})...`, detail: "Checking state and central income ceiling tiers." },
    { text: `Verifying occupation (${profile.occupation || 'Student'}) & education level...`, detail: "Cross-referencing targeted scheme benefit categories." },
    { text: "Calculating policy match scores & confidence weights...", detail: "Applying soft AI scoring algorithm and hard rule filters." },
    { text: "Evaluating document readiness checklist...", detail: "Preparing required document verification matrix." },
    { text: "Reasoning stream completed successfully!", detail: "Generating ranked scheme recommendation list." }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 1.5;
      });
    }, 50);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const stepDuration = 700;
    const stepTimer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        clearInterval(stepTimer);
        return prev;
      });
    }, stepDuration);

    return () => clearInterval(stepTimer);
  }, [steps.length]);

  return (
    <div className="w-full max-w-3xl mx-auto pt-8 pb-12 px-4">
      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-3xl shadow-xl p-6 md:p-10 space-y-8">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-outline-variant/40 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Cpu className="w-7 h-7 text-primary animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
                {t.reasoningTitle}
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-saffron/15 text-saffron">
                  <Sparkles className="w-3 h-3 mr-1" /> Live Stream
                </span>
              </h2>
              <p className="text-xs text-on-surface-variant">{t.reasoningSubtitle}</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-semibold text-outline uppercase tracking-wider">{t.confidenceLabel}</span>
            <div className="text-2xl font-black text-emerald-600">96.4%</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold text-on-surface-variant">
            <span>AI Rule Processing Engine</span>
            <span>{Math.min(Math.round(progress), 100)}%</span>
          </div>
          <div className="w-full h-3 bg-surface-container-high rounded-full overflow-hidden p-0.5">
            <div 
              className="h-full bg-gradient-to-r from-primary via-secondary-container to-emerald-500 rounded-full transition-all duration-300 shadow-sm"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        {/* Live Stream Terminal */}
        <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 font-mono text-xs space-y-3.5 shadow-inner border border-slate-800 max-h-72 overflow-y-auto">
          {steps.slice(0, currentStepIndex + 1).map((step, idx) => (
            <div key={idx} className="flex items-start gap-3 animate-fadeIn">
              {idx === currentStepIndex && progress < 100 ? (
                <Loader2 className="w-4 h-4 text-saffron animate-spin shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              )}
              <div>
                <div className="font-semibold text-slate-100">{step.text}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{step.detail}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Action button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onComplete}
            disabled={progress < 30}
            className={`py-3.5 px-8 rounded-xl font-bold text-sm shadow-md flex items-center gap-2 transition-all cursor-pointer ${
              progress >= 30
                ? 'bg-primary hover:bg-primary-container text-white shadow-primary/20'
                : 'bg-surface-container-high text-outline cursor-not-allowed'
            }`}
          >
            <span>{t.viewScoredSchemes}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
