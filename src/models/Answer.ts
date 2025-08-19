import { Language } from "./Language";
import { ExtraResponse } from "./Response";

export interface Answer {
  extra: ExtraResponse | undefined;
  id: number;
  image?: string;
  answertranslation: Array<AnswerTranslation>;
}

export interface AnswerTranslation {
  id: number;
  label: string;
  otherlabel: Array<string>;
  language: Language;
}
