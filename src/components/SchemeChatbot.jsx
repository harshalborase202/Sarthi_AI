import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bot, User, Send, Sparkles, Brain, Save, CheckCircle2, 
  Clock, ShieldAlert, ArrowRight, RefreshCw, HelpCircle, MessageSquare, ChevronRight, X
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
        ? 'नमस्ते! मैं Sarthi AI योजना सहायक हूँ। आप मुझसे भारत सरकार की किसी भी योजना, पात्रता, या आवश्यक दस्तावेजों के बारे में पूछ सकते हैं।'
        : language === 'MR'
        ? 'नमस्कार! मी Sarthi AI योजना सहाय्यक आहे. तुम्ही मला कोणत्याही शासकीय योजनेबद्दल प्रश्न विचारू शकता.'
        : "Namaste! I'm Sarthi AI Scheme Assistant. Ask me anything about Indian government welfare schemes, eligibility rules, document requirements, or application procedures.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      savedStatus: null
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeMemoryModalMsg, setActiveMemoryModalMsg] = useState(null); // Message object being saved
  const [selectedRetention, setSelectedRetention] = useState('until_delete');
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(null);

  // Quick prompt chips
  const SAMPLE_QUESTIONS = language === 'HI' ? [
    'PM-KISAN योजना की क्या पात्रता और लाभ हैं?',
    'छात्रों के लिए कौन-सी मुख्य स्कॉलरशिप योजनाएं उपलब्ध हैं?',
    'आयुष्मान भारत कार्ड के लिए आवश्यक दस्तावेज क्या हैं?',
    'सुकन्या समृद्धि योजना में कितना ब्याज और टैक्स लाभ मिलता है?'
  ] : language === 'MR' ? [
    'PM-KISAN योजनेचे काय फायदे आहेत?',
    'विद्यार्थ्यांसाठी कोणत्या शिष्यवृत्ती योजना आहेत?',
    'आयुष्मान भारत कार्डसाठी कोणती कागदपत्रे लागतात?',
    'सुकन्या समृद्धी योजनेची माहिती द्या.'
  ] : [
    'What are the eligibility criteria and benefits for PM-KISAN?',
    'What government scholarships are available for graduate students?',
    'What documents are required for Ayushman Bharat PMJAY health insurance?',
    'How does Sukanya Samriddhi Yojana work for girl child savings?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

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
      // Build history payload
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
          ? "क्षमा करें, मुझे इस समय उत्तर प्राप्त करने में समस्या आ रही है। कृपया पुनः प्रयास करें।"
          : "I'm sorry, I encountered an issue retrieving an answer. Please try asking again."
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
            ? "नेटवर्क त्रुटि: सर्वर से कनेक्ट नहीं हो सका। Sarthi AI ऑफ़लाइन उत्तर: अपनी योजना पात्रता देखने के लिए प्रोफाइल पृष्ठ पर जाएँ।"
            : "Network Notice: Unable to reach live Gemini server. Sarthi AI Offline Mode: Check the Services tab to view your matched scheme rules.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          savedStatus: null
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenSaveModal = (msg) => {
    setActiveMemoryModalMsg(msg);
    setSelectedRetention('until_delete');
  };

  const handleConfirmSaveMemory = async () => {
    if (!activeMemoryModalMsg) return;

    const question = activeMemoryModalMsg.userQuestion || "Scheme Q&A Inquiry";
    const answer = activeMemoryModalMsg.text;
    const cardId = `qa_${Date.now()}`;

    let statusKey = selectedRetention; // until_delete | 30_days | session_only | never_stored
    let badgeText = '✓ Remembered until you delete it';
    let badgeStyle = 'bg-emerald-50 text-emerald-800 border-emerald-300';
    let expiryDateStr = null;

    if (selectedRetention === '30_days') {
      const expDate = new Date();
      expDate.setDate(expDate.getDate() + 30);
      expiryDateStr = expDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
      badgeText = `⏳ Remembered for 30 days — expires ${expiryDateStr}`;
      badgeStyle = 'bg-amber-50 text-amber-900 border-amber-300';
    } else if (selectedRetention === 'session_only') {
      badgeText = '💬 Session only — deleted on tab close';
      badgeStyle = 'bg-slate-100 text-slate-600 border-slate-300 opacity-80';
    } else if (selectedRetention === 'never_stored') {
      badgeText = '🔒 Never stored — discarded';
      badgeStyle = 'bg-slate-100 text-slate-700 border-slate-300';
    }

    const memoryCard = {
      id: cardId,
      title: `Q: ${question.length > 50 ? question.slice(0, 47) + '...' : question}`,
      iconName: 'messageSquare',
      speechBubble: `Answer: ${answer}`,
      status: statusKey,
      expiryDate: expiryDateStr,
      badgeText,
      badgeStyle,
      dataKey: 'scheme_qa',
      dataValue: JSON.stringify({ question, answer, date: new Date().toISOString() })
    };

    // 1. Update local storage for MemoryCenter
    try {
      const existingCards = JSON.parse(localStorage.getItem('sarthi_memory_center_cards') || '[]');
      const updatedCards = [memoryCard, ...existingCards.filter(c => c.id !== cardId)];
      localStorage.setItem('sarthi_memory_center_cards', JSON.stringify(updatedCards));
    } catch (e) {
      console.warn("Error updating local memory cards:", e);
    }

    // 2. Sync to backend API if not never_stored
    if (selectedRetention !== 'never_stored') {
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
      } catch (err) {
        console.warn("Backend memory sync notice:", err);
      }
    }

    // Mark message as saved
    setMessages(prev => prev.map(m => m.id === activeMemoryModalMsg.id ? { ...m, savedStatus: statusKey } : m));
    setActiveMemoryModalMsg(null);

    setSaveSuccessNotice(
      selectedRetention === 'never_stored'
        ? 'Q&A marked as not stored.'
        : `Q&A successfully saved to Memory Center (${badgeText})!`
    );

    setTimeout(() => setSaveSuccessNotice(null), 4500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto pt-2 pb-24 px-3 sm:px-6 flex flex-col h-[calc(100vh-6rem)]">
      
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-primary via-primary-container to-secondary text-white p-4 sm:p-5 rounded-3xl shadow-lg mb-4 flex-shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-saffron/20 border border-saffron/40 flex items-center justify-center text-saffron shadow-sm">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black tracking-tight flex items-center gap-2">
              Sarthi AI Scheme Chatbot
              <span className="text-[10px] bg-saffron text-primary font-extrabold px-2 py-0.5 rounded-full uppercase">
                Interactive
              </span>
            </h1>
            <p className="text-xs text-slate-200 hidden sm:block">
              Ask questions about government schemes & choose how long to save Q&As in your Memory Center.
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
          <button onClick={() => navigate('/memory')} className="underline hover:text-emerald-100 flex items-center gap-1">
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
            <div className={`flex items-start gap-2.5 max-w-[92%] sm:max-w-[82%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              
              {/* Avatar Icon */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold shadow-sm ${
                msg.sender === 'user' ? 'bg-secondary' : 'bg-primary'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-saffron" />}
              </div>

              {/* Message Bubble Content */}
              <div className={`rounded-2xl p-4 text-sm leading-relaxed shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-primary text-white rounded-tr-none'
                  : 'bg-surface-container border border-outline-variant text-on-surface rounded-tl-none'
              }`}>
                <p className="whitespace-pre-line">{msg.text}</p>
                <div className="text-[10px] opacity-70 mt-2 text-right">
                  {msg.timestamp}
                </div>
              </div>
            </div>

            {/* Save to Memory Button under Bot responses */}
            {msg.sender === 'bot' && msg.id !== 'welcome_1' && (
              <div className="ml-11 flex items-center gap-2">
                {msg.savedStatus ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Saved to Memory ({msg.savedStatus === 'until_delete' ? 'Until Deleted' : msg.savedStatus === '30_days' ? '30 Days' : 'Session Only'})
                  </span>
                ) : (
                  <button
                    onClick={() => handleOpenSaveModal(msg)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/20 border border-primary/20 px-3 py-1.5 rounded-full transition-all shadow-sm active:scale-95"
                  >
                    <Save className="w-3.5 h-3.5 text-saffron" />
                    <span>Save to Memory Center</span>
                  </button>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center gap-2.5 text-on-surface-variant text-xs font-medium p-2 animate-pulse">
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white">
              <Bot className="w-4 h-4 text-saffron" />
            </div>
            <div className="bg-surface-container border border-outline-variant px-4 py-2.5 rounded-2xl rounded-tl-none flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-primary" />
              <span>Sarthi AI engine is generating answer from scheme database...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Sample Questions Chips */}
      <div className="py-2.5 overflow-x-auto flex items-center gap-2 flex-shrink-0 no-scrollbar">
        <span className="text-[11px] font-bold text-on-surface-variant whitespace-nowrap flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-saffron" /> Try asking:
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
              ? 'योजनाओं के बारे में कोई भी प्रश्न पूछें...'
              : 'Ask any question about government schemes...'
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

      {/* Retention Selection Modal */}
      {activeMemoryModalMsg && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-surface dark:bg-surface-container-low border border-outline-variant rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-on-surface">Save Q&A to Memory Center</h3>
                  <p className="text-xs text-on-surface-variant">Decide how long Sarthi AI will store this question & answer.</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveMemoryModalMsg(null)}
                className="text-on-surface-variant hover:text-on-surface p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Preview of item */}
            <div className="bg-surface-container border border-outline-variant p-3.5 rounded-2xl text-xs space-y-1">
              <div className="font-bold text-primary">
                Q: {activeMemoryModalMsg.userQuestion || "Scheme Inquiry"}
              </div>
              <div className="text-on-surface-variant line-clamp-3">
                A: {activeMemoryModalMsg.text}
              </div>
            </div>

            {/* Radio / Choice Options for Retention Duration */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-on-surface block">
                Select Memory Retention Duration:
              </label>

              {/* Option 1: until_delete */}
              <div 
                onClick={() => setSelectedRetention('until_delete')}
                className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                  selectedRetention === 'until_delete'
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-200 font-medium'
                    : 'border-outline-variant hover:bg-surface-container/50 text-on-surface'
                }`}
              >
                <input 
                  type="radio" 
                  name="retention" 
                  checked={selectedRetention === 'until_delete'} 
                  onChange={() => setSelectedRetention('until_delete')}
                  className="mt-0.5 accent-emerald-600"
                />
                <div className="text-xs">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Remember until I delete it (Permanent)
                  </div>
                  <p className="text-[11px] opacity-80 mt-0.5">
                    Stores in Memory Center until you explicitly choose to remove it.
                  </p>
                </div>
              </div>

              {/* Option 2: 30_days */}
              <div 
                onClick={() => setSelectedRetention('30_days')}
                className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                  selectedRetention === '30_days'
                    ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-200 font-medium'
                    : 'border-outline-variant hover:bg-surface-container/50 text-on-surface'
                }`}
              >
                <input 
                  type="radio" 
                  name="retention" 
                  checked={selectedRetention === '30_days'} 
                  onChange={() => setSelectedRetention('30_days')}
                  className="mt-0.5 accent-amber-600"
                />
                <div className="text-xs">
                  <div className="font-bold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    Remember for 30 Days (Auto-Expiry)
                  </div>
                  <p className="text-[11px] opacity-80 mt-0.5">
                    Automatically purges after 30 days of storage.
                  </p>
                </div>
              </div>

              {/* Option 3: session_only */}
              <div 
                onClick={() => setSelectedRetention('session_only')}
                className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                  selectedRetention === 'session_only'
                    ? 'border-slate-500 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium'
                    : 'border-outline-variant hover:bg-surface-container/50 text-on-surface'
                }`}
              >
                <input 
                  type="radio" 
                  name="retention" 
                  checked={selectedRetention === 'session_only'} 
                  onChange={() => setSelectedRetention('session_only')}
                  className="mt-0.5 accent-slate-600"
                />
                <div className="text-xs">
                  <div className="font-bold flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-600" />
                    Session Only
                  </div>
                  <p className="text-[11px] opacity-80 mt-0.5">
                    Keeps in active memory while browser tab is open; cleared on exit.
                  </p>
                </div>
              </div>

              {/* Option 4: never_stored */}
              <div 
                onClick={() => setSelectedRetention('never_stored')}
                className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                  selectedRetention === 'never_stored'
                    ? 'border-rose-400 bg-rose-50/50 dark:bg-rose-950/20 text-rose-900 dark:text-rose-200 font-medium'
                    : 'border-outline-variant hover:bg-surface-container/50 text-on-surface'
                }`}
              >
                <input 
                  type="radio" 
                  name="retention" 
                  checked={selectedRetention === 'never_stored'} 
                  onChange={() => setSelectedRetention('never_stored')}
                  className="mt-0.5 accent-rose-600"
                />
                <div className="text-xs">
                  <div className="font-bold flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                    Do Not Save (Discard)
                  </div>
                  <p className="text-[11px] opacity-80 mt-0.5">
                    Zero data stored in memory or database.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setActiveMemoryModalMsg(null)}
                className="px-4 py-2 text-xs font-semibold text-on-surface-variant hover:text-on-surface"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSaveMemory}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs shadow-md transition-all active:scale-95"
              >
                <Save className="w-4 h-4 text-saffron" />
                <span>Confirm & Save Memory</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
