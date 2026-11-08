import React, { useEffect, useState } from 'react';
import { fetchOverview } from '../lib/adminApi';
import { BLOC_PROFILES } from '../data/questions';

const ANALYTICS_URL = 'https://console.firebase.google.com/project/bd-political-compass/analytics';
const DAY_MS = 86400000;
const startOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
const timeOf = (row) => {
  const value = row.serverCreatedAt?.toDate ? row.serverCreatedAt.toDate() : row.clientTimestamp ? new Date(row.clientTimestamp) : null;
  return value && !Number.isNaN(value.getTime()) ? value.getTime() : null;
};
const tally = (rows, pick) => {
  const counts = new Map();
  rows.forEach((row) => {
    const key = pick(row);
    if (key) counts.set(key, (counts.get(key) || 0) + 1);
  });
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
};

function Tile({ label, value, note }) {
  return (
    <div className="glass-panel" style={{ padding: '1rem 1.1rem' }}>
      <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{label}</div>
      <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.3 }}>{value}</div>
      {note && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{note}</div>}
    </div>
  );
}

function Bars({ title, items, total }) {
  const max = Math.max(1, ...items.map(([, count]) => count));
  return (
    <div className="glass-panel" style={{ padding: '1.1rem' }}>
      <h3 style={{ fontSize: '1rem', margin: '0 0 0.75rem', color: 'var(--text-primary)' }}>{title}</h3>
      {items.length === 0 && <p style={{ margin: 0, color: 'var(--text-muted)' }}>এখনো তথ্য নেই।</p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {items.map(([label, count]) => (
          <div key={label} title={`${label}: ${count}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
              <span>{label}</span>
              <span style={{ whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>{count} · {total ? Math.round((count / total) * 100) : 0}%</span>
            </div>
            <div style={{ height: '8px', borderRadius: '4px', background: 'var(--data-track)', overflow: 'hidden' }}>
              <div style={{ width: `${(count / max) * 100}%`, height: '100%', borderRadius: '4px', background: 'var(--accent-green)' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DailyChart({ days }) {
  const max = Math.max(1, ...days.map((day) => day.count));
  const fmt = (time) => new Date(time).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  return (
    <div className="glass-panel" style={{ padding: '1.1rem', marginBottom: '1rem' }}>
      <h3 style={{ fontSize: '1rem', margin: '0 0 0.9rem', color: 'var(--text-primary)' }}>গত ১৪ দিনে প্রতিদিনের উত্তর</h3>
      <div role="img" aria-label={days.map((day) => `${fmt(day.time)}: ${day.count}`).join(', ')} style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '130px', borderBottom: '1px solid var(--border-medium)' }}>
        {days.map((day) => (
          <div key={day.time} title={`${fmt(day.time)}: ${day.count}`} style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', minWidth: 0 }}>
            {day.count > 0 && <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{day.count}</span>}
            <div style={{ width: '100%', maxWidth: '26px', height: `${(day.count / max) * 100}px`, background: 'var(--accent-green)', borderRadius: '4px 4px 0 0' }} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
        <span>{fmt(days[0].time)}</span>
        <span>{fmt(days[days.length - 1].time)}</span>
      </div>
    </div>
  );
}

const QUADRANTS = {
  libertarian_left: 'উদার-বাম', libertarian_right: 'উদার-ডান', authoritarian_left: 'শৃঙ্খলা-বাম', authoritarian_right: 'শৃঙ্খলা-ডান', centrist: 'মধ্যপন্থী'
};
const LENGTHS = { short: 'ছোট (১৬)', medium: 'সাধারণ (২৪)', long: 'পূর্ণ (৩২)' };

export default function AdminOverview({ onOpenTab }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    fetchOverview()
      .then((result) => { if (active) setData(result); })
      .catch((err) => {
        console.error(err);
        if (active) setError('তথ্য লোড করা যায়নি। নতুন নিরাপত্তা নিয়ম ডিপ্লয় হয়েছে কি না দেখুন।');
      });
    return () => { active = false; };
  }, []);

  if (error) return <p role="alert">{error}</p>;
  if (!data) return <p style={{ color: 'var(--text-muted)' }}>লোড হচ্ছে…</p>;

  const { responses, proposals, feedback, issues } = data;
  const today = startOfDay(new Date());
  const times = responses.map(timeOf).filter(Boolean);
  const days = Array.from({ length: 14 }, (_, index) => {
    const time = new Date(today - (13 - index) * DAY_MS + DAY_MS / 2);
    const start = startOfDay(time);
    return { time: start, count: times.filter((t) => t >= start && t < start + DAY_MS).length };
  });
  const lastWeek = days.slice(-7).reduce((sum, day) => sum + day.count, 0);
  const durations = responses.map((row) => row.durationSeconds).filter((v) => typeof v === 'number').sort((a, b) => a - b);
  const median = durations.length ? Math.round(durations[Math.floor(durations.length / 2)] / 60 * 10) / 10 : null;
  const reliable = responses.filter((row) => row.quality?.reliable).length;
  const gaveDemographics = responses.filter((row) => row.demographics).length;
  const live = issues.find((issue) => issue.status === 'live');
  const liveVotes = live ? Object.values(live.counts || {}).reduce((sum, value) => sum + value, 0) : 0;
  const pendingProposals = proposals.filter((item) => item.status === 'pending').length;
  const pendingFeedback = feedback.filter((item) => item.status === 'pending').length;
  const total = responses.length;
  const percent = (value) => (total ? `${Math.round((value / total) * 100)}%` : '—');
  const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.75rem', marginBottom: '1rem' };
  const chartGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem', marginBottom: '1rem' };

  return (
    <>
      <div style={grid}>
        <Tile label="মোট উত্তর" value={total} />
        <Tile label="আজ" value={days[13].count} />
        <Tile label="গত ৭ দিন" value={lastWeek} />
        <Tile label="মাঝামাঝি সময়" value={median === null ? '—' : `${median} মি.`} />
        <Tile label="নির্ভরযোগ্য উত্তর" value={percent(reliable)} note="তাড়াহুড়ো বা একই উত্তর বাদে" />
        <Tile label="বয়স-এলাকা দিয়েছেন" value={percent(gaveDemographics)} />
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <button type="button" className="btn-secondary" style={{ padding: '0.4rem 0.9rem', minHeight: '38px', fontSize: '0.9rem' }} onClick={() => onOpenTab('issues')}>
          {live ? `চলমান ভোট: ${liveVotes} জন` : 'কোনো ভোট চলছে না'}
        </button>
        <button type="button" className="btn-secondary" style={{ padding: '0.4rem 0.9rem', minHeight: '38px', fontSize: '0.9rem' }} onClick={() => onOpenTab('proposals')}>নতুন প্রস্তাব: {pendingProposals}</button>
        <button type="button" className="btn-secondary" style={{ padding: '0.4rem 0.9rem', minHeight: '38px', fontSize: '0.9rem' }} onClick={() => onOpenTab('feedback')}>নতুন মতামত: {pendingFeedback}</button>
      </div>

      <DailyChart days={days} />

      <div style={chartGrid}>
        <Bars title="সবচেয়ে কাছের ধারা" total={total} items={tally(responses, (row) => BLOC_PROFILES[row.primaryBloc]?.name || (row.primaryBloc === 'NoMatch' ? 'স্পষ্ট মিল নেই' : row.primaryBloc === 'Mixed' ? 'মিশ্র' : row.primaryBloc))} />
        <Bars title="কম্পাসের অবস্থান" total={total} items={tally(responses, (row) => QUADRANTS[row.quadrant] || row.quadrant)} />
        <Bars title="কুইজের দৈর্ঘ্য" total={total} items={tally(responses, (row) => LENGTHS[row.quizLength] || 'পুরোনো সংস্করণ')} />
        <Bars title="বিভাগ" total={gaveDemographics} items={tally(responses, (row) => row.demographics?.division)} />
        <Bars title="বয়স" total={gaveDemographics} items={tally(responses, (row) => row.demographics?.ageRange)} />
      </div>

      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
        কতজন সাইটে এলেন, কোথা থেকে এলেন, তা <a href={ANALYTICS_URL} target="_blank" rel="noreferrer" style={{ color: 'var(--text-primary)', fontWeight: 700 }}>Firebase Analytics</a>-এ দেখুন।
      </p>
    </>
  );
}
