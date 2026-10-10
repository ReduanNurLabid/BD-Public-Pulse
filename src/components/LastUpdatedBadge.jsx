/**
 * Renders how fresh the live aggregate numbers are.
 * Purely presentational — the timestamp itself comes from Firestore's
 * serverTimestamp() on stats/aggregates.
 */
export default function LastUpdatedBadge({ lastUpdated, live = false, tone = 'default', lang = 'bn' }) {
  if (!lastUpdated) return null;

  const toDate = ts => {
    if (ts && typeof ts.toDate === 'function') return ts.toDate();
    if (ts instanceof Date) return ts;
    const parsed = new Date(ts);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };

  const date = toDate(lastUpdated);
  if (!date) return null;

  const isEnglish = lang === 'en';
  const locale = isEnglish ? 'en-GB' : 'bn-BD';
  const timeLabel = date.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit'
  });
  const fullDateLabel = date.toLocaleString(locale);

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        fontSize: '0.78rem',
        fontWeight: 600,
        color: tone === 'inverted' ? 'var(--action-section-muted)' : 'var(--text-muted)'
      }}
      className="font-latin"
      title={fullDateLabel}
    >
      {live && (
        <span
          aria-hidden="true"
          style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: '#10B981',
            boxShadow: '0 0 0 0 rgba(16,185,129,0.6)',
            animation: 'pulseDot 2s infinite'
          }}
        />
      )}
      {isEnglish ? `Last updated ${timeLabel}` : `সর্বশেষ হালনাগাদ ${timeLabel}`}
    </span>
  );
}