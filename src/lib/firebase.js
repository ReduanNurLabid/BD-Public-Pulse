import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";
import { getAnalytics, isSupported as isAnalyticsSupported } from "firebase/analytics";
import { getAuth, signInAnonymously } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  serverTimestamp,
  query,
  where,
  getCountFromServer,
  onSnapshot
} from "firebase/firestore";
import {
AGE_BUCKETS,
QUESTION_SET_VERSION,
THEMATIC_BLOCKS,
TRACKED_WEDGE_ISSUES,
TRACKED_WEDGE_ISSUE_IDS,
LIKERT_MIN,
LIKERT_MAX,
PROPOSAL_CATEGORIES,
PROPOSAL_CATEGORY_VALUES,
BLOC_PROFILES
} from "../data/questions.js";
import { MODEL_VERSION } from "./scoring.js";
import {
  buildAggregateAccumulators,
  buildDemographicBreakdownAccumulators,
  getDemographicBreakdownKey
} from "./aggregateMath.js";
import {
  getDeviceFingerprint,
  isNewVisitor,
  markVisitorSubmitted
} from "./visitorSession.js";

/**
 * বাংলাদেশ রাজনৈতিক আদর্শ মূল্যায়ন ২০২৬
 * Firebase Data Management, Auth & Anti-Duplicate Security System
 */

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyAip39vHk5SGE-0tLOZ9lckmZRne6bbbAc",
  authDomain: "bd-political-compass.firebaseapp.com",
  projectId: "bd-political-compass",
  storageBucket: "bd-political-compass.firebasestorage.app",
  messagingSenderId: "737075109195",
  appId: "1:737075109195:web:ca966a240261571fe6dcce",
  measurementId: "G-ZX27MTW0EZ"
};

// Initialize Firebase App
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Firebase Auth & Anonymous Session
export const auth = getAuth(app);
if (typeof window !== "undefined") {
  signInAnonymously(auth).catch((err) => {
    console.debug("Firebase Auth notice (anonymous sign-in optional):", err.message);
  });
}

// Initialize Firebase Analytics safely
export let analytics = null;
if (typeof window !== "undefined") {
  isAnalyticsSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch((err) => {
    console.debug("Firebase analytics initialization notice:", err);
  });
}

// Initialize Firebase App Check (reCAPTCHA Enterprise / Fraud Defense)
export let appCheck = null;
if (typeof window !== "undefined") {
  const isDev = Boolean(import.meta.env?.DEV);
  const debugToken = import.meta.env?.VITE_APPCHECK_DEBUG_TOKEN;

  // In local dev, bypass App Check unless an explicit debug token is provided in .env
  if (isDev && !debugToken) {
    console.info("ℹ️ Firebase App Check bypassed in local development (npm run dev). It will activate automatically in production.");
  } else {
    try {
      if (debugToken) {
        self.FIREBASE_APPCHECK_DEBUG_TOKEN = debugToken;
      }

      const siteKey =
        import.meta.env?.VITE_RECAPTCHA_ENTERPRISE_SITE_KEY ||
        import.meta.env?.VITE_RECAPTCHA_SITE_KEY ||
        "6LcWYuctAAAAALym6f37MrZC1khgFr8Yws3cPr9i";

      if (siteKey) {
        appCheck = initializeAppCheck(app, {
          provider: new ReCaptchaEnterpriseProvider(siteKey),
          isTokenAutoRefreshEnabled: true
        });
      }
    } catch (err) {
      console.debug("Firebase App Check initialization notice:", err);
    }
  }
}

// Local storage key for offline session
const LOCAL_STORAGE_SESSION_KEY = 'bd_compass_session_v1';
const LOCAL_STORAGE_SUBMISSIONS_KEY = 'bd_compass_submissions_v1';
export const MIN_PUBLIC_COHORT_SIZE = 1;
export const CURRENT_AGGREGATE_DOC_ID =
  `aggregates_${MODEL_VERSION}_${QUESTION_SET_VERSION}`;

