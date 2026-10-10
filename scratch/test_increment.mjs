import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc, increment } from 'firebase/firestore';

const app = initializeApp({ projectId: 'bd-political-compass' });
const db = getFirestore(app);

async function test() {
  try {
    const statsRef = doc(db, "stats", "test_increment_nan");
    
    console.log("Testing increment(NaN)");
    try {
      const updates = { count: increment(NaN) };
      await updateDoc(statsRef, updates);
    } catch(e) {
      console.error("NaN Error:", e.message);
    }

    console.log("Testing increment(undefined)");
    try {
      const updates2 = { count: increment(undefined) };
      await updateDoc(statsRef, updates2);
    } catch(e) {
      console.error("Undefined Error:", e.message);
    }

  } catch (e) {
    console.error("General error:", e);
  }
}
test();
