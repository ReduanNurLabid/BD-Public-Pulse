import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import WelcomePage from './components/WelcomePage';
import TestScreen from './components/TestScreen';
import DemographicsForm from './components/DemographicsForm';
import ResultScreen from './components/ResultScreen';
import Dashboard from './components/Dashboard';
import MethodologyPage from './components/MethodologyPage';
import { calculateComprehensiveAnalysis } from './lib/scoring';
import { QUESTIONS, QUESTION_SET_VERSION } from './data/questions';
import { 
  getOrCreateSessionId, 
  saveAssessmentResponse, 
  subscribeLiveVisitorCount 
} from './lib/firebase';
import lightLogo from './assets/light mode logo.svg';
import darkLogo from './assets/dark mode logo.svg';
import './index.css';

export default function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'test' | 'demographics' | 'result' | 'dashboard' | 'methodology'
  const [sessionId, setSessionId] = useState('');
  const [answers, setAnswers] = useState([]);
  const [testDuration, setTestDuration] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [demographics, setDemographics] = useState(null);
  // Null until the presence query actually answers. This used to start at a
  // hardcoded 164, which put a fabricated visitor count on screen under a
  // pulsing "live" dot before the first round-trip resolved.
  const [liveVisitors, setLiveVisitors] = useState(null);
  // 'bn' | 'en' — drives the WelcomePage bilingual copy; toggled from
  // the navbar language button.
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('appLang') || 'bn';
  });

  useEffect(() => {
    localStorage.setItem('appLang', lang);
  }, [lang]);

  // Initialize session and subscribe to live concurrent visitors
  useEffect(() => {
    const sid = getOrCreateSessionId();
    setSessionId(sid);

    const unsubscribe = subscribeLiveVisitorCount(count => {
      setLiveVisitors(count);
    });

    return () => unsubscribe();
  }, []);

  // When test finishes (all 40 questions answered)
  const handleTestComplete = (testAnswers, durationSeconds) => {
    setAnswers(testAnswers);
    setTestDuration(durationSeconds);
    // Transition to optional post-test demographics
    setCurrentView('demographics');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };



  // When demographics submitted or skipped
  const handleDemographicsProceed = async (demographicData = null) => {
    setDemographics(demographicData);

    // Compute comprehensive analysis
    const analysis = calculateComprehensiveAnalysis(answers);
    setAnalysisResult(analysis);

    // Save response record to persistent dataset (O(1) architecture)
    await saveAssessmentResponse({
      sessionId,
      answers,
      durationSeconds: testDuration,
      coordinates: analysis.coordinates,
      quadrant: analysis.quadrant,
      primaryBloc: analysis.primaryBloc.key,
      // Required by saveAssessmentResponse to accumulate the 8 thematic axes.
      // Omitting it silently produced an axes chart with no data at all.
      blockResults: analysis.blockResults,
      affinities: analysis.affinities,
      quality: analysis.quality,
      modelVersion: analysis.modelVersion,
      questionSetVersion: QUESTION_SET_VERSION,
      demographics: demographicData,
      isVerified: testDuration >= 60 // Simple duration check
    });

    setCurrentView('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Retake test
  const handleRetake = () => {
    setAnswers([]);
    setAnalysisResult(null);
    setDemographics(null);
    setCurrentView('test');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-container" lang={lang}>
      {/* Background Animated Aurora Effects */}
      <div className="ambient-background">
        <div className="aurora-glow-1" />
        <div className="aurora-glow-2" />
        <div className="aurora-glow-3" />
      </div>

      {/* Top Navbar */}
      <Navbar 
        activeTab={currentView}
        onNavigate={(tab) => {
          setCurrentView(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        liveVisitors={liveVisitors}
        lang={lang}
        onToggleLang={() => setLang((prev) => (prev === 'bn' ? 'en' : 'bn'))}
      />

      {/* Main Dynamic View Router */}
      <main style={{ flex: '1 0 auto', display: 'flex', flexDirection: 'column', overflowX: 'hidden', alignItems: 'stretch', minWidth: 0, width: '100%', boxSizing: 'border-box' }}>
        {currentView === 'home' && (
          <WelcomePage
            onStartTest={() => {
              setCurrentView('test');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onGoDashboard={() => {
              setCurrentView('dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            liveVisitors={liveVisitors}
            lang={lang}
          />
        )}

        {currentView === 'test' && (
          <TestScreen 
            onComplete={handleTestComplete}
            lang={lang}
            setLang={setLang}
            onToggleLang={() => setLang(prev => prev === 'bn' ? 'en' : 'bn')}
          />
        )}

        {currentView === 'demographics' && (
          <DemographicsForm 
            onSubmit={(data) => handleDemographicsProceed(data)}
            onSkip={() => handleDemographicsProceed(null)}
            lang={lang}
          />
        )}

        {currentView === 'result' && analysisResult && (
          <ResultScreen 
            analysis={analysisResult}
            sessionId={sessionId}
            demographics={demographics}
            onRetake={handleRetake}
            onGoDashboard={() => {
              setCurrentView('dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            lang={lang}
          />
        )}

        {currentView === 'dashboard' && (
          <Dashboard 
            onTakeTest={() => {
              setCurrentView('test');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            liveVisitors={liveVisitors}
            lang={lang}
          />
        )}

        {currentView === 'methodology' && (
          <MethodologyPage 
            lang={lang}
            onStartTest={() => {
              setCurrentView('test');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onGoHome={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Institutional Footer */}
      <footer className="site-footer">
        <div className="site-footer-inner">
          <div className="site-footer-brand">
            <div className="site-footer-logo">
              <img src={lightLogo} alt="BD Political Compass Logo" className="site-logo-light" style={{ width: '100%', height: '100%', objectFit: 'contain', transform: 'scale(1.22)' }} />
              <img src={darkLogo} alt="BD Political Compass Logo" className="site-logo-dark" style={{ width: '100%', height: '100%', objectFit: 'contain', transform: 'scale(1.22)' }} />
            </div>
            <div>
              <div className="site-footer-title">
                BD Political Compass
              </div>
              <p className="site-footer-tagline">
                {lang === 'bn' ? 'একটি স্বাধীন, নিরপেক্ষ এবং উন্মুক্ত গবেষণা প্রকল্প।' : 'An independent, impartial, and open research project.'}
              </p>
            </div>
          </div>

          <div className="site-footer-meta">
            <button 
              onClick={() => {
                setCurrentView('methodology');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              className={`btn-ghost ${currentView === 'methodology' ? 'selected' : ''}`}
            >
              {lang === 'bn' ? 'গবেষণা পদ্ধতি' : 'Methodology'}
            </button>
            {/* Decorative separators: hidden so they are not announced as
                list bullets between the items. */}
            <span className="site-footer-sep" aria-hidden="true">•</span>
            <span style={{ color: 'var(--text-muted)' }}>
              {lang === 'bn' ? 'ছদ্মনামী উত্তর · জনতাত্ত্বিক তথ্য ঐচ্ছিক' : 'Pseudonymous responses · optional demographics'}
            </span>
            <span className="site-footer-sep" aria-hidden="true">•</span>
            <span className="font-latin site-footer-copy">
              BD Political Compass © 2026
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
