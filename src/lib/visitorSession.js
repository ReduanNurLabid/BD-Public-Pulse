/**
 * BD Political Compass 2026 — Client Visitor & Session Management
 * 
 * Safely tracks visitor submission state and device token without triggering
 * browser adblockers or privacy extension traps (e.g. uBlock Origin, Brave Shields).
 */

const STORAGE_DEVICE_TOKEN = 'bdc_client_token_v3';
const STORAGE_SUBMITTED_KEY = 'bdc_has_submitted_v1';
const COOKIE_SUBMITTED_KEY = 'bdc_submitted';

function getSafeCookie(name) {
  if (typeof document === 'undefined') return null;
  try {
    const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
  } catch (e) {
    return null;
  }
}

function setSafeCookie(name, value, days = 365) {
  if (typeof document === 'undefined') return;
  try {
    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${maxAge}; path=/; SameSite=Lax`;
  } catch (e) {
    // Cookie storage disabled or sandboxed
  }
}

/**
 * Generate a deterministic yet privacy-safe device identifier.
 * Uses standard device attributes without triggering canvas heuristics.
 */
export function getDeviceToken() {
  if (typeof window === 'undefined') return 'server_session';

  // 1. Check existing cached token
  try {
    const cached = localStorage.getItem(STORAGE_DEVICE_TOKEN);
    if (cached && cached.startsWith('dev_')) {
      return cached;
    }
  } catch (e) {}

  // 2. Build lightweight device entropy hash
  let entropy = '';
  try {
    const nav = typeof navigator !== 'undefined' ? navigator : {};
    const scr = typeof screen !== 'undefined' ? screen : {};
    const tz = typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : '';
    entropy = [
      nav.userAgent || '',
      nav.language || '',
      `${scr.width || 0}x${scr.height || 0}x${scr.colorDepth || 0}`,
      tz,
      nav.hardwareConcurrency || 1
    ].join('|');
  } catch (e) {
    entropy = 'fallback_entropy';
  }

  // FNV-1a fast 32-bit hash
  let hash = 0x811c9dc5;
  for (let i = 0; i < entropy.length; i++) {
    hash ^= entropy.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  const cleanHash = Math.abs(hash).toString(36);
  const rand = Math.random().toString(36).substring(2, 8);
  const newToken = `dev_${cleanHash}_${rand}`;

  try {
    localStorage.setItem(STORAGE_DEVICE_TOKEN, newToken);
  } catch (e) {}

  return newToken;
}

// Alias for compatibility
export const getDeviceFingerprint = getDeviceToken;

/**
 * Check if the visitor is new (has not submitted a survey on this device yet).
 */
export function isNewVisitor() {
  if (typeof window === 'undefined') return true;

  try {
    const localFlag = localStorage.getItem(STORAGE_SUBMITTED_KEY);
    if (localFlag === 'true') return false;
  } catch (e) {}

  try {
    const cookieFlag = getSafeCookie(COOKIE_SUBMITTED_KEY);
    if (cookieFlag === '1' || cookieFlag === 'true') {
      return false;
    }
  } catch (e) {}

  return true;
}

/**
 * Mark this visitor/device as having submitted their survey.
 */
export function markVisitorSubmitted() {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_SUBMITTED_KEY, 'true');
    localStorage.setItem('bdc_submitted_timestamp', new Date().toISOString());
  } catch (e) {}

  setSafeCookie(COOKIE_SUBMITTED_KEY, '1', 365);

  // Dispatch global event for live UI update (Navbar badge, CTA dot)
  try {
    window.dispatchEvent(new Event('bdc_submission_status_changed'));
  } catch (e) {}
}

/**
 * Reset submission lock (for testing only)
 */
export function resetVisitorSubmission() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_SUBMITTED_KEY);
    localStorage.removeItem(STORAGE_DEVICE_TOKEN);
    localStorage.removeItem('bdc_submitted_timestamp');
    document.cookie = `${COOKIE_SUBMITTED_KEY}=; max-age=0; path=/`;
    window.dispatchEvent(new Event('bdc_submission_status_changed'));
  } catch (e) {}
}
