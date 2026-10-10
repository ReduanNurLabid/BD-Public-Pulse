import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  BarChart2,
  Layers,
  Users,
  CheckCircle2,
  ShieldCheck,
  ShieldOff,
  Coins,
  Unlock,
  MessageSquare
} from 'lucide-react';
import AxisGrid from './AxisGrid';
import ResultsCollage from './ResultsCollage';
import ProposalModal from './ProposalModal';
import FeedbackModal from './FeedbackModal';
import LastUpdatedBadge from './LastUpdatedBadge';
import TrendingIssueCard from './TrendingIssueCard';
import { useAggregateStats } from '../hooks/useAggregateStats';
import { isNewVisitor } from '../lib/visitorSession';
import { BLOC_PROFILES } from '../data/questions';
import BlocLogo from './BlocLogo';

// ---------------------------------------------------------------------------
// Copy for both languages. The page takes a `lang` prop ('bn' | 'en', default
// 'bn'); wire it to the navbar toggle. Keep the two objects in the same shape.
// ---------------------------------------------------------------------------
export const WELCOME_COPY = {
  bn: {
    eyebrow: 'বাংলাদেশ রাজনৈতিক কম্পাস ২০২৬',
    heroTitleLead: 'জাতীয় রাজনীতিতে',
    heroTitleAccent: 'জনমতের প্রতিফলন',
    heroBody:
      '২৪টি গুরুত্বপূর্ণ জাতীয় ইস্যুতে আপনার মতামত প্রকাশ করুন এবং তৈরি করুন একটি কাস্টম ওপিনিয়ন কার্ড। বন্ধুদের সাথে এটি শেয়ার করে দেখে নিন আপনাদের চিন্তাভাবনা কতটা মিলছে, আর আমাদের লাইভ ড্যাশবোর্ডে পর্যবেক্ষণ করুন দেশের সামগ্রিক জনমত।',
    disclaimer: 'এই জরিপটি সম্পূর্ণ স্বেচ্ছামূলক এবং এর ফলাফল কেবল অংশগ্রহণকারীদের মতামতের ওপর ভিত্তি করে তৈরি। একে দেশের সামগ্রিক জনসংখ্যার প্রতিনিধি, জাতীয় জনমত কিংবা নির্বাচনী পূর্বাভাস হিসেবে গণ্য করার সুযোগ নেই।',
    heroTags: ['সম্পূর্ণ বিনামূল্যে', 'জনমিতিক তথ্য ঐচ্ছিক', 'উন্মুক্ত প্ল্যাটফর্ম', 'নিরপেক্ষ মূল্যায়ন'],
    heroPrimaryCta: 'আপনার মতামত দিন',
    heroSecondaryCta: 'লাইভ ড্যাশবোর্ড দেখুন',
    quoteText: '“মানুষ স্বভাবতই একটি রাজনৈতিক জীব।”',
    quoteAuthor: '— অ্যারিস্টটল',

    statsEyebrow: '— সর্বশেষ তথ্য',
    statsTitle: 'জনমতের রিয়েল-টাইম প্রবণতা পর্যবেক্ষণ করুন',
    statsCta: 'লাইভ ডাটা এক্সপ্লোর করুন',
    totalLabel: 'মোট অংশগ্রহণকারী',
    verifiedLine: (verified, total, isAll) => (
      isAll
        ? <>উত্তর যাচাইকৃত</>
        : <>যাচাইকৃত মানসম্মত উত্তর: <span className="font-latin">{verified}</span> জন</>
    ),
    verifiedEmpty: 'যাচাইকৃত তথ্যের প্রক্রিয়া চলছে',
    verifiedShare: 'ডাটা ইন্টেগ্রিটি স্কোর',
    blocsTitle: 'অংশগ্রহণকারীদের মধ্যে কাছাকাছি রাজনৈতিক ধারা',
    noData: 'এখনো তথ্য নেই',

    actionEyebrow: '— অংশগ্রহণ করুন',
    actionTitle: 'পরবর্তী পদক্ষেপ',
    actionBody:
      'আপনার মতামতই দেশের সামগ্রিক চিত্র ফুটিয়ে তুলবে। সম্মিলিত ফলাফল দেখুন, বন্ধুদের সাথে আপনার কাস্টম ওপিনিয়ন কার্ডটি শেয়ার করুন এবং পরবর্তী জরিপের জন্য গুরুত্বপূর্ণ জাতীয় ইস্যুর প্রস্তাব দিন।',

    surveyBadge: 'চলমান জরিপ',
    surveyTitle: 'জনমত',
    surveyTitleSub: 'জরিপ',
    surveyBody:
      '২৪টি গুরুত্বপূর্ণ জাতীয় ইস্যুতে আপনার মতামত দিন। আপনার দৃষ্টিভঙ্গি পর্যালোচনা করে অন্যদের সাথে শেয়ার করার জন্য তাৎক্ষণিকভাবে একটি কাস্টম কার্ড তৈরি করুন।',
    surveyTime: 'সময় লাগবে প্রায় ৩–৪ মিনিট',
    surveyCta: 'আপনার মতামত দিন',

    dashBadge: 'অংশগ্রহণকারীদের মতামত',
    dashTitle: 'লাইভ',
    dashTitleSub: 'ড্যাশবোর্ড',
    dashBody:
      'সারা দেশের রিয়েল-টাইম ডাটা এক্সপ্লোর করুন, সুনির্দিষ্ট ইস্যুতে জনমতের বিভাজন ফিল্টার করুন এবং আঞ্চলিক জনমিতির বিস্তারিত তথ্য বিশ্লেষণ করুন।',
    dashCta: 'ড্যাশবোর্ড দেখুন',

    proposalBadge: 'নাগরিক প্রস্তাবনা',
    proposalTitle: 'প্রস্তাব করুন',
    proposalTitleSub: 'নতুন বিষয়',
    proposalBody:
      'পরবর্তীতে কোন গুরুত্বপূর্ণ জাতীয় বিষয়টি আমাদের অন্বেষণ করা উচিত? আগামী দিনের নাগরিক আলোচনাগুলো সাজাতে আপনার মূল্যবান আইডিয়া সাবমিট করুন।',
    proposalCta: 'বিষয় প্রস্তাব করুন',

    footerTransparencyTitle: 'স্বচ্ছতা ও নির্ভরযোগ্যতা',
    footerTransparencyCards: [
      {
        title: 'সম্পূর্ণ স্বাধীন',
        body: 'যেকোনো রাজনৈতিক দল, সরকারি প্রতিষ্ঠান কিংবা নির্বাচনী প্রচারণার সাথে সম্পূর্ণ সম্পৃক্ততাহীন।'
      },
      {
        title: 'নিরপেক্ষ ফলাফল',
        body: 'সম্পূর্ণ উপাত্ত-ভিত্তিক এবং সব ধরনের বাণিজ্যিক প্রভাব কিংবা পেইড প্লেসমেন্ট মুক্ত।'
      },
      {
        title: 'উন্মুক্ত মেথডোলজি',
        body: 'আমাদের গাণিতিক ও বিশ্লেষণাত্মক স্কোরিং কাঠামো সম্পূর্ণ স্বচ্ছ এবং সবার জন্য উন্মুক্তভাবে নথিবদ্ধ।'
      }
    ],
    footerFeedbackTitle: 'কোনো প্রশ্নে পক্ষপাত বা প্রোফাইলে অসামঞ্জস্য লক্ষ্য করেছেন?',
    footerFeedbackNote: 'এই স্বাধীন গবেষণা প্রকল্পটি সম্পূর্ণ নিরপেক্ষভাবে জনমত মানচিত্রায়ন করে। আমরা কোনো রাজনৈতিক দলের সাথে সম্পৃক্ত নই এবং কঠোর আদর্শিক ভারসাম্য বজায় রাখতে প্রতিশ্রুতিবদ্ধ। আমাদের প্ল্যাটফর্মকে আরও নিখুঁত করতে সাহায্য করুন।',
    footerFeedbackCta: 'উন্নয়নের জন্য মতামত দিন',
  },

  en: {
    eyebrow: '— Bangladesh Political Compass · 2026',
    heroTitleLead: 'National Politics',
    heroTitleAccent: 'Public Opinion',
    heroBody:
      'Share your voice on 24 critical national issues and generate a custom opinion card. Pass it along to friends to see how your thoughts align, and track real-time public sentiment on our live dashboard.',
    disclaimer: 'Participation is voluntary. As a self-selected survey, the results represent the participants rather than the wider population, and should not be used as a national poll or election forecast.',
    heroTags: ['Free', 'Optional demographics', 'For every view', 'No right or wrong answers'],
    heroPrimaryCta: 'Take the test now',
    heroSecondaryCta: 'See live dashboard',
    quoteText: '“Man is by nature a political animal.”',
    quoteAuthor: '— Aristotle',

    statsEyebrow: '— Latest figures',
    statsTitle: 'Explore real-time public opinion',
    statsCta: 'Explore live data',
    totalLabel: 'Total participants',
    verifiedLine: (verified, total, isAll) => (
      isAll
        ? <>Verified Responses</>
        : <><span className="font-latin">{verified}</span> Data integrity score</>
    ),
    verifiedEmpty: 'Processing quality data',
    verifiedShare: 'verified quality rate',
    blocsTitle: 'Trending political leanings',
    noData: 'No data yet',

    actionEyebrow: '— Get involved',
    actionTitle: "What's next",
    actionBody:
      'Your input shapes the big picture. View the collective results, share your custom opinion card with friends, or suggest what important national issue we should cover next.',

    surveyBadge: 'Ongoing survey',
    surveyTitle: 'Opinion',
    surveyTitleSub: 'survey',
    surveyBody:
      'Answer 24 questions; there are no right or wrong answers. Review your results and choose what to include if you make a share card.',
    surveyTime: 'About 3–4 minutes',
    surveyCta: 'Take the survey',

    dashBadge: 'Participant responses',
    dashTitle: 'Live',
    dashTitleSub: 'dashboard',
    dashBody:
      'Explore real-time data from across the country, filter responses by key issues, and deep dive into regional demographics.',
    dashCta: 'Open dashboard',

    proposalBadge: 'Citizen proposal',
    proposalTitle: 'Shape the',
    proposalTitleSub: 'next topic',
    proposalBody:
      'What pressing national issue should we explore next? Submit your ideas to help map out upcoming civic discussions.',
    proposalCta: 'Suggest a topic',

    footerTransparencyTitle: 'Transparency & Trust',
    footerTransparencyCards: [
      {
        title: 'Completely Independent',
        body: 'Entirely unaffiliated with political parties, government institutions, or active campaigns.'
      },
      {
        title: 'Unbiased Results',
        body: 'Purely data-driven with absolutely zero commercial influence or paid placements.'
      },
      {
        title: 'Open Methodology',
        body: 'Our analytical scoring framework is fully transparent and publicly documented.'
      }
    ],
    footerFeedbackTitle: 'Spot a biased question or an inaccurate profile?',
    footerFeedbackNote: 'This independent research project maps public sentiment neutrally. We are completely unaffiliated with any political party and dedicated to maintaining strict ideological balance. Help us stay precise.',
    footerFeedbackCta: 'Suggest an improvement',
  },
};

