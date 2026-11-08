import React, { useEffect, useState } from 'react';
import { castVote, fetchLiveIssue, fetchMyVote, VOTE_CHOICES } from '../lib/weeklyIssues';
import { toBnDigits } from '../lib/format';

const LABELS = {
  agree: { bn: 'একমত', en: 'Agree', token: '--data-agree' },
  neutral: { bn: 'নিরপেক্ষ', en: 'Neutral', token: '--data-neutral' },
  disagree: { bn: 'দ্বিমত', en: 'Disagree', token: '--data-disagree' }
};

export default function WeeklyIssueCard({ lang = 'bn', embedded = false, showEmpty = false, onSeeAll }) {
  const isEnglish = lang === 'en';
  const [issue, setIssue] = useState(null);
  const [myVote, setMyVote] = useState(null);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);
  const num = (value) => (isEnglish ? String(value) : toBnDigits(value));

  useEffect(() => {
    let active = true;
    fetchLiveIssue()
      .then(async (live) => {
        if (!active || !live) return;
        setIssue(live);
        const vote = await fetchMyVote(live.id).catch(() => null);
        if (active) setMyVote(vote);
      })
      .catch((err) => console.warn('Weekly question could not load:', err))
      .finally(() => { if (active) setLoaded(true); });
    return () => { active = false; };
  }, []);

  if (!issue) {
    if (!showEmpty || !loaded) return null;
    return (
      <div className="glass-panel" style={{ padding: '1.5rem', marginTop: '1.5rem', color: 'var(--text-secondary)' }}>
        {isEnglish ? 'No vote is running right now. The next question is coming soon.' : 'এই মুহূর্তে কোনো ভোট চলছে না। পরের প্রশ্ন শিগগিরই আসছে।'}
      </div>
    );
  }

  const vote = async (choice) => {
    if (voting) return;
    setVoting(true);
    setError('');
    try {
      await castVote(issue.id, choice);
      setMyVote(choice);
      setIssue((prev) => ({ ...prev, counts: { ...prev.counts, [choice]: (prev.counts?.[choice] || 0) + 1 } }));
    } catch (err) {
      console.error('Vote failed:', err);
      setError(isEnglish ? 'Your vote could not be saved. Please try again.' : 'ভোটটি জমা হয়নি। আবার চেষ্টা করুন।');
    } finally {
      setVoting(false);
    }
  };

  const total = VOTE_CHOICES.reduce((sum, key) => sum + (issue.counts?.[key] || 0), 0);
  const question = isEnglish && issue.questionEn ? issue.questionEn : issue.question;

  return (
    <section style={embedded ? { marginTop: '1.5rem' } : { width: '100%', boxSizing: 'border-box', maxWidth: '860px', margin: '0 auto', padding: '3rem 1rem 1rem' }}>
      <div className="glass-panel dashboard-trending-section" style={{ padding: 'clamp(1.5rem, 4vw, 2.5rem)' }}>
        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
          {isEnglish ? 'This week’s question' : 'এই সপ্তাহের প্রশ্ন'}
        </div>
        <h2 style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: 800, lineHeight: 1.35, color: 'var(--text-primary)', margin: '0 0 1.5rem' }}>
          {question}
        </h2>

        {myVote ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {VOTE_CHOICES.map((key) => {
              const share = total ? Math.round(((issue.counts?.[key] || 0) / total) * 100) : 0;
              return (
                <div key={key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                    <span>{isEnglish ? LABELS[key].en : LABELS[key].bn}{myVote === key ? (isEnglish ? ' (your vote)' : ' (আপনার ভোট)') : ''}</span>
                    <span>{num(share)}%</span>
                  </div>
                  <div style={{ height: '10px', borderRadius: '999px', overflow: 'hidden', background: 'var(--data-track)' }}>
                    <div style={{ width: `${share}%`, height: '100%', background: `var(${LABELS[key].token})` }} />
                  </div>
                </div>
              );
            })}
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              {isEnglish ? `${num(total)} votes so far. This shows participants only.` : `এ পর্যন্ত ${num(total)} জনের ভোট। এটা শুধু অংশগ্রহণকারীদের মত।`}
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
            {VOTE_CHOICES.map((key) => (
              <button key={key} type="button" className="btn-primary" disabled={voting} onClick={() => vote(key)} style={{ minHeight: '52px' }}>
                {isEnglish ? LABELS[key].en : LABELS[key].bn}
              </button>
            ))}
          </div>
        )}
        {onSeeAll && (
          <button type="button" onClick={onSeeAll} style={{ marginTop: '1rem', padding: 0, minHeight: '44px', background: 'none', border: 0, font: 'inherit', fontWeight: 700, textDecoration: 'underline', color: 'var(--text-primary)', cursor: 'pointer' }}>
            {isEnglish ? 'See earlier questions' : 'আগের প্রশ্নগুলো দেখুন'}
          </button>
        )}
        {error && <p role="alert" style={{ margin: '0.75rem 0 0', fontWeight: 700, color: 'var(--text-primary)' }}>{error}</p>}
      </div>
    </section>
  );
}
