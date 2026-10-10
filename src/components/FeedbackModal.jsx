import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Send, CheckCircle, MessageSquare } from 'lucide-react';
import { submitFeedback } from '../lib/firebase';

const FEEDBACK_MAX = 1000;

const enToBn = (num) => String(num).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[d]);

export default function FeedbackModal({ isOpen, onClose, lang = 'bn' }) {
  const isEnglish = lang === 'en';
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const messageInputRef = useRef(null);

  // Held in a ref so the scroll-lock effect keys only on isOpen.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  // Keep the overlay pinned to the viewport and the page behind it still.
  useEffect(() => {
    if (!isOpen) return;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onCloseRef.current();
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    // Focus input on open
    setTimeout(() => {
      messageInputRef.current?.focus();
    }, 100);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (message.trim().length < 5) {
      setError(isEnglish
        ? `Please enter at least 5 characters.`
        : `অনুগ্রহ করে কমপক্ষে ৫টি অক্ষর লিখুন।`);
      return;
    }

    setSubmitting(true);
    try {
      await submitFeedback({ message: message.trim() });
      setSubmitted(true);
    } catch (err) {
      console.error("Feedback submission error:", err);
      setError(isEnglish
        ? 'There was a problem submitting your feedback. Please try again later.'
        : 'জমা দিতে সমস্যা হয়েছে। অনুগ্রহ করে পরে আবার চেষ্টা করুন।');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setMessage('');
    setSubmitted(false);
    setError('');
    onClose();
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-modal-title"
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
              <MessageSquare size={22} style={{ color: 'var(--text-blue)' }} />
              <span style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.08em', color: 'var(--text-blue)', textTransform: 'uppercase' }} className="font-latin">
                {isEnglish ? 'Feedback' : 'মতামত'}
              </span>
            </div>
            <h2 id="feedback-modal-title" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
              {isEnglish ? 'Suggest an improvement' : 'উন্নয়নের জন্য মতামত দিন'}
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
              background: 'rgba(59, 130, 246, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}>
              <CheckCircle size={36} style={{ color: '#3B82F6' }} />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              {isEnglish ? 'Thank you for your feedback!' : 'আপনার মতামতের জন্য ধন্যবাদ!'}
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem' }}>
              {isEnglish
                ? 'We appreciate your contribution to making the Political Compass better and more accurate.'
                : 'পলিটিকাল কম্পাসকে আরও উন্নত ও নির্ভুল করার ক্ষেত্রে আপনার অবদানের জন্য আমরা কৃতজ্ঞ।'}
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
                ? 'Did you find a biased question, an inaccurate profile, or something else that can be improved?'
                : 'আপনি কি কোনো প্রশ্নে পক্ষপাত, প্রোফাইলে অসামঞ্জস্য বা অন্য কোনো সমস্যা খুঁজে পেয়েছেন যা উন্নত করা যায়?'}
            </p>

            {/* Description */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.4rem' }}>
                <label htmlFor="feedback-message" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {isEnglish ? 'Your feedback *' : 'আপনার মতামত *'}
                </label>
                <span
                  className="font-latin"
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    flexShrink: 0,
                    color: message.length > FEEDBACK_MAX * 0.9 ? '#EF4444' : 'var(--text-muted)'
                  }}
                >
                  {isEnglish ? message.length : enToBn(message.length)}/{isEnglish ? FEEDBACK_MAX : enToBn(FEEDBACK_MAX)}
                </span>
              </div>
              <textarea
                id="feedback-message"
                ref={messageInputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={isEnglish
                  ? 'Please describe the issue or suggestion in detail...'
                  : 'অনুগ্রহ করে সমস্যা বা পরামর্শটি বিস্তারিত লিখুন...'}
                rows={6}
                maxLength={FEEDBACK_MAX}
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
                  minHeight: '120px',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--text-blue)'}
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
                <>{isEnglish ? 'Submit feedback' : 'মতামত জমা দিন'} <Send size={17} /></>
              )}
            </button>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}
