import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const app = initializeApp({ projectId: 'bd-political-compass' });
const db = getFirestore(app);

const INITIAL_AGGREGATE_STATS = {
  totalResponses: 0,
  verifiedResponses: 0,
  rejectedResponses: 0,
  lastUpdated: null,
  blocs: {},
  quadrants: {},
  divisions: {},
  ageRanges: {},
  religions: {},
  demographicBreakdowns: {},
  thematicAxes: {},
  wedgeIssues: {}
};

async function test() {
  try {
    const statsRef = doc(db, "stats", "test_set_initial");
    
    const initial = JSON.parse(JSON.stringify(INITIAL_AGGREGATE_STATS));
    initial.totalResponses = 1;
    initial.verifiedResponses = 1;
    initial.lastUpdated = null;
    
    await setDoc(statsRef, initial);
    console.log("Success setDoc");
  } catch (e) {
    console.error("Error name:", e.name);
    console.error("Error code:", e.code);
    console.error("Error message:", e.message);
  }
}
test();
