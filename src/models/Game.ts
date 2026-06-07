import { StatusGameSolo } from "./enum/StatusGame";
import { Profile } from "./Profile";
import { QuestionResult } from "./Question";
import { Theme } from "./Theme";

export interface TrainingGame {
  id: number;
  questions: Array<QuestionResult>;
  player: string;
  theme: Theme;
  uuid: string;
}

export interface SoloGame {
  id: number;
  profile: Profile;
  points: number;
  questions: Array<QuestionResult>;
  player: string;
  theme: Theme;
  themequestion: Theme;
  uuid: string;
  status: StatusGameSolo;
  created_at: Date;
  version: number;
}


export interface SoloGameRanking extends  SoloGame {
  ranking: number;
}

export interface SoloGameAvg {
  points: number;
}

export interface SoloGameResult extends SoloGame {
  questions: Array<QuestionResult>;
}

export interface ExtraSoloGameXP {
  matchscore?: number;
  match?: number;
  record?: number;
}

export interface HistoryGame {
  uuid: string;
  type: "SOLO" | "DUEL";
  theme: Theme;
  player1: Profile;
  player2?: Profile;
  ptsplayer1: number;
  ptsplayer2: number | null;
  created_at: Date;
}
