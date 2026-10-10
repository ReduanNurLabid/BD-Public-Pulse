import React, { useState, useEffect, useCallback } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  HelpCircle,
  Languages
} from 'lucide-react';
import { 
  QUESTIONS, 
  THEMATIC_BLOCKS, 
  LIKERT_OPTIONS, 
  ENGLISH_QUESTION_TEXTS, 
  ENGLISH_THEMATIC_BLOCKS 
} from '../data/questions';

export default function TestScreen({ onComplete, lang = 'bn', setLang, onToggleLang }) {
  const [localLang, setLocalLang] = useState(lang);

  useEffect(() => {
    setLocalLang(lang);
  }, [lang]);

  const handleToggleLang = () => {
    const nextLang = localLang === 'bn' ? 'en' : 'bn';
    setLocalLang(nextLang);
    if (setLang) setLang(nextLang);
    else if (onToggleLang) onToggleLang();
  };

  const isEnglish = localLang === 'en';
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [startTime] = useState(Date.now());
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  // Timer counter
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  const enToBn = (num) => String(num).replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[d]);

  const currentQ = QUESTIONS[currentIndex];
  const currentBlock = THEMATIC_BLOCKS.find(b => b.id === currentQ.blockId) || THEMATIC_BLOCKS[0];
  const blockCopy = isEnglish ? ENGLISH_THEMATIC_BLOCKS[currentBlock.id] : currentBlock;

  // Find existing answer for this question
  const existingAns = answers.find(a => a.questionId === currentQ.id);
  const selectedScore = existingAns ? existingAns.score : null;

  // Handle option selection
  const handleSelectOption = useCallback((optionVal) => {
    if (isTransitioning) return;

    // Update answers array
    const updated = answers.filter(a => a.questionId !== currentQ.id);
    updated.push({
      questionId: currentQ.id,
      score: optionVal,
      blockId: currentQ.blockId
    });
    setAnswers(updated);

    // Smooth transition to next
    setIsTransitioning(true);
    setTimeout(() => {
      if (currentIndex < QUESTIONS.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setIsTransitioning(false);
      } else {
        // All 24 questions answered!
        const totalDurationSeconds = Math.floor((Date.now() - startTime) / 1000);
        onComplete(updated, totalDurationSeconds);
      }
    }, 220);
  }, [isTransitioning, answers, currentQ, currentIndex, startTime, onComplete]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0 && !isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(prev => prev - 1);
        setIsTransitioning(false);
      }, 150);
    }
  }, [currentIndex, isTransitioning]);

  const handleNext = useCallback(() => {
    if (currentIndex < QUESTIONS.length - 1 && !isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setIsTransitioning(false);
      }, 150);
    }
  }, [currentIndex, isTransitioning]);

  // Keyboard shortcuts (1-5 for options, Left/Backspace for previous, Right for next)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target?.tagName)) return;

      const keyMap = {
        '1': 5, '১': 5, // Strongly Agree
        '2': 4, '২': 4, // Agree
        '3': 3, '৩': 3, // Neutral
        '4': 2, '৪': 2, // Disagree
        '5': 1, '৫': 1  // Strongly Disagree
      };

      if (keyMap[e.key] !== undefined) {
        e.preventDefault();
        handleSelectOption(keyMap[e.key]);
      } else if (e.key === 'ArrowLeft' || e.key === 'Backspace') {
        if (currentIndex > 0) {
          e.preventDefault();
          handlePrevious();
        }
      } else if (e.key === 'ArrowRight') {
        if (selectedScore !== null && currentIndex < QUESTIONS.length - 1) {
          e.preventDefault();
          handleNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSelectOption, handlePrevious, handleNext, currentIndex, selectedScore]);

  // Progress metrics
  const progressPercent = Math.round(((currentIndex + 1) / QUESTIONS.length) * 100);

  // Calculate question index inside current theme (e.g. 1 of 3)
  const [startRange, endRange] = currentBlock.questionRange || [1, 3];
  const questionNumInTheme = (currentIndex + 1) - (startRange - 1);
  const totalInTheme = (endRange - startRange + 1);

  // Clean redundant quotes from the raw question statement
  const rawQuestionText = isEnglish 
    ? (ENGLISH_QUESTION_TEXTS[currentQ.id] || currentQ.text) 
    : currentQ.text;
  const cleanQuestionText = rawQuestionText.replace(/^["'“‘]+|["'”’]+$/g, '').trim();

  // 5 Likert options arranged left-to-right: Strongly Agree -> Strongly Disagree
  const displayOptions = [...LIKERT_OPTIONS].reverse();

  return (
    <div 
      lang={isEnglish ? 'en' : 'bn'} 
      className="survey-layout animate-fade-in"
    >
      
      {/* Top Progress & Context Header */}
      <div className="glass-panel survey-header-card">
        
        {/* Meta Bar: Active Dimension & Question Counter */}
        <div className="survey-header-meta">
          {/* Active Theme Badge */}
          <span className="survey-theme-pill">
            <Sparkles size={14} />
            <span>{isEnglish ? currentBlock.id : enToBn(currentBlock.id)}. {blockCopy.title}</span>
          </span>

          {/* Question Counter Pill */}
          <span className="survey-counter-pill">
            <CheckCircle2 size={14} />
            <span className="counter-text-full">
              {isEnglish 
                ? `${currentIndex + 1} of ${QUESTIONS.length}` 
                : `${enToBn(currentIndex + 1)} / ${enToBn(QUESTIONS.length)}`}
            </span>
            <span className="counter-text-short">
              {isEnglish 
                ? `Q ${currentIndex + 1} / ${QUESTIONS.length}` 
                : `প্রশ্ন ${enToBn(currentIndex + 1)} / ${enToBn(QUESTIONS.length)}`}
            </span>
          </span>
        </div>

        {/* 8 Thematic Blocks Micro Stepper */}
        <div 
          className="survey-stepper-grid"
          aria-label={isEnglish ? "8 Dimensions Progress" : "৮টি মাপকাঠির অগ্রগতি"}
        >
          {THEMATIC_BLOCKS.map(b => {
            const isCompleted = b.id < currentBlock.id;
            const isCurrent = b.id === currentBlock.id;
            return (
              <div 
                key={b.id}
                title={`${isEnglish ? ENGLISH_THEMATIC_BLOCKS[b.id].title : b.title} (${b.id}/8)`}
                style={{
                  height: '4px',
                  borderRadius: '3px',
                  backgroundColor: isCompleted 
                    ? 'var(--accent-green)' 
                    : isCurrent 
                      ? 'var(--accent-gold)' 
                      : 'var(--data-track)',
                  boxShadow: isCurrent ? '0 0 8px var(--accent-gold-glow)' : 'none',
                  transition: 'all 0.35s ease'
                }}
              />
            );
          })}
        </div>

        {/* Overall Smooth Continuous Progress Bar */}
        <div className="progress-track" style={{ height: '5px' }}>
          <div 
            className="progress-fill" 
            style={{ 
              width: `${progressPercent}%`,
              transition: 'width 0.4s var(--ease-smooth)'
            }}
          />
        </div>
      </div>

      {/* Main Question Card with Smooth Transition Feedback */}
      <div 
        className="glass-panel survey-question-card" 
        style={{ 
          opacity: isTransitioning ? 0.35 : 1,
          transform: isTransitioning ? 'translateY(5px)' : 'translateY(0)',
          transition: 'opacity 0.2s var(--ease-smooth), transform 0.2s var(--ease-smooth)'
        }}
      >
        <div>
          {/* Card Eyebrow: Topic Subtitle + Position in Topic + Language Switcher */}
          <div className="survey-question-eyebrow">
            <span className="survey-topic-pill">
              <Layers size={14} />
              <span>{isEnglish ? 'Topic: ' : 'বিষয়: '}{blockCopy.subtitle}</span>
            </span>

            <span className="survey-eyebrow-step">
              {isEnglish 
                ? `Statement ${questionNumInTheme} of ${totalInTheme} in this dimension` 
                : `এই মাপকাঠির ${enToBn(questionNumInTheme)} / ${enToBn(totalInTheme)} নম্বর বক্তব্য`}
            </span>

            {/* Quick Toggle: View Question in English / Bangla */}
            <button
              type="button"
              onClick={(e) => {
                e.currentTarget.blur();
                handleToggleLang();
              }}
              className="survey-lang-btn"
              title={isEnglish ? "View question in Bangla (বাংলায় দেখুন)" : "View question in English (ইংরেজিতে দেখুন)"}
              aria-label={isEnglish ? "Switch question to Bangla" : "Switch question to English"}
            >
              <Languages size={14} style={{ color: 'var(--accent-cyan)' }} />
              <span className="survey-lang-text-desktop">{isEnglish ? 'বাংলায় দেখুন' : 'View in English'}</span>
              <span className="survey-lang-text-mobile">{isEnglish ? 'বাংলা' : 'English'}</span>
            </button>
          </div>

          {/* Survey Statement Headline */}
          <h2 className="survey-statement-text">
            “{cleanQuestionText}”
          </h2>
        </div>

        {/* 5-Step Likert Options Container */}
        <div>
          <div className="survey-instruction-prompt">
            <span>
              {isEnglish
                ? 'Choose the response that best reflects your view:'
                : 'বক্তব্যটির সাথে আপনার সহমতের মাত্রা নির্বাচন করুন:'}
            </span>
          </div>

          <div className="likert-container">
            {displayOptions.map((opt, optIdx) => {
              const isSelected = selectedScore === opt.value;
              const displayKeyNum = isEnglish ? String(optIdx + 1) : enToBn(optIdx + 1);
              return (
                <button
                  key={`${currentQ.id}_${opt.value}`}
                  type="button"
                  onClick={(e) => {
                    e.currentTarget.blur();
                    handleSelectOption(opt.value);
                  }}
                  className={`likert-btn ${isSelected ? 'selected' : ''}`}
                  style={{
                    '--opt-color': opt.color,
                    '--opt-glow': `${opt.color}40`,
                    '--opt-tint-hover': `${opt.color}18`,
                    '--opt-tint-selected': `${opt.color}25`
                  }}
                  title={isEnglish ? `Press ${optIdx + 1} to select` : `নির্বাচন করতে ${enToBn(optIdx + 1)} চাপুন`}
                >
                  <span className="likert-key-badge font-latin" aria-hidden="true">
                    {displayKeyNum}
                  </span>
                  <div className="likert-dot" />
                  <span className="likert-label">
                    {isEnglish
                      ? ['Strongly disagree', 'Disagree', 'Neutral / Depends', 'Agree', 'Strongly agree'][opt.value - 1]
                      : opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Navigation & Keyboard Assistance Controls */}
      <div className="survey-bottom-nav">
        {/* Previous Question Button */}
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="btn-secondary"
          style={{
            visibility: currentIndex === 0 ? 'hidden' : 'visible',
            padding: '0.65rem 1.25rem',
            fontSize: '0.92rem',
            borderRadius: '999px'
          }}
        >
          <ArrowLeft size={16} />
          <span>{isEnglish ? 'Previous Question' : 'পূর্ববর্তী প্রশ্ন'}</span>
        </button>

        {/* Helper / Status Hint */}
        <div className="survey-keyboard-hint">
          {selectedScore !== null ? (
            <span style={{ color: 'var(--accent-green)', fontWeight: 650, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <span>✓</span>
              <span>{isEnglish ? 'Answer recorded' : 'উত্তর সংরক্ষিত হয়েছে'}</span>
            </span>
          ) : (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.9rem' }}>💡</span>
              <span>{isEnglish ? 'Keys 1–5 to answer · ◀ Back' : 'কিবোর্ডের ১–৫ চেপে উত্তর দিতে পারেন · ◀ আগের প্রশ্ন'}</span>
            </span>
          )}
        </div>

        {/* Next Question Button (visible if current question has an answer) */}
        {currentIndex < QUESTIONS.length - 1 && selectedScore !== null ? (
          <button
            onClick={handleNext}
            className="btn-secondary"
            style={{
              padding: '0.65rem 1.25rem',
              fontSize: '0.92rem',
              borderRadius: '999px'
            }}
          >
            <span>{isEnglish ? 'Next Question' : 'পরবর্তী প্রশ্ন'}</span>
            <ArrowRight size={16} />
          </button>
        ) : (
          <div style={{ width: '40px' }} />
        )}
      </div>

    </div>
  );
}
