import { cert, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { writeFileSync, existsSync } from 'node:fs';

const args = process.argv.slice(2);
const keyArg = args.find(a => a.startsWith('--key='));

if (!keyArg) {
  console.error("Missing --key argument. Usage: node export_responses.mjs --key=\"path/to/key.json\"");
  process.exit(1);
}

const keyPath = keyArg.split('=')[1].replace(/^["']|["']$/g, '');

if (!existsSync(keyPath)) {
  console.error(`Key file not found at: ${keyPath}`);
  process.exit(1);
}

try {
  // 1. Initialize Firebase Admin
  initializeApp({
    credential: cert(keyPath)
  });
  const db = getFirestore();

  console.log("Fetching all documents from 'responses' collection...");
  
  // 2. Fetch responses
  const snapshot = await db.collection("responses").get();
  
  if (snapshot.empty) {
    console.log("No documents found in the responses collection.");
    process.exit(0);
  }

  console.log(`Found ${snapshot.size} documents. Exporting to JSON...`);

  // 3. Process and save to JSON
  const allResponses = [];
  snapshot.forEach(doc => {
    const data = doc.data();
    // Convert Firestore Timestamps to ISO strings for JSON export
    if (data.createdAt && typeof data.createdAt.toDate === 'function') {
      data.createdAt = data.createdAt.toDate().toISOString();
    }
    allResponses.push({ id: doc.id, ...data });
  });

  const exportPath = 'raw_responses_export.json';
  writeFileSync(exportPath, JSON.stringify(allResponses, null, 2));

  console.log(`\nSuccess! Exported ${allResponses.length} submissions to ${exportPath}`);
  
} catch (error) {
  console.error("Error exporting responses:", error);
  process.exit(1);
}
