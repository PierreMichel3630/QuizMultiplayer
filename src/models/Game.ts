import { StatusGameSolo } from "./enum/StatusGame";
import { JsonLanguage } from "./Language";
import { Profile } from "./Profile";
import { Question, QuestionResult } from "./Question";
import { Theme, ThemeDifficulty } from "./Theme";

export interface Game {
  id: number;
  name: JsonLanguage;
  image: string;
  channel: string;
  players: number;
  question: string | null;
  in_progress: boolean;
  next_game: Date;
}

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

export interface SoloGameResult extends SoloGame {
  questions: Array<QuestionResult>;
}

export interface AllQuestionSoloGame {
  uuid: string;
  extra: ExtraSoloGame;
}

export interface ExtraSoloGame {
  xpplayer1: ExtraSoloGameXP;
}

export interface ExtraSoloGameXP {
  matchscore: number;
  match: number;
}

export interface SoloGamePayload {
  id: number;
  points: number;
  player: string;
  theme: number;
  question: number;
}

export interface PrivateGame {
  id: number;
  theme: Array<ThemeDifficulty>;
  in_progress: boolean;
  next_game: Date;
}

export interface PrivateGameInsert {
  themes: Array<ThemeDifficulty>;
  next_game: Date;
  channel: string;
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

export interface HistorySoloGame {
  id: number;
  points: number;
  questions: Array<Question>;
  profile: Profile;
  theme: Theme;
  themequestion: Theme;
  uuid: string;
  status: StatusGameSolo;
}

export interface HistoryGameAdmin {
  uuid: string;
  type: "SOLO" | "DUEL";
  theme: Theme;
  player1: Profile | null;
  player2: Profile | null;
  ptsplayer1: number;
  ptsplayer2: number | null;
  created_at: Date;
}
