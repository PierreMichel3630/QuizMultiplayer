import { Category } from "./Category";
import { JsonLanguage } from "./Language";
import { Difficulty } from "./enum";

export interface Theme {
  id: number;
  name: JsonLanguage;
  image: string;
  questions: number;
  color: string;
  category: Category;
  background: null | string;
  isfirst: boolean;
  enabled: boolean;
}

export interface ThemeInsert {
  name: JsonLanguage;
  image: null | string;
  color: string;
  background: null | string;
}

export interface ThemeUpdate {
  id: number;
  enabled?: boolean;
  name?: JsonLanguage;
  image?: null | string;
  color?: string;
  background?: null | string;
}

export interface ThemeDifficulty {
  theme: Theme;
  difficultymin: Difficulty;
  difficultymax: Difficulty;
}
