import { DuelGame } from "./DuelGame";
import { SoloGame } from "./Game";
import { JsonLanguage } from "./Language";
import { Profile } from "./Profile";
import { Question } from "./Question";

export interface ReportMessage {
  id: number;
  message: JsonLanguage;
}

export interface Report {
  id: number;
  message: ReportMessage;
  question: Question | null;
  description: string;
  profile: Profile | null;
  sologame: SoloGame | null;
  duelgame: DuelGame | null;
  questionjson: any;
  created_at: Date;
  version: number;
}

export interface ReportInsert {
  message: number;
  question: number | null;
  description: string;
  profile: string | null;
  sologame: number | null;
  duelgame: number | null;
  questionjson: any;
  version: number;
}
