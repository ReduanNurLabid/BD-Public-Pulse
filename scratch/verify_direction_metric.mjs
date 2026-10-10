// End-to-end verification of the direction-weighted personality match, driven
// through the real calculateComprehensiveAnalysis() rather than a reimplementation.
// Sign convention: positive bloc_weight = the bloc endorses the statement
// (questions.js header line 8; scoring.js uses multiplier * weight, no direction).
// Run: node scratch/verify_direction_metric.mjs
import { QUESTIONS, BLOC_PROFILES } from '../src/data/questions.js';
import { calculateComprehensiveAnalysis, MASTER_PERSONALITIES, MODEL_VERSION } from '../src/lib/scoring.js';

const CENTRIST_RADIUS = 16;

function canonical(bloc) {
  let peak = 0;
  QUESTIONS.forEach((q) => {
    peak = Math.max(peak, Math.abs((q.bloc_weights || {})[bloc] || 0));
  });
  const base = {};
  QUESTIONS.forEach((q) => {
    const w = (q.bloc_weights || {})[bloc] || 0;
    const t = w === 0 ? 0 : Math.max(-1, Math.min(1, w / peak));
    base[q.id] = 3 + Math.round(2 * t);
  });
  return base;
}

let seed = 20261004;
function rnd() {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff;
  return seed / 0x7fffffff;
}

const CLOUD = [];
Object.keys(BLOC_PROFILES).forEach((b) => {
  const base = canonical(b);
  [0, 4, 8, 12, 16, 20].forEach((noise) => {
    for (let i = 0; i < 200; i += 1) {
      const a = { ...base };
      for (let j = 0; j < noise; j += 1) {
        const q = QUESTIONS[Math.floor(rnd() * QUESTIONS.length)];
        const shift = 1 + Math.floor(rnd() * 2);
        a[q.id] = Math.max(1, Math.min(5, a[q.id] + (rnd() < 0.5 ? -shift : shift)));
      }
      const answers = QUESTIONS.map((q) => ({ questionId: q.id, score: a[q.id] }));
      const r = calculateComprehensiveAnalysis(answers);
      CLOUD.push({ x: r.coordinates.x, y: r.coordinates.y, bloc: b, personalities: r.personalities });
    }
  });
});

const pad = (s, n) => String(s).padEnd(n);
const pc = (v, n) => `${((v / n) * 100).toFixed(1)}%`;

const t1 = {};
const t3 = {};
CLOUD.forEach((c) => {
  t1[c.personalities[0].nameEn] = (t1[c.personalities[0].nameEn] || 0) + 1;
  c.personalities.slice(0, 3).forEach((p) => {
    t3[p.nameEn] = (t3[p.nameEn] || 0) + 1;
  });
});

console.log(`model ${MODEL_VERSION} | ${CLOUD.length} respondents through the real pipeline\n`);
console.log('=== top-1 and top-3 share (direction-weighted metric) ===');
console.log(`${pad('personality', 24)}${pad('top-1', 9)}top-3`);
MASTER_PERSONALITIES.forEach((p) => {
  console.log(`${pad(p.nameEn, 24)}${pad(pc(t1[p.nameEn] || 0, CLOUD.length), 9)}${pc(t3[p.nameEn] || 0, CLOUD.length)}`);
});

const mujib = t1['Sheikh Mujibur Rahman'] || 0;
const ziaur = t1['Ziaur Rahman'] || 0;
console.log(`\nHEADLINE  Mujib top-1 ${pc(mujib, CLOUD.length)}   Ziaur top-1 ${pc(ziaur, CLOUD.length)}`);
console.log(`          Mujib top-3 ${pc(t3['Sheikh Mujibur Rahman'] || 0, CLOUD.length)}   Ziaur top-3 ${pc(t3['Ziaur Rahman'] || 0, CLOUD.length)}`);

const dead = MASTER_PERSONALITIES.filter((p) => !(t3[p.nameEn] > 0));
console.log(dead.length ? `\nzero top-3 reach: ${dead.map((d) => d.nameEn).join(', ')}` : '\nevery figure reaches the top 3 for someone');

console.log('\n=== per-bloc hero match (noise-free canonical respondent) ===');
Object.keys(BLOC_PROFILES).forEach((b) => {
  const r = calculateComprehensiveAnalysis(QUESTIONS.map((q) => ({ questionId: q.id, score: canonical(b)[q.id] })));
  console.log(
    `${pad(b, 9)} (${String(r.coordinates.x).padStart(4)},${String(r.coordinates.y).padStart(4)})  ` +
      r.personalities
        .slice(0, 3)
        .map((p) => `${p.nameEn} ${p.compatibility}%`)
        .join(' | ')
  );
});

console.log('\n=== centrist fallback: respondents inside CENTRIST_RADIUS must not use bearing ===');
const inner = CLOUD.filter((c) => Math.hypot(c.x, c.y) <= CENTRIST_RADIUS);
console.log(`${inner.length} of ${CLOUD.length} respondents fall inside r <= ${CENTRIST_RADIUS}`);
const innerTop = {};
inner.forEach((c) => {
  innerTop[c.personalities[0].nameEn] = (innerTop[c.personalities[0].nameEn] || 0) + 1;
});
Object.entries(innerTop)
  .sort((a, b) => b[1] - a[1])
  .forEach(([nm, v]) => console.log(`  ${pad(nm, 24)} ${pc(v, inner.length)}`));

console.log('\n=== same-ray sanity: Ziaur (45,-45) and Sir Syed (20,-20) share the -45deg ray ===');
const bz = (Math.atan2(-45, 45) * 180) / Math.PI;
const bs = (Math.atan2(-20, 20) * 180) / Math.PI;
console.log(`  bearings ${bz.toFixed(3)}deg vs ${bs.toFixed(3)}deg -> identical, so these two are ordered by radius only`);
console.log('  (measured directly on the metric, which is a pure function of the coordinate)\n');

const MAX_COMPASS_DIST = 141.42;
const RADIAL_WEIGHT = 0.8;
const metric = (ux, uy, p) => {
  const rU = Math.hypot(ux, uy);
  if (rU <= CENTRIST_RADIUS) return Math.hypot(ux - p.x, uy - p.y);
  let d = Math.atan2(p.y, p.x) - Math.atan2(uy, ux);
  d = Math.atan2(Math.sin(d), Math.cos(d));
  return Math.hypot((Math.abs(d) / Math.PI) * MAX_COMPASS_DIST, Math.abs(rU - Math.hypot(p.x, p.y)) * RADIAL_WEIGHT);
};

[
  ['origin (fallback)', 0, 0],
  ['near origin (fallback)', 6, -4],
  ['centrist edge', 16, 0],
  ['mild auth-right', 20, -18],
  ['moderate auth-right', 40, -36],
  ['strong auth-right', 70, -63],
  ['Ziaur exact position', 45, -45],
  ['typical left-nationalist', -40, -30],
  ['strong left-nationalist', -70, -50],
  ['lib-left', -55, 55]
].forEach(([label, x, y]) => {
  const r = MASTER_PERSONALITIES.map((p) => ({ p, d: metric(x, y, p) })).sort((a, b) => a.d - b.d);
  const mode = Math.hypot(x, y) <= CENTRIST_RADIUS ? 'euclid' : 'bearing';
  console.log(
    `  ${pad(label, 26)} (${String(x).padStart(4)},${String(y).padStart(4)}) [${pad(mode, 7)}] ` +
      r.slice(0, 3).map((e) => `${e.p.nameEn} ${e.d.toFixed(1)}`).join(' | ')
  );
});