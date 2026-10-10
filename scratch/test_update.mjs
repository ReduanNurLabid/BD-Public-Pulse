import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc, increment } from 'firebase/firestore';

const app = initializeApp({ projectId: 'bd-political-compass' });
const db = getFirestore(app);

async function test() {
  try {
    const updates = {
      totalResponses: increment(1)
    };
    updates['demographicBreakdowns.d-Dhaka__a-18_25__r-Muslim.wedgeIssues.q11.options.5'] = increment(1);
    
    // We expect this to fail due to lack of real authentication/credentials, 
    // but the error TYPE will tell us if it's a validation error or network error.
    const statsRef = doc(db, "stats", "test_doc");
    await updateDoc(statsRef, updates);
    console.log("Success");
  } catch (e) {
    console.error("Error name:", e.name);
    console.error("Error code:", e.code);
    console.error("Error message:", e.message);
  }
}
test();
