import { JsonLanguage, JsonLanguageArrayOrString } from "./Language";
import { ResponseLanguageString } from "./Response";
import { Theme } from "./Theme";

export interface QuestionEnd {
  image?: string;
  question: JsonLanguage;
  difficulty: string;
  response: JsonLanguageArrayOrString;
}

export interface Question {
  image?: string;
  question: JsonLanguage;
  response: JsonLanguage;
  difficulty: string;
  id: number;
  allresponse: boolean;
}

export interface QuestionPosition {
  question: number;
  isRight: boolean;
  position?: number;
}

export interface QuestionAdmin {
  image?: string;
  question: JsonLanguage;
  typeResponse: string;
  difficulty: string;
  id: number;
  theme: Theme;
  isqcm?: boolean;
  allresponse: boolean;
  response: JsonLanguageArrayOrString;
}

export interface QuestionInsert {
  difficulty: string;
  question: JsonLanguage;
  image: string | null;
  response: JsonLanguageArrayOrString;
  typeResponse: string;
}

export interface QuestionThemeInsert {
  question: number;
  theme: number;
}

export interface QuestionUpdate {
  id: number;
  difficulty?: string;
  question?: JsonLanguage;
  image?: string | null;
  response?: JsonLanguageArrayOrString;
  typeResponse?: string;
}

export interface QuestionSolo {
  image?: string;
  audio?: string;
  extra?: JsonLanguage;
  question: JsonLanguage;
  time: number;
  difficulty: string;
  theme: Theme;
  isqcm: boolean;
  responses: Array<ResponseLanguageString>;
}

export interface QuestionDuel {
  audio?: string;
  image?: string;
  extra?: JsonLanguage;
  question: JsonLanguage;
  difficulty: string;
  theme: Theme;
  isqcm: boolean;
  responses: Array<ResponseLanguageString>;
  time: number;
}
