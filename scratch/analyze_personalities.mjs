import { MASTER_PERSONALITIES } from '../src/lib/scoring.js';

function calculateShadowing() {
  const localCounts = {};
  const intlCounts = {};
  
  MASTER_PERSONALITIES.forEach(p => {
    if (p.nationality === 'International') intlCounts[p.nameEn] = 0;
    else localCounts[p.nameEn] = 0;
  });

  // Simulate a 200x200 grid from -100 to 100
  for (let x = -100; x <= 100; x++) {
    for (let y = -100; y <= 100; y++) {
      let closestLocal = null;
      let minLocalDist = Infinity;
      
      let closestIntl = null;
      let minIntlDist = Infinity;

      MASTER_PERSONALITIES.forEach(p => {
        const dist = Math.sqrt(Math.pow(x - p.x, 2) + Math.pow(y - p.y, 2));
        if (p.nationality === 'International') {
          if (dist < minIntlDist) {
            minIntlDist = dist;
            closestIntl = p.nameEn;
          }
        } else {
          if (dist < minLocalDist) {
            minLocalDist = dist;
            closestLocal = p.nameEn;
          }
        }
      });

      localCounts[closestLocal]++;
      intlCounts[closestIntl]++;
    }
  }

  const totalPoints = 201 * 201;

  console.log("=== LOCAL/REGIONAL PERSONALITIES ===");
  Object.entries(localCounts).sort((a, b) => b[1] - a[1]).forEach(([name, count]) => {
    const percentage = ((count / totalPoints) * 100).toFixed(2);
    console.log(`${name}: ${percentage}% coverage`);
  });

  console.log("\n=== INTERNATIONAL PERSONALITIES ===");
  Object.entries(intlCounts).sort((a, b) => b[1] - a[1]).forEach(([name, count]) => {
    const percentage = ((count / totalPoints) * 100).toFixed(2);
    console.log(`${name}: ${percentage}% coverage`);
  });
}

calculateShadowing();
