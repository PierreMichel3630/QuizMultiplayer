export const isInt = (n: number) => n % 1 === 0;

const BASEX = 0.1;
const BASEY = 2;

export const getLevel = (xp: number) => Math.floor(BASEX * Math.sqrt(xp));

export const getExperienceByLevel = (level: number) =>
  Math.pow(level / BASEX, BASEY);
