import { ShopType } from "./enum/ShopType";
import { JsonLanguage, Language } from "./Language";
import { Translation } from "./Translation";

export interface ShopItem {
  id: number;
  type: ShopType;
  icon: string;
  src: string;
  price: number;
  isaccomplishment: boolean;
  theme: number;
  themeshoptranslation: Array<ThemeShopTranslation>;
  translation: Array<Translation>;
}

/* THEME */
export interface ThemeShop {
  id: number;
  themeshoptranslation: Array<ThemeShopTranslation>;
}

export interface ThemeShopUpdate {
  id: number;
  name?: JsonLanguage;
}

export interface ThemeShopInsert {
  name: JsonLanguage;
}

export interface ThemeShopTranslation {
  id: number;
  name: string;
  language: Language;
}

export interface ThemeShopTranslationInsert {
  name: string;
  language: number;
  themeshop: number;
}

export interface ThemeShopTranslationUpdate {
  id: number;
  name: string;
  language: number;
  themeshop: number;
}
