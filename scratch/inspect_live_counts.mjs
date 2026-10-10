/**
 * READ-ONLY diagnostic: what the axes / wedge / age accumulators actually hold.
 * Writes nothing. Safe to run.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

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
const d = (await getDoc(doc(db, 'stats', 'aggregates'))).data();

const cp = s => [...s].map(c => 'U+' + c.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')).join(' ');

console.log('=== thematicAxes ===');
Object.entries(d.thematicAxes || {}).forEach(([k, v]) => {
  const avg = v?.count ? Math.round(v.totalScore / v.count) : null;
  console.log(`  ${k.padEnd(20)} totalScore=${String(v?.totalScore).padStart(5)} count=${v?.count} avg=${avg}`);
});

console.log('');
console.log('=== wedgeIssues ===');
Object.entries(d.wedgeIssues || {}).forEach(([k, v]) => {
  const o = v?.options || {};
  const n = v?.totalAnswers || 0;
  const agree = (o['4'] || 0) + (o['5'] || 0);
  const dis = (o['1'] || 0) + (o['2'] || 0);
  const neu = o['3'] || 0;
  console.log(`  ${k.padEnd(6)} n=${n}  agree=${agree} neutral=${neu} disagree=${dis}`);
});

console.log('');
console.log('=== ageRanges (raw, with codepoints for the ya letter) ===');
Object.entries(d.ageRanges || {}).forEach(([k, v]) => {
  const hasNukta = /\u09bc/.test(k);
  console.log(`  count=${String(v?.count).padStart(3)} ${JSON.stringify(k)}${hasNukta ? '   <-- NUKTA (U+09BC) form' : ''}`);
  if (hasNukta) console.log(`       ${cp(k)}`);
});

console.log('');
console.log('=== blocs / divisions / religions ===');
console.log('blocs    :', JSON.stringify(d.blocs));
console.log('divisions:', JSON.stringify(d.divisions));
console.log('religions:', JSON.stringify(d.religions));

process.exit(0);