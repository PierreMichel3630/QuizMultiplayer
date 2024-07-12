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
  uuidgame: string;
  rank: number;
  xp: number;
}

export interface MyScore {
  id: number;
  profile: string;
  theme: number;
  points: number;
  games: number;
  duelgames: number;
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
