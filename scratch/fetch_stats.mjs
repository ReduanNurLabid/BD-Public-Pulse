import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { MODEL_VERSION } from '../src/lib/scoring.js';
import { QUESTION_SET_VERSION } from '../src/data/questions.js';

const app = initializeApp({ projectId: 'bd-political-compass' });
const db = getFirestore(app);

async function test() {
  try {
    const docId = `aggregates_${MODEL_VERSION}_${QUESTION_SET_VERSION}`;
    console.log("Fetching doc:", docId);
    
    const statsRef = doc(db, "stats", docId);
    const snap = await getDoc(statsRef);
    if (snap.exists()) {
      console.log("Stats document exists!");
      const data = snap.data();
      console.log("totalResponses:", data.totalResponses);
      console.log("verifiedResponses:", data.verifiedResponses);
      console.log("rejectedResponses:", data.rejectedResponses);
    } else {
      console.log("Stats document DOES NOT EXIST");
    }
    process.exit(0);
  } catch (e) {
    console.error("Error:", e);
    process.exit(1);
  }
}
test();
