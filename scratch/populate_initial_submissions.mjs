import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from 'firebase/firestore';

import {
  QUESTIONS,
  THEMATIC_BLOCKS,
  BLOC_PROFILES,
  QUADRANT_PROFILES,
  AGE_BUCKETS,
  TRACKED_WEDGE_ISSUES,
  TRACKED_WEDGE_ISSUE_IDS,
  LIKERT_MIN,
  LIKERT_MAX,
  QUESTION_SET_VERSION
} from '../src/data/questions.js';

import {
  calculateComprehensiveAnalysis,
  MODEL_VERSION
} from '../src/lib/scoring.js';

import {
  buildAggregateAccumulators,
  buildDemographicBreakdownAccumulators
} from '../src/lib/aggregateMath.js';

import {
  CURRENT_AGGREGATE_DOC_ID,
  INITIAL_AGGREGATE_STATS
} from '../src/lib/firebase.js';

const firebaseConfig = {
  apiKey: "AIzaSyAip39vHk5SGE-0tLOZ9lckmZRne6bbbAc",
  authDomain: "bd-political-compass.firebaseapp.com",
  projectId: "bd-political-compass",
  storageBucket: "bd-political-compass.firebasestorage.app",
  messagingSenderId: "737075109195",
  appId: "1:737075109195:web:ca966a240261571fe6dcce",
  measurementId: "G-ZX27MTW0EZ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Helper to simulate answers for a target profile
function generateAnswers(targetBloc, seedOffset = 0) {
  let peak = 0;
  QUESTIONS.forEach(q => {
    peak = Math.max(peak, Math.abs((q.bloc_weights || {})[targetBloc] || 0));
  });
  const peakClamped = peak || 1;

  return QUESTIONS.map((q, idx) => {
    let scoreVal = 3;
    if (targetBloc !== 'Mixed' && q.bloc_weights && q.bloc_weights[targetBloc] !== undefined) {
      const w = q.bloc_weights[targetBloc];
      const t = w === 0 ? 0 : Math.max(-1, Math.min(1, w / peakClamped));
      scoreVal = 3 + Math.round(2 * t);
    }

    // Natural human noise: tweak by +/- 1 on a few non-defining questions
    if ((idx + seedOffset) % 6 === 0 && scoreVal !== 3) {
      scoreVal = scoreVal > 3 ? scoreVal - 1 : scoreVal + 1;
    } else if ((idx + seedOffset) % 7 === 0 && scoreVal === 3) {
      scoreVal = (seedOffset % 2 === 0) ? 4 : 2;
    }

    scoreVal = Math.max(1, Math.min(5, scoreVal));
    return {
      questionId: q.id,
      score: scoreVal,
      blockId: q.blockId
    };
  });
}

const RESPONDENT_PROFILES = [
  {
    name: 'Surveyor 1 (NCP / Student Youth)',
    targetBloc: 'Student',
    seed: 1,
    durationSeconds: 145,
    demographics: {
      division: 'ঢাকা',
      ageRange: '১৮-২৫ (তরুণ প্রজন্ম)',
      gender: 'পুরুষ',
      education: 'স্নাতক (অধ্যয়নরত/সম্পন্ন)',
      occupation: 'শিক্ষার্থী',
      religion: 'ইসলাম'
    }
  },
  {
    name: 'Surveyor 2 (BNP / Business Owner)',
    targetBloc: 'BNP',
    seed: 2,
    durationSeconds: 215,
    demographics: {
      division: 'চট্টগ্রাম',
      ageRange: '৩৬-৪৫ (মধ্যবয়সী)',
      gender: 'পুরুষ',
      education: 'স্নাতক (অধ্যয়নরত/সম্পন্ন)',
      occupation: 'ব্যবসায়ী',
      religion: 'ইসলাম'
    }
  },
  {
    name: 'Surveyor 3 (Jamaat / Islamic Educator)',
    targetBloc: 'JI',
    seed: 3,
    durationSeconds: 190,
    demographics: {
      division: 'সিলেট',
      ageRange: '৪৬-৬০ (অভিজ্ঞ নাগরিক)',
      gender: 'পুরুষ',
      education: 'স্নাতকোত্তর ও তদূর্ধ্ব',
      occupation: 'শিক্ষক / শিক্ষাবিদ',
      religion: 'ইসলাম'
    }
  },
  {
    name: 'Surveyor 4 (Sushil / Civil Society Lawyer)',
    targetBloc: 'Sushil',
    seed: 4,
    durationSeconds: 260,
    demographics: {
      division: 'ঢাকা',
      ageRange: '৩৬-৪৫ (মধ্যবয়সী)',
      gender: 'নারী',
      education: 'স্নাতকোত্তর ও তদূর্ধ্ব',
      occupation: 'আইনজীবী / গবেষক',
      religion: 'ইসলাম'
    }
  },
  {
    name: 'Surveyor 5 (NCP / Tech Professional)',
    targetBloc: 'Student',
    seed: 5,
    durationSeconds: 165,
    demographics: {
      division: 'রাজশাহী',
      ageRange: '২৬-৩৫ (যুবক/কর্মজীবী)',
      gender: 'নারী',
      education: 'স্নাতক (অধ্যয়নরত/সম্পন্ন)',
      occupation: 'ফ্রিল্যান্সার / আইটি',
      religion: 'হিন্দু'
    }
  },
  {
    name: 'Surveyor 6 (BNP / Agro-Entrepreneur)',
    targetBloc: 'BNP',
    seed: 6,
    durationSeconds: 195,
    demographics: {
      division: 'খুলনা',
      ageRange: '২৬-৩৫ (যুবক/কর্মজীবী)',
      gender: 'পুরুষ',
      education: 'উচ্চমাধ্যমিক (HSC)',
      occupation: 'কৃষি উদ্যোক্তা',
      religion: 'ইসলাম'
    }
  },
  {
    name: 'Surveyor 7 (JI / Community Leader)',
    targetBloc: 'JI',
    seed: 7,
    durationSeconds: 180,
    demographics: {
      division: 'রংপুর',
      ageRange: '২৬-৩৫ (যুবক/কর্মজীবী)',
      gender: 'পুরুষ',
      education: 'মাদ্রাসা / কওমি',
      occupation: 'ব্যবসায়ী',
      religion: 'ইসলাম'
    }
  },
  {
    name: 'Surveyor 8 (Sushil / Healthcare Professional)',
    targetBloc: 'Sushil',
    seed: 8,
    durationSeconds: 230,
    demographics: {
      division: 'ময়মনসিংহ',
      ageRange: '২৬-৩৫ (যুবক/কর্মজীবী)',
      gender: 'নারী',
      education: 'স্নাতকোত্তর ও তদূর্ধ্ব',
      occupation: 'চিকিৎসক / স্বাস্থ্যকর্মী',
      religion: 'ইসলাম'
    }
  },
  {
    name: 'Surveyor 9 (AL / Traditionalist Pensioner)',
    targetBloc: 'AL',
    seed: 9,
    durationSeconds: 245,
    demographics: {
      division: 'বরিশাল',
      ageRange: '৬০+ (জ্যেষ্ঠ নাগরিক)',
      gender: 'পুরুষ',
      education: 'স্নাতকোত্তর ও তদূর্ধ্ব',
      occupation: 'অবসরপ্রাপ্ত কর্মকর্তা',
      religion: 'ইসলাম'
    }
  },
  {
    name: 'Surveyor 10 (Centrist / Pragmatic Reformist)',
    targetBloc: 'Mixed',
    seed: 10,
    durationSeconds: 205,
    demographics: {
      division: 'ঢাকা',
      ageRange: '১৮-২৫ (তরুণ প্রজন্ম)',
      gender: 'পুরুষ',
      education: 'স্নাতক (অধ্যয়নরত/সম্পন্ন)',
      occupation: 'শিক্ষার্থী',
      religion: 'ইসলাম'
    }
  }
];

async function main() {
  console.log('--- Populating 10 Fake Survey Completions for Initial Launch ---');
  console.log(`Model Version: ${MODEL_VERSION}`);
  console.log(`Question Set: ${QUESTION_SET_VERSION}`);
  console.log(`Aggregate Doc ID: ${CURRENT_AGGREGATE_DOC_ID}\n`);

  // Start with clean initial zero-state aggregate structure
  const aggregate = JSON.parse(JSON.stringify(INITIAL_AGGREGATE_STATS));
  aggregate.totalResponses = 0;
  aggregate.verifiedResponses = 0;
  aggregate.demographicBreakdowns = {};

  const timestampNow = new Date().toISOString();
  const createdResponses = [];

  for (let i = 0; i < RESPONDENT_PROFILES.length; i++) {
    const p = RESPONDENT_PROFILES[i];
    const answers = generateAnswers(p.targetBloc, p.seed);
    const analysis = calculateComprehensiveAnalysis(answers);

    const primaryBlocKey = typeof analysis.primaryBloc === 'object' ? analysis.primaryBloc.key : analysis.primaryBloc;
    const quadrantKey = typeof analysis.quadrant === 'object' ? analysis.quadrant.key : analysis.quadrant;

    const deviceId = `sim_dev_${i + 1}_${Math.random().toString(36).substring(2, 8)}`;
    const sessionId = `sim_session_${i + 1}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const responseId = `d_${deviceId}`;

    const record = {
      sessionId,
      deviceId,
      answers,
      durationSeconds: p.durationSeconds,
      coordinates: analysis.coordinates,
      quadrant: quadrantKey,
      primaryBloc: primaryBlocKey,
      blockResults: analysis.blockResults,
      affinities: analysis.affinities,
      quality: analysis.quality,
      modelVersion: MODEL_VERSION,
      questionSetVersion: QUESTION_SET_VERSION,
      demographics: p.demographics,
      isVerified: true,
      clientTimestamp: timestampNow
    };

    console.log(`[${i + 1}/10] ${p.name}`);
    console.log(`      Bloc: ${primaryBlocKey} | Quadrant: ${quadrantKey} | Coords: (${analysis.coordinates.x}, ${analysis.coordinates.y}) | Div: ${p.demographics.division}`);

    // Write to /responses/{responseId}
    const responseRef = doc(db, 'responses', responseId);
    await setDoc(responseRef, record);
    createdResponses.push({ id: responseId, ...record });

    // Accumulate into aggregate
    aggregate.totalResponses += 1;
    aggregate.verifiedResponses += 1;

    if (aggregate.blocs[primaryBlocKey]) {
      aggregate.blocs[primaryBlocKey].count += 1;
    }
    if (aggregate.quadrants[quadrantKey]) {
      aggregate.quadrants[quadrantKey].count += 1;
    }

    const divClean = p.demographics.division.replace(' বিভাগ', '').trim();
    if (aggregate.divisions[divClean]) {
      aggregate.divisions[divClean].count += 1;
    }

    if (aggregate.ageRanges[p.demographics.ageRange]) {
      aggregate.ageRanges[p.demographics.ageRange].count += 1;
    }

    if (aggregate.religions && aggregate.religions[p.demographics.religion]) {
      aggregate.religions[p.demographics.religion].count += 1;
    }

    // Accumulate axes & wedges
    const acc = buildAggregateAccumulators(record);
    Object.keys(acc.axes).forEach(axisKey => {
      if (aggregate.thematicAxes[axisKey]) {
        aggregate.thematicAxes[axisKey].totalScore += acc.axes[axisKey].totalScore;
        aggregate.thematicAxes[axisKey].count += acc.axes[axisKey].count;
      }
    });

    Object.keys(acc.wedges).forEach(qid => {
      const w = acc.wedges[qid];
      if (aggregate.wedgeIssues[qid]) {
        aggregate.wedgeIssues[qid].totalAnswers += w.totalAnswers;
        Object.keys(w.options).forEach(opt => {
          aggregate.wedgeIssues[qid].options[opt] = (aggregate.wedgeIssues[qid].options[opt] || 0) + w.options[opt];
        });
      }
    });

    // Accumulate demographicBreakdowns
    const breakdowns = buildDemographicBreakdownAccumulators(record);
    Object.entries(breakdowns).forEach(([groupKey, bucket]) => {
      if (!aggregate.demographicBreakdowns[groupKey]) {
        aggregate.demographicBreakdowns[groupKey] = JSON.parse(JSON.stringify(bucket));
      } else {
        const dest = aggregate.demographicBreakdowns[groupKey];
        dest.totalResponses += bucket.totalResponses;
        dest.verifiedResponses = (dest.verifiedResponses || 0) + (bucket.verifiedResponses || 0);

        ['blocs', 'quadrants'].forEach(sec => {
          Object.entries(bucket[sec]).forEach(([k, v]) => {
            if (!dest[sec][k]) dest[sec][k] = { count: 0 };
            dest[sec][k].count += v.count;
          });
        });

        Object.entries(bucket.thematicAxes).forEach(([axisKey, val]) => {
          if (!dest.thematicAxes[axisKey]) dest.thematicAxes[axisKey] = { totalScore: 0, count: 0 };
          dest.thematicAxes[axisKey].totalScore += val.totalScore;
          dest.thematicAxes[axisKey].count += val.count;
        });

        Object.entries(bucket.wedgeIssues).forEach(([qid, issue]) => {
          if (!dest.wedgeIssues[qid]) dest.wedgeIssues[qid] = { totalAnswers: 0, options: {} };
          dest.wedgeIssues[qid].totalAnswers += issue.totalAnswers;
          Object.entries(issue.options).forEach(([opt, count]) => {
            dest.wedgeIssues[qid].options[opt] = (dest.wedgeIssues[qid].options[opt] || 0) + count;
          });
        });
      }
    });
  }

  // Calculate percentages
  Object.keys(aggregate.blocs).forEach(k => {
    aggregate.blocs[k].percentage = Math.round((aggregate.blocs[k].count / aggregate.totalResponses) * 100);
  });
  Object.keys(aggregate.quadrants).forEach(k => {
    aggregate.quadrants[k].percentage = Math.round((aggregate.quadrants[k].count / aggregate.totalResponses) * 100);
  });
  Object.keys(aggregate.divisions).forEach(k => {
    aggregate.divisions[k].percentage = Math.round((aggregate.divisions[k].count / aggregate.totalResponses) * 100);
  });
  Object.keys(aggregate.ageRanges).forEach(k => {
    aggregate.ageRanges[k].percentage = Math.round((aggregate.ageRanges[k].count / aggregate.totalResponses) * 100);
  });

  aggregate.lastUpdated = serverTimestamp();

  console.log('\n--- Writing aggregate documents to Firestore ---');
  // 1. Write to CURRENT_AGGREGATE_DOC_ID
  await setDoc(doc(db, 'stats', CURRENT_AGGREGATE_DOC_ID), aggregate);
  console.log(`Saved stats/${CURRENT_AGGREGATE_DOC_ID}`);

  // 2. Also write to stats/aggregates for backward-compatibility
  await setDoc(doc(db, 'stats', 'aggregates'), aggregate);
  console.log(`Saved stats/aggregates`);

  console.log('\nSUCCESS: 10 responses and synchronized aggregates populated successfully!');
  process.exit(0);
}

main().catch(err => {
  console.error('Fatal error during population:', err);
  process.exit(1);
});
