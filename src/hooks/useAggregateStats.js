import { useCallback, useEffect, useRef, useState } from 'react';
import {
  fetchAggregateDashboardData,
  subscribeAggregateDashboardData,
  buildDashboardStats
} from '../lib/firebase';

/**
 * Shared aggregate-statistics state for the Welcome Page and Analytics Dashboard.
 *
 * mode:
 *   'once'      exactly one getDoc on mount. No listener, no interval, so a
 *               visitor costs one document read for the initial paint. Refetch
 *               happens only when a hidden tab is returned to, never on a
 *               timer. This is what the landing page uses: visitors read it
 *               and move on to the test, so live refresh buys nothing and
 *               scales linearly with traffic.
 *   'subscribe' onSnapshot listener. Every server write pushes a document read
 *               to every connected client, so this is reserved for the
 *               low-traffic Analytics Dashboard.
 *
 * Both modes project through the same buildDashboardStats math, so the numbers
 * can never diverge between the two pages.
 */
export function useAggregateStats(mode = 'once') {
  const [stats, setStats] = useState(() => buildDashboardStats(null));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const applyStats = useCallback(next => {
    if (!isMountedRef.current) return;
    setStats(next);
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (mode === 'subscribe') {
      const unsubscribe = subscribeAggregateDashboardData(
        applyStats,
        () => {
          if (!isMountedRef.current) return;
          setError('realtime-unavailable');
          setLoading(false);
        }
      );
      return () => unsubscribe();
    }

    // 'once': one read on mount, then a read only on genuine tab-return. No
    // interval is created, so there is no timer to leak and no repeated billing.
    let cancelled = false;

    fetchAggregateDashboardData()
      .then(next => {
        if (!cancelled && isMountedRef.current) applyStats(next);
      })
      .catch(() => {
        if (!cancelled && isMountedRef.current) {
          setError('fetch-failed');
          setLoading(false);
        }
      });

    // Refetch only when a hidden tab is actually returned to, so a visitor who
    // leaves and comes back sees current numbers. Costs a read per real return,
    // not per interval.
    const onVisibilityChange = () => {
      if (document.visibilityState !== 'visible') return;
      fetchAggregateDashboardData()
        .then(next => {
          if (!cancelled && isMountedRef.current) applyStats(next);
        })
        .catch(() => {});
    };

    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [mode, applyStats]);

  return { stats, loading, error };
}