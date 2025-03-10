import { StatusGameChallenge } from "./enum/StatusGame";
import { Profile } from "./Profile";
import { QuestionResult } from "./Question";

export interface Challenge {
  id: number;
  date: Date;
  questions: Array<number>;
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
}

export interface ChallengeRanking {
  id: number;
  uuid: string;
  ranking: number;
  challenge: Challenge;
  profile: Profile;
  score: number;
  time: number;
}
