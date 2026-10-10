import { QUESTIONS } from '../src/data/questions.js';

// Derive ideal AL supporter scores using the canonical formula:
// bloc_weights encode agree(+) / disagree(-) directly — direction is NOT
// multiplied in. Weights are normalised by the peak |weight| and mapped
// to a 1..5 Likert scale (same as canonical() in verify_direction_metric.mjs).
const targetBloc = 'AL';
let peak = 0;
QUESTIONS.forEach((q) => {
  peak = Math.max(peak, Math.abs((q.bloc_weights || {})[targetBloc] || 0));
});
const peakClamped = peak || 1;

let rawX = 0, rawY = 0;
QUESTIONS.forEach(q => {
  let scoreVal = 3;
  if (q.bloc_weights && q.bloc_weights[targetBloc] !== undefined) {
    const w = q.bloc_weights[targetBloc];
    const t = w === 0 ? 0 : Math.max(-1, Math.min(1, w / peakClamped));
    scoreVal = 3 + Math.round(2 * t);
  }
  const multiplier = scoreVal - 3;
  const dx = multiplier * (q.x_weight || 0);
  const dy = multiplier * (q.y_weight || 0);

  rawX += dx;
  rawY += dy;

  const w = q.bloc_weights?.[targetBloc];
  const t = w === 0 ? 0 : Math.max(-1, Math.min(1, w / peakClamped));
  const effScore = 3 + Math.round(2 * t);
  console.log(`Q: ${q.id} | weight: ${w} | norm: ${(w/peakClamped).toFixed(2)} | val: ${effScore} | mult: ${multiplier} | dx: ${dx} | dy: ${dy}`);
});

// Compute maxX/maxY for normalisation
let maxX = 0, maxY = 0;
QUESTIONS.forEach(q => {
  maxX += 2 * Math.abs(q.x_weight || 0);
  maxY += 2 * Math.abs(q.y_weight || 0);
});
const normalizedX = Math.round((rawX / maxX) * 100);
const normalizedY = Math.round((rawY / maxY) * 100);
console.log(`Final Raw: ${rawX}, ${rawY}`);
console.log(`Max: ${maxX}, ${maxY}`);
console.log(`Normalized: (${normalizedX}, ${normalizedY})`);
