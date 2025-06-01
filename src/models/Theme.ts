import { Category } from "./Category";
import { Difficulty } from "./enum/DifficultyEnum";
import { JsonLanguage } from "./Language";

export interface ProposeTheme {
  id: number;
  title: string;
  language: string;
  image?: string;
  color: string;
  enabled: boolean;
  created_at: Date;
  modify_at: Date;
}

export interface Theme {
  id: number;
  title: string;
  language: string;
  image?: string;
  questions: number;
  color: string;
  category: Category;
  isfirst: boolean;
  enabled: boolean;
  validate: boolean;
  created_at: Date;
  modify_at: Date;
}

export interface ThemeInsertAdmin {
  title: string;
  language: string;
  image: null | string;
  color: string;
}

export interface ThemeInsert {
  title: string;
  language: string;
  color: string;
}

export interface ThemeUpdate {
  id: number;
  enabled?: boolean;
  validate?: boolean;
  title?: string;
  language?: string;
  image?: null | string;
  color?: string;
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
