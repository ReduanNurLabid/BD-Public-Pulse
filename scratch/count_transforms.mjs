import { buildAggregateAccumulators, buildDemographicBreakdownAccumulators, appendDemographicBreakdownUpdates } from '../src/lib/aggregateMath.js';
import { THEMATIC_BLOCKS, TRACKED_WEDGE_ISSUE_IDS } from '../src/data/questions.js';

// Mock `data` exactly as it would be passed to `saveAssessmentResponse`
const data = {
  isVerified: true,
  primaryBloc: { key: 'BNP' },
  quadrant: { key: 'authoritarian_right' },
  demographics: {
    division: 'Dhaka',
    ageRange: '18_25',
    religion: 'Muslim'
  },
  blockResults: THEMATIC_BLOCKS.map(b => ({ key: b.key, bipolarScore: 50 })),
  answers: TRACKED_WEDGE_ISSUE_IDS.map(qid => ({ questionId: qid, score: 3 }))
};

function increment(val) { return { __type: 'increment', value: val }; }
function serverTimestamp() { return { __type: 'serverTimestamp' }; }

const updates = {
  totalResponses: increment(1),
  lastUpdated: serverTimestamp()
};
if (data.isVerified) {
  updates.verifiedResponses = increment(1);
}

const acc = buildAggregateAccumulators(data);
Object.keys(acc.axes).forEach(axisKey => {
  updates[`thematicAxes.${axisKey}.totalScore`] = increment(acc.axes[axisKey].totalScore);
  updates[`thematicAxes.${axisKey}.count`] = increment(acc.axes[axisKey].count);
});

Object.keys(acc.wedges).forEach(qid => {
  const w = acc.wedges[qid];
  updates[`wedgeIssues.${qid}.totalAnswers`] = increment(w.totalAnswers);
  Object.keys(w.options).forEach(opt => {
    updates[`wedgeIssues.${qid}.options.${opt}`] = increment(w.options[opt]);
  });
});

const primaryBlocKey = data.primaryBloc.key;
const quadrantKey = data.quadrant.key;

const demographicBreakdowns = buildDemographicBreakdownAccumulators({
  ...data,
  primaryBloc: primaryBlocKey,
  quadrant: quadrantKey
});

// Polyfill appendDemographicBreakdownUpdates since it uses firebase `increment`
Object.entries(demographicBreakdowns).forEach(([groupKey, bucket]) => {
  const path = `demographicBreakdowns.${groupKey}`;
  updates[`${path}.totalResponses`] = increment(bucket.totalResponses);
  if (bucket.verifiedResponses) {
    updates[`${path}.verifiedResponses`] = increment(bucket.verifiedResponses);
  }
  
  ['blocs', 'quadrants'].forEach(section => {
    Object.entries(bucket[section] || {}).forEach(([itemKey, value]) => {
      updates[`${path}.${section}.${itemKey}.count`] = increment(value.count);
    });
  });

  Object.entries(bucket.thematicAxes || {}).forEach(([axisKey, value]) => {
    updates[`${path}.thematicAxes.${axisKey}.totalScore`] = increment(value.totalScore);
    updates[`${path}.thematicAxes.${axisKey}.count`] = increment(value.count);
  });

  Object.entries(bucket.wedgeIssues || {}).forEach(([questionId, value]) => {
    updates[`${path}.wedgeIssues.${questionId}.totalAnswers`] = increment(value.totalAnswers);
    Object.entries(value.options || {}).forEach(([option, count]) => {
      updates[`${path}.wedgeIssues.${questionId}.options.${option}`] = increment(count);
    });
  });
});

let transformCount = 0;
for (const val of Object.values(updates)) {
  if (val && (val.__type === 'increment' || val.__type === 'serverTimestamp')) {
    transformCount++;
  }
}

console.log("Total fields in updates object:", Object.keys(updates).length);
console.log("Total field transforms:", transformCount);
