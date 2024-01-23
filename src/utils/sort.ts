export const sortByScore = (a: { score: number }, b: { score: number }) =>
  b.score - a.score;

export const sortByTime = (a: { time: number }, b: { time: number }) =>
  a.time - b.time;
