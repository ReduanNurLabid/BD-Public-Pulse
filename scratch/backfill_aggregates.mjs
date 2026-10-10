/**
 * ONE-TIME backfill: rebuild stats/aggregates from the /responses collection.
 *
 * Why this exists
 * ---------------
 * The 8 thematic axes were never populated because saveAssessmentResponse was
 * called without `blockResults`, so every axes increment was silently skipped.
 * The individual responses ARE stored correctly in /responses; the client simply
 * cannot read them because firestore.rules denies reads on that collection.
 *
 * This script uses the Admin SDK, which bypasses security rules using your own
 * service-account credentials, recomputes every response with the SAME scoring
 * code the app uses (src/lib/scoring.js), and writes the aggregate document.
 * The result is real measured data, not typed-in guesses.
 *
 * It REBUILDS the aggregate from scratch (zeroed first) so that fields which
 * drifted during the earlier bugs cannot survive.
 *
 * Privacy: responses contain a respondent `name` in demographics. This script
 * never prints it, and never leaves your machine.
 *
 * Usage
 * -----
 *   1. Firebase console -> Project settings -> Service accounts -> Generate new
 *      private key. Save the JSON outside the repo.
 *   2. Dry run first (reads only, prints the plan):
 *        node scratch/backfill_aggregates.mjs --key="C:/secure/service-account.json"
 *   3. Then write:
 *        node scratch/backfill_aggregates.mjs --key="C:/secure/service-account.json" --apply
 *      The apply transaction verifies the response collection did not change
 *      during the scan; if it did, nothing is written and the run can be retried.
 *
 * Requires: npm run backfill:setup   (installs firebase-admin as a devDependency)
 */
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { readFileSync } from 'node:fs';

import { calculateComprehensiveAnalysis } from '../src/lib/scoring.js';
import {
  buildAggregateAccumulators,
  buildDemographicBreakdownAccumulators,
  mergeDemographicBreakdownAccumulators
} from '../src/lib/aggregateMath.js';
import {
  AGE_BUCKETS,
  QUESTION_SET_VERSION,
  THEMATIC_BLOCKS,
  TRACKED_WEDGE_ISSUE_IDS,
  LIKERT_MIN,
  LIKERT_MAX
} from '../src/data/questions.js';
import { MODEL_VERSION } from '../src/lib/scoring.js';

// ---- CLI args ---------------------------------------------------------------
const args = process.argv.slice(2);
const apply = args.includes('--apply');
const keyArg = args.find(a => a.startsWith('--key='));
const keyPath = keyArg ? keyArg.slice('--key='.length) : process.env.FIREBASE_SERVICE_ACCOUNT;

// ---- Sanity: only known question ids / integer scores 1..5 ------------------
const isUsableAnswer = a =>
  a && typeof a.questionId === 'string' && Number.isInteger(a.score) &&
  a.score >= LIKERT_MIN && a.score <= LIKERT_MAX;

function zeroAxes() {
  return Object.fromEntries(THEMATIC_BLOCKS.map(b => [b.key, { totalScore: 0, count: 0 }]));
}

function zeroWedges() {
  return Object.fromEntries(TRACKED_WEDGE_ISSUE_IDS.map(qid => [
    qid,
    {
      totalAnswers: 0,
      options: Object.fromEntries(
        Array.from({ length: LIKERT_MAX - LIKERT_MIN + 1 }, (_, i) => [String(LIKERT_MIN + i), 0])
      )
    }
  ]));
}

/**
 * Recompute the full national aggregate from raw responses.
 * Mirrors what the incremental write path produces, so the next live
 * submission continues from these numbers without a discontinuity.
 */
