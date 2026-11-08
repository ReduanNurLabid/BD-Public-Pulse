// The public side of the weekly question: read what is live, cast one vote.
import { signInAnonymously } from 'firebase/auth';
import {
  collection, doc, getDoc, getDocs, increment, limit, query, serverTimestamp, where, writeBatch
} from 'firebase/firestore';
import { auth, db } from './firebase';

export const VOTE_CHOICES = ['agree', 'neutral', 'disagree'];
export const VOTE_LABELS = {
  agree: { bn: 'একমত', en: 'Agree' },
  neutral: { bn: 'নিরপেক্ষ', en: 'Neutral' },
  disagree: { bn: 'দ্বিমত', en: 'Disagree' }
};

async function currentUid() {
  await auth.authStateReady();
  if (!auth.currentUser) await signInAnonymously(auth);
  return auth.currentUser.uid;
}

export async function fetchLiveIssue() {
  const snap = await getDocs(query(collection(db, 'weekly_issues'), where('status', '==', 'live'), limit(1)));
  return snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() };
}

export async function fetchClosedIssues() {
  const snap = await getDocs(query(collection(db, 'weekly_issues'), where('status', '==', 'closed'), limit(30)));
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (b.closedAt?.toMillis?.() || 0) - (a.closedAt?.toMillis?.() || 0));
}

export async function fetchMyVote(issueId) {
  const uid = await currentUid();
  const snap = await getDoc(doc(db, 'weekly_issues', issueId, 'votes', uid));
  return snap.exists() ? snap.data().choice : null;
}

// The vote and its count are one write, so the security rules can check that
// each person adds exactly one to exactly one option.
export async function castVote(issueId, choice) {
  const uid = await currentUid();
  const batch = writeBatch(db);
  batch.set(doc(db, 'weekly_issues', issueId, 'votes', uid), { choice, createdAt: serverTimestamp() });
  batch.update(doc(db, 'weekly_issues', issueId), { [`counts.${choice}`]: increment(1) });
  await batch.commit();
}
