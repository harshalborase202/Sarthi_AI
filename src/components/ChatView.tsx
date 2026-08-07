import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useMemory } from '../context/MemoryContext';
import { Send, BookOpen, ExternalLink, Brain, Sparkles, ShieldCheck } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  schemeCard?: {
    title: string;
    ministry: string;
    eligibility: string;
    officialUrl: string;
  };
  citation?: string;
  memoryPrompt?: {
    fact: string;
    category: 'About You' | 'Preferences' | 'Scheme Interests';
  };
}

const initialMessages: ChatMessage[] = [
  {
    id: '1',
    sender: 'user',
    text: 'Am I eligible for PM-KISAN scheme in Maharashtra?'
  },
  {
    id: '2',
    sender: 'assistant',
    text: 'Based on verified government guidelines, PM-KISAN provides income support of ₹6,000/year to landholding farmer families.',
    schemeCard: {
      title: 'PM-KISAN Samman Nidhi',
      ministry: 'Ministry of Agriculture & Farmers Welfare',
      eligibility: 'Eligible (Small / Marginal Farmer)',
      officialUrl: 'https://pmkisan.gov.in'
    },
    citation: 'Source: pmkisan.gov.in (Verified Official Portal)',
    memoryPrompt: {
      fact: 'Small/Marginal Farmer in Maharashtra (1.5 Ha Land)',
      category: 'About You'
    }
  }
];

export const ChatView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputQuery, setInputQuery] = useState<string>('');
  const { t } = useLanguage();
  const { addMemory } = useMemory();
  const [respondedMemoryIds, setRespondedMemoryIds] = useState<Record<string, boolean>>({});

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputQuery.trim()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');

    // Simulate AI response
    setTimeout(() => {
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: 'Ayushman Bharat PM-JAY offers health insurance coverage up to ₹5,000,000 per family/year for secondary & tertiary hospital care.',
        schemeCard: {
          title: 'Ayushman Bharat PM-JAY',
          ministry: 'Ministry of Health and Family Welfare',
          eligibility: 'Highly Eligible (SECC Database Match)',
          officialUrl: 'https://pmjay.gov.in'
        },
        citation: 'Source: pmjay.gov.in (Verified Portal)',
        memoryPrompt: {
          fact: 'Interested in Health Insurance Cover for Family',
          category: 'Preferences'
        }
      };
      setMessages(prev => [...prev, botMsg]);
    }, 1000);
  };

  const handleMemoryChoice = (msgId: string, fact: string, category: 'About You' | 'Preferences' | 'Scheme Interests', scope: 'long-term' | 'session' | 'reject') => {
    if (scope !== 'reject') {
      addMemory({
        category,
        fact,
        sourceContext: 'SarkarSaathi Chat Session',
        scope
      });
    }
    setRespondedMemoryIds(prev => ({ ...prev, [msgId]: true }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col h-[calc(100vh-140px)] animate-in fade-in duration-300">
      
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 p-2 md:p-4">
        
        {/* Top Banner */}
        <div className="bg-[#1b4d89]/10 border border-[#1b4d89]/20 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="text-[#1b4d89]" size={20} />
            <div>
              <h3 className="text-sm font-bold text-[#00366b]">SarkarSaathi AI Guide</h3>
              <p className="text-xs text-[#424750]">Ask questions in plain language (English, हिंदी, मराठी)</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#035a00] font-bold bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            <ShieldCheck size={14} /> Official Data
          </div>
        </div>

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[90%] sm:max-w-[75%] rounded-2xl p-4 shadow-sm space-y-3 ${
                msg.sender === 'user'
                  ? 'bg-[#00366b] text-white rounded-tr-none'
                  : 'bg-white border border-[#c3c6d1] text-[#0F1B36] rounded-tl-none'
              }`}
            >
              <p className="text-sm leading-relaxed">{msg.text}</p>

              {/* Scheme Card Component in Chat */}
              {msg.schemeCard && (
                <div className="border-l-4 border-l-[#1b4d89] bg-[#f7f9fb] p-3.5 rounded-r-xl border border-[#c3c6d1] space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-[#00366b] text-sm">{msg.schemeCard.title}</h4>
                    <span className="text-[10px] font-semibold bg-[#eceef0] text-[#424750] px-2 py-0.5 rounded">
                      {msg.schemeCard.ministry}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-[#035a00]">
                    ✅ {msg.schemeCard.eligibility}
                  </p>
                  <a
                    href={msg.schemeCard.officialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#1b4d89] hover:underline"
                  >
                    Official Portal Details <ExternalLink size={12} />
                  </a>
                </div>
              )}

              {/* Citation Footer */}
              {msg.citation && (
                <div className="bg-[#f2f4f6] px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-[11px] font-semibold text-[#424750]">
                  <BookOpen size={12} className="text-[#1b4d89]" />
                  <span>{msg.citation}</span>
                </div>
              )}

              {/* Inline Memory Negotiation Prompt */}
              {msg.memoryPrompt && !respondedMemoryIds[msg.id] && (
                <div className="bg-[#7C3AED]/10 border border-[#7C3AED]/30 rounded-xl p-3.5 space-y-2 animate-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#7C3AED]">
                    <Brain size={16} />
                    <span>Memory Consent Prompt</span>
                  </div>
                  <p className="text-xs text-[#0F1B36] leading-snug">
                    I noticed: <strong className="text-[#7C3AED]">"{msg.memoryPrompt.fact}"</strong>. Save this to your profile memory?
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      onClick={() => handleMemoryChoice(msg.id, msg.memoryPrompt!.fact, msg.memoryPrompt!.category, 'long-term')}
                      className="px-2.5 py-1 text-xs font-bold bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9] transition-colors"
                    >
                      🟣 Remember Long-term
                    </button>
                    <button
                      onClick={() => handleMemoryChoice(msg.id, msg.memoryPrompt!.fact, msg.memoryPrompt!.category, 'session')}
                      className="px-2.5 py-1 text-xs font-bold bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                    >
                      🟠 This Session Only
                    </button>
                    <button
                      onClick={() => handleMemoryChoice(msg.id, msg.memoryPrompt!.fact, msg.memoryPrompt!.category, 'reject')}
                      className="px-2 py-1 text-xs font-semibold bg-[#eceef0] text-[#424750] hover:bg-[#e0e3e5] rounded-lg"
                    >
                      Do Not Remember
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="p-2 md:p-4 bg-white border-t border-[#c3c6d1] flex items-center gap-2">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder={t('chat.placeholder')}
          className="flex-1 px-4 py-3 bg-[#f7f9fb] border border-[#c3c6d1] rounded-xl text-sm text-[#0F1B36] focus:outline-none focus:ring-2 focus:ring-[#1b4d89]"
        />
        <button
          type="submit"
          className="bg-[#1b4d89] hover:bg-[#00366b] text-white font-bold px-5 py-3 rounded-xl flex items-center gap-1.5 transition-all active:scale-95"
        >
          <span>{t('chat.send')}</span>
          <Send size={16} />
        </button>
      </form>

    </div>
  );
};
