import {
  TRACKED_WEDGE_ISSUE_IDS,
  LIKERT_MIN,
  LIKERT_MAX,
  AGE_BUCKETS
} from '../data/questions.js';

/**
 * Builds the Firestore field-path increments for the raw accumulators.
 *
 * Split out of saveAssessmentResponse so the "first ever submission seeds the
 * document" path and the "document already exists" path cannot disagree about
 * what gets accumulated. Both paths must sum to the same totals, otherwise the
 * very first respondent's axes and wedge answers are silently lost.
 *
 * Returns a nested plain object of leaf -> addend, e.g.
 *   { thematicAxes: { state_power: { totalScore: -40, count: 1 } },
 *     wedgeIssues: { q32: { totalAnswers: 1, options: { '5': 1 } } } }
 */
export function buildAggregateAccumulators(data) {
  const axes = {};
  const wedges = {};

  // Thematic axes: sum the bipolar score, count the respondent.
  if (Array.isArray(data?.blockResults)) {
    data.blockResults.forEach(block => {
      if (!block || typeof block.key !== 'string') return;
      if (!Number.isFinite(block.bipolarScore)) return;

      if (!axes[block.key]) axes[block.key] = { totalScore: 0, count: 0 };
      axes[block.key].totalScore += Math.round(block.bipolarScore);
      axes[block.key].count += 1;
    });
  }

  // Wedge issues: histogram of the raw Likert answer for tracked question ids.
  if (Array.isArray(data?.answers)) {
    data.answers.forEach(answer => {
      if (!answer || !TRACKED_WEDGE_ISSUE_IDS.includes(answer.questionId)) return;

      const score = Number(answer.score);
      if (!Number.isInteger(score) || score < LIKERT_MIN || score > LIKERT_MAX) return;

      if (!wedges[answer.questionId]) {
        wedges[answer.questionId] = {
          totalAnswers: 0,
          options: Object.fromEntries(
            Array.from({ length: LIKERT_MAX - LIKERT_MIN + 1 }, (_, i) => [String(LIKERT_MIN + i), 0])
          )
        };
      }
      wedges[answer.questionId].totalAnswers += 1;
      wedges[answer.questionId].options[String(score)] += 1;
    });
  }

  return { axes, wedges };
}

const DIVISION_ALIASES = {
  Dhaka: ['ঢাকা', 'Dhaka'],
  Chittagong: ['চট্টগ্রাম', 'Chattogram', 'Chittagong'],
  Rajshahi: ['রাজশাহী', 'Rajshahi'],
  Khulna: ['খুলনা', 'Khulna'],
  Sylhet: ['সিলেট', 'Sylhet'],
  Rangpur: ['রংপুর', 'Rangpur'],
  Barisal: ['বরিশাল', 'Barishal', 'Barisal'],
  Mymensingh: ['ময়মনসিংহ', 'ময়মনসিংহ', 'Mymensingh']
};

const AGE_FILTER_GROUPS = [
  { key: '18_25', value: '18-25', matches: ['১৮-২৫'] },
  { key: '26_35', value: '26-35', matches: ['২৬-৩৫'] },
  { key: '36_45', value: '36-45', matches: ['৩৬-৪৫'] },
  { key: '46_plus', value: '46+', matches: ['৪৬-৬০', '৬০+'] }
];

function normalizeDivision(value) {
  if (typeof value !== 'string') return null;
  const cleaned = value.replace(' বিভাগ', '').trim();
  return Object.entries(DIVISION_ALIASES)
    .find(([, aliases]) => aliases.includes(cleaned))?.[0] || null;
}

function normalizeAge(value) {
  if (typeof value !== 'string' || !AGE_BUCKETS.includes(value)) return null;
  return AGE_FILTER_GROUPS.find(group =>
    group.matches.some(match => value.includes(match))
  )?.key || null;
}

function normalizeReligion(value) {
  if (value === 'ইসলাম' || value === 'Muslim') return 'Muslim';
  if (value === 'হিন্দু' || value === 'Hindu') return 'Hindu';
  if (['বৌদ্ধ', 'খ্রিস্টান', 'অন্যান্য', 'বলতে অনিচ্ছুক', 'Other', 'Others'].includes(value)) {
    return 'Others';
  }
  return null;
}

