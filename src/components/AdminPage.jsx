import React, { useCallback, useEffect, useState } from 'react';
import {
  adminSignIn, adminSignOut, closeIssue, createIssue, deleteDraftIssue, deleteInboxItem, fetchAllResponses,
  fetchInbox, fetchIssues, fetchResponses, publishIssue, RESPONSES_PAGE, setInboxStatus, watchAdmin
} from '../lib/adminApi';
import AdminOverview from './AdminOverview';

const TABS = [
  ['overview', 'সারসংক্ষেপ'],
  ['issues', 'সাপ্তাহিক প্রশ্ন'],
  ['responses', 'উত্তরসমূহ'],
  ['proposals', 'প্রস্তাব'],
  ['feedback', 'মতামত']
];

const panel = { padding: '1.25rem', marginBottom: '1rem' };
const muted = { color: 'var(--text-muted)', fontSize: '0.88rem' };
const smallButton = { padding: '0.4rem 0.9rem', minHeight: '38px', fontSize: '0.9rem' };
const field = {
  width: '100%', boxSizing: 'border-box', padding: '0.7rem 0.9rem', borderRadius: '10px', fontFamily: 'inherit', fontSize: '1rem',
  color: 'var(--text-primary)', background: 'var(--bg-card)', border: '1.5px solid var(--border-medium)'
};

const when = (value) => {
  const date = value?.toDate ? value.toDate() : value ? new Date(value) : null;
  return date ? date.toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }) : '—';
};

function useLoad(loader) {
  const [items, setItems] = useState(null);
  const [error, setError] = useState('');
  const reload = useCallback(async () => {
    setError('');
    try {
      setItems(await loader());
    } catch (err) {
      console.error(err);
      setError('লোড করা যায়নি। আপনার অ্যাডমিন অনুমতি ও ইন্টারনেট দেখুন।');
    }
  }, [loader]);
  useEffect(() => { reload(); }, [reload]);
  return { items, error, reload };
}

