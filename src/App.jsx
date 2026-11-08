import React, { lazy, Suspense, useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import WelcomePage from './components/WelcomePage';
import TestScreen from './components/TestScreen';
import DemographicsForm from './components/DemographicsForm';
import ResultScreen from './components/ResultScreen';
import Dashboard from './components/Dashboard';
import MethodologyPage from './components/MethodologyPage';
import FeedbackModal from './components/FeedbackModal';
import WeeklyPage from './components/WeeklyPage';
import { calculateComprehensiveAnalysis } from './lib/scoring';
import { QUESTION_SET_VERSION, getQuestionsForLength, QUIZ_LENGTHS, DEFAULT_QUIZ_LENGTH, QUADRANT_PROFILES, getIdentity } from './data/questions';

// Dev-only: ?demo-result=short|medium|long renders a sample result locally
// without saving anything, so the result screen can be checked safely.
function getDemoResult() {
  if (!import.meta.env.DEV) return null;
  const length = new URLSearchParams(window.location.search).get('demo-result');
  if (!length || !QUIZ_LENGTHS[length]) return null;
  const pattern = [5, 4, 2, 1, 4, 5, 3, 2];
  // Optional &persona=BNP|JI|Student|Sushil|AL previews each result type.
  const persona = new URLSearchParams(window.location.search).get('persona');
  const toScore = (w) => (w >= 1.5 ? 5 : w > 0 ? 4 : w === 0 ? 3 : w > -1.5 ? 2 : 1);
  const answers = getQuestionsForLength(length).map((q, i) => ({
    questionId: q.id,
    score: persona ? toScore(q.bloc_weights?.[persona] ?? 0) : pattern[i % pattern.length]
  }));
  const result = calculateComprehensiveAnalysis(answers, { length });
  // Optional &quadrant=<key> previews a specific skin.
  const quadrant = new URLSearchParams(window.location.search).get('quadrant');
  if (quadrant && QUADRANT_PROFILES[quadrant]) {
    result.quadrantProfile = QUADRANT_PROFILES[quadrant];
    result.identity = getIdentity(quadrant, () => 5);
  }
  return result;
}
import { 
  getOrCreateSessionId, 
  saveAssessmentResponse, 
  subscribeLiveVisitorCount 
} from './lib/firebase';
import lightLogo from './assets/light mode logo.svg';
import darkLogo from './assets/dark mode logo.svg';
import './index.css';

const AdminPage = lazy(() => import('./components/AdminPage'));

export default function App() {
  if (window.location.pathname.replace(/\/$/, '') === '/admin') {
    return <Suspense fallback={null}><AdminPage /></Suspense>;
  }
  return <PublicApp />;
}

function PublicApp() {
  const [demoResult] = useState(getDemoResult);
  const [currentView, setCurrentView] = useState(() => (demoResult ? 'result' : 'home')); // 'home' | 'test' | 'demographics' | 'result' | 'dashboard' | 'methodology'
  const [sessionId, setSessionId] = useState('');
  const [isFooterFeedbackOpen, setFooterFeedbackOpen] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [testDuration, setTestDuration] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(() => getDemoResult());
  const [demographics, setDemographics] = useState(null);
  // Quiz length; null means the default (medium). Short/long are offered as
  // small links on the landing page instead of an extra screen.
  const [quizLength, setQuizLength] = useState(null);
  const activeLength = quizLength || DEFAULT_QUIZ_LENGTH;
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
    const analysis = calculateComprehensiveAnalysis(answers, { length: activeLength });
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
      quizLength: analysis.quizLength,
      demographics: demographicData,
      isVerified: testDuration >= 60 // Simple duration check
    });

    setCurrentView('result');
    // The next visit to the test view asks for a length again.
    setQuizLength(null);
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
            onStartTest={(length) => {
              setQuizLength(QUIZ_LENGTHS[length] ? length : null);
              setCurrentView('test');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onGoDashboard={() => {
              setCurrentView('dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onGoWeekly={() => {
              setCurrentView('weekly');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            liveVisitors={liveVisitors}
            lang={lang}
          />
        )}

        {currentView === 'weekly' && <WeeklyPage lang={lang} />}

        {currentView === 'test' && (
          <TestScreen 
            key={activeLength}
            length={activeLength}
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

      <footer className="site-footer">
        <div className="site-footer-inner">
          <div className="site-footer-top">
            <div className="site-footer-brand">
              <div className="site-footer-logo">
                <img src={lightLogo} alt="" className="site-logo-light" style={{ width: '100%', height: '100%', objectFit: 'contain', transform: 'scale(1.22)' }} />
                <img src={darkLogo} alt="" className="site-logo-dark" style={{ width: '100%', height: '100%', objectFit: 'contain', transform: 'scale(1.22)' }} />
              </div>
              <div>
                <div className="site-footer-title">BD Political Compass</div>
                <p className="site-footer-tagline">
                  {lang === 'bn' ? 'দলহীন, স্বাধীন জনমত প্ল্যাটফর্ম' : 'An independent, non-party opinion platform'}
                </p>
              </div>
            </div>

            <nav className="site-footer-links" aria-label={lang === 'bn' ? 'ফুটার' : 'Footer'}>
              {[
                ['home', 'কুইজ দিন', 'Take the quiz'],
                ['weekly', 'সাপ্তাহিক ভোট', 'Weekly vote'],
                ['dashboard', 'সবাই কী ভাবছে', 'What people think'],
                ['methodology', 'কীভাবে হিসাব হয়', 'How it works']
              ].map(([view, bn, en]) => (
                <button
                  key={view}
                  type="button"
                  className="site-footer-link"
                  aria-current={currentView === view ? 'page' : undefined}
                  onClick={() => {
                    setCurrentView(view);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  {lang === 'bn' ? bn : en}
                </button>
              ))}
              <button type="button" className="site-footer-link" onClick={() => setFooterFeedbackOpen(true)}>
                {lang === 'bn' ? 'ভুল বা পক্ষপাত জানান' : 'Report a problem'}
              </button>
            </nav>
          </div>

          <p className="site-footer-note">
            {lang === 'bn'
              ? 'ফলাফল শুধু অংশগ্রহণকারীদের মত, দেশের সবার মত বা নির্বাচনের পূর্বাভাস নয়। নেতাদের অবস্থান আমাদের অনুমান; কোনো নেতা বা দল এই প্ল্যাটফর্মের সাথে যুক্ত নন।'
              : 'Results reflect participants only, not the whole country or an election forecast. Leader positions are our estimates; no leader or party is connected with this platform.'}
          </p>

          <div className="site-footer-base">
            <span>{lang === 'bn' ? 'নাম-ফোন লাগে না · বয়স-এলাকা দেওয়া ঐচ্ছিক' : 'No name or phone needed · age and area optional'}</span>
            <span>{lang === 'bn' ? '© ২০২৬ BD Political Compass' : '© 2026 BD Political Compass'}</span>
          </div>
        </div>
      </footer>
      <FeedbackModal isOpen={isFooterFeedbackOpen} onClose={() => setFooterFeedbackOpen(false)} lang={lang} />
    </div>
  );
}