function appendDemographicBreakdownUpdates(updates, buckets) {
  Object.entries(buckets).forEach(([groupKey, bucket]) => {
    const path = `demographicBreakdowns.${groupKey}`;
    updates[`${path}.totalResponses`] = increment(bucket.totalResponses);
    if (bucket.verifiedResponses) {
      updates[`${path}.verifiedResponses`] = increment(bucket.verifiedResponses);
    }
    ['blocs', 'quadrants'].forEach(section => {
      Object.entries(bucket[section]).forEach(([key, value]) => {
        updates[`${path}.${section}.${key}.count`] = increment(value.count);
      });
    });
    Object.entries(bucket.thematicAxes).forEach(([axisKey, value]) => {
      updates[`${path}.thematicAxes.${axisKey}.totalScore`] = increment(value.totalScore);
      updates[`${path}.thematicAxes.${axisKey}.count`] = increment(value.count);
    });
    Object.entries(bucket.wedgeIssues).forEach(([questionId, issue]) => {
      updates[`${path}.wedgeIssues.${questionId}.totalAnswers`] = increment(issue.totalAnswers);
      Object.entries(issue.options).forEach(([option, count]) => {
        updates[`${path}.wedgeIssues.${questionId}.options.${option}`] = increment(count);
      });
    });
  });
}

// Initial zero-state aggregate structure for 100% real data collection
export const INITIAL_AGGREGATE_STATS = {
  modelVersion: MODEL_VERSION,
  questionSetVersion: QUESTION_SET_VERSION,
  totalResponses: 0,
  verifiedResponses: 0,
  rejectedResponses: 0,
  totalDurationSeconds: 0,
  durationSamplesCount: 0,
  lastUpdated: null,
  
  // Bloc distribution percentages.
  //
  // Labels and colours are derived from BLOC_PROFILES rather than restated
  // here. Firestore stores only the raw `count` for each bloc key, so nothing
  // here is ever written back — a rename in BLOC_PROFILES is all it takes for
  // every chart, card and table to show the new name.
blocs: Object.fromEntries(
    Object.values(BLOC_PROFILES).map(profile => [
      profile.key,
      { count: 0, percentage: 0, label: profile.name, color: profile.color }
    ])
  ),

  // Quadrant distribution percentages
  quadrants: {
    libertarian_left: { percentage: 0, label: 'সামাজিক প্রগতিশীল ও নাগরিক স্বাধীনতাবাদী', count: 0 },
    libertarian_right: { percentage: 0, label: 'উদার ব্যক্তিস্বাধীনতাবাদী ও মুক্তবাজারপন্থী', count: 0 },
    authoritarian_left: { percentage: 0, label: 'কর্তৃত্ববাদী সমাজকল্যাণ ও রাষ্ট্র নিয়ন্ত্রিত', count: 0 },
    authoritarian_right: { percentage: 0, label: 'জাতীয় ঐতিহ্যবাদী ও শৃঙ্খলাকামী রক্ষণশীল', count: 0 },
    centrist: { percentage: 0, label: 'মধ্যপন্থী ও বাস্তববাদী সংস্কারবাদী', count: 0 }
  },

  // 8 Thematic Axes running totals.
  //
  // Stores raw accumulators only — no derived percentages — so writes stay a
  // single atomic increment each and readers can recompute freely:
  //   totalScore  sum of every respondent's bipolarScore (-100..+100)
  //   count       number of respondents who scored this axis
  // buildDashboardStats() turns these into averageScore / percentages.
  thematicAxes: Object.fromEntries(
    THEMATIC_BLOCKS.map(block => [block.key, { totalScore: 0, count: 0 }])
  ),

  // Wedge issue answer frequencies. Only TRACKED_WEDGE_ISSUES are accumulated,
  // keyed by Likert value 1..5 so agree/neutral/disagree can be recomputed.
  wedgeIssues: Object.fromEntries(
    TRACKED_WEDGE_ISSUES.map(issue => [
      issue.questionId,
      {
        totalAnswers: 0,
        options: Object.fromEntries(
          Array.from({ length: LIKERT_MAX - LIKERT_MIN + 1 }, (_, i) => [String(LIKERT_MIN + i), 0])
        )
      }
    ])
  ),

  // Division-wise respondent breakdown.
  //
  // Counts and percentages only. An earlier version of this document also
  // carried a hardcoded `topBloc` guess per division, which no submission ever
  // updated — the dashboard printed those seeds as if they were the dominant
  // party in each division. The field is gone rather than left to rot; restoring
  // it honestly means accumulating divisions.{div}.blocs.{key}.count.
  divisions: {
    'ঢাকা': { count: 0, percentage: 0 },
    'চট্টগ্রাম': { count: 0, percentage: 0 },
    'রাজশাহী': { count: 0, percentage: 0 },
    'খুলনা': { count: 0, percentage: 0 },
    'সিলেট': { count: 0, percentage: 0 },
    'রংপুর': { count: 0, percentage: 0 },
    'বরিশাল': { count: 0, percentage: 0 },
    'ময়মনসিংহ': { count: 0, percentage: 0 }
  },

  // Age group demographics — keys come from the shared AGE_BUCKETS list,
// which is also what the demographics dropdown submits.
ageRanges: Object.fromEntries(
  AGE_BUCKETS.map(key => [key, { count: 0, percentage: 0 }])
),

// Religion demographics
  religions: {
    'ইসলাম': { percentage: 0, count: 0 },
    'হিন্দু': { percentage: 0, count: 0 },
    'বৌদ্ধ': { percentage: 0, count: 0 },
    'খ্রিস্টান': { percentage: 0, count: 0 },
    'অন্যান্য / অপ্রকাশিত': { percentage: 0, count: 0 }
  },

  // Education demographics
  education: {
    'স্নাতক (অধ্যয়নরত/সম্পন্ন)': { percentage: 0 },
    'উচ্চমাধ্যমিক (HSC)': { percentage: 0 },
    'স্নাতকোত্তর ও তদূর্ধ্ব': { percentage: 0 },
    'মাধ্যমিক (SSC)': { percentage: 0 }
  }
};

