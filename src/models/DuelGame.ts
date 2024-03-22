import { Profile } from "./Profile";
import { Theme } from "./Theme";

export interface DuelGame {
  theme: Theme;
  player1: Profile;
  player2: Profile;
  ptsplayer1: number;
  ptsplayer2: number;
}
