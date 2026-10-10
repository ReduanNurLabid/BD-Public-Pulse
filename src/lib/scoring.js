import { QUESTIONS, THEMATIC_BLOCKS, BLOC_PROFILES, QUADRANT_PROFILES } from '../data/questions.js';

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
 */

export const MODEL_VERSION = 'v4-2026-10';

// ---- Tunables ---------------------------------------------------------------
const NEUTRAL_SHARE_FOR_MIXED = 0.60;   // >=60% neutral/skipped -> "Mixed / Undecided"
const NO_MATCH_THRESHOLD = 52;          // top similarity below this -> "No clear match"
const CLOSE_CALL_MARGIN = 6;            // top-2 gap (percentage points) below this -> close call
const MIN_ANSWERS_FOR_STATS = 16;       // fewer valid answers than this -> not "reliable" (for 24Q set)
const STRAIGHTLINE_SHARE = 0.90;        // >=90% of decided answers on the same side -> straight-lining
const STRAIGHTLINE_MIN_DECIDED = 10;
const CENTRIST_RADIUS = 16;             // compass: distance from origin treated as centre
const AFFINITY_CURVE = 1.35;            // contrast curve for similarity
const SHARE_POWER = 3.0;                // presentation-only normalisation for relativeShares
const MAX_COMPASS_DIST = 141.42;        // diameter of the -100..100 compass square
const RADIAL_WEIGHT = 0.8;              // personality match: intensity counts, but bearing leads

