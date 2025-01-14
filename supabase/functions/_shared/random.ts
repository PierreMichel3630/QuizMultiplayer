import _ from "https://cdn.skypack.dev/lodash";

export const DIFFICULTIES = ["FACILE", "MOYEN", "DIFFICILE", "IMPOSSIBLE"];

export const getRandomDifficulties = () => getRandomElement(DIFFICULTIES);

export const getRandomElement = (values: Array<any>) => _.sample(values);

export const randomIntFromInterval = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);

export const multiplyOf = (numbers: Array<number>, x: number) =>
  numbers.filter((n) => !(x % n));
