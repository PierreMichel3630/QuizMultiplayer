import { Language } from "src/models/Language";

export const sortByScore = (a: { score: number }, b: { score: number }) =>
  b.score - a.score;

export const sortByTime = (a: { time: number }, b: { time: number }) =>
  a.time - b.time;

export const shuffle = () => Math.random() - 0.5;

export const sortByValue = (a: { value: number }, b: { value: number }) =>
  a.value - b.value;

export const sortByGamesDesc = (a: { games: number }, b: { games: number }) =>
  b.games - a.games;

export const sortByDuelGamesDesc = (
  a: { duelgames: number },
  b: { duelgames: number }
) => b.duelgames - a.duelgames;

export const sortByName = (language: Language, a: any, b: any) =>
  a.name[language.iso].localeCompare(b.name[language.iso]);
