import { QUESTIONS, THEMATIC_BLOCKS, BLOC_PROFILES, QUADRANT_PROFILES, getQuestionsForLength, inferQuizLength, getIdentity, CARD_ISSUES } from '../data/questions.js';
import { LEADER_PROFILES } from '../data/leaders.js';

/**
 * BD Political Compass 2026 — scoring.
 *
 * Output keys from the previous version are preserved; new keys are additive:
 *   quality, confidence, matchType, modelVersion
 *
 * IMPORTANT INTERPRETATION NOTE
 *   Bloc percentages are "similarity to the stated positions of each bloc in THIS
 *   test" — not support probabilities and not party membership. `relativeShares`
 *   is a presentation normalisation (sums to 100), not a statistical estimate.
 *
 * @param {Array<{ questionId: string, score: number }>} answers  score: integer 1..5
 * @param {{ length?: 'short'|'medium'|'long' }} [options]  which quiz length was taken;
 *   inferred from the answered ids when omitted. Only that length's questions are scored,
 *   so a short quiz is not diluted by questions it never asked.
 */

export const MODEL_VERSION = 'v6-2026-11';

// ---- Tunables ---------------------------------------------------------------
const NEUTRAL_SHARE_FOR_MIXED = 0.60;   // >=60% neutral/skipped -> "Mixed / Undecided"
const NO_MATCH_THRESHOLD = 52;
const TIE_MARGIN = 5;                   // top two camps closer than this -> no single camp is named          // top similarity below this -> "No clear match"
const CLOSE_CALL_MARGIN = 6;            // top-2 gap (percentage points) below this -> close call
const MIN_ANSWER_SHARE_FOR_STATS = 2 / 3; // answered fewer than this share of asked questions -> not "reliable"
const STRAIGHTLINE_SHARE = 0.90;        // >=90% of decided answers on the same side -> straight-lining
const STRAIGHTLINE_MIN_DECIDED = 10;
const CENTRIST_RADIUS = 16;             // compass: distance from origin treated as centre
const AFFINITY_CURVE = 1.35;            // contrast curve for similarity
const SHARE_POWER = 3.0;                // presentation-only normalisation for relativeShares
const MAX_COMPASS_DIST = 141.42;        // diameter of the -100..100 compass square
const RADIAL_WEIGHT = 0.8;              // personality match: intensity counts, but bearing leads

// Who a party's own supporters honour, with how often each should appear. Compass
// position alone can hand someone a figure their camp rejects (a Jamaat match
// getting Sheikh Mujib, a BNP match getting him, an AL match getting Ziaur Rahman),
// which reads as an insult on a card people are meant to post. Camps not listed
// here have no such conflict and are matched on compass position alone.
const CAMP_FIGURES = {
  JI: { 'Haji Shariatullah': 3, 'A. K. Fazlul Huq': 1 },
  BNP: { 'Ziaur Rahman': 3, 'Begum Khaleda Zia': 3, 'A. K. Fazlul Huq': 1, 'Maulana Bhashani': 1 },
  AL: { 'Sheikh Mujibur Rahman': 3, 'Tajuddin Ahmad': 1, 'H. S. Suhrawardy': 1 },
  Student: { 'Sharif Osman Hadi': 3, 'Maulana Bhashani': 2 }
};
// July-movement supporters are never paired with the Awami League's founding leaders.
const CAMP_EXCLUDED = { Student: ['Sheikh Mujibur Rahman', 'Tajuddin Ahmad'] };

// Questions only Awami League supporters tend to agree with, and the answer
// that side gives (+1 agree). Allowing the party back is also agreed with by
// many outside AL, so on its own it never reaches the minimum signal.
const AL_LINE = { c41: 1, c35: 1, c36: 1, c40: 1, c38: 1 };
// Answers that rule a person out of the AL camp: wanting the party kept out of
// politics, calling Ziaur Rahman the true declarer of independence, or saying the
// opposition is fully free under this government. Disagreeing proves nothing,
// since most people outside BNP disagree with the last two.
const AL_LINE_VETOES = [{ id: 'c35', when: 'disagree' }, { id: 'c43', when: 'agree' }, { id: 'c44', when: 'agree' }];
const AL_LINE_MIN_SIGNAL = 2;
// When the defining questions lean only slightly, the camp must also lead the
// other by this much overall before it is named.
const AL_BNP_CLEAR_LEAD = 6;

