/*export interface Response {
  response: ResponseLanguage;
  date: Moment;
  players: Array<{ uuid: string; username: string; time: number }>;
}*/

export interface Response {
  response: ResponseLanguage;
}

export interface ResponseSolo {
  response: number | ResponseLanguage;
  result: boolean;
  points: number;
  answer: number | string;
}

export interface ResponseTraining {
  response: number | ResponseLanguage;
  result: boolean;
  answer: number | string;
}

export interface ResponseDuel {
  uuid: string;
  result: boolean;
  time: number;
  answer: string | number;
  ptsplayer1: number;
  ptsplayer2: number;
}

export interface ResponseLanguage {
  [iso: string]: Array<string> | string;
}

export interface ResponseLanguageString {
  [iso: string]: string;
}
