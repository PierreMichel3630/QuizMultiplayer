import { Moment } from "moment";

export interface Response {
  response: {
    [iso: string]: Array<string> | string;
  };
  time: Date;
  date: Moment;
}
