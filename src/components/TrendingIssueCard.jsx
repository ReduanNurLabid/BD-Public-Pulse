import React, { useEffect, useMemo, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { ENGLISH_QUESTION_TEXTS } from '../data/questions';
import { rankTrendingIssues } from '../lib/trendingIssues';

const ROTATE_MS = 5200;

// Same data-encoding scale the Dashboard's trending section paints with, so the
// same issue reads identically on both pages. These tokens hold their hue across
// the theme flip rather than collapsing to near-white like --accent-* do.
const SEGMENTS = [
  { key: 'agree', label: { bn: 'একমত', en: 'Agree' }, token: '--data-agree' },
  { key: 'neutral', label: { bn: 'নিরপেক্ষ', en: 'Neutral' }, token: '--data-neutral' },
  { key: 'disagree', label: { bn: 'দ্বিমত', en: 'Disagree' }, token: '--data-disagree' }
];

/**
 * Welcome Page card that cycles the national wedge-issue splits, one issue at a
 * time. Reads the same stats/aggregates document the Dashboard tab reads, so
 * the numbers can never disagree between the two pages — no extra Firestore
 * read, no second projection of the same accumulators.
 */
export default function TrendingIssueCard({ issues, lang = 'bn' }) {
  const isEnglish = lang === 'en';
  const [index, setIndex] = useState(0);
  // Bumped on manual selection so the interval restarts and a tap actually
  // resets the dwell time instead of racing the next auto-advance.
  const [cycle, setCycle] = useState(0);

  // Keep the welcome card and dashboard on one transparent ranking: answer
  // volume first, with the agree/disagree split breaking ties.
  const ranked = useMemo(() => {
    const answered = (issues || []).filter(issue => issue?.hasData && issue.totalAnswers > 0);
    return rankTrendingIssues(answered);
  }, [issues]);

  // Clamp rather than reset in an effect: a shrinking list must not render a
  // frame with no active slide before the state catches up.
  const active = ranked.length > 0 ? ranked[Math.min(index, ranked.length - 1)] : null;

  useEffect(() => {
    // One issue is not a slideshow, and rotating text is exactly the kind of
    // motion that needs to be opted out of.
    if (ranked.length < 2) return undefined;
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    let timer = null;

    const start = () => {
      if (timer || document.visibilityState !== 'visible') return;
      timer = setInterval(() => setIndex(current => (current + 1) % ranked.length), ROTATE_MS);
    };
    const stop = () => {
      if (!timer) return;
      clearInterval(timer);
      timer = null;
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') start();
      else stop();
    };

    start();
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [ranked.length, cycle]);

  const selectSlide = target => {
    setIndex(target);
    setCycle(current => current + 1);
  };

  return (
    <div
      style={{
        background: 'var(--action-card3-bg)',
        borderRadius: '24px',
        padding: '2.5rem',
        color: 'var(--action-card3-text)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.9rem',
          fontWeight: 700,
          marginBottom: '0.9rem'
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <TrendingUp size={16} />
          <span style={{ opacity: 0.7 }}>{isEnglish ? 'Trending issues' : 'ট্রেন্ডিং ইস্যু'}</span>
        </span>

        {/* Paging controls live in the header rather than in a footer row: same
            affordance, one fewer band of vertical padding in a card whose height
            is set by the statement below. */}
        {active && ranked.length > 1 && (
          <div role="tablist" aria-label={isEnglish ? 'Trending issues' : 'ট্রেন্ডিং ইস্যু'} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {ranked.map((issue, dotIndex) => (
              <button
                key={issue.id}
                type="button"
                role="tab"
                aria-selected={dotIndex === Math.min(index, ranked.length - 1)}
                aria-label={isEnglish ? `Issue ${dotIndex + 1}` : `ইস্যু ${dotIndex + 1}`}
                className="trending-issue__dot"
                onClick={() => selectSlide(dotIndex)}
                style={{
                  width: dotIndex === Math.min(index, ranked.length - 1) ? '22px' : '8px',
                  height: '8px',
                  borderRadius: '999px',
                  background:
                    dotIndex === Math.min(index, ranked.length - 1)
                      ? 'var(--action-card3-text)'
                      : 'transparent',
                  border: '1.5px solid var(--action-card3-text)',
                  opacity: dotIndex === Math.min(index, ranked.length - 1) ? 0.95 : 0.45,
                  transition: 'width 0.3s var(--ease-smooth), opacity 0.3s var(--ease-smooth)'
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div style={{ opacity: 0.72, fontSize: '0.76rem', marginBottom: '0.75rem' }}>
        {isEnglish
          ? 'Ranked by answer count · agreement split shown below'
          : 'উত্তরের সংখ্যা অনুযায়ী ক্রম · নিচে মতের বিভাজন'}
      </div>

      {!active ? (
        <div style={{ opacity: 0.8, fontSize: '0.95rem', marginTop: 'auto' }}>
          {isEnglish ? 'Waiting for trending issues to be published' : 'ট্রেন্ডিং ইস্যু প্রকাশের অপেক্ষায়'}
        </div>
      ) : (
        <>
          {/* key remounts the block per slide so the fade replays each advance */}
          <div key={active.id} className="trending-issue__slide">
            <div
              style={{
                display: 'flex',
                height: '12px',
                borderRadius: '999px',
                overflow: 'hidden',
                background: 'var(--data-track)',
                marginBottom: '0.6rem'
              }}
            >
              {SEGMENTS.map(segment => (
                <div
                  key={segment.key}
                  style={{ width: `${active[segment.key]}%`, background: `var(${segment.token})` }}
                  title={`${segment.label[isEnglish ? 'en' : 'bn']}: ${active[segment.key]}%`}
                />
              ))}
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '0.75rem',
                fontSize: '0.82rem',
                fontWeight: 700,
                marginBottom: '0.9rem'
              }}
            >
              {SEGMENTS.map(segment => (
                <span key={segment.key} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span
                    aria-hidden="true"
                    style={{ width: '8px', height: '8px', borderRadius: '50%', background: `var(${segment.token})`, flexShrink: 0 }}
                  />
                  <span style={{ opacity: 0.85 }}>
                    {segment.label[isEnglish ? 'en' : 'bn']} <span className="font-latin">{active[segment.key]}%</span>
                  </span>
                </span>
              ))}
            </div>

            <div style={{ fontSize: '0.98rem', fontWeight: 700, lineHeight: 1.5, opacity: 0.95 }}>
              <div style={{ height: '7.4rem', display: 'flex', alignItems: 'center' }}>
                {/* 5 lines at this line-height, sized so the longest tracked issue
                    fits at every breakpoint without the card resizing. The clamp
                    is only an overflow guarantee: a shorter statement centres in
                    the gap instead of re-flowing the whole stats grid. */}
                <div style={{ display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical', overflow: 'hidden', textAlign: 'center' }}>
                  {isEnglish ? (ENGLISH_QUESTION_TEXTS[active.id] || active.title) : active.title}
                </div>
              </div>
            </div>
          </div>

          <div
            className="font-latin"
            style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: 'auto', paddingTop: '0.75rem' }}
          >
            <span>{active.totalAnswers.toLocaleString('en-US')} {isEnglish ? 'answers' : 'টি উত্তর'}</span>
            <span aria-hidden="true"> · </span>
            {Math.min(index, ranked.length - 1) + 1} / {ranked.length}
          </div>
        </>
      )}
    </div>
  );
}