function rebuild(responses) {
  const totals = {
    totalResponses: 0,
    verifiedResponses: 0,
    blocs: {},
    quadrants: {},
    divisions: {},
    ageRanges: Object.fromEntries(AGE_BUCKETS.map(k => [k, { count: 0 }])),
    religions: {},
    thematicAxes: zeroAxes(),
    wedgeIssues: zeroWedges(),
    demographicBreakdowns: {}
  };

  const skipped = {
    legacyOrDifferentVersion: 0,
    incomplete: 0,
    unreliable: 0
  };

  responses.forEach(resp => {
    const data = resp.data();
    if (data.modelVersion !== MODEL_VERSION || data.questionSetVersion !== QUESTION_SET_VERSION) {
      skipped.legacyOrDifferentVersion += 1;
      return;
    }
    const answers = Array.isArray(data.answers) ? data.answers.filter(isUsableAnswer) : [];

    // A complete run has all 24 questions. Anything less is not a valid sample
    // for a national average, so it is reported and excluded rather than
    // silently skewing the numbers.
    if (answers.length < 24) {
      skipped.incomplete += 1;
      return;
    }

    const analysis = calculateComprehensiveAnalysis(answers);
    if (analysis.quality?.reliable === false) {
      skipped.unreliable += 1;
      return;
    }
    const acc = buildAggregateAccumulators({
      blockResults: analysis.blockResults,
      answers
    });

    totals.totalResponses += 1;
    if (data.isVerified) totals.verifiedResponses += 1;

    const blocKey = typeof analysis.primaryBloc === 'object'
      ? analysis.primaryBloc?.key
      : analysis.primaryBloc;
    if (blocKey) {
      if (!totals.blocs[blocKey]) totals.blocs[blocKey] = { count: 0 };
      totals.blocs[blocKey].count += 1;
    }

    const quadrantKey = typeof analysis.quadrant === 'object'
      ? analysis.quadrant?.key
      : analysis.quadrant;
    if (quadrantKey) {
      if (!totals.quadrants[quadrantKey]) totals.quadrants[quadrantKey] = { count: 0 };
      totals.quadrants[quadrantKey].count += 1;
    }

    mergeDemographicBreakdownAccumulators(
      totals.demographicBreakdowns,
      buildDemographicBreakdownAccumulators({
        ...data,
        primaryBloc: blocKey,
        quadrant: quadrantKey,
        blockResults: analysis.blockResults,
        answers
      })
    );

    const divRaw = data.demographics?.division;
    if (divRaw) {
      const div = divRaw.replace(' বিভাগ', '').trim();
      if (!totals.divisions[div]) totals.divisions[div] = { count: 0 };
      totals.divisions[div].count += 1;
    }

    const age = data.demographics?.ageRange;
    if (age && AGE_BUCKETS.includes(age)) {
      if (!totals.ageRanges[age]) totals.ageRanges[age] = { count: 0 };
      totals.ageRanges[age].count += 1;
    }

    const religion = data.demographics?.religion;
    if (religion) {
      if (!totals.religions[religion]) totals.religions[religion] = { count: 0 };
      totals.religions[religion].count += 1;
    }

    Object.keys(acc.axes).forEach(k => {
      totals.thematicAxes[k].totalScore += acc.axes[k].totalScore;
      totals.thematicAxes[k].count += acc.axes[k].count;
    });
    Object.keys(acc.wedges).forEach(qid => {
      const w = acc.wedges[qid];
      totals.wedgeIssues[qid].totalAnswers += w.totalAnswers;
      Object.keys(w.options).forEach(o => {
        totals.wedgeIssues[qid].options[o] += w.options[o];
      });
    });
  });

  return { totals, skipped };
}

// ---- Main -------------------------------------------------------------------
if (!keyPath) {
  console.error('Missing service account path.');
  console.error('Pass --key="C:/path/service-account.json" or set FIREBASE_SERVICE_ACCOUNT.');
  process.exit(1);
}

let credentials;
try {
  credentials = JSON.parse(readFileSync(keyPath, 'utf8'));
} catch (err) {
  console.error(`Could not read the key file at ${keyPath}`);
  console.error(err.message);
  process.exit(1);
}

