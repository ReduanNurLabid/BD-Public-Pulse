/**
 * Static guards for the live-stats architecture.
 *
 * Billing contract this protects:
 *   - WelcomePage must cost exactly ONE document read per visitor. No onSnapshot
 *     (every write would bill every listener) and no polling interval (reads
 *     would scale with session length x traffic). Visitors read the landing
 *     page and proceed to the test, so live updates there are never seen.
 *   - Dashboard MAY use onSnapshot, being a low-traffic deep-dive page.
 *   - Both must project through buildDashboardStats so numbers cannot diverge.
 *
 * Run: npm run verify:live-stats
 */
import { readFileSync } from 'node:fs';

const read = p => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');

// Comments legitimately name onSnapshot to explain why a page avoids it, so
// strip them before searching for real usage.
const stripComments = src => src
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/(^|[^:])\/\/.*$/gm, '$1');

const welcomeCode = stripComments(read('src/components/WelcomePage.jsx'));
const dashboardCode = stripComments(read('src/components/Dashboard.jsx'));
const libCode = stripComments(read('src/lib/firebase.js'));
const hookCode = stripComments(read('src/hooks/useAggregateStats.js'));

const failures = [];
const check = (ok, message) => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${message}`);
  if (!ok) failures.push(message);
};

check(
  /useAggregateStats\('once'\)/.test(welcomeCode),
  "WelcomePage fetches in 'once' mode"
);
check(
  !/subscribeAggregateDashboardData/.test(welcomeCode),
  'WelcomePage does not attach an onSnapshot listener'
);
check(
  !/\bonSnapshot\b/.test(welcomeCode),
  'WelcomePage source contains no onSnapshot usage'
);
check(
  !/fetchAggregateDashboardData/.test(welcomeCode),
  'WelcomePage reads only through the hook, not directly'
);

check(
  /useAggregateStats\('subscribe'\)/.test(dashboardCode),
  "Dashboard fetches in 'subscribe' mode"
);
check(
  !/fetchAggregateDashboardData/.test(dashboardCode),
  'Dashboard does not run its own one-shot fetch alongside the listener'
);
check(
  !/\bonSnapshot\b/.test(dashboardCode),
  'Dashboard reaches Firestore only through the hook, never importing onSnapshot directly'
);

// No interval or timer may survive anywhere in the hook.
check(
  !/setInterval/.test(hookCode),
  'Hook creates no polling interval'
);
check(
  !/setTimeout/.test(hookCode),
  'Hook schedules no deferred re-fetch'
);

// Refreshing is allowed, but only on a real tab-return, and it must be undone.
check(
  /addEventListener\('visibilitychange'/.test(hookCode),
  "'once' mode refetches when a hidden tab becomes visible again"
);
check(
  /removeEventListener\('visibilitychange'/.test(hookCode),
  "'once' mode removes its visibilitychange listener on cleanup"
);
check(
  /visibilityState !== 'visible'/.test(hookCode),
  "Refetch is gated on the document actually being visible"
);

// 'once' must issue one read on mount, plus one per genuine tab return.
const onceBranch = hookCode.split(/mode === 'subscribe'/)[1] || '';
const onceMountFetches = (onceBranch.match(/fetchAggregateDashboardData\(\)/g) || []).length;
check(
  onceMountFetches === 2,
  `'once' mode has exactly two fetch call sites: mount + tab-return (found ${onceMountFetches})`
);
check(
  !/fetchAggregateDashboardData\(\)/.test(hookCode.replace(onceBranch, '')),
  'No fetch call site exists outside the once branch'
);
check(
  /return \(\) => unsubscribe\(\)/.test(hookCode),
  'Subscribe mode unsubscribes on cleanup'
);
check(
  !/visibilitychange/.test(hookCode.split(/mode === 'subscribe'/)[0] || ''),
  'Subscribe mode does not add a redundant visibility refetch'
);

check(
  /export function buildDashboardStats/.test(libCode),
  'buildDashboardStats exists as the shared projection'
);

// Both transports must funnel through the one projection.
const projectionCalls = libCode.match(/buildDashboardStats\(snap\.exists\(\) \? snap\.data\(\) : null\)/g) || [];
check(
  projectionCalls.length === 2,
  `Both the listener and the one-shot fetch project through buildDashboardStats (found ${projectionCalls.length})`
);

check(
  /onSnapshot/.test(libCode),
  'onSnapshot stays encapsulated inside lib/firebase.js'
);

// The axes and wedge issues used to be fed invented numbers in the Dashboard.
// Nothing may reintroduce hardcoded stance percentages or issue splits.
const dashboardSrc = read('src/components/Dashboard.jsx');
const banned = [
  [/computeFilteredThematicAxes/, 'computeFilteredThematicAxes mock is gone'],
  [/computeFilteredIssues/, 'computeFilteredIssues mock is gone'],
  [/let a1 = 68/, 'Hardcoded wedge seed values are gone'],
  [/modAuth\s*[+-]=/, 'Invented axis shift modifiers are gone'],
  [/modSecular\s*[+-]=/, 'Invented religion_society axis modifiers are gone']
];
for (const [pattern, message] of banned) {
  check(!pattern.test(dashboardSrc), message);
}

check(
  /const currentThematicAxes = analyticsStats\?\.thematicAxes/.test(dashboardCode),
  'Axes read the selected cohort aggregate'
);
check(
  /const currentIssues = analyticsStats\?\.wedgeIssues/.test(dashboardCode),
  'Wedge issues read the selected cohort aggregate'
);
check(
  /buildFilteredDashboardStats\(stats/.test(dashboardCode),
  'Dashboard projects real demographic cohort data'
);
const noticeUses = (read('src/components/NationalOnlyChart.jsx').match(/NationalOnlyHeaderNotice/g) || []).length;
check(noticeUses >= 1, 'National-only notice component exists');
check(
  !/NationalOnlyHeaderNotice/.test(dashboardCode),
  'Political analytics no longer claim national-only results while cohort filters are active'
);
check(
  dashboardSrc.indexOf('Explore results by demographic group') <
    dashboardSrc.indexOf('{/* Bloc + Age distribution.'),
  'Cohort filters appear before the analytics they control'
);

// Freshness is surfaced on the visitor card, not as a header badge.
check(
  !/<LastUpdatedBadge/.test(dashboardCode),
  'Dashboard header no longer shows the Last updated badge'
);
check(
  /<LastSubmissionTime lastUpdated=\{stats\?\.lastUpdated\}/.test(dashboardCode),
  'Visitor card shows the last successful submission time'
);
const submissionTimeSrc = read('src/components/LastSubmissionTime.jsx');
check(
  /hour12: true/.test(submissionTimeSrc),
  'Submission time renders in 12-hour form (e.g. 4:25 AM)'
);

console.log('');
if (failures.length) {
  console.error(`${failures.length} check(s) failed.`);
  process.exit(1);
}
console.log('All live-stats architecture checks passed.');