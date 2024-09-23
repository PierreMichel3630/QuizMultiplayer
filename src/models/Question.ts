import {
  JsonLanguage,
  JsonLanguageArray,
  JsonLanguageArrayOrString,
} from "./Language";
import { ResponseLanguage, ResponseLanguageString } from "./Response";
import { Theme } from "./Theme";

export interface QuestionEnd {
  image?: string;
  question: JsonLanguage;
  difficulty: string;
  response: JsonLanguageArrayOrString;
}

export interface Question {
  typequestion: "DEFAULT" | "ORDER" | "IMAGE" | "MAPPOSITION";
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
  theme: Theme;
  difficulty: string;
  id: number;
  allresponse: boolean;
  responses: Array<{
    label?: ResponseLanguageString;
    image?: string;
  }>;
  data: null | {
    code: string;
    map: string;
  };
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
  typequestion: string;
  difficulty: string;
  id: number;
  theme?: Theme;
  isqcm: boolean | null;
  exact: boolean;
  allresponse: boolean;
  validate: boolean;
  response: JsonLanguageArray;
  responses: Array<JsonLanguage>;
}

export interface QuestionInsertAdmin {
  difficulty: string;
  question: JsonLanguage;
  image: string | null;
  response: JsonLanguageArray;
  responses?: Array<JsonLanguage>;
  typeResponse: string | null;
  isqcm: boolean | null;
  typequestion: string;
  validate: boolean;
  allresponse: boolean;
  exact: boolean;
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
  allresponse: boolean;
  exact: boolean;
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
  typeResponse?: string | null;
  typequestion?: string;
  validate?: boolean;
  allresponse?: boolean;
  exact?: boolean;
  isqcm?: boolean | null;
  responses?: Array<JsonLanguage>;
}

export interface QuestionSolo {
  image?: string;
  audio?: string;
  extra?: JsonLanguage;
  question: JsonLanguage;
  typequestion: "DEFAULT" | "ORDER" | "IMAGE" | "MAPPOSITION";
  time: number;
  difficulty: string;
  theme: Theme;
  isqcm: boolean;
  responses: Array<{
    label?: ResponseLanguageString;
    image?: string;
  }>;
  allresponse?: boolean;
  typeResponse: string;
  data: null | {
    code: string;
    map: string;
  };
}

export interface QuestionTraining {
  id: number;
  image?: string;
  audio?: string;
  extra?: JsonLanguage;
  question: JsonLanguage;
  typequestion: "DEFAULT" | "ORDER" | "IMAGE" | "MAPPOSITION";
  time: number;
  difficulty: string;
  theme: Theme;
  isqcm: boolean;
  responses: Array<{
    label?: ResponseLanguageString;
    image?: string;
  }>;
  response: number | ResponseLanguage;
  exact: boolean;
  typeResponse: string;
  allresponse: boolean;
  data: null | {
    code: string;
    map: string;
  };
}

export interface QuestionDuel {
  image?: string;
  audio?: string;
  extra?: JsonLanguage;
  question: JsonLanguage;
  typequestion: "DEFAULT" | "ORDER" | "IMAGE" | "MAPPOSITION";
  time: number;
  difficulty: string;
  theme: Theme;
  isqcm: boolean;
  responses: Array<{
    label?: ResponseLanguageString;
    image?: string;
  }>;
  data: null | {
    code: string;
    map: string;
  };
}
