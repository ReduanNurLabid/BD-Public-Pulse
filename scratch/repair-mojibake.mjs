/**
 * Repairs UTF-8 text that was decoded as Windows-1252 and re-encoded as UTF-8
 * (the classic "à¦¬à¦¾" mojibake).
 *
 * Strategy: walk the string, and wherever there is a run of characters in the
 * Latin-1 range, map each back to the single CP1252 byte it came from. Those
 * bytes are the original UTF-8, so decode the longest prefix that forms valid
 * UTF-8. Anything that does not decode is a genuine Latin-1 character that was
 * never mojibake (e.g. a literal "·"), so it is passed through untouched.
 */
import fs from 'node:fs';

// Bytes 0x80-0x9F that Windows-1252 maps to non-Latin-1 code points.
const CP1252_HIGH = {
  0x80: 0x20ac, 0x82: 0x201a, 0x83: 0x0192, 0x84: 0x201e, 0x85: 0x2026,
  0x86: 0x2020, 0x87: 0x2021, 0x88: 0x02c6, 0x89: 0x2030, 0x8a: 0x0160,
  0x8b: 0x2039, 0x8c: 0x0152, 0x8e: 0x017d, 0x91: 0x2018, 0x92: 0x2019,
  0x93: 0x201c, 0x94: 0x201d, 0x95: 0x2022, 0x96: 0x2013, 0x97: 0x2014,
  0x98: 0x02dc, 0x99: 0x2122, 0x9a: 0x0161, 0x9b: 0x203a, 0x9c: 0x0153,
  0x9e: 0x017e, 0x9f: 0x0178
};

// Inverse: code point -> the byte that produced it.
const INV = new Map();
for (let b = 0; b < 256; b++) {
  const cp = b >= 0x80 && b <= 0x9f ? (CP1252_HIGH[b] ?? b) : b;
  if (!INV.has(cp)) INV.set(cp, b);
}

// Every code point that can have come out of a CP1252 decode: the Latin-1
// range, plus CP1252's high-range mappings. The latter matter — a corrupted
// "ক" (E0 A6 97) decodes to "à¦—", and — is U+2014, above U+00FF. Treating it
// as a genuine character and passing it through leaves the run unrepaired.
const mappable = cp => cp >= 0x80 && cp <= 0xff || INV.has(cp);

const strict = new TextDecoder('utf-8', { fatal: true });

export function repair(src) {
  let out = '';
  let i = 0;

  while (i < src.length) {
    const ch = src[i];
    const code = src.charCodeAt(i);

    // ASCII, or a code point that no CP1252 byte can produce.
    if (code <= 0x7f || !mappable(code)) {
      out += ch;
      i++;
      continue;
    }

    // Collect the maximal run of mappable characters as bytes.
    const bytes = [];
    while (i + bytes.length < src.length) {
      const c = src.charCodeAt(i + bytes.length);
      if (!mappable(c)) break;
      bytes.push(INV.get(c));
    }

    // Longest prefix that is valid UTF-8. UTF-8 is self-synchronising, so a
    // valid prefix always ends on a character boundary.
    let consumed = 0;
    let decoded = null;
    for (let len = bytes.length; len >= 1; len--) {
      try {
        const text = strict.decode(new Uint8Array(bytes.slice(0, len)));
        consumed = len;
        decoded = text;
        break;
      } catch {
        /* try a shorter prefix */
      }
    }

    if (decoded === null) {
      // Not UTF-8 at all — a genuine character that happens to be mappable,
      // e.g. a literal "·" or "—" typed directly into the source.
      out += ch;
      i++;
    } else {
      out += decoded;
      i += consumed;
    }
  }

  return out;
}

const file = process.argv[2];
const raw = fs.readFileSync(file);
const hadBom = raw[0] === 0xef && raw[1] === 0xbb && raw[2] === 0xbf;
const src = raw.toString('utf8').replace(/^\uFEFF/, '');

const before = (src.match(/[\u0980-\u09FF]/g) || []).length;
const fixed = repair(src);
const after = (fixed.match(/[\u0980-\u09FF]/g) || []).length;
const leftover = (fixed.match(/à¦/g) || []).length;
const replacement = (fixed.match(/\uFFFD/g) || []).length;

console.log(`${file}`);
console.log(`  BOM present        : ${hadBom}`);
console.log(`  Bengali before     : ${before}`);
console.log(`  Bengali after      : ${after}`);
console.log(`  mojibake remaining : ${leftover}`);
console.log(`  U+FFFD (data loss) : ${replacement}`);

if (process.argv[3] === '--write') {
  // Write UTF-8 with no BOM; the build toolchain does not want one.
  fs.writeFileSync(file, fixed, 'utf8');
  console.log('  written            : yes (UTF-8, no BOM)');
} else {
  console.log('  dry run            : pass --write to apply');
}