import { Profile } from "./Profile";
import { Theme } from "./Theme";

export interface DuelGame {
  id: number;
  uuid: string;
  theme: Theme;
  player1: Profile;
  player2: Profile;
  ptsplayer1: number;
  ptsplayer2: number;
  start: boolean;
}

export interface DuelGameChange {
  id: number;
  uuid: string;
  theme: number;
  player1: string;
  player2: string;
  ptsplayer1: number;
  ptsplayer2: number;
  start: boolean;
}
