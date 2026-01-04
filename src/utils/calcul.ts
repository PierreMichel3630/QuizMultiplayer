export const isInt = (n: number) => n % 1 === 0;

const BASEX = 0.1;
const BASEY = 2;

export const getLevel = (xp: number) => Math.floor(BASEX * Math.sqrt(xp));

export const getExperienceByLevel = (level: number) =>
  Math.pow(level / BASEX, BASEY);

export const calculelo = (eloPlayer1: number, eloPlayer2: number) => {
  const kFactor = 20;

  function expectedScore(eloA: number, eloB: number): number {
    return 1 / (1 + Math.pow(10, (eloB - eloA) / 400));
  }

  const expected1 = expectedScore(eloPlayer1, eloPlayer2);
  const expected2 = expectedScore(eloPlayer2, eloPlayer2);

  const deltaPlayer1 = {
    win: Math.round(kFactor * (1 - expected1)),
    draw: Math.round(kFactor * (0.5 - expected1)),
    lose: Math.round(kFactor * (0 - expected1)),
  };

  const deltaPlayer2 = {
    win: Math.round(kFactor * (1 - expected2)),
    draw: Math.round(kFactor * (0.5 - expected2)),
    lose: Math.round(kFactor * (0 - expected2)),
  };

  return {
    eloPlayer1: eloPlayer1,
    eloPlayer2: eloPlayer2,
    deltaPlayer1,
    deltaPlayer2,
  };
};