export const MASTER_PERSONALITIES = [
  // Auth-Left (x: -100 to 0, y: -100 to 0)
  { x: -85, y: -40, nationality: 'Bangladeshi', nameBn: 'মওলানা ভাসানী', nameEn: 'Maulana Bhashani', roleBn: 'মজলুম জননেতা ও ইসলামী সমাজতন্ত্রের প্রবক্তা', roleEn: 'Mass leader and advocate of Islamic socialism', img: '/personalities/portraits/bhashani.jpg' },
  { x: -30, y: -70, nationality: 'Regional', nameBn: 'নেতাজি সুভাষ চন্দ্র বসু', nameEn: 'Subhas Chandra Bose', roleBn: 'ব্রিটিশবিরোধী ভারতীয় স্বাধীনতা আন্দোলনের নেতা', roleEn: 'Indian independence leader who organized the Indian National Army', img: '/personalities/portraits/subhas-bose.jpg' },
  { x: -70, y: -60, nationality: 'Regional', nameBn: 'মাস্টারদা সূর্য সেন', nameEn: 'Surya Sen', roleBn: 'চট্টগ্রাম অস্ত্রাগার আক্রমণের নেতা ও ব্রিটিশবিরোধী বিপ্লবী', roleEn: 'Anti-colonial revolutionary and leader of the Chittagong armoury raid', img: '/personalities/portraits/surya-sen.jpg' },
  { x: -90, y: -50, nationality: 'Bangladeshi', nameBn: 'কমরেড মণি সিংহ', nameEn: 'Comrade Moni Singh', roleBn: 'কমিউনিস্ট বিপ্লবী নেতা', roleEn: 'Communist revolutionary and political leader', img: '/personalities/portraits/moni-singh.jpg' },
  { x: -40, y: -30, nationality: 'Bangladeshi', nameBn: 'বঙ্গবন্ধু শেখ মুজিবুর রহমান', nameEn: 'Sheikh Mujibur Rahman', roleBn: 'সমাজতান্ত্রিক ও ধর্মনিরপেক্ষ জাতীয়তাবাদের স্থপতি', roleEn: 'Founding leader of Bangladesh and its first president', img: '/personalities/portraits/mujib.jpg' },

  // Auth-Right (x: 0 to 100, y: -100 to 0)
  { x: 30, y: -60, nationality: 'Bangladeshi', nameBn: 'হুসেইন মুহাম্মদ এরশাদ', nameEn: 'H. M. Ershad', roleBn: 'সামরিক শাসক ও রক্ষণশীল জাতীয়তাবাদী', roleEn: 'Military ruler and conservative nationalist; later elected president', img: '/personalities/portraits/ershad.jpg' },
  { x: 70, y: -60, nationality: 'Bangladeshi', nameBn: 'হাজী শরীয়তুল্লাহ', nameEn: 'Haji Shariatullah', roleBn: 'ফরায়েজী আন্দোলনের প্রবর্তক', roleEn: 'Religious reformer and founder of the Faraizi movement in Bengal', img: '/personalities/portraits/shariatullah.jpg' },
  { x: 45, y: -45, nationality: 'Bangladeshi', nameBn: 'শহীদ জিয়াউর রহমান', nameEn: 'Ziaur Rahman', roleBn: 'বাংলাদেশী জাতীয়তাবাদ ও মুক্তবাজারের প্রবক্তা', roleEn: 'Bangladeshi president and founder of the Bangladesh Nationalist Party', img: '/personalities/portraits/ziaur-rahman.jpg' },
  { x: 20, y: -20, nationality: 'Regional', nameBn: 'স্যার সৈয়দ আহমেদ খান', nameEn: 'Sir Syed Ahmad Khan', roleBn: 'মুসলিম আধুনিকতাবাদী ও রক্ষণশীল চিন্তাবিদ', roleEn: 'Muslim modernist and conservative thinker', img: '/personalities/portraits/syed-ahmed.jpg' },

  // Lib-Left (x: -100 to 0, y: 0 to 100)
  { x: -60, y: 40, nationality: 'Bangladeshi', nameBn: 'তাজউদ্দীন আহমদ', nameEn: 'Tajuddin Ahmad', roleBn: 'প্রগতিশীল ও দূরদর্শী রাষ্ট্রনায়ক', roleEn: 'First prime minister of Bangladesh and leader of the wartime government', img: '/personalities/portraits/tajuddin.jpg' },

  { x: -50, y: 60, nationality: 'Regional', nameBn: 'ড. বি. আর. আম্বেদকর', nameEn: 'B.R. Ambedkar', roleBn: 'সামাজিক ন্যায়বিচারের প্রবক্তা', roleEn: 'Advocate for social justice', img: '/personalities/portraits/br-ambedkar.jpg' },
  { x: -60, y: 70, nationality: 'Regional', nameBn: 'মাহাত্মা গান্ধী', nameEn: 'Mahatma Gandhi', roleBn: 'অহিংস আন্দোলনের প্রবক্তা', roleEn: 'Advocate of nonviolent resistance', img: '/personalities/portraits/mahatma-gandhi.jpg' },

  // International historical comparators; coordinates are broad, illustrative placements.
  { x: -85, y: -50, nationality: 'International', nameBn: 'কার্ল মার্ক্স', nameEn: 'Karl Marx', roleBn: 'সমাজতান্ত্রিক চিন্তাবিদ ও দার্শনিক', roleEn: 'Socialist thinker and philosopher', img: '/personalities/portraits/karl-marx.jpg' },
  { x: 65, y: -75, nationality: 'International', nameBn: 'নেপোলিয়ন বোনাপার্ট', nameEn: 'Napoleon Bonaparte', roleBn: 'ফরাসি সম্রাট ও সামরিক নেতা', roleEn: 'French emperor and military leader', img: '/personalities/portraits/napoleao-bonaparte.jpg' },
  { x: 40, y: -30, nationality: 'International', nameBn: 'উইনস্টন চার্চিল', nameEn: 'Winston Churchill', roleBn: 'ব্রিটিশ প্রধানমন্ত্রী ও যুদ্ধকালীন নেতা', roleEn: 'British prime minister and wartime leader', img: '/personalities/portraits/winston-churchill.jpg' },
  { x: -15, y: 25, nationality: 'International', nameBn: 'আব্রাহাম লিংকন', nameEn: 'Abraham Lincoln', roleBn: 'মার্কিন প্রেসিডেন্ট; দাসপ্রথা বিলোপে নেতৃত্ব দেন', roleEn: 'U.S. president who led the abolition of slavery', img: '/personalities/portraits/abraham-lincoln.jpg' },

  // Other internationally known historical comparators outside South Asia.
  { x: -75, y: -65, nationality: 'International', nameBn: 'ফিদেল কাস্ত্রো', nameEn: 'Fidel Castro', roleBn: 'কিউবার বিপ্লবী ও রাষ্ট্রনেতা', roleEn: 'Cuban revolutionary and head of state', img: '/personalities/portraits/fidel-castro.jpg' },
  { x: 65, y: -60, nationality: 'International', nameBn: 'লি কুয়ান ইউ', nameEn: 'Lee Kuan Yew', roleBn: 'সিঙ্গাপুরের প্রতিষ্ঠাতা প্রধানমন্ত্রী', roleEn: 'Founding prime minister of Singapore', img: '/personalities/portraits/lee-kuan-yew.jpg' },
  { x: -45, y: 35, nationality: 'International', nameBn: 'নেলসন ম্যান্ডেলা', nameEn: 'Nelson Mandela', roleBn: 'দক্ষিণ আফ্রিকার গণতান্ত্রিক নেতা', roleEn: 'South African democratic leader', img: '/personalities/portraits/nelson-mandela.jpg' },
  { x: 55, y: 55, nationality: 'International', nameBn: 'থমাস জেফারসন', nameEn: 'Thomas Jefferson', roleBn: 'মার্কিন রাষ্ট্রনায়ক ও স্বাধীনতার ঘোষণাপত্রের রচয়িতা', roleEn: 'American statesman and principal author of the Declaration of Independence', img: '/personalities/portraits/thomas-jefferson.jpg' },
  { x: 65, y: 35, nationality: 'International', nameBn: 'মিল্টন ফ্রিডম্যান', nameEn: 'Milton Friedman', roleBn: 'মুক্তবাজার অর্থনীতিবিদ', roleEn: 'Free-market economist', img: '/personalities/portraits/milton-friedman.jpg' },

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
  summaryHeadline: 'অনেক প্রশ্নে নিরপেক্ষ বা উত্তর না দেওয়া হয়েছে, তাই কোনো একক প্রোফাইল দেখানো হয়নি।',
  shortDescription: 'নিরপেক্ষ বা বাদ দেওয়া উত্তরের কারণে ফলাফলকে মিশ্র হিসেবে দেখানো হয়েছে।',
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
  summaryHeadline: 'আপনার উত্তরগুলো স্কোরিং মডেলের কোনো প্রোফাইলের সঙ্গে যথেষ্ট সাদৃশ্য দেখায়নি।',
  shortDescription: 'কোনো একক প্রোফাইলের জন্য সাদৃশ্যের স্কোর নির্ধারিত সীমায় পৌঁছায়নি।',
  detailedDescription: 'এই ফলাফল কেবল এই জরিপের প্রোফাইলগুলোর সঙ্গে তুলনা বোঝায়; এটি আপনার রাজনৈতিক পরিচয় নির্ধারণ করে না।',
  coreValues: ['স্পষ্ট মিল নেই', 'জরিপের মডেলভিত্তিক তুলনা']
};