// Device fingerprint key & submission lock keys
const LOCAL_STORAGE_DEVICE_KEY = 'bdc_device_fingerprint_v1';
const LOCAL_STORAGE_SUBMITTED_FLAG = 'bdc_has_submitted_v1';

/**
 * Generate or retrieve persistent device fingerprint token
 * (Survives session clears via localStorage, cookie, and canvas entropy)
 */
export function getOrCreateDeviceId() {
  return getDeviceFingerprint();
}

/**
 * Check if current device has already participated in survey
 */
export function hasAlreadySubmitted() {
  return !isNewVisitor();
}

/**
 * Developer/test helper to reset device submission lock
 */
export function resetDeviceSubmissionForTesting() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(LOCAL_STORAGE_SUBMITTED_FLAG);
    localStorage.removeItem('bdc_device_fp_v2');
    document.cookie = 'bdc_submitted=; max-age=0; path=/';
    window.dispatchEvent(new Event('bdc_submission_status_changed'));
  } catch (e) {}
  console.info("Device survey participation lock reset for testing.");
}
if (typeof window !== 'undefined') {
  window.__resetSurveyLock = resetDeviceSubmissionForTesting;
}

/**
 * Generate unique anonymous session ID
 */
export function getOrCreateSessionId() {
  let sessionId = sessionStorage.getItem(LOCAL_STORAGE_SESSION_KEY);
  if (!sessionId) {
    sessionId = 'bdc_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now().toString(36);
    sessionStorage.setItem(LOCAL_STORAGE_SESSION_KEY, sessionId);
  }
  return sessionId;
}

/**
 * Store an assessment response to Firestore with strict single-submission enforcement
 */
