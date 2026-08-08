import React, { useState, useEffect } from 'react';
import { Cpu, CheckCircle2, Loader2, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { translations } from '../data/translations';

export default function AIReasoningModal({ profile, onComplete, language }) {
  const t = translations[language] || translations.EN;
  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = [
    { text: "Initializing SarthiAI reasoning model...", detail: "Loading central policy decision matrix & rule definitions." },
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
              <Cpu className="w-6 h-6 text-saffron" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-black text-primary">{t.reasoningTitle}</h1>
              </div>
              <p className="text-xs text-on-surface-variant mt-1">{t.reasoningSubtitle}</p>
            </div>
          </div>
        </div>

        {/* Live Progress Bar Section */}
        <div className="space-y-3 bg-surface p-6 rounded-2xl border border-outline-variant/40">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-on-surface flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-saffron animate-pulse" /> Stream Progress
            </span>
            <span className="text-primary font-mono text-sm">{Math.round(progress)}%</span>
          </div>

          <div className="w-full bg-surface-variant rounded-full h-3 overflow-hidden p-0.5">
            <div 
              className="bg-gradient-to-r from-primary via-secondary-container to-saffron h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-on-surface-variant">
            <span>{t.confidenceLabel}: <strong className="text-emerald-700">96.4% High</strong></span>
            <span>Latency: <strong className="text-primary">120ms</strong></span>
          </div>
        </div>

        {/* Real-time Reasoning Logs Timeline */}
        <div className="space-y-4">
          <h2 className="text-xs font-extrabold uppercase text-outline tracking-wider">
            Live Field Rationale & Policy Trace
          </h2>

          <div className="space-y-3">
            {steps.map((step, idx) => {
              const isDone = idx < currentStepIndex || progress >= 100;
              const isCurrent = idx === currentStepIndex && progress < 100;

              return (
                <div 
                  key={idx}
                  className={`p-4 rounded-2xl border transition-all duration-300 flex items-start gap-3.5 ${
                    isCurrent
                      ? 'bg-primary/5 border-primary/30 shadow-sm'
                      : isDone
                      ? 'bg-surface border-outline-variant/40 opacity-90'
                      : 'bg-surface/40 border-dashed border-outline-variant/30 opacity-40'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : isCurrent ? (
                      <Loader2 className="w-5 h-5 text-saffron animate-spin" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-outline-variant flex items-center justify-center text-[10px] text-outline">
                        {idx + 1}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <p className={`text-xs md:text-sm font-bold ${isCurrent ? 'text-primary' : 'text-on-surface'}`}>
                      {step.text}
                    </p>
                    <p className="text-[11px] text-on-surface-variant">
                      {step.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-outline-variant/40">
          <button
            onClick={onComplete}
            disabled={progress < 100}
            className={`w-full py-4 px-6 font-bold text-sm md:text-base rounded-2xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2 ${
              progress >= 100
                ? 'bg-primary hover:bg-primary-container text-white cursor-pointer hover:shadow-xl'
                : 'bg-surface-variant text-outline cursor-not-allowed'
            }`}
          >
            <span>{progress >= 100 ? t.viewScoredSchemes : 'Evaluating Policy Matrix...'}</span>
            {progress >= 100 && <ArrowRight className="w-5 h-5 text-saffron" />}
          </button>
        </div>

      </div>
    </div>
  );
}
