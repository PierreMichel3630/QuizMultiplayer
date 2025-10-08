import { Language } from "./Language";
import { ExtraResponse } from "./Response";

export interface Answer {
  extra: ExtraResponse | undefined;
  id: number;
  image?: string;
  answerset: number;
  answertranslation: Array<AnswerTranslation>;
}

export interface AnswerInsert {
  answerset: number;
}

export interface AnswerTranslation {
  id: number;
  label: string;
  otherlabel: Array<string>;
  language: Language;
  answer: Answer;
}

export interface AnswerTranslationInsert {
  label: string;
  otherlabel: Array<string>;
  language: number;
  answer: number;
}

export interface AnswerTranslationUpdate {
  id: number;
  label: string;
  otherlabel: Array<string>;
  language: number;
  answer: number;
}

export interface AnswerSet {
  id: number;
  name: string | null;
}

export interface AnswerSetInsert {
  name: string | null;
}
