import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Shuffle, Sparkles } from 'lucide-react';
import PersonalityCard from './PersonalityCard';
import { QUESTIONS, THEMATIC_BLOCKS } from '../data/questions';
import { MASTER_PERSONALITIES } from '../lib/scoring';

const EXAMPLES = [
  {
    id: 'reformist-left',
    key: 'libertarian_left',
    accentColor: '#34D399',
    badgeEmoji: '🌸',
    coordinates: { x: -48, y: 38 },
    demoProfiles: '14,320',
    tendency: { en: 'Reformist Social Democrat', bn: 'সংস্কারপন্থী ও সমতাভিত্তিক', similarity: 82 },
    axisScores: [-42, 65, 38, -35, 45, 68, 72, 58],
    figures: ['Tajuddin Ahmad', 'Nelson Mandela']
  },
  {
    id: 'trad-right',
    key: 'authoritarian_right',
    accentColor: '#FBBF24',
    badgeEmoji: '🔵',
    coordinates: { x: 44, y: -28 },
    demoProfiles: '16,840',
    tendency: { en: 'Traditionalist & Free Market', bn: 'ঐতিহ্যবাদী ও মুক্তবাজার', similarity: 79 },
    axisScores: [38, -25, -35, 58, 62, -20, -15, 32],
    figures: ['Ziaur Rahman', 'Winston Churchill']
  },
  {
    id: 'independent-centrist',
    key: 'centrist',
    accentColor: '#F59E0B',
    badgeEmoji: '⚖️',
    coordinates: { x: 8, y: 12 },
    demoProfiles: '18,910',
    tendency: { en: 'Independent Pragmatist', bn: 'স্বতন্ত্র চিন্তাবিদ ও মধ্যপন্থী', similarity: 76 },
    axisScores: [15, 22, 10, 18, 25, 20, 30, 14],
    figures: ['A. K. Fazlul Huq', 'Abraham Lincoln']
  },
  {
    id: 'constitutional-liberal',
    key: 'libertarian_right',
    accentColor: '#60A5FA',
    badgeEmoji: '🏛️',
    coordinates: { x: 32, y: 62 },
    demoProfiles: '11,450',
    tendency: { en: 'Liberal Constitutionalist', bn: 'উদার সংবিধানবাদী ও সুশীল', similarity: 81 },
    axisScores: [45, 52, 48, 42, 28, 75, 40, 50],
    figures: ['H. S. Suhrawardy', 'Thomas Jefferson']
  },

  {
    id: 'mass-socialist',
    key: 'authoritarian_left',
    accentColor: '#F87171',
    badgeEmoji: '🚩',
    coordinates: { x: -68, y: -38 },
    demoProfiles: '13,120',
    tendency: { en: 'Agrarian Mass Socialist', bn: 'মজলুম কৃষক ও মেহনতী মুক্তি', similarity: 80 },
    axisScores: [-60, -30, 25, -75, -20, -15, 60, -45],
    figures: ['Maulana Bhashani', 'Karl Marx']
  }
];

const getSampleAnalysis = (example) => ({
  coordinates: example.coordinates,
  quadrantProfile: { key: example.key },
  primaryBloc: {
    key: example.key,
    percentage: example.tendency.similarity,
    relativeShare: example.tendency.similarity,
    profile: {
      name: example.tendency.bn,
      englishName: example.tendency.en
    }
  },
  answers: QUESTIONS.map((question) => ({ questionId: question.id, score: 4 })),
  blockResults: THEMATIC_BLOCKS.map((block, index) => ({
    ...block,
    bipolarScore: example.axisScores[index] !== undefined ? example.axisScores[index] : 0
  })),
  personalities: example.figures
    .map((nameEn) => MASTER_PERSONALITIES.find((person) => person.nameEn === nameEn))
    .filter(Boolean)
});

