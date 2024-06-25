export const weightedRandom = (cumuls: Array<number>) => {
  const cumulsCumul = cumuls.reduce((acc, v) => acc + v, 0);
  const weights = cumuls.map(
    (el) =>
      (cumulsCumul + 1 - el) /
      (cumuls.length + (cumuls.length - 1) * cumulsCumul)
  );
  const random = Math.random();

  return cumuls.findIndex((el, i) => {
    const sum = [...cumuls].slice(0, i + 1).reduce((acc, el, i) => {
      return acc + weights[i];
    }, 0);

    if (random < sum) {
      return true;
    }

    return false;
  });
};
