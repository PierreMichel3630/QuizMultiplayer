import { JsonLanguage } from "./Language";
import { Difficulty } from "./enum";

export interface Theme {
  id: number;
  name: JsonLanguage;
  image: string;
  questions: number;
  color: string;
}

export interface ThemeDifficulty {
  theme: Theme;
  difficultymin: Difficulty;
  difficultymax: Difficulty;
}
