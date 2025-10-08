import { CategoryTheme } from "./Category";
import { Difficulty } from "./enum/DifficultyEnum";
import { JsonLanguage, Language } from "./Language";

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

export interface ThemeTranslation {
  id: number;
  name: string;
  namelower: string;
  language: Language;
}

export interface ThemeTranslationInsert {
  name: string;
  namelower: string;
  language: number;
  theme: number;
}

export interface ThemeTranslationUpdate {
  id: number;
  name: string;
  namelower: string;
  language: number;
  theme: number;
}

export interface Theme {
  id: number;
  title: string;
  name: string;
  language: string;
  image?: string;
  questions: number;
  color: string;
  isfirst: boolean;
  enabled: boolean;
  validate: boolean;
  created_at: Date;
  modify_at: Date;
  themetranslation: Array<ThemeTranslation>;
  categorytheme: Array<CategoryTheme>;
  generatequestion: boolean;
}

export interface ThemeInsertAdmin {
  title: string;
  language: string;
  image: null | string;
  color: string;
  enabled: boolean;
  validate: boolean;
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
