import { TypeGameMode } from "./enum/GameMode";
import { Profile } from "./Profile";

export enum OrderGameModeScore {
  SCORE = "score",
  AVERAGE = "average",
  GAMES = "games",
}

export interface GameMode {
  id: number;
  image: string | JSX.Element;
  color: string;
  name: string;
  order: number;
  created_at: Date;
  onClick: () => void;
}

export interface GameModeScoreNotConnect {
  type: TypeGameMode;
  score: number;
  extra?: any;
}

export interface GameModeScore {
  type: TypeGameMode;
  profile: Profile;
  score: number;
  average: number;
  games: number;
  rank: number;
  extra?: any;
}

export interface GameModeScoreInsert {
  type: TypeGameMode;
  profile: string;
  score: number;
  average: number;
  games: number;
}

export interface ResultGameModeScore {
  hasrecord: boolean;
  result: GameModeScore | GameModeScoreNotConnect;
  previousScore: GameModeScore | null;
}
