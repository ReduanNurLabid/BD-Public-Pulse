import { calculateComprehensiveAnalysis, MASTER_PERSONALITIES, MODEL_VERSION } from '../src/lib/scoring.js';
import { QUESTIONS } from '../src/data/questions.js';

const failures = [];
const check = (ok, message) => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${message}`);
  if (!ok) failures.push(message);
};

const answersFrom = (scoreForIndex) => QUESTIONS.map((question, index) => ({
  questionId: question.id,
  score: scoreForIndex(index)
}));

const mixed = calculateComprehensiveAnalysis(answersFrom(() => 3));
check(mixed.matchType === 'mixed', 'All-neutral answers produce a mixed result');
check(mixed.primaryBloc.percentage === null, 'Mixed result has no similarity percentage');
check(mixed.primaryBloc.relativeShare === null, 'Mixed result has no relative-share percentage');

const noClearMatch = calculateComprehensiveAnalysis(answersFrom(index => ((index * 2) % 5) + 1));
check(noClearMatch.matchType === 'no_clear_match', 'Diffuse answers produce a no-clear-match result');
check(noClearMatch.primaryBloc.percentage === null, 'No-clear-match result has no similarity percentage');
check(noClearMatch.primaryBloc.relativeShare === null, 'No-clear-match result has no relative-share percentage');

const matched = calculateComprehensiveAnalysis(answersFrom(index => index % 2 ? 1 : 5));
check(matched.matchType === 'bloc', 'Distinctive answers retain profile matching');
check(
  Math.round(matched.sortedBlocs.reduce((total, bloc) => total + bloc.relativeShare, 0)) === 100,
  'Matched profile shares normalize to 100%'
);

check(Boolean(MODEL_VERSION), 'Scoring model declares a version');
check(
  MASTER_PERSONALITIES.every(person => ['Bangladeshi', 'Regional', 'International'].includes(person.nationality)),
  'Every personality has an explicit supported origin label'
);
check(
  !MASTER_PERSONALITIES.some(person => /adolf hitler/i.test(person.nameEn)),
  'Shareable historical comparators exclude Adolf Hitler'
);

if (failures.length) {
  console.error(`\n${failures.length} scoring integrity check(s) failed.`);
  process.exitCode = 1;
} else {
  console.log('\nAll scoring integrity checks passed.');
}
