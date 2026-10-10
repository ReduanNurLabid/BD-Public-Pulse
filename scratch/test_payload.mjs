import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc, increment } from 'firebase/firestore';

// Fake config - just want to see if the SDK throws synchronously for > 500 fields
const app = initializeApp({ projectId: 'bd-political-compass' });
const db = getFirestore(app);

try {
  const updates = {};
  for (let i = 0; i < 550; i++) {
    updates[`testField_${i}`] = increment(1);
  }
  
  console.log("Created 550 fields payload. Length:", Object.keys(updates).length);
  
  // This might throw a sync validation error in the JS SDK before even making a network request
  const dRef = doc(db, 'stats', 'dummy');
  // Just catching the synchronous exception if there is one
  const promise = updateDoc(dRef, updates);
  console.log("No synchronous error thrown by SDK.");
  process.exit(0);
} catch (e) {
  console.error("Error caught:", e);
}
