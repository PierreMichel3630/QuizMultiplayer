import { Profile } from "./Profile";
import { Theme } from "./Theme";

export interface BattleGame {
  id: number;
  uuid: string;
  player1: Profile;
  player2: Profile | null;
  scoreplayer1: number;
  scoreplayer2: number;
  themesplayer1: Array<number>;
  themesplayer2: Array<number>;
  readyplayer1: boolean;
  readyplayer2: boolean;
  game: string;
  games: Array<{ theme: Theme; pointsPlayer1: number; pointsPlayer2: number }>;
}

export interface BattleGameChange {
  id: number;
  uuid: string;
  scoreplayer1: number;
  scoreplayer2: number;
  themesplayer1: Array<number>;
  themesplayer2: Array<number>;
  readyplayer1: boolean;
  readyplayer2: boolean;
  game: string;
  games: Array<{ theme: Theme; pointsPlayer1: number; pointsPlayer2: number }>;
}

export interface BattleGameInsert {
  player1: string;
}

export interface BattleGameUpdate {
  uuid: string;
  player2?: string;
  themesplayer1?: Array<number>;
  themesplayer2?: Array<number>;
  readyplayer1?: boolean;
  readyplayer2?: boolean;
  scoreplayer1?: number;
  scoreplayer2?: number;
  game?: string;
  games?: Array<{ theme: Theme; pointsPlayer1: number; pointsPlayer2: number }>;
}
