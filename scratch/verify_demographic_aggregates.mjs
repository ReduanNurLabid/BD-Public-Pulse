import assert from 'node:assert/strict';
import {
  buildDemographicBreakdownAccumulators,
  getDemographicBreakdownKey,
  mergeDemographicBreakdownAccumulators
} from '../src/lib/aggregateMath.js';
import { TRACKED_WEDGE_ISSUE_IDS } from '../src/data/questions.js';

const sampleResponse = {
  demographics: {
    division: 'ঢাকা বিভাগ',
    ageRange: '৬০+ (জ্যেষ্ঠ নাগরিক)',
    religion: 'বলতে অনিচ্ছুক'
  },
  primaryBloc: 'AL',
  quadrant: 'centrist',
  isVerified: true,
  blockResults: [{ key: 'state_power', bipolarScore: 40 }],
  answers: [{ questionId: TRACKED_WEDGE_ISSUE_IDS[0], score: 4 }]
};

const bucketKey = getDemographicBreakdownKey({
  division: 'Dhaka',
  age: '46+',
  religion: 'Others'
});
assert.equal(bucketKey, 'd-Dhaka__a-46_plus__r-Others');

const first = buildDemographicBreakdownAccumulators(sampleResponse);
assert.equal(Object.keys(first).length, 7);
assert.equal(first[bucketKey].totalResponses, 1);
assert.equal(first[bucketKey].verifiedResponses, 1);
assert.equal(first[bucketKey].blocs.AL.count, 1);
assert.equal(first[bucketKey].thematicAxes.state_power.totalScore, 40);
assert.equal(first[bucketKey].wedgeIssues[TRACKED_WEDGE_ISSUE_IDS[0]].options['4'], 1);

const second = buildDemographicBreakdownAccumulators({
  ...sampleResponse,
  isVerified: false,
  blockResults: [{ key: 'state_power', bipolarScore: -20 }]
});
mergeDemographicBreakdownAccumulators(first, second);
assert.equal(first[bucketKey].totalResponses, 2);
assert.equal(first[bucketKey].verifiedResponses, 1);
assert.equal(first[bucketKey].thematicAxes.state_power.totalScore, 20);
assert.equal(first[bucketKey].thematicAxes.state_power.count, 2);
assert.equal(first[bucketKey].wedgeIssues[TRACKED_WEDGE_ISSUE_IDS[0]].totalAnswers, 2);

console.log('Demographic aggregate normalization and accumulation checks passed.');
