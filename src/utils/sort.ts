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

export const sortByGamesScore1Or2Desc = (
  a: {
    score1: undefined | { games: number };
    score2: undefined | { games: number };
  },
  b: {
    score1: undefined | { games: number };
    score2: undefined | { games: number };
  }
) => {
  const valueA =
    (a.score1 ? a.score1.games : 0) + (a.score2 ? a.score2.games : 0);
  const valueB =
    (b.score1 ? b.score1.games : 0) + (b.score2 ? b.score2.games : 0);

  return valueB - valueA;
};

export const sortByDuelGamesScore1Or2Desc = (
  a: {
    score1: undefined | { duelgames: number };
    score2: undefined | { duelgames: number };
  },
  b: {
    score1: undefined | { duelgames: number };
    score2: undefined | { duelgames: number };
  }
) => {
  const valueA =
    (a.score1 ? a.score1.duelgames : 0) + (a.score2 ? a.score2.duelgames : 0);
  const valueB =
    (b.score1 ? b.score1.duelgames : 0) + (b.score2 ? b.score2.duelgames : 0);

  return valueB - valueA;
};

export const sortByPointsGamesScore1Or2Desc = (
  a: {
    score1: undefined | { points: number };
    score2: undefined | { points: number };
  },
  b: {
    score1: undefined | { points: number };
    score2: undefined | { points: number };
  }
) => {
  const valueA = Math.max(
    a.score1 ? a.score1.points : 0,
    a.score2 ? a.score2.points : 0
  );
  const valueB = Math.max(
    b.score1 ? b.score1.points : 0,
    b.score2 ? b.score2.points : 0
  );

  return valueB - valueA;
};

export const sortByRankGamesScore1Or2Desc = (
  a: {
    score1: undefined | { rank: number };
    score2: undefined | { rank: number };
  },
  b: {
    score1: undefined | { rank: number };
    score2: undefined | { rank: number };
  }
) => {
  const valueA = Math.max(
    a.score1 ? a.score1.rank : 0,
    a.score2 ? a.score2.rank : 0
  );
  const valueB = Math.max(
    b.score1 ? b.score1.rank : 0,
    b.score2 ? b.score2.rank : 0
  );

  return valueB - valueA;
};

export const sortByPointsDesc = (
  a: { points: number },
  b: { points: number }
) => b.points - a.points;

export const sortByRankDesc = (a: { rank: number }, b: { rank: number }) =>
  b.rank - a.rank;

export const sortByRankAsc = (a: { rank: number }, b: { rank: number }) =>
  a.rank - b.rank;

export const sortByXP = (a: { xp: number }, b: { xp: number }) => {
  const valueA = a.xp;
  const valueB = b.xp;
  return valueB - valueA;
};

export const sortByPriceDesc = (a: { price: number }, b: { price: number }) => {
  const valueA = a.price;
  const valueB = b.price;
  return valueA - valueB;
};

export const sortByCreatedAt = (
  a: { created_at: Date },
  b: { created_at: Date }
) => moment(b.created_at).diff(moment(a.created_at));

export const sortByModifyAt = (
  a: { modify_at: Date },
  b: { modify_at: Date }
) => moment(b.modify_at).diff(moment(a.modify_at));

export const sortByDuelGamesDesc = (
  a: { duelgames: number },
  b: { duelgames: number }
) => b.duelgames - a.duelgames;

export const sortByName = (language: Language, a: any, b: any) =>
  a.name[language.iso].localeCompare(b.name[language.iso]);

export const sortByTitle = (language: Language, a: Title, b: Title) =>
  a.name[language.iso].localeCompare(b.name[language.iso]);

export const sortByUnlock = (
  a: { unlock: boolean; price: number },
  b: { unlock: boolean; price: number }
) => Number(b.unlock) - Number(a.unlock) || a.price - b.price;

export const sortByGamesDesc = (a: { games: number }, b: { games: number }) =>
  b.games - a.games;

export const sortByUsValue = (a: { usvalue: string }, b: { usvalue: string }) =>
  a.usvalue.localeCompare(b.usvalue);

export const sortByUsername = (
  a: { username: string },
  b: { username: string }
) => a.username.localeCompare(b.username);

export const sortByVoteDesc = (a: { vote: number }, b: { vote: number }) =>
  b.vote - a.vote;
