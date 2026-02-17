import { Language } from "./Language";

export interface List {
  id: number;
  listtranslation: Array<ListTranslation>;
}

export interface ListTranslation {
  id: number;
  language: Language;
  name: string;
  elements: number;
  question: string;
  list: {
    id: number;
  };
}

export interface ListAnswer {
  id: number;
  listanswertranslation: Array<ListAnswerTranslation>;
}

export interface ListAnswerTranslation {
  id: number;
  language: Language;
  name: string;
  value: number;
  unit?: string;
  type: ListType;
}

export enum ListType {
  NUMBER = "NUMBER",
  DATE = "DATE",
}

export interface ListAnswerPlay extends ListAnswer {
  hasAnswer: boolean;
}
