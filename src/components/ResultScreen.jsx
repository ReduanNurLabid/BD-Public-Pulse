import { readableColor } from '../lib/format';
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import confetti from 'canvas-confetti';
import {
  Award,
  BarChart2,
  RefreshCw,
  Compass,
  Layers,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  ExternalLink,
  Sliders,
  Landmark,
  Briefcase,
  Feather,
  ChevronDown,
  Share2
} from 'lucide-react';
import CompassChart from './CompassChart';
import PersonalityCard, { SHARE_CARD_EVENT } from './PersonalityCard';
import LeaderMatches from './LeaderMatches';
import BlocLogo from './BlocLogo';
import { ENGLISH_THEMATIC_BLOCKS } from '../data/questions';


const ENGLISH_PROFILE_COPY = {
  Student: {
    summary: 'You support a new, more equitable political settlement grounded in the spirit of the July uprising, integrity, and civic unity.',
    pillars: {
      state: 'Accountability for abuses of power, constitutional reform, and civic leadership by a younger generation.',
      market: 'Combating corruption and cartels while encouraging youth-led enterprise and job creation.',
      liberty: 'Integrity, unity, progress, freedom of expression, and equality without discrimination.'
    }
  },
  BNP: {
    summary: 'You favor ending the concentration of power, strengthening multiparty democracy and neutral elections, and developing a domestic free-market economy.',
    pillars: {
      state: 'Limiting the prime minister’s concentrated power, restoring a neutral caretaker system, and balancing state institutions.',
      market: 'Private enterprise, business-friendly taxation, and the growth of a domestic market economy.',
      liberty: 'Territorial national unity, respect for religious sentiment, and the right to democratic assembly.'
    }
  },
  JI: {
    summary: 'You prioritize religious principles, social ethics, and a just, interest-free economic order in public life.',
    pillars: {
      state: 'Applying Islamic principles in law and policy while preserving the distinct status of the state religion.',
      market: 'Interest-free finance, zakat-based redistribution, and the ethical welfare of marginalized communities.',
      liberty: 'Preserving family traditions and religious values while resisting cultural domination.'
    }
  },
  Sushil: {
    summary: 'You prioritize the rule of law, an independent judiciary, good governance, and merit-based constitutional accountability over extreme partisanship and populism.',
    pillars: {
      state: 'Judicial independence, constitutional checks and balances, and a professional civil service.',
      market: 'Transparent procurement, institutional accountability, and a balanced economy free from corruption.',
      liberty: 'Universal human rights, media freedom, and tolerance of dissenting views.'
    }
  },
  AL: {
    summary: 'You place confidence in visible infrastructure development, strong executive leadership, the legacy of the Liberation War, and secular Bengali nationalism.',
    pillars: {
      state: 'Strong executive leadership and priority for state stability.',
      market: 'Large infrastructure projects, public incentives, and state-supported growth.',
      liberty: 'Bengali nationalism and secularism, alongside strict laws for cybersecurity and public order.'
    }
  },
  Mixed: {
    summary: 'Many answers were neutral or skipped, so no single profile is shown.',
    coreValues: ['Mixed answers', 'No single profile']
  },
  NoMatch: {
    summary: 'Your answers did not reach the similarity threshold for any one survey profile.',
    coreValues: ['No clear match', 'Comparison to survey profiles']
  }
};