export default function ResultsCollage({ lang = 'bn' }) {
  const isEnglish = lang === 'en';
  const [activeIndex, setActiveIndex] = useState(0);
  const [transitionDirection, setTransitionDirection] = useState('next'); // 'next' | 'prev'
  const [isAnimating, setIsAnimating] = useState(false);
  const [paused, setPaused] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const startXRef = React.useRef(0);
  const startYRef = React.useRef(0);
  const currentXRef = React.useRef(0);
  const hasHorizontalIntentRef = React.useRef(false);
  const animTimeoutRef = React.useRef(null);

  const currentExample = EXAMPLES[activeIndex];

  // Auto-slide when idle
  useEffect(() => {
    if (paused || isDragging || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }
    const timer = window.setInterval(() => {
      move(1);
    }, 5500);
    return () => window.clearInterval(timer);
  }, [paused, isDragging, activeIndex]);

  useEffect(() => {
    return () => {
      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
    };
  }, []);

  const move = (step) => {
    if (step === 0) return;
    const dir = step > 0 ? 'next' : 'prev';
    setTransitionDirection(dir);
    setIsAnimating(true);
    setActiveIndex((idx) => (idx + step + EXAMPLES.length) % EXAMPLES.length);

    if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
    animTimeoutRef.current = setTimeout(() => {
      setIsAnimating(false);
    }, 460);
  };

  const selectIndex = (targetIndex) => {
    if (targetIndex === activeIndex) return;
    let diff = targetIndex - activeIndex;
    if (diff > Math.floor(EXAMPLES.length / 2)) diff -= EXAMPLES.length;
    if (diff < -Math.floor(EXAMPLES.length / 2)) diff += EXAMPLES.length;
    move(diff);
  };

  // Pointer / Touch Swipe Handlers
  const handlePointerDown = (e) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
    currentXRef.current = e.clientX;
    hasHorizontalIntentRef.current = false;
    setIsDragging(true);
    setPaused(true);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const diffX = e.clientX - startXRef.current;
    const diffY = e.clientY - startYRef.current;

    if (!hasHorizontalIntentRef.current) {
      if (Math.abs(diffX) > 8 && Math.abs(diffX) > Math.abs(diffY)) {
        hasHorizontalIntentRef.current = true;
        try {
          e.currentTarget.setPointerCapture?.(e.pointerId);
        } catch (_) {}
      } else if (Math.abs(diffY) > 10) {
        setIsDragging(false);
        setDragOffset(0);
        return;
      }
    }

    if (hasHorizontalIntentRef.current) {
      currentXRef.current = e.clientX;
      setDragOffset(diffX);
    }
  };

  const handlePointerUp = (e) => {
    if (!isDragging) return;
    try {
      e.currentTarget.releasePointerCapture?.(e.pointerId);
    } catch (_) {}

    const diff = currentXRef.current - startXRef.current;
    const swipeThreshold = 45;

    setIsDragging(false);
    setPaused(false);
    hasHorizontalIntentRef.current = false;
    setDragOffset(0);

    if (diff < -swipeThreshold) {
      move(1); // Swiped Left -> Next Card
    } else if (diff > swipeThreshold) {
      move(-1); // Swiped Right -> Previous Card
    }
  };

  const handlePointerCancel = () => {
    setIsDragging(false);
    setDragOffset(0);
    setPaused(false);
    hasHorizontalIntentRef.current = false;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') move(1);
    else if (e.key === 'ArrowLeft') move(-1);
  };

  return (
    <section
      className="showcase-story"
      style={{ '--showcase-accent': currentExample.accentColor }}
      aria-label={isEnglish ? 'Illustrative story-card preview' : 'স্টোরি কার্ডের নমুনা প্রিভিউ'}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => !isDragging && setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >

      {/* 3D Persistent Fanned Card Deck */}
      <div 
        className={`showcase-fanned-deck${isDragging ? ' is-dragging' : ''}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        {/* Invisible layout spacer to establish exact container height without layout shifts */}
        <div className="showcase-fanned-deck__spacer" aria-hidden="true">
          <PersonalityCard
            analysis={getSampleAnalysis(EXAMPLES[0])}
            lang={lang}
            showcaseOnly
            demoProfiles={EXAMPLES[0].demoProfiles}
          />
        </div>

        {/* Persistent 5-card carousel: Cards physically glide rather than recreate or fade */}
        {EXAMPLES.map((item, index) => {
          let offset = (index - activeIndex) % EXAMPLES.length;
          if (offset < -Math.floor(EXAMPLES.length / 2)) {
            offset += EXAMPLES.length;
          } else if (offset > Math.floor(EXAMPLES.length / 2)) {
            offset -= EXAMPLES.length;
          }

          const isCenter = offset === 0;
          const isRight = offset === 1;
          const isLeft = offset === -1;
          const isSide = isRight || isLeft;

          // Tighter stack parameters: side cards peek out less for a cleaner, compact feel
          const sideTx = 20;       // Reduced from 36px to 20px
          const sideTy = 8;        // Reduced from 12px to 8px
          const sideRot = 3.8;     // Reduced from 6.8deg to 3.8deg
          const sideScale = 0.945; // Increased from 0.92 to 0.945
          const backScale = 0.88;
          const backTy = 14;

          let transform = `translate3d(0, ${backTy}px, 0) rotate(0deg) scale(${backScale})`;
          let zIndex = 1;
          let filter = 'brightness(0.75) saturate(0.85)';
          let pointerEvents = 'none';

          if (isDragging) {
            const p = Math.max(-1, Math.min(1, dragOffset / 180));
            if (isCenter) {
              zIndex = 10;
              pointerEvents = 'auto';
              transform = `translate3d(${dragOffset}px, ${Math.abs(p) * 5}px, 0) rotate(${dragOffset * 0.03}deg) scale(${1 - Math.abs(p) * 0.03})`;
              filter = 'none';
            } else if (isRight) {
              pointerEvents = 'auto';
              if (p < 0) {
                // Dragging toward next: right card approaches center
                const r = Math.abs(p);
                const tx = sideTx * (1 - r);
                const ty = sideTy * (1 - r);
                const rot = sideRot * (1 - r);
                const sc = sideScale + r * (1 - sideScale);
                transform = `translate3d(${tx}px, ${ty}px, 0) rotate(${rot}deg) scale(${sc})`;
                filter = `brightness(${0.82 + r * 0.18}) saturate(${0.9 + r * 0.1})`;
                zIndex = 8;
              } else {
                // Dragging toward prev: right card recedes behind
                const r = p;
                const tx = sideTx + r * 8;
                const ty = sideTy + r * 3;
                const rot = sideRot + r * 1;
                const sc = sideScale - r * 0.03;
                transform = `translate3d(${tx}px, ${ty}px, 0) rotate(${rot}deg) scale(${sc})`;
                filter = 'brightness(0.82) saturate(0.9)';
                zIndex = 5;
              }
            } else if (isLeft) {
              pointerEvents = 'auto';
              if (p > 0) {
                // Dragging toward prev: left card approaches center
                const r = p;
                const tx = -sideTx * (1 - r);
                const ty = sideTy * (1 - r);
                const rot = -sideRot * (1 - r);
                const sc = sideScale + r * (1 - sideScale);
                transform = `translate3d(${tx}px, ${ty}px, 0) rotate(${rot}deg) scale(${sc})`;
                filter = `brightness(${0.82 + r * 0.18}) saturate(${0.9 + r * 0.1})`;
                zIndex = 8;
              } else {
                // Dragging toward next: left card recedes behind
                const r = Math.abs(p);
                const tx = -sideTx - r * 8;
                const ty = sideTy + r * 3;
                const rot = -sideRot - r * 1;
                const sc = sideScale - r * 0.03;
                transform = `translate3d(${tx}px, ${ty}px, 0) rotate(${rot}deg) scale(${sc})`;
                filter = 'brightness(0.82) saturate(0.9)';
                zIndex = 5;
              }
            } else if (offset === 2 && p < 0) {
              // Background card emerging toward right during left drag
              const r = Math.abs(p);
              const tx = r * sideTx;
              const ty = backTy - r * (backTy - sideTy);
              const rot = r * sideRot;
              const sc = backScale + r * (sideScale - backScale);
              transform = `translate3d(${tx}px, ${ty}px, 0) rotate(${rot}deg) scale(${sc})`;
              zIndex = 3;
            } else if (offset === -2 && p > 0) {
              // Background card emerging toward left during right drag
              const r = p;
              const tx = -r * sideTx;
              const ty = backTy - r * (backTy - sideTy);
              const rot = -r * sideRot;
              const sc = backScale + r * (sideScale - backScale);
              transform = `translate3d(${tx}px, ${ty}px, 0) rotate(${rot}deg) scale(${sc})`;
              zIndex = 3;
            }
          } else {
            // Resting state or animated transition
            if (isCenter) {
              transform = 'translate3d(0, 0, 0) rotate(0deg) scale(1)';
              zIndex = 10;
              filter = 'none';
              pointerEvents = 'auto';
            } else if (isRight) {
              transform = `translate3d(${sideTx}px, ${sideTy}px, 0) rotate(${sideRot}deg) scale(${sideScale})`;
              filter = 'brightness(0.82) saturate(0.9)';
              pointerEvents = 'auto';
              if (isAnimating) {
                zIndex = transitionDirection === 'prev' ? 7 : 4;
              } else {
                zIndex = 5;
              }
            } else if (isLeft) {
              transform = `translate3d(-${sideTx}px, ${sideTy}px, 0) rotate(-${sideRot}deg) scale(${sideScale})`;
              filter = 'brightness(0.82) saturate(0.9)';
              pointerEvents = 'auto';
              if (isAnimating) {
                zIndex = transitionDirection === 'next' ? 7 : 4;
              } else {
                zIndex = 5;
              }
            } else {
              // Non-visible background deck cards: concealed directly behind center card
              transform = `translate3d(0, ${backTy}px, 0) rotate(0deg) scale(${backScale})`;
              filter = 'brightness(0.7) saturate(0.8)';
              zIndex = 1;
              pointerEvents = 'none';
            }
          }

          return (
            <div
              key={item.id}
              className={`showcase-fanned-card${isCenter ? ' is-center' : ''}${isSide ? ' is-clickable' : ''}`}
              style={{
                transform,
                zIndex,
                pointerEvents,
                filter
              }}
              onClick={() => {
                if (isRight) move(1);
                else if (isLeft) move(-1);
              }}
              title={isRight ? (isEnglish ? 'Click to show next card' : 'পরের কার্ড দেখুন') : (isLeft ? (isEnglish ? 'Click to show previous card' : 'আগের কার্ড দেখুন') : undefined)}
              aria-hidden={!isCenter}
            >
              <PersonalityCard
                analysis={getSampleAnalysis(item)}
                lang={lang}
                showcaseOnly
                demoProfiles={item.demoProfiles}
              />
            </div>
          );
        })}
      </div>

      {/* Dots Indicator (Centered subtle deck pagination) */}
      <div className="showcase-fanned-deck__dots" aria-label={isEnglish ? 'Choose a sample layout' : 'নমুনা কার্ড বেছে নিন'}>
        {EXAMPLES.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={`showcase-fanned-deck__dot${index === activeIndex ? ' is-active' : ''}`}
            style={{
              '--dot-accent': item.accentColor
            }}
            onClick={() => selectIndex(index)}
            aria-label={isEnglish ? `Show card ${index + 1}: ${item.tendency.en}` : `কার্ড ${enToBn(index + 1)}: ${item.tendency.bn}`}
            aria-pressed={index === activeIndex}
          />
        ))}
      </div>

      <p className="showcase-story__note">
        {isEnglish
          ? 'Illustrative sample only. Take the survey for your own personalized results.'
          : 'কাল্পনিক নমুনা। আপনার ব্যক্তিগত ফলাফলের জন্য জরিপটি পূরণ করুন।'}
      </p>
    </section>
  );
}

function enToBn(value) {
  return String(value).replace(/\d/g, (digit) => '০১২৩৪৫৬৭৮৯'[digit]);
}
