import { BattleGame } from "./BattleGame";
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
  start: boolean;
  questions: Array<Question>;
  battlegame: null | BattleGame;
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
  questions: Array<Question>;
}
