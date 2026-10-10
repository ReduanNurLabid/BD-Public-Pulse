import React, { useEffect, useState } from 'react';
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
  Feather
} from 'lucide-react';
import CompassChart from './CompassChart';
import CertificateCard from './CertificateCard';
import PersonalityCard from './PersonalityCard';
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
  demographics,
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

  const [scoreMode, setScoreMode] = useState('match'); // 'match' = Individual Policy Agreement (default), 'share' = 100% Proportional Share
  const primaryDisplayPct = scoreMode === 'share' ? primaryBloc.relativeShare : primaryBloc.percentage;
  const secondaryDisplayPct = scoreMode === 'share' ? secondaryBloc.relativeShare : secondaryBloc.percentage;
  const primaryProfileCopy = ENGLISH_PROFILE_COPY[primaryBloc.key];

  const enToBn = (num) => String(num).replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[d]);

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
            <span>{isEnglish ? 'Assessment complete • Your results are ready' : 'মূল্যায়ন সমাপ্ত • আপনার ফলাফল প্রস্তুত'}</span>
          </div>
        </div>

        <h1 style={{ fontSize: 'clamp(1.9rem, 4vw, 2.85rem)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          {primaryBloc.key === 'Mixed'
            ? (isEnglish ? 'A mixed response profile' : 'মিশ্র উত্তর প্রোফাইল')
            : primaryBloc.key === 'NoMatch'
              ? (isEnglish ? 'No clear profile match' : 'স্পষ্ট প্রোফাইল মিল নেই')
              : (isEnglish ? 'Your political profile comparison' : 'আপনার রাজনৈতিক প্রোফাইলের তুলনা')}
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)' }}>
          {isEnglish
            ? 'Your answers are compared with profiles in this survey’s scoring model. This is not a diagnosis or a measure of party support.'
            : 'এই জরিপের স্কোরিং মডেলের প্রোফাইলগুলোর সঙ্গে আপনার উত্তরের তুলনা করা হয়েছে। এটি রোগনির্ণয় বা দলীয় সমর্থনের পরিমাপ নয়।'}
        </p>
      </div>

      {/* Leader & Country Match Shareable Card (s Inspired) - Top of Body */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <Award size={24} color="#8B5CF6" />
            <span>{isEnglish ? 'Your Ideological Personality & Comparable State Models' : 'আপনার আদর্শিক ব্যক্তিত্ব ও তুলনামূলক রাষ্ট্রীয় মডেল'}</span>
          </h3>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)' }}>
            {isEnglish ? 'Save and share a card featuring the global leader and state models most compatible with your policy positions.' : 'আপনার নীতিগত অবস্থানের সাথে সর্বাধিক সামঞ্জস্যপূর্ণ বৈশ্বিক নেতা ও রাষ্ট্রব্যবস্থার শেয়ারযোগ্য কার্ডটি সংরক্ষণ ও সোশ্যাল মিডিয়ায় শেয়ার করুন'}
          </p>
        </div>

        <PersonalityCard
          analysis={analysis}
          sessionId={sessionId}
          lang={lang}
        />
      </div>

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
              <span className="badge-tag" style={{ borderColor: primaryBloc.profile.color, color: primaryBloc.profile.color }}>
                {primaryBloc.key === 'Mixed'
                  ? (isEnglish ? 'Mixed responses' : 'মিশ্র উত্তর')
                  : primaryBloc.key === 'NoMatch'
                    ? (isEnglish ? 'No clear profile match' : 'স্পষ্ট প্রোফাইল মিল নেই')
                    : (isEnglish ? 'Closest profile similarity' : 'সবচেয়ে কাছাকাছি প্রোফাইলের সাদৃশ্য')}
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
                <span>{isEnglish ? 'Similarity to a survey profile' : 'জরিপের প্রোফাইলের সঙ্গে সাদৃশ্য'}</span>
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
              <BlocLogo blocKey={primaryBloc.key} size={52} />
              <span
                style={{
                  fontSize: 'clamp(2.6rem, 5vw, 3.4rem)',
                  fontWeight: 800,
                  color: primaryBloc.profile.color,
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
                  : (primaryBloc.profile.keyPillars ? 'আপনার অবস্থানের ৩টি মূল স্তম্ভ:' : 'আপনার অবস্থানের মূল বৈশিষ্ট্যসমূহ:')}
              </div>

              {primaryBloc.profile.keyPillars ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    <span style={{ color: '#0284C7', marginTop: '2px' }}><Landmark size={17} /></span>
                    <span><strong>{isEnglish ? 'State & Governance:' : 'রাষ্ট্র ও শাসন:'}</strong> {isEnglish ? primaryProfileCopy?.pillars.state : primaryBloc.profile.keyPillars.state}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    <span style={{ color: '#D97706', marginTop: '2px' }}><Briefcase size={17} /></span>
                    <span><strong>{isEnglish ? 'Economy & Markets:' : 'অর্থনীতি ও বাজার:'}</strong> {isEnglish ? primaryProfileCopy?.pillars.market : primaryBloc.profile.keyPillars.market}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    <span style={{ color: '#059669', marginTop: '2px' }}><Feather size={17} /></span>
                    <span><strong>{isEnglish ? 'Civil Liberties:' : 'নাগরিক অধিকার:'}</strong> {isEnglish ? primaryProfileCopy?.pillars.liberty : primaryBloc.profile.keyPillars.liberty}</span>
                  </div>
                </>
              ) : (
                (isEnglish
                  ? (primaryProfileCopy?.coreValues || ['A distinctive mix of policy views'])
                  : primaryBloc.profile.coreValues).map((val, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
                      <CheckCircle2 size={16} style={{ color: primaryBloc.profile.color, flexShrink: 0 }} />
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
                  <span>{isEnglish ? 'Relative profile-similarity distribution' : 'প্রোফাইল-সাদৃশ্যের আপেক্ষিক বণ্টন'}</span>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-gold)', fontWeight: 600 }}>{isEnglish ? '(normalized to 100%)' : '(মোট ১০০%-এ স্বাভাবিকীকৃত)'}</span>
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {isEnglish ? 'A model comparison, not party support or voting intent.' : 'এটি মডেলভিত্তিক তুলনা—দলীয় সমর্থন বা ভোট দেওয়ার ইচ্ছা নয়।'}
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
                      <strong className="font-latin" style={{ color: bloc.profile.color, fontVariantNumeric: 'tabular-nums' }}>
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
              <span style={{ color: 'var(--text-secondary)' }}>{isEnglish ? 'Second-Highest Match:' : 'দ্বিতীয় সর্বোচ্চ সাদৃশ্য:'}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BlocLogo blocKey={secondaryBloc.key} size={22} />
                <strong className="font-latin" style={{ color: secondaryBloc.profile.color, fontVariantNumeric: 'tabular-nums' }}>
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
                ? (isEnglish ? 'Result type:' : 'ফলাফলের ধরন:')
                : (isEnglish ? 'Profile comparison:' : 'প্রোফাইল তুলনা:')}</span>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
                {primaryBloc.key === 'Mixed'
                  ? (isEnglish ? 'Many responses were neutral or skipped.' : 'অনেক উত্তর নিরপেক্ষ ছিল বা বাদ দেওয়া হয়েছে।')
                  : (isEnglish ? 'No profile reached the similarity threshold.' : 'কোনো প্রোফাইলের সাদৃশ্য নির্ধারিত সীমায় পৌঁছায়নি।')}
              </span>
            </div>
          )}
        </div>

        {/* Right: 2D Political Compass Visualizer */}
        <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '100%', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Compass size={21} color="#0284C7" />
              <span>{isEnglish ? '2D Political Compass' : '২ডি রাজনৈতিক কম্পাস মানচিত্র'}</span>
            </h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {isEnglish ? 'Precise position on both axes' : 'উভয় অক্ষের নিখুঁত অবস্থান'}
            </span>
          </div>

          <CompassChart
            coordinates={coordinates}
            quadrantProfile={quadrantProfile}
            primaryBloc={primaryBloc}
            lang={lang}
          />
          <p style={{ marginTop: '0.8rem', color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: 1.5, textAlign: 'center' }}>
            {isEnglish
              ? 'The compass position is calculated separately and does not imply a match to a political profile.'
              : 'কম্পাসের অবস্থান আলাদাভাবে হিসাব করা হয়; এটি কোনো রাজনৈতিক প্রোফাইলের সঙ্গে মিল বোঝায় না।'}
          </p>
        </div>

      </div>

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
            <Layers size={22} color="#059669" />
            <span>{isEnglish ? 'Ideological Coherence Score' : 'মতাদর্শিক সংহতি সূচক (Ideological Coherence)'}</span>
          </h3>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
            {isEnglish ? 'Measures how consistently your policy positions fit together. A higher score indicates greater alignment across your views on governance, the economy, and civil liberties.' : 'আপনার বিভিন্ন নীতিগত অবস্থানের পারস্পরিক সামঞ্জস্যের হার। উচ্চতর সংহতি সূচক নির্দেশ করে আপনার রাষ্ট্রচিন্তা, অর্থব্যবস্থা ও নাগরিক অধিকার সংক্রান্ত অবস্থান পরস্পর যৌক্তিক ও সুসংহত।'}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexShrink: 0 }}>
          <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="110" height="110" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#E2E8F0" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke={coherenceScore >= 80 ? '#059669' : coherenceScore >= 60 ? '#D97706' : '#EF4444'}
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
            <Sliders size={22} color="#059669" />
            <span>{isEnglish ? 'Your Positions Across 8 Policy Areas' : '৮টি নীতিগত বিষয়ে আপনার দ্বিমুখী অবস্থান'}</span>
          </h3>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)' }}>
            {isEnglish ? 'Sliders show your position between the two poles for each policy area:' : 'প্রতিটি স্বতন্ত্র নীতিগত ব্লকে উভয় মেরুর বিপরীতে আপনার সুনির্দিষ্ট অবস্থান নির্দেশক স্লাইডার:'}
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
                    <span style={{ color: '#EF4444', textAlign: 'left', flex: 1, paddingRight: '0.5rem' }}>{isEnglish ? (ENGLISH_THEMATIC_BLOCKS[block.id]?.leftShort || block.leftShort) : block.leftShort}</span>
                    <span style={{ color: '#0284C7', textAlign: 'right', flex: 1, paddingLeft: '0.5rem' }}>{isEnglish ? (ENGLISH_THEMATIC_BLOCKS[block.id]?.rightShort || block.rightShort) : block.rightShort}</span>
                  </div>

                  {/* The Bar */}
                  <div style={{
                    display: 'flex',
                    width: '100%',
                    height: '28px',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    background: '#E2E8F0', // fallback background
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
                  }}>
                    {leftPct > 0 && (
                      <div style={{
                        width: `${leftPct}%`,
                        background: 'linear-gradient(90deg, #DC2626, #EF4444)',
                        display: 'flex',
                        alignItems: 'center',
                        paddingLeft: '10px',
                        color: 'white',
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
                        background: 'linear-gradient(270deg, #2563EB, #0284C7)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        paddingRight: '10px',
                        color: 'white',
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

      {/* Optional participation certificate */}
      <div style={{ marginBottom: '3.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.55rem' }}>
            <Award size={22} style={{ color: '#D4AF37' }} />
            <span>{isEnglish ? 'Participation Certificate' : 'অংশগ্রহণ সনদ'}</span>
          </h3>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)' }}>
            {isEnglish ? 'Download or share a participation certificate. Political results are excluded unless you opt in below.' : 'অংশগ্রহণ সনদ ডাউনলোড বা শেয়ার করুন। নিচে সম্মতি না দিলে এতে রাজনৈতিক ফলাফল দেখানো হবে না।'}
          </p>
        </div>

        <CertificateCard
          analysis={analysis}
          sessionId={sessionId}
          demographics={demographics}
          lang={lang}
        />
      </div>

      {/* Action Footer Callouts */}
      <div className="glass-panel glass-panel-green" style={{
        padding: '2rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.25rem'
      }}>
        <h3 style={{ fontSize: '1.35rem', color: 'var(--text-primary)' }}>
          {isEnglish ? 'Want to explore how other survey participants responded?' : 'জরিপে অংশ নেওয়া অন্যরা কীভাবে উত্তর দিয়েছেন তা দেখতে চান?'}
        </h3>
        <p style={{ maxWidth: '640px', color: 'var(--text-secondary)', fontSize: '0.98rem', lineHeight: 1.7 }}>
          {isEnglish ? 'Explore the live dashboard for aggregate participant responses and available demographic comparisons.' : 'অংশগ্রহণকারীদের সমষ্টিগত উত্তর ও উপলভ্য জনতাত্ত্বিক তুলনা লাইভ ড্যাশবোর্ডে দেখুন।'}
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
            <span>{isEnglish ? 'Retake the Assessment' : 'আবার নতুন করে টেস্ট দিন'}</span>
          </button>
        </div>
      </div>

    </div>
  );
}