function IssuesTab({ draftFromProposal, clearDraft }) {
  const loader = useCallback(() => fetchIssues(), []);
  const { items, error, reload } = useLoad(loader);
  const [question, setQuestion] = useState('');
  const [questionEn, setQuestionEn] = useState('');
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (draftFromProposal) {
      setQuestion(draftFromProposal);
      clearDraft();
    }
  }, [draftFromProposal, clearDraft]);

  const run = async (action) => {
    setBusy(true);
    setNote('');
    try {
      await action();
      await reload();
    } catch (err) {
      console.error(err);
      setNote('কাজটি হয়নি। আবার চেষ্টা করুন।');
    } finally {
      setBusy(false);
    }
  };

  const save = () => run(async () => {
    await createIssue({ question: question.trim(), questionEn: questionEn.trim() });
    setQuestion('');
    setQuestionEn('');
  });

  return (
    <>
      <div className="glass-panel" style={panel}>
        <h2 style={{ fontSize: '1.15rem', margin: '0 0 0.75rem' }}>নতুন প্রশ্ন</h2>
        <textarea rows={3} maxLength={200} style={field} placeholder="বাংলায় প্রশ্ন লিখুন" aria-label="বাংলায় প্রশ্ন" value={question} onChange={(e) => setQuestion(e.target.value)} />
        <input maxLength={200} style={{ ...field, marginTop: '0.6rem' }} placeholder="English version (optional)" aria-label="English version" value={questionEn} onChange={(e) => setQuestionEn(e.target.value)} />
        <button type="button" className="btn-primary" style={{ marginTop: '0.75rem' }} disabled={busy || question.trim().length < 10} onClick={save}>খসড়া সেভ করুন</button>
        {note && <p role="alert" style={{ margin: '0.6rem 0 0', fontWeight: 700 }}>{note}</p>}
      </div>
      {error && <p role="alert">{error}</p>}
      {items === null && !error && <p style={muted}>লোড হচ্ছে…</p>}
      {items?.length === 0 && <p style={muted}>এখনো কোনো প্রশ্ন নেই।</p>}
      {items?.map((issue) => {
        const { agree = 0, neutral = 0, disagree = 0 } = issue.counts || {};
        return (
          <div key={issue.id} className="glass-panel" style={panel}>
            <div style={{ fontWeight: 800, marginBottom: '0.25rem' }}>
              {{ draft: 'খসড়া', live: 'চলছে', closed: 'শেষ' }[issue.status]}
            </div>
            <p style={{ margin: '0 0 0.4rem', fontSize: '1.05rem', fontWeight: 600 }}>{issue.question}</p>
            <div style={muted}>একমত {agree} · নিরপেক্ষ {neutral} · দ্বিমত {disagree} · মোট {agree + neutral + disagree} · তৈরি {when(issue.createdAt)}</div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
              {issue.status !== 'live' && (
                <button type="button" className="btn-primary" style={smallButton} disabled={busy} onClick={() => { if (window.confirm('এই প্রশ্নটি সবার জন্য প্রকাশ করবেন? এখন যেটা চলছে সেটা বন্ধ হবে।')) run(() => publishIssue(issue.id)); }}>প্রকাশ করুন</button>
              )}
              {issue.status === 'live' && (
                <button type="button" className="btn-secondary" style={smallButton} disabled={busy} onClick={() => run(() => closeIssue(issue.id))}>বন্ধ করুন</button>
              )}
              {issue.status === 'draft' && (
                <button type="button" className="btn-secondary" style={smallButton} disabled={busy} onClick={() => { if (window.confirm('খসড়াটি মুছবেন?')) run(() => deleteDraftIssue(issue.id)); }}>মুছুন</button>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}

const CSV_FIELDS = ['sessionId', 'clientTimestamp', 'primaryBloc', 'quadrant', 'durationSeconds', 'modelVersion', 'questionSetVersion'];

function ResponsesTab() {
  const [items, setItems] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');

  const loadMore = useCallback(async (from) => {
    setBusy(true);
    setError('');
    try {
      const page = await fetchResponses(from);
      setItems((prev) => (from ? [...prev, ...page.items] : page.items));
      setCursor(page.cursor);
      setDone(page.items.length < RESPONSES_PAGE);
    } catch (err) {
      console.error(err);
      setError('উত্তর লোড করা যায়নি।');
    } finally {
      setBusy(false);
    }
  }, []);
  useEffect(() => { loadMore(null); }, [loadMore]);

  const exportCsv = async () => {
    setBusy(true);
    try {
      const all = await fetchAllResponses();
      const quote = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;
      const csv = [CSV_FIELDS.join(','), ...all.map((row) => CSV_FIELDS.map((key) => quote(row[key])).join(','))].join('\n');
      const url = URL.createObjectURL(new Blob([`﻿${csv}`], { type: 'text/csv;charset=utf-8' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'bd_compass_responses.csv';
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      console.error(err);
      setError('এক্সপোর্ট করা যায়নি।');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
        <span style={muted}>{items.length} টি দেখানো হচ্ছে</span>
        <button type="button" className="btn-secondary" style={smallButton} disabled={busy} onClick={exportCsv}>CSV ডাউনলোড</button>
      </div>
      {error && <p role="alert">{error}</p>}
      <div className="glass-panel" style={{ overflowX: 'auto', marginBottom: '1rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-subtle)' }}>
              {['সময়', 'ধারা', 'অবস্থান', 'সময় লেগেছে'].map((h) => <th key={h} style={{ padding: '0.7rem', whiteSpace: 'nowrap' }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <tr key={row.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '0.6rem 0.7rem', whiteSpace: 'nowrap' }}>{when(row.serverCreatedAt || row.clientTimestamp)}</td>
                <td style={{ padding: '0.6rem 0.7rem' }}>{row.primaryBloc}</td>
                <td style={{ padding: '0.6rem 0.7rem' }}>{row.quadrant}</td>
                <td style={{ padding: '0.6rem 0.7rem' }}>{row.durationSeconds ? `${Math.round(row.durationSeconds)}s` : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!busy && items.length === 0 && !error && <p style={{ ...muted, padding: '1rem' }}>এখনো কোনো উত্তর নেই।</p>}
      </div>
      {!done && <button type="button" className="btn-secondary" disabled={busy} onClick={() => loadMore(cursor)}>আরও দেখুন</button>}
    </>
  );
}

function InboxTab({ name, onUseAsIssue }) {
  const loader = useCallback(() => fetchInbox(name), [name]);
  const { items, error, reload } = useLoad(loader);
  const act = async (action) => {
    try {
      await action();
      await reload();
    } catch (err) {
      console.error(err);
      window.alert('কাজটি হয়নি।');
    }
  };

  return (
    <>
      {error && <p role="alert">{error}</p>}
      {items === null && !error && <p style={muted}>লোড হচ্ছে…</p>}
      {items?.length === 0 && <p style={muted}>কিছু নেই।</p>}
      {items?.map((item) => (
        <div key={item.id} className="glass-panel" style={panel}>
          {item.title && <div style={{ fontWeight: 800, marginBottom: '0.25rem' }}>{item.title}</div>}
          <p style={{ margin: '0 0 0.4rem', whiteSpace: 'pre-wrap' }}>{item.message || item.description}</p>
          <div style={muted}>{item.status} · {item.category ? `${item.category} · ` : ''}{when(item.createdAt)}</div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
            {onUseAsIssue && <button type="button" className="btn-primary" style={smallButton} onClick={() => onUseAsIssue(item.title)}>প্রশ্ন বানান</button>}
            {item.status === 'pending' && <button type="button" className="btn-secondary" style={smallButton} onClick={() => act(() => setInboxStatus(name, item.id, 'reviewed'))}>দেখা হয়েছে</button>}
            <button type="button" className="btn-secondary" style={smallButton} onClick={() => { if (window.confirm('স্থায়ীভাবে মুছবেন?')) act(() => deleteInboxItem(name, item.id)); }}>মুছুন</button>
          </div>
        </div>
      ))}
    </>
  );
}

export default function AdminPage() {
  const [session, setSession] = useState(undefined);
  const [tab, setTab] = useState('overview');
  const [draft, setDraft] = useState('');
  const [signInError, setSignInError] = useState('');
  const clearDraft = useCallback(() => setDraft(''), []);

  useEffect(() => {
    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex';
    document.head.appendChild(robots);
    const stop = watchAdmin(setSession);
    return () => { stop(); robots.remove(); };
  }, []);

  const signIn = async () => {
    setSignInError('');
    try {
      await adminSignIn();
    } catch (err) {
      console.error(err);
      setSignInError('সাইন ইন করা যায়নি।');
    }
  };

  const shell = (children) => (
    <main style={{ maxWidth: '1120px', margin: '0 auto', padding: '2rem 1rem 4rem', minHeight: '100vh', boxSizing: 'border-box', color: 'var(--text-primary)' }}>
      <h1 style={{ fontSize: '1.6rem', margin: '0 0 1.25rem' }}>অ্যাডমিন</h1>
      {children}
    </main>
  );

  if (session === undefined) return shell(<p style={muted}>লোড হচ্ছে…</p>);
  if (!session.user) {
    return shell(
      <>
        <button type="button" className="btn-primary" onClick={signIn}>Google দিয়ে সাইন ইন</button>
        {signInError && <p role="alert">{signInError}</p>}
      </>
    );
  }
  if (!session.isAdmin) {
    return shell(
      <>
        <p>এই অ্যাকাউন্টের অ্যাডমিন অনুমতি নেই।</p>
        <button type="button" className="btn-secondary" onClick={adminSignOut}>সাইন আউট</button>
      </>
    );
  }

  return shell(
    <>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1.25rem' }}>
        {TABS.map(([key, label]) => (
          <button key={key} type="button" className={tab === key ? 'btn-primary' : 'btn-secondary'} style={tab === key ? { ...smallButton, background: 'var(--text-primary)', color: 'var(--bg-card)' } : smallButton} aria-pressed={tab === key} onClick={() => setTab(key)}>{label}</button>
        ))}
        <button type="button" className="btn-secondary" style={{ ...smallButton, marginLeft: 'auto' }} onClick={adminSignOut}>সাইন আউট</button>
      </div>
      {tab === 'overview' && <AdminOverview onOpenTab={setTab} />}
      {tab === 'issues' && <IssuesTab draftFromProposal={draft} clearDraft={clearDraft} />}
      {tab === 'responses' && <ResponsesTab />}
      {tab === 'proposals' && <InboxTab name="proposals" onUseAsIssue={(title) => { setDraft(title); setTab('issues'); }} />}
      {tab === 'feedback' && <InboxTab name="feedback" />}
    </>
  );
}
