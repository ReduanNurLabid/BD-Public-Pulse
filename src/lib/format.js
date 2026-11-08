// Shared display formatting for Bangla and English.

const BN_DIGITS = '০১২৩৪৫৬৭৮৯';

export function toBnDigits(value) {
  return String(value).replace(/[0-9]/g, (d) => BN_DIGITS[d]);
}

// Party and leader colours as text. They are chosen to be told apart, not to be
// read, so they are blended toward the theme's text colour for contrast.
export function readableColor(color) {
  return `color-mix(in srgb, ${color} 55%, var(--text-primary))`;
}

// Bangla clock time the way people say it: "রাত ১২:৪৬", "বিকেল ৪:০৫".
// Browsers render bn-BD times with a Latin "AM/PM", which reads as a mistake.
export function formatClockTime(date, lang = 'bn') {
  if (lang === 'en') {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }
  const h = date.getHours();
  const period =
    h >= 4 && h < 6 ? 'ভোর' :
    h >= 6 && h < 12 ? 'সকাল' :
    h >= 12 && h < 15 ? 'দুপুর' :
    h >= 15 && h < 18 ? 'বিকেল' :
    h >= 18 && h < 20 ? 'সন্ধ্যা' : 'রাত';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${period} ${toBnDigits(hour12)}:${toBnDigits(minutes)}`;
}
