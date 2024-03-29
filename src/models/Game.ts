import { JsonLanguage } from "./Language";
import { ThemeDifficulty } from "./Theme";

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

export interface SoloGame {
  id: number;
  points: number;
  question: JsonLanguage;
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
