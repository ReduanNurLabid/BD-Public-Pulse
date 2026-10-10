import { calculateComprehensiveAnalysis } from '../src/lib/scoring.js';
import { QUESTIONS, BLOC_PROFILES, QUADRANT_PROFILES } from '../src/data/questions.js';

// List of the 24 curated questions from our evaluation plan
const CURATED_IDS = [
  'q4',  // Executive control & VC appointment
  'q6',  // Opposition accountability in absence of AL
  'q8',  // Caretaker government
  'q9',  // Proportional Representation (PR)
  'q10', // Prime Minister 2-Term Limit
  'q11', // Judicial Appointments Commission
  'q12', // Universal Ethics vs Religious studies
  'q13', // Equal inheritance rights for women
  'q14', // Ban on religion-based political parties
  'q15', // Madrasha vs General education equivalence
  'q17', // Power capacity charges & foreign contracts
  'q18', // Agricultural price guarantees & subsidies
  'q19', // Privatization of loss-making SOEs
  'q20', // Seizing assets of loan defaulters
  'q21', // Hasina extradition vs bilateral relations
  'q22', // Defense & strategic balance (USA/West/China)
  'q23', // Teesta project with China
  'q25', // India transit & port access
  'q26', // Cyber Security Act & free speech
  'q27', // Labor rights & independent unions (merged with q35)
  'q32', // Enforced disappearances & special tribunal
  'q33', // Awami League rehabilitation/ban in elections
  'q34', // Sheikh Mujib & 1971 founding father status
  'q39', // Religious & ethnic minority security guarantees
];

