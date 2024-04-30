import { JsonLanguage } from "./Language";

export interface Title {
  id: number;
  name: JsonLanguage;
}

export interface TitleProfile {
  id: number;
  profile: string;
  title: Title;
}
