import { JsonLanguage } from "./Language";
import { Question } from "./Question";
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
  questions: Array<Question>;
  player: string;
  theme: Theme;
  uuid: string;
}

export interface SoloGame {
  id: number;
  points: number;
  questions: Array<Question>;
  player: string;
  theme: Theme;
  uuid: string;
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
