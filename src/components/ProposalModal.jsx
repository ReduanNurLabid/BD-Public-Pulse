import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import confetti from 'canvas-confetti';
import { X, Send, CheckCircle, Layers, TrendingUp, Users, ChevronDown } from 'lucide-react';
import PoleIcon from './PoleIcon';
import { submitProposal, fetchProposalStats } from '../lib/firebase';
import { PROPOSAL_CATEGORIES, PROPOSAL_TITLE_IDEAS } from '../data/questions';

const TITLE_MIN = 5;
const TITLE_MAX = 120;
const DESCRIPTION_MAX = 500;

const enToBn = (num) => String(num).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[d]);
const ENGLISH_PROPOSAL_CATEGORIES = {
  economy: 'Economy and markets',
  governance: 'Governance and reform',
  education: 'Education and research',
  social_justice: 'Social justice',
  law_justice: 'Law and justice',
  foreign_policy: 'Foreign policy and sovereignty',
  religion_state: 'Religion and state',
  environment: 'Environment and climate',
  health: 'Health and public health',
  other: 'Other'
};
const ENGLISH_TITLE_IDEAS = [
  'Decentralizing the police administration...',
  'Limiting the Prime Minister’s powers in the constitution...',
  'Universal health insurance...',
  'Reviewing diploma quotas...',
  'Housing projects across districts...'
];

