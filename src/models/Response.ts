import { TypeDataEnum } from "./enum/TypeDataEnum";
import { ExtraSoloGame } from "./Game";

export interface Response {
  response: ResponseLanguage;
}

export interface ResponseQCM {
  label?: string;
  image?: string;
  extra?: ExtraResponse;
}

export interface ExtraResponse {
  value: string;
  type: TypeDataEnum;
  format: string;
  unit?: ResponseLanguageString;
}

export interface ResponseSolo {
  response: number | ResponseLanguage;
  result: boolean;
  points: number;
  answer: number | string;
  extra?: ExtraSoloGame;
}

export interface ResponseTraining {
  response: number | ResponseLanguage;
  result: boolean;
  answer: number | string;
}

export interface ResponseDuel {
  result: boolean;
  answerPlayer?: string | number;
  answer: string | number;
  time: number;
}
export interface ResponseLanguage {
  [iso: string]: Array<string> | string;
}

export interface ResponseLanguageString {
  [iso: string]: string;
}

export interface ResponseInsert {
  type: string;
  usvalue: string;
  value: ResponseLanguageString;
}

export interface ResponseUpdate {
  id: number;
  type: string;
  usvalue: string;
  value: ResponseLanguageString;
}

export interface ResponseImageInsert {
  type: string;
  usvalue: string;
  response: ResponseLanguageString;
  image: string;
}

export interface ResponseImageUpdate {
  id: number;
  type: string;
  usvalue: string;
  response: ResponseLanguageString;
  image: string;
}

export interface MyResponse {
  value: string | number;
  exact: boolean;
}
