/**
 * Generates src/components/PoleIcon.jsx from the s pole symbols in
 * public/icons.svg.
 *
 * The sprite uses <symbol>, which can only be referenced from inside the same
 * document. Chrome and Safari refuse external <use href="icons.svg#id">, so the
 * artwork is inlined here instead and rendered directly. Path data is copied
 * rather than hand-written so it can never drift from the source sprite.
 *
 * Run: node scratch/build_pole_icon_component.mjs
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SPRITE = path.join(ROOT, 'public', 'icons.svg');
const OUT = path.join(ROOT, 'src', 'components', 'PoleIcon.jsx');

// One symbol per THEMATIC_BLOCK. Each is that axis's constructive pole, chosen
// so the glyph reads as an invitation to discuss the topic rather than as a
// warning about one end of it.
const ICONS = {
  'state_power': 'pole-balance',
  'democracy': 'pole-neutral-system',
  'religion_society': 'pole-secularism',
  'economy_market': 'pole-free-market',
  'sovereignty': 'pole-sovereignty',
  'civil_liberties': 'pole-liberty',
  'state_reform': 'pole-transformation',
  'social_justice': 'pole-equality'
};

const sprite = fs.readFileSync(SPRITE, 'utf8');

const symbols = {};
const symbolRe = /<symbol id="([^"]+)"\s+viewBox="([^"]+)"\s*>([\s\S]*?)<\/symbol>/g;
let match;
while ((match = symbolRe.exec(sprite)) !== null) {
  symbols[match[1]] = { viewBox: match[2], body: match[3].trim() };
}

const missing = Object.values(ICONS).filter((id) => !symbols[id]);
if (missing.length > 0) {
  console.error(`Missing symbol(s) in icons.svg: ${missing.join(', ')}`);
  process.exit(1);
}

const entries = Object.entries(ICONS).map(([blockKey, symbolId]) => {
  const { viewBox, body } = symbols[symbolId];
  return `  '${blockKey}': {\n    symbol: '${symbolId}',\n    viewBox: '${viewBox}',\n    body: '${body.replace(/\s+/g, ' ')}'\n  }`;
}).join(',\n\n');

const component = `/**
 * GENERATED FILE — do not edit by hand.
 * Regenerate with: node scratch/build_pole_icon_component.mjs
 *
 * Inline renderings of the s thematic pole glyphs from public/icons.svg,
 * keyed by THEMATIC_BLOCK key. The sprite's <symbol> elements cannot be
 * referenced cross-document in Chrome or Safari, so the path data lives here
 * and each glyph is drawn inline.
 *
 * Every path paints with currentColor, so an icon inherits the colour of
 * whatever it sits in.
 */
import React from 'react';

const ICONS = {
${entries}
};

export default function PoleIcon({ name, size = 18, className, style }) {
  const icon = ICONS[name];
  if (!icon) return null;

  return (
    <svg
      className={className}
      style={style}
      width={size}
      height={size}
      viewBox={icon.viewBox}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      dangerouslySetInnerHTML={{ __html: icon.body }}
    />
  );
}
`;

fs.writeFileSync(OUT, component, 'utf8');
console.log(`Wrote ${path.relative(ROOT, OUT)} with ${Object.keys(ICONS).length} icons:`);
for (const [k, v] of Object.entries(ICONS)) console.log(`  ${k} -> ${v}`);