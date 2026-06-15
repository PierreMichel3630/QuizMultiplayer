import { CategoryTheme } from "./Category";
import { Language } from "./Language";

interface ThemeTranslation {
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

export interface ThemeTranslationWithTheme {
  id: number;
  name: string;
  namelower: string;
  language: Language;
  theme: {
    id: number;
    color: string;
    image?: string;
    enabled: boolean;
    validate: boolean;
  };
}

export interface Theme {
  id: number;
  image?: string;
  color: string;
  isfirst: boolean;
  enabled: boolean;
  validate: boolean;
  created_at: Date;
  modify_at: Date;
  themetranslation: Array<ThemeTranslation>;
  categorytheme: Array<CategoryTheme>;
  generatequestion: boolean;
  minversion?: string;
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

export interface QuestionTheme {
  id: number;
  question: number;
  theme: Theme;
}
