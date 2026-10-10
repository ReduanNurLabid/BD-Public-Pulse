/**
 * Rank tracked issues by the number of submitted answers. The agreement split
 * is secondary context: issues with comparable participation are ordered by
 * the smaller of their agree/disagree shares, then by a stable issue ID.
 */
export function rankTrendingIssues(issues = []) {
  return [...issues].sort((a, b) => {
    const answerDifference = (b.totalAnswers || 0) - (a.totalAnswers || 0);
    if (answerDifference) return answerDifference;

    const polarization = issue => Math.min(issue.agree || 0, issue.disagree || 0);
    const splitDifference = polarization(b) - polarization(a);
    if (splitDifference) return splitDifference;

    return String(a.id || '').localeCompare(String(b.id || ''));
  });
}
