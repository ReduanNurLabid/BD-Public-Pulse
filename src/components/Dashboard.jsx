import React, { useState, useEffect, useRef } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { 
  Users, 
  Filter, 
  MapPin, 
  TrendingUp, 
  Clock, 
  Layers, 
  ArrowRight,
  Database,
  Sparkles,
  RefreshCw,
  ChevronDown,
  RotateCcw,
  ChartBar
} from 'lucide-react';
import { useAggregateStats } from '../hooks/useAggregateStats';
import { THEMATIC_BLOCKS } from '../data/questions';
import { buildFilteredDashboardStats, MIN_PUBLIC_COHORT_SIZE } from '../lib/firebase';
import BlocLogo from './BlocLogo';
import LastSubmissionTime from './LastSubmissionTime';
import { ChartEmptyState } from './NationalOnlyChart';
import lightLogo from '../assets/light mode logo.svg';
import darkLogo from '../assets/dark mode logo.svg';
import { rankTrendingIssues } from '../lib/trendingIssues';

const POLE_ICONS = {
  state_power: {
    left: 'pole-authoritarian',
    right: 'pole-balance'
  },
  democracy: {
    left: 'pole-party-control',
    right: 'pole-neutral-system'
  },
  religion_society: {
    left: 'pole-religious-rule',
    right: 'pole-secularism'
  },
  economy_market: {
    left: 'pole-public-welfare',
    right: 'pole-free-market'
  },
  sovereignty: {
    left: 'pole-diplomacy',
    right: 'pole-sovereignty'
  },
  civil_liberties: {
    left: 'pole-surveillance',
    right: 'pole-liberty'
  },
  state_reform: {
    left: 'pole-status-quo',
    right: 'pole-transformation'
  },
  social_justice: {
    left: 'pole-unregulated',
    right: 'pole-equality'
  }
};

const ENGLISH_DIVISIONS = {
  ঢাকা: 'Dhaka',
  চট্টগ্রাম: 'Chattogram',
  রাজশাহী: 'Rajshahi',
  খুলনা: 'Khulna',
  সিলেট: 'Sylhet',
  রংপুর: 'Rangpur',
  বরিশাল: 'Barishal',
  ময়মনসিংহ: 'Mymensingh'
};

const ENGLISH_AGES = {
  '১৮-২৫ (তরুণ প্রজন্ম)': '18–25 (Young adults)',
  '২৬-৩৫ (যুবক/কর্মজীবী)': '26–35 (Young professionals)',
  '২৬-৩৫ (যুবক ও পেশাজীবী)': '26–35 (Young professionals)',
  '৩৬-৪৫ (মধ্যবয়সী)': '36–45 (Middle-aged adults)',
  '৪৬-৬০ (অভিজ্ঞ নাগরিক)': '46–60 (Experienced adults)',
  '৬০+ (জ্যেষ্ঠ নাগরিক)': '60+ (Seniors)'
};

const ENGLISH_RELIGIONS = {
  ইসলাম: 'Islam',
  হিন্দু: 'Hinduism',
  বৌদ্ধ: 'Buddhism',
  খ্রিস্টান: 'Christianity',
  'অন্যান্য / অপ্রকাশিত': 'Other / Unmentioned'
};

const ENGLISH_BLOCKS = {
  state_power: { title: 'State and Executive Power', left: 'Centralized', right: 'Balanced' },
  democracy: { title: 'Democracy and Elections', left: 'Party rule', right: 'Neutral' },
  religion_society: { title: 'Secularism and Society', left: 'Religious rule', right: 'Secularism' },
  economy_market: { title: 'Economy and Markets', left: 'Welfare', right: 'Free market' },
  sovereignty: { title: 'Nationalism and Sovereignty', left: 'Compromise', right: 'Sovereignty' },
  civil_liberties: { title: 'Liberty and Human Rights', left: 'Strict control', right: 'Free speech' },
  state_reform: { title: 'Reform and the Constitution', left: 'Status quo', right: 'Reform' },
  social_justice: { title: 'Justice and Equality', left: 'Order', right: 'Equality' }
};

const ENGLISH_BLOCS = {
  Student: 'National Citizen Party',
  BNP: 'Bangladesh Nationalist Party (BNP)',
  JI: 'Jamaat-e-Islami',
  Sushil: 'Civil Society',
  AL: 'Awami League'
};

const ENGLISH_ISSUES = {
  q9: '"Proportional representation (PR) should replace first-past-the-post (FPTP) in parliamentary elections so that seats reflect the popular vote share."',
  q10: '"To prevent power from centralizing in a single individual for life, the constitution should cap prime ministerial tenure at two terms."',
  q13: '"Regardless of family and religious customs, state law should guarantee equal inheritance rights for women and men in property."',
  q19: '"Loss-making state-owned enterprises (such as jute and sugar mills) funded by taxpayers should be promptly privatized."',
  q22: '"To overcome dependence on a single regional neighbor, Bangladesh should build diversified strategic partnerships with the US, China, and the West."',
  q26: '"The Cyber Security Act should be repealed; suppressing dissent online under the pretext of defaming religion or state must end completely."',
  q33: '"The Awami League should not be allowed to participate directly in upcoming national elections without visible remorse and accountability for July crimes."'
};

const DashboardPoleIcon = ({ blockKey, side, style }) => {
  const iconId = POLE_ICONS[blockKey]?.[side] || 'pole-balance';
  return (
    <svg
      style={{
        width: '18px',
        height: '18px',
        display: 'inline-block',
        verticalAlign: 'middle',
        flexShrink: 0,
        ...style
      }}
      aria-hidden="true"
    >
      <use href={`/icons.svg#${iconId}`} xlinkHref={`/icons.svg#${iconId}`} />
    </svg>
  );
};

