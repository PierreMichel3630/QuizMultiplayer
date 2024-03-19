import { Moment } from "moment";
import { JsonLanguage, JsonLanguageArrayOrString } from "./Language";
import { Theme } from "./Theme";
import { ResponseLanguageString } from "./Response";

export interface QuestionEnd {
  image?: string;
  question: JsonLanguage;
  difficulty: string;
  response: JsonLanguageArrayOrString;
}

export interface Question {
  image?: string;
  question: JsonLanguage;
  difficulty: string;
  order: number;
  time: Date;
  date: Moment;
}

export interface QuestionPosition {
  question: number;
  isRight: boolean;
  position?: number;
}

export interface QuestionAdmin {
  image?: string;
  question: JsonLanguage;
  difficulty: string;
  id: number;
}

export interface QuestionSolo {
  image?: string;
  question: JsonLanguage;
  difficulty: string;
  theme: Theme;
  isqcm: boolean;
  responses: Array<ResponseLanguageString>;
}
