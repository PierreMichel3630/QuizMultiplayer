import { JsonLanguage } from "./Language";

export interface Category {
  id: number;
  name: JsonLanguage;
}

export interface CategoryThemeInsert {
  category: number;
  theme: number;
}
