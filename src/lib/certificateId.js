export function formatCertificateId(sessionId, year = '2026') {
  const token = String(sessionId || '')
    .replace(/^(?:bdc_|device_|user_)/i, '')
    .replace(/[^a-z0-9]/gi, '')
    .slice(0, 8)
    .toUpperCase();

  return `BDC-${year}-${token || 'PARTICIPANT'}`;
}
