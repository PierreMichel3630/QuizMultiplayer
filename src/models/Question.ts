import { JsonLanguage, JsonLanguageArrayOrString } from "./Language";
import { ResponseLanguage, ResponseLanguageString } from "./Response";
import { Theme } from "./Theme";

export interface QuestionEnd {
  image?: string;
  question: JsonLanguage;
  difficulty: string;
  response: JsonLanguageArrayOrString;
}

export interface Question {
  image?: string;
  extra?: JsonLanguage;
  audio?: string;
  isqcm: boolean;
  question: JsonLanguage;
  response: JsonLanguage;
  resultPlayer1?: boolean;
  responsePlayer1?: string;
  responsePlayer2?: string;
  resultPlayer2?: boolean;
  difficulty: string;
  id: number;
  allresponse: boolean;
  responses: Array<{
    label?: ResponseLanguageString;
    image?: string;
  }>;
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

export interface QuestionInsertAdmin {
  difficulty: string;
  question: JsonLanguage;
  image: string | null;
  response: JsonLanguageArrayOrString;
  typeResponse: string;
}

export interface QuestionInsert {
  difficulty: string;
  question: JsonLanguage;
  image: string | null;
  response: JsonLanguage;
  typeResponse: string | null;
  responses?: Array<JsonLanguage>;
  isqcm: boolean | null;
  typequestion: string;
  validate: boolean;
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
  type: "DEFAULT" | "ORDER" | "IMAGE";
  time: number;
  difficulty: string;
  theme: Theme;
  isqcm: boolean;
  responses: Array<{
    label?: ResponseLanguageString;
    image?: string;
  }>;
}

export interface QuestionTraining {
  image?: string;
  audio?: string;
  extra?: JsonLanguage;
  question: JsonLanguage;
  type: "DEFAULT" | "ORDER" | "IMAGE";
  time: number;
  difficulty: string;
  theme: Theme;
  isqcm: boolean;
  responses: Array<{
    label?: ResponseLanguageString;
    image?: string;
  }>;
  response: number | ResponseLanguage;
}

export interface QuestionDuel {
  image?: string;
  audio?: string;
  extra?: JsonLanguage;
  question: JsonLanguage;
  type: "DEFAULT" | "ORDER" | "IMAGE";
  time: number;
  difficulty: string;
  theme: Theme;
  isqcm: boolean;
  responses: Array<{
    label?: ResponseLanguageString;
    image?: string;
  }>;
}
