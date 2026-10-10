/**
 * Time of the most recent successfully aggregated submission.
 *
 * Reads stats/aggregates -> lastUpdated, which saveAssessmentResponse stamps with
 * serverTimestamp() in the same atomic update that records the response, so it
 * marks the last submission that actually landed in the aggregate document.
 *
 * Renders nothing when no submission has been recorded yet.
 */
export default function LastSubmissionTime({ lastUpdated, lang }) {
  if (!lastUpdated) return null;

  const toDate = ts => {
    if (ts && typeof ts.toDate === 'function') return ts.toDate();
    if (ts instanceof Date) return ts;
    const parsed = new Date(ts);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };

  const date = toDate(lastUpdated);
  if (!date) return null;

  const timeLabel = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        gap: '0.3rem',
        marginTop: '0.5rem',
        fontSize: '0.78rem',
        fontWeight: 600,
        color: 'var(--text-muted)'
      }}
      title={date.toLocaleString()}
    >
      <span>{lang === 'en' ? 'Last successful submission' : 'সর্বশেষ সফল জমা'}</span>
      <strong className="font-latin" style={{ color: '#D97706' }}>{timeLabel}</strong>
    </span>
  );
}