// Everything the /admin page reads and writes. Access is enforced by
// firestore.rules through the `admin` custom claim, not by this file.
import { browserPopupRedirectResolver, GoogleAuthProvider, onAuthStateChanged, signInAnonymously, signInWithPopup, signOut } from 'firebase/auth';
import {
  addDoc, collection, deleteDoc, doc, getDocs, limit, orderBy, query, serverTimestamp,
  startAfter, updateDoc, where, writeBatch
} from 'firebase/firestore';
import { auth, db } from './firebase';

export const RESPONSES_PAGE = 50;

// Reports { user, isAdmin }, with user null for visitors who are not signed in.
export function watchAdmin(callback) {
  return onAuthStateChanged(auth, async (user) => {
    if (!user || user.isAnonymous) {
      callback({ user: null, isAdmin: false });
      return;
    }
    const token = await user.getIdTokenResult(true);
    callback({ user, isAdmin: token.claims.admin === true });
  });
}

export const adminSignIn = () => signInWithPopup(auth, new GoogleAuthProvider(), browserPopupRedirectResolver);

export async function adminSignOut() {
  await signOut(auth);
  await signInAnonymously(auth);
}

const rows = (snap) => snap.docs.map((d) => ({ id: d.id, ...d.data() }));

export async function fetchResponses(cursor = null) {
  const parts = [collection(db, 'responses'), orderBy('serverCreatedAt', 'desc'), limit(RESPONSES_PAGE)];
  if (cursor) parts.splice(2, 0, startAfter(cursor));
  const snap = await getDocs(query(...parts));
  return { items: rows(snap), cursor: snap.docs[snap.docs.length - 1] || null };
}

export async function fetchAllResponses() {
  return rows(await getDocs(query(collection(db, 'responses'), orderBy('serverCreatedAt', 'desc'))));
}

export async function fetchInbox(name) {
  return rows(await getDocs(query(collection(db, name), orderBy('createdAt', 'desc'), limit(200))));
}

export const setInboxStatus = (name, id, status) => updateDoc(doc(db, name, id), { status });
export const deleteInboxItem = (name, id) => deleteDoc(doc(db, name, id));

export async function fetchIssues() {
  return rows(await getDocs(query(collection(db, 'weekly_issues'), orderBy('createdAt', 'desc'), limit(100))));
}

export function createIssue({ question, questionEn }) {
  return addDoc(collection(db, 'weekly_issues'), {
    question,
    questionEn: questionEn || '',
    status: 'draft',
    counts: { agree: 0, neutral: 0, disagree: 0 },
    createdAt: serverTimestamp(),
    publishedAt: null,
    closedAt: null
  });
}

// One question is live at a time, so publishing closes the current one.
export async function publishIssue(id) {
  const live = await getDocs(query(collection(db, 'weekly_issues'), where('status', '==', 'live')));
  const batch = writeBatch(db);
  live.docs.forEach((d) => batch.update(d.ref, { status: 'closed', closedAt: serverTimestamp() }));
  batch.update(doc(db, 'weekly_issues', id), { status: 'live', publishedAt: serverTimestamp() });
  await batch.commit();
}

export const closeIssue = (id) => updateDoc(doc(db, 'weekly_issues', id), { status: 'closed', closedAt: serverTimestamp() });
export const deleteDraftIssue = (id) => deleteDoc(doc(db, 'weekly_issues', id));

export async function fetchOverview() {
  const [responses, proposals, feedback, issues] = await Promise.all([
    fetchAllResponses(), fetchInbox('proposals'), fetchInbox('feedback'), fetchIssues()
  ]);
  return { responses, proposals, feedback, issues };
}
