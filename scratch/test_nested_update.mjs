import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, updateDoc, increment } from 'firebase/firestore';

const app = initializeApp({ projectId: 'bd-political-compass' });
const db = getFirestore(app);

async function test() {
  try {
    const statsRef = doc(db, "stats", "test_nested_doc");
    
    // Create the document WITHOUT the parent object
    await setDoc(statsRef, {
      totalResponses: 0
    });
    console.log("Document created");
    
    // Try to update a nested field where the parent does not exist
    const updates = {
      'demographicBreakdowns.d-Dhaka.totalResponses': increment(1)
    };
    
    await updateDoc(statsRef, updates);
    console.log("Success updating nested field");
  } catch (e) {
    console.error("Error name:", e.name);
    console.error("Error code:", e.code);
    console.error("Error message:", e.message);
  }
}
test();
