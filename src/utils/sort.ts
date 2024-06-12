import moment from "moment";
import { Language } from "src/models/Language";
import { Title } from "src/models/Title";

export const sortByScore = (a: { score: number }, b: { score: number }) =>
  b.score - a.score;

export const sortByTime = (a: { time: number }, b: { time: number }) =>
  a.time - b.time;

export const shuffle = () => Math.random() - 0.5;

export const sortByValue = (a: { value: number }, b: { value: number }) =>
  a.value - b.value;

export const sortByGamesDesc = (a: { games: number }, b: { games: number }) =>
  b.games - a.games;

export const sortByCreatedAt = (
  a: { created_at: Date },
  b: { created_at: Date }
) => moment(b.created_at).diff(moment(a.created_at));

export const sortByDuelGamesDesc = (
  a: { duelgames: number },
  b: { duelgames: number }
) => b.duelgames - a.duelgames;

export const sortByName = (language: Language, a: any, b: any) =>
  a.name[language.iso].localeCompare(b.name[language.iso]);

export const sortByTitle = (language: Language, a: Title, b: Title) =>
  a.name[language.iso].localeCompare(b.name[language.iso]);
