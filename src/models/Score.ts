import { Profile } from "./Profile";
import { Theme } from "./Theme";

export interface Score {
  id: number;
  profile: Profile;
  theme: Theme;
  points: number;
  games: number;
  totalpoints: number;
  duelgames: number;
  victory: number;
  draw: number;
  defeat: number;
  uuidgame: {
    uuid: string;
    created_at: Date;
  } | null;
  rank: number;
  xp: number;
}

export interface Opposition {
  id: number;
  player1: string;
  player2: string;
  theme: number;
  games: number;
  victory: number;
  draw: number;
  defeat: number;
}

export interface ScoreAvg {
  score: number;
  rank: number;
  games: number;
  duelgames: number;
}

export interface ScoreRanking {
  profile: Profile;
  points: number;
  games: number;
  duelgames: number;
  rank: number;
  ranking: number;
  theme?: Theme;
}
