/**
 * Guards the ageRanges aggregate contract.
 *
 * Bug this prevents: the demographics dropdown and the stats/aggregates schema
 * each had their own hardcoded age list. A value mismatch (or a stray space)
 * sent `increment()` to a field path the reader never queries, so the age chart
 * silently stayed at zero. The lists are now shared (AGE_BUCKETS), and this
 * script fails loudly if that ever drifts again.
 *
 * Run: npm run verify:stats
 */
import { AGE_BUCKETS } from '../src/data/questions.js';
import { readFileSync } from 'node:fs';

const failures = [];
const check = (ok, message) => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${message}`);
  if (!ok) failures.push(message);
};

// 1. Buckets must be unique — a duplicate key makes one increment overwrite the other.
check(new Set(AGE_BUCKETS).size === AGE_BUCKETS.length, 'AGE_BUCKETS has no duplicate keys');

// 2. No empty / whitespace-only keys (they would produce malformed field paths).
check(AGE_BUCKETS.every(k => k && k.trim() === k && k.length > 0), 'AGE_BUCKETS keys are non-empty and trimmed');

// 3. Keys must not contain characters that break Firestore field paths.
const illegal = AGE_BUCKETS.filter(k => /[.*#$\[\]\/~]/.test(k));
check(illegal.length === 0, `AGE_BUCKETS keys are field-path safe${illegal.length ? ` (offenders: ${illegal.join(', ')})` : ''}`);

// 4. The schema in firebase.js must be derived from AGE_BUCKETS, not a second literal list.
const firebaseSrc = readFileSync(new URL('../src/lib/firebase.js', import.meta.url), 'utf8');
check(
  /ageRanges:\s*Object\.fromEntries\(\s*AGE_BUCKETS\.map/.test(firebaseSrc),
  'firebase.js derives ageRanges keys from AGE_BUCKETS'
);

// 5. The writer must read the field name the form actually submits.
check(
  /demographics\?\.ageRange/.test(firebaseSrc),
  'saveAssessmentResponse reads demographics.ageRange (the form field name)'
);
check(
  !/demographics\?\.age\b(?!Range)/.test(firebaseSrc),
  'saveAssessmentResponse no longer reads the non-existent demographics.age'
);

// 6. The form must not redeclare its own age list.
const formSrc = readFileSync(new URL('../src/components/DemographicsForm.jsx', import.meta.url), 'utf8');
check(
  /import\s*\{[^}]*\bAGE_BUCKETS\b[^}]*\}\s*from\s*'\.\.\/data\/questions'/.test(formSrc),
  'DemographicsForm imports the shared AGE_BUCKETS list'
);
const formDeclaresLiteral = /const\s+AGE_RANGES\s*=\s*\[/.test(formSrc);
check(!formDeclaresLiteral, 'DemographicsForm does not declare a second literal age list');

// 7. Every increment target must resolve to an existing sub-map in the schema.
const schemaAgeKeys = AGE_BUCKETS; // firebase.js builds ageRanges from exactly this list
const unwriteable = AGE_BUCKETS.filter(k => !schemaAgeKeys.includes(k));
check(unwriteable.length === 0, 'every age bucket maps to an existing ageRanges sub-map');

console.log('');
if (failures.length) {
  console.error(`${failures.length} check(s) failed. The age chart will show zeros.`);
  process.exit(1);
}
console.log(`All checks passed (${AGE_BUCKETS.length} buckets).`);