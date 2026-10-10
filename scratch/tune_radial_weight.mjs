// Chooses RADIAL_WEIGHT for the bearing-dominant personality metric.
// Coordinates are the historical values in src/lib/scoring.js (no tuning).
// Sign convention: positive bloc_weight = the bloc endorses the statement
// (questions.js header line 8; scoring.js uses multiplier * weight, no direction).
// Run: node scratch/tune_radial_weight.mjs
import { QUESTIONS, BLOC_PROFILES } from '../src/data/questions.js';
import { MASTER_PERSONALITIES } from '../src/lib/scoring.js';

const CENTRIST_RADIUS = 16;
const MAX_COMPASS_DIST = 141.42;
const WEIGHTS = [0, 0.25, 0.35, 0.5, 0.65, 0.8, 1.0];

let seed = 20261004;
function rnd() {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff;
  return seed / 0x7fffffff;
}

function canonical(bloc) {
  let peak = 0;
  QUESTIONS.forEach((q) => {
    peak = Math.max(peak, Math.abs((q.bloc_weights || {})[bloc] || 0));
  });
  const a = {};
  QUESTIONS.forEach((q) => {
    const w = (q.bloc_weights || {})[bloc] || 0;
    const t = w === 0 ? 0 : Math.max(-1, Math.min(1, w / peak));
    a[q.id] = 3 + Math.round(2 * t);
  });
  return a;
}

function toCoords(a) {
  let rawX = 0, maxX = 0, rawY = 0, maxY = 0;
  QUESTIONS.forEach((q) => {
    const m = a[q.id] - 3;
    rawX += m * (q.x_weight || 0);
    maxX += 2 * Math.abs(q.x_weight || 0);
    rawY += m * (q.y_weight || 0);
    maxY += 2 * Math.abs(q.y_weight || 0);
  });
  return { x: Math.round((rawX / maxX) * 100), y: Math.round((rawY / maxY) * 100) };
}

const CLOUD = [];
Object.keys(BLOC_PROFILES).forEach((b) => {
  const base = canonical(b);
  [0, 4, 8, 12, 16, 20].forEach((noise) => {
    for (let i = 0; i < 250; i += 1) {
      const a = { ...base };
      for (let j = 0; j < noise; j += 1) {
        const q = QUESTIONS[Math.floor(rnd() * QUESTIONS.length)];
        const shift = 1 + Math.floor(rnd() * 2);
        a[q.id] = Math.max(1, Math.min(5, a[q.id] + (rnd() < 0.5 ? -shift : shift)));
      }
      const c = toCoords(a);
      CLOUD.push({ ...c, bloc: b });
    }
  });
});

// weight 0 reproduces pure Euclidean; higher values make bearing dominate.
function dist(c, p, w) {
  if (w === 0) return Math.hypot(c.x - p.x, c.y - p.y);
  const rU = Math.hypot(c.x, c.y);
  if (rU <= CENTRIST_RADIUS) return Math.hypot(c.x - p.x, c.y - p.y);
  let d = Math.atan2(p.y, p.x) - Math.atan2(c.y, c.x);
  d = Math.atan2(Math.sin(d), Math.cos(d));
  return Math.hypot((Math.abs(d) / Math.PI) * MAX_COMPASS_DIST, Math.abs(rU - Math.hypot(p.x, p.y)) * w);
}

const pad = (s, n) => String(s).padEnd(n);
const pc = (v, n) => `${((v / n) * 100).toFixed(1)}%`;

function run(w) {
  const t1 = {};
  const t3 = {};
  const perBloc = {};
  let compSum = 0;
  let compN = 0;
  CLOUD.forEach((c) => {
    const ranked = MASTER_PERSONALITIES.map((p) => ({ n: p.nameEn, d: dist(c, p, w) })).sort((a, b) => a.d - b.d);
    t1[ranked[0].n] = (t1[ranked[0].n] || 0) + 1;
    ranked.slice(0, 3).forEach((r) => {
      t3[r.n] = (t3[r.n] || 0) + 1;
    });
    const comp = Math.max(30, Math.min(99, Math.round(100 - (ranked[0].d / MAX_COMPASS_DIST) * 35)));
    compSum += comp;
    compN += 1;
    perBloc[c.bloc] = perBloc[c.bloc] || {};
    perBloc[c.bloc][ranked[0].n] = (perBloc[c.bloc][ranked[0].n] || 0) + 1;
  });
  return { t1, t3, perBloc, avgComp: compSum / compN };
}

const results = WEIGHTS.map((w) => ({ w, ...run(w) }));

console.log(`cloud ${CLOUD.length} | weight 0 = pure Euclidean (current behaviour)\n`);
console.log('=== top-1 share by radial weight ===');
console.log(pad('personality', 24) + WEIGHTS.map((w) => pad(w === 0 ? 'euclid' : `w=${w}`, 9)).join(''));
MASTER_PERSONALITIES.forEach((p) => {
  console.log(pad(p.nameEn, 24) + results.map((r) => pad(pc(r.t1[p.nameEn] || 0, CLOUD.length), 9)).join(''));
});

console.log('\n=== top-3 share by radial weight ===');
console.log(pad('personality', 24) + WEIGHTS.map((w) => pad(w === 0 ? 'euclid' : `w=${w}`, 9)).join(''));
MASTER_PERSONALITIES.forEach((p) => {
  console.log(pad(p.nameEn, 24) + results.map((r) => pad(pc(r.t3[p.nameEn] || 0, CLOUD.length), 9)).join(''));
});

console.log('\n=== figures with zero top-1 reach ===');
results.forEach((r) => {
  const dead = MASTER_PERSONALITIES.filter((p) => !(r.t1[p.nameEn] > 0));
  console.log(`  w=${pad(r.w, 5)} ${dead.length ? dead.map((d) => d.nameEn).join(', ') : 'none'}`);
});

console.log('\n=== bloc centroid -> top-1 match ===');
Object.keys(BLOC_PROFILES).forEach((b) => {
  const sub = CLOUD.filter((c) => c.bloc === b);
  console.log(`\n${b}`);
  results.forEach((r) => {
    const top = Object.entries(r.perBloc[b])
      .sort((a, c) => c[1] - a[1])
      .slice(0, 2)
      .map(([nm, v]) => `${nm} ${pc(v, sub.length)}`)
      .join(' | ');
    console.log(`  w=${pad(r.w, 5)} ${top}`);
  });
});

console.log('\n=== average displayed compatibility of the top match (spread=35) ===');
results.forEach((r) => console.log(`  w=${pad(r.w, 5)} ${r.avgComp.toFixed(1)}%`));

console.log('\n=== centrist fallback check: users inside CENTRIST_RADIUS ===');
const inner = CLOUD.filter((c) => Math.hypot(c.x, c.y) <= CENTRIST_RADIUS);
console.log(`  ${inner.length} of ${CLOUD.length} respondents fall inside the band`);
const innerTop = {};
inner.forEach((c) => {
  const best = MASTER_PERSONALITIES.map((p) => ({ n: p.nameEn, d: Math.hypot(c.x - p.x, c.y - p.y) })).sort(
    (a, b) => a.d - b.d
  )[0];
  innerTop[best.n] = (innerTop[best.n] || 0) + 1;
});
Object.entries(innerTop)
  .sort((a, b) => b[1] - a[1])
  .forEach(([nm, v]) => console.log(`  ${pad(nm, 24)} ${pc(v, inner.length)}`));
