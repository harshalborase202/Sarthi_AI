import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bot, User, Send, Sparkles, Brain, Save, CheckCircle2, XCircle,
  Clock, ShieldAlert, ArrowRight, RefreshCw, HelpCircle, MessageSquare, 
  ChevronRight, X, ExternalLink, ShieldCheck, FileText, Award, Layers
} from 'lucide-react';
import { translations } from '../data/translations';

export default function SchemeChatbot({ profile, language }) {
  const navigate = useNavigate();
  const t = translations[language] || translations.EN;
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: 'welcome_1',
      sender: 'bot',
      text: language === 'HI'
        ? '👋 **नमस्ते! मैं Sarthi AI योजना अधिकारी हूँ।**\n\nमैं आपकी प्रोफ़ाइल (आयु, राज्य, व्यवसाय) के आधार पर सरकारी योजनाओं की तत्काल जाँच करता हूँ। आप मुझसे किसी भी योजना या पात्रता के बारे में पूछ सकते हैं।'
        : language === 'MR'
        ? '👋 **नमस्कार! मी Sarthi AI योजना अधिकारी आहे.**\n\nमी तुमच्या प्रोफाइलनुसार (वय, राज्य, व्यवसाय) शासकीय योजनांची पडताळणी करतो. कोणत्याही योजनेबद्दल विचारू शकता.'
        : "👋 **Hello! I'm Sarthi AI Senior Welfare Officer & Personal Assistant.**\n\nI cross-reference government policy rules against your actual profile to deliver clear, scan-able eligibility cards, document checklists, and verified official recommendations.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      savedStatus: null
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [activeMemoryModalMsg, setActiveMemoryModalMsg] = useState(null);
  const [selectedRetention, setSelectedRetention] = useState('until_delete');
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(null);

  // Loading steps animation
  const LOADING_STEPS = [
    "🔍 Checking official government sources (myscheme.gov.in)...",
    `👤 Cross-referencing your profile (${profile?.occupation || 'Student'}, ${profile?.state || 'Maharashtra'}, Income: ₹${parseInt(profile?.income || 250000).toLocaleString('en-IN')})...`,
    "✨ Structuring scan-able eligibility & document cards..."
  ];

  // Quick prompt chips
  const SAMPLE_QUESTIONS = language === 'HI' ? [
    'PM-KISAN योजना की क्या पात्रता और लाभ हैं?',
    'मैं बेरोजगार हूँ — मेरे लिए कौन-सी योजनाएँ उपलब्ध हैं?',
    'आयुष्मान भारत कार्ड के लिए आवश्यक दस्तावेज क्या हैं?',
    'छात्रों के लिए कौन-सी मुख्य स्कॉलरशिप योजनाएं उपलब्ध हैं?'
  ] : language === 'MR' ? [
    'PM-KISAN योजनेचे काय फायदे आणि पात्रता आहे?',
    'मी सुशिक्षित बेरोजगार आहे — कोणत्या योजना आहेत?',
    'आयुष्मान भारत कार्डसाठी कोणती कागदपत्रे लागतात?',
    'विद्यार्थ्यांसाठी कोणत्या शिष्यवृत्ती योजना आहेत?'
  ] : [
    'What are eligibility criteria and benefits of PM-KISAN?',
    'I am unemployed — what schemes match my profile?',
    'What documents are required for Ayushman Bharat health card?',
    'What government scholarships are available for graduate students?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, loadingStepIndex]);

  // Loading animation step timer
  useEffect(() => {
    if (!isLoading) {
      setLoadingStepIndex(0);
      return;
    }
    const timer = setInterval(() => {
      setLoadingStepIndex((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
    }, 1200);
    return () => clearInterval(timer);
  }, [isLoading]);

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputText;
    if (!query.trim() || isLoading) return;

    const userMsgId = `user_${Date.now()}`;
    const userMsg = {
      id: userMsgId,
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsLoading(true);

    try {
      const historyPayload = messages
        .filter(m => m.sender === 'user' || m.sender === 'bot')
        .slice(-6)
        .map(m => ({
          role: m.sender === 'user' ? 'user' : 'model',
          content: m.text
        }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query.trim(),
          history: historyPayload,
          profile: profile || null,
          language: language || 'EN'
        })
      });

      const data = await res.json();
      const botReply = data.reply || (
        language === 'HI'
          ? "क्षमा करें, मुझे इस समय उत्तर प्राप्त करने में समस्या आ रही है।"
          : "I'm sorry, I encountered an issue retrieving an answer."
      );

      const botMsgId = `bot_${Date.now()}`;
      setMessages(prev => [
        ...prev,
        {
          id: botMsgId,
          sender: 'bot',
          userQuestion: query.trim(),
          text: botReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          savedStatus: null
        }
      ]);
    } catch (err) {
      console.error("Chat API error:", err);
      const botMsgId = `bot_${Date.now()}`;
      setMessages(prev => [
        ...prev,
        {
          id: botMsgId,
          sender: 'bot',
          userQuestion: query.trim(),
          text: language === 'HI'
            ? "💡 **Sarthi AI ऑफ़लाइन मोड (Offline Mode)**:\n\nनेटवर्क प्रतिक्रिया प्राप्त नहीं हो सकी। अपनी योजना पात्रता देखने के लिए प्रोफाइल पृष्ठ पर जाएँ।"
            : "💡 **Sarthi AI Offline Mode**:\n\nUnable to establish live API stream. Switch to the Services tab to view your matched scheme rules.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          savedStatus: null
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveMemoryQuick = async (msg, retentionChoice) => {
    const question = msg.userQuestion || "Scheme Inquiry";
    const answer = msg.text;
    const cardId = `qa_${Date.now()}`;

    let statusKey = retentionChoice;
    let badgeText = '✓ Remembered until you delete it';
    let badgeStyle = 'bg-emerald-50 text-emerald-800 border-emerald-300';
    let expiryDateStr = null;

    if (retentionChoice === '30_days') {
      const expDate = new Date();
      expDate.setDate(expDate.getDate() + 30);
      expiryDateStr = expDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
      badgeText = `⏳ Remembered for 30 days — expires ${expiryDateStr}`;
      badgeStyle = 'bg-amber-50 text-amber-900 border-amber-300';
    } else if (retentionChoice === 'session_only') {
      badgeText = '💬 Session only — deleted on tab close';
      badgeStyle = 'bg-slate-100 text-slate-600 border-slate-300 opacity-80';
    } else if (retentionChoice === 'never_stored') {
      badgeText = '🔒 Never stored — discarded';
      badgeStyle = 'bg-slate-100 text-slate-700 border-slate-300';
    }

    const memoryCard = {
      id: cardId,
      title: `Q: ${question.length > 50 ? question.slice(0, 47) + '...' : question}`,
      iconName: 'messageSquare',
      speechBubble: answer.length > 150 ? answer.slice(0, 147) + '...' : answer,
      status: statusKey,
      expiryDate: expiryDateStr,
      badgeText,
      badgeStyle,
      dataKey: 'scheme_qa',
      dataValue: JSON.stringify({ question, answer, date: new Date().toISOString() })
    };

    try {
      const existingCards = JSON.parse(localStorage.getItem('sarthi_memory_center_cards') || '[]');
      const updatedCards = [memoryCard, ...existingCards.filter(c => c.id !== cardId)];
      localStorage.setItem('sarthi_memory_center_cards', JSON.stringify(updatedCards));
    } catch (e) {}

    if (retentionChoice !== 'never_stored') {
      try {
        await fetch('/api/memory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: memoryCard.title,
            speechBubble: memoryCard.speechBubble,
            iconName: 'messageSquare',
            status: statusKey,
            dataKey: 'scheme_qa',
            dataValue: memoryCard.dataValue
          })
        });
      } catch (err) {}
    }

    setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, savedStatus: statusKey } : m));
    setSaveSuccessNotice(
      retentionChoice === 'never_stored'
        ? 'Q&A marked as not stored.'
        : `Q&A saved to Memory Center (${retentionChoice === 'until_delete' ? 'Permanent' : '30 Days'})!`
    );
    setTimeout(() => setSaveSuccessNotice(null), 4000);
  };

  // Render Card-based Scan-able formatting for AI Bot Messages
  const renderBotMessageContent = (msg) => {
    const text = msg.text || '';

    return (
      <div className="space-y-3.5">
        {/* Visual Header Badge */}
        <div className="flex items-center justify-between border-b border-outline-variant/50 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-black uppercase tracking-wider text-primary dark:text-primary-fixed">
              Government Officer AI Verdict
            </span>
          </div>
          <span className="text-[10px] bg-primary/10 text-primary font-bold px-2.5 py-0.5 rounded-full">
            Verified Source
          </span>
        </div>

        {/* Formatted Text Markdown Blocks */}
        <div className="prose prose-sm dark:prose-invert max-w-none text-xs leading-relaxed space-y-2 text-on-surface">
          {text.split('\n\n').map((paragraph, pIdx) => {
            if (paragraph.startsWith('🌾') || paragraph.startsWith('💰') || paragraph.startsWith('📌')) {
              return (
                <div key={pIdx} className="bg-surface-container border border-outline-variant/60 rounded-2xl p-3.5 shadow-sm space-y-1">
                  <div className="font-extrabold text-sm text-primary dark:text-primary-fixed flex items-center gap-2">
                    {paragraph.split('\n')[0]}
                  </div>
                  {paragraph.split('\n').slice(1).map((line, lIdx) => (
                    <p key={lIdx} className="text-xs text-on-surface-variant leading-relaxed">
                      {line}
                    </p>
                  ))}
                </div>
              );
            }

            if (paragraph.startsWith('👤') || paragraph.startsWith('🚦') || paragraph.startsWith('❓')) {
              const isNotEligible = paragraph.includes('NOT eligible') || paragraph.includes('पात्र नहीं');
              const isEligible = paragraph.includes('ELIGIBLE') || paragraph.includes('पात्र हैं');

              return (
                <div 
                  key={pIdx} 
                  className={`border rounded-2xl p-3.5 space-y-1.5 ${
                    isNotEligible 
                      ? 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-300 text-amber-950 dark:text-amber-200' 
                      : isEligible
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-300 text-emerald-950 dark:text-emerald-200'
                      : 'bg-surface-container border-outline-variant'
                  }`}
                >
                  <div className="font-extrabold text-xs flex items-center gap-1.5">
                    {paragraph.split('\n')[0]}
                  </div>
                  <div className="text-xs space-y-1 opacity-90">
                    {paragraph.split('\n').slice(1).map((line, lIdx) => (
                      <div key={lIdx} className="flex items-start gap-1.5">
                        <span className="mt-0.5">{line}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            if (paragraph.startsWith('📄')) {
              return (
                <div key={pIdx} className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-3.5 space-y-2 shadow-sm">
                  <div className="font-bold text-xs text-on-surface flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-primary" /> Required Documents Checklist
                  </div>
                  <div className="text-xs space-y-1 text-on-surface-variant font-medium">
                    {paragraph.split('\n').slice(1).map((line, lIdx) => (
                      <div key={lIdx} className="flex items-center gap-2">
                        {line}
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            if (paragraph.startsWith('💡')) {
              return (
                <div key={pIdx} className="bg-primary/5 border border-primary/20 rounded-2xl p-3.5 space-y-1">
                  <div className="font-extrabold text-xs text-primary flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-saffron" /> AI Simplifier (In Simple Words)
                  </div>
                  <p className="text-xs italic text-on-surface-variant">
                    {paragraph.replace('💡 **In Simple Words (AI Simplifier)**:', '').replace('💡 **सरल शब्दों में (AI Simplifier)**:', '')}
                  </p>
                </div>
              );
            }

            if (paragraph.startsWith('🟢')) {
              return (
                <div key={pIdx} className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300/80 rounded-2xl p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-200">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Official Portal Verified</span>
                  </div>
                  <div className="text-[11px] font-extrabold text-emerald-700 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full">
                    98% Confidence
                  </div>
                </div>
              );
            }

            return (
              <p key={pIdx} className="text-xs text-on-surface leading-relaxed whitespace-pre-line">
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* Action Buttons & Follow-Up Chips under every Bot Answer */}
        {msg.id !== 'welcome_1' && (
          <div className="pt-2 border-t border-outline-variant/40 space-y-2.5">
            
            {/* Follow-up Action Chips */}
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => handleSendMessage(`What documents do I need for ${msg.userQuestion || 'this scheme'}?`)}
                className="text-[11px] font-bold bg-surface-container hover:bg-surface-container-high border border-outline-variant text-on-surface px-2.5 py-1 rounded-full transition-all active:scale-95 flex items-center gap-1"
              >
                📄 Show Documents
              </button>
              <button
                onClick={() => handleSendMessage(`Explain ${msg.userQuestion || 'this scheme'} in simple words`)}
                className="text-[11px] font-bold bg-surface-container hover:bg-surface-container-high border border-outline-variant text-on-surface px-2.5 py-1 rounded-full transition-all active:scale-95 flex items-center gap-1"
              >
                💡 Explain Simply
              </button>
              <button
                onClick={() => navigate('/services')}
                className="text-[11px] font-bold bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary px-2.5 py-1 rounded-full transition-all active:scale-95 flex items-center gap-1"
              >
                ⭐ View My Recommendations
              </button>
            </div>

            {/* Retention Saver "Save This?" Card Footer */}
            <div className="bg-surface-container-low border border-outline-variant/60 rounded-2xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-on-surface">
                <Brain className="w-4 h-4 text-primary" />
                <span>Save This Q&A?</span>
              </div>

              {msg.savedStatus ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Saved ({msg.savedStatus === 'until_delete' ? 'Permanent' : msg.savedStatus === '30_days' ? '30 Days' : 'Session'})
                </span>
              ) : (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    onClick={() => handleSaveMemoryQuick(msg, 'until_delete')}
                    className="text-[11px] font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-lg transition-all shadow-sm active:scale-95 flex items-center gap-1"
                  >
                    🟢 Remember
                  </button>
                  <button
                    onClick={() => handleSaveMemoryQuick(msg, '30_days')}
                    className="text-[11px] font-bold bg-amber-500 hover:bg-amber-600 text-white px-2.5 py-1 rounded-lg transition-all shadow-sm active:scale-95 flex items-center gap-1"
                  >
                    ⏳ 30 Days
                  </button>
                  <button
                    onClick={() => handleSaveMemoryQuick(msg, 'never_stored')}
                    className="text-[11px] font-medium bg-slate-200 hover:bg-slate-300 text-slate-800 px-2.5 py-1 rounded-lg transition-all active:scale-95"
                  >
                    🔒 Don't Save
                  </button>
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto pt-2 pb-24 px-3 sm:px-6 flex flex-col h-[calc(100vh-6rem)]">
      
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-primary via-primary-container to-secondary text-white p-4 sm:p-5 rounded-3xl shadow-lg mb-3 flex-shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-saffron/20 border border-saffron/40 flex items-center justify-center text-saffron shadow-sm">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black tracking-tight flex items-center gap-2">
              Sarthi AI Scheme Assistant
              <span className="text-[10px] bg-saffron text-primary font-black px-2 py-0.5 rounded-full uppercase">
                Govt Officer Mode
              </span>
            </h1>
            <p className="text-xs text-slate-200 hidden sm:block font-medium">
              Profile-aware eligibility checks, scan-able cards, official portal verification, and instant memory saving.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/memory')}
          className="flex items-center gap-1.5 text-xs font-bold bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-xl border border-white/20 transition-all shadow-sm"
        >
          <Brain className="w-4 h-4 text-saffron" />
          <span>Memory Center</span>
        </button>
      </div>

      {/* Success Toast Notification */}
      {saveSuccessNotice && (
        <div className="bg-emerald-600 text-white px-4 py-2.5 rounded-2xl text-xs font-semibold shadow-md mb-3 flex items-center justify-between animate-fade-in flex-shrink-0">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{saveSuccessNotice}</span>
          </div>
          <button onClick={() => navigate('/memory')} className="underline hover:text-emerald-100 flex items-center gap-1 font-bold">
            View Memory <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Chat Messages List Window */}
      <div className="flex-1 overflow-y-auto bg-surface dark:bg-surface-container-low border border-outline-variant rounded-3xl p-4 sm:p-5 space-y-4 shadow-sm">
        
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1.5`}
          >
            <div className={`flex items-start gap-2.5 max-w-[96%] sm:max-w-[88%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              
              {/* Avatar Icon */}
              <div className={`w-8 h-8 rounded-2xl flex items-center justify-center flex-shrink-0 text-white text-xs font-bold shadow-sm ${
                msg.sender === 'user' ? 'bg-secondary' : 'bg-primary'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-saffron" />}
              </div>

              {/* Message Bubble Content */}
              <div className={`rounded-3xl p-4 text-sm shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-primary text-white rounded-tr-none'
                  : 'bg-surface-container border border-outline-variant text-on-surface rounded-tl-none w-full'
              }`}>
                {msg.sender === 'user' ? (
                  <p className="whitespace-pre-line">{msg.text}</p>
                ) : (
                  renderBotMessageContent(msg)
                )}
                <div className="text-[10px] opacity-60 mt-2 text-right">
                  {msg.timestamp}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Animated Reasoning Indicator ("Make AI Feel Alive") */}
        {isLoading && (
          <div className="flex items-center gap-2.5 text-on-surface-variant text-xs font-medium p-2">
            <div className="w-8 h-8 rounded-2xl bg-primary flex items-center justify-center text-white">
              <Bot className="w-4 h-4 text-saffron animate-bounce" />
            </div>
            <div className="bg-surface-container border border-outline-variant px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-3 shadow-sm max-w-md">
              <RefreshCw className="w-4 h-4 animate-spin text-primary shrink-0" />
              <span className="font-semibold text-xs text-primary dark:text-primary-fixed">
                {LOADING_STEPS[loadingStepIndex]}
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Sample Questions Chips */}
      <div className="py-2.5 overflow-x-auto flex items-center gap-2 flex-shrink-0 no-scrollbar">
        <span className="text-[11px] font-bold text-on-surface-variant whitespace-nowrap flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-saffron" /> Quick Actions:
        </span>
        {SAMPLE_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            disabled={isLoading}
            className="text-xs font-medium bg-surface-container hover:bg-surface-container-high border border-outline-variant text-on-surface px-3 py-1.5 rounded-full whitespace-nowrap transition-colors hover:border-primary/40 disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Box Bar */}
      <div className="flex items-center gap-2 bg-surface dark:bg-surface-container-low border border-outline-variant rounded-2xl p-2 shadow-md flex-shrink-0">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder={
            language === 'HI'
              ? 'योजना या अपनी पात्रता के बारे में पूछें...'
              : 'Ask about any scheme, eligibility, or required documents...'
          }
          className="flex-1 bg-transparent px-3 py-2 text-sm text-on-surface focus:outline-none placeholder:text-on-surface-variant/60"
          disabled={isLoading}
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim() || isLoading}
          className="w-10 h-10 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-40 text-white flex items-center justify-center transition-all shadow-sm active:scale-95 flex-shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
