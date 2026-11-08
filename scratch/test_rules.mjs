// Attack-style test of firestore.rules, against the local emulator only.
//   npm i --no-save @firebase/rules-unit-testing@3
//   npx firebase emulators:exec --only firestore --project demo-bdc "node scratch/test_rules.mjs"
import { readFileSync } from 'node:fs';
import { assertFails, assertSucceeds, initializeTestEnvironment } from '@firebase/rules-unit-testing';
import {
  addDoc, collection, deleteDoc, doc, getDoc, getDocs, increment, limit, query, serverTimestamp, setDoc, updateDoc, where, writeBatch
} from 'firebase/firestore';

const env = await initializeTestEnvironment({
  projectId: 'demo-bdc',
  firestore: { rules: readFileSync(new URL('../firestore.rules', import.meta.url), 'utf8') }
});

const anon = (uid = 'visitor1') => env.authenticatedContext(uid, { firebase: { sign_in_provider: 'anonymous' } }).firestore();
const signedIn = env.authenticatedContext('stranger', { email: 'x@y.z' }).firestore();
const admin = env.authenticatedContext('boss', { admin: true }).firestore();
const nobody = env.unauthenticatedContext().firestore();

let failed = 0;
const test = async (name, expectation) => {
  try {
    await expectation;
    console.log(`PASS  ${name}`);
  } catch (error) {
    failed += 1;
    console.log(`FAIL  ${name}: ${error.message}`);
  }
};

const counts = { agree: 0, neutral: 0, disagree: 0 };
await env.withSecurityRulesDisabled(async (ctx) => {
  const db = ctx.firestore();
  await setDoc(doc(db, 'responses/r1'), { sessionId: 'r1', primaryBloc: 'BNP' });
  await setDoc(doc(db, 'proposals/p1'), { title: 'A topic', status: 'pending' });
  await setDoc(doc(db, 'feedback/f1'), { message: 'hi', status: 'pending' });
  await setDoc(doc(db, 'weekly_issues/live'), { question: 'Q', status: 'live', counts });
  await setDoc(doc(db, 'weekly_issues/draft'), { question: 'D', status: 'draft', counts });
  await setDoc(doc(db, 'weekly_issues/closed'), { question: 'C', status: 'closed', counts });
});

const vote = (db, uid, issue, choice, bump = 1, target = choice) => {
  const batch = writeBatch(db);
  batch.set(doc(db, `weekly_issues/${issue}/votes/${uid}`), { choice, createdAt: serverTimestamp() });
  batch.update(doc(db, `weekly_issues/${issue}`), { [`counts.${target}`]: increment(bump) });
  return batch.commit();
};

// Private data
for (const [who, db] of [['nobody', nobody], ['anonymous visitor', anon()], ['signed-in non-admin', signedIn]]) {
  await test(`${who} cannot read a response`, assertFails(getDoc(doc(db, 'responses/r1'))));
  await test(`${who} cannot list responses`, assertFails(getDocs(collection(db, 'responses'))));
  await test(`${who} cannot read proposals`, assertFails(getDoc(doc(db, 'proposals/p1'))));
  await test(`${who} cannot read feedback`, assertFails(getDoc(doc(db, 'feedback/f1'))));
  await test(`${who} cannot see drafts`, assertFails(getDoc(doc(db, 'weekly_issues/draft'))));
  await test(`${who} cannot create a question`, assertFails(addDoc(collection(db, 'weekly_issues'), { question: 'x', status: 'live', counts })));
  await test(`${who} cannot publish a draft`, assertFails(updateDoc(doc(db, 'weekly_issues/draft'), { status: 'live' })));
  await test(`${who} cannot close the live question`, assertFails(updateDoc(doc(db, 'weekly_issues/live'), { status: 'closed' })));
  await test(`${who} cannot change proposal status`, assertFails(updateDoc(doc(db, 'proposals/p1'), { status: 'reviewed' })));
  await test(`${who} cannot delete feedback`, assertFails(deleteDoc(doc(db, 'feedback/f1'))));
}

// Admin
await test('admin reads responses', assertSucceeds(getDocs(collection(admin, 'responses'))));
await test('admin reads proposals', assertSucceeds(getDocs(collection(admin, 'proposals'))));
await test('admin reads feedback', assertSucceeds(getDocs(collection(admin, 'feedback'))));
await test('admin sees drafts', assertSucceeds(getDoc(doc(admin, 'weekly_issues/draft'))));
await test('admin marks feedback seen', assertSucceeds(updateDoc(doc(admin, 'feedback/f1'), { status: 'reviewed' })));
await test('admin cannot rewrite feedback text', assertFails(updateDoc(doc(admin, 'feedback/f1'), { message: 'edited' })));
await test('admin cannot delete a question people voted on', assertFails(deleteDoc(doc(admin, 'weekly_issues/live'))));
await test('admin cannot edit a response', assertFails(updateDoc(doc(admin, 'responses/r1'), { primaryBloc: 'AL' })));

// Public
await test('visitor can read the live question', assertSucceeds(getDocs(query(collection(anon(), 'weekly_issues'), where('status', '==', 'live'), limit(1)))));
await test('feedback can be sent', assertSucceeds(addDoc(collection(anon(), 'feedback'), { message: 'Good', deviceId: 'd', createdAt: serverTimestamp(), status: 'pending' })));
await test('empty feedback is refused', assertFails(addDoc(collection(anon(), 'feedback'), { message: '', deviceId: 'd', createdAt: serverTimestamp(), status: 'pending' })));

// Votes
const v1 = anon('v1');
await test('logged-out visitor cannot vote', assertFails(vote(nobody, 'ghost', 'live', 'agree')));
await test('cannot add 5 to a count', assertFails(vote(v1, 'v1', 'live', 'agree', 5)));
await test('vote and count must match', assertFails(vote(v1, 'v1', 'live', 'agree', 1, 'disagree')));
await test('cannot vote on a draft', assertFails(vote(v1, 'v1', 'draft', 'agree')));
await test('cannot vote on a closed question', assertFails(vote(v1, 'v1', 'closed', 'agree')));
await test('invalid choice is refused', assertFails(vote(v1, 'v1', 'live', 'banana')));
await test('cannot vote as someone else', assertFails(vote(v1, 'v2', 'live', 'agree')));
await test('cannot raise a count without voting', assertFails(updateDoc(doc(v1, 'weekly_issues/live'), { 'counts.agree': increment(1) })));
await test('cannot vote without raising a count', assertFails(setDoc(doc(v1, 'weekly_issues/live/votes/v1'), { choice: 'agree', createdAt: serverTimestamp() })));
await test('a real vote works', assertSucceeds(vote(v1, 'v1', 'live', 'agree')));
await test('cannot vote twice', assertFails(vote(v1, 'v1', 'live', 'disagree')));
await test('cannot change a vote', assertFails(updateDoc(doc(v1, 'weekly_issues/live/votes/v1'), { choice: 'disagree' })));
await test('can read own vote', assertSucceeds(getDoc(doc(v1, 'weekly_issues/live/votes/v1'))));
await test('cannot read another person’s vote', assertFails(getDoc(doc(anon('v2'), 'weekly_issues/live/votes/v1'))));
await test('a second person can vote', assertSucceeds(vote(anon('v2'), 'v2', 'live', 'neutral')));

await env.cleanup();
console.log(failed ? `\n${failed} rule test(s) FAILED` : '\nAll rule tests passed.');
process.exit(failed ? 1 : 0);