function alLineSignal(answerMap) {
  const vetoed = AL_LINE_VETOES.some(({ id, when }) => {
    const answer = answerMap.get(id);
    return answer !== undefined && (when === 'agree' ? answer >= 4 : answer <= 2);
  });
  if (vetoed) return -Infinity;
  let signal = 0;
  for (const [id, direction] of Object.entries(AL_LINE)) {
    const answer = answerMap.get(id);
    if (answer === undefined || answer === 3) continue;
    signal += (answer > 3 ? 1 : -1) * direction;
  }
  return signal;
}

// Camps a person's result never lists beside their own. Being told your second
// closest camp is the one you oppose reads as an accusation, not a finding.
const HIDDEN_BLOCS = { AL: ['BNP', 'JI', 'Student'], BNP: ['AL'], JI: ['AL'], Student: ['AL'] };

// Figures from Bangladesh's own history who are still widely honoured.
export const MASTER_PERSONALITIES = [
  // Auth-Left (x: -100 to 0, y: -100 to 0)
  { x: -85, y: -40, nationality: 'Bangladeshi', nameBn: 'মওলানা ভাসানী', nameEn: 'Maulana Bhashani', roleBn: 'মজলুম জননেতা ও ইসলামী সমাজতন্ত্রের প্রবক্তা', roleEn: 'Mass leader and advocate of Islamic socialism', img: '/personalities/portraits/bhashani.jpg' },
  { x: -70, y: -60, nationality: 'Bangladeshi', nameBn: 'মাস্টারদা সূর্য সেন', nameEn: 'Surya Sen', roleBn: 'চট্টগ্রাম অস্ত্রাগার আক্রমণের নেতা ও ব্রিটিশবিরোধী বিপ্লবী', roleEn: 'Anti-colonial revolutionary and leader of the Chittagong armoury raid', img: '/personalities/portraits/surya-sen.jpg' },
  { x: -90, y: -50, nationality: 'Bangladeshi', nameBn: 'কমরেড মণি সিংহ', nameEn: 'Comrade Moni Singh', roleBn: 'কমিউনিস্ট বিপ্লবী নেতা', roleEn: 'Communist revolutionary and political leader', img: '/personalities/portraits/moni-singh.jpg' },
  { x: -40, y: -30, nationality: 'Bangladeshi', nameBn: 'শেখ মুজিবুর রহমান', nameEn: 'Sheikh Mujibur Rahman', roleBn: 'সমাজতান্ত্রিক ও ধর্মনিরপেক্ষ জাতীয়তাবাদের স্থপতি', roleEn: 'Founding leader of Bangladesh and its first president', img: '/personalities/portraits/mujib.jpg' },

  // Auth-Right (x: 0 to 100, y: -100 to 0)
  { x: 70, y: -60, nationality: 'Bangladeshi', nameBn: 'হাজী শরীয়তুল্লাহ', nameEn: 'Haji Shariatullah', roleBn: 'ফরায়েজী আন্দোলনের প্রবর্তক', roleEn: 'Religious reformer and founder of the Faraizi movement in Bengal', img: '/personalities/portraits/shariatullah.jpg' },
  { x: 45, y: -45, nationality: 'Bangladeshi', nameBn: 'জিয়াউর রহমান', nameEn: 'Ziaur Rahman', roleBn: 'বাংলাদেশী জাতীয়তাবাদ ও মুক্তবাজারের প্রবক্তা', roleEn: 'Bangladeshi president and founder of the Bangladesh Nationalist Party', img: '/personalities/portraits/ziaur-rahman.jpg' },
  { x: 40, y: -35, nationality: 'Bangladeshi', nameBn: 'বেগম খালেদা জিয়া', nameEn: 'Begum Khaleda Zia', roleBn: 'বাংলাদেশের প্রথম নারী প্রধানমন্ত্রী', roleEn: 'First woman prime minister of Bangladesh', img: '/personalities/portraits/khaleda-zia.jpg' },

  // Lib-Left (x: -100 to 0, y: 0 to 100)
  { x: -60, y: 40, nationality: 'Bangladeshi', nameBn: 'তাজউদ্দীন আহমদ', nameEn: 'Tajuddin Ahmad', roleBn: 'প্রগতিশীল ও দূরদর্শী রাষ্ট্রনায়ক', roleEn: 'First prime minister of Bangladesh and leader of the wartime government', img: '/personalities/portraits/tajuddin.jpg' },
  { x: -40, y: 30, nationality: 'Bangladeshi', nameBn: 'শরীফ ওসমান হাদি', nameEn: 'Sharif Osman Hadi', roleBn: 'জুলাই অভ্যুত্থানের সংগঠক ও ইনকিলাব মঞ্চের মুখপাত্র', roleEn: 'July uprising organiser and Inqilab Mancha spokesperson', img: '/personalities/portraits/osman-hadi.jpg' },




  // Lib-Right (x: 0 to 100, y: 0 to 100)
  { x: 30, y: 30, nationality: 'Bangladeshi', nameBn: 'হোসেন শহীদ সোহ্‌রাওয়ার্দী', nameEn: 'H. S. Suhrawardy', roleBn: 'গণতন্ত্রের মানসপুত্র ও উদারবাদী নেতা', roleEn: 'Bengali statesman and prime minister of Pakistan', img: '/personalities/portraits/suhrawardy.jpg' },

  // Centrist (x: -30 to 30, y: -30 to 30)
  { x: -10, y: -5, nationality: 'Bangladeshi', nameBn: 'শেরে বাংলা এ. কে. ফজলুল হক', nameEn: 'A. K. Fazlul Huq', roleBn: 'কৃষক-প্রজা দরদি ও কল্যাণকামী নেতা', roleEn: 'Bengali statesman and chief minister of undivided Bengal', img: '/personalities/portraits/fazlul-huq.jpg' }
];
// -----------------------------------------------------------------------------