// Short English names for the bloc rows (stats keys match BLOC_PROFILES keys).
// If a bloc object in the stats document carries `labelEn`, that wins.
const BLOC_LABEL_EN = {
  AL: 'Awami League',
  BNP: 'BNP',
  JI: 'Jamaat-e-Islami',
  Student: 'NCP',
  Sushil: 'Civil society',
};

export default function WelcomePage({ onStartTest, onGoDashboard, lang = 'bn' }) {
  const [isProposalOpen, setProposalOpen] = useState(false);
  const [isFeedbackOpen, setFeedbackOpen] = useState(false);
  const [isNew, setIsNew] = useState(isNewVisitor);

  useEffect(() => {
    const handleStatus = () => setIsNew(isNewVisitor());
    window.addEventListener('bdc_submission_status_changed', handleStatus);
    window.addEventListener('storage', handleStatus);
    return () => {
      window.removeEventListener('bdc_submission_status_changed', handleStatus);
      window.removeEventListener('storage', handleStatus);
    };
  }, []);

  const L = lang === 'en' ? 'en' : 'bn';
  const t = WELCOME_COPY[L];
  // Bangla mode shows Bangla digits (bn-BD also uses lakh grouping); English
  // mode shows Latin digits. To keep Latin digits everywhere, use 'en-US' here.
  const nf = new Intl.NumberFormat(L === 'en' ? 'en-US' : 'bn-BD', { maximumFractionDigits: 1 });
  const fmt = (n) => nf.format(Number(n) || 0);
  const blocLabel = (key, bloc) =>
    L === 'en' ? (bloc.labelEn || BLOC_LABEL_EN[key] || bloc.label) : bloc.label;
  // Single getDoc on mount, deliberately no live updates. Visitors read this page
  // and proceed to the test, so a listener or interval would cost reads without
  // ever being seen. One read per visitor is the whole budget.
  const { stats: liveStats } = useAggregateStats('once');

  const totalResponses = liveStats?.totalResponses || 0;
  const verifiedResponses = liveStats?.verifiedResponses || 0;
  const rejectedResponses = liveStats?.rejectedResponses || 0;
  const hasLiveData = totalResponses > 0;
  const verifiedPercent = hasLiveData ? Math.round((verifiedResponses / totalResponses) * 100) : 0;
  const activeDivisionsCount = Object.values(liveStats?.divisions || {}).filter(d => (d.count || 0) > 0).length;

  const allBlocs = liveStats
    ? Object.keys(BLOC_PROFILES).map((key) => {
      const blocData = liveStats.blocs?.[key] || {
        count: 0,
        percentage: 0,
        label: BLOC_PROFILES[key].name,
        color: BLOC_PROFILES[key].color
      };
      return [key, blocData];
    }).sort((a, b) => (b[1]?.count || 0) - (a[1]?.count || 0))
    : [];

  // Wedge issues ride the same aggregate document as the rest of this section,
  // so the trending split shown here is the exact one the Dashboard tab renders.
  const trendingIssues = liveStats?.wedgeIssues || [];

  return (
    <div className="animate-fade-in" lang={L} style={{ width: '100%' }}>

      {/* s Style Hero Section */}
      <div style={{ width: '100%', boxSizing: 'border-box', maxWidth: '1360px', margin: '0 auto', padding: '4rem 1.5rem 6rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4rem' }}>

        {/* Left Column: Typography */}
        <div style={{ flex: '1 1 440px', minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div style={{
            color: 'var(--text-red)',
            fontWeight: 800,
            fontSize: '0.85rem',
            letterSpacing: '0.1em',
            marginBottom: '1.5rem',
            textTransform: 'uppercase'
          }} className="font-latin">
            {t.eyebrow}
          </div>

          <h1 style={{
            fontSize: 'clamp(2.8rem, 6vw, 4.2rem)',
            fontWeight: 800,
            color: 'var(--text-primary)',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            marginBottom: '1.5rem'
          }}>
            {t.heroTitleLead} <span style={{ color: 'var(--hero-accent)' }}>{t.heroTitleAccent}</span>
          </h1>

          <p style={{
            fontSize: '1.15rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            marginBottom: '1rem',
            maxWidth: '560px'
          }}>
            {t.heroBody}
          </p>
          <p style={{
            maxWidth: '560px',
            margin: '0 0 1.75rem 0',
            marginLeft: 0,
            marginRight: 0,
            color: 'var(--text-muted)',
            fontSize: '0.84rem',
            lineHeight: 1.55,
            alignSelf: 'flex-start',
            textAlign: 'inherit'
          }}>
            {t.disclaimer}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            <button
              onClick={onStartTest}
              className="btn-hero-start font-latin"
              style={{
                background: 'var(--bg-card-hover)',
                color: 'var(--text-primary)',
                border: '1.5px solid var(--text-primary)',
                borderRadius: '999px',
                padding: '0.85rem 1.5rem',
                fontSize: '1rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--text-primary)';
                e.currentTarget.style.color = 'var(--bg-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--bg-card-hover)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
            >
              {isNew && <span className="hero-cta-guide-dot" title={L === 'en' ? 'Start test here' : 'মূল্যায়ন শুরু করুন'} />}
              {t.heroPrimaryCta} <ArrowRight size={18} />
            </button>

            <button
              onClick={onGoDashboard}
              className="font-latin"
              style={{
                background: 'transparent',
                color: 'var(--text-primary)',
                border: '1.5px solid var(--text-primary)',
                borderRadius: '999px',
                padding: '0.85rem 1.5rem',
                fontSize: '1rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--text-primary)';
                e.currentTarget.style.color = 'var(--bg-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
            >
              {t.heroSecondaryCta} <BarChart2 size={18} />
            </button>
          </div>

          <div className="font-latin" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1rem', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '2.5rem' }}>
            {t.heroTags.map((tag) => (
              <span key={tag}>• {tag}</span>
            ))}
          </div>

          {/* Aristotle Quote Block */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            background: '#0f2c1bff', // Dark elegant background
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '0.5rem 0.5rem 0.5rem',
            borderRadius: '20px 20px 20px 0px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
            position: 'relative',
            overflow: 'hidden',
            maxWidth: '800px'
          }}>
            {/* Ambient glow behind image */}
            <div style={{
              position: 'absolute',
              left: '-20px',
              bottom: '-20px',
              width: '150px',
              height: '150px',
              background: 'var(--hero-accent)',
              filter: 'blur(45px)',
              opacity: 0.1,
              zIndex: 0
            }} />

            <img
              src="/aristotle.png"
              alt="Aristotle"
              style={{
                width: '110px',
                height: '110px',
                objectFit: 'contain',
                position: 'relative',
                zIndex: 0,
                filter: 'drop-shadow(3px 5px 8px rgba(0,0,0,0.4))',
                margin: '-1rem 0 -1rem -1rem' // Let it slightly break out of the padding constraint
              }}
            />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{
                fontFamily: 'serif',
                fontSize: '1.29rem',
                fontStyle: 'italic',
                color: '#ffe9baff',
                margin: '0 0 0 0',
                lineHeight: 1.75
              }}>
                {t.quoteText}
              </p>
              <p style={{
                fontSize: '0.95rem',
                fontWeight: 700,
                color: '#94A3B8',
                margin: 0,
                letterSpacing: '0.05em',
                textTransform: 'uppercase'
              }}>
                {t.quoteAuthor}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Collage of Example Results (Story Card + Certificate) */}
        <div style={{ flex: '1 1 440px', minWidth: 0, display: 'flex', justifyContent: 'center' }}>
          <ResultsCollage lang={L} />
        </div>
      </div>

      {/* Live Statistics Preview Section */}
      <div style={{ background: 'var(--action-section-bg)', padding: '5rem 1.5rem', color: 'var(--action-section-text)', position: 'relative', zIndex: 1, transition: 'background 0.3s ease, color 0.3s ease' }}>
        <div style={{ maxWidth: '1360px', width: '100%', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <span style={{ color: 'var(--action-section-text)', opacity: 0.8, fontWeight: 800, fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase' }} className="font-latin">{t.statsEyebrow}</span>
            {/* Snapshot, not a live feed — no pulsing dot here. */}
            <LastUpdatedBadge lastUpdated={liveStats?.lastUpdated} live={false} tone="inverted" lang={L} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 800, color: 'var(--action-section-text)', letterSpacing: '-0.02em', lineHeight: 1.1, maxWidth: '600px' }}>
              {t.statsTitle}
            </h2>
            <button
              onClick={onGoDashboard}
              className="font-latin"
              style={{
                background: 'var(--action-card2-btn-bg)',
                color: 'var(--action-card2-btn-text)',
                border: '1.5px solid var(--action-card2-btn-bg)',
                borderRadius: '999px',
                padding: '0.9rem 1.75rem',
                fontSize: '1rem',
                fontWeight: 700,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--action-section-text)';
                e.currentTarget.style.borderColor = 'var(--action-section-text)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--action-card2-btn-bg)';
                e.currentTarget.style.color = 'var(--action-card2-btn-text)';
                e.currentTarget.style.borderColor = 'var(--action-card2-btn-bg)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {t.statsCta} <ArrowRight size={18} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

            {/* Stat Card 1 */}
            <div style={{
              background: 'var(--action-card1-bg)',
              borderRadius: '24px',
              padding: '2.5rem',
              color: 'var(--action-card1-text)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'all 0.3s ease'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ color: 'var(--action-card1-text)', opacity: 0.75, fontSize: '0.9rem', fontWeight: 700 }}>
                    {t.totalLabel}
                  </span>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '3px 9px',
                    borderRadius: '999px',
                    background: 'rgba(16, 46, 36, 0.08)',
                    fontSize: '0.75rem',
                    fontWeight: 700
                  }} className="font-latin">
                    <Users size={13} style={{ color: 'var(--action-card1-text)' }} />
                    {L === 'en' ? 'Live' : 'সরাসরি'}
                  </span>
                </div>

                <div style={{ fontSize: '3.4rem', fontWeight: 800, color: 'var(--action-card1-text)', marginBottom: '0.5rem', lineHeight: 1 }} className="font-latin">
                  {hasLiveData ? fmt(totalResponses) : '—'}
                </div>

                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'var(--action-card1-text)',
                  opacity: 0.9,
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  marginBottom: '1.5rem'
                }}>
                  <CheckCircle2 size={16} style={{ color: '#059669', flexShrink: 0 }} />
                  <span>
                    {hasLiveData
                      ? t.verifiedLine(fmt(verifiedResponses), fmt(totalResponses), verifiedResponses >= totalResponses)
                      : t.verifiedEmpty}
                  </span>
                </div>

                {/* 3-Metric Highlight Grid with Verified, Rejected, and Coverage */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '0.65rem',
                  padding: '0.85rem',
                  background: 'rgba(16, 46, 36, 0.04)',
                  borderRadius: '16px',
                  border: '1px solid rgba(16, 46, 36, 0.08)',
                  marginBottom: '1.25rem'
                }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.65, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      {L === 'en' ? 'Verified' : 'যাচাইকৃত'}
                    </div>
                    <div style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--action-card1-text)', marginTop: '2px' }} className="font-latin">
                      {fmt(verifiedResponses)}
                    </div>
                    <div style={{ fontSize: '0.68rem', opacity: 0.65, marginTop: '2px' }}>
                      {L === 'en' ? 'Valid Responses' : 'মানসম্মত'}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em', color: 'var(--accent-red)' }}>
                      {L === 'en' ? 'Rejected' : 'বাতিলকৃত'}
                    </div>
                    <div style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--accent-red)', marginTop: '2px' }} className="font-latin">
                      {fmt(rejectedResponses)}
                    </div>
                    <div style={{ fontSize: '0.68rem', opacity: 0.65, marginTop: '2px' }}>
                      {L === 'en' ? 'Filtered Out' : 'ফিল্টার্ড'}
                    </div>
                  </div>

                </div>
              </div>

              {/* Verified share of the total */}
              {hasLiveData && (
                <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem', fontSize: '0.8rem', fontWeight: 700 }}>
                    <span style={{ opacity: 0.75 }}>{t.verifiedShare}</span>
                    <span className="font-latin" style={{ fontWeight: 800 }}>{fmt(verifiedPercent)}%</span>
                  </div>
                  <div style={{ height: '7px', background: 'rgba(16, 46, 36, 0.1)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${verifiedPercent}%`, background: 'var(--action-card1-text)', opacity: 0.9, borderRadius: '999px', transition: 'width 0.6s var(--ease-smooth)' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.6rem', fontSize: '0.72rem', opacity: 0.65 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ShieldCheck size={12} /> {L === 'en' ? '100% Anonymous' : '১০০% গোপনীয়'}
                    </span>
                    <span>{L === 'en' ? 'Voluntary Poll' : 'স্বেচ্ছামূলক জরিপ'}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Stat Card 2 */}
            <div style={{ background: 'var(--action-card2-bg)', border: '2px solid var(--action-card2-border)', borderRadius: '24px', padding: '2.25rem 2rem', color: 'var(--action-card2-text)', display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease' }}>
              <div style={{ color: 'var(--action-card2-text)', opacity: 0.7, fontSize: '0.9rem', fontWeight: 700, marginBottom: '1.25rem' }}>{t.blocsTitle}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {hasLiveData ? allBlocs.map(([blocKey, bloc], index) => (
                  <div key={blocKey} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                    <span
                      className="font-latin"
                      style={{
                        fontSize: '0.85rem',
                        fontWeight: 800,
                        color: 'var(--action-card2-text)',
                        opacity: 0.5,
                        minWidth: '14px',
                        textAlign: 'center',
                        flexShrink: 0
                      }}
                    >
                      {fmt(index + 1)}
                    </span>
                    <BlocLogo blocKey={blocKey} size={34} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem', gap: '0.75rem' }}>
                        <span style={{ minWidth: 0, fontWeight: 700, fontSize: '0.92rem', color: 'var(--action-card2-text)' }}>{blocLabel(blocKey, bloc)}</span>
                        <span className="font-latin" style={{ flexShrink: 0, whiteSpace: 'nowrap', fontWeight: 800, color: bloc.color }}>{fmt(bloc.percentage)}%</span>
                      </div>
                      <div style={{ height: '6px', background: 'var(--stats-track-bg)', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${Math.min(100, bloc.percentage)}%`, background: bloc.color, borderRadius: '999px' }} />
                      </div>
                    </div>
                  </div>
                )) : (
                  <div style={{ color: 'var(--action-card2-text)', opacity: 0.8, fontSize: '0.95rem' }}>{t.noData}</div>
                )}
              </div>
            </div>

            {/* Stat Card 3 */}
            <TrendingIssueCard issues={trendingIssues} lang={L} />

          </div>
        </div>
      </div>

      {/* Axis Grid Section */}
      <div id="axis-grid-section">
        <AxisGrid lang={L} />
      </div>

      {/* Action Selection Section */}
      <div style={{ background: 'var(--action-section-bg)', padding: '5rem 1.5rem', color: 'var(--action-section-text)', transition: 'background 0.3s ease, color 0.3s ease' }}>
        <div style={{ maxWidth: '1360px', width: '100%', margin: '0 auto' }}>

          <div style={{
            color: 'var(--action-section-text)',
            opacity: 0.8,
            fontWeight: 800,
            fontSize: '0.85rem',
            letterSpacing: '0.1em',
            marginBottom: '1rem',
            textTransform: 'uppercase'
          }} className="font-latin">
            {t.actionEyebrow}
          </div>

          <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.02em', color: 'var(--action-section-text)' }} className="font-latin">
            {t.actionTitle}
          </h2>

          <p style={{ fontSize: '1.1rem', color: 'var(--action-section-muted)', maxWidth: '600px', marginBottom: '3rem', lineHeight: 1.6 }}>
            {t.actionBody}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

            {/* Take Quiz Card */}
            <div style={{
              background: 'var(--action-card1-bg)',
              borderRadius: '24px',
              padding: '2.5rem',
              color: 'var(--action-card1-text)',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              transition: 'all 0.3s ease'
            }}>
              {/* Badge in normal flex flow */}
              <div style={{
                alignSelf: 'flex-start',
                marginBottom: '0.85rem',
                background: '#880912',
                color: '#F4F1E8',
                padding: '0.25rem 0.85rem',
                borderRadius: '999px',
                fontSize: '0.75rem',
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }} className="font-latin">
                <span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', background: '#4ADE80' }}></span> {t.surveyBadge}
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: 'clamp(1.8rem, 5vw, 2.2rem)', fontWeight: 800, lineHeight: 1 }} className="font-latin">{t.surveyTitle}</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>{t.surveyTitleSub}</span>
              </div>

              <p style={{ fontSize: '1rem', color: 'var(--action-card1-text)', opacity: 0.9, marginBottom: '2rem', flex: 1 }}>
                {t.surveyBody}
              </p>

              <div style={{ fontSize: '0.9rem', color: 'var(--action-card1-text)', opacity: 0.8, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <span className="font-latin">⏱ {t.surveyTime}</span>
              </div>

              <button
                onClick={onStartTest}
                className="font-latin"
                style={{
                  background: 'var(--action-card1-btn-bg)',
                  color: 'var(--action-card1-btn-text)',
                  border: '1.5px solid var(--action-card1-btn-bg)',
                  borderRadius: '999px',
                  padding: '1rem',
                  fontSize: '1rem',
                  fontWeight: 700,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--action-card1-btn-bg)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--action-card1-btn-bg)';
                  e.currentTarget.style.color = 'var(--action-card1-btn-text)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {isNew && <span className="hero-cta-guide-dot" title={L === 'en' ? 'Start test here' : 'মূল্যায়ন শুরু করুন'} />}
                {t.surveyCta} <ArrowRight size={18} />
              </button>
            </div>

            {/* View Dashboard Card */}
            <div style={{
              background: 'var(--action-card2-bg)',
              borderRadius: '24px',
              padding: '2.5rem',
              color: 'var(--action-card2-text)',
              border: '2px solid var(--action-card2-border)',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              transition: 'all 0.3s ease'
            }}>
              {/* Badge in normal flex flow */}
              <div style={{
                alignSelf: 'flex-start',
                marginBottom: '0.85rem',
                background: 'var(--action-card2-badge)',
                color: 'var(--action-card2-text)',
                padding: '0.25rem 0.85rem',
                borderRadius: '999px',
                fontSize: '0.75rem',
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center'
              }} className="font-latin">
                {t.dashBadge}
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: 'clamp(1.8rem, 5vw, 2.2rem)', fontWeight: 800, lineHeight: 1 }} className="font-latin">{t.dashTitle}</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>{t.dashTitleSub}</span>
              </div>

              <p style={{ fontSize: '1rem', color: 'var(--action-card2-text)', opacity: 0.8, marginBottom: '2rem', flex: 1 }}>
                {t.dashBody}
              </p>

              <button
                onClick={onGoDashboard}
                className="font-latin"
                style={{
                  background: 'var(--action-card2-btn-bg)',
                  color: 'var(--action-card2-btn-text)',
                  border: '1.5px solid var(--action-card2-btn-bg)',
                  borderRadius: '999px',
                  padding: '1rem',
                  fontSize: '1rem',
                  fontWeight: 700,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  marginTop: 'auto',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--action-card2-btn-bg)';
                  e.currentTarget.style.borderColor = 'var(--action-card2-text)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--action-card2-btn-bg)';
                  e.currentTarget.style.color = 'var(--action-card2-btn-text)';
                  e.currentTarget.style.borderColor = 'var(--action-card2-btn-bg)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {t.dashCta} <BarChart2 size={18} />
              </button>
            </div>

            {/* Submit Idea Card */}
            <div style={{
              background: 'var(--action-card3-bg)',
              borderRadius: '24px',
              padding: '2.5rem',
              color: 'var(--action-card3-text)',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              transition: 'all 0.3s ease'
            }}>
              {/* Badge in normal flex flow */}
              <div style={{
                alignSelf: 'flex-start',
                marginBottom: '0.85rem',
                background: 'var(--action-card3-badge)',
                color: 'var(--action-card3-text)',
                padding: '0.25rem 0.85rem',
                borderRadius: '999px',
                fontSize: '0.75rem',
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center'
              }} className="font-latin">
                {t.proposalBadge}
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: 'clamp(1.8rem, 5vw, 2.2rem)', fontWeight: 800, lineHeight: 1 }} className="font-latin">{t.proposalTitle}</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>{t.proposalTitleSub}</span>
              </div>

              <p style={{ fontSize: '1rem', color: 'var(--action-card3-text)', opacity: 0.8, marginBottom: '2rem', flex: 1 }}>
                {t.proposalBody}
              </p>

              <button
                onClick={() => setProposalOpen(true)}
                className="font-latin"
                style={{
                  background: 'transparent',
                  color: 'var(--action-card3-text)',
                  border: '2px solid var(--action-card3-btn-border)',
                  borderRadius: '999px',
                  padding: '1rem',
                  fontSize: '1rem',
                  fontWeight: 700,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  marginTop: 'auto',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--action-card3-btn-border)';
                  e.currentTarget.style.color = 'var(--action-card3-bg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--action-card3-text)';
                }}
              >
                {t.proposalCta} <Layers size={18} />
              </button>
            </div>

          </div>

          {/* Feedback & Correction Callout Banner */}
          <div style={{
            marginTop: '2.5rem',
            background: 'var(--action-card3-bg)',
            border: '1.5px solid var(--action-card2-border)',
            borderRadius: '24px',
            padding: '2.25rem 1.5rem',
            color: 'var(--action-card3-text)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              marginBottom: '1.25rem',
              maxWidth: '650px',
              flexWrap: 'wrap'
            }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: 'var(--action-card3-badge)',
                color: 'var(--action-card3-text)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <MessageSquare size={19} />
              </div>
              <h4 style={{
                fontSize: 'clamp(1.05rem, 2.5vw, 1.2rem)',
                fontWeight: 700,
                color: 'var(--action-card3-text)',
                margin: 0,
                lineHeight: 1.35
              }}>
                {t.footerFeedbackTitle}
              </h4>
            </div>

            <p style={{
              fontSize: '0.9rem',
              color: 'var(--action-card3-text)',
              opacity: 0.85,
              maxWidth: '850px',
              margin: '0 auto 1.5rem auto',
              lineHeight: 1.6,
              textAlign: 'center'
            }}>
              {t.footerFeedbackNote}
            </p>

            <button
              onClick={() => setFeedbackOpen(true)}
              type="button"
              className="font-latin"
              style={{
                background: 'var(--action-card2-btn-bg)',
                color: 'var(--action-card2-btn-text)',
                border: '1.5px solid var(--action-card2-btn-bg)',
                borderRadius: '999px',
                padding: '0.85rem 1.75rem',
                fontSize: '0.95rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--action-card2-btn-bg)';
                e.currentTarget.style.borderColor = 'var(--action-card3-text)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--action-card2-btn-bg)';
                e.currentTarget.style.color = 'var(--action-card2-btn-text)';
                e.currentTarget.style.borderColor = 'var(--action-card2-btn-bg)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {t.footerFeedbackCta} <ArrowRight size={17} />
            </button>
          </div>

        </div>
      </div>

      {/* Transparency and Feedback Footer */}
      <div style={{ background: 'var(--bg-primary)', padding: '4rem 1.5rem', borderTop: '1px solid var(--border-subtle)', textAlign: 'center' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '2rem' }} className="font-latin">
            {t.footerTransparencyTitle}
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {t.footerTransparencyCards.map((card, idx) => {
              const Icon = idx === 0 ? ShieldOff : idx === 1 ? Coins : Unlock;
              return (
                <div key={idx} style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-subtle)', textAlign: 'left', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <div style={{ background: 'var(--hero-badge-bg)', padding: '0.75rem', borderRadius: '12px', marginBottom: '1rem' }}>
                    <Icon size={24} style={{ color: 'var(--hero-accent)' }} />
                  </div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{card.title}</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{card.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <ProposalModal isOpen={isProposalOpen} onClose={() => setProposalOpen(false)} lang={L} />
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setFeedbackOpen(false)} lang={L} />

    </div>
  );
}