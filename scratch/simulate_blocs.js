import { QUESTIONS, BLOC_PROFILES } from '../src/data/questions.js';

/**
 * Derives the ideal answer vector for a bloc supporter.
 *
 * bloc_weights are signed agree/disagree tendencies (positive = endorse,
 * negative = oppose), NOT multiplied by direction. Normalising by the peak
 * |weight| maps each weight to a [-1, 1] coefficient, which is then converted
 * to a 1..5 Likert score. This is the same canonical() function used in
 * verify_direction_metric.mjs and reproduces BLOC_PROFILES centroids.
 */
function simulateAnswers(targetBloc) {
  let peak = 0;
  QUESTIONS.forEach((q) => {
    peak = Math.max(peak, Math.abs((q.bloc_weights || {})[targetBloc] || 0));
  });
  const peakClamped = peak || 1;

  return QUESTIONS.map((q) => {
    let scoreVal = 3;
    if (targetBloc !== 'Mixed' && q.bloc_weights && q.bloc_weights[targetBloc] !== undefined) {
      const w = q.bloc_weights[targetBloc];
      const t = w === 0 ? 0 : Math.max(-1, Math.min(1, w / peakClamped));
      scoreVal = 3 + Math.round(2 * t);
    }
    return { questionId: q.id, score: scoreVal, blockId: q.blockId };
  });
}

function calculateCoords(answers) {
  let rawX = 0, rawY = 0, maxX = 0, maxY = 0;
  const answerMap = new Map(answers.map((a) => [a.questionId, a.score]));

  QUESTIONS.forEach((q) => {
    const scoreVal = answerMap.has(q.id) ? answerMap.get(q.id) : 3;
    const multiplier = scoreVal - 3;
    rawX += multiplier * (q.x_weight || 0);
    maxX += 2 * Math.abs(q.x_weight || 0);
    rawY += multiplier * (q.y_weight || 0);
    maxY += 2 * Math.abs(q.y_weight || 0);
  });

  const normalizedX = maxX > 0 ? Math.round((rawX / maxX) * 100) : 0;
  const normalizedY = maxY > 0 ? Math.round((rawY / maxY) * 100) : 0;
  return { x: normalizedX, y: normalizedY };
}

console.log('=== Ideal bloc supporter compass positions ===\n');
for (const key of Object.keys(BLOC_PROFILES)) {
  const coords = calculateCoords(simulateAnswers(key));
  const target = BLOC_PROFILES[key].centroid;
  const match = coords.x === target.x && coords.y === target.y
    ? 'EXACT'
    : `\u2248 target ${JSON.stringify(target)}`;
  console.log(`${key.padEnd(10)} ${JSON.stringify(coords)}  ${match}`);
}
