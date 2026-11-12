import { calculateComprehensiveAnalysis, MASTER_PERSONALITIES, MODEL_VERSION } from '../src/lib/scoring.js';
import { QUESTIONS, BLOC_PROFILES, getQuestionsForLength } from '../src/data/questions.js';
import { existsSync } from 'node:fs';
import { LEADER_PROFILES } from '../src/data/leaders.js';

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

// Fixtures are derived from the question data, not from question order, so
// they stay meaningful when the question set is rewritten or reordered.

// Diffuse: decided (non-neutral) answers picked greedily so that no bloc pulls
// ahead of the others.
const diffuseScores = (() => {
  const blocKeys = Object.keys(BLOC_PROFILES);
  const raw = Object.fromEntries(blocKeys.map(k => [k, 0]));
  const max = Object.fromEntries(blocKeys.map(k => [
    k, QUESTIONS.reduce((sum, q) => sum + 2 * Math.abs(q.bloc_weights?.[k] || 0), 0) || 1
  ]));
  return QUESTIONS.map((q) => {
    let best = null;
    for (const score of [1, 2, 4, 5]) {
      const m = score - 3;
      const worst = Math.max(...blocKeys.map(k => (raw[k] + m * (q.bloc_weights?.[k] || 0)) / max[k]));
      if (!best || worst < best.worst) best = { score, worst };
    }
    blocKeys.forEach(k => { raw[k] += (best.score - 3) * (q.bloc_weights?.[k] || 0); });
    return best.score;
  });
})();
const noClearMatch = calculateComprehensiveAnalysis(answersFrom(index => diffuseScores[index]));
check(noClearMatch.matchType === 'no_clear_match', 'Diffuse answers produce a no-clear-match result');
check(noClearMatch.primaryBloc.percentage === null, 'No-clear-match result has no similarity percentage');
check(noClearMatch.primaryBloc.relativeShare === null, 'No-clear-match result has no relative-share percentage');

// Distinctive: someone answering exactly like each bloc's expected pattern must
// be matched to that bloc.
const personaScore = (w) => (w >= 1.5 ? 5 : w > 0 ? 4 : w === 0 ? 3 : w > -1.5 ? 2 : 1);
const personaResults = Object.keys(BLOC_PROFILES).map((key) => [
  key,
  calculateComprehensiveAnalysis(answersFrom(index => personaScore(QUESTIONS[index].bloc_weights?.[key] || 0)))
]);
check(
  personaResults.every(([key, result]) => result.matchType === 'bloc' && result.primaryBloc.key === key),
  `Distinctive answers retain profile matching (each bloc persona matches itself: ${personaResults.map(([k, r]) => `${k}→${r.primaryBloc.key}`).join(', ')})`
);
const matched = personaResults[0][1];
check(
  Math.round(matched.sortedBlocs.reduce((total, bloc) => total + bloc.relativeShare, 0)) === 100,
  'Matched profile shares normalize to 100%'
);

// Acquiescence: agreeing with everything must not count toward public stats.
const agreeAll = calculateComprehensiveAnalysis(answersFrom(() => 5));
check(!agreeAll.quality.reliable, 'Agree-with-everything answers are excluded from public stats');

check(Boolean(MODEL_VERSION), 'Scoring model declares a version');
check(
  MASTER_PERSONALITIES.every(person => ['Bangladeshi', 'Regional', 'International'].includes(person.nationality)),
  'Every personality has an explicit supported origin label'
);
check(
  !MASTER_PERSONALITIES.some(person => /adolf hitler/i.test(person.nameEn)),
  'Shareable historical comparators exclude Adolf Hitler'
);

// A party's supporters must never be shown a figure their camp rejects.
const figuresForCamp = (bloc) => {
  const seen = new Set();
  for (let variant = 0; variant < 400; variant += 1) {
    const result = calculateComprehensiveAnalysis(QUESTIONS.map((question, index) => {
      const weight = question.bloc_weights[bloc];
      const base = weight >= 1.5 ? 5 : weight > 0 ? 4 : weight === 0 ? 3 : weight > -1.5 ? 2 : 1;
      const nudge = ((variant * (index + 3) * 7) % 5 === 0) ? (index % 2 ? 1 : -1) : 0;
      return { questionId: question.id, score: Math.max(1, Math.min(5, base + nudge)) };
    }));
    if (result.primaryBloc.key === bloc) seen.add(result.historicalPick.nameEn);
  }
  return seen;
};
const MUJIB = 'Sheikh Mujibur Rahman';
const ZIA = 'Ziaur Rahman';
const jamaatFigures = figuresForCamp('JI');
check(jamaatFigures.size > 0 && !jamaatFigures.has(MUJIB) && !jamaatFigures.has('Tajuddin Ahmad'), 'Jamaat matches never get Sheikh Mujib or Tajuddin');
const bnpFigures = figuresForCamp('BNP');
check(bnpFigures.size > 0 && !bnpFigures.has(MUJIB), 'BNP matches never get Sheikh Mujib');
const alFigures = figuresForCamp('AL');
check(alFigures.size > 0 && !alFigures.has(ZIA), 'Awami League matches never get Ziaur Rahman');
check(!alFigures.has('Sharif Osman Hadi'), 'Awami League matches never get Sharif Osman Hadi');
const julyFigures = figuresForCamp('Student');
check(julyFigures.size > 0 && !julyFigures.has('Tajuddin Ahmad'), 'July movement matches never get Tajuddin Ahmad');
check(!figuresForCamp('Student').has(MUJIB), 'July movement matches never get Sheikh Mujib');

