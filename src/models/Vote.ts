import { JsonLanguage } from "./Language";

export interface VoteTheme {
  id: number;
  name: JsonLanguage;
  vote: number;
}

export interface VoteThemeInsert {
  name: JsonLanguage;
}
