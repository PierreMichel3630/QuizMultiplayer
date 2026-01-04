import { Theme } from "./Theme";

export interface PreviousGame {
  theme: Theme;
  player1: string;
  player2: string | null;
}
