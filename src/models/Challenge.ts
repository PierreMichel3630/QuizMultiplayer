import { StatusGameChallenge } from "./enum/StatusGame";
import { Profile } from "./Profile";

export interface Challenge {
  id: number;
  date: Date;
  questions: Array<number>;
}

export interface ChallengeGame {
  uuid: string;
  challenge: Challenge;
  profile: Profile;
  score: number;
  time: number;
  status: StatusGameChallenge;
}

export interface ChallengeRanking {
  id: number;
  ranking: number;
  challenge: Challenge;
  profile: Profile;
  score: number;
  time: number;
}
