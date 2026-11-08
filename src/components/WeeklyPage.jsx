import React, { useEffect, useState } from 'react';
import WeeklyIssueCard from './WeeklyIssueCard';
import { fetchClosedIssues, VOTE_CHOICES, VOTE_LABELS } from '../lib/weeklyIssues';
import { toBnDigits } from '../lib/format';

export default function WeeklyPage({ lang = 'bn' }) {
  const isEnglish = lang === 'en';
  const key = isEnglish ? 'en' : 'bn';
  const num = (value) => (isEnglish ? String(value) : toBnDigits(value));
  const [past, setPast] = useState([]);

  useEffect(() => {
    let active = true;
    fetchClosedIssues()
      .then((items) => { if (active) setPast(items); })
      .catch((err) => console.warn('Past questions could not load:', err));
    return () => { active = false; };
  }, []);

  return (
    <div style={{ width: '100%', maxWidth: '860px', margin: '0 auto', padding: '2.5rem 1rem 4rem', boxSizing: 'border-box' }}>
      <h1 style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.5rem' }}>
        {isEnglish ? 'Weekly vote' : 'সাপ্তাহিক ভোট'}
      </h1>
      <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--text-secondary)', margin: 0 }}>
        {isEnglish
          ? 'One current question each week. It is separate from the quiz and does not change your quiz result.'
          : 'প্রতি সপ্তাহে চলতি বিষয়ে একটি প্রশ্ন। এটা কুইজ থেকে আলাদা, আপনার কুইজের ফলাফলে এর কোনো প্রভাব নেই।'}
      </p>

      <WeeklyIssueCard lang={lang} embedded showEmpty />

      {past.length > 0 && (
        <section style={{ marginTop: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 1rem' }}>
            {isEnglish ? 'Earlier questions' : 'আগের প্রশ্নগুলো'}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {past.map((issue) => {
              const total = VOTE_CHOICES.reduce((sum, choice) => sum + (issue.counts?.[choice] || 0), 0);
              return (
                <div key={issue.id} className="glass-panel" style={{ padding: '1.25rem' }}>
                  <p style={{ margin: '0 0 0.6rem', fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                    {isEnglish && issue.questionEn ? issue.questionEn : issue.question}
                  </p>
                  <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                    {VOTE_CHOICES.map((choice) => `${VOTE_LABELS[choice][key]} ${num(total ? Math.round(((issue.counts?.[choice] || 0) / total) * 100) : 0)}%`).join(' · ')}
                    {' · '}
                    {isEnglish ? `${num(total)} votes` : `${num(total)} জনের ভোট`}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
