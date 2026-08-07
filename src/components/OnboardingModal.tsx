import React from 'react';
import { useMemory } from '../context/MemoryContext';
import { ShieldCheck, Brain, Lock } from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const { setHasSeenOnboarding } = useMemory();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F1B36]/60 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 md:p-8 space-y-6 relative animate-in zoom-in-95 duration-200 border border-[#c3c6d1]">
        
        <div className="w-14 h-14 rounded-full bg-[#7C3AED]/10 text-[#7C3AED] flex items-center justify-center mx-auto mb-2">
          <Brain size={32} />
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-[#00366b]">Welcome to SarkarSaathi</h2>
          <p className="text-xs md:text-sm text-[#424750] leading-relaxed">
            Your AI Government Guide with <strong>Transparent Negotiated Memory</strong>.
          </p>
        </div>

        <div className="space-y-3 bg-[#f7f9fb] p-4 rounded-xl border border-[#c3c6d1] text-xs">
          <div className="flex gap-3 items-start">
            <ShieldCheck className="text-[#035a00] shrink-0 mt-0.5" size={18} />
            <div>
              <h4 className="font-bold text-[#0F1B36]">You Control What is Saved</h4>
              <p className="text-[#424750] mt-0.5">Whenever SarkarSaathi infers a profile fact, you decide whether to save it long-term or for this session only.</p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <Lock className="text-[#1b4d89] shrink-0 mt-0.5" size={18} />
            <div>
              <h4 className="font-bold text-[#0F1B36]">Zero Secret Tracking</h4>
              <p className="text-[#424750] mt-0.5">Review, edit, or delete any memory fact anytime in the Memory Panel.</p>
            </div>
          </div>
        </div>

        <button 
          onClick={() => setHasSeenOnboarding(true)}
          className="w-full bg-[#1b4d89] hover:bg-[#00366b] text-white font-bold py-3 rounded-xl transition-all shadow-sm active:scale-[0.99]"
        >
          I Agree, Let's Begin
        </button>
      </div>
    </div>
  );
};