export default function ResultScreen({
  analysis,
  sessionId,
  onRetake,
  onGoDashboard,
  lang = 'bn'
}) {
  const isEnglish = lang === 'en';
  const {
    coordinates,
    quadrantProfile,
    primaryBloc,
    secondaryBloc,
    sortedBlocs,
    blockResults,
    coherenceScore
  } = analysis;

  const topLeader = (analysis.leaderMatches || []).find((m) => m.share !== null);

  const [scoreMode, setScoreMode] = useState('match'); // 'match' = Individual Policy Agreement (default), 'share' = 100% Proportional Share
  const primaryDisplayPct = scoreMode === 'share' ? primaryBloc.relativeShare : primaryBloc.percentage;
  const secondaryDisplayPct = scoreMode === 'share' ? secondaryBloc.relativeShare : secondaryBloc.percentage;
  const primaryProfileCopy = ENGLISH_PROFILE_COPY[primaryBloc.key];

  const enToBn = (num) => String(num).replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[d]);

  const cardEndRef = useRef(null);
  const [showStickyShare, setShowStickyShare] = useState(false);
  useEffect(() => {
    const el = cardEndRef.current;
    if (!el || !('IntersectionObserver' in window)) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      // Show the bar only after the user has scrolled past the card's buttons.
      setShowStickyShare(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Trigger celebration confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00A86B', '#F0A500', '#EF4444', '#3B82F6', '#8B5CF6']
      });
    } catch (e) {
      // Ignore if confetti not supported
    }
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div style={{ maxWidth: '1060px', margin: '0 auto', padding: '2rem 1.25rem 5rem' }} className="animate-fade-in">

      {/* Top Banner */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <div className="hero-badge-tag" style={{
            background: 'rgba(217, 119, 6, 0.15)',
            borderColor: 'rgba(217, 119, 6, 0.35)',
            color: 'var(--text-gold)',
            padding: '0.45rem 1.25rem',
            fontSize: '0.92rem'
          }}>
            <Award size={18} />
            <span>{isEnglish ? 'Assessment complete • Your results are ready' : 'এই হলো আপনার রাজনৈতিক অবস্থান'}</span>
          </div>
        </div>

        <h1 style={{ fontSize: 'clamp(2.1rem, 7vw, 3.2rem)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.6rem', lineHeight: 1.15 }}>
          {isEnglish ? 'You are ' : 'আপনি '}
          <span style={{ color: readableColor(quadrantProfile?.color) || 'var(--hero-accent)' }}>
            {isEnglish ? analysis.identity?.nameEn : analysis.identity?.name}
          </span>
        </h1>
        <p style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          {isEnglish ? analysis.identity?.taglineEn : analysis.identity?.tagline}
        </p>
        {topLeader && (
          <p style={{ fontSize: '1.08rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
            {isEnglish
              ? <>Among today's leaders, you think most like <strong style={{ color: readableColor(topLeader.color) }}>{topLeader.nameEn}</strong>.</>
              : <>বর্তমান নেতাদের মধ্যে আপনার সাথে সবচেয়ে বেশি মিল <strong style={{ color: readableColor(topLeader.color) }}>{topLeader.nameBn}</strong>-এর।</>}
          </p>
        )}
        <p style={{ fontSize: '0.98rem', color: 'var(--text-muted)' }}>
          {isEnglish
            ? 'Your card is ready below. Share it and see where your friends stand.'
            : 'নিচে আপনার কার্ড তৈরি। শেয়ার করে দেখুন বন্ধুরা কোন পন্থী।'}
        </p>
      </div>

      {/* Leader & Country Match Shareable Card (s Inspired) - Top of Body */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <Award size={24} color="var(--accent-green)" />
            <span>{isEnglish ? 'Your card' : 'আপনার কার্ড'}</span>
          </h3>
        </div>

        <PersonalityCard
          analysis={analysis}
          sessionId={sessionId}
          lang={lang}
        />
        <div ref={cardEndRef} aria-hidden="true" style={{ height: 1 }} />
      </div>

      {/* Answer-by-answer match with living leaders */}
      <LeaderMatches matches={analysis.leaderMatches} lang={lang} />

      {/* Main Highlights: Top Bloc Match + 2D Compass stacked vertically */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>

        {/* Left: Primary Bloc Match Card */}
        <div
          className="glass-panel"
          style={{
            padding: '2.25rem',
            borderTop: `5px solid ${primaryBloc.profile.color}`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <span className="badge-tag" style={{ borderColor: primaryBloc.profile.color, color: readableColor(primaryBloc.profile.color) }}>
                {primaryBloc.key === 'Mixed'
                  ? (isEnglish ? 'Mixed responses' : 'মিশ্র উত্তর')
                  : primaryBloc.key === 'NoMatch'
                    ? (isEnglish ? 'No clear profile match' : 'কোনো এক ধারায় পড়েন না')
                    : (isEnglish ? 'Closest profile similarity' : 'সবচেয়ে কাছের ধারার সাথে মিল')}
              </span>

              {/* Policy Match Score Indicator Badge */}
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'var(--bg-secondary)',
                padding: '4px 12px',
                borderRadius: '999px',
                border: '1px solid var(--border-medium)',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: 'var(--text-secondary)'
              }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: primaryBloc.profile.color }} />
                <span>{isEnglish ? 'Similarity to a survey profile' : 'বিভিন্ন ধারার সাথে মিল'}</span>
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
              <BlocLogo blocKey={primaryBloc.key} size={52} />
              <span
                style={{
                  fontSize: 'clamp(2.6rem, 5vw, 3.4rem)',
                  fontWeight: 800,
                  color: readableColor(primaryBloc.profile.color),
                  fontVariantNumeric: 'tabular-nums',
                  lineHeight: 1
                }}
                className="font-latin"
              >
                {typeof primaryDisplayPct === 'number' ? `${primaryDisplayPct}%` : '—'}
              </span>
              <h2 style={{ fontSize: 'clamp(1.5rem, 3.2vw, 2rem)', color: 'var(--text-primary)', fontWeight: 800, margin: 0, lineHeight: 1.2 }}>
                {isEnglish ? (primaryBloc.profile.englishName || primaryBloc.profile.name) : primaryBloc.profile.name}
              </h2>
            </div>

            <div style={{ fontSize: '0.92rem', color: 'var(--text-gold)', fontWeight: 700, marginBottom: '1.25rem' }}>
              {isEnglish ? (primaryBloc.profile.englishName || primaryBloc.profile.badge) : primaryBloc.profile.badge}
            </div>

            {/* Bold 1-Sentence Headline Summary */}
            <div style={{
              background: 'var(--bg-secondary)',
              padding: '1.15rem',
              borderRadius: '14px',
              borderLeft: `3px solid ${primaryBloc.profile.color}`,
              border: '1px solid var(--border-subtle)',
              marginBottom: '1.5rem'
            }}>
              <p style={{ fontSize: '1.02rem', color: 'var(--text-primary)', fontWeight: 600, lineHeight: 1.75 }}>
                {isEnglish
                  ? (primaryProfileCopy?.summary || `Your closest match is ${primaryBloc.profile.englishName || 'a distinctive political profile'}.`)
                  : (primaryBloc.profile.summaryHeadline || primaryBloc.profile.shortDescription)}
              </p>
            </div>

            {/* 3 Structured Key Pillars: State, Market, Liberty */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {isEnglish
                  ? (primaryBloc.profile.keyPillars ? 'Core Pillars of Your Position:' : 'Core Features of Your Position:')
                  : (primaryBloc.profile.keyPillars ? 'আপনার ভাবনার ৩টি মূল দিক:' : 'আপনার ভাবনার মূল দিকগুলো:')}
              </div>

              {primaryBloc.profile.keyPillars ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    <span style={{ color: 'var(--accent-green)', marginTop: '2px' }}><Landmark size={17} /></span>
                    <span><strong>{isEnglish ? 'State & Governance:' : 'রাষ্ট্র ও শাসন:'}</strong> {isEnglish ? primaryProfileCopy?.pillars.state : primaryBloc.profile.keyPillars.state}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    <span style={{ color: 'var(--accent-green)', marginTop: '2px' }}><Briefcase size={17} /></span>
                    <span><strong>{isEnglish ? 'Economy & Markets:' : 'অর্থনীতি ও বাজার:'}</strong> {isEnglish ? primaryProfileCopy?.pillars.market : primaryBloc.profile.keyPillars.market}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    <span style={{ color: 'var(--accent-green)', marginTop: '2px' }}><Feather size={17} /></span>
                    <span><strong>{isEnglish ? 'Civil Liberties:' : 'নাগরিক অধিকার:'}</strong> {isEnglish ? primaryProfileCopy?.pillars.liberty : primaryBloc.profile.keyPillars.liberty}</span>
                  </div>
                </>
              ) : (
                (isEnglish
                  ? (primaryProfileCopy?.coreValues || ['A distinctive mix of policy views'])
                  : primaryBloc.profile.coreValues).map((val, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
                      <CheckCircle2 size={16} style={{ color: readableColor(primaryBloc.profile.color), flexShrink: 0 }} />
                      <span>{val}</span>
                    </div>
                  ))
              )}
            </div>

            {/* 100% Ideological Share Distribution Bar */}
            {primaryBloc.key !== 'Mixed' && primaryBloc.key !== 'NoMatch' && <div style={{
              background: 'var(--bg-secondary)',
              padding: '1.15rem',
              borderRadius: '16px',
              border: '1px solid var(--border-subtle)',
              marginBottom: '1.5rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <BarChart2 size={16} style={{ color: 'var(--text-gold)' }} />
                  <span>{isEnglish ? 'Relative profile-similarity distribution' : 'প্রতিটি ধারার সাথে মিল'}</span>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-gold)', fontWeight: 600 }}>{isEnglish ? '(normalized to 100%)' : '(সব মিলিয়ে ১০০%)'}</span>
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {isEnglish ? 'A model comparison, not party support or voting intent.' : 'এটা উত্তরের মিলের হিসাব — দলীয় সমর্থন বা ভোটের ইচ্ছা নয়।'}
                </span>
              </div>

              {/* Multi-segment Progress Bar */}
              <div style={{
                height: '14px',
                borderRadius: '8px',
                overflow: 'hidden',
                display: 'flex',
                background: 'rgba(255, 255, 255, 0.08)',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)',
                marginBottom: '0.75rem'
              }}>
                {(sortedBlocs || []).map((bloc) => {
                  const share = bloc.relativeShare || 0;
                  if (share <= 0) return null;
                  return (
                    <div
                      key={bloc.key}
                      title={`${isEnglish ? (bloc.profile.englishName || bloc.profile.name) : bloc.profile.name}: ${share}%`}
                      style={{
                        width: `${share}%`,
                        height: '100%',
                        background: bloc.profile.color,
                        transition: 'width 0.4s ease'
                      }}
                    />
                  );
                })}
              </div>

              {/* Party Share Pills Grid */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem 0.85rem', fontSize: '0.82rem' }}>
                {(sortedBlocs || []).map((bloc) => {
                  const share = bloc.relativeShare || 0;
                  return (
                    <div key={bloc.key} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: bloc.profile.color, display: 'inline-block' }} />
                      <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{isEnglish ? (bloc.profile.englishName || bloc.profile.name) : bloc.profile.name}:</span>
                      <strong className="font-latin" style={{ color: readableColor(bloc.profile.color), fontVariantNumeric: 'tabular-nums' }}>
                        {share}%
                      </strong>
                    </div>
                  );
                })}
              </div>
            </div>}
          </div>

          {/* Secondary Runner-Up Match or Neutral State */}
          {primaryBloc.key !== 'Mixed' && primaryBloc.key !== 'NoMatch' && secondaryBloc ? (
            <div style={{
              paddingTop: '1rem',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.92rem'
            }}>
              <span style={{ color: 'var(--text-secondary)' }}>{isEnglish ? 'Second-Highest Match:' : 'এরপরই মিল:'}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BlocLogo blocKey={secondaryBloc.key} size={22} />
                <strong className="font-latin" style={{ color: readableColor(secondaryBloc.profile.color), fontVariantNumeric: 'tabular-nums' }}>
                  {typeof secondaryDisplayPct === 'number' ? `${secondaryDisplayPct}%` : '—'} {isEnglish ? (secondaryBloc.profile.englishName || secondaryBloc.profile.name) : secondaryBloc.profile.name}
                </strong>
              </div>
            </div>
          ) : (
            <div style={{
              paddingTop: '1rem',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.90rem',
              color: 'var(--text-muted)'
            }}>
              <span>{primaryBloc.key === 'Mixed'
                ? (isEnglish ? 'Result type:' : 'ফলাফল:')
                : (isEnglish ? 'Profile comparison:' : 'ধারার সাথে মিল:')}</span>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
                {primaryBloc.key === 'Mixed'
                  ? (isEnglish ? 'Many responses were neutral or skipped.' : 'অনেক প্রশ্নে আপনি নিশ্চিত ছিলেন না বা উত্তর দেননি।')
                  : (isEnglish ? 'No profile reached the similarity threshold.' : 'কোনো একটি ধারার সাথে স্পষ্ট মিল পাওয়া যায়নি।')}
              </span>
            </div>
          )}
        </div>

        {/* Right: 2D Political Compass Visualizer */}
        <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '100%', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Compass size={21} color="var(--accent-green)" />
              <span>{isEnglish ? '2D Political Compass' : 'কম্পাসে আপনি'}</span>
            </h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {isEnglish ? 'Precise position on both axes' : 'অর্থনীতি (বাম–ডান) আর রাষ্ট্রক্ষমতা (উদার–শৃঙ্খলা) — দুই দিকেই আপনার অবস্থান'}
            </span>
          </div>

          <CompassChart
            coordinates={coordinates}
            quadrantProfile={quadrantProfile}
            primaryBloc={primaryBloc}
            leaders={analysis.leaderMatches}
            lang={lang}
          />
          <p style={{ marginTop: '0.8rem', color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: 1.5, textAlign: 'center' }}>
            {isEnglish
              ? 'The compass position is calculated separately and does not imply a match to a political profile.'
              : 'কম্পাসের অবস্থান আলাদাভাবে হিসাব হয়; এটা কোনো দলের সাথে মিল বোঝায় না।'}
          </p>
        </div>

      </div>

      <details className="glass-panel result-more-details" style={{ marginBottom: '2.5rem', padding: '0' }}>
        <summary style={{ cursor: 'pointer', padding: '1.25rem 1.5rem', fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <span>{isEnglish ? 'See the full breakdown (8 topics)' : 'পুরো বিশ্লেষণ দেখুন (৮টি বিষয়)'}</span>
          <ChevronDown size={20} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
        </summary>
        <div style={{ padding: '0 1rem 1rem' }}>
      {/* Ideological Coherence Score */}
      <div className="glass-panel" style={{
        padding: '1.75rem 2rem',
        marginBottom: '2.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div style={{ flex: '1 1 300px' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <Layers size={22} color="var(--accent-green)" />
            <span>{isEnglish ? 'Ideological Coherence Score' : 'আপনার মত কতটা সামঞ্জস্যপূর্ণ'}</span>
          </h3>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
            {isEnglish ? 'Measures how consistently your policy positions fit together. A higher score indicates greater alignment across your views on governance, the economy, and civil liberties.' : 'রাষ্ট্র, অর্থনীতি আর নাগরিক অধিকার নিয়ে আপনার মতগুলো একে অপরের সাথে কতটা মেলে। স্কোর বেশি মানে আপনার ভাবনা একই সুতোয় গাঁথা।'}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexShrink: 0 }}>
          <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="110" height="110" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="var(--data-track)" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke={coherenceScore >= 80 ? 'var(--accent-green)' : coherenceScore >= 60 ? 'var(--accent-gold)' : 'var(--accent-red)'}
                strokeWidth="8"
                strokeDasharray="264"
                strokeDashoffset={264 - (264 * coherenceScore) / 100}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
                style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
              />
            </svg>
            <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span className="font-latin" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {isEnglish ? coherenceScore : enToBn(coherenceScore)}%
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{isEnglish ? 'Coherent' : 'সুসংগত'}</span>
            </div>
          </div>
        </div>
      </div>


      {/* Bipolar Diverging Sliders for ALL 8 Thematic Blocks */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '3rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.35rem', color: 'var(--text-primary)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sliders size={22} color="var(--accent-green)" />
            <span>{isEnglish ? 'Your Positions Across 8 Policy Areas' : '৮টি বিষয়ে আপনি কোন দিকে'}</span>
          </h3>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)' }}>
            {isEnglish ? 'Sliders show your position between the two poles for each policy area:' : 'প্রতিটি বিষয়ের দুই প্রান্তের মাঝে আপনার অবস্থান:'}
          </p>
        </div>

        {/* 2-Column Responsive Grid Showing ALL 8 Blocks */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
          gap: '1.5rem'
        }}>
          {blockResults.map(block => {
            const leftPct = Math.round((100 - block.bipolarScore) / 2);
            const rightPct = Math.round((100 + block.bipolarScore) / 2);

            return (
              <div
                key={block.id}
                style={{
                  background: 'var(--bg-card)',
                  padding: '1.25rem',
                  borderRadius: '16px',
                  border: '1.5px solid var(--border-subtle)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                {/* Block Title */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.95rem' }}>
                    {isEnglish ? `${block.id}. ${ENGLISH_THEMATIC_BLOCKS[block.id]?.title || block.title}` : `${enToBn(block.id)}. ${block.title}`}
                  </span>
                </div>

                {/* Tug-of-War Split Bar */}
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {/* Labels Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700 }}>
                    <span style={{ color: 'var(--axis-left-color)', textAlign: 'left', flex: 1, paddingRight: '0.5rem' }}>{isEnglish ? (ENGLISH_THEMATIC_BLOCKS[block.id]?.leftShort || block.leftShort) : block.leftShort}</span>
                    <span style={{ color: 'var(--axis-right-color)', textAlign: 'right', flex: 1, paddingLeft: '0.5rem' }}>{isEnglish ? (ENGLISH_THEMATIC_BLOCKS[block.id]?.rightShort || block.rightShort) : block.rightShort}</span>
                  </div>

                  {/* The Bar */}
                  <div style={{
                    display: 'flex',
                    width: '100%',
                    height: '28px',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    background: 'var(--data-track)',
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
                  }}>
                    {leftPct > 0 && (
                      <div style={{
                        width: `${leftPct}%`,
                        background: 'var(--axis-left-color)',
                        display: 'flex',
                        alignItems: 'center',
                        paddingLeft: '10px',
                        color: 'var(--bg-card)',
                        fontSize: '0.85rem',
                        fontWeight: 'bold',
                        transition: 'width 1s ease-out'
                      }}>
                        {leftPct >= 15 ? `${enToBn(leftPct)}%` : ''}
                      </div>
                    )}
                    {rightPct > 0 && (
                      <div style={{
                        width: `${rightPct}%`,
                        background: 'var(--axis-right-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        paddingRight: '10px',
                        color: 'var(--bg-card)',
                        fontSize: '0.85rem',
                        fontWeight: 'bold',
                        transition: 'width 1s ease-out'
                      }}>
                        {rightPct >= 15 ? `${enToBn(rightPct)}%` : ''}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

        </div>
      </details>

      {/* Action Footer Callouts */}
      <div className="glass-panel dashboard-trending-section" style={{
        padding: '2rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.25rem'
      }}>
        <h3 style={{ fontSize: '1.35rem', color: 'var(--text-primary)' }}>
          {isEnglish ? 'Want to explore how other survey participants responded?' : 'অন্যরা কী বলেছে, দেখবেন?'}
        </h3>
        <p style={{ maxWidth: '640px', color: 'var(--text-secondary)', fontSize: '0.98rem', lineHeight: 1.7 }}>
          {isEnglish ? 'Explore the live dashboard for aggregate participant responses and available demographic comparisons.' : 'কোন প্রশ্নে মানুষ একমত, কোথায় দুই ভাগ — লাইভ ড্যাশবোর্ডে দেখুন।'}
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={onGoDashboard}
            className="btn-primary"
            style={{ padding: '0.85rem 2rem' }}
          >
            <BarChart2 size={20} />
            <span>{isEnglish ? 'View Live Dashboard' : 'লাইভ ড্যাশবোর্ড দেখুন'}</span>
            <ArrowRight size={18} />
          </button>

          <button
            onClick={onRetake}
            className="btn-secondary"
            style={{ padding: '0.85rem 1.6rem' }}
          >
            <RefreshCw size={18} />
            <span>{isEnglish ? 'Retake the Assessment' : 'আবার দিই'}</span>
          </button>
        </div>
      </div>

      {/* Portalled: the page wrapper's animation transform would otherwise trap position: fixed */}
      {createPortal(<div className={`result-sticky-share${showStickyShare ? ' is-visible' : ''}`} aria-hidden={!showStickyShare}>
        <button
          type="button"
          className="btn-primary"
          tabIndex={showStickyShare ? 0 : -1}
          onClick={() => window.dispatchEvent(new Event(SHARE_CARD_EVENT))}
          style={{ width: '100%', minHeight: '52px', borderRadius: '999px', fontSize: '1.05rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
        >
          <Share2 size={19} />
          {isEnglish ? 'Share my card' : 'আমার কার্ড শেয়ার করুন'}
        </button>
      </div>, document.body)}

    </div>
  );
}
