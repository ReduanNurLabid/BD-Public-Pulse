import { calculateComprehensiveAnalysis } from '../src/lib/scoring.js';
import { QUESTIONS, BLOC_PROFILES } from '../src/data/questions.js';

// 1. Simulate the 5 Archetype Party Supporters
function simulatePartyAnswers(partyKey) {
  return QUESTIONS.map((q) => {
    let score = 3;
    const w = (q.bloc_weights || {})[partyKey];
    if (w !== undefined) {
      if (w >= 2) score = 5;
      else if (w > 0.5) score = 4;
      else if (w <= -2) score = 1;
      else if (w < -0.5) score = 2;
    }
    return { questionId: q.id, score, blockId: q.blockId };
  });
}

console.log('=====================================================');
console.log('       PARTY BLOC SIMULATION (WHERE PARTIES STAND)   ');
console.log('=====================================================');

['Student', 'BNP', 'JI', 'Sushil', 'AL'].forEach((partyKey) => {
  const answers = simulatePartyAnswers(partyKey);
  const result = calculateComprehensiveAnalysis(answers);
  console.log(`\n--- Party: ${BLOC_PROFILES[partyKey].name} (${partyKey}) ---`);
  console.log(`Coordinates: X = ${result.coordinates.x > 0 ? '+' : ''}${result.coordinates.x}, Y = ${result.coordinates.y > 0 ? '+' : ''}${result.coordinates.y}`);
  console.log(`Quadrant: ${result.quadrantProfile.nameBn} (${result.quadrantProfile.key})`);
  console.log(`Top Match: ${result.primaryBloc.profile?.name} (${result.primaryBloc.percentage}%)`);
  console.log(`Runner-up: ${result.sortedBlocs[1]?.profile?.name} (${result.sortedBlocs[1]?.percentage}%)`);
  console.log(`Historical Comparator: ${result.personalities[0]?.nameBn} (${result.personalities[0]?.nationality}) & ${result.personalities[1]?.nameBn} (${result.personalities[1]?.nationality})`);
});

// 2. Simulate "No Man's Land" / Independent Thinkers
console.log('\n=====================================================');
console.log('           EXPLORING NO MAN\'S LAND (INDEPENDENT THINKERS) ');
console.log('=====================================================');

// Case 1: Pure Centrist Pragmatist (Mostly 3s, slight balance)
const centristPragmatist = QUESTIONS.map((q, idx) => ({
  questionId: q.id,
  score: idx % 3 === 0 ? 3 : (idx % 2 === 0 ? 4 : 2),
  blockId: q.blockId
}));

// Case 2: The Heterodox Maverick (Pro-Student PR & Reform, Pro-BNP Market, Pro-Sushil Liberties, Pro-Islamic Sovereignty)
// Picks the strongest anti-party cross-cutting stances
const heterodoxMaverick = QUESTIONS.map((q) => {
  let score = 3;
  if (q.id === 'q9') score = 5;   // Strongly Pro-PR (anti-BNP)
  if (q.id === 'q10') score = 5;  // PM Term limit
  if (q.id === 'q8') score = 5;   // Caretaker (anti-AL)
  if (q.id === 'q13') score = 1;  // Traditional inheritance (anti-Sushil)
  if (q.id === 'q14') score = 1;  // Allows religious parties (anti-AL)
  if (q.id === 'q19') score = 5;  // SOE privatization (pro-market)
  if (q.id === 'q20') score = 5;  // Seize defaulter assets (anti-oligarch)
  if (q.id === 'q21') score = 5;  // Hasina extradition
  if (q.id === 'q23') score = 5;  // Chinese Teesta project
  if (q.id === 'q26') score = 1;  // Strict anti-censorship (pro-free speech)
  if (q.id === 'q34') score = 1;  // Rejects Mujib monopoly
  if (q.id === 'q40') score = 5;  // RMG living wage hike
  return { questionId: q.id, score, blockId: q.blockId };
});

// Case 3: The Secular Left-Libertarian (Pro-Labor, Pro-Civil Rights, Anti-Regime, Anti-Clerical)
const secularLeftLibertarian = QUESTIONS.map((q) => {
  let score = 3;
  if (q.x_weight < 0) score = 5;      // Pro-economic left
  else if (q.x_weight > 0) score = 1; // Anti-capitalist
  if (q.y_weight > 0) score = 5;      // Pro-libertarian civil rights
  else if (q.y_weight < 0) score = 1; // Anti-authoritarian
  if (q.id === 'q13') score = 5;      // Pro-women equality
  if (q.id === 'q14') score = 5;      // Anti-religious parties
  if (q.id === 'q39') score = 5;      // Pro-minority protection
  if (q.id === 'q33') score = 1;      // Anti-AL return
  return { questionId: q.id, score, blockId: q.blockId };
});

const scenarios = [
  { name: 'Centrist Pragmatist (সংশয়বাদী মধ্যপন্থী)', answers: centristPragmatist },
  { name: 'Heterodox Maverick (স্বতন্ত্র চিন্তাবিদ / নো-ম্যানস ল্যান্ড)', answers: heterodoxMaverick },
  { name: 'Secular Left-Libertarian (উদার প্রগতিশীল সমাজতন্ত্রী)', answers: secularLeftLibertarian }
];

scenarios.forEach(({ name, answers }) => {
  const result = calculateComprehensiveAnalysis(answers);
  console.log(`\n--- Scenario: ${name} ---`);
  console.log(`Coordinates: X = ${result.coordinates.x > 0 ? '+' : ''}${result.coordinates.x}, Y = ${result.coordinates.y > 0 ? '+' : ''}${result.coordinates.y}`);
  console.log(`Quadrant: ${result.quadrantProfile.nameBn} (${result.quadrantProfile.key})`);
  console.log(`Match Type: ${result.matchType}`);
  console.log(`Primary Bloc: ${result.primaryBloc.profile?.name || result.primaryBloc.key} (${result.primaryBloc.percentage ? result.primaryBloc.percentage + '%' : 'N/A'})`);
  console.log(`Top 3 Blocs: ${result.sortedBlocs.slice(0, 3).map(b => `${b.profile.name}: ${b.percentage}%`).join(' | ')}`);
  console.log(`Confidence / Close call: margin = ${result.confidence.margin}% (isCloseCall: ${result.confidence.isCloseCall})`);
  console.log(`Historical Figures: ${result.personalities.map(p => p.nameBn).join(' & ')}`);
});
