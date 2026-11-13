import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  BarChart2,
  Layers,
  Users,
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
import { BLOC_PROFILES } from '../data/questions';
import WeeklyIssueCard from './WeeklyIssueCard';
import HomeFaq from './HomeFaq';
import BlocLogo from './BlocLogo';

// ---------------------------------------------------------------------------
// Copy for both languages. The page takes a `lang` prop ('bn' | 'en', default
// 'bn'); wire it to the navbar toggle. Keep the two objects in the same shape.
// ---------------------------------------------------------------------------
export const WELCOME_COPY = {
  bn: {
    eyebrow: 'বাংলাদেশ রাজনৈতিক কম্পাস ২০২৬',
    heroTitleLead: 'আপনি',
    heroTitleAccent: 'কোন পন্থী?',
    heroBody:
      'দেশের বড় প্রশ্নগুলোতে আপনার মত দিন। মাত্র ২ মিনিটে জেনে নিন রাজনীতির মানচিত্রে আপনি কোথায় দাঁড়িয়ে — আর বন্ধুরা কোথায়।',
    disclaimer: 'ফলাফল শুধু অংশগ্রহণকারীদের মত — দেশের সবার মত বা নির্বাচনের পূর্বাভাস নয়।',
    heroTags: ['নাম-ফোন লাগবে না', 'কোনো দলের সাথে যুক্ত নই', 'হিসাবের পদ্ধতি উন্মুক্ত'],
    heroPrimaryCta: 'শুরু করি',
    heroSecondaryCta: 'সবাই কী ভাবছে দেখুন',
    lengthHint: 'সময় কম?',
    lengthShort: '২ মিনিটের ছোট সংস্করণ',
    lengthLong: '৬ মিনিটের পূর্ণ সংস্করণ',
    quoteText: '“মানুষ স্বভাবতই একটি রাজনৈতিক জীব।”',
    quoteAuthor: '— অ্যারিস্টটল',

    statsEyebrow: '— সবাই কী ভাবছে',
    statsTitle: 'অংশগ্রহণকারীদের সামষ্টিক চিন্তাধারা',
    statsCta: 'পুরো ফলাফল দেখুন',
    totalLabel: 'এ পর্যন্ত অংশ নিয়েছেন',
    verifiedLine: (verified, total, isAll) => (
      isAll
        ? <>উত্তর যাচাইকৃত</>
        : <>যাচাইকৃত মানসম্মত উত্তর: <span className="font-latin">{verified}</span> জন</>
    ),
    verifiedEmpty: 'যাচাইকৃত তথ্যের প্রক্রিয়া চলছে',
    verifiedShare: 'ডাটা ইন্টেগ্রিটি স্কোর',
    blocsTitle: 'কোন ধারার সাথে মিল বেশি',
    noData: 'এখনো তথ্য নেই',

    actionEyebrow: '— আপনার পালা',
    actionTitle: 'এরপর কী?',
    actionBody:
      'আপনার একটা উত্তরও ছবিটা বদলে দেয়। প্রশ্নের উত্তর দিন, ফলাফল কার্ড শেয়ার করুন, আর পরের জরিপের বিষয় আপনিই ঠিক করুন।',

    surveyBadge: 'চলমান জরিপ',
    surveyTitle: 'নিজের',
    surveyTitleSub: 'অবস্থান জানুন',
    surveyBody:
      'দেশের বড় প্রশ্নগুলোতে আপনার মত দিন। সাথে সাথে পাবেন নিজের ফলাফল কার্ড — শেয়ার করুন, বন্ধুদের সাথে মিলিয়ে দেখুন।',
    surveyTime: 'কতক্ষণ সময় দেবেন?',
    surveyLengths: { short: ['২ মিনিট', '১৬ প্রশ্ন'], medium: ['৪ মিনিট', '২৪ প্রশ্ন'], long: ['৬ মিনিট', '৩২ প্রশ্ন'] },

    dashBadge: 'অংশগ্রহণকারীদের মতামত',
    dashTitle: 'লাইভ',
    dashTitleSub: 'ড্যাশবোর্ড',
    dashBody:
      'অন্যরা কী বলছে দেখুন — কোন প্রশ্নে মানুষ একমত, কোথায় দুই ভাগ, আর বয়স বা বিভাগভেদে মত কীভাবে বদলায়।',
    dashCta: 'ড্যাশবোর্ড দেখুন',

    proposalBadge: 'আপনার প্রস্তাব',
    proposalTitle: 'পরের সাপ্তাহিক ভোট',
    proposalTitleSub: 'আপনিই ঠিক করুন',
    proposalBody:
      'কোন বিষয়ে দেশের মানুষের মত জানা দরকার? আপনার প্রস্তাব জমা দিন। ভালো প্রস্তাবগুলো থেকেই আসবে পরের সাপ্তাহিক ভোটের প্রশ্ন।',
    proposalCta: 'প্রস্তাব দিন',

    footerTransparencyTitle: 'কেন আমাদের ওপর ভরসা করবেন',
    footerTransparencyCards: [
      {
        title: 'কোনো দলের নই',
        body: 'কোনো দল, সরকার বা নির্বাচনী প্রচারণার সাথে আমাদের কোনো সম্পর্ক নেই।'
      },
      {
        title: 'ফলাফল বিক্রি হয় না',
        body: 'টাকা দিয়ে কেউ ফলাফল বদলাতে পারে না। যা দেখছেন, তা শুধুই উত্তরের হিসাব।'
      },
      {
        title: 'হিসাব খোলা',
        body: 'কীভাবে হিসাব হয়, তার পুরোটা খোলা — যে কেউ যাচাই করতে পারেন।'
      }
    ],
    footerFeedbackTitle: 'কোনো প্রশ্ন একপাক্ষিক মনে হলো?',
    footerFeedbackNote: 'আমরা চাই প্রতিটি প্রশ্ন সব পক্ষের কাছে ন্যায্য হোক। কোথাও পক্ষপাত, ভুল বা অসংগতি চোখে পড়লে জানান — আমরা শুধরে নেব।',
    footerFeedbackCta: 'আমাদের জানান',
  },

  en: {
    eyebrow: '— Bangladesh Political Compass · 2026',
    heroTitleLead: 'Where do you',
    heroTitleAccent: 'stand?',
    heroBody:
      'Share your voice on 24 critical national issues and generate a custom opinion card. Pass it along to friends to see how your thoughts align, and track real-time public sentiment on our live dashboard.',
    disclaimer: 'Participation is voluntary. As a self-selected survey, the results represent the participants rather than the wider population, and should not be used as a national poll or election forecast.',
    heroTags: ['No name or phone needed', 'Not tied to any party', 'Open methodology'],
    heroPrimaryCta: 'Take the test now',
    heroSecondaryCta: 'See live dashboard',
    lengthHint: 'Short on time?',
    lengthShort: '2-minute short version',
    lengthLong: '6-minute full version',
    quoteText: '“Man is by nature a political animal.”',
    quoteAuthor: '— Aristotle',

    statsEyebrow: '— Latest figures',
    statsTitle: 'The collective view of participants',
    statsCta: 'Explore live data',
    totalLabel: 'Participants so far',
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
      'Pick 16, 24 or 32 questions; there are no right or wrong answers. Review your results and choose what to include if you make a share card.',
    surveyTime: 'How much time do you have?',
    surveyLengths: { short: ['2 min', '16 questions'], medium: ['4 min', '24 questions'], long: ['6 min', '32 questions'] },

    dashBadge: 'Participant responses',
    dashTitle: 'Live',
    dashTitleSub: 'dashboard',
    dashBody:
      'Explore real-time data from across the country, filter responses by key issues, and deep dive into regional demographics.',
    dashCta: 'Open dashboard',

    proposalBadge: 'Citizen proposal',
    proposalTitle: 'Next weekly vote',
    proposalTitleSub: 'You decide',
    proposalBody:
      'What should the country be asked next? Send your idea. The best suggestions become future weekly vote questions.',
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
  Sushil: 'Non-partisan governance',
};

export default function WelcomePage({ onStartTest, onGoDashboard, onGoWeekly, lang = 'bn' }) {
  const [isProposalOpen, setProposalOpen] = useState(false);
  const [isFeedbackOpen, setFeedbackOpen] = useState(false);

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
  const hasLiveData = totalResponses > 0;

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
      <div style={{ width: '100%', boxSizing: 'border-box', maxWidth: '1360px', margin: '0 auto', padding: 'clamp(1.75rem, 5vw, 4rem) 1rem clamp(3rem, 8vw, 6rem)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'clamp(2.5rem, 6vw, 4rem)' }}>

        {/* Left Column: Typography */}
        <div style={{ flex: '1 1 440px', minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div style={{
            color: 'var(--text-red)',
            fontWeight: 800,
            fontSize: '0.85rem',
            letterSpacing: '0.1em',
            marginBottom: '1rem',
            textTransform: 'uppercase'
          }} className="font-latin">
            {t.eyebrow}
          </div>

          <h1 style={{
            fontSize: 'clamp(2.6rem, 8vw, 4.6rem)',
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
              onClick={() => onStartTest()}
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
                transition: 'background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, transform 0.2s ease, opacity 0.2s ease, box-shadow 0.2s ease'
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
                transition: 'background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, transform 0.2s ease, opacity 0.2s ease, box-shadow 0.2s ease'
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

          <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '-0.5rem', marginBottom: '1.25rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', columnGap: '0.6rem' }}>
            <span>{t.lengthHint}</span>
            <button type="button" onClick={() => onStartTest('short')} style={{ background: 'none', border: 'none', padding: '0.25rem 0', minHeight: '44px', color: 'var(--text-primary)', fontWeight: 700, fontSize: 'inherit', fontFamily: 'inherit', cursor: 'pointer', textDecoration: 'underline wavy', textDecorationColor: 'var(--hero-accent)', textUnderlineOffset: '5px', textDecorationThickness: '1.5px' }}>{t.lengthShort}</button>
            <span aria-hidden="true">·</span>
            <button type="button" onClick={() => onStartTest('long')} style={{ background: 'none', border: 'none', padding: '0.25rem 0', minHeight: '44px', color: 'var(--text-primary)', fontWeight: 700, fontSize: 'inherit', fontFamily: 'inherit', cursor: 'pointer', textDecoration: 'underline wavy', textDecorationColor: 'var(--hero-accent)', textUnderlineOffset: '5px', textDecorationThickness: '1.5px' }}>{t.lengthLong}</button>
          </div>

          <div className="font-latin" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1rem', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '2.5rem' }}>
            {t.heroTags.map((tag) => (
              <span key={tag}>• {tag}</span>
            ))}
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
                transition: 'background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, transform 0.2s ease, opacity 0.2s ease, box-shadow 0.2s ease'
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '2rem' }}>

            {/* Stat Card 1 */}
            <div style={{
              background: 'var(--action-card1-bg)',
              borderRadius: '24px',
              padding: '2.5rem',
              color: 'var(--action-card1-text)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, transform 0.3s ease, opacity 0.3s ease, box-shadow 0.3s ease'
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
                <p style={{ fontSize: '0.88rem', opacity: 0.75, margin: 0, lineHeight: 1.55 }}>
                  {L === 'en' ? 'People who chose to take part. Not a representative national sample.' : 'যাঁরা নিজে থেকে অংশ নিয়েছেন। দেশের সবার প্রতিনিধিত্বমূলক নমুনা নয়।'}
                </p>
              </div>
            </div>

            {/* Stat Card 2: founding progress until party matches unlock */}
            

            {/* Stat Card 2 */}
            <div style={{ background: 'var(--action-card2-bg)', border: '2px solid var(--action-card2-border)', borderRadius: '24px', padding: '2.25rem 2rem', color: 'var(--action-card2-text)', display: 'flex', flexDirection: 'column', transition: 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, transform 0.3s ease, opacity 0.3s ease, box-shadow 0.3s ease' }}>
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
                        <span className="font-latin" style={{ flexShrink: 0, whiteSpace: 'nowrap', fontWeight: 800, color: `color-mix(in srgb, ${bloc.color} 55%, var(--action-card2-text))` }}>{fmt(bloc.percentage)}%</span>
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

      <WeeklyIssueCard lang={L} onSeeAll={onGoWeekly} />

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
              transition: 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, transform 0.3s ease, opacity 0.3s ease, box-shadow 0.3s ease'
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
                {t.surveyBadge}
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: 'clamp(1.8rem, 5vw, 2.2rem)', fontWeight: 800, lineHeight: 1 }} className="font-latin">{t.surveyTitle}</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>{t.surveyTitleSub}</span>
              </div>

              <p style={{ fontSize: '1rem', color: 'var(--action-card1-text)', opacity: 0.9, marginBottom: '2rem', flex: 1 }}>
                {t.surveyBody}
              </p>

              <div style={{ fontSize: '0.9rem', color: 'var(--action-card1-text)', opacity: 0.8, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <span>{t.surveyTime}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '0.5rem' }}>
                {['short', 'medium', 'long'].map((length) => (
                  <button
                    key={length}
                    type="button"
                    onClick={() => onStartTest(length)}
                    style={{
                      background: 'var(--action-card1-btn-bg)',
                      color: 'var(--action-card1-btn-text)',
                      border: '1.5px solid var(--action-card1-btn-bg)',
                      borderRadius: '16px',
                      padding: '0.7rem 0.25rem',
                      minHeight: '64px',
                      fontFamily: 'inherit',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, transform 0.2s ease, opacity 0.2s ease, box-shadow 0.2s ease',
                      whiteSpace: 'nowrap'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--action-card1-btn-bg)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--action-card1-btn-bg)';
                      e.currentTarget.style.color = 'var(--action-card1-btn-text)';
                    }}
                  >
                    <span style={{ fontSize: '1.05rem', fontWeight: 800 }}>{t.surveyLengths[length][0]}</span>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{t.surveyLengths[length][1]}</span>
                  </button>
                ))}
              </div>
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
              transition: 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, transform 0.3s ease, opacity 0.3s ease, box-shadow 0.3s ease'
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
                  transition: 'background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, transform 0.2s ease, opacity 0.2s ease, box-shadow 0.2s ease',
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
              transition: 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, transform 0.3s ease, opacity 0.3s ease, box-shadow 0.3s ease'
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
                  transition: 'background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, transform 0.2s ease, opacity 0.2s ease, box-shadow 0.2s ease',
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
              <h3 style={{
                fontSize: 'clamp(1.05rem, 2.5vw, 1.2rem)',
                fontWeight: 700,
                color: 'var(--action-card3-text)',
                margin: 0,
                lineHeight: 1.35
              }}>
                {t.footerFeedbackTitle}
              </h3>
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
                transition: 'background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, transform 0.2s ease, opacity 0.2s ease, box-shadow 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--feedback-btn-hover-bg)';
                e.currentTarget.style.color = 'var(--feedback-btn-hover-text)';
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

      <HomeFaq lang={L} />

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