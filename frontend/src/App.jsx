import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import ProfileInput from './components/ProfileInput';
import AIReasoningModal from './components/AIReasoningModal';
import EligibleSchemes from './components/EligibleSchemes';
import SchemeDetailModal from './components/SchemeDetailModal';
import WhyNotEligible from './components/WhyNotEligible';
import NoSchemes from './components/NoSchemes';
import BottomNavbar from './components/BottomNavbar';
import DocumentUpload from './components/DocumentUpload';
import AdPamphletScanner from './components/AdPamphletScanner';
import ProfileSettings from './components/ProfileSettings';
import MemoryCenter from './components/MemoryCenter';
import UserProfile from './components/UserProfile';
import LandingPage from './components/LandingPage';
import SchemeChatbot from './components/SchemeChatbot';
import FloatingChatbot from './components/FloatingChatbot';
import Auth from './components/Auth';
import { evaluateProfile } from './data/schemes';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [language, setLanguage] = useState('EN');

  // Pre-filled defaults matching demo script in README
  const [profile, setProfile] = useState(() => {
    try {
      const stored = localStorage.getItem('sarthi_profile') || localStorage.getItem('sarthi_user_profile');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return {
      age: '22',
      gender: 'female',
      state: 'Maharashtra',
      occupation: 'student',
      income: '250000',
      category: 'sc',
      education: 'graduate',
      disability: 'no'
    };
  });

  const [evaluationResult, setEvaluationResult] = useState(() => evaluateProfile(profile));

  const [selectedScheme, setSelectedScheme] = useState(null);

  const handleProfileSubmit = () => {
    localStorage.setItem('sarthi_profile', JSON.stringify(profile));
    const result = evaluateProfile(profile);
    setEvaluationResult(result);
    navigate('/reasoning');
  };

  const handleReasoningComplete = () => {
    if (evaluationResult.eligible.length > 0) {
      navigate('/services');
    } else {
      navigate('/no-schemes');
    }
  };

  const handleReset = () => {
    setSelectedScheme(null);
    navigate('/get-started');
  };

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col font-sans relative">
      <Header 
        language={language} 
        setLanguage={setLanguage}
        onReset={handleReset}
        currentScreen="active"
        setScreen={(scr, newProfile) => {
          if (scr === 'authenticated' && newProfile) {
            setProfile(prev => ({ ...prev, ...newProfile }));
            setEvaluationResult(evaluateProfile({ ...profile, ...newProfile }));
          } else if (scr === 'profile') navigate('/get-started');
          else if (scr === 'eligible') navigate('/services');
        }}
      />

      <main className="flex-1 pb-24 md:pb-8 pt-20">
        <Routes>
          <Route path="/" element={<LandingPage language={language} />} />
          <Route 
            path="/get-started" 
            element={
              <ProfileInput 
                profile={profile}
                setProfile={setProfile}
                onSubmit={handleProfileSubmit}
                language={language}
              />
            } 
          />
          <Route 
            path="/reasoning" 
            element={
              <AIReasoningModal 
                profile={profile}
                result={evaluationResult}
                onComplete={handleReasoningComplete}
                language={language}
              />
            } 
          />
          <Route 
            path="/services" 
            element={
              <EligibleSchemes 
                eligibleList={evaluationResult?.eligible || []}
                ineligibleList={evaluationResult?.ineligible || []}
                profile={profile}
                onSelectScheme={(scheme) => setSelectedScheme(scheme)}
                onViewIneligible={() => navigate('/why-not')}
                onEditProfile={() => navigate('/get-started')}
                language={language}
              />
            } 
          />
          <Route 
            path="/why-not" 
            element={
              <WhyNotEligible 
                ineligibleList={evaluationResult?.ineligible || []}
                eligibleList={evaluationResult?.eligible || []}
                onBack={() => navigate('/services')}
                onSelectScheme={(scheme) => {
                  setSelectedScheme(scheme);
                  navigate('/services');
                }}
                language={language}
              />
            } 
          />
          <Route 
            path="/no-schemes" 
            element={
              <NoSchemes 
                onReset={() => navigate('/get-started')}
                language={language}
              />
            } 
          />
          <Route 
            path="/scan-ad" 
            element={<AdPamphletScanner language={language} />} 
          />
          <Route 
            path="/verify" 
            element={<DocumentUpload language={language} profile={profile} setProfile={setProfile} />} 
          />
          <Route 
            path="/chatbot" 
            element={<SchemeChatbot profile={profile} language={language} />} 
          />
          <Route 
            path="/ask-ai" 
            element={<SchemeChatbot profile={profile} language={language} />} 
          />
          <Route 
            path="/documents" 
            element={<AdPamphletScanner language={language} />} 
          />
          <Route 
            path="/profile" 
            element={
              <UserProfile 
                profile={profile}
                setProfile={setProfile}
                language={language}
                setLanguage={setLanguage}
              />
            } 
          />
          <Route 
            path="/memory" 
            element={<MemoryCenter language={language} />} 
          />
          <Route 
            path="/settings" 
            element={<ProfileSettings language={language} />} 
          />
          <Route 
            path="/auth" 
            element={<Auth language={language} />} 
          />
        </Routes>
      </main>

      {/* Global Floating AI Chatbot (Anchored Bottom-Right, matching myScheme.gov.in) */}
      <FloatingChatbot language={language} profile={profile} />

      {selectedScheme && (
        <SchemeDetailModal 
          scheme={selectedScheme}
          onClose={() => setSelectedScheme(null)}
          language={language}
        />
      )}

      {location.pathname !== '/' && (
        <BottomNavbar language={language} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
