// src/moods.js
export const moods = {
  idle: { rotate: [0, 2, -2, 0] }, // wiggle
  focus: { scale: [1, 1.1, 1], y: [0, -5, 0] }, // bounce + grow
  happy: { rotate: [0, 10, -10, 0] }, // tail shake
};
