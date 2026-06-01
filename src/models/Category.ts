import { Language } from "./Language";

export interface Category {
  id: number;
  categorytranslation: Array<CategoryTranslation>;
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
  isfirst?: boolean;
}

export interface CategoryThemeUpdate {
  id: number;
  category: number;
  theme: number;
  isfirst?: boolean;
}

interface CategoryTranslation {
  id: number;
  name: string;
  language: Language;
}

export interface CategoryTheme {
  id?: number;
  isfirst: boolean;
  category: number;
}
