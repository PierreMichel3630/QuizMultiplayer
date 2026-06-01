import { TypeDataEnum } from "./enum/TypeDataEnum";

export interface ExtraResponse {
  value: string;
  type: TypeDataEnum;
  format: string;
  unit?: ResponseLanguageString;
}

export interface ResponseDuelV2 {
  question: number;
  uuid: string;
  result: boolean;
  answer: string | number;
  time: number;
}

interface ResponseLanguageString {
  [iso: string]: string;
}