function prefersReducedMotion() {
  return typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Cycles the title input's placeholder so the field reads as an invitation
 * rather than a blank box. Falls back to a single static example when the user
 * has asked for reduced motion.
 */
function useTypewriterPlaceholder(ideas, active) {
  const [text, setText] = useState('');
  const reduced = prefersReducedMotion();

  useEffect(() => {
    if (!active || reduced || ideas.length === 0) return;

    let ideaIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let timer;

    const tick = () => {
      const full = ideas[ideaIndex % ideas.length];

      if (!deleting && charIndex < full.length) {
        charIndex += 1;
        setText(full.slice(0, charIndex));
        timer = setTimeout(tick, 65);
        return;
      }

      if (!deleting) {
        deleting = true;
        timer = setTimeout(tick, 2200);
        return;
      }

      if (charIndex > 0) {
        charIndex -= 1;
        setText(full.slice(0, charIndex));
        timer = setTimeout(tick, 32);
        return;
      }

      deleting = false;
      ideaIndex += 1;
      timer = setTimeout(tick, 450);
    };

    timer = setTimeout(tick, 400);
    return () => clearTimeout(timer);
  }, [active, reduced, ideas]);

  useEffect(() => {
    if (!active) setText('');
  }, [active]);

  if (reduced) return ideas[0] || '';
  return text;
}

export default function ProposalModal({ isOpen, onClose, lang = 'bn' }) {
  const isEnglish = lang === 'en';
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ total: 0, trending: [] });
  const [themePickerOpen, setThemePickerOpen] = useState(false);

  const titleInputRef = useRef(null);
  const themeTriggerRef = useRef(null);
  const themePickerOpenRef = useRef(themePickerOpen);

  // Mirrored into a ref so the Escape handler can read it without the
  // scroll-lock effect having to re-subscribe on every toggle.
  useEffect(() => {
    themePickerOpenRef.current = themePickerOpen;
  }, [themePickerOpen]);

  // Held in a ref so the scroll-lock effect keys only on isOpen. WelcomePage
  // passes an inline arrow as onClose, which would otherwise re-run the effect
  // on every parent render.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  const placeholder = useTypewriterPlaceholder(
    isEnglish ? ENGLISH_TITLE_IDEAS : PROPOSAL_TITLE_IDEAS,
    isOpen && !submitted
  );
  const formatCount = (value) => Number(value).toLocaleString(isEnglish ? 'en-US' : 'bn-BD');

  // Real participation counters, read once per open. Hidden entirely until the
  // first proposal lands so we never render a hollow "0 জন" social proof.
  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;

    fetchProposalStats().then((next) => {
      if (!cancelled) setStats(next);
    });

    return () => { cancelled = true; };
  }, [isOpen]);

  // Keep the overlay pinned to the viewport and the page behind it still.
  //
  // createPortal(document.body) below is what makes this reliable. The
  // WelcomePage root carries .animate-fade-in, whose `animation-fill-mode:
  // forwards` keeps `transform: translateY(0)` applied after the animation ends.
  // A non-none transform turns that element into the containing block for
  // position:fixed descendants, so an in-tree fixed overlay would be laid out
  // against the full-height page box and scroll away instead of staying put.
  useEffect(() => {
    if (!isOpen) return;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;

    // Hiding the scrollbar narrows the viewport by its width, which would shove
    // the centred dialog sideways. Pad the body by the same amount to compensate.
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const handleKeyDown = (event) => {
      if (event.key !== 'Escape') return;
      // Standard disclosure order: Escape closes the open theme picker first,
      // and only a second Escape dismisses the whole modal.
      if (themePickerOpenRef.current) {
        setThemePickerOpen(false);
        themeTriggerRef.current?.focus();
        return;
      }
      onCloseRef.current();
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCategoryPick = (value) => {
    setCategory(value);
    setError('');
    // Collapse straight after the pick so the form stays compact, then hand the
    // keyboard to the title so the citizen can keep typing without re-clicking.
    setThemePickerOpen(false);
    titleInputRef.current?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (title.trim().length < TITLE_MIN) {
      setError(isEnglish
        ? `Please enter a meaningful title (at least ${TITLE_MIN} characters).`
        : `অনুগ্রহ করে একটি অর্থপূর্ণ শিরোনাম লিখুন (কমপক্ষে ${enToBn(TITLE_MIN)} অক্ষর)।`);
      return;
    }
    if (!category) {
      setError(isEnglish ? 'Please choose a category.' : 'অনুগ্রহ করে একটি বিষয় বেছে নিন।');
      return;
    }

    setSubmitting(true);
    try {
      await submitProposal({
        title: title.trim(),
        category,
        description: description.trim()
      });
      setSubmitted(true);

      // Reward the action, but only for motion-tolerant users.
      if (!prefersReducedMotion()) {
        try {
          confetti({
            particleCount: 60,
            spread: 62,
            startVelocity: 26,
            origin: { y: 0.62 },
            colors: ['#00A86B', '#F0A500', '#EF4444', '#3B82F6', '#8B5CF6']
          });
        } catch (e) {
          // Celebration is decorative; never block the confirmation on it.
        }
      }
    } catch (err) {
      console.error("Proposal submission error:", err);
      setError(isEnglish
        ? 'There was a problem submitting your proposal. Please try again later.'
        : 'জমা দিতে সমস্যা হয়েছে। অনুগ্রহ করে পরে আবার চেষ্টা করুন।');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setCategory('');
    setDescription('');
    setSubmitted(false);
    setError('');
    setThemePickerOpen(false);
    onClose();
  };

  const selectedCategory = PROPOSAL_CATEGORIES.find((c) => c.value === category) || null;
  const categoryLabel = (item) => isEnglish
    ? ENGLISH_PROPOSAL_CATEGORIES[item.value] || item.label
    : item.label;

  const showCounter = stats.total > 0;
  const showTrending = stats.trending.length > 0;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="proposal-modal-title"
      lang={isEnglish ? 'en' : 'bn'}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        background: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div
        style={{
          background: 'var(--bg-primary)',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '540px',
          maxHeight: '90vh',
          overflow: 'auto',
          padding: '2.5rem',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)',
          animation: 'slideUp 0.3s ease-out'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Layers size={22} style={{ color: 'var(--text-green)' }} />
              <span style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.08em', color: 'var(--text-green)', textTransform: 'uppercase' }} className="font-latin">
                {isEnglish ? 'Public proposal' : 'জনমত প্রস্তাব'}
              </span>
            </div>
            <h2 id="proposal-modal-title" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
              {isEnglish ? 'Suggest a topic for the next survey' : 'পরবর্তী জরিপের বিষয় প্রস্তাব করুন'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            aria-label={isEnglish ? 'Close' : 'বন্ধ করুন'}
            style={{
              background: 'var(--bg-card-hover)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              flexShrink: 0
            }}
          >
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          /* Success State */
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div className="proposal-success-mark" style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}>
              <CheckCircle size={36} style={{ color: '#10B981' }} />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              {isEnglish ? 'Your proposal was submitted successfully!' : 'আপনার প্রস্তাব সফলভাবে জমা হয়েছে!'}
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem' }}>
              {isEnglish
                ? 'Thank you! Your proposal will be reviewed. Popular proposals may be included as topics in a future public opinion survey.'
                : 'ধন্যবাদ! আপনার প্রস্তাবটি পর্যালোচনা করা হবে। জনপ্রিয় প্রস্তাবগুলো পরবর্তী জনমত জরিপের বিষয় হিসেবে অন্তর্ভুক্ত হতে পারে।'}
            </p>
            <button
              onClick={handleClose}
              className="font-latin"
              style={{
                background: 'var(--text-primary)',
                color: 'var(--bg-primary)',
                border: 'none',
                borderRadius: '999px',
                padding: '0.85rem 2rem',
                fontSize: '0.95rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {isEnglish ? 'Close' : 'বন্ধ করুন'}
            </button>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit}>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
              {isEnglish
                ? 'What important national issue should the next public opinion survey cover? Share your idea.'
                : 'জাতীয় পর্যায়ের কোন গুরুত্বপূর্ণ বিষয়ে পরবর্তী জনমত জরিপ হওয়া উচিত বলে আপনি মনে করেন? আপনার আইডিয়া জমা দিন।'}
            </p>

            {/* Real participation counter — all-time, never a fake 24h figure */}
            {showCounter && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1.25rem',
                padding: '0.6rem 0.85rem',
                borderRadius: '999px',
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                fontSize: '0.84rem',
                fontWeight: 600,
                color: 'var(--text-secondary)'
              }}>
                <Users size={16} style={{ color: '#10B981', flexShrink: 0 }} />
                <span>
                  {isEnglish ? 'So far, ' : 'এখন পর্যন্ত '}
                  <span className="font-latin" style={{ fontWeight: 800, color: '#059669' }}>{formatCount(stats.total)}</span>
                  {isEnglish ? ' citizens have proposed a topic' : ' জন নাগরিক বিষয় প্রস্তাব করেছেন'}
                </span>
              </div>
            )}

            {/* Trending — real per-category counts, so tapping picks a theme */}
            {showTrending && (
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  marginBottom: '0.55rem'
                }} className="font-latin">
                  <TrendingUp size={14} />
                  <span>{isEnglish ? 'Trending now' : 'এখন জনপ্রিয়'}</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {stats.trending.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => handleCategoryPick(t.value)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.4rem 0.75rem',
                        borderRadius: '999px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        background: category === t.value ? `${t.color}22` : 'var(--bg-card)',
                        border: `1.5px solid ${category === t.value ? t.color : 'var(--border-subtle)'}`,
                        color: category === t.value ? t.color : 'var(--text-secondary)'
                      }}
                    >
                      <PoleIcon name={t.icon} size={14} />
                      <span>{categoryLabel(t)}</span>
                      <span className="font-latin" style={{ fontSize: '0.72rem', opacity: 0.75 }}>
                        {formatCount(t.count)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Title */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label htmlFor="proposal-title" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                {isEnglish ? 'Proposal title *' : 'প্রস্তাবের শিরোনাম *'}
              </label>
              <input
                id="proposal-title"
                ref={titleInputRef}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={placeholder}
                maxLength={TITLE_MAX}
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  borderRadius: '14px',
                  border: '1.5px solid var(--border-subtle)',
                  background: 'var(--bg-card-hover)',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--text-green)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
              />
            </div>

            {/* Category — collapsed disclosure, expands into the full theme grid */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                {isEnglish ? 'Category *' : 'বিষয় *'}
              </label>

              <button
                ref={themeTriggerRef}
                type="button"
                onClick={() => setThemePickerOpen((open) => !open)}
                aria-expanded={themePickerOpen}
                aria-haspopup="listbox"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.85rem 1rem',
                  borderRadius: '14px',
                  fontSize: '0.95rem',
                  fontWeight: selectedCategory ? 700 : 500,
                  textAlign: 'left',
                  cursor: 'pointer',
                  background: 'var(--bg-card-hover)',
                  border: `1.5px solid ${selectedCategory ? selectedCategory.color : 'var(--border-subtle)'}`,
                  color: selectedCategory ? selectedCategory.color : 'var(--text-muted)'
                }}
              >
                {selectedCategory && <PoleIcon name={selectedCategory.icon} size={17} />}
                <span style={{ flex: 1, minWidth: 0 }}>
                  {selectedCategory
                    ? categoryLabel(selectedCategory)
                    : isEnglish ? 'Choose a category' : 'একটি বিষয় বেছে নিন'}
                </span>
                <ChevronDown
                  size={18}
                  aria-hidden="true"
                  style={{
                    flexShrink: 0,
                    transition: 'transform 0.3s var(--ease-smooth)',
                    transform: themePickerOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                  }}
                />
              </button>

              <div className={`proposal-theme-collapse ${themePickerOpen ? 'is-open' : ''}`}>
                <div className="proposal-theme-collapse-inner">
                  <div role="listbox" aria-label={isEnglish ? 'Choose a category' : 'বিষয় নির্বাচন'} className="proposal-pill-grid">
                    {PROPOSAL_CATEGORIES.map((c) => {
                      const selected = category === c.value;
                      return (
                        <button
                          key={c.value}
                          type="button"
                          role="option"
                          aria-selected={selected}
                          onClick={() => handleCategoryPick(c.value)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            minWidth: 0,
                            minHeight: '2.5rem',
                            padding: '0.45rem 0.7rem',
                            borderRadius: '999px',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            lineHeight: 1.3,
                            textAlign: 'left',
                            cursor: 'pointer',
                            background: selected ? `${c.color}22` : 'var(--bg-card-hover)',
                            border: `1.5px solid ${selected ? c.color : 'var(--border-subtle)'}`,
                            color: selected ? c.color : 'var(--text-secondary)'
                          }}
                        >
                          <PoleIcon name={c.icon} size={16} />
                          <span style={{ minWidth: 0 }}>{categoryLabel(c)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.4rem' }}>
                <label htmlFor="proposal-description" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {isEnglish ? 'Description (optional)' : 'বিস্তারিত বিবরণ (ঐচ্ছিক)'}
                </label>
                <span
                  className="font-latin"
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    flexShrink: 0,
                    color: description.length > DESCRIPTION_MAX * 0.9 ? '#EF4444' : 'var(--text-muted)'
                  }}
                >
                  {isEnglish ? description.length : enToBn(description.length)}/{isEnglish ? DESCRIPTION_MAX : enToBn(DESCRIPTION_MAX)}
                </span>
              </div>
              <textarea
                id="proposal-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={isEnglish
                  ? 'Why do you think a public opinion survey on this topic is important?'
                  : 'এই বিষয়ে জনমত জরিপ কেন গুরুত্বপূর্ণ বলে আপনি মনে করেন?'}
                rows={4}
                maxLength={DESCRIPTION_MAX}
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  borderRadius: '14px',
                  border: '1.5px solid var(--border-subtle)',
                  background: 'var(--bg-card-hover)',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  outline: 'none',
                  resize: 'vertical',
                  minHeight: '80px',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--text-green)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
              />
            </div>

            {/* Error */}
            {error && (
              <div role="alert" style={{
                background: 'rgba(239, 68, 68, 0.1)',
                color: '#EF4444',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontWeight: 600,
                marginBottom: '1rem'
              }}>
                {error}
              </div>
            )}

            {/* What happens next */}
            <p style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.5rem',
              fontSize: '0.82rem',
              color: 'var(--text-muted)',
              lineHeight: 1.6,
              marginBottom: '1rem',
              padding: '0.65rem 0.8rem',
              borderRadius: '12px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)'
            }}>
              <span aria-hidden="true">📌</span>
              <span>{isEnglish
                ? 'Popular topics may be considered for a future survey. No name or contact details are requested; a pseudonymous device identifier may be stored to prevent duplicate submissions.'
                : 'জনপ্রিয় বিষয় ভবিষ্যৎ জরিপে বিবেচনা করা হতে পারে। নাম বা যোগাযোগের তথ্য চাওয়া হয় না; পুনরাবৃত্ত জমা ঠেকাতে ছদ্মনামী ডিভাইস আইডি সংরক্ষিত হতে পারে।'}</span>
            </p>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="font-latin"
              style={{
                width: '100%',
                background: 'var(--text-primary)',
                color: 'var(--bg-primary)',
                border: 'none',
                borderRadius: '999px',
                padding: '1rem',
                fontSize: '1rem',
                fontWeight: 700,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.7 : 1,
                transition: 'all 0.2s ease'
              }}
            >
              {submitting ? (
                <span>{isEnglish ? 'Submitting...' : 'জমা হচ্ছে...'}</span>
              ) : (
                <>{isEnglish ? 'Submit proposal' : 'প্রস্তাব জমা দিন'} <Send size={17} /></>
              )}
            </button>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}