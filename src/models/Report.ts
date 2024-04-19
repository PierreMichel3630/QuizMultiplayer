import { JsonLanguage } from "./Language";
import { Question } from "./Question";

export interface ReportMessage {
  id: number;
  message: JsonLanguage;
}

export interface Report {
  id: number;
  message: ReportMessage;
  question: Question;
  description: string;
}

export interface ReportInsert {
  message: number;
  question: number;
  description: string;
}
