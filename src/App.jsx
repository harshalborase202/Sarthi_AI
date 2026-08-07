import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
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
import { evaluateProfile } from './data/schemes';

function AppContent() {
  const navigate = useNavigate();
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
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col font-sans">
      <Header
        language={language}
        setLanguage={setLanguage}
        onReset={handleReset}
        currentScreen="active"
        setScreen={(scr) => {
          if (scr === 'profile') navigate('/');
          else if (scr === 'eligible') navigate('/services');
        }}
      />

      <main className="flex-grow pt-20 pb-24">
        <Routes>
          <Route
            path="/"
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
                onComplete={handleReasoningComplete}
                language={language}
              />
            }
          />

          <Route
            path="/services"
            element={
              <EligibleSchemes
                eligibleList={evaluationResult.eligible}
                ineligibleList={evaluationResult.ineligible}
                profile={profile}
                onSelectScheme={(scheme) => setSelectedScheme(scheme)}
                onViewIneligible={() => navigate('/why-not-eligible')}
                onEditProfile={() => navigate('/')}
                language={language}
              />
            }
          />

          <Route
            path="/why-not-eligible"
            element={
              <WhyNotEligible
                ineligibleList={evaluationResult.ineligible}
                eligibleList={evaluationResult.eligible}
                onBack={() => navigate('/services')}
                onSelectScheme={(scheme) => setSelectedScheme(scheme)}
                language={language}
              />
            }
          />

          <Route
            path="/no-schemes"
            element={
              <NoSchemes
                onReset={handleReset}
                language={language}
              />
            }
          />

          <Route
            path="/verify"
            element={
              <DocumentUpload
                language={language}
              />
            }
          />

          <Route
            path="/memory"
            element={
              <MemoryCenter
                language={language}
              />
            }
          />

          <Route
            path="/profile"
            element={
              <UserProfile
                profile={profile}
                language={language}
                setLanguage={setLanguage}
              />
            }
          />
        </Routes>
      </main>

      {/* Persistent Bottom Navigation Bar */}
      <BottomNavbar language={language} />

      {/* Scheme Detail & Decision Tree Modal */}
      {selectedScheme && (
        <SchemeDetailModal
          scheme={selectedScheme}
          onClose={() => setSelectedScheme(null)}
          language={language}
        />
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
