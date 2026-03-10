import { Language } from "./Language";
import { Profile } from "./Profile";

export enum OrderListScore {
  TIME = "rank_time",
  ATTEMPT = "rank_attempt",
}

export enum OrderList {
  DESC = "DESC",
  ASC = "ASC",
}

export enum TypeList {
  NUMBER = "NUMBER",
  IMAGE = "IMAGE",
  DATE = "DATE",
  TEXT = "TEXT",
}

export interface List {
  id: number;
  order: null | OrderList;
  elements: number
  type: TypeList;
  listtranslation: Array<ListTranslation>;
  format?: string;
}

export interface ListTranslation {
  id: number;
  language: Language;
  name: string;
  question: string;
  list: {
    id: number;
    elements: number;
  };
  created_at: Date;
}

export interface ListAnswer {
  id: number;
  image?: string;
  value: string;
  unit?: string;
  listanswertranslation: Array<ListAnswerTranslation>;
}

export interface ListAnswerTranslation {
  id: number;
  language: Language;
  name: string;
  othername: Array<string>;
}

export interface ListAnswerPlay extends ListAnswer {
  hasAnswer: boolean;
}

export interface ListScore {
  id: number;
  result: number;
  attempts_recordattempts: number;
  attempts_recordtime: number;
  time_recordattempts: number;
  time_recordtime: number;
  list: List
  finish: boolean;
}

export interface ResultScoreList {
  hasrecordattempts: boolean;
  hasrecordscore: boolean;
  hasrecordtime: boolean;
  listscore: ListScore;
  previouslistscore: ListScore | null;
}

export interface ListScoreWithRanking extends ListScore {
  rank: number;
  profile: Profile;
  rank_time: number;
  rank_attempt: number;
}
