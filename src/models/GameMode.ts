import { TypeGameMode } from "./enum/GameMode";
import { Profile } from "./Profile";

export enum OrderGameModeScore {
  SCORE = "score",
  AVERAGE = "average",
  GAMES = "games",
}

interface GameModeScoreNotConnect {
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

export interface ResultGameModeScore {
  hasrecord: boolean;
  result: GameModeScore | GameModeScoreNotConnect;
  previousScore: GameModeScore | null;
}
