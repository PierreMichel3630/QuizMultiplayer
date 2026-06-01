import { StatusGameChallenge } from "./enum/StatusGame";
import { Profile } from "./Profile";
import { QuestionResult, QuestionSolo } from "./Question";

export interface Challenge {
  id: number;
  date: Date;
  questionsv2: Array<QuestionSolo>;
}

export interface ChallengeGame {
  id: number;
  uuid: string;
  challenge: Challenge;
  profile: Profile;
  score: number;
  time: number;
  status: StatusGameChallenge;
  questions: Array<QuestionResult>;
  version: number;
}

export interface ChallengeGameInsert {
  profile: string;
  score: number;
  time: number;
  questions: Array<QuestionResult>;
  challenge: number;
}

export interface ChallengeGameUpdate {
  id: number;
  score: number;
  time: number;
  questions: Array<QuestionResult>;
}

export interface ChallengeRankingDate {
  profile: Profile;
  score: number;
  scoreavg: number;
  time: number;
  games: number;
  ranking: number;
}

export interface ChallengeRankingAllTime extends ChallengeRankingDate {}

export interface ChallengeRankingMonth extends ChallengeRankingDate {
  month: string;
}

export interface ChallengeRankingWeek extends ChallengeRankingDate {
  week: string;
}

export interface ChallengeRankingDay extends ChallengeRankingDate {
  date: Date;
  questions: Array<QuestionResult>;
  version: number;
}

export interface ExtraChallenge {
  gold?: ValueExtraChallenge;
  xp?: ValueExtraChallenge;
}

interface ValueExtraChallenge {
  value: number;
  previousValue: number;
  newValue: number;
}

export interface ChallengeAvg {
  score: number;
  time: number;
  games: number;
}
