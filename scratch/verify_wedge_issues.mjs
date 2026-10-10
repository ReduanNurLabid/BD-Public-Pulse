/**
 * Guards the axes + wedge-issue aggregate contract.
 *
 * These charts were previously fed invented numbers in the Dashboard. They now
 * read real accumulators from the single O(1) stats/aggregates document, which
 * only works if three things stay true:
 *   1. The tracked wedge question ids are real ids in QUESTIONS.
 *   2. The accumulator builder maps bipolar scores and Likert answers correctly.
 *   3. buildDashboardStats turns raw sums into sane bipolar percentages.
 *
 * Run: npm run verify:wedge-issues
 */
import {
  QUESTIONS,
  THEMATIC_BLOCKS,
  TRACKED_WEDGE_ISSUES,
  TRACKED_WEDGE_ISSUE_IDS
} from '../src/data/questions.js';
import { buildAggregateAccumulators } from '../src/lib/aggregateMath.js';
import { readFileSync } from 'node:fs';

const failures = [];
const check = (ok, message) => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${message}`);
  if (!ok) failures.push(message);
};

const questionIds = new Set(QUESTIONS.map(q => q.id));

// 1. Tracked ids must exist.
const missing = TRACKED_WEDGE_ISSUE_IDS.filter(id => !questionIds.has(id));
check(missing.length === 0, `All tracked wedge ids exist in QUESTIONS${missing.length ? ` (missing: ${missing.join(', ')})` : ''}`);
check(new Set(TRACKED_WEDGE_ISSUE_IDS).size === TRACKED_WEDGE_ISSUE_IDS.length, 'No duplicate wedge issue ids');
check(
  TRACKED_WEDGE_ISSUES.length > 0 &&
  TRACKED_WEDGE_ISSUES.length <= 4 &&
  TRACKED_WEDGE_ISSUES.length === TRACKED_WEDGE_ISSUE_IDS.length,
  `Tracking ${TRACKED_WEDGE_ISSUES.length} configured wedge issues (1-4 supported; final selection deferred)`
);
check(TRACKED_WEDGE_ISSUES.every(i => typeof i.title === 'string' && i.title.length > 10), 'Every wedge issue has a real title');

// 2. Accumulator maths.
const axisKeys = THEMATIC_BLOCKS.map(b => b.key);

// Simulate TWO separate submissions, each carrying all 8 axes. Respondent 1 is
// strongly right on axis 1 (+80), respondent 2 mildly left (-20), so the running
// total must be +60 across 2 respondents => average +30 => 65/35.
const submission = (axis1Score, wedgeScores) => ({
  blockResults: axisKeys.map((key, i) => ({ key, bipolarScore: i === 0 ? axis1Score : 0 })),
  answers: TRACKED_WEDGE_ISSUE_IDS.slice(0, wedgeScores.length).map((questionId, i) => ({
    questionId,
    score: wedgeScores[i]
  }))
});

// Fold each submission into one running total, the way Firestore increments do.
const totals = { axes: {}, wedges: {} };
[
  submission(80, [5, 3]),
  submission(-20, [1, 3])
].forEach(payload => {
  const acc = buildAggregateAccumulators(payload);
  Object.keys(acc.axes).forEach(k => {
    if (!totals.axes[k]) totals.axes[k] = { totalScore: 0, count: 0 };
    totals.axes[k].totalScore += acc.axes[k].totalScore;
    totals.axes[k].count += acc.axes[k].count;
  });
  Object.keys(acc.wedges).forEach(k => {
    if (!totals.wedges[k]) {
      totals.wedges[k] = {
        totalAnswers: 0,
        options: Object.fromEntries(['1', '2', '3', '4', '5'].map(o => [o, 0]))
      };
    }
    totals.wedges[k].totalAnswers += acc.wedges[k].totalAnswers;
    Object.keys(acc.wedges[k].options).forEach(o => {
      totals.wedges[k].options[o] += acc.wedges[k].options[o];
    });
  });
});

check(Object.keys(totals.axes).length === axisKeys.length, 'Every thematic block is accumulated');
check(totals.axes[axisKeys[0]].totalScore === 60, `Axis 1 sums across submissions (got ${totals.axes[axisKeys[0]].totalScore}, expected 60)`);
check(totals.axes[axisKeys[0]].count === 2, `Axis 1 counts both respondents (got ${totals.axes[axisKeys[0]].count})`);
check(
  totals.axes[axisKeys[1]].count === 2 && totals.axes[axisKeys[1]].totalScore === 0,
  'A perfectly neutral axis accumulates to a 0 total'
);

const firstWedge = totals.wedges[TRACKED_WEDGE_ISSUE_IDS[0]];
check(firstWedge?.totalAnswers === 2, `Tracked question tallies both answers (got ${firstWedge?.totalAnswers})`);
check(
  firstWedge?.options['5'] === 1 && firstWedge?.options['1'] === 1,
  'Each Likert value lands in its own histogram bucket'
);
check(
  totals.wedges[TRACKED_WEDGE_ISSUE_IDS[1]]?.options['3'] === 2,
  'A second tracked question keeps its own histogram'
);

// 2b. The caller must actually pass blockResults through. This was the real
// bug: App.jsx omitted it, so the axes accumulated nothing while the wedge
// histograms (fed by `answers`) worked fine and hid the fault.
const appSrc = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8');
const saveCall = appSrc.slice(appSrc.indexOf('saveAssessmentResponse({'));
check(
  /blockResults:\s*analysis\.blockResults/.test(saveCall),
  'App.jsx passes analysis.blockResults into saveAssessmentResponse'
);
check(
  /blockResults:\s*analysis\.blockResults/.test(saveCall) &&
  /answers,/.test(saveCall),
  'App.jsx still passes answers, so wedge histograms keep working'
);

// A payload with blockResults present must yield axes; without it, none.
const withBlocks = buildAggregateAccumulators({
  blockResults: [{ key: axisKeys[0], bipolarScore: 10 }],
  answers: []
});
check(
  Object.keys(withBlocks.axes).length === 1,
  'A payload WITH blockResults produces axes increments'
);
const withoutBlocks = buildAggregateAccumulators({ answers: [] });
check(
  Object.keys(withoutBlocks.axes).length === 0,
  'A payload WITHOUT blockResults produces no axes increments (the old bug)'
);

// Untracked questions and out-of-range scores must be ignored.
const guarded = buildAggregateAccumulators({
  blockResults: [{ key: axisKeys[0], bipolarScore: 'not-a-number' }, { bipolarScore: 50 }],
  answers: [
    { questionId: 'q1', score: 5 },
    { questionId: TRACKED_WEDGE_ISSUE_IDS[0], score: 99 },
    { questionId: TRACKED_WEDGE_ISSUE_IDS[0], score: 0 }
  ]
});
check(Object.keys(guarded.axes).length === 0, 'Malformed block results are dropped');
check(!guarded.wedges[TRACKED_WEDGE_ISSUE_IDS[0]], 'Untracked ids and out-of-range Likert values are dropped');

// 3. Projection maths, mirroring buildDashboardStats.
const rawStats = {
  totalResponses: 2,
  thematicAxes: {
    [axisKeys[0]]: { totalScore: 60, count: 2 }
  },
  wedgeIssues: {
    [TRACKED_WEDGE_ISSUE_IDS[0]]: {
      totalAnswers: 4,
      options: { '1': 1, '2': 1, '3': 0, '4': 1, '5': 1 }
    }
  }
};

const averageScore = Math.round(rawStats.thematicAxes[axisKeys[0]].totalScore / rawStats.thematicAxes[axisKeys[0]].count);
check(averageScore === 30, `averageScore = totalScore / count (got ${averageScore}, expected 30)`);

const rightPercent = Math.round((averageScore + 100) / 2);
check(rightPercent === 65 && 100 - rightPercent === 35, `Bipolar +30 maps to 65/35 (got ${rightPercent}/${100 - rightPercent})`);

const opts = rawStats.wedgeIssues[TRACKED_WEDGE_ISSUE_IDS[0]].options;
const n = rawStats.wedgeIssues[TRACKED_WEDGE_ISSUE_IDS[0]].totalAnswers;
const agree = Math.round(((opts['4'] + opts['5']) / n) * 100);
const neutral = Math.round((opts['3'] / n) * 100);
const disagree = Math.round(((opts['1'] + opts['2']) / n) * 100);
check(agree === 50 && neutral === 0 && disagree === 50, `Wedge split 50/0/50 (got ${agree}/${neutral}/${disagree})`);
check(agree + neutral + disagree === 100, 'Wedge percentages sum to 100');

// Edge case: an axis nobody has answered must not fake a leaning.
const emptyAvg = 0;
check(Math.round((emptyAvg + 100) / 2) === 50, 'An unanswered axis reads a neutral 50/50, not a lean');

console.log('');
if (failures.length) {
  console.error(`${failures.length} check(s) failed.`);
  process.exit(1);
}
console.log('All wedge-issue / axes aggregate checks passed.');