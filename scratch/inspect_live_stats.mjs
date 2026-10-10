/**
 * READ-ONLY diagnostic against the live Firestore project.
 * Writes nothing. Safe to run.
 *
 * Checks what stats/aggregates actually contains today, and whether the
 * key names our code writes match the keys already stored in the document.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { AGE_BUCKETS, TRACKED_WEDGE_ISSUE_IDS, THEMATIC_BLOCKS } from '../src/data/questions.js';

const firebaseConfig = {
  apiKey: 'AIzaSyAip39vHk5SGE-0tLOZ9lckmZRne6bbbAc',
  authDomain: 'bd-political-compass.firebaseapp.com',
  projectId: 'bd-political-compass',
  storageBucket: 'bd-political-compass.firebasestorage.app',
  messagingSenderId: '737075109195',
  appId: '1:737075109195:web:ca966a240261571fe6dcce',
  measurementId: 'G-ZX27MTW0EZ'
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const cp = s => [...s].map(c => 'U+' + c.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')).join(' ');

const snap = await getDoc(doc(db, 'stats', 'aggregates'));
console.log('document exists:', snap.exists());

if (!snap.exists()) {
  console.log('No stats/aggregates document yet.');
  process.exit(0);
}

const d = snap.data();
console.log('');
console.log('top-level fields:', Object.keys(d).sort().join(', '));
console.log('');
console.log('totalResponses   :', d.totalResponses ?? '(missing)');
console.log('verifiedResponses:', d.verifiedResponses ?? '(missing)');
console.log('lastUpdated      :', d.lastUpdated?.toDate?.()?.toISOString?.() ?? JSON.stringify(d.lastUpdated ?? null));
console.log('');

console.log('--- new fields required by the axes / wedge features ---');
console.log('thematicAxes present:', Boolean(d.thematicAxes));
console.log('wedgeIssues  present:', Boolean(d.wedgeIssues));
console.log('');

console.log('--- ageRanges: stored keys vs AGE_BUCKETS we write ---');
const storedAgeKeys = Object.keys(d.ageRanges || {});
console.log(`stored (${storedAgeKeys.length}):`);
storedAgeKeys.forEach(k => console.log('   ', JSON.stringify(k)));
console.log(`code (${AGE_BUCKETS.length}):`);
AGE_BUCKETS.forEach(k => console.log('   ', JSON.stringify(k)));
const exact = AGE_BUCKETS.filter(k => storedAgeKeys.includes(k));
const missing = AGE_BUCKETS.filter(k => !storedAgeKeys.includes(k));
console.log('');
console.log(`exact matches: ${exact.length}/${AGE_BUCKETS.length}`);
if (missing.length) {
  console.log('NOT present in the document (we would create a NEW key):');
  missing.forEach(k => {
    const near = storedAgeKeys.find(sk => sk.replace(/\s+/g, '') === k.replace(/\s+/g, ''));
    console.log('   code  :', JSON.stringify(k));
    console.log('   stored:', near ? JSON.stringify(near) : '(no whitespace-equivalent key)');
    if (near) {
      console.log('   code codepoints  :', cp(k));
      console.log('   stored codepoints:', cp(near));
    }
  });
}
console.log('');

console.log('--- blocs / quadrants sanity ---');
console.log('blocs keys    :', Object.keys(d.blocs || {}).join(', ') || '(missing)');
console.log('quadrants keys:', Object.keys(d.quadrants || {}).join(', ') || '(missing)');
console.log('');

console.log('--- axis + wedge ids our code expects ---');
console.log('thematicAxes keys expected:', THEMATIC_BLOCKS.map(b => b.key).join(', '));
console.log('wedgeIssues  ids expected:', TRACKED_WEDGE_ISSUE_IDS.join(', '));

process.exit(0);