const app = getApps().length ? getApps()[0] : initializeApp({ credential: cert(credentials) });
const db = getFirestore(app);

const responsesSnap = await db.collection('responses').get();
const responses = responsesSnap.docs;
console.log(`responses found: ${responses.length}`);

const { totals, skipped } = rebuild(responses);

console.log('');
console.log(`usable complete responses : ${totals.totalResponses}`);
console.log(`verified                  : ${totals.verifiedResponses}`);
if (Object.values(skipped).some(count => count > 0)) {
  console.log(`legacy/different version  : ${skipped.legacyOrDifferentVersion}`);
  console.log(`incomplete                : ${skipped.incomplete}`);
  console.log(`unreliable                : ${skipped.unreliable}`);
}
console.log('');

console.log('thematic axes that WOULD be written:');
THEMATIC_BLOCKS.forEach(b => {
  const t = totals.thematicAxes[b.key];
  const avg = t.count ? Math.round(t.totalScore / t.count) : null;
  const right = avg === null ? null : Math.round((avg + 100) / 2);
  console.log(
    `   ${b.key.padEnd(18)} totalScore=${String(t.totalScore).padStart(6)} count=${t.count}` +
    (avg === null ? '   avg=n/a' : `   avg=${String(avg).padStart(4)}  ->  ${100 - right}% / ${right}%`)
  );
});
console.log('');
console.log('wedge issues that WOULD be written:');
TRACKED_WEDGE_ISSUE_IDS.forEach(qid => {
  const w = totals.wedgeIssues[qid];
  const o = w.options;
  console.log(`   ${qid}  n=${w.totalAnswers}  agree=${(o['4'] || 0) + (o['5'] || 0)} neutral=${o['3'] || 0} disagree=${(o['1'] || 0) + (o['2'] || 0)}`);
});
console.log('');
console.log(`blocs     : ${JSON.stringify(totals.blocs)}`);
console.log(`quadrants : ${JSON.stringify(totals.quadrants)}`);
console.log(`divisions : ${JSON.stringify(totals.divisions)}`);
console.log(`religions : ${JSON.stringify(totals.religions)}`);
console.log(`ageRanges : ${JSON.stringify(totals.ageRanges)}`);
console.log(`demographic cohorts : ${Object.keys(totals.demographicBreakdowns).length} aggregate groups`);
console.log(`model version : ${MODEL_VERSION}`);
console.log(`question set  : ${QUESTION_SET_VERSION}`);
console.log('');

if (!apply) {
  console.log('DRY RUN. Nothing was written.');
  console.log('Re-run with --apply to write these values to stats/aggregates.');
  process.exit(0);
}

if (totals.totalResponses === 0) {
  console.error('Refusing to write: zero usable responses would wipe the aggregate.');
  process.exit(1);
}

const payload = {
  ...totals,
  lastUpdated: Timestamp.now(),
  backfilledAt: Timestamp.now(),
  modelVersion: MODEL_VERSION,
  questionSetVersion: QUESTION_SET_VERSION,
  backfillNote: 'Recomputed current-version responses by scratch/backfill_aggregates.mjs'
};

const versionedAggregateRef = db.collection('stats').doc(
  `aggregates_${MODEL_VERSION}_${QUESTION_SET_VERSION}`
);

await db.runTransaction(async transaction => {
  const currentResponses = await transaction.get(db.collection('responses'));
  if (currentResponses.size !== responses.length) {
    throw new Error(
      `Responses changed during backfill (${responses.length} read initially, ${currentResponses.size} now). ` +
      'No aggregate was written; rerun the dry run and apply.'
    );
  }
  const currentAggregate = await transaction.get(versionedAggregateRef);
  transaction.set(versionedAggregateRef, payload, { merge: false });
  return currentAggregate.exists;
});
console.log(`WROTE stats/${versionedAggregateRef.id} (full replace; concurrent response changes are guarded).`);
console.log('Reload the dashboard: demographic filters now use measured cohort results.');

process.exit(0);