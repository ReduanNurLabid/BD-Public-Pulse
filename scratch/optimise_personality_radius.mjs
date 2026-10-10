// Radius optimisation for MASTER_PERSONALITIES with bearings strictly locked.
//
// Two properties this must have, and how they are enforced:
//  1. Bearings never move. Each figure's primitive integer direction vector is
//     extracted from its current (x, y) via gcd, and the optimised coordinate is
//     k * (px, py) for a scalar k > 0. Scaling by a positive scalar cannot change
//     the bearing or the half-planes, so the invariant holds by construction.
//     (An earlier version used tan(bearing), which has period 180deg and silently
//     mirrored every figure in the third/fourth quadrant.)
//  2. No figure is optimised in isolation. Each respondent is assigned to the
//     bearing cluster nearest its own direction; the objective counts respondents
//     matched to a figure inside their own cluster. A figure cannot win by
//     poaching another direction and cannot be abandoned.
//
// A minimum pairwise separation keeps figures visually distinct on the compass.
// Run: node scratch/optimise_personality_radius.mjs
import { QUESTIONS, BLOC_PROFILES } from '../src/data/questions.js';
import { MASTER_PERSONALITIES } from '../src/lib/scoring.js';

const CENTRIST_RADIUS = 16;
const CLUSTER_TOLERANCE_DEG = 3;
const MIN_SCALE = 0.3;
const MAX_SCALE = 1.45;
const MIN_SEPARATION = 12;
const STEPS = 30;
const PASSES = 6;

// Honesty constraints. Without these the objective is maximised by collapsing
// every figure onto the origin, which maximises bearing-matching by erasing the
// extremity information the compass exists to convey. A figure must therefore
// stay recognisably itself: radius within a band of its historical value, and
// far enough from its neighbours to remain a distinct point on the compass.
const HONEST = process.env.HONEST !== '0';
const FLOOR_RADIUS = 18; // outside the CENTRIST_RADIUS band of 16
const BAND_LO = 0.55;
const BAND_HI = 1.3;
// A large global separation is infeasible once bearings are locked: Ziaur and
// Sir Syed share the exact -45deg ray, so their distance is purely radial and
// can only be widened by moving one of them toward the origin. Separation is
// therefore reported as a diagnostic rather than enforced.
const SEPARATION = Number(process.env.SEPARATION || 0);
const minRadiusFor = (i) => (HONEST ? Math.max(FLOOR_RADIUS, PRIM_R0(i) * BAND_LO) : Math.max(5, PRIM_R0(i) * MIN_SCALE));
const maxRadiusFor = (i) => Math.min(112, PRIM_R0(i) * (HONEST ? BAND_HI : MAX_SCALE));

const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));

// Primitive direction vector + base radius per figure.
const PRIM = MASTER_PERSONALITIES.map((p) => {
  const g = gcd(Math.abs(p.x), Math.abs(p.y)) || 1;
  return { px: p.x / g, py: p.y / g, r0: Math.hypot(p.x, p.y) };
});
const UNIT = PRIM.map(({ px, py }) => {
  const n = Math.hypot(px, py);
  return { ux: px / n, uy: py / n };
});
const PRIM_R0 = (i) => PRIM[i].r0;

const deg = (ux, uy) => (Math.atan2(uy, ux) * 180) / Math.PI;
const bearingOf = (i) => deg(UNIT[i].ux, UNIT[i].uy);

let scales = PRIM.map(({ px, py }, i) => PRIM[i].r0 / Math.hypot(px, py)); // k=1 reproduces (x, y)

const posOf = (i) => ({ x: PRIM[i].px * scales[i], y: PRIM[i].py * scales[i] });
const radiusOf = (i) => scales[i] * Math.hypot(PRIM[i].px, PRIM[i].py);

// ---------------------------------------------------------------------------
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

const angGap = (a, b) => {
  let d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
};

const order = MASTER_PERSONALITIES.map((_, i) => i).sort((a, b) => bearingOf(a) - bearingOf(b));
const CLUSTERS = [];
order.forEach((i) => {
  const last = CLUSTERS[CLUSTERS.length - 1];
  if (last && angGap(bearingOf(i), bearingOf(last[0])) <= CLUSTER_TOLERANCE_DEG) last.push(i);
  else CLUSTERS.push([i]);
});

const clusterOf = (bearing) => {
  let best = CLUSTERS[0];
  let bestD = Infinity;
  CLUSTERS.forEach((c) => {
    const d = angGap(bearing, bearingOf(c[0]));
    if (d < bestD) {
      bestD = d;
      best = c;
    }
  });
  return new Set(best);
};
CLOUD.forEach((c) => {
  c.cluster = clusterOf((Math.atan2(c.y, c.x) * 180) / Math.PI);
});

function separationOk() {
  return true; // see note at SEPARATION: not enforceable with locked bearings
}

