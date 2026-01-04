import { JsonLanguage, Language } from "./Language";

export interface Title {
  id: number;
  price: number;
  isaccomplishment: boolean;
  titletranslation: Array<TitleTranslation>;
  ismultiple: boolean;
}

export interface TitleTranslation {
  id: number;
  name: string;
  language: Language;
}

export interface TitleTranslationInsert {
  name: string;
  language: number;
  title: number;
}

export interface TitleTranslationUpdate {
  id: number;
  name: string;
  language: number;
  title: number;
}

export interface TitleProfile {
  id: number;
  profile: string;
  title: Title;
  multiplicator: number | null;
}

export interface TitleInsert {
  name: JsonLanguage;
  price: number;
  isaccomplishment: boolean;
}

export interface TitleUpdate {
  id: number;
  name: JsonLanguage;
  price: number;
  isaccomplishment: boolean;
}
