import { Moment } from "moment";

export interface Response {
  response: {
    [iso: string]: Array<string> | string;
  };
  date: Moment;
  players: Array<{ uuid: string; username: string; time: number }>;
}
