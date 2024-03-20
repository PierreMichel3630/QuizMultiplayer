import { Profile } from "./Profile";
import { Theme } from "./Theme";

export interface Score {
  id: number;
  profile: Profile;
  theme: Theme;
  points: number;
  games: number;
}

export interface MyScore {
  id: number;
  profile: string;
  theme: number;
  points: number;
  games: number;
  rank: number;
}
