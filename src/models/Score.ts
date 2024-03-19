import { Profile } from "./Profile";
import { Theme } from "./Theme";

export interface Score {
  id: number;
  profile: Profile;
  theme: Theme;
  points: number;
  games: number;
}

export interface MyScore extends Score {
  rank: number;
}
