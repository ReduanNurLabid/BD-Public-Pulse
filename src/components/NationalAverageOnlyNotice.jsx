/**
 * Banner shown above charts that can only ever render the national average.
 *
 * The single O(1) stats/aggregates document holds no per-demographic
 * breakdown, so these charts cannot honour a demographic filter. Silently
 * ignoring the selection would misrepresent the numbers, so we say so instead.
 */
export default function NationalAverageOnlyNotice({ active, label }) {
  if (!active) return null;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.45rem',
        padding: '0.4rem 0.75rem',
        borderRadius: '999px',
        background: 'rgba(217, 119, 6, 0.1)',
        border: '1px solid rgba(217, 119, 6, 0.35)',
        color: '#D97706',
        fontSize: '0.78rem',
        fontWeight: 700
      }}
      role="status"
    >
      <span aria-hidden="true">ℹ</span>
      <span>{label}</span>
    </div>
  );
}