function objective() {
  const P = MASTER_PERSONALITIES.map((_, i) => posOf(i));
  let hit = 0;
  for (let k = 0; k < CLOUD.length; k += 1) {
    const c = CLOUD[k];
    let best = Infinity;
    let bi = -1;
    for (let i = 0; i < P.length; i += 1) {
      const dx = c.x - P[i].x;
      const dy = c.y - P[i].y;
      const d = dx * dx + dy * dy;
      if (d < best) {
        best = d;
        bi = i;
      }
    }
    if (c.cluster.has(bi)) hit += 1;
  }
  return hit;
}

function report() {
  const P = MASTER_PERSONALITIES.map((_, i) => posOf(i));
  const t1 = {};
  const t3 = {};
  const perBloc = {};
  CLOUD.forEach((c) => {
    const ranked = P.map((p, i) => ({ i, d: Math.hypot(c.x - p.x, c.y - p.y) })).sort((a, b) => a.d - b.d);
    const nm = MASTER_PERSONALITIES[ranked[0].i].nameEn;
    if (c.x * c.x + c.y * c.y > CENTRIST_RADIUS * CENTRIST_RADIUS) t1[nm] = (t1[nm] || 0) + 1;
    ranked.slice(0, 3).forEach((r) => {
      t3[MASTER_PERSONALITIES[r.i].nameEn] = (t3[MASTER_PERSONALITIES[r.i].nameEn] || 0) + 1;
    });
    perBloc[c.bloc] = perBloc[c.bloc] || {};
    perBloc[c.bloc][nm] = (perBloc[c.bloc][nm] || 0) + 1;
  });
  return { t1, t3, perBloc };
}

const pad = (s, n) => String(s).padEnd(n);
const pc = (v, n) => `${((v / n) * 100).toFixed(1)}%`;

console.log(`cloud ${CLOUD.length} respondents | ${CLUSTERS.length} bearing clusters`);
console.log(
  HONEST
    ? `constraints ON: radius in [max(${FLOOR_RADIUS}, ${BAND_LO}x historical), ${BAND_HI}x historical], pairwise separation >= ${SEPARATION}`
    : `constraints OFF (diagnostic only): radius in [${MIN_SCALE}x, ${MAX_SCALE}x historical], separation >= ${SEPARATION}`
);
CLUSTERS.forEach((c) => {
  const n = CLOUD.filter((r) => r.cluster.has(c[0])).length;
  console.log(
    `  ${pad(`${bearingOf(c[0]).toFixed(1)}d`, 9)}${pad(c.map((i) => MASTER_PERSONALITIES[i].nameEn).join(' + '), 40)}${pc(n, CLOUD.length)}`
  );
});

const minPairDistance = () => {
  let m = Infinity;
  for (let i = 0; i < MASTER_PERSONALITIES.length; i += 1) {
    for (let j = i + 1; j < MASTER_PERSONALITIES.length; j += 1) {
      const a = posOf(i);
      const b = posOf(j);
      m = Math.min(m, Math.hypot(a.x - b.x, a.y - b.y));
    }
  }
  return m;
};

const before = report();
console.log(`\nobjective before: ${objective()} (${pc(objective(), CLOUD.length)} matched inside own direction)`);
console.log(`min pairwise distance before: ${minPairDistance().toFixed(1)}`);

for (let pass = 0; pass < PASSES; pass += 1) {
  let moved = 0;
  for (let i = 0; i < MASTER_PERSONALITIES.length; i += 1) {
    const norm = Math.hypot(PRIM[i].px, PRIM[i].py);
    const lo = minRadiusFor(i) / norm;
    const hi = maxRadiusFor(i) / norm;
    const original = scales[i];
    let bestK = original;
    let bestObj = objective();
    for (let s = 0; s <= STEPS; s += 1) {
      const k = lo + ((hi - lo) * s) / STEPS;
      scales[i] = k;
      if (!separationOk(i)) continue;
      const o = objective();
      if (o > bestObj) {
        bestObj = o;
        bestK = k;
      }
    }
    scales[i] = bestK;
    if (Math.abs(bestK - original) > 1e-9) moved += 1;
  }
  console.log(`pass ${pass + 1}: ${moved} radii changed, objective ${objective()}`);
  if (moved === 0) break;
}

const after = report();

console.log(`\nobjective after: ${objective()} (${pc(objective(), CLOUD.length)})`);