export function calculateComprehensiveAnalysis(answers) {
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

  QUESTIONS.forEach((q) => {
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

  // Presentation-only normalisation to sum to 100 (NOT a probability)
  const rawPowerWeights = blocKeys.map((key) => Math.pow((affinities[key] || 8) / 100, SHARE_POWER));
  const sumPowerWeights = rawPowerWeights.reduce((s, w) => s + w, 0) || 1;
  const relativeShares = {};
  let totalDistributed = 0;
  blocKeys.forEach((key, idx) => {
    const share = Math.round((rawPowerWeights[idx] / sumPowerWeights) * 100);
    relativeShares[key] = share;
    totalDistributed += share;
  });

  const sortedBlocs = [...blocKeys]
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
  const neutralOrSkipped = neutralAnswered + (QUESTIONS.length - answeredCount);
  const isMostlyNeutral = neutralOrSkipped >= QUESTIONS.length * NEUTRAL_SHARE_FOR_MIXED;
  const topPct = sortedBlocs[0]?.percentage ?? 0;
  const secondPct = sortedBlocs[1]?.percentage ?? 0;

  let matchType = 'bloc';
  let primaryBloc = { ...sortedBlocs[0] };
  const secondaryBloc = { ...sortedBlocs[1] };

  if (isMostlyNeutral) {
    matchType = 'mixed';
    primaryBloc = { key: 'Mixed', percentage: null, relativeShare: null, profile: MIXED_PROFILE };
  } else if (topPct < NO_MATCH_THRESHOLD) {
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
  const tooFewAnswers = answeredCount < MIN_ANSWERS_FOR_STATS;

  const reasons = [];
  if (tooFewAnswers) reasons.push('too_few_answers');
  if (straightLining) reasons.push('straight_lining');
  if (matchType === 'mixed') reasons.push('mostly_neutral');

  const quality = {
    reliable: reasons.length === 0,
    reasons,
    answeredCount,
    neutralShare: Math.round((neutralOrSkipped / QUESTIONS.length) * 100),
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

  const localPool = scoredPersonalities.filter(p => p.nationality !== 'International');
  const intlPool = scoredPersonalities.filter(p => p.nationality === 'International');

  const finalLocal = pickVariedMatch(localPool);
  const finalIntl = pickVariedMatch(intlPool);
  
  // Place our selected matches at the very front of the array so the UI picks them up first
  const variedPersonalities = [finalLocal, finalIntl, ...scoredPersonalities].filter(Boolean);

  return {
    modelVersion: MODEL_VERSION,
    matchType,
    coherenceScore,
    coordinates: { x: normalizedX, y: normalizedY, rawX, rawY },
    quadrant: quadrantKey,
    quadrantProfile: QUADRANT_PROFILES[quadrantKey],
    primaryBloc,
    secondaryBloc,
    sortedBlocs,
    answers: [...answerMap].map(([questionId, score]) => ({ questionId, score })),
    affinities,
    relativeShares,
    rawBlocScores: blocRawScores,
    blockResults,
    personalities: variedPersonalities,
    confidence,
    quality,
    answeredCount,
    totalQuestions: QUESTIONS.length,
    timestamp: new Date().toISOString()
  };
}