const QUESTION_IDS = new Set(QUESTIONS.map((q) => q.id));

const MIXED_PROFILE = {
  key: 'Mixed',
  name: 'মিশ্র / স্পষ্ট নয়',
  englishName: 'Mixed / Unclear',
  color: '#94A3B8',
  secondaryColor: '#64748B',
  badge: 'অনেক উত্তর নিরপেক্ষ বা বাদ',
  iconLetter: '👁️',
  symbolEmoji: '⚖️',
  summaryHeadline: 'অনেক প্রশ্নে আপনি নিশ্চিত ছিলেন না, তাই আপনাকে কোনো একটি ধারায় ফেলা হয়নি।',
  shortDescription: 'আপনার মত মিশ্র, কোনো একদিকে ঝুঁকে নেই।',
  detailedDescription: 'এই ফলাফল কোনো রাজনৈতিক পরিচয় নির্ধারণ করে না। আরও প্রশ্নের উত্তর দিলে প্রোফাইলের তুলনা বদলাতে পারে।',
  coreValues: ['মিশ্র উত্তর', 'কোনো একক প্রোফাইল নয়']
};

const NO_MATCH_PROFILE = {
  key: 'NoMatch',
  name: 'স্পষ্ট মিল নেই',
  englishName: 'No clear match',
  color: '#8B5CF6',
  secondaryColor: '#7C3AED',
  badge: 'কোনো প্রোফাইলের সঙ্গে যথেষ্ট সাদৃশ্য নেই',
  iconLetter: '★',
  symbolEmoji: '🧠',
  summaryHeadline: 'আপনি কোনো দলের ছকে পড়েন না — আপনার মত নিজের মতো।',
  shortDescription: 'কোনো একটি ধারার সাথে স্পষ্ট মিল পাওয়া যায়নি।',
  detailedDescription: 'এই ফলাফল কেবল এই জরিপের প্রোফাইলগুলোর সঙ্গে তুলনা বোঝায়; এটি আপনার রাজনৈতিক পরিচয় নির্ধারণ করে না।',
  coreValues: ['স্বাধীন চিন্তা', 'কোনো একক ধারায় নয়']
};

