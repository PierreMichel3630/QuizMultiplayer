import { Category } from "./Category";
import { Difficulty } from "./enum/DifficultyEnum";
import { JsonLanguage } from "./Language";

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
  created_at: Date;
  modify_at: Date;
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

export interface QuestionTheme {
  id: number;
  question: number;
  theme: Theme;
}

export interface QuestionThemeInsert {
  question: number;
  theme: number;
}

export interface ThemeShop {
  id: number;
  name: JsonLanguage;
}
