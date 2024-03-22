export const sortByScore = (a: { score: number }, b: { score: number }) =>
  b.score - a.score;

export const sortByTime = (a: { time: number }, b: { time: number }) =>
  a.time - b.time;

export const shuffle = () => Math.random() - 0.5;

export const sortByValue = (a: { value: number }, b: { value: number }) =>
  a.value - b.value;
