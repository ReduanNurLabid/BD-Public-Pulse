// Acceptance test for the BD Political Compass scoring model.
// Usage (from the project root that contains src/data/questions.js and src/lib/scoring.js,
// or adjust the two import paths below):   node persona-check.mjs
//
// IMPORTANT: the role-played answer sets below are ASSUMPTIONS written by an outsider.
// Replace/extend them with answer sets from REAL supporters of each party (ask 5+ per party)
// and require >= 80% top-1 accuracy per bloc before launch.
import { QUESTIONS, BLOC_PROFILES } from './src/data/questions.js';
import { calculateComprehensiveAnalysis, MASTER_PERSONALITIES } from './src/lib/scoring.js';

const run = (a) => calculateComprehensiveAnalysis(Object.entries(a).map(([questionId, score]) => ({ questionId, score })));
const line = (name, r) => console.log(name.padEnd(46), 'top=' + r.primaryBloc.key.padEnd(8),
  r.sortedBlocs.map((s) => `${s.key}:${s.percentage}`).join(' '), '|', r.matchType, '| quad', r.quadrant);
let failed = 0; const check = (ok, msg) => { if (!ok) { failed++; console.log('  FAIL:', msg); } };

// 1. structural checks
for (const q of QUESTIONS) {
  for (const b of Object.keys(BLOC_PROFILES)) check(typeof q.bloc_weights?.[b] === 'number', `${q.id} missing weight for ${b}`);
  check([1, -1].includes(q.direction), `${q.id} has no valid direction`);
}

// 2. role-played supporters (REPLACE WITH REAL SUPPORTER DATA)
const BNP = {
  q4: 4, q10: 2, q11: 4, q6: 4, q8: 5, q9: 1, q12: 2, q13: 2, q14: 2,
  q17: 4, q18: 4, q19: 5, q21: 5, q22: 4, q25: 5, q20: 4, q26: 4, q32: 5,
  q23: 4, q33: 4, q34: 5, q15: 3, q27: 3, q39: 4
};
const BNP_LIBERTIES = { ...BNP, q26: 5, q32: 5 };               // BNP voter with strong civil-liberties answers
const BNP_LIBERAL_ALL = { ...BNP_LIBERTIES, q11: 5, q12: 3, q13: 3, q14: 3, q39: 5 };           // ...and liberal on religion/minorities
const BNP_HEDGING = { ...BNP, q34: 3, q33: 3, q21: 3, q32: 3 };        // BNP voter who hedges on AL/July items
console.log('--- BNP role-played supporters (must all be BNP) ---');
for (const [n, a] of Object.entries({ BNP, BNP_LIBERTIES, BNP_LIBERAL_ALL, BNP_HEDGING })) {
  const r = run(a); line(n, r); check(r.primaryBloc.key === 'BNP', `${n} did not land on BNP (got ${r.primaryBloc.key})`);
  const m = r.sortedBlocs[0].percentage - r.sortedBlocs[1].percentage; check(m >= 5, `${n}: BNP margin over runner-up is only ${m} points (fragile)`);
}

// 3. ideal supporters per bloc (model self-consistency)
console.log('--- ideal supporters ---');
for (const b of Object.keys(BLOC_PROFILES)) {
  const a = {}; for (const q of QUESTIONS) { const w = q.bloc_weights[b]; a[q.id] = Math.abs(w) < 1 ? 3 : w > 0 ? 5 : 1; }
  const r = run(a); line('ideal ' + b, r); check(r.primaryBloc.key === b, `ideal ${b} landed on ${r.primaryBloc.key}`);
}

// 4. straight-liners and bad input
console.log('--- degenerate input ---');
for (const [n, v] of [['all-agree', 5], ['all-disagree', 1], ['all-neutral', 3]]) {
  const r = run(Object.fromEntries(QUESTIONS.map((q) => [q.id, v]))); line(n, r); check(r.quality && r.quality.reliable === false, `${n} must be flagged unreliable`);
}
const bad = calculateComprehensiveAnalysis([{ questionId: 'q1', score: 9 }, { questionId: 'zz', score: 5 }, { questionId: 'q2', score: NaN }]);
check(Number.isFinite(bad.coordinates.x) && Number.isFinite(bad.coordinates.y), 'invalid input produced NaN coordinates');

// 5. personality list sanity
console.log('--- personalities ---');
const banned = /hitler|stalin|mussolini|pol pot|mao zedong/i;
for (const p of MASTER_PERSONALITIES) {
  check(!banned.test(p.nameEn), `${p.nameEn} must not be offered as a shareable "match"`);
  check(p.nationality !== 'Bangladeshi' || !/Indian|India\b/.test(p.roleEn || '') || /Bengal|Bangladesh/.test(p.roleEn || ''), `${p.nameEn} nationality looks wrong (${p.nationality})`);
}
console.log(failed ? `\n${failed} check(s) FAILED` : '\nall checks passed'); process.exit(failed ? 1 : 0);