export function getDemographicBreakdownKey(filters = {}) {
  const parts = [];
  if (filters.division && filters.division !== 'ALL') {
    const division = normalizeDivision(filters.division);
    if (!division) return null;
    parts.push(`d-${division}`);
  }
  if (filters.age && filters.age !== 'ALL') {
    const group = AGE_FILTER_GROUPS.find(item => item.value === filters.age);
    if (!group) return null;
    parts.push(`a-${group.key}`);
  }
  if (filters.religion && filters.religion !== 'ALL') {
    const religion = normalizeReligion(filters.religion);
    if (!religion) return null;
    parts.push(`r-${religion}`);
  }
  return parts.length ? parts.join('__') : null;
}

export function getDemographicBreakdownKeys(demographics = {}) {
  const source = demographics || {};
  const values = {
    division: normalizeDivision(source.division),
    age: normalizeAge(source.ageRange),
    religion: normalizeReligion(source.religion)
  };
  const dimensions = Object.entries(values).filter(([, value]) => value);
  const keys = [];

  for (let mask = 1; mask < (1 << dimensions.length); mask += 1) {
    const filters = {};
    dimensions.forEach(([dimension, value], index) => {
      if (!(mask & (1 << index))) return;
      if (dimension === 'age') {
        filters.age = AGE_FILTER_GROUPS.find(group => group.key === value)?.value;
      } else {
        filters[dimension] = value;
      }
    });
    const key = getDemographicBreakdownKey(filters);
    if (key) keys.push(key);
  }
  return keys;
}

export function buildDemographicBreakdownAccumulators(data = {}) {
  const { axes, wedges } = buildAggregateAccumulators(data);
  const primaryBloc = typeof data.primaryBloc === 'object'
    ? data.primaryBloc?.key
    : data.primaryBloc;
  const quadrant = typeof data.quadrant === 'object'
    ? data.quadrant?.key
    : data.quadrant;
  const buckets = {};

  getDemographicBreakdownKeys(data.demographics).forEach(key => {
    buckets[key] = {
      totalResponses: 1,
      verifiedResponses: data.isVerified ? 1 : 0,
      blocs: primaryBloc ? { [primaryBloc]: { count: 1 } } : {},
      quadrants: quadrant ? { [quadrant]: { count: 1 } } : {},
      thematicAxes: Object.fromEntries(
        Object.entries(axes).map(([axisKey, value]) => [axisKey, { ...value }])
      ),
      wedgeIssues: Object.fromEntries(
        Object.entries(wedges).map(([questionId, value]) => [
          questionId,
          { ...value, options: { ...value.options } }
        ])
      )
    };
  });

  return buckets;
}

export function mergeDemographicBreakdownAccumulators(target, source) {
  Object.entries(source || {}).forEach(([key, delta]) => {
    const bucket = target[key] ||= {
      totalResponses: 0,
      verifiedResponses: 0,
      blocs: {},
      quadrants: {},
      thematicAxes: {},
      wedgeIssues: {}
    };
    bucket.totalResponses += delta.totalResponses || 0;
    bucket.verifiedResponses += delta.verifiedResponses || 0;

    ['blocs', 'quadrants'].forEach(section => {
      Object.entries(delta[section] || {}).forEach(([itemKey, value]) => {
        bucket[section][itemKey] ||= { count: 0 };
        bucket[section][itemKey].count += value.count || 0;
      });
    });

    Object.entries(delta.thematicAxes || {}).forEach(([axisKey, value]) => {
      bucket.thematicAxes[axisKey] ||= { totalScore: 0, count: 0 };
      bucket.thematicAxes[axisKey].totalScore += value.totalScore || 0;
      bucket.thematicAxes[axisKey].count += value.count || 0;
    });

    Object.entries(delta.wedgeIssues || {}).forEach(([questionId, value]) => {
      const issue = bucket.wedgeIssues[questionId] ||= {
        totalAnswers: 0,
        options: {}
      };
      issue.totalAnswers += value.totalAnswers || 0;
      Object.entries(value.options || {}).forEach(([option, count]) => {
        issue.options[option] = (issue.options[option] || 0) + count;
      });
    });
  });
  return target;
}