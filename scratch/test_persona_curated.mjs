import { CURATED_24_QUESTIONS } from './verify_curated_dataset.mjs';
import { BLOC_PROFILES, QUADRANT_PROFILES } from '../src/data/questions.js';
import { calculateComprehensiveAnalysis, MASTER_PERSONALITIES } from '../src/lib/scoring.js';

const run = (a) => calculateComprehensiveAnalysis(Object.entries(a).map(([questionId, score]) => ({ questionId, score })));

let failed = 0;
const check = (ok, msg) => { if (!ok) { failed++; console.log('  FAIL:', msg); } };

console.log('--- 1. Structural Checks ---');
for (const q of CURATED_24_QUESTIONS) {
  for (const b of Object.keys(BLOC_PROFILES)) {
    check(typeof q.bloc_weights?.[b] === 'number', `${q.id} missing weight for ${b}`);
  }
  check([1, -1].includes(q.direction), `${q.id} has no valid direction`);
}

console.log('--- 2. Ideal Supporters per Bloc ---');
for (const b of Object.keys(BLOC_PROFILES)) {
  const a = {};
  for (const q of CURATED_24_QUESTIONS) {
    const w = q.bloc_weights[b];
    a[q.id] = Math.abs(w) < 1 ? 3 : (w > 0 ? 5 : 1);
  }
  const r = run(a);
  console.log(`ideal ${b.padEnd(8)}: Top=${r.primaryBloc.key} (${r.primaryBloc.percentage}%), Runner-up=${r.sortedBlocs[1]?.key} (${r.sortedBlocs[1]?.percentage}%) | Quad=${r.quadrant}`);
  check(r.primaryBloc.key === b, `ideal ${b} landed on ${r.primaryBloc.key}`);
}

console.log('--- 3. Degenerate Inputs ---');
for (const [n, v] of [['all-agree', 5], ['all-disagree', 1], ['all-neutral', 3]]) {
  const r = run(Object.fromEntries(CURATED_24_QUESTIONS.map((q) => [q.id, v])));
  console.log(`${n.padEnd(14)}: type=${r.matchType}, quality.reliable=${r.quality.reliable}, reasons=${r.quality.reasons.join(',')}`);
}

console.log('\nFailed checks:', failed);