// 1. Simulate Party Supporter Responses
// A party loyalist takes the party's definitive stance on core issues
function getPartyAnswers(partyKey, questionPool) {
  return questionPool.map((q) => {
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

console.log('========================================================================');
console.log(' 1. WHERE EACH PARTY STANDS (SIMULATION ON 40 vs 24 QUESTIONS)         ');
console.log('========================================================================\n');

const parties = ['Student', 'BNP', 'JI', 'Sushil', 'AL'];

parties.forEach((partyKey) => {
  const allAnswers = getPartyAnswers(partyKey, QUESTIONS);
  const curatedQuestions = QUESTIONS.filter(q => CURATED_IDS.includes(q.id));
  const curatedAnswers = getPartyAnswers(partyKey, curatedQuestions);

  const resAll = calculateComprehensiveAnalysis(allAnswers);
  const resCurated = calculateComprehensiveAnalysis(curatedAnswers);

  const qName = (qKey) => QUADRANT_PROFILES[qKey]?.name || qKey;

  console.log(`🔷 PARTY: ${BLOC_PROFILES[partyKey].name} (${partyKey})`);
  console.log(`   [40-Question Compass]: Coordinates: (X=${resAll.coordinates.x > 0 ? '+' : ''}${resAll.coordinates.x}, Y=${resAll.coordinates.y > 0 ? '+' : ''}${resAll.coordinates.y}) | Quadrant: ${qName(resAll.quadrant)}`);
  console.log(`                          Match: ${resAll.primaryBloc.profile?.name} (${resAll.primaryBloc.percentage}%) | Runner-up: ${resAll.sortedBlocs[1]?.profile?.name} (${resAll.sortedBlocs[1]?.percentage}%)`);
  console.log(`   [24-Question Compass]: Coordinates: (X=${resCurated.coordinates.x > 0 ? '+' : ''}${resCurated.coordinates.x}, Y=${resCurated.coordinates.y > 0 ? '+' : ''}${resCurated.coordinates.y}) | Quadrant: ${qName(resCurated.quadrant)}`);
  console.log(`                          Match: ${resCurated.primaryBloc.profile?.name} (${resCurated.primaryBloc.percentage}%) | Runner-up: ${resCurated.sortedBlocs[1]?.profile?.name} (${resCurated.sortedBlocs[1]?.percentage}%)`);
  console.log(`   Historical Figures:   ${resCurated.personalities.slice(0, 2).map(p => `${p.nameBn} (${p.nationality})`).join(', ')}\n`);
});

console.log('========================================================================');
console.log(' 2. EXPLORING "NO MAN\'S LAND" (INDEPENDENT THINKERS)                   ');
console.log('========================================================================\n');

// Archetype 1: The Heterodox Cross-Cutting Thinker (Non-conformist Maverick)
// - Supports anti-corruption & seizing defaulters (Left/Radical)
// - Supports free-market SOE privatization (Right)
// - Strongly pro-free speech & anti-authoritarian (Libertarian)
// - Supports caretaker & PM term limit (Anti-AL)
// - Supports Proportional Representation (Anti-BNP)
// - Supports Women inheritance equality & secular rights (Anti-JI)
// - Critical of Indian hegemony while demanding strategic non-alignment (Patriotic Sovereign)
const heterodoxAnswers = CURATED_IDS.map(qid => {
  let score = 3;
  if (qid === 'q4') score = 5;   // Disagree with executive control over VCs
  if (qid === 'q6') score = 4;   // Wants real opposition
  if (qid === 'q8') score = 5;   // Caretaker govt
  if (qid === 'q9') score = 5;   // Proportional Representation
  if (qid === 'q10') score = 5;  // 2-term limit for PM
  if (qid === 'q11') score = 5;  // Judicial commission
  if (qid === 'q12') score = 4;  // Universal ethics over rote religious study
  if (qid === 'q13') score = 5;  // Women equal inheritance
  if (qid === 'q14') score = 2;  // Does not want authoritarian bans on parties
  if (qid === 'q17') score = 5;  // Cancel unfair power contracts
  if (qid === 'q19') score = 5;  // Privatize loss-making SOEs (Free market)
  if (qid === 'q20') score = 5;  // Seize defaulter assets (Left justice)
  if (qid === 'q21') score = 5;  // Extradite Hasina
  if (qid === 'q22') score = 4;  // Diversify partnerships
  if (qid === 'q25') score = 2;  // Scrutinize unilateral transit
  if (qid === 'q26') score = 1;  // Scrap Cyber Security Act (Total free speech)
  if (qid === 'q27') score = 5;  // Strong labor unions
  if (qid === 'q32') score = 5;  // Tribunal for disappearances
  if (qid === 'q33') score = 2;  // Strict justice before party rehabilitation
  if (qid === 'q34') score = 3;  // Nuanced historical view of Mujib
  if (qid === 'q39') score = 5;  // Minority protection
  return { questionId: qid, score, blockId: QUESTIONS.find(q => q.id === qid)?.blockId };
});

// Archetype 2: The Radical Libertarian (Anti-Statist Civil Rights Advocate)
// Disillusioned by all power-seeking parties; purely focused on human rights & liberty
const libertarianAnswers = CURATED_IDS.map(qid => {
  const q = QUESTIONS.find(item => item.id === qid);
  let score = 3;
  if (q.y_weight > 0) score = 5; // Maximum civil liberties & decentralization
  if (q.y_weight < 0) score = 1; // Minimum state coercion
  if (qid === 'q26') score = 1;  // Abolish speech restrictions
  if (qid === 'q32') score = 5;  // Accountability for state abuses
  if (qid === 'q10') score = 5;  // Strict PM limits
  if (qid === 'q4') score = 5;   // Campus autonomy
  return { questionId: qid, score, blockId: q?.blockId };
});

// Archetype 3: The Centrist Pragmatist (Pragmatic Middle)
// Evaluates policy balance without party allegiance
const pragmaticAnswers = CURATED_IDS.map(qid => {
  const q = QUESTIONS.find(item => item.id === qid);
  let score = 3;
  if (qid === 'q8') score = 4;  // Modest support for caretaker
  if (qid === 'q10') score = 4; // Modest support for term limits
  if (qid === 'q20') score = 4; // Support recovering loan money
  if (qid === 'q19') score = 3; // Mixed on privatization
  if (qid === 'q13') score = 3; // Gradual social reform
  return { questionId: qid, score, blockId: q?.blockId };
});

const independentScenarios = [
  {
    title: 'The Heterodox Maverick (বহুমাত্রিক স্বতন্ত্র চিন্তাবিদ)',
    desc: 'Takes strong, principled stances on every issue, but mixes pro-market economics, radical anti-authoritarianism, judicial independence, and women rights. Defies any single party line.',
    answers: heterodoxAnswers
  },
  {
    title: 'The Pure Civil Libertarian (উদার নাগরিক স্বাধীনতাবাদী)',
    desc: 'Refuses to compromise on civil liberties, human rights, and freedom of speech. Distrusts all political machines (AL, BNP, JI) who seek executive hegemony.',
    answers: libertarianAnswers
  },
  {
    title: 'The Centrist Pragmatist (বাস্তববাদী সংশয়ী মধ্যপন্থী)',
    desc: 'Prefers institutional stability, gradual consensus, checks on extremism from both left and right, and rejects radical street mobilization or partisan dogmatism.',
    answers: pragmaticAnswers
  }
];

independentScenarios.forEach(sc => {
  const res = calculateComprehensiveAnalysis(sc.answers);
  const qName = QUADRANT_PROFILES[res.quadrant]?.name || res.quadrant;

  console.log(`🌟 ARCHETYPE: ${sc.title}`);
  console.log(`   Description: ${sc.desc}`);
  console.log(`   Coordinates: (X=${res.coordinates.x > 0 ? '+' : ''}${res.coordinates.x}, Y=${res.coordinates.y > 0 ? '+' : ''}${res.coordinates.y}) | Quadrant: ${qName}`);
  console.log(`   Match Type:  ${res.matchType} | Primary Bloc: ${res.primaryBloc.profile?.name || res.primaryBloc.key} (${res.primaryBloc.percentage ? res.primaryBloc.percentage + '%' : 'N/A'})`);
  console.log(`   Top 3 Bloc Affinities:`);
  res.sortedBlocs.slice(0, 3).forEach((b, i) => {
    console.log(`      ${i+1}. ${b.profile.name}: ${b.percentage}% (Share: ${b.relativeShare}%)`);
  });
  console.log(`   Confidence: Margin=${res.confidence.margin}% (Close Call: ${res.confidence.isCloseCall})`);
  console.log(`   Historical Figures: ${res.personalities.slice(0, 2).map(p => `${p.nameBn} (${p.nationality})`).join(', ')}\n`);
});
