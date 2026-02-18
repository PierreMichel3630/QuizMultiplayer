import { Language } from "./Language";

export enum OrderList {
  DESC = "DESC",
  ASC = "ASC",
}

export enum TypeList {
  NUMBER = "NUMBER",
  IMAGE = "IMAGE",
  DATE = "DATE",
  TEXT = "TEXT",
}

export interface List {
  id: number;
  order: null | OrderList;
  type: TypeList;
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
  image?: string;
  value: string;
  unit?: string;
  listanswertranslation: Array<ListAnswerTranslation>;
}

export interface ListAnswerTranslation {
  id: number;
  language: Language;
  name: string;
}

export interface ListAnswerPlay extends ListAnswer {
  hasAnswer: boolean;
}
