import { ShopType } from "./enum/ShopType";
import { JsonLanguage } from "./Language";

export interface ShopItem {
  id: number;
  type: ShopType;
  name: JsonLanguage;
  icon: string;
  src: string;
  price: number;
  isaccomplishment: boolean;
  theme: number;
}

/* THEME */
export interface ShopTheme {
  id: number;
  name: JsonLanguage;
}

export interface ShopThemeUpdate {
  id: number;
  name?: JsonLanguage;
}

export interface ShopThemeInsert {
  name: JsonLanguage;
}
