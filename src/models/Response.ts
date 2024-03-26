/*export interface Response {
  response: ResponseLanguage;
  date: Moment;
  players: Array<{ uuid: string; username: string; time: number }>;
}*/

export interface Response {
  response: ResponseLanguage;
}

export interface ResponseSolo {
  response: ResponseLanguage;
  result: boolean;
  points: number;
  answer: string;
}

export interface ResponseDuel {
  uuid: string;
  result: boolean;
  time: number;
  answer: string;
}

export interface ResponseLanguage {
  [iso: string]: Array<string> | string;
}

export interface ResponseLanguageString {
  [iso: string]: string;
}