export function calculateComprehensiveAnalysis(answers, options = {}) {
  // -------------------------------------------------------------------------
  // 1. Input sanitisation: only known question ids, integer scores 1..5,
  //    duplicates resolved "last answer wins". Prevents NaN / out-of-range input
  //    from corrupting coordinates.
  // -------------------------------------------------------------------------
  const answerMap = new Map();
  (Array.isArray(answers) ? answers : []).forEach((ans) => {
    if (!ans || typeof ans.questionId !== 'string' || !QUESTION_IDS.has(ans.questionId)) return;
    const n = Number(ans.score);
    if (!Number.isInteger(n) || n < 1 || n > 5) return;
    answerMap.set(ans.questionId, n);
  });
  const quizLength = options.length || inferQuizLength([...answerMap.keys()]);
  const activeQuestions = getQuestionsForLength(quizLength);
  const activeIds = new Set(activeQuestions.map((q) => q.id));
  for (const id of [...answerMap.keys()]) {
    if (!activeIds.has(id)) answerMap.delete(id);
  }
  const answeredCount = answerMap.size;
  const answeredValues = [...answerMap.values()];

  let rawX = 0;
  let maxX = 0;
  let rawY = 0;
  let maxY = 0;

  const blocKeys = Object.keys(BLOC_PROFILES);
  const blocRawScores = {};
  const blocMaxPossible = {};
  const blocMinPossible = {};
  blocKeys.forEach((k) => {
    blocRawScores[k] = 0;
    blocMaxPossible[k] = 0;
    blocMinPossible[k] = 0;
  });

  // 8 thematic blocks: net bipolar accumulation
  const blockAnalytics = {};
  THEMATIC_BLOCKS.forEach((b) => {
    blockAnalytics[b.id] = { rawBipolar: 0, maxPossible: 0, answers: [] };
  });

  activeQuestions.forEach((q) => {
    const answered = answerMap.has(q.id);
    const scoreVal = answered ? answerMap.get(q.id) : 3; // unanswered counts as neutral
    // Multiplier: 1 -> -2, 2 -> -1, 3 -> 0, 4 -> +1, 5 -> +2
    const multiplier = scoreVal - 3;

    // Compass X: Economic (- collectivist, + free market)
    rawX += multiplier * (q.x_weight || 0);
    maxX += 2 * Math.abs(q.x_weight || 0);

    // Compass Y: Governance (- authoritarian, + libertarian)
    rawY += multiplier * (q.y_weight || 0);
    maxY += 2 * Math.abs(q.y_weight || 0);

    // Bloc similarity accumulation
    const bw = q.bloc_weights || {};
    for (const [blocKey, weight] of Object.entries(bw)) {
      if (blocRawScores[blocKey] !== undefined) {
        blocRawScores[blocKey] += multiplier * weight;
        blocMaxPossible[blocKey] += 2 * Math.abs(weight);
        blocMinPossible[blocKey] -= 2 * Math.abs(weight);
      }
    }

    // Block bipolar score. q.direction: +1 = agreeing moves toward the RIGHT pole, -1 = LEFT pole.
    // Sentiment questions (kind:'sentiment') — q3 (extortion), q6 (opposition), q31 (July uprising)
    // — carry zero compass weight and are measurement items, not trade-offs. They still feed
    // bloc matching (bloc_weights accumulation above) and the dashboard wedge-issue charts,
    // but must NOT contribute to the Block 1/2/7 bipolar bars. Skipping them here keeps
    // maxPossible and rawBipolar in sync so the bar denominator is not inflated.
    if (q.kind !== 'sentiment') {

      const blk = blockAnalytics[q.blockId];
      if (blk) {
        const polarity = q.direction !== undefined ? q.direction : 1;
        const weightMagn = Math.max(Math.abs(q.x_weight || 0), Math.abs(q.y_weight || 0), 1.0);
        blk.rawBipolar += multiplier * polarity * weightMagn;
        blk.maxPossible += 2 * weightMagn;
        if (answered && scoreVal !== 3) blk.answers.push(multiplier * polarity);
      }
    }
  });

  // Normalised 2D coordinates (-100..+100)
  const normalizedX = maxX > 0 ? Math.round((rawX / maxX) * 100) : 0;
  const normalizedY = maxY > 0 ? Math.round((rawY / maxY) * 100) : 0;

  // Quadrant
  const distanceFromOrigin = Math.sqrt(normalizedX * normalizedX + normalizedY * normalizedY);
  let quadrantKey;
  if (distanceFromOrigin <= CENTRIST_RADIUS) quadrantKey = 'centrist';
  else if (normalizedX < 0 && normalizedY >= 0) quadrantKey = 'libertarian_left';
  else if (normalizedX >= 0 && normalizedY >= 0) quadrantKey = 'libertarian_right';
  else if (normalizedX < 0 && normalizedY < 0) quadrantKey = 'authoritarian_left';
  else quadrantKey = 'authoritarian_right';

  // -------------------------------------------------------------------------
  // 2. Nearest-prototype similarity (weighted agreement with each bloc's
  //    expected answer pattern, 0..1), then a contrast curve.
  //    Unanswered/neutral items contribute 0 but still count in the denominator,
  //    so sparse answers shrink every bloc toward the middle (no false confidence).
  // -------------------------------------------------------------------------
  const affinities = {};
  blocKeys.forEach((key) => {
    const raw = blocRawScores[key];
    const max = blocMaxPossible[key] || 1;
    const min = blocMinPossible[key] || -1;
    const policyFactor = Math.max(0, Math.min(1, (raw - min) / (max - min)));
    let pct = Math.round(Math.pow(policyFactor, AFFINITY_CURVE) * 100);
    affinities[key] = Math.max(8, Math.min(96, pct));
  });

  const closestBloc = [...blocKeys].sort((a, b) => affinities[b] - affinities[a] || blocRawScores[b] - blocRawScores[a])[0];
  const alSignal = alLineSignal(answerMap);
  const alLine = alSignal >= AL_LINE_MIN_SIGNAL;
  // The closest camp is AL or BNP, but the defining questions point the other way: too close to
  // call between AL and BNP, so neither label is applied.
  const alLead = affinities.AL - affinities.BNP;
  const unconfirmedCamp = (closestBloc === 'AL' && !alLine && !(alSignal >= 1 && alLead > AL_BNP_CLEAR_LEAD))
    || (closestBloc === 'BNP' && (alLine || (alSignal >= 1 && -alLead <= AL_BNP_CLEAR_LEAD)));
  const hiddenBlocs = unconfirmedCamp ? ['AL', 'BNP'] : HIDDEN_BLOCS[closestBloc] || (alLine ? [] : ['AL']);
  const visibleBlocKeys = blocKeys.filter((key) => !hiddenBlocs.includes(key));

  // Presentation-only normalisation to sum to 100 (NOT a probability)
  const rawPowerWeights = visibleBlocKeys.map((key) => Math.pow((affinities[key] || 8) / 100, SHARE_POWER));
  const sumPowerWeights = rawPowerWeights.reduce((s, w) => s + w, 0) || 1;
  const relativeShares = {};
  let totalDistributed = 0;
  visibleBlocKeys.forEach((key, idx) => {
    const share = Math.round((rawPowerWeights[idx] / sumPowerWeights) * 100);
    relativeShares[key] = share;
    totalDistributed += share;
  });

  const sortedBlocs = [...visibleBlocKeys]
    .map((key) => ({
      key,
      percentage: affinities[key],
      relativeShare: relativeShares[key] || 0,
      profile: BLOC_PROFILES[key]
    }))
    .sort((a, b) => {
      if (b.percentage !== a.percentage) return b.percentage - a.percentage;
      return blocRawScores[b.key] - blocRawScores[a.key];
    });

  // Fix rounding so shares sum to exactly 100
  const highest = sortedBlocs[0];
  if (highest) {
    const delta = 100 - totalDistributed;
    relativeShares[highest.key] += delta;
    highest.relativeShare += delta;
  }

  // -------------------------------------------------------------------------
  // 3. Result type: bloc / mixed (mostly neutral) / no clear match (low similarity)
  // -------------------------------------------------------------------------
  const neutralAnswered = answeredValues.filter((v) => v === 3).length;
  const neutralOrSkipped = neutralAnswered + (activeQuestions.length - answeredCount);
  const isMostlyNeutral = neutralOrSkipped >= activeQuestions.length * NEUTRAL_SHARE_FOR_MIXED;
  const topPct = sortedBlocs[0]?.percentage ?? 0;
  const secondPct = sortedBlocs[1]?.percentage ?? 0;

  let matchType = 'bloc';
  let primaryBloc = { ...sortedBlocs[0] };
  const secondaryBloc = { ...sortedBlocs[1] };

  if (isMostlyNeutral) {
    matchType = 'mixed';
    primaryBloc = { key: 'Mixed', percentage: null, relativeShare: null, profile: MIXED_PROFILE };
  } else if (topPct < NO_MATCH_THRESHOLD || unconfirmedCamp || topPct - secondPct < TIE_MARGIN) {
    matchType = 'no_clear_match';
    primaryBloc = { key: 'NoMatch', percentage: null, relativeShare: null, profile: NO_MATCH_PROFILE };
  }

  const margin = topPct - secondPct;
  const confidence = {
    margin,
    isCloseCall: matchType === 'bloc' && margin < CLOSE_CALL_MARGIN,
    topPercentage: topPct,
    runnerUp: secondaryBloc.key
  };

  // -------------------------------------------------------------------------
  // 4. Bipolar scores for all 8 thematic blocks (-100..+100)
  // -------------------------------------------------------------------------
  const blockResults = THEMATIC_BLOCKS.map((b) => {
    const data = blockAnalytics[b.id];
    const bipolarScore = data.maxPossible > 0 ? Math.round((data.rawBipolar / data.maxPossible) * 100) : 0;

    let leaningSide = 'center';
    let leaningLabel = 'ভারসাম্যপূর্ণ / নিরপেক্ষ';
    const leaningMagnitude = Math.abs(bipolarScore);

    if (bipolarScore > 10) {
      leaningSide = 'right';
      leaningLabel = `${b.rightShort} (+${bipolarScore}%)`;
    } else if (bipolarScore < -10) {
      leaningSide = 'left';
      leaningLabel = `${b.leftShort} (${bipolarScore}%)`;
    }

    return {
      id: b.id,
      key: b.key,
      title: b.title,
      subtitle: b.subtitle,
      leftPole: b.leftPole,
      rightPole: b.rightPole,
      leftShort: b.leftShort,
      rightShort: b.rightShort,
      bipolarScore,
      leaningSide,
      leaningLabel,
      leaningMagnitude
    };
  });

  // -------------------------------------------------------------------------
  // 5. Coherence: spread of direction-adjusted answers within each block.
  //    Also acts as an acquiescence detector (agreeing with everything makes
  //    direction-adjusted answers cancel out -> low coherence).
  // -------------------------------------------------------------------------
  let totalVariance = 0;
  let activeBlocks = 0;
  Object.values(blockAnalytics).forEach((data) => {
    if (data.answers.length > 0) {
      const mean = data.answers.reduce((a, v) => a + v, 0) / data.answers.length;
      const variance = data.answers.reduce((a, v) => a + Math.pow(v - mean, 2), 0) / data.answers.length;
      totalVariance += variance;
      activeBlocks++;
    }
  });
  const avgVariance = activeBlocks > 0 ? totalVariance / activeBlocks : 0;
  const coherenceScore = activeBlocks > 0
    ? Math.max(0, Math.min(100, Math.round(100 - (avgVariance / 4) * 100)))
    : 0;

  // -------------------------------------------------------------------------
  // 6. Response quality — use `quality.reliable` to decide whether a response
  //    should be counted in the PUBLIC live statistics.
  // -------------------------------------------------------------------------
  const agreeCount = answeredValues.filter((v) => v >= 4).length;
  const disagreeCount = answeredValues.filter((v) => v <= 2).length;
  const decided = agreeCount + disagreeCount;
  const straightLining =
    decided >= STRAIGHTLINE_MIN_DECIDED && Math.max(agreeCount, disagreeCount) / decided >= STRAIGHTLINE_SHARE;
  const tooFewAnswers = answeredCount < Math.ceil(activeQuestions.length * MIN_ANSWER_SHARE_FOR_STATS);

  const reasons = [];
  if (tooFewAnswers) reasons.push('too_few_answers');
  if (straightLining) reasons.push('straight_lining');
  if (matchType === 'mixed') reasons.push('mostly_neutral');

  const quality = {
    reliable: reasons.length === 0,
    reasons,
    answeredCount,
    neutralShare: Math.round((neutralOrSkipped / activeQuestions.length) * 100),
    agreeShare: decided ? Math.round((agreeCount / decided) * 100) : 0,
    straightLining
  };

  // Personalities are matched by DIRECTION first and intensity second. Ideology
  // is the bearing from the origin; the radial distance is only how strongly that
  // position is held. The cost is rectified-polar: bearing cost and radial cost are
  // combined orthogonally, so a figure pointing the same way wins even when it sits
  // closer to the centre than the respondent. Without this, minority-direction
  // figures are starved by figures that happen to share their radius.
  //
  // Inside CENTRIST_RADIUS a respondent has no meaningful bearing (the angle is
  // numerically volatile there), so those users fall back to plain Euclidean
  // distance and are matched on proximity instead.
  const userRadius = Math.hypot(normalizedX, normalizedY);
  const hasBearing = userRadius > CENTRIST_RADIUS;

  const scoredPersonalities = MASTER_PERSONALITIES.map(p => {
    let dist;
    if (hasBearing) {
      let delta = Math.atan2(p.y, p.x) - Math.atan2(normalizedY, normalizedX);
      delta = Math.atan2(Math.sin(delta), Math.cos(delta)); // wrap to -PI..PI
      const bearingCost = (Math.abs(delta) / Math.PI) * MAX_COMPASS_DIST;
      const radialCost = Math.abs(userRadius - Math.hypot(p.x, p.y)) * RADIAL_WEIGHT;
      dist = Math.hypot(bearingCost, radialCost);
    } else {
      dist = Math.hypot(normalizedX - p.x, normalizedY - p.y);
    }
    let comp = Math.round(100 - (dist / MAX_COMPASS_DIST) * 35);
    if (comp > 99) comp = 99;
    if (comp < 30) comp = 30;
    return { ...p, distance: dist, compatibility: comp };
  }).sort((a, b) => a.distance - b.distance);

  // To prevent the exact same pair of personalities dominating large regions of the compass,
  // we introduce deterministic variety. We compute a fingerprint hash from the user's specific answers.
  let answerHash = 0;
  for (const [qId, score] of answerMap) {
    const num = parseInt(qId.replace(/[^0-9]/g, ''), 10) || 1;
    answerHash += num * score;
  }

  // Pick a candidate from the pool of closely-matched figures
  function pickVariedMatch(pool) {
    if (pool.length === 0) return null;
    const best = pool[0];
    
    // Find all personalities whose distance is within 25 points of the absolute best match.
    // This ensures we only swap if the alternative is genuinely a good logical match too.
    const candidates = pool.filter(p => (p.distance - best.distance) <= 25);
    
    if (candidates.length <= 1) return best;
    
    // Pick deterministically so the same user answers always yield the same person,
    // but users with different answers in the same region get different matches.
    const selectedIndex = answerHash % candidates.length;
    return candidates[selectedIndex];
  }

  function pickForCamp(pool, campKey) {
    const honoured = CAMP_FIGURES[campKey];
    if (!honoured) {
      const excluded = CAMP_EXCLUDED[campKey] || [];
      return pickVariedMatch(pool.filter((p) => !excluded.includes(p.nameEn)));
    }
    const weighted = pool
      .filter((p) => honoured[p.nameEn])
      .flatMap((p) => Array(honoured[p.nameEn]).fill(p));
    return weighted[answerHash % weighted.length];
  }

  const finalPick = pickForCamp(scoredPersonalities, primaryBloc.key);

  // Place our selected match at the very front so the UI picks it up first
  const variedPersonalities = [finalPick, ...scoredPersonalities].filter(Boolean);

  return {
    modelVersion: MODEL_VERSION,
    matchType,
    coherenceScore,
    coordinates: { x: normalizedX, y: normalizedY, rawX, rawY },
    quadrant: quadrantKey,
    quadrantProfile: QUADRANT_PROFILES[quadrantKey],
    identity: getIdentity(quadrantKey, (id) => answerMap.get(id)),
    govMeter: governmentMeter(answerMap, activeQuestions),
    primaryBloc,
    secondaryBloc,
    sortedBlocs,
    answers: [...answerMap].map(([questionId, score]) => ({ questionId, score })),
    affinities,
    relativeShares,
    rawBlocScores: blocRawScores,
    blockResults,
    personalities: variedPersonalities,
    historicalPick: finalPick,
    confidence,
    quality,
    answeredCount,
    totalQuestions: activeQuestions.length,
    quizLength,
    leaderMatches: options.skipLeaders ? [] : matchLeaders(answerMap, activeQuestions, quizLength, primaryBloc.key, alLine),
    timestamp: new Date().toISOString()
  };
}