// The camp walls, on answers that wander away from the party line.
const wallResults = (bloc) => Array.from({ length: 400 }, (_, variant) => calculateComprehensiveAnalysis(QUESTIONS.map((question, index) => {
  const weight = question.bloc_weights[bloc];
  const base = weight >= 1.5 ? 5 : weight > 0 ? 4 : weight === 0 ? 3 : weight > -1.5 ? 2 : 1;
  const nudge = ((variant * (index + 3) * 7) % 3 === 0) ? (index % 2 ? 1 : -1) : 0;
  return { questionId: question.id, score: Math.max(1, Math.min(5, base + nudge)) };
})));
const leaderIds = (result) => result.leaderMatches.map((match) => match.id);
const bnpResults = wallResults('BNP').filter((result) => result.primaryBloc.key === 'BNP');
check(bnpResults.length > 0 && bnpResults.every((result) => !leaderIds(result).includes('hasina')), 'BNP results never list Sheikh Hasina');
check(bnpResults.every((result) => !result.sortedBlocs.some((bloc) => bloc.key === 'AL') && result.secondaryBloc.key !== 'AL'), 'BNP results never list the Awami League');
const alResults = wallResults('AL').filter((result) => result.primaryBloc.key === 'AL');
check(alResults.length > 0 && alResults.every((result) => !leaderIds(result).includes('tarique')), 'Awami League results never list Tarique Rahman');
const everyResult = ['BNP', 'AL', 'JI', 'Student', 'Sushil'].flatMap(wallResults);
check(everyResult.every((result) => result.leaderMatches.length <= 3 && result.leaderMatches.reduce((sum, match) => sum + match.share, 0) === 100), 'At most three leaders are shown and they total 100');
check(everyResult.every((result) => !(leaderIds(result).includes('hasina') && leaderIds(result).includes('tarique'))), 'Tarique Rahman and Sheikh Hasina never appear together');

const rightsDefenders = LEADER_PROFILES.filter((leader) => ['nahid', 'yunus', 'tarique'].includes(leader.id)).map((leader) => calculateComprehensiveAnalysis(
  QUESTIONS.map((question) => ({ questionId: question.id, score: question.id === 'c35' ? 5 : leader.answers[question.id] ?? 3 }))
));
check(rightsDefenders.every((result) => result.primaryBloc.key !== 'AL' && !result.leaderMatches.some((match) => match.id === 'hasina')), 'Wanting the AL allowed back alone never labels someone AL');

// Every camp's supporter pattern must be recognised in every quiz length.
const personaFor = (bloc, length) => calculateComprehensiveAnalysis(
  getQuestionsForLength(length).map((question) => ({ questionId: question.id, score: personaScore(question.bloc_weights?.[bloc] || 0) })),
  { length }
);
const lengthTable = [];
for (const length of ['short', 'medium', 'long']) {
  for (const bloc of Object.keys(BLOC_PROFILES)) {
    const result = personaFor(bloc, length);
    lengthTable.push(`${length}:${bloc}→${result.primaryBloc.key}`);
    check(result.matchType === 'bloc' && result.primaryBloc.key === bloc, `${bloc} supporters are matched to their own camp in the ${length} quiz`);
  }
}
console.log('      ' + lengthTable.join('  '));

// Agreeing that the AL should be allowed back and that religion-based politics
// should be banned is common outside AL. Those two alone must not make anyone AL.
for (const bloc of ['Sushil', 'BNP']) {
  for (const length of ['short', 'medium', 'long']) {
    const result = calculateComprehensiveAnalysis(
      getQuestionsForLength(length).map((question) => ({
        questionId: question.id,
        score: question.id === 'c35' || question.id === 'c37' ? 5 : personaScore(question.bloc_weights?.[bloc] || 0)
      })),
      { length }
    );
    check(result.primaryBloc.key !== 'AL' && !result.sortedBlocs.some((b) => b.key === 'AL'), `A ${bloc} supporter who wants the AL allowed back and religion-based politics banned is not labelled AL (${length})`);
  }
}

// Wanting the AL kept out of politics rules a person out of the AL camp.
const keepBanned = calculateComprehensiveAnalysis(
  getQuestionsForLength('long').map((question) => ({ questionId: question.id, score: question.id === 'c35' ? 1 : personaScore(question.bloc_weights?.AL || 0) })),
  { length: 'long' }
);
check(keepBanned.primaryBloc.key !== 'AL', 'Wanting the AL kept out of politics is never labelled AL');

MASTER_PERSONALITIES.forEach((person) => {
  check(existsSync(new URL(`../public${person.img}`, import.meta.url)), `Portrait exists for ${person.nameEn}`);
});

if (failures.length) {
  console.error(`\n${failures.length} scoring integrity check(s) failed.`);
  process.exitCode = 1;
} else {
  console.log('\nAll scoring integrity checks passed.');
}
