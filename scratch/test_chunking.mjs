import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { buildAggregateAccumulators, buildDemographicBreakdownAccumulators, appendDemographicBreakdownUpdates } from '../src/lib/aggregateMath.js';
import { THEMATIC_BLOCKS, TRACKED_WEDGE_ISSUE_IDS } from '../src/data/questions.js';

const app = initializeApp({ projectId: 'bd-political-compass' });
const db = getFirestore(app);

const data = {
  isVerified: true,
  primaryBloc: { key: 'BNP' },
  quadrant: { key: 'authoritarian_right' },
  demographics: { division: 'Dhaka', ageRange: '18_25', religion: 'Muslim' },
  blockResults: THEMATIC_BLOCKS.map(b => ({ key: b.key, bipolarScore: 50 })),
  answers: TRACKED_WEDGE_ISSUE_IDS.map(qid => ({ questionId: qid, score: 3 }))
};

async function test() {
  try {
    const statsRef = doc(db, "stats", "aggregates_v4-2026-10_qset-2026-10-curated24");
    
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
    appendDemographicBreakdownUpdates(updates, demographicBreakdowns);

    const updateEntries = Object.entries(updates);
    const chunkSize = 400;
    for (let i = 0; i < updateEntries.length; i += chunkSize) {
      const chunk = Object.fromEntries(updateEntries.slice(i, i + chunkSize));
      console.log(`Sending chunk of size ${Object.keys(chunk).length}...`);
      await updateDoc(statsRef, chunk);
      console.log("Chunk success!");
    }
    console.log("All chunks succeeded.");
  } catch (e) {
    console.error("Error updating doc:", e.name, e.message);
  }
  process.exit(0);
}
test();
