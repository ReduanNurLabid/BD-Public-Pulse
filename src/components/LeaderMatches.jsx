import { readableColor } from '../lib/format';
import React from 'react';
import { Users } from 'lucide-react';

const toBn = (v) => String(v).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[d]);

// First letter of the name (skipping honorifics like "ডা." / "ড.") for the avatar.
const initial = (name) => {
  const parts = String(name).split(/\s+/).filter((p) => !/\.$/.test(p));
  return Array.from(parts[0] || name)[0];
};

export default function LeaderMatches({ matches = [], lang = 'bn' }) {
  const isEnglish = lang === 'en';
  const rows = matches.filter((m) => m.share !== null);
  if (rows.length === 0) return null;
  const top = rows[0];
  const hasinaShown = rows.some((m) => m.id === 'hasina');

  return (
    <div className="glass-panel dashboard-trending-section" style={{ padding: 'clamp(1.25rem, 3vw, 1.75rem) clamp(1.1rem, 3vw, 2rem)', marginBottom: '2.5rem' }}>
      <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
        <Users size={21} color="var(--accent-green)" />
        <span>{isEnglish ? 'Which current leader thinks most like you?' : 'বর্তমান নেতাদের মধ্যে কার সাথে আপনার মিল বেশি?'}</span>
      </h3>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.6 }}>
        {isEnglish
          ? <>Closest to your views: <strong style={{ color: readableColor(top.color) }}>{top.nameEn}</strong>. Together these add up to 100%.</>
          : <>আপনার মতের সবচেয়ে কাছে <strong style={{ color: readableColor(top.color) }}>{top.nameBn}</strong>। এঁদের মিল মিলিয়ে মোট ১০০%।</>}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
        {rows.map((m, i) => (
          <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span
              aria-hidden="true"
              style={{
                width: i === 0 ? '52px' : '42px', height: i === 0 ? '52px' : '42px', borderRadius: '50%', flexShrink: 0,
                display: 'grid', placeItems: 'center', overflow: 'hidden',
                background: m.color, color: '#FFFFFF',
                border: `${i === 0 ? 3 : 2}px solid ${m.color}`,
                fontWeight: 800, fontSize: '1rem'
              }}
            >
              {m.photo ? (
                <img
                  src={m.photo}
                  alt=""
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%' }}
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              ) : initial(isEnglish ? m.nameEn : m.nameBn)}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', alignItems: 'baseline' }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{isEnglish ? m.nameEn : m.nameBn}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                    {m.agreeOn && <span>{isEnglish ? 'Agree: ' : 'একমত: '}<strong style={{ color: 'var(--text-secondary)' }}>{isEnglish ? m.agreeOn.topicEn : m.agreeOn.topicBn}</strong></span>}
                    {m.agreeOn && m.disagreeOn && ' · '}
                    {m.disagreeOn && <span>{isEnglish ? 'Disagree: ' : 'দ্বিমত: '}<strong style={{ color: 'var(--text-secondary)' }}>{isEnglish ? m.disagreeOn.topicEn : m.disagreeOn.topicBn}</strong></span>}
                  </div>
                </div>
                <span style={{ fontWeight: 800, color: readableColor(m.color), whiteSpace: 'nowrap' }}>{isEnglish ? m.share : toBn(m.share)}%</span>
              </div>
              <div style={{ height: '7px', background: 'var(--data-track)', borderRadius: '999px', overflow: 'hidden', marginTop: '0.35rem' }}>
                <div style={{ width: `${m.share}%`, height: '100%', background: m.color, borderRadius: '999px' }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '1.1rem', lineHeight: 1.55 }}>
        {isEnglish
          ? 'Approximate. Each leader\'s answers are our estimate from party programmes, public statements and government decisions; the full list is on the methodology page. ' + (hasinaShown ? 'Sheikh Hasina is placed mainly by what her government did in office. ' : '') + 'This is not an endorsement by any leader.'
          : 'আনুমানিক। প্রত্যেক নেতার উত্তর আমাদের অনুমান — দলীয় কর্মসূচি, প্রকাশ্য বক্তব্য ও সরকারি সিদ্ধান্ত থেকে। পুরো তালিকা “কীভাবে হিসাব হয়” পাতায় আছে। ' + (hasinaShown ? 'শেখ হাসিনার অবস্থান মূলত তাঁর সরকারের কাজের ভিত্তিতে ধরা। ' : '') + 'কোনো নেতা এই জরিপের সাথে যুক্ত নন।'}
      </p>
    </div>
  );
}