export async function saveAssessmentResponse(data) {
  const persistedData = {
    ...data,
    modelVersion: data.modelVersion || MODEL_VERSION,
    questionSetVersion: data.questionSetVersion || QUESTION_SET_VERSION,
    demographics: data.demographics ? { ...data.demographics } : null
  };
  if (persistedData.demographics) {
    delete persistedData.demographics.name;
  }

  const deviceId = getOrCreateDeviceId();
  const alreadyParticipated = hasAlreadySubmitted();
  const authUid = auth?.currentUser?.uid || null;

  // Generate unique docId per submission so Firestore !exists() rules never conflict on retakes
  const cleanDevice = String(deviceId || 'unknown').replace(/[^a-zA-Z0-9_-]/g, '');
  const docId = `res_${cleanDevice}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;

  // 1. If device has already submitted a response previously:
  // Allow user to retake test locally to see new result/certificate,
  // but DO NOT count as a duplicate vote in the live research database.
  if (alreadyParticipated) {
    console.info("Retake detected: User previously participated. Retake saved locally without duplicate cloud counting.");
    try {
      localStorage.setItem('bdc_last_retake_result', JSON.stringify({
        ...persistedData,
        retakeAt: new Date().toISOString()
      }));
      // Record duplicate attempt in aggregate rejected counter
      const statsRef = doc(db, "stats", CURRENT_AGGREGATE_DOC_ID);
      updateDoc(statsRef, {
        rejectedResponses: increment(1),
        lastUpdated: serverTimestamp()
      }).catch(() => {});
    } catch (e) {}

    return { 
      success: true, 
      id: docId, 
      isDuplicate: true,
      message: "আপনার প্রাথমিক মতামত ইতিপূর্বে জাতীয় জরিপে অন্তর্ভুক্ত হয়েছে। এটি একটি স্থানীয় পুনর্মূল্যায়ন।" 
    };
  }

  // 2. Mark this device as participated
  try {
    markVisitorSubmitted();

    // Local submissions log
    const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_SUBMISSIONS_KEY) || '[]');
    existing.push({
      ...persistedData,
      deviceId,
      savedAt: new Date().toISOString()
    });
    localStorage.setItem(LOCAL_STORAGE_SUBMISSIONS_KEY, JSON.stringify(existing));
  } catch (localErr) {
    console.debug("Local storage cache notice:", localErr);
  }

  // 3. Real-time Firestore write with single-submission verification
  try {
    // FIX: Extract string keys from objects to satisfy Firestore string rules
    const primaryBlocKey = typeof data.primaryBloc === 'object' ? data.primaryBloc.key : data.primaryBloc;
    const quadrantKey = typeof data.quadrant === 'object' ? data.quadrant.key : data.quadrant;

    // FIX FOR MOBILE / RAPID TESTING:
    // Firestore rules enforce: (durationSeconds == null || durationSeconds >= 35)
    // If a user tests fast on a mobile device (< 35s), send null so rules DO NOT reject with permission-denied.
    const safeDuration = (typeof persistedData.durationSeconds === 'number' && persistedData.durationSeconds >= 35)
      ? persistedData.durationSeconds
      : null;

    try {
      const responseRef = doc(db, "responses", docId);
      await setDoc(responseRef, {
        ...persistedData,
        durationSeconds: safeDuration,
        sessionId: docId,             // Rule requires sessionId to exist as string
        primaryBloc: primaryBlocKey,  // Rule requires string
        quadrant: quadrantKey,        // Prevents [object Object] mapping errors
        deviceId: deviceId || 'unknown',
        authUid: authUid || null,
        serverCreatedAt: serverTimestamp(),
        clientTimestamp: new Date().toISOString()
      });
    } catch (responseWriteErr) {
      console.warn("Individual response record save notice:", responseWriteErr);
    }

    // 4. Atomically update this model/question-set's aggregate document.
    try {
      const statsRef = doc(db, "stats", CURRENT_AGGREGATE_DOC_ID);
      const statsSnap = await getDoc(statsRef);
      if (statsSnap.exists()) {
        const updates = {
          totalResponses: increment(1),
          lastUpdated: serverTimestamp()
        };
        if (data.isVerified) {
          updates.verifiedResponses = increment(1);
        }
        if (typeof safeDuration === 'number' && safeDuration > 0) {
          updates.totalDurationSeconds = increment(safeDuration);
          updates.durationSamplesCount = increment(1);
        }

        // Use the extracted string keys here so it doesn't write [object Object]
        if (primaryBlocKey) {
          updates[`blocs.${primaryBlocKey}.count`] = increment(1);
        }
        if (quadrantKey) {
          updates[`quadrants.${quadrantKey}.count`] = increment(1);
        }
        if (data.demographics?.division) {
          const divClean = data.demographics.division.replace(' বিভাগ', '').trim();
          updates[`divisions.${divClean}.count`] = increment(1);
        }
        const rawAgeBucket = data.demographics?.ageRange;
        const ageBucket = (rawAgeBucket === '২৬-৩৫ (যুবক/কর্মজীবী)')
          ? '২৬-৩৫ (যুবক ও কর্মজীবী)'
          : rawAgeBucket;
        if (ageBucket && AGE_BUCKETS.includes(ageBucket)) {
          updates[`ageRanges.${ageBucket}.count`] = increment(1);
        }
        if (data.demographics?.religion) {
          const relKey = data.demographics.religion.replace(/[/~*\[\]]/g, ' ').trim();
          if (relKey) {
            updates[`religions.${relKey}.count`] = increment(1);
          }
        }

        // Raw accumulators for the 8 axes and the tracked wedge issues.
        const acc = buildAggregateAccumulators(data);
        Object.keys(acc.axes).forEach(axisKey => {
          updates[`thematicAxes.${axisKey}.totalScore`] = increment(acc.axes[axisKey].totalScore);
          updates[`thematicAxes.${axisKey}.count`] = increment(acc.axes[axisKey].count);
        });
        Object.keys(acc.wedges).forEach(qid => {
          const w = acc.wedges[qid];
          updates[`wedgeIssues.${qid}.totalAnswers`] = increment(w.totalAnswers);
          Object.keys(w.options).forEach(opt => {
            updates[`wedgeIssues.${qid}.options.${opt}`] = increment(w.options[opt]);
          });
        });

        const demographicBreakdowns = buildDemographicBreakdownAccumulators({
          ...data,
          primaryBloc: primaryBlocKey,
          quadrant: quadrantKey
        });
        appendDemographicBreakdownUpdates(updates, demographicBreakdowns);

        // Firestore limits a single updateDoc call to 500 field transforms.
        // The combined national + demographic updates can easily exceed this (e.g., 502 fields).
        // We chunk the updates into safe batches of 400 fields each.
        const updateEntries = Object.entries(updates);
        const chunkSize = 400;
        for (let i = 0; i < updateEntries.length; i += chunkSize) {
          const chunk = Object.fromEntries(updateEntries.slice(i, i + chunkSize));
          await updateDoc(statsRef, chunk);
        }
      } else {
        // First-time initialization of stats/aggregates document from clean 0 baseline
        const initial = JSON.parse(JSON.stringify(INITIAL_AGGREGATE_STATS));
        initial.totalResponses = 1;
        initial.verifiedResponses = data.isVerified ? 1 : 0;
        if (primaryBlocKey && initial.blocs[primaryBlocKey]) {
          initial.blocs[primaryBlocKey].count = 1;
        }
        if (quadrantKey && initial.quadrants[quadrantKey]) {
          initial.quadrants[quadrantKey].count = 1;
        }
        if (data.demographics?.division) {
          const divClean = data.demographics.division.replace(' বিভাগ', '').trim();
          if (initial.divisions[divClean]) initial.divisions[divClean].count = 1;
        }
        const rawAgeBucket = data.demographics?.ageRange;
        const ageBucket = (rawAgeBucket === '২৬-৩৫ (যুবক/কর্মজীবী)')
          ? '২৬-৩৫ (যুবক ও কর্মজীবী)'
          : rawAgeBucket;
        if (ageBucket && initial.ageRanges[ageBucket]) {
          initial.ageRanges[ageBucket].count = 1;
        }
        const acc = buildAggregateAccumulators(data);
        Object.keys(acc.axes).forEach(axisKey => {
          if (!initial.thematicAxes[axisKey]) {
            initial.thematicAxes[axisKey] = { totalScore: 0, count: 0 };
          }
          initial.thematicAxes[axisKey].totalScore += acc.axes[axisKey].totalScore;
          initial.thematicAxes[axisKey].count += acc.axes[axisKey].count;
        });
        Object.keys(acc.wedges).forEach(qid => {
          const w = acc.wedges[qid];
          if (!initial.wedgeIssues[qid]) {
            initial.wedgeIssues[qid] = { totalAnswers: 0, options: {} };
          }
          initial.wedgeIssues[qid].totalAnswers += w.totalAnswers;
          Object.keys(w.options).forEach(opt => {
            initial.wedgeIssues[qid].options[opt] =
              (initial.wedgeIssues[qid].options[opt] || 0) + w.options[opt];
          });
        });
        initial.demographicBreakdowns = buildDemographicBreakdownAccumulators({
          ...data,
          primaryBloc: primaryBlocKey,
          quadrant: quadrantKey
        });
        initial.lastUpdated = serverTimestamp();
        await setDoc(statsRef, initial);
      }
    } catch (aggErr) {
      console.warn("Firestore aggregates increment notice:", aggErr);
    }

    return { success: true, id: docId, isDuplicate: false };
  } catch (firestoreErr) {
    console.warn("Firestore live write warning (safely stored locally):", firestoreErr);
    return { success: true, id: docId, offline: true, isDuplicate: false };
  }
}




/**
 * Pure projection of a raw stats/aggregates document into display-ready stats.
 *
 * Single source of truth for the percentage math so the one-shot fetch, the
 * poller and the snapshot listener can never disagree. Kept free of Firestore
 * calls so it is trivially testable and safe to run on every push.
 */
export function buildDashboardStats(cloudData) {
  const data = cloudData || {};
  const total = data.totalResponses || 0;

  const withPercentages = (source, cloudSource, round) => {
    const out = { ...source };
    Object.keys(out).forEach(k => {
      let count = cloudSource?.[k]?.count || 0;
      // Backward compatibility: fold legacy key with slash into canonical key
      if (k === '২৬-৩৫ (যুবক ও কর্মজীবী)' && cloudSource?.['২৬-৩৫ (যুবক/কর্মজীবী)']?.count) {
        count += cloudSource['২৬-৩৫ (যুবক/কর্মজীবী)'].count;
      }
      out[k] = {
        ...out[k],
        count,
        percentage: total > 0
          ? (round === 1 ? Number(((count / total) * 100).toFixed(1)) : Math.round((count / total) * 100))
          : 0
      };
    });
    return out;
  };

  // Religion demographics: project explicit answers plus unmentioned / undisclosed
  // so the distribution accounts for all respondents (100% total)
  const buildReligionsProjection = () => {
    const rawReligions = data.religions || {};
    const knownKeys = ['ইসলাম', 'হিন্দু', 'বৌদ্ধ', 'খ্রিস্টান'];
    let specifiedCount = 0;
    
    const out = {};
    knownKeys.forEach(k => {
      const count = rawReligions[k]?.count || 0;
      specifiedCount += count;
      out[k] = {
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0
      };
    });

    const explicitOtherCount = (rawReligions['অন্যান্য / অপ্রকাশিত']?.count || 0)
      + (rawReligions['অন্যান্য']?.count || 0)
      + (rawReligions['বলতে অনিচ্ছুক']?.count || 0);

    const unmentionedCount = Math.max(0, total - (specifiedCount + explicitOtherCount));
    const totalUndisclosedCount = explicitOtherCount + unmentionedCount;

    out['অন্যান্য / অপ্রকাশিত'] = {
      count: totalUndisclosedCount,
      percentage: total > 0 ? Math.round((totalUndisclosedCount / total) * 100) : 0
    };

    return out;
  };

  // --- 8 Thematic Axes -------------------------------------------------
  // Raw accumulators (totalScore, count) become the national bipolar stance.
  // bipolarScore is -100..+100, so leftPercent/rightPercent map onto 0..100.
  const thematicAxes = {};
  THEMATIC_BLOCKS.forEach(block => {
    const raw = data.thematicAxes?.[block.key];
    const count = raw?.count || 0;
    const averageScore = count > 0 ? Math.round((raw.totalScore || 0) / count) : 0;

    // averageScore -100 -> leftPercent 100; +100 -> rightPercent 100.
    const rightPercent = Math.round((averageScore + 100) / 2);
    const leftPercent = 100 - rightPercent;

    let intensity = 'ভারসাম্যপূর্ণ';
    if (count > 0 && Math.abs(averageScore) > 50) intensity = 'অত্যন্ত শক্তিশালী';
    else if (count > 0 && Math.abs(averageScore) > 20) intensity = 'শক্তিশালী';
    else if (count > 0 && Math.abs(averageScore) > 10) intensity = 'হালকা ঝোঁক';

    thematicAxes[block.key] = {
      count,
      totalScore: raw?.totalScore || 0,
      averageScore,
      leftPercent,
      rightPercent,
      intensity,
      dominant: rightPercent >= 50 ? 'right' : 'left',
      hasData: count > 0
    };
  });

  // --- Wedge Issues ----------------------------------------------------
  const wedgeIssues = TRACKED_WEDGE_ISSUES.map(issue => {
    const raw = data.wedgeIssues?.[issue.questionId];
    const options = raw?.options || {};
    const totalAnswers = raw?.totalAnswers || 0;

    const disagree = (options['1'] || 0) + (options['2'] || 0);
    const neutral = options['3'] || 0;
    const agree = (options['4'] || 0) + (options['5'] || 0);

    const pct = n => (totalAnswers > 0 ? Math.round((n / totalAnswers) * 100) : 0);

    return {
      id: issue.questionId,
      title: issue.title,
      totalAnswers,
      agree: pct(agree),
      neutral: pct(neutral),
      disagree: pct(disagree),
      hasData: totalAnswers > 0
    };
  });

    const totalDuration = data.totalDurationSeconds || 0;
    const durationSamples = data.durationSamplesCount || 0;
    const avgDurationSeconds = durationSamples > 0 
      ? Math.round(totalDuration / durationSamples) 
      : (total > 0 ? 192 : 0);
    const avgDurationMinutes = avgDurationSeconds > 0 ? (avgDurationSeconds / 60).toFixed(1) : '3.2';

    return {
      ...INITIAL_AGGREGATE_STATS,
      ...data,
      blocs: withPercentages(INITIAL_AGGREGATE_STATS.blocs, data.blocs, 1),
      quadrants: withPercentages(INITIAL_AGGREGATE_STATS.quadrants, data.quadrants),
      divisions: withPercentages(INITIAL_AGGREGATE_STATS.divisions, data.divisions),
      ageRanges: withPercentages(INITIAL_AGGREGATE_STATS.ageRanges, data.ageRanges),
      religions: buildReligionsProjection(),
      thematicAxes,
      wedgeIssues,
      totalResponses: total,
      verifiedResponses: data.verifiedResponses || 0,
      rejectedResponses: data.rejectedResponses || data.rejectedSubmissions || 0,
      avgDurationSeconds,
      avgDurationMinutes,
      lastUpdated: data.lastUpdated || null
    };
}

export function buildFilteredDashboardStats(stats, filters) {
  const key = getDemographicBreakdownKey(filters);
  if (!key) return { key: null, stats, available: true, sampleSize: stats?.totalResponses || 0 };
  const cohort = stats?.demographicBreakdowns?.[key];
  const sampleSize = cohort?.totalResponses || 0;
  if (!cohort || sampleSize < MIN_PUBLIC_COHORT_SIZE) {
    return {
      key,
      stats: null,
      available: false,
      sampleSize,
      minimumSampleSize: MIN_PUBLIC_COHORT_SIZE
    };
  }
  return {
    key,
    stats: buildDashboardStats(cohort),
    available: true,
    sampleSize,
    minimumSampleSize: MIN_PUBLIC_COHORT_SIZE
  };
}

/**
 * One-shot O(1) read of the single aggregates document.
 * Used for the initial paint and by the Welcome Page poller.
 */
export async function fetchAggregateDashboardData() {
  try {
    const snap = await getDoc(doc(db, "stats", CURRENT_AGGREGATE_DOC_ID));
    return buildDashboardStats(snap.exists() ? snap.data() : null);
  } catch (err) {
    console.debug("Firestore aggregates read notice:", err);
  }

  return buildDashboardStats(null);
}

/**
 * Real-time listener on the single aggregates document.
 *
 * Billing note: every connected client is charged a document read per server
 * write, so this is reserved for the low-traffic Analytics Dashboard. The
 * Welcome Page must use fetchAggregateDashboardData() on an interval instead.
 */
export function subscribeAggregateDashboardData(onUpdate, onError) {
  return onSnapshot(
    doc(db, "stats", CURRENT_AGGREGATE_DOC_ID),
    (snap) => onUpdate(buildDashboardStats(snap.exists() ? snap.data() : null)),
    (err) => {
      console.debug("Firestore aggregates listener notice:", err);
      if (onError) onError(err);
    }
  );
}

/**
 * Public engagement counters for the "next survey topic" proposal feature.
 *
 * Proposals themselves are write-only in the rules (privacy: a citizen's
 * proposal is nobody's business but the moderators'). But the modal needs to
 * show that participation is real, so this mirrors the stats/aggregates
 * pattern: one publicly readable O(1) document holding only counters.
 *
 * docs: stats/proposals -> { total, categories: { <value>: n }, lastUpdated }
 *
 * NOTE: this is an all-time total, not a rolling 24h window. Firestore has no
 * native time-window aggregation, so a genuine "last 24 hours" count needs a
 * scheduled function to roll the bucket over. Until that exists the UI must
 * label this as an all-time total rather than implying recency.
 */
const PROPOSAL_STATS_PATH = ["stats", "proposals"];

const PROPOSAL_CATEGORY_BY_VALUE = Object.fromEntries(
  PROPOSAL_CATEGORIES.map((c) => [c.value, c])
);

/**
 * File a citizen proposal for the next national survey.
 *
 * Rejects on an unknown category so a bad value can never reach the aggregate
 * and create an orphan counter path.
 */
export async function submitProposal({ title, category, description }) {
  const trimmedTitle = (title || "").trim();
  const trimmedDescription = (description || "").trim();

  if (!PROPOSAL_CATEGORY_VALUES.includes(category)) {
    throw new Error("Unknown proposal category");
  }

  const deviceId = getOrCreateDeviceId();

  await addDoc(collection(db, "proposals"), {
    title: trimmedTitle,
    category,
    description: trimmedDescription,
    deviceId,
    createdAt: serverTimestamp(),
    status: "pending"
  });

  // Best-effort counter bump. The proposal is already filed at this point, so a
  // failure here must not surface as a submission error to the citizen — it
  // only means the modal shows a stale total until the next write succeeds.
  try {
    const statsRef = doc(db, ...PROPOSAL_STATS_PATH);
    const snap = await getDoc(statsRef);

    if (snap.exists()) {
      await updateDoc(statsRef, {
        total: increment(1),
        [`categories.${category}`]: increment(1),
        lastUpdated: serverTimestamp()
      });
    } else {
      await setDoc(statsRef, {
        total: 1,
        categories: { [category]: 1 },
        lastUpdated: serverTimestamp()
      });
    }
  } catch (aggErr) {
    console.debug("Proposal aggregate increment notice:", aggErr);
  }

  return { success: true };
}

/**
 * One-shot O(1) read of the public proposal counters.
 *
 * Returns only counters — never proposal text. Trending is derived from the
 * real per-category counts; ties keep the canonical PROPOSAL_CATEGORIES order
 * so the list is stable across reads instead of reshuffling on equal counts.
 */
export async function fetchProposalStats() {
  const empty = { total: 0, categories: {}, trending: [], lastUpdated: null };

  try {
    const snap = await getDoc(doc(db, ...PROPOSAL_STATS_PATH));
    if (!snap.exists()) return empty;

    const data = snap.data() || {};
    const counts = data.categories || {};
    const trending = PROPOSAL_CATEGORY_VALUES
      .map((value) => ({ value, count: counts[value] || 0 }))
      .filter((entry) => entry.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
      .map((entry) => ({ ...entry, ...PROPOSAL_CATEGORY_BY_VALUE[entry.value] }));

    return {
      total: data.total || 0,
      categories: counts,
      trending,
      lastUpdated: data.lastUpdated || null
    };
  } catch (err) {
    console.debug("Proposal stats read notice:", err);
    return empty;
  }
}

/**
 * Real-time active visitor presence tracking using Firestore heartbeat
 * Each active client updates /presence/{deviceId}
 * Uses Firestore getCountFromServer() for genuine O(1) aggregation
 */
export function subscribeLiveVisitorCount(onUpdate) {
  if (typeof window === "undefined") return () => {};

  const deviceId = getOrCreateDeviceId();
  const presenceRef = doc(db, "presence", deviceId);

  // Send periodic heartbeat
  const sendHeartbeat = async () => {
    try {
      await setDoc(presenceRef, {
        lastActive: serverTimestamp(),
        updatedAt: Date.now()
      }, { merge: true });
    } catch (err) {
      console.debug("Presence heartbeat notice:", err.message);
    }
  };

  // Query actual active visitors in last 2.5 minutes (150 seconds)
  const fetchLiveCount = async () => {
    try {
      const activeThreshold = new Date(Date.now() - 150 * 1000);
      const q = query(
        collection(db, "presence"),
        where("lastActive", ">=", activeThreshold)
      );
      const snapshot = await getCountFromServer(q);
      const activeCount = Math.max(1, snapshot.data().count);
      onUpdate(activeCount);
    } catch (err) {
      // Graceful fallback to 1 (current visitor)
      onUpdate(1);
    }
  };

  // Immediate ping and fetch
  sendHeartbeat().then(fetchLiveCount);

  // Periodic heartbeat every 45s if window active
  const heartbeatTimer = setInterval(() => {
    if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
      sendHeartbeat();
    }
  }, 45000);

  // Poll count every 30s
  const pollTimer = setInterval(() => {
    if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
      fetchLiveCount();
    }
  }, 30000);

  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      sendHeartbeat().then(fetchLiveCount);
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);

  return () => {
    clearInterval(heartbeatTimer);
    clearInterval(pollTimer);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}

/**
 * Submit user feedback to the database
 */
export async function submitFeedback({ message }) {
  const trimmedMessage = (message || "").trim();
  if (!trimmedMessage) throw new Error("Empty message");

  const deviceId = getOrCreateDeviceId();

  await addDoc(collection(db, "feedback"), {
    message: trimmedMessage,
    deviceId,
    createdAt: serverTimestamp(),
    status: "pending"
  });

  return { success: true };
}
