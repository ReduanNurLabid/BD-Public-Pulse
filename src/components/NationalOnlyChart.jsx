/**
 * Shared UI for charts that can only show the national average.
 *
 * Both the 8 Thematic Axes and the Wedge Issues read from the single O(1)
 * stats/aggregates document, which stores one national running total and no
 * per-demographic breakdown. Rather than silently ignoring a demographic
 * filter, these charts label themselves as national-only.
 */
import NationalAverageOnlyNotice from './NationalAverageOnlyNotice';

export function NationalOnlyHeaderNotice({ active, lang }) {
  return (
    <NationalAverageOnlyNotice
      active={active}
      label={lang === 'en'
        ? 'This data shows the national average only.'
        : 'এই ডেটা শুধুমাত্র জাতীয় গড়ের ভিত্তিতে প্রদর্শিত হচ্ছে'}
    />
  );
}

export function ChartEmptyState({ title, subtitle }) {
  return (
    <div
      style={{
        padding: '1.25rem',
        borderRadius: '12px',
        border: '1px dashed rgba(148, 163, 184, 0.4)',
        background: 'rgba(148, 163, 184, 0.06)',
        textAlign: 'center'
      }}
    >
      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
        {title}
      </div>
      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{subtitle}</div>
    </div>
  );
}