// ---------------------------------------------------------------------------
// Living-leader matching.
//
// Each leader has an answer to every question (src/data/leaders.js). A user is
// compared by direction of opinion on the questions they actually answered:
//   relative share = softmax of the cosine between the two answer vectors,
// shared out so the leaders shown always total exactly 100.
//
// A leader's compass position is not hand-placed. It is computed by feeding
// their answers through calculateComprehensiveAnalysis for the same quiz
// length, so leaders and respondents always share one scale.
// ---------------------------------------------------------------------------
const leaderPositionCache = new Map();

export function getLeaderPositions(quizLength) {
  if (!leaderPositionCache.has(quizLength)) {
    const questions = getQuestionsForLength(quizLength);
    leaderPositionCache.set(quizLength, Object.fromEntries(LEADER_PROFILES.map((leader) => {
      const answers = questions.map((q) => ({ questionId: q.id, score: leader.answers[q.id] ?? 3 }));
      const result = calculateComprehensiveAnalysis(answers, { length: quizLength, skipLeaders: true });
      return [leader.id, { x: result.coordinates.x, y: result.coordinates.y }];
    })));
  }
  return leaderPositionCache.get(quizLength);
}

// The live issue this leader and the user most agree on, and most disagree on.
function sharedIssues(answerMap, leader) {
  let agreeOn = null;
  let disagreeOn = null;
  let agreeGap = Infinity;
  let disagreeGap = -1;
  CARD_ISSUES.forEach((issue) => {
    const mine = answerMap.get(issue.id);
    const theirs = leader.answers[issue.id];
    if (mine === undefined || theirs === undefined || mine === 3 || theirs === 3) return;
    const gap = Math.abs(mine - theirs);
    if ((mine > 3) === (theirs > 3)) {
      if (gap < agreeGap) { agreeGap = gap; agreeOn = issue; }
    } else if (gap > disagreeGap) {
      disagreeGap = gap;
      disagreeOn = issue;
    }
  });
  return { agreeOn, disagreeOn };
}

