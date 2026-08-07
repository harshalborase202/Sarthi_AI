import React, { useState, useEffect } from 'react';
import { useMemory, MemoryItem, MemoryScope } from '../context/MemoryContext';
import { BrainCircuit, X } from 'lucide-react';

export interface ConsentRequest {
  id: string;
  category: MemoryItem['category'];
  fact: string;
  sourceContext: string;
}

// Global event bus for triggering toasts (simplifies passing state down deeply)
export const triggerMemoryConsent = (request: Omit<ConsentRequest, 'id'>) => {
  const event = new CustomEvent('memoryConsentRequested', {
    detail: { ...request, id: Math.random().toString(36).substring(7) }
  });
  window.dispatchEvent(event);
};

export const MemoryConsentToast: React.FC = () => {
  const [requests, setRequests] = useState<ConsentRequest[]>([]);
  const { addMemory } = useMemory();

  useEffect(() => {
    const handleRequest = (e: Event) => {
      const customEvent = e as CustomEvent<ConsentRequest>;
      setRequests(prev => [...prev, customEvent.detail]);
    };

    window.addEventListener('memoryConsentRequested', handleRequest);
    return () => window.removeEventListener('memoryConsentRequested', handleRequest);
  }, []);

  if (requests.length === 0) return null;

  const handleDecision = (request: ConsentRequest, scope: MemoryScope | 'reject') => {
    if (scope !== 'reject') {
      addMemory({
        category: request.category,
        fact: request.fact,
        sourceContext: request.sourceContext,
        scope: scope,
      });
    }
    setRequests(prev => prev.filter(r => r.id !== request.id));
  };

  const current = requests[0];

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 left-4 md:left-auto md:w-96 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden flex flex-col">
        <div className="p-4 bg-primary-50 border-b border-primary-100 flex items-start gap-3">
          <div className="p-2 bg-primary-100 text-primary-700 rounded-full shrink-0">
            <BrainCircuit size={20} />
          </div>
          <div className="flex-grow">
            <h4 className="font-semibold text-primary-900 text-sm">New Detail Noticed</h4>
            <p className="text-xs text-primary-800/80 mt-1 leading-snug">
              I noticed: <span className="font-semibold text-primary-700">"{current.fact}"</span>
            </p>
          </div>
          <button 
            onClick={() => handleDecision(current, 'session')} 
            className="text-slate-400 hover:text-slate-600"
            title="Dismiss (Defaults to session only)"
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="p-3 bg-white flex flex-col gap-2">
          <p className="text-xs text-slate-500 font-medium px-1">Should I remember this for next time?</p>
          <div className="grid grid-cols-1 gap-2">
            <button 
              onClick={() => handleDecision(current, 'long-term')}
              className="w-full text-left px-3 py-2 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors flex items-center justify-between"
            >
              Remember long-term
              <span className="text-[10px] font-normal opacity-80">Cross-session</span>
            </button>
            <button 
              onClick={() => handleDecision(current, 'session')}
              className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              This session only
            </button>
            <button 
              onClick={() => handleDecision(current, 'reject')}
              className="w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Do not remember
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
