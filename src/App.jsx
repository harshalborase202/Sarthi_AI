import React, { useState } from 'react';
import Header from './components/Header';
import ProfileInput from './components/ProfileInput';
import AIReasoningModal from './components/AIReasoningModal';
import EligibleSchemes from './components/EligibleSchemes';
import SchemeDetailModal from './components/SchemeDetailModal';
import WhyNotEligible from './components/WhyNotEligible';
import NoSchemes from './components/NoSchemes';
import { evaluateProfile } from './data/schemes';

export default function App() {
  const [language, setLanguage] = useState('EN');
  const [screen, setScreen] = useState('profile'); // profile | reasoning | eligible | why_not_eligible | no_schemes

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

  const [evaluationResult, setEvaluationResult] = useState({ eligible: [], ineligible: [] });
  const [selectedScheme, setSelectedScheme] = useState(null);

  const handleProfileSubmit = () => {
    const result = evaluateProfile(profile);
    setEvaluationResult(result);
    setScreen('reasoning');
  };

  const handleReasoningComplete = () => {
    if (evaluationResult.eligible.length > 0) {
      setScreen('eligible');
    } else {
      setScreen('no_schemes');
    }
  };

  const handleReset = () => {
    setScreen('profile');
    setSelectedScheme(null);
  };

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col font-sans">
      <Header
        language={language}
        setLanguage={setLanguage}
        onReset={handleReset}
        currentScreen={screen}
        setScreen={setScreen}
      />

      <main className="flex-grow pt-20 pb-12">
        {screen === 'profile' && (
          <ProfileInput
            profile={profile}
            setProfile={setProfile}
            onSubmit={handleProfileSubmit}
            language={language}
          />
        )}

        {screen === 'reasoning' && (
          <AIReasoningModal
            profile={profile}
            onComplete={handleReasoningComplete}
            language={language}
          />
        )}

        {screen === 'eligible' && (
          <EligibleSchemes
            eligibleList={evaluationResult.eligible}
            ineligibleList={evaluationResult.ineligible}
            profile={profile}
            onSelectScheme={(scheme) => setSelectedScheme(scheme)}
            onViewIneligible={() => setScreen('why_not_eligible')}
            onEditProfile={() => setScreen('profile')}
            language={language}
          />
        )}

        {screen === 'why_not_eligible' && (
          <WhyNotEligible
            ineligibleList={evaluationResult.ineligible}
            eligibleList={evaluationResult.eligible}
            onBack={() => setScreen('eligible')}
            onSelectScheme={(scheme) => setSelectedScheme(scheme)}
            language={language}
          />
        )}

        {screen === 'no_schemes' && (
          <NoSchemes
            onReset={handleReset}
            language={language}
          />
        )}
      </main>

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
