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
  difficulty: string;
  id: number;
  isqcm?: boolean;
  allresponse: boolean;
  response: JsonLanguageArrayOrString;
}

export interface QuestionUpdate {
  id: number;
  difficulty?: string;
}

export interface QuestionSolo {
  image?: string;
  question: JsonLanguage;
  difficulty: string;
  theme: Theme;
  isqcm: boolean;
  responses: Array<ResponseLanguageString>;
}

export interface QuestionDuel {
  image?: string;
  question: JsonLanguage;
  difficulty: string;
  theme: Theme;
  isqcm: boolean;
  responses: Array<ResponseLanguageString>;
}
