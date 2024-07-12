import { StatusGameDuel } from "./enum";
import { Profile } from "./Profile";
import { Question } from "./Question";
import { Theme } from "./Theme";

export interface DuelGame {
  id: number;
  uuid: string;
  theme: Theme;
  player1: Profile;
  player2: Profile;
  ptsplayer1: number;
  ptsplayer2: number;
  status: StatusGameDuel;
  questions: Array<Question>;
  battlegame: null | string;
}

export interface DuelGameChange {
  id: number;
  uuid: string;
  theme: number;
  player1: string;
  player2: string;
  ptsplayer1: number;
  ptsplayer2: number;
  status: StatusGameDuel;
  questions: Array<Question>;
}

export interface ExtraDuelGame {
  delta: number;
  eloPlayer1: number;
  eloPlayer2: number;
  xpplayer1: ExtraDuelGameXP;
  xpplayer2: ExtraDuelGameXP;
}

export interface ExtraDuelGameXP {
  matchscore: number;
  victorybonus: number;
  match: number;
}
