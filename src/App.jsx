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
import ProfileSettings from './components/ProfileSettings';
import MemoryCenter from './components/MemoryCenter';
import UserProfile from './components/UserProfile';
import LandingPage from './components/LandingPage';
import { evaluateProfile } from './data/schemes';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [language, setLanguage] = useState('EN');

  // Pre-filled defaults matching demo script in README
  const [profile, setProfile] = useState({
    age: '22',
    gender: 'female',
    state: 'Maharashtra',
    occupation: 'student',
    income: '250000',
    category: 'sc',
    education: 'graduate',
    disability: 'no'
  });

  const [evaluationResult, setEvaluationResult] = useState(() => evaluateProfile({
    age: '22',
    gender: 'female',
    state: 'Maharashtra',
    occupation: 'student',
    income: '250000',
    category: 'sc',
    education: 'graduate',
    disability: 'no'
  }));

  const [selectedScheme, setSelectedScheme] = useState(null);

  const handleProfileSubmit = () => {
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
    <div className="min-h-screen bg-background text-on-background flex flex-col font-sans">
      <Header 
        language={language} 
        setLanguage={setLanguage}
        onReset={handleReset}
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
            path="/documents" 
            element={
              <DocumentUpload 
                language={language} 
                profile={profile}
                setProfile={(updated) => {
                  setProfile(updated);
                  const result = evaluateProfile(updated);
                  setEvaluationResult(result);
                }}
              />
            } 
          />
          <Route 
            path="/profile" 
            element={
              <UserProfile 
                profile={profile}
                setProfile={setProfile}
                language={language}
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
        </Routes>
      </main>

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
