import React from 'react';
import { useMemory } from '../context/MemoryContext';
import { ShieldCheck, BrainCircuit, Check } from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const { setHasSeenOnboarding } = useMemory();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 md:p-8 space-y-6 relative animate-in fade-in zoom-in duration-300">
        
        <div className="flex items-center justify-center w-16 h-16 bg-primary-50 text-primary-600 rounded-full mx-auto mb-4">
          <BrainCircuit size={32} />
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">Welcome to SathiAI</h2>
          <p className="text-slate-600">Your companion for government schemes. We put you in control of your data.</p>
        </div>

        <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="flex gap-3 items-start">
            <ShieldCheck className="text-emerald-500 shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="font-semibold text-slate-800 text-sm">You control your memory</h4>
              <p className="text-xs text-slate-600 mt-1">When we notice a detail about you (like your state or profession), we'll ask if you want us to remember it for next time.</p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <Check className="text-primary-500 shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="font-semibold text-slate-800 text-sm">Clear it anytime</h4>
              <p className="text-xs text-slate-600 mt-1">Visit the Memory Dashboard anytime to see, edit, or clear what SathiAI remembers. Nothing is hidden.</p>
            </div>
          </div>
        </div>

        <button 
          onClick={() => setHasSeenOnboarding(true)}
          className="w-full bg-primary-600 text-white font-semibold py-3 rounded-lg hover:bg-primary-700 transition-colors"
        >
          I Understand, Let's Start
        </button>
      </div>
    </div>
  );
};
