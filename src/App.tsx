import { useState } from 'react';
import { Header } from './components/Header';
import { useLanguage } from './context/LanguageContext';
import { useMemory } from './context/MemoryContext';
import { ChatView } from './components/ChatView';
import { SchemeExplorer } from './components/SchemeExplorer';
import { MemoryDashboard } from './components/MemoryDashboard';
import { MultiStepForm } from './components/MultiStepForm';
import { OnboardingModal } from './components/OnboardingModal';
import { MessageSquare as ChatIcon, Compass, Brain, User, ShieldCheck } from 'lucide-react';

export type SarkarView = 'chat' | 'schemes' | 'memory' | 'profile';

export default function App() {
  const [currentView, setCurrentView] = useState<SarkarView>('chat');
  const { t, textScale, highContrast } = useLanguage();
  const { hasSeenOnboarding } = useMemory();

  return (
    <div 
      className={`min-h-screen flex flex-col font-sans antialiased ${
        highContrast ? 'bg-black text-yellow-300' : 'bg-[#f7f9fb] text-[#191c1e]'
      }`}
      style={{ fontSize: `${textScale * 100}%` }}
    >
      <Header />

      {!hasSeenOnboarding && <OnboardingModal />}

      {/* Main Layout Container */}
      <div className="flex-grow flex w-full max-w-[1280px] mx-auto pt-16 pb-20 md:pb-0">
        
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden md:flex flex-col w-72 bg-white border-r border-[#c3c6d1] p-4 shrink-0 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto">
          
          {/* User Trust Info Box */}
          <div className="flex items-center gap-3 p-3 bg-[#f2f4f6] rounded-xl border border-[#c3c6d1] mb-6">
            <div className="w-10 h-10 rounded-full bg-[#1b4d89] text-white flex items-center justify-center font-bold text-sm">
              🇮🇳
            </div>
            <div>
              <h2 className="font-bold text-sm text-[#00366b]">SarkarSaathi User</h2>
              <p className="text-[11px] text-[#035a00] font-bold flex items-center gap-1">
                <ShieldCheck size={12} /> High Trust Level
              </p>
              <p className="text-[11px] text-[#7C3AED] font-bold flex items-center gap-1 mt-0.5">
                <Brain size={12} /> Negotiated Memory Active
              </p>
            </div>
          </div>

          <nav className="flex flex-col gap-1.5">
            <button
              onClick={() => setCurrentView('chat')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                currentView === 'chat'
                  ? 'bg-[#fe9832] text-[#683700] shadow-sm'
                  : 'text-[#424750] hover:bg-[#eceef0]'
              }`}
            >
              <ChatIcon size={18} />
              <span>{t('nav.chat')}</span>
            </button>

            <button
              onClick={() => setCurrentView('schemes')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                currentView === 'schemes'
                  ? 'bg-[#1b4d89] text-white shadow-sm'
                  : 'text-[#424750] hover:bg-[#eceef0]'
              }`}
            >
              <Compass size={18} />
              <span>{t('nav.schemes')}</span>
            </button>

            <button
              onClick={() => setCurrentView('memory')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                currentView === 'memory'
                  ? 'bg-[#7C3AED] text-white shadow-sm'
                  : 'text-[#424750] hover:bg-[#eceef0]'
              }`}
            >
              <Brain size={18} />
              <span>{t('nav.memory')}</span>
            </button>

            <button
              onClick={() => setCurrentView('profile')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                currentView === 'profile'
                  ? 'bg-[#1b4d89] text-white shadow-sm'
                  : 'text-[#424750] hover:bg-[#eceef0]'
              }`}
            >
              <User size={18} />
              <span>{t('nav.profile')}</span>
            </button>
          </nav>
        </aside>

        {/* Content View Canvas */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {currentView === 'chat' && <ChatView />}
          {currentView === 'schemes' && <SchemeExplorer />}
          {currentView === 'memory' && <MemoryDashboard />}
          {currentView === 'profile' && (
            <MultiStepForm onComplete={() => setCurrentView('schemes')} />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#c3c6d1] flex justify-around items-center h-16 shadow-lg">
        <button
          onClick={() => { setCurrentView('chat'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className={`flex flex-col items-center justify-center px-4 py-1 transition-transform active:scale-95 ${
            currentView === 'chat' ? 'text-[#00366b] font-bold' : 'text-[#424750]'
          }`}
        >
          <ChatIcon size={20} />
          <span className="text-[10px] font-semibold mt-0.5">{t('nav.chat')}</span>
        </button>

        <button
          onClick={() => { setCurrentView('schemes'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className={`flex flex-col items-center justify-center px-4 py-1 transition-transform active:scale-95 ${
            currentView === 'schemes' ? 'text-[#00366b] font-bold' : 'text-[#424750]'
          }`}
        >
          <Compass size={20} />
          <span className="text-[10px] font-semibold mt-0.5">{t('nav.schemes')}</span>
        </button>

        <button
          onClick={() => { setCurrentView('memory'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className={`flex flex-col items-center justify-center px-4 py-1 transition-transform active:scale-95 ${
            currentView === 'memory' ? 'text-[#7C3AED] font-bold' : 'text-[#424750]'
          }`}
        >
          <Brain size={20} />
          <span className="text-[10px] font-semibold mt-0.5">{t('nav.memory')}</span>
        </button>

        <button
          onClick={() => { setCurrentView('profile'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className={`flex flex-col items-center justify-center px-4 py-1 transition-transform active:scale-95 ${
            currentView === 'profile' ? 'text-[#00366b] font-bold' : 'text-[#424750]'
          }`}
        >
          <User size={20} />
          <span className="text-[10px] font-semibold mt-0.5">{t('nav.profile')}</span>
        </button>
      </nav>

    </div>
  );
}
