import { Theme } from "./Theme";

export interface Category {
  id: number;
  title: string;
  language: string;
}

export interface CategoryUpdate {
  id: number;
  title?: string;
  language?: string;
}

export interface CategoryInsert {
  title: string;
  language: string;
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
