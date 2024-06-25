import { JsonLanguage } from "./Language";
import { Theme } from "./Theme";

export interface Category {
  id: number;
  name: JsonLanguage;
}

export interface CategoryThemeInsert {
  category: number;
  theme: number;
}

export interface CategoryWithThemes {
  id: number;
  name: JsonLanguage;
  themes: Array<Theme>;
}
