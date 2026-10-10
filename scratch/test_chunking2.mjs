import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';

const app = initializeApp({ projectId: 'bd-political-compass' });
const db = getFirestore(app);

async function test() {
  try {
    const statsRef = doc(db, "stats", "test_chunking_doc");
    
    // 1. Ensure doc exists
    await updateDoc(statsRef, { testInit: 1 }).catch(async () => {
      const { setDoc } = await import('firebase/firestore');
      await setDoc(statsRef, { testInit: 1 });
    });

    // 2. Generate 500+ fields
    const updates = {};
    for (let i = 0; i < 550; i++) {
      updates[`field_${i}`] = increment(1);
    }
    
    // 3. Chunking logic
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