const AnimatedNumber = ({ 
  value, 
  duration = 1300, 
  decimals = 0, 
  prefix = '', 
  suffix = '',
  delay = 0 
}) => {
  const [displayVal, setDisplayVal] = useState(0);
  const currentRef = useRef(0);

  useEffect(() => {
    let animId;
    let startTimestamp = null;
    const startVal = currentRef.current;
    const targetVal = Number(value) || 0;
    const actualDuration = startVal === 0 ? duration : Math.min(duration, 500);

    const timeoutId = setTimeout(() => {
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const elapsed = timestamp - startTimestamp;
        const progress = Math.min(elapsed / actualDuration, 1);
        // easeOutCubic: 1 - (1 - t)^3
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = startVal + (targetVal - startVal) * ease;
        setDisplayVal(current);
        currentRef.current = current;

        if (progress < 1) {
          animId = requestAnimationFrame(step);
        } else {
          setDisplayVal(targetVal);
          currentRef.current = targetVal;
        }
      };
      animId = requestAnimationFrame(step);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [value, duration, delay]);

  const formatted = decimals > 0 
    ? displayVal.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    : Math.round(displayVal).toLocaleString('en-US');

  return <>{prefix}{formatted}{suffix}</>;
};

const AnimatedPercent = ({ value, active, delay = 0 }) => {
  const [displayVal, setDisplayVal] = useState(0);
  const currentRef = useRef(0);

  useEffect(() => {
    if (!active) {
      setDisplayVal(0);
      currentRef.current = 0;
      return;
    }

    let animId;
    let startTimestamp = null;
    const startVal = currentRef.current;
    const targetVal = Number(value) || 0;
    const duration = startVal === 0 ? 850 : 350;

    const timeoutId = setTimeout(() => {
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const elapsed = timestamp - startTimestamp;
        const progress = Math.min(elapsed / duration, 1);
        // easeOutCubic
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(startVal + (targetVal - startVal) * ease);
        setDisplayVal(current);
        currentRef.current = current;

        if (progress < 1) {
          animId = requestAnimationFrame(step);
        } else {
          setDisplayVal(targetVal);
          currentRef.current = targetVal;
        }
      };
      animId = requestAnimationFrame(step);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [value, active, delay]);

  return <>{displayVal}%</>;
};

export default function Dashboard({ onTakeTest, liveVisitors, lang }) {
  const isEnglish = lang === 'en';
  const t = (bengali, english) => isEnglish ? english : bengali;
  const localizeDivision = name => isEnglish ? (ENGLISH_DIVISIONS[name] || name) : name;
  const localizeAge = label => isEnglish ? (ENGLISH_AGES[label] || label) : label;
  const localizeBloc = (key, label) => isEnglish ? (ENGLISH_BLOCS[key] || label) : label;
  const localizeIssue = issue => isEnglish ? (ENGLISH_ISSUES[issue.id] || issue.title) : issue.title;
  const localizeReligion = label => isEnglish ? (ENGLISH_RELIGIONS[label] || label) : label;
  // Real-time listener: acceptable here because this deep-dive page carries a
  // fraction of the Welcome Page's concurrent traffic.
  const { stats, loading } = useAggregateStats('subscribe');
  const [selectedDivision, setSelectedDivision] = useState('ALL');
  const [selectedAge, setSelectedAge] = useState('ALL');
  const [selectedReligion, setSelectedReligion] = useState('ALL');
  const [isTrendingExpanded, setIsTrendingExpanded] = useState(false);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  const axesSectionRef = useRef(null);
  const [hasEnteredAxes, setHasEnteredAxes] = useState(false);

  useEffect(() => {
    if (loading || !stats) return;

    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setHasEnteredAxes(true);
      return;
    }

    if (!('IntersectionObserver' in window)) {
      setHasEnteredAxes(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setHasEnteredAxes(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    if (axesSectionRef.current) {
      observer.observe(axesSectionRef.current);
    }

    return () => observer.disconnect();
  }, [loading, stats]);

  if (loading || !stats) {
    return (
      <div style={{ maxWidth: '1060px', margin: '4rem auto', textAlign: 'center', padding: '2rem' }}>
        <RefreshCw size={36} className="animate-spin" style={{ margin: '0 auto 1rem', color: 'var(--accent-gold)' }} />
        <h2 style={{ color: 'var(--text-primary)' }}>{t('গবেষণামূলক পরিসংখ্যান লোড হচ্ছে', 'Loading research statistics')}</h2>
      </div>
    );
  }

  const DIVISION_MAP = {
    Dhaka: 'ঢাকা',
    Chittagong: 'চট্টগ্রাম',
    Rajshahi: 'রাজশাহী',
    Khulna: 'খুলনা',
    Sylhet: 'সিলেট',
    Rangpur: 'রংপুর',
    Barisal: 'বরিশাল',
    Mymensingh: 'ময়মনসিংহ'
  };

  const computeFilteredDivisions = () => {
    const base = stats.divisions || {};

    // Ordered by respondent count, largest first, so the table reads as a
    // ranking. Sorting reorders real counts only — no value is recomputed. The
    // name is the tie-breaker because a document iteration order would otherwise
    // decide the row order whenever two divisions share a count.
    return Object.entries(base)
      .map(([divName, divData]) => ({
        divName,
        ...divData,
        isSelected: selectedDivision !== 'ALL' && DIVISION_MAP[selectedDivision] === divName
      }))
      .sort((a, b) => (b.count || 0) - (a.count || 0) || a.divName.localeCompare(b.divName, 'bn'));
  };

  const computeFilteredAgeRanges = () => {
    const base = stats.ageRanges || {};
    const result = {};

    Object.entries(base).forEach(([label, data]) => {
      let isSelected = false;
      if (selectedAge === '18-25' && label.includes('১৮-২৫')) isSelected = true;
      if (selectedAge === '26-35' && label.includes('২৬-৩৫')) isSelected = true;
      if (selectedAge === '36-45' && label.includes('৩৬-৪৫')) isSelected = true;
      if (selectedAge === '46+' && (label.includes('৪৬-৬০') || label.includes('৬০+'))) isSelected = true;

      result[label] = {
        ...data,
        isSelected
      };
    });

    return result;
  };

  const isSelectedReligion = label => {
    if (selectedReligion === 'Muslim') return label === 'ইসলাম';
    if (selectedReligion === 'Hindu') return label === 'হিন্দু';
    if (selectedReligion === 'Others') return label !== 'ইসলাম' && label !== 'হিন্দু';
    return false;
  };

  const isDemographicFilterActive =
    selectedDivision !== 'ALL' || selectedAge !== 'ALL' || selectedReligion !== 'ALL';
  const isDivisionFilterDisabled = selectedAge !== 'ALL' || selectedReligion !== 'ALL';
  const isAgeFilterDisabled = selectedDivision !== 'ALL' || selectedReligion !== 'ALL';
  const isReligionFilterDisabled = selectedDivision !== 'ALL' || selectedAge !== 'ALL';
  const filteredResult = buildFilteredDashboardStats(stats, {
    division: selectedDivision,
    age: selectedAge,
    religion: selectedReligion
  });
  const analyticsStats = filteredResult.stats;
  const currentBlocs = analyticsStats?.blocs || {};
  const sortedBlocEntries = Object.entries(currentBlocs).sort((a, b) => b[1].percentage - a[1].percentage);
  const currentThematicAxes = analyticsStats?.thematicAxes || {};
  const currentIssues = analyticsStats?.wedgeIssues || [];
  const rankedIssues = rankTrendingIssues(currentIssues);
  const currentDivisions = computeFilteredDivisions();
  const currentAgeRanges = computeFilteredAgeRanges();
  const religionEntries = Object.entries(stats.religions || {});
  const selectedCohortSize = filteredResult.sampleSize || 0;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.25rem 5rem' }} className="dashboard-page animate-fade-in">
      
      {/* Top Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div className="hero-badge-tag" style={{
          background: 'var(--accent-cyan-glow)',
          borderColor: 'var(--accent-cyan)',
          color: 'var(--accent-cyan)',
          padding: '0.4rem 1.25rem',
          fontSize: '0.9rem',
          marginBottom: '0.85rem'
        }}>
          <Database size={15} />
          <span>{t('অংশগ্রহণকারীদের মতামত · লাইভ', 'Participant responses · live')}</span>
        </div>

        <h1 style={{ fontSize: 'clamp(1.9rem, 4vw, 2.85rem)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.6rem' }}>
          {t('অংশগ্রহণকারীদের রাজনৈতিক দৃষ্টিভঙ্গি', 'Political views of survey participants')}
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', maxWidth: '780px', margin: '0 auto' }}>
          {t('স্বেচ্ছায় অংশ নেওয়া ব্যক্তিদের উত্তর থেকে তৈরি সমষ্টিগত বিশ্লেষণ। এটি সারা দেশের প্রতিনিধিত্বশীল জরিপ নয়।', 'Aggregate analysis of voluntary participant responses. This is not a nationally representative survey.')}
        </p>
      </div>

      {/* Top 4 KPI Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2.5rem'
      }}>
        {/* KPI 1 */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-cyan)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', color: 'var(--accent-cyan)' }}>
            <span style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
              {t('বৈধ প্রতিক্রিয়া', 'Filtered Data Pool')}
            </span>
            {/* No color prop: lucide strokes with currentColor and a stroke
                attribute cannot resolve a CSS var, so the icon inherits the
                theme colour from the row above. */}
            <Users size={20} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }} className="font-latin">
            <AnimatedNumber value={stats.totalResponses} duration={900} />
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--accent-green)', fontWeight: 600 }}>
            {t('ফিল্টারমুক্ত ডাটা', 'Unaffected by filters · participant responses')}
          </span>
        </div>

        {/* KPI 2: Average Completion Time */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-green)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', color: 'var(--accent-green)' }}>
            <span style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>{t('গড় সমাপ্তির সময়', 'Avg Completion Time')}</span>
            <Clock size={20} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-green)' }} className="font-latin">
            {isEnglish 
              ? `${stats.avgDurationMinutes || '3.2'} Min` 
              : `${Number(stats.avgDurationMinutes || 3.2).toLocaleString('bn-BD')} মিনিট`}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.2rem', flexWrap: 'wrap', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {t('২৪টি আদর্শিক প্রশ্ন সম্পন্ন', '24 core questions completed')}
            </span>
            <span style={{ fontSize: '0.76rem', color: 'var(--accent-red)', fontWeight: 700 }}>
              {t(`বাতিল: ${(stats.rejectedResponses || 0).toLocaleString('bn-BD')}`, `Rejected: ${stats.rejectedResponses || 0}`)}
            </span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-red)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', color: 'var(--accent-red)' }}>
            <span style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>{t('শীর্ষ রাজনৈতিক ঝোঁক', 'Leading tendency among participants')}</span>
            <TrendingUp size={20} />
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.3 }}>
            {stats.totalResponses > 0 ? (localizeBloc(sortedBlocEntries[0]?.[0], sortedBlocEntries[0]?.[1]?.label) || t('তথ্য সংকলনাধীন', 'Compiling data')) : t('অপেক্ষমাণ (নতুন জরিপ)', 'Awaiting new responses')}
          </div>
          <span style={{ fontSize: '0.82rem', color: 'var(--accent-gold)', fontWeight: 700 }} className="font-latin">
            {stats.totalResponses > 0 ? (
              // Bloc shares are national-only, so this must never be labelled
              // with a division. Doing so claimed a per-division winner that the
              // data does not contain.
              <>
                <AnimatedNumber value={sortedBlocEntries[0]?.[1]?.percentage || 0} decimals={1} suffix="%" duration={900} /> {t('অংশগ্রহণকারীদের মধ্যে', 'among participants')}
              </>
            ) : (
              t('প্রথম মতামতের অপেক্ষা', 'Awaiting the first response')
            )}
          </span>
        </div>

        {/* KPI 4 */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-gold)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>{t('লাইভ অনলাইন পর্যবেক্ষক', 'Live visitors online')}</span>
            {/* Only pulse once a real count exists, so the indicator never
                advertises liveness for a number we have not measured yet. */}
            {liveVisitors !== null && <span className="pulse-indicator"></span>}
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-gold)' }} className="font-latin">
            {liveVisitors === null
              ? <span style={{ fontSize: '1.1rem', fontWeight: 700, opacity: 0.7 }}>—</span>
              : <AnimatedNumber value={liveVisitors} duration={1000} suffix={t(' জন', ' people')} />}
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {liveVisitors === null ? t('উপস্থিতি গণনা হচ্ছে…', 'Counting visitors…') : t('সরাসরি সক্রিয় ভিজিটর', 'Currently active visitors')}
          </span>
          <LastSubmissionTime lastUpdated={stats?.lastUpdated} lang={lang} />
        </div>
      </div>

      <section
        className={`filter-ribbon-panel dashboard-filter-panel animate-fade-in ${isFilterExpanded ? 'filter-ribbon-panel--expanded' : 'filter-ribbon-panel--collapsed'}`}
        aria-label={t('জনমিতিক বিশ্লেষণ ফিল্টার', 'Demographic analysis filters')}
      >
        <div
          role="button"
          tabIndex={0}
          aria-expanded={isFilterExpanded}
          aria-controls="dashboard-filter-content"
          id="dashboard-filter-toggle"
          onClick={() => setIsFilterExpanded(prev => !prev)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              setIsFilterExpanded(prev => !prev);
            }
          }}
          className="filter-ribbon-header"
        >
          <div className="filter-header-left">
            <div className="filter-header-icon-box"><Filter size={20} /></div>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 750, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span>{t('জনমিতিক গোষ্ঠীর ফলাফল', 'Explore results by demographic group')}</span>
                {isDemographicFilterActive && (
                  <span
                    className="badge-tag font-latin"
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '0.15rem 0.55rem',
                      borderRadius: '999px',
                      background: 'color-mix(in srgb, var(--accent-gold) 18%, var(--bg-card))',
                      color: 'var(--accent-gold)',
                      border: '1px solid var(--border-gold)'
                    }}
                  >
                    {t('ফিল্টার সক্রিয়', 'FILTER ACTIVE')}
                  </span>
                )}
              </h2>
              <p className="filter-header-subtitle" style={{ margin: 0 }}>
                {t(
                  isFilterExpanded
                    ? 'ফিল্টারগুলো রাজনৈতিক ধারা, ৮টি অক্ষ ও ট্রেন্ডিং ইস্যুর ফলাফল বদলায় (ক্লিক করে সংকুচিত করুন)।'
                    : 'ফিল্টার বিকল্প দেখতে ক্লিক করুন (রাজনৈতিক ধারা, ৮টি অক্ষ ও ট্রেন্ডিং ইস্যুর ফলাফল বদলায়)।',
                  isFilterExpanded
                    ? 'Filters update political tendencies, all 8 axes, and trending issues (click to collapse).'
                    : 'Click to expand filters (updates political tendencies, axes, and trending issues).'
                )}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexShrink: 0 }}>
            {isDemographicFilterActive && (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setSelectedDivision('ALL');
                  setSelectedAge('ALL');
                  setSelectedReligion('ALL');
                }}
                className="btn-filter-reset"
                title={t('সবগুলো ফিল্টার রিসেট করুন', 'Reset all filters')}
                style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem' }}
              >
                <RotateCcw size={12} />
                <span>{t('রিসেট', 'Reset')}</span>
              </button>
            )}
            <div className="filter-toggle-pill">
              <span>{isFilterExpanded ? t('লুকান', 'Collapse') : t('ফিল্টার খুলুন', 'Open filters')}</span>
              <ChevronDown
                size={16}
                style={{
                  transform: isFilterExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              />
            </div>
          </div>
        </div>

        {isFilterExpanded && (
          <div
            id="dashboard-filter-content"
            className="dashboard-filter-content"
            style={{
              marginTop: '1.25rem',
              animation: 'trendingSlideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <div className="filter-grid">
              <label className="filter-field-card filter-field-label">
                <span><MapPin size={15} className="filter-label-icon" />{t('বিভাগ', 'Division')}</span>
                <div className="filter-select-wrapper">
                  <select value={selectedDivision} disabled={isDivisionFilterDisabled} onChange={event => setSelectedDivision(event.target.value)} className={`filter-select ${selectedDivision !== 'ALL' ? 'is-active' : ''}`}>
                    <option value="ALL">{t('সকল বিভাগ', 'All divisions')}</option>
                    <option value="Dhaka">{t('ঢাকা বিভাগ', 'Dhaka Division')}</option>
                    <option value="Chittagong">{t('চট্টগ্রাম বিভাগ', 'Chattogram Division')}</option>
                    <option value="Rajshahi">{t('রাজশাহী বিভাগ', 'Rajshahi Division')}</option>
                    <option value="Khulna">{t('খুলনা বিভাগ', 'Khulna Division')}</option>
                    <option value="Sylhet">{t('সিলেট বিভাগ', 'Sylhet Division')}</option>
                    <option value="Rangpur">{t('রংপুর বিভাগ', 'Rangpur Division')}</option>
                    <option value="Barisal">{t('বরিশাল বিভাগ', 'Barishal Division')}</option>
                    <option value="Mymensingh">{t('ময়মনসিংহ বিভাগ', 'Mymensingh Division')}</option>
                  </select>
                  <ChevronDown size={17} className="filter-select-arrow" />
                </div>
              </label>
              <label className="filter-field-card filter-field-label">
                <span><Users size={15} className="filter-label-icon" />{t('বয়স শ্রেণী', 'Age group')}</span>
                <div className="filter-select-wrapper">
                  <select value={selectedAge} disabled={isAgeFilterDisabled} onChange={event => setSelectedAge(event.target.value)} className={`filter-select ${selectedAge !== 'ALL' ? 'is-active' : ''}`}>
                    <option value="ALL">{t('সকল বয়স শ্রেণী', 'All age groups')}</option>
                    <option value="18-25">{t('১৮-২৫ (তরুণ প্রজন্ম)', '18–25 (Young adults)')}</option>
                    <option value="26-35">{t('২৬-৩৫ (যুবক ও পেশাজীবী)', '26–35 (Young professionals)')}</option>
                    <option value="36-45">{t('৩৬-৪৫ (মধ্যবয়সী)', '36–45 (Middle-aged adults)')}</option>
                    <option value="46+">{t('৪৬+ (জ্যেষ্ঠ নাগরিক)', '46+ (Seniors)')}</option>
                  </select>
                  <ChevronDown size={17} className="filter-select-arrow" />
                </div>
              </label>
              <label className="filter-field-card filter-field-label">
                <span><Sparkles size={15} className="filter-label-icon" />{t('ধর্মীয় পরিচয়', 'Religion')}</span>
                <div className="filter-select-wrapper">
                  <select value={selectedReligion} disabled={isReligionFilterDisabled} onChange={event => setSelectedReligion(event.target.value)} className={`filter-select ${selectedReligion !== 'ALL' ? 'is-active' : ''}`}>
                    <option value="ALL">{t('সকল ধর্মাবলম্বী', 'All religions')}</option>
                    <option value="Muslim">{t('ইসলাম', 'Islam')}</option>
                    <option value="Hindu">{t('হিন্দু', 'Hinduism')}</option>
                    <option value="Others">{t('বৌদ্ধ, খ্রিস্টান ও অন্যান্য', 'Buddhism, Christianity, and other religions')}</option>
                  </select>
                  <ChevronDown size={17} className="filter-select-arrow" />
                </div>
              </label>
            </div>
            {isDemographicFilterActive && (
              <div className={`filter-status-banner ${filteredResult.available ? '' : 'filter-status-banner--pending'}`}>
                <span>
                  {filteredResult.available
                    ? t('নির্বাচিত গোষ্ঠী', 'Selected group')
                    : selectedCohortSize > 0
                      ? t(`নির্ভরযোগ্য ফলাফলের জন্য এই গোষ্ঠীতে অন্তত ${MIN_PUBLIC_COHORT_SIZE}টি উত্তর প্রয়োজন।`, `At least ${MIN_PUBLIC_COHORT_SIZE} responses are required for this group.`)
                      : t('এই গোষ্ঠীর ঐতিহাসিক ফলাফল প্রস্তুত নয়। Admin backfill চালানোর পর ফলাফল দেখা যাবে।', 'Historical results for this group are not ready yet. Run the Admin backfill to populate them.')}
                </span>
                <button
                  onClick={() => {
                    setSelectedDivision('ALL');
                    setSelectedAge('ALL');
                    setSelectedReligion('ALL');
                  }}
                  className="btn-filter-reset"
                  title={t('সবগুলো ফিল্টার রিসেট করুন', 'Reset all filters')}
                >
                  <RotateCcw size={13} />
                  <span>{t('রিসেট', 'Reset')}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Zero State Callout if no responses have been logged yet */}
      {stats.totalResponses === 0 && (
        <div className="glass-panel" style={{
          padding: '2.5rem 1.5rem',
          textAlign: 'center',
          marginBottom: '2.5rem',
          background: 'linear-gradient(135deg, var(--accent-cyan-glow) 0%, var(--accent-green-glow) 100%)',
          border: '1px solid var(--accent-cyan)',
          borderRadius: '16px',
          color: 'var(--accent-cyan)'
        }}>
          <Sparkles size={36} style={{ margin: '0 auto 0.75rem' }} />
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            {t('নতুন উন্মুক্ত জনমত জরিপ প্ল্যাটফর্ম ২০২৬ 🇧🇩', 'New Open Public Opinion Survey Platform 2026 🇧🇩')}
          </h3>
          <p style={{ maxWidth: '640px', margin: '0 auto 1.5rem', color: 'var(--text-secondary)', fontSize: '0.96rem', lineHeight: 1.6 }}>
            {t('এখানে স্বেচ্ছায় অংশ নেওয়া ব্যক্তিদের উত্তর সমষ্টিগতভাবে দেখানো হয়। পর্যাপ্ত উত্তর না থাকলে কোনো তুলনা প্রকাশ করা হয় না।', 'This dashboard summarizes voluntary participant responses. Comparisons are withheld when there are not enough responses.')}
          </p>
          <button 
            onClick={onTakeTest}
            className="btn-primary"
            style={{ padding: '0.85rem 2.2rem', fontSize: '1rem', fontWeight: 700 }}
          >
            <span>{t('মূল্যায়ন শুরু করুন', 'Start the assessment')}</span>
            <ArrowRight size={18} />
          </button>
        </div>
      )}

      {/* Trending Issues Section */}
      <div
        className={`glass-panel dashboard-trending-section ${isTrendingExpanded ? 'dashboard-trending-section--expanded' : 'dashboard-trending-section--collapsed'}`}
        style={{
          padding: isTrendingExpanded ? '1.75rem 2rem' : '1.25rem 1.75rem',
          marginBottom: '2.5rem',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <div
          className="dashboard-trending-header"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{
              fontSize: '1.15rem',
              color: 'var(--text-primary)',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              flexWrap: 'wrap'
            }}>
              <TrendingUp size={19} style={{ color: 'var(--action-card2-text)', flexShrink: 0 }} />
              <span>{isDemographicFilterActive ? t('গোষ্ঠীর ট্রেন্ডিং ইস্যু', 'Trending issues in selected group') : t('শীর্ষ ট্রেন্ডিং ইস্যু', 'Trending issues')}</span>
              {rankedIssues.length > 0 && (
                <span
                  className="trending-count-badge font-latin"
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '0.15rem 0.55rem',
                    borderRadius: '999px',
                    background: 'rgba(255, 255, 255, 0.16)',
                    color: 'var(--action-card2-text)'
                  }}
                >
                  {isEnglish ? `${rankedIssues.length} issues` : `${rankedIssues.length}টি ইস্যু`}
                </span>
              )}
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>
              {isDemographicFilterActive
                ? t('নির্বাচিত গোষ্ঠী', 'Selected group')
                : t('তীব্র মতভেদের শীর্ষ সামাজিক ও রাজনৈতিক বিষয়সমূহ', 'Top polarized social & political issues')}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
            {isDemographicFilterActive && filteredResult.available && (
              <span className="badge-tag font-latin">{t('গোষ্ঠী ফলাফল', 'GROUP RESULTS')}</span>
            )}
          </div>
        </div>

        <div
          id="dashboard-trending-content"
          className="dashboard-trending-content"
          style={{
            marginTop: '1.5rem',
            animation: isTrendingExpanded ? 'trendingSlideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
          }}
        >
            {!analyticsStats && (
              <ChartEmptyState
                title={t('গোষ্ঠীর ইস্যু-তথ্য নেই', 'No issue data for this group')}
                subtitle={t(`গোষ্ঠী তুলনা দেখাতে অন্তত ${MIN_PUBLIC_COHORT_SIZE}টি ব্যবহারযোগ্য উত্তর প্রয়োজন।`, `At least ${MIN_PUBLIC_COHORT_SIZE} eligible responses are needed for group comparisons.`)}
              />
            )}
            <div style={{ display: analyticsStats ? 'grid' : 'none', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))', gap: '1.25rem' }}>
              {(isTrendingExpanded ? rankedIssues : rankedIssues.slice(0, 2)).map((issue) => (
                <div
                  key={issue.id}
                  className="dashboard-trending-issue"
                  style={{
                    background: 'var(--action-card1-bg)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '14px',
                    padding: '1.25rem 1.4rem',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <div
                    title={localizeIssue(issue)}
                    style={{
                      fontSize: '0.96rem',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      lineHeight: 1.6,
                      marginBottom: '1.25rem'
                    }}
                  >
                    {localizeIssue(issue)}
                  </div>

                  {!issue.hasData ? (
                    <div style={{ marginTop: 'auto', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {t('এখনো কোনো উত্তরদাতার তথ্য নেই', 'No respondent data yet')}
                    </div>
                  ) : (
                    <>
                      <div style={{ display: 'flex', height: '12px', borderRadius: '999px', overflow: 'hidden', background: 'var(--data-track)', marginBottom: '0.9rem' }}>
                        <div style={{ width: `${issue.agree}%`, background: 'var(--data-agree)', transition: 'width 0.6s ease' }} title={`${t('একমত', 'Agree')}: ${issue.agree}%`} />
                        <div style={{ width: `${issue.neutral}%`, background: 'var(--data-neutral)', transition: 'width 0.6s ease' }} title={`${t('নিরপেক্ষ', 'Neutral')}: ${issue.neutral}%`} />
                        <div style={{ width: `${issue.disagree}%`, background: 'var(--data-disagree)', transition: 'width 0.6s ease' }} title={`${t('দ্বিমত', 'Disagree')}: ${issue.disagree}%`} />
                      </div>
                      {/* All three splits, in three equal columns that line up with the three bar segments above */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem', marginTop: 'auto' }}>
                        {[
                          { label: t('একমত', 'Agree'), value: issue.agree, color: 'var(--data-agree)' },
                          { label: t('নিরপেক্ষ', 'Neutral'), value: issue.neutral, color: 'var(--data-neutral)' },
                          { label: t('দ্বিমত', 'Disagree'), value: issue.disagree, color: 'var(--data-disagree)' }
                        ].map(({ label, value, color }) => (
                          <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', minWidth: 0 }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                              <span aria-hidden="true" style={{ width: '8px', height: '8px', borderRadius: '2px', background: color, flexShrink: 0 }} />
                              {label}
                            </span>
                            <span className="font-latin" style={{ fontSize: '1.05rem', fontWeight: 800, color, lineHeight: 1.1 }}>
                              {value}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {rankedIssues.length > 2 && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                <button
                  type="button"
                  onClick={() => setIsTrendingExpanded(prev => !prev)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.4rem 1rem',
                    borderRadius: '999px',
                    background: 'rgba(255, 255, 255, 0.12)',
                    border: '1px solid var(--action-card2-border)',
                    color: 'var(--action-card2-text)',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    outline: 'none'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'; }}
                >
                  <span>{isTrendingExpanded ? t('কম দেখুন', 'Show less') : t('সব দেখুন', 'See all')}</span>
                  <ChevronDown
                    size={16}
                    style={{
                      transform: isTrendingExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  />
                </button>
              </div>
            )}
          </div>
      </div>

      {/* Bloc + Age distribution. Ranked bars rather than a pie: five shares that
          often sit close together are far easier to compare along a common
          baseline, and the row stays half-height instead of stretching a small
          chart across the full width. */}
      <div className="dashboard-demographic-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 285px), 1fr))',
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        
        {/* Political Blocs Live Distribution */}
        <div className="dashboard-insight-card dashboard-insight-card--style1" style={{ padding: '2.25rem 2rem' }}>
          <div style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ChartBar size={19} style={{ color: 'var(--accent-gold)' }} />
                <span>{isDemographicFilterActive
                  ? t('নির্বাচিত গোষ্ঠীর রাজনৈতিক ধারা', 'Political tendencies in selected group')
                  : t('অংশগ্রহণকারীদের রাজনৈতিক ধারার প্রবণতা', 'Distribution of participant political tendencies')}</span>
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {isDemographicFilterActive
                  ? t('শতাংশ অনুযায়ী সাজানো')
                  : t('অংশগ্রহণকারীদের মতামতের ভিত্তিতে', 'Based on participant responses')}
              </p>
            </div>
            {isDemographicFilterActive && filteredResult.available && (
              <span className="badge-tag font-latin">{t('গোষ্ঠী ফলাফল', 'GROUP RESULTS')}</span>
            )}
          </div>

          {analyticsStats?.totalResponses > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              {sortedBlocEntries.map(([blocKey, item]) => (
                <div key={blocKey}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                    <BlocLogo blocKey={blocKey} size={26} />
                    <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', flex: 1, minWidth: 0 }}>
                      {localizeBloc(blocKey, item.label)}
                    </span>
                    <span className="font-latin" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {item.count.toLocaleString('en-US')}
                    </span>
                    <span className="font-latin" style={{ fontSize: '1rem', fontWeight: 800, color: item.color, minWidth: '3.6rem', textAlign: 'right' }}>
                      {item.percentage}%
                    </span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--data-track)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ width: `${item.percentage}%`, height: '100%', background: item.color, borderRadius: '999px', transition: 'width 0.6s var(--ease-smooth)' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ChartEmptyState
              title={isDemographicFilterActive ? t('এই গোষ্ঠীর ফলাফল নেই', 'No results for this group') : t('এখনো কোনো ধারার তথ্য নেই', 'No tendency data yet')}
              subtitle={isDemographicFilterActive
                ? t(`গোষ্ঠী তুলনা দেখাতে অন্তত ${MIN_PUBLIC_COHORT_SIZE}টি ব্যবহারযোগ্য উত্তর প্রয়োজন।`, `At least ${MIN_PUBLIC_COHORT_SIZE} eligible responses are needed for group comparisons.`)
                : t('অংশগ্রহণকারীদের যথেষ্ট উত্তর এলে এখানে বণ্টন দেখা যাবে', 'The distribution will appear when enough participant responses are available.')}
            />
          )}
        </div>

        {/* Demographics: Age and Religion merged into one card */}
        <div className="dashboard-insight-card dashboard-insight-card--style2" style={{ padding: '2.25rem 2rem' }}>
          
          <div style={{ marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={19} style={{ color: 'var(--accent-blue)' }} />
              <span>{t('অংশগ্রহণ', 'Participation')}</span>
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {t('বয়স ও ধর্ম অনুযায়ী উত্তরদাতার বণ্টন', 'Distribution of respondents by age and religion')}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '1.25rem', alignItems: 'start' }}>
            
            {/* Age distribution column (Bar Chart) */}
            <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
              <div style={{ marginBottom: '0.85rem' }}>
                <h4 style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                  <Clock size={16} style={{ color: 'var(--accent-cyan)' }} />
                  <span>{t('বয়সভিত্তিক', 'Age-based')}</span>
                </h4>
              </div>

              {stats.totalResponses > 0 ? (
                <div style={{ width: '100%', height: '210px' }}>
                  <ResponsiveContainer width="100%" height={210}>
                    <BarChart 
                      data={Object.entries(currentAgeRanges).map(([label, data]) => ({
                        name: localizeAge(label).replace(/\s*\(.*?\)/, ''), // e.g. "18-25"
                        fullName: localizeAge(label),
                        value: data.percentage,
                        isSelected: data.isSelected
                      }))} 
                      margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                    >
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} interval="preserveStartEnd" />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} tickFormatter={(val) => `${val}%`} />
                      <RechartsTooltip 
                        cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }}
                        formatter={(value) => [`${value}%`]}
                        labelFormatter={(label, payload) => payload?.[0]?.payload?.fullName || label}
                        contentStyle={{ borderRadius: '12px', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontWeight: 600, boxShadow: 'var(--shadow-sm)', zIndex: 100 }}
                      />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {Object.entries(currentAgeRanges).map(([label, data], index) => (
                          <Cell key={`cell-${index}`} fill={data.isSelected ? 'var(--accent-cyan)' : 'var(--data-neutral)'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <ChartEmptyState
                  title={t('কোনো তথ্য নেই', 'No data')}
                  subtitle={t('প্রথম উত্তরদাতা জমা দিলে এখানে হার দেখা যাবে', 'Rates will appear after the first response.')}
                />
              )}
            </div>

            {/* Religion distribution column (Pie Chart) */}
            <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
              <div style={{ marginBottom: '0.85rem' }}>
                <h4 style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                  <Layers size={16} style={{ color: 'var(--accent-purple)' }} />
                  <span>{t('ধর্মীয়', 'Religious')}</span>
                </h4>
              </div>

              {stats.totalResponses > 0 ? (
                (() => {
                  const activeReligionEntries = religionEntries
                    .filter(([, data]) => data.percentage > 0)
                    .sort((a, b) => b[1].percentage - a[1].percentage);
                  const RELIGION_COLORS = {
                    'ইসলাম': '#059669',
                    'হিন্দু': '#CF5A22',
                    'বৌদ্ধ': '#AD7A06',
                    'খ্রিস্টান': '#2F6DC0',
                    'অন্যান্য / অপ্রকাশিত': '#94A3B8'
                  };
                  
                  if (activeReligionEntries.length === 0) {
                    return (
                      <ChartEmptyState
                        title={t('কোনো তথ্য নেই', 'No data')}
                        subtitle={t('প্রথম উত্তরদাতা জমা দিলে এখানে হার দেখা যাবে', 'Rates will appear after the first response.')}
                      />
                    );
                  }

                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '210px', justifyContent: 'space-between' }}>
                      <div style={{ width: '100%', height: '165px' }}>
                        <ResponsiveContainer width="100%" height={165}>
                          <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                            <Pie
                              data={activeReligionEntries.map(([label, data]) => ({
                                name: localizeReligion(label),
                                value: data.percentage,
                                labelKey: label,
                                fill: RELIGION_COLORS[label] || '#94A3B8'
                              }))}
                              cx="50%"
                              cy="50%"
                              innerRadius={46}
                              outerRadius={70}
                              paddingAngle={3}
                              dataKey="value"
                              stroke="none"
                            >
                              {activeReligionEntries.map(([label], index) => (
                                <Cell key={`cell-${index}`} fill={RELIGION_COLORS[label] || '#94A3B8'} />
                              ))}
                            </Pie>
                            <RechartsTooltip 
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  const data = payload[0].payload;
                                  return (
                                    <div style={{
                                      background: 'var(--bg-card)',
                                      border: '1px solid var(--border-subtle)',
                                      borderRadius: '12px',
                                      padding: '0.75rem 1rem',
                                      boxShadow: 'var(--shadow-sm)',
                                      zIndex: 100
                                    }}>
                                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 600 }}>
                                        {data.name}
                                      </div>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: data.fill }} />
                                        <span className="font-latin" style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                                          {data.value}%
                                        </span>
                                      </div>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Clean Legend aligned horizontally with BarChart baseline */}
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '0.4rem 0.85rem',
                        width: '100%',
                        minHeight: '35px',
                        paddingTop: '0.25rem'
                      }}>
                        {activeReligionEntries.map(([label, data]) => (
                          <div
                            key={label}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              fontSize: '0.78rem',
                              color: 'var(--text-secondary)'
                            }}
                          >
                            <span
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                backgroundColor: RELIGION_COLORS[label] || '#94A3B8',
                                flexShrink: 0
                              }}
                            />
                            <span>{localizeReligion(label)}</span>
                            <span className="font-latin" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                              {data.percentage}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()
              ) : (
                <ChartEmptyState
                  title={t('কোনো তথ্য নেই', 'No data')}
                  subtitle={t('প্রথম উত্তরদাতা জমা দিলে এখানে হার দেখা যাবে', 'Rates will appear after the first response.')}
                />
              )}
            </div>

          </div>
        </div>

      </div>

      {/* 8 Thematic Axes — one aligned diverging bar per axis.
          These were eight tall cards in a 2x4 grid, which cost ~800px of
          height and, worse, gave every axis a differently sized box so the
          bars could not be compared against each other. A single column of
          full-width rows shares one baseline: the 50% mark sits at the same
          pixel on every row, so leaning is comparable at a glance. */}
      <div ref={axesSectionRef} className="dashboard-axis-section dashboard-insight-card dashboard-insight-card--style1" style={{ padding: '2.5rem', marginBottom: '2.5rem' }}>
        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
              <span style={{ color: 'var(--accent-red)', fontWeight: 800, fontSize: '0.8rem', letterSpacing: '0.08em' }} className="font-latin">
                {t('— ৮টি আদর্শিক অক্ষ', '— 8 ideological axes')}
              </span>
            </div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={20} style={{ color: 'var(--accent-red)' }} />
              <span>{isDemographicFilterActive
                ? t('নির্বাচিত গোষ্ঠীর ৮টি অক্ষ', '8 axes in the selected group')
                : t('অংশগ্রহণকারীদের ৮টি মাপকাঠির মতামত ভারসাম্য', 'Participant opinion balance across 8 dimensions')}</span>
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              {isDemographicFilterActive
                ? t('প্রতিটি অক্ষের গোষ্ঠী-গড়', 'Group average on each axis')
                : t('অংশগ্রহণকারীদের প্রতিটি অক্ষের দুই মেরুর গড় অবস্থান', 'Participant average across both poles of each axis')}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {isDemographicFilterActive && filteredResult.available && (
              <span className="badge-tag font-latin">{t('গোষ্ঠী ফলাফল', 'GROUP RESULTS')}</span>
            )}
          </div>
        </div>

        {!analyticsStats && (
          <ChartEmptyState
            title={t('গোষ্ঠীভিত্তিক অক্ষের ফলাফল নেই', 'No axis results for this group')}
            subtitle={t(`গোষ্ঠী তুলনা দেখাতে অন্তত ${MIN_PUBLIC_COHORT_SIZE}টি ব্যবহারযোগ্য উত্তর প্রয়োজন।`, `At least ${MIN_PUBLIC_COHORT_SIZE} eligible responses are needed for group comparisons.`)}
          />
        )}

        <div style={{ display: analyticsStats ? undefined : 'none' }}>
          {THEMATIC_BLOCKS.map((block, idx) => {
            const axisStat = currentThematicAxes[block.key];
            const axisHasData = Boolean(axisStat?.hasData);
            const leftVal = axisStat?.leftPercent ?? 50;
            const rightVal = axisStat?.rightPercent ?? 50;
            const isRightDominant = rightVal >= 50;
            const fillReady = hasEnteredAxes && axisHasData;
            const isLast = idx === THEMATIC_BLOCKS.length - 1;

            return (
              <div
                key={block.key}
                className="dashboard-axis-row"
                style={{
                  borderBottom: isLast ? 'none' : undefined,
                  opacity: hasEnteredAxes ? 1 : 0,
                  transform: hasEnteredAxes ? 'translateY(0)' : 'translateY(14px)',
                  transition: 'opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1), transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)',
                  transitionDelay: `${idx * 45}ms`
                }}
              >
                {/* Axis name + its two poles */}
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.1rem' }}>
                    <span className="font-latin" style={{ color: 'var(--text-muted)', fontWeight: 800, fontSize: '0.75rem' }}>
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <strong style={{ fontSize: '0.9rem', color: axisHasData ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: 700, lineHeight: 1.3 }}>
                      {isEnglish ? ENGLISH_BLOCKS[block.key]?.title : block.title}
                    </strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>
                    <DashboardPoleIcon blockKey={block.key} side="left" style={{ width: '13px', height: '13px', color: 'var(--axis-left-color)' }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>
                      {isEnglish ? ENGLISH_BLOCKS[block.key]?.left : block.leftShort}
                    </span>
                    <span aria-hidden="true" style={{ color: 'var(--text-muted)' }}>⇄</span>
                    <DashboardPoleIcon blockKey={block.key} side="right" style={{ width: '13px', height: '13px', color: 'var(--axis-right-color)' }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>
                      {isEnglish ? ENGLISH_BLOCKS[block.key]?.right : block.rightShort}
                    </span>
                  </div>
                </div>

                {/* Diverging bar: left and right fills meet at the shared 50% mark */}
                <div style={{ position: 'relative', height: '16px' }}>
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    borderRadius: '999px',
                    overflow: 'hidden',
                    display: 'flex',
                    background: 'var(--data-track)'
                  }}>
                    <div style={{
                      width: fillReady ? `${leftVal}%` : '0%',
                      height: '100%',
                      background: 'linear-gradient(90deg, var(--axis-left-color) 0%, var(--axis-left-bright) 100%)',
                      transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                      transitionDelay: `${idx * 45}ms`
                    }} />
                    <div style={{
                      width: fillReady ? `${rightVal}%` : '0%',
                      height: '100%',
                      background: 'linear-gradient(90deg, var(--axis-right-bright) 0%, var(--axis-right-color) 100%)',
                      transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                      transitionDelay: `${idx * 45}ms`
                    }} />
                  </div>

                  {/* Shared 50% neutral reference */}
                  <div
                    title={t('নিরপেক্ষ কেন্দ্র (৫০%)', 'Neutral midpoint (50%)')}
                    style={{
                      position: 'absolute',
                      top: '-2px',
                      bottom: '-2px',
                      left: '50%',
                      width: '2px',
                      transform: 'translateX(-50%)',
                      background: 'var(--bg-primary)',
                      borderRadius: '2px',
                      zIndex: 2,
                      pointerEvents: 'none'
                    }}
                  />

                  {/* Leaning marker: where the two sides meet */}
                  <div
                    title={axisHasData
                      ? `${isEnglish ? ENGLISH_BLOCKS[block.key]?.[isRightDominant ? 'right' : 'left'] : isRightDominant ? block.rightShort : block.leftShort}: ${Math.abs(rightVal - 50).toFixed(1)}% ${t('ব্যবধান', 'difference')}`
                      : t('কোনো তথ্য নেই', 'No data')}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: fillReady ? `${leftVal}%` : '50%',
                      transform: fillReady ? 'translate(-50%, -50%)' : 'translate(-50%, -50%) scale(0.3)',
                      opacity: fillReady ? 1 : 0,
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      background: isRightDominant ? 'var(--axis-right-color)' : 'var(--axis-left-color)',
                      boxShadow: '0 0 0 2px var(--bg-card)',
                      zIndex: 3,
                      pointerEvents: 'none',
                      transition: 'left 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease',
                      transitionDelay: `${idx * 45}ms`
                    }}
                  />
                </div>

                {/* Reading: the dominant share and its magnitude */}
                <div style={{ textAlign: 'right', minWidth: 0 }}>
                  {axisHasData ? (
                    <>
                      <div className="font-latin" style={{ fontSize: '1rem', fontWeight: 800, color: isRightDominant ? 'var(--axis-right-color)' : 'var(--axis-left-color)', lineHeight: 1.2 }}>
                        <AnimatedPercent value={isRightDominant ? rightVal : leftVal} active={hasEnteredAxes} delay={idx * 45 + 70} />
                      </div>
                      <div
                        title={isEnglish ? ENGLISH_BLOCKS[block.key]?.[isRightDominant ? 'right' : 'left'] : isRightDominant ? block.rightShort : block.leftShort}
                        style={{ fontSize: '0.72rem', fontWeight: 700, color: isRightDominant ? 'var(--axis-right-color)' : 'var(--axis-left-color)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                      >
                        {isEnglish ? ENGLISH_BLOCKS[block.key]?.[isRightDominant ? 'right' : 'left'] : isRightDominant ? block.rightShort : block.leftShort}
                      </div>
                    </>
                  ) : (
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>{t('কোনো তথ্য নেই', 'NO DATA')}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Division Table: Geographic Breakdown */}
      <div className="dashboard-insight-card dashboard-insight-card--style1" style={{ padding: '2.5rem', marginBottom: '2.5rem' }}>
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={20} style={{ color: 'var(--accent-green)' }} />
              <span>{t('বিভাগভিত্তিক অংশগ্রহণ', 'Respondent participation by division')}</span>
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              {t('প্রতি বিভাগে উত্তরদাতার সংখ্যা ও অংশগ্রহণকারীদের মধ্যে অংশ', 'Response counts and share among participants')}
            </p>
          </div>
          <span className="badge-tag font-latin" style={{ color: 'var(--accent-green)', borderColor: 'var(--accent-green)' }}>
            {t('Bangladesh 8 Divisions Survey', 'Bangladesh 8 Divisions Survey')}
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '550px' }}>
            <thead>
              <tr style={{ borderBottom: '1.5px solid var(--border-medium)', color: 'var(--text-muted)', fontSize: '0.84rem' }}>
                <th style={{ padding: '0.75rem 1rem' }}>{t('বিভাগ (Division)', 'Division')}</th>
                <th style={{ padding: '0.75rem 1rem' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                    {t('মোট উত্তরদাতা', 'Total respondents')}
                    <span aria-hidden="true" style={{ color: 'var(--accent-green)' }}>▼</span>
                  </span>
                </th>
                <th style={{ padding: '0.75rem 1rem' }}>{t('অংশগ্রহণকারীদের মধ্যে অংশ', 'Share of participant responses')}</th>
              </tr>
            </thead>
            <tbody>
              {currentDivisions.map(({ divName, ...divData }) => {
                const isSelected = divData.isSelected;
                return (
                  <tr 
                    key={divName}
                    style={{ 
                      borderBottom: '1px solid var(--border-subtle)',
                      fontSize: '0.94rem',
                      background: isSelected ? 'var(--accent-gold-glow)' : 'transparent',
                      transition: 'background 0.3s ease'
                    }}
                  >
                    <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>{localizeDivision(divName)} {t('বিভাগ', 'Division')}</span>
                        {isSelected && (
                          <span style={{ fontSize: '0.72rem', background: 'var(--accent-gold)', color: 'var(--bg-primary)', padding: '1px 7px', borderRadius: '999px', fontWeight: 700 }}>
                            {t('নির্বাচিত', 'Selected')}
                          </span>
                        )}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--text-primary)' }} className="font-latin">
                      {divData.count.toLocaleString()}
                    </td>
                    <td style={{ padding: '1rem' }} className="font-latin">
                      <span className="badge-tag" style={{ color: isSelected ? 'var(--accent-gold)' : 'var(--text-secondary)', borderColor: isSelected ? 'var(--accent-gold)' : 'var(--border-subtle)' }}>
                        {divData.percentage}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CTA Banner */}
      <div className="glass-panel dashboard-assessment-cta">
        <span className="font-latin" style={{ color: 'var(--accent-green)', fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          {t('— নিজের অবস্থান জানুন', '— Find your position')}
        </span>
        <h3 style={{ color: 'var(--text-primary)' }}>
          {t('আপনি কি এখনো আপনার নিজস্ব অবস্থান মূল্যায়ন করেননি?', 'Haven you assessed your own position yet?')}
        </h3>
        <p style={{ color: 'var(--text-secondary)' }}>
          {t('মাত্র ৩-৪ মিনিটে ২৪টি প্রশ্নের উত্তর দিয়ে জেনে নিন ২০২৬-এর নতুন বাংলাদেশে আপনি কোন পন্থী।', 'Answer 24 questions in just 3-4 minutes to discover where you stand in the new Bangladesh of 2026.')}
        </p>

        <button 
          onClick={onTakeTest}
          className="btn-hero-start"
          style={{ cursor: 'pointer', margin: '0 auto' }}
        >
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            flexShrink: 0
          }}>
            <img 
              src={darkLogo} 
              alt="Logo" 
              className="site-logo-light" 
              style={{ width: '100%', height: '100%', objectFit: 'contain', transform: 'scale(1.22)' }} 
            />
            <img 
              src={lightLogo} 
              alt="Logo" 
              className="site-logo-dark" 
              style={{ width: '100%', height: '100%', objectFit: 'contain', transform: 'scale(1.22)' }} 
            />
          </div>
          <span>{t('জরিপে অংশ নিন', 'Take the survey')}</span>
          <ArrowRight size={22} />
        </button>
      </div>

    </div>
  );
}
