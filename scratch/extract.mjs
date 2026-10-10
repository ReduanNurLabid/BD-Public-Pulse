import fs from 'fs';
const s = fs.readFileSync('src/assets/light mode logo.svg', 'utf8');
const idx = s.indexOf('data:image/png;base64,');
if (idx !== -1) {
  const end = s.indexOf('"', idx);
  const base64Str = s.substring(idx + 'data:image/png;base64,'.length, end);
  const buf = Buffer.from(base64Str, 'base64');
  console.log('PNG size:', buf.length, 'dims:', buf.readUInt32BE(16), buf.readUInt32BE(20));
}
