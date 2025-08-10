import { Language } from "./Language";
import { Theme } from "./Theme";

export interface Category {
  id: number;
  categorytranslation: Array<CategoryTranslation>;
}

export interface CategoryUpdate {
  id: number;
  title?: string;
  language?: string;
}

export interface CategoryInsert {}

export interface CategoryTranslationInsert {
  name: string;
  namelower: string;
  language: number;
  category: number;
}

export interface CategoryTranslationUpdate {
  id: number;
  name?: string;
  language?: number;
  namelower?: string;
}

export interface CategoryThemeInsert {
  category: number;
  theme: number;
}

export interface CategoryWithThemes {
  id: number;
  title: string;
  language: string;
  themes: Array<Theme>;
}

export interface CategoryTranslation {
  id: number;
  name: string;
  language: Language;
}