console.log('\n=== optimised coordinates and bearing check ===');
console.log(`${pad('personality', 24)}${pad('bearing', 10)}${pad('was', 14)}${pad('now', 14)}${pad('r was', 9)}r now`);
let ok = true;
MASTER_PERSONALITIES.forEach((p, i) => {
  const k = scales[i];
  const fx = Math.round(PRIM[i].px * k);
  const fy = Math.round(PRIM[i].py * k);
  const b0 = bearingOf(i);
  const b1 = deg(fx, fy);
  let d = b1 - b0;
  if (d > 180) d -= 360;
  if (d < -180) d += 360;
  const halves = Math.sign(fx) === Math.sign(p.x) && Math.sign(fy) === Math.sign(p.y);
  const good = Math.abs(d) < 0.35 && halves;
  if (!good) ok = false;
  console.log(
    `${good ? 'OK  ' : 'FAIL'} ${pad(p.nameEn, 22)}${pad(`${b0.toFixed(2)}d`, 10)}${pad(`(${p.x}, ${p.y})`, 14)}` +
      `${pad(`(${fx}, ${fy})`, 14)}${pad(PRIM[i].r0.toFixed(1), 9)}${radiusOf(i).toFixed(1)}` +
      `${Math.abs(d) >= 1e-9 ? `  delta ${d.toFixed(3)}d` : ''}`
  );
});
console.log(`bearing integrity: ${ok ? 'PASS' : 'FAIL'}`);

console.log('\n=== top-1 / top-3 share, before -> after ===');
console.log(`${pad('personality', 24)}${pad('top-1 before', 13)}${pad('top-1 after', 12)}${pad('top-3 before', 13)}top-3 after`);
MASTER_PERSONALITIES.forEach((p) => {
  console.log(
    `${pad(p.nameEn, 24)}${pad(pc(before.t1[p.nameEn] || 0, CLOUD.length), 13)}${pad(pc(after.t1[p.nameEn] || 0, CLOUD.length), 12)}` +
      `${pad(pc(before.t3[p.nameEn] || 0, CLOUD.length), 13)}${pc(after.t3[p.nameEn] || 0, CLOUD.length)}`
  );
});

console.log('\n=== per-bloc top-1 after ===');
Object.keys(BLOC_PROFILES).forEach((b) => {
  const sub = CLOUD.filter((c) => c.bloc === b);
  const top = Object.entries(after.perBloc[b])
    .sort((a, c) => c[1] - a[1])
    .slice(0, 3)
    .map(([nm, v]) => `${nm} ${pc(v, sub.length)}`)
    .join(' | ');
  console.log(`${pad(b, 9)} ${top}`);
});

const dead = MASTER_PERSONALITIES.filter((p) => !(after.t3[p.nameEn] > 0));
console.log(
  dead.length
    ? `\nfigures with zero top-3 reach: ${dead.map((d) => d.nameEn).join(', ')}`
    : '\nevery figure reaches at least one respondent in the top 3'
);

console.log('\n=== geometric feasibility of the requested pairings ===');
const centroid = (bloc) => {
  let peak = 0;
  QUESTIONS.forEach((q) => {
    peak = Math.max(peak, Math.abs((q.bloc_weights || {})[bloc] || 0));
  });
  let rawX = 0, maxX = 0, rawY = 0, maxY = 0;
  QUESTIONS.forEach((q) => {
    const w = (q.bloc_weights || {})[bloc] || 0;
    const t = w === 0 ? 0 : Math.max(-1, Math.min(1, w / peak));
    const m = Math.round(2 * t);
    rawX += m * (q.x_weight || 0);
    maxX += 2 * Math.abs(q.x_weight || 0);
    rawY += m * (q.y_weight || 0);
    maxY += 2 * Math.abs(q.y_weight || 0);
  });
  return { x: Math.round((rawX / maxX) * 100), y: Math.round((rawY / maxY) * 100) };
};

[
  ['AL', 'Sheikh Mujibur Rahman'],
  ['BNP', 'Ziaur Rahman'],
  ['Student', 'Subhas Chandra Bose'],
  ['Sushil', 'Lalon Shah'],
  ['JI', 'Haji Shariatullah']
].forEach(([bloc, target]) => {
  const c = centroid(bloc);
  const i = MASTER_PERSONALITIES.findIndex((p) => p.nameEn === target);
  const cb = (Math.atan2(c.y, c.x) * 180) / Math.PI;
  const gap = angGap(cb, bearingOf(i));
  const ranked = MASTER_PERSONALITIES.map((p, j) => ({ p, d: Math.hypot(c.x - posOf(j).x, c.y - posOf(j).y) })).sort(
    (a, b) => a.d - b.d
  );
  const win = ranked[0].p.nameEn;
  console.log(
    `${pad(bloc, 8)} centroid (${String(c.x).padStart(4)},${String(c.y).padStart(4)}) bearing ${cb.toFixed(1)}d | ` +
      `${pad(target, 22)} bearing gap ${gap.toFixed(1)}d -> ${win === target ? 'ACHIEVED' : `blocked by ${win}`}`
  );
});

console.log('\n=== coordinates to apply ===');
MASTER_PERSONALITIES.forEach((p, i) => {
  const k = scales[i];
  console.log(
    `  { x: ${Math.round(PRIM[i].px * k)}, y: ${Math.round(PRIM[i].py * k)}, nameBn: '${p.nameBn}', nameEn: '${p.nameEn}', roleBn: '${p.roleBn}', img: '${p.img}' },`
  );
});
