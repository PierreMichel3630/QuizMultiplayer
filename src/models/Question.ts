import { Point } from "react-simple-maps";
import {
  JsonLanguage,
  JsonLanguageArray,
  JsonLanguageArrayOrString,
  Language,
} from "./Language";
import { ResponseQCM } from "./Response";
import { Theme } from "./Theme";
import { TypeQuestionEnum } from "./enum/TypeQuestionEnum";

export interface QuestionPropose {
  id: number;
  question: JsonLanguage;
  response: JsonLanguage;
  responses: Array<JsonLanguage>;
  difficulty: string;
}

export interface QuestionEnd {
  image?: string;
  question: JsonLanguage;
  difficulty: string;
  response: JsonLanguageArrayOrString;
}

export interface QuestionPosition {
  question: number;
  isRight: boolean;
  position?: number;
}

export interface QuestionAdmin {
  id: number;
  image?: string;
  audio?: string;
  typequestion: string;
  difficulty: string;
  isqcm: boolean | null;
  validate: boolean;
  questiontranslation: Array<QuestionTranslation>;
}

export interface QuestionTranslation {
  id: number;
  label: string;
  language: Language;
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

export interface Question {
  id: number;
  typequestion: TypeQuestionEnum;
  label: string;
  image?: string;
  extra?: JsonLanguage;
  audio?: string;
  isqcm: boolean;
  time: number;
  question?: JsonLanguage;
  theme: Theme;
  difficulty: string;
  typeResponse: string;
  answerset?: number;
  allresponse: boolean;
  exact: boolean;
  responses: Array<ResponseQCM>;
  data: null | {
    code: string;
    property: string;
    zoom: number;
    coordinates: Point;
  };
}

export interface QuestionResult extends Question {
  response: string | number;
  resultPlayer1?: boolean;
  responsePlayer1?: string | number;
  responsePlayer2?: string | number;
  resultPlayer2?: boolean;
}

export interface QuestionTraining extends Question {
  response: string;
}

export interface QuestionDuel extends Question {
  resultPlayer1?: boolean;
  responsePlayer1?: string;
  responsePlayer2?: string;
  resultPlayer2?: boolean;
}

export interface QuestionSolo extends Question {
  response: string;
  responsePlayer1?: string | number;
  resultPlayer1?: boolean;
}
