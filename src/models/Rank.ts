import { Profile } from "./Profile";
import { Theme } from "./Theme";

export interface MyRank {
  id: number;
  profile: Profile;
  theme: Theme;
  points: number;
  rank: number;
}

export interface Rank {
  id: number;
  profile: Profile;
  theme: Theme;
  points: number;
}
