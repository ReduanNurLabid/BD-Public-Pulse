import { QUESTIONS } from '../src/data/questions.js';

const maxPossible = {};
const weightsX = [];
const weightsY = [];

QUESTIONS.forEach(q => {
  if (q.x_weight !== undefined) weightsX.push(Math.abs(q.x_weight));
  if (q.y_weight !== undefined) weightsY.push(Math.abs(q.y_weight));
  
  if (q.bloc_weights) {
    Object.keys(q.bloc_weights).forEach(bloc => {
      maxPossible[bloc] = (maxPossible[bloc] || 0) + Math.abs(q.bloc_weights[bloc]);
    });
  }
});

console.log("Max Possible Bloc Score Ceiling:");
console.log(maxPossible);

console.log("\nQuestion Weights Variation:");
console.log(`X Weights range: ${Math.min(...weightsX)} to ${Math.max(...weightsX)}`);
console.log(`Y Weights range: ${Math.min(...weightsY)} to ${Math.max(...weightsY)}`);

console.log("\nSome weights:");
console.log("X:", weightsX.slice(0, 10).join(", "));
console.log("Y:", weightsY.slice(0, 10).join(", "));