// How sharply the share separates leaders; tuned so typical respondents show a
// clear order without one leader taking everything.
const LEADER_SHARE_SHARPNESS = 3;
const TOP_LEADERS_SHOWN = 3;
const CAMPS_AGAINST_AL = ['BNP', 'JI', 'Student'];
// Those an AL-camp result would resent seeing as a match.
const AL_CAMP_HIDDEN_LEADERS = ['tarique', 'yunus', 'nahid', 'shafiqur'];

function matchLeaders(answerMap, activeQuestions, quizLength, camp, alLine) {
  const positions = getLeaderPositions(quizLength);
  // Compare the direction of opinion, measured from "unsure" (cosine
  // similarity), not the distance between answers. Plain distance rewarded any
  // leader with moderate positions, whoever the respondent was.
  const scored = LEADER_PROFILES.map((leader) => {
    let dot = 0;
    let mineSquared = 0;
    let theirsSquared = 0;
    let asked = 0;
    let compared = 0;
    activeQuestions.forEach((q) => {
      const mine = answerMap.get(q.id);
      const theirs = leader.answers[q.id];
      if (mine === undefined) return;
      asked += 1;
      if (theirs === undefined) return;
      compared += 1;
      dot += (mine - 3) * (theirs - 3);
      mineSquared += (mine - 3) ** 2;
      theirsSquared += (theirs - 3) ** 2;
    });
    // Agreement over fewer questions swings further by chance, so a leader with
    // blank answers is scaled to the same footing as one compared on them all.
    const coverage = asked ? Math.sqrt(compared / asked) : 0;
    const cosine = mineSquared && theirsSquared ? (dot / Math.sqrt(mineSquared * theirsSquared)) * coverage : 0;
    return { leader, weight: Math.exp(LEADER_SHARE_SHARPNESS * cosine) };
  });

  // Sheikh Hasina appears only on results confirmed as AL, and never beside Tarique
  // Rahman. Someone leaning her way without that confirmation sees neither.
  const weightOf = (id) => scored.find((item) => item.leader.id === id).weight;
  const leansHasina = !CAMPS_AGAINST_AL.includes(camp) && alLine && weightOf('hasina') > weightOf('tarique');
  const hiddenLeaders = camp === 'AL' ? AL_CAMP_HIDDEN_LEADERS : leansHasina ? ['hasina', 'tarique'] : ['hasina'];
  const shown = scored
    .filter(({ leader }) => !hiddenLeaders.includes(leader.id))
    .sort((a, b) => b.weight - a.weight)
    .slice(0, TOP_LEADERS_SHOWN);

  // Shares of 100, whole numbers, summing to exactly 100 (largest remainder).
  const totalWeight = shown.reduce((sum, item) => sum + item.weight, 0);
  const shares = shown.map((item) => (item.weight / totalWeight) * 100);
  const floors = shares.map(Math.floor);
  let remaining = 100 - floors.reduce((sum, v) => sum + v, 0);
  shares
    .map((value, index) => ({ index, fraction: value - floors[index] }))
    .sort((x, y) => y.fraction - x.fraction)
    .forEach(({ index }) => {
      if (remaining > 0) { floors[index] += 1; remaining -= 1; }
    });

  return shown.map(({ leader }, index) => ({
    id: leader.id,
    nameBn: leader.nameBn,
    nameEn: leader.nameEn,
    shortBn: leader.shortBn,
    shortEn: leader.shortEn,
    roleBn: leader.roleBn,
    roleEn: leader.roleEn,
    color: leader.color,
    photo: leader.photo,
    share: answerMap.size ? floors[index] : null,
    ...sharedIssues(answerMap, leader),
    position: positions[leader.id]
  })).sort((x, y) => (y.share ?? -1) - (x.share ?? -1));
}

// ---------------------------------------------------------------------------
// Comparable numbers for the share card.
// ---------------------------------------------------------------------------

// On questions where the prime minister and both main opposition leaders take
// opposite sides, the share of the user's decided answers on the government's
// side. Null when too few such questions were answered to mean anything.
function governmentMeter(answerMap, activeQuestions) {
  const byId = Object.fromEntries(LEADER_PROFILES.map((leader) => [leader.id, leader.answers]));
  const side = (score) => Math.sign(score - 3);
  let withGovernment = 0;
  let total = 0;
  activeQuestions.forEach((q) => {
    const mine = answerMap.get(q.id);
    if (mine === undefined || side(mine) === 0) return;
    const government = side(byId.tarique[q.id]);
    const jamaat = side(byId.shafiqur[q.id]);
    const ncp = side(byId.nahid[q.id]);
    if (government === 0 || jamaat !== -government || ncp !== -government) return;
    total += 1;
    if (side(mine) === government) withGovernment += 1;
  });
  return total >= 3 ? Math.round((withGovernment / total) * 100) : null;
}

