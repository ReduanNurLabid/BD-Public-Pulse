import fs from 'node:fs';

const file = 'src/data/questions.js';
const lines = fs.readFileSync(file, 'utf8').split('\n');

const NUKTA = '\u09bc';
const YA = '\u09af';

// Locate the line holding the 36-45 bucket by its leading Bengali digits (৩৬ = ৩,৬).
const idx = lines.findIndex(l => l.includes('\u09e9\u09ec-\u09ea\u09eb'));

if (idx === -1) throw new Error('36-45 bucket line not found');

const before = lines[idx];
const chars = [...before];

// Insert a nukta after the LAST bare YA that is not already followed by a nukta,
// so the key matches the form already stored in stats/aggregates.
let lastYa = -1;
for (let i = 0; i < chars.length; i++) {
  if (chars[i] === YA && chars[i + 1] !== NUKTA) lastYa = i;
}

if (lastYa === -1) throw new Error('no bare YA found to patch');

chars.splice(lastYa + 1, 0, NUKTA);
const after = chars.join('');

if (before === after) throw new Error('line unchanged');
if (after.includes(NUKTA) === false) throw new Error('nukta not inserted');

lines[idx] = after;
fs.writeFileSync(file, lines.join('\n'), 'utf8');

console.log('patched line', idx + 1);
console.log('codepoints now:');
console.log([...after].map(c => {
  const cp = c.codePointAt(0);
  return cp > 127 ? 'U+' + cp.toString(16).toUpperCase().padStart(4, '0') : JSON.stringify(c);
}).join(' '));