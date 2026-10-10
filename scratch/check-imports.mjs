import fs from 'node:fs';

const files = process.argv.slice(2);
let problems = 0;

for (const file of files) {
  const src = fs.readFileSync(file, 'utf8');

  // Collect imported binding names (default, named, aliased).
  const imported = new Set();
  const importRe = /import\s+([\s\S]*?)\s+from\s+['"][^'"]+['"]/g;
  let m;
  while ((m = importRe.exec(src))) {
    const clause = m[1].trim();
    const braces = clause.match(/\{([\s\S]*?)\}/);
    if (braces) {
      for (const part of braces[1].split(',')) {
        const t = part.trim();
        if (!t) continue;
        imported.add(/\sas\s+/.test(t) ? t.split(/\sas\s+/)[1].trim() : t);
      }
    }
    const bare = clause.replace(/\{[\s\S]*?\}/, '').replace(/,/g, '').trim();
    if (bare && !bare.startsWith('*')) imported.add(bare);
  }

  // Every capitalised JSX component reference must resolve to an import.
  const declared = new Set(imported);
  for (const d of src.matchAll(/(?:const|function)\s+([A-Z][A-Za-z0-9_]*)/g)) declared.add(d[1]);
  for (const d of src.matchAll(/(?:const|let)\s*\{([^}]*)\}\s*=/g)) {
    for (const part of d[1].split(',')) {
      const t = part.split(':').pop().split('=')[0].trim();
      if (t) declared.add(t);
    }
  }

  const used = new Set();
  for (const u of src.matchAll(/<([A-Z][A-Za-z0-9_]*)[\s/>]/g)) used.add(u[1]);

  for (const name of used) {
    if (!declared.has(name)) {
      console.log(`UNDEFINED  ${file}: <${name}> is used but never imported or declared`);
      problems++;
    }
  }
  for (const name of imported) {
    const hits = (src.match(new RegExp(`\\b${name}\\b`, 'g')) || []).length;
    if (hits <= 1) {
      console.log(`UNUSED     ${file}: '${name}' imported but never used`);
      problems++;
    }
  }
}

console.log(problems === 0 ? '\nAll imports resolve; no unused imports.' : `\n${problems} problem(